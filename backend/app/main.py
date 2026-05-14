from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
import os
import time
import logging

from app.services.translator import translate, get_all_gestures, GESTURE_CATEGORIES
from app.database import engine, Base, prediction_collection
import asyncio

# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SignLangAI")

app = FastAPI(
    title="SignLangAI — Sign Language Recognition API",
    description="Production-grade multilingual sign language recognition backend.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Model State
# ─────────────────────────────────────────────────────────────────────────────
MODEL_PATH = "app/models/gesture_model.keras"
HISTORY_PATH = "app/models/training_history.json"
LABELS_PATH = "app/models/gesture_labels.json"

model = None
gesture_labels: list[str] = get_all_gestures()
prediction_log: list[dict] = []


@app.on_event("startup")
async def startup_event():
    global model, gesture_labels
    
    # Initialize MySQL Tables (Creates database schema in MySQL Workbench)
    if engine is not None:
        try:
            # Import models so they are registered with Base before create_all
            from app.models.user import User
            
            # We run this sync in async context because startup is fine, 
            # or just rely on SQLAlchemy's sync engine
            Base.metadata.create_all(bind=engine)
            logger.info("✅ MySQL tables initialized via SQLAlchemy.")
        except Exception as e:
            logger.error(f"❌ Could not connect to MySQL: {e}. Please ensure MySQL is running.")
    # Load labels
    if os.path.exists(LABELS_PATH):
        with open(LABELS_PATH) as f:
            gesture_labels = json.load(f)
        logger.info(f"Loaded {len(gesture_labels)} gesture labels")

    # Load model
    if os.path.exists(MODEL_PATH):
        try:
            import tensorflow as tf
            model = tf.keras.models.load_model(MODEL_PATH)
            logger.info(f"✅ Model loaded: {MODEL_PATH}")
        except Exception as e:
            logger.error(f"❌ Model load failed: {e}")
    else:
        logger.warning("⚠️  No trained model found — using random fallback. Run train.py first.")


# ─────────────────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────────────────
class LandmarkPayload(BaseModel):
    landmarks: list[list[float]]   # 21 points × [x, y, z]
    language: str = "en"           # Preferred output language


class PredictionResponse(BaseModel):
    gesture: str
    confidence: float
    en: str
    hi: str
    gu: str
    timestamp: float


# ─────────────────────────────────────────────────────────────────────────────
# Core inference helper
# ─────────────────────────────────────────────────────────────────────────────
def run_inference(landmarks_list: list[list[float]]) -> tuple[str, float]:
    """Run model inference on 21 landmarks and return (gesture, confidence)."""
    global model, gesture_labels

    if len(landmarks_list) != 21:
        raise ValueError("Expected 21 landmarks")

    flat = []
    for lm in landmarks_list:
        flat.extend([lm[0], lm[1], lm[2] if len(lm) > 2 else 0.0])

    if model is not None:
        inp = np.array([flat], dtype=np.float32)
        pred = model.predict(inp, verbose=0)[0]
        class_idx = int(np.argmax(pred))
        confidence = float(pred[class_idx])
        gesture = gesture_labels[class_idx] if class_idx < len(gesture_labels) else "Unknown"
    else:
        import random
        gesture = random.choice(gesture_labels)
        confidence = round(random.uniform(0.70, 0.99), 4)

    return gesture, round(confidence, 4)


# ─────────────────────────────────────────────────────────────────────────────
# REST Endpoints
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "online", "service": "SignLangAI API v2.0"}


@app.post("/api/predict", response_model=PredictionResponse)
async def predict(payload: LandmarkPayload):
    gesture, confidence = run_inference(payload.landmarks)
    trans = translate(gesture)
    result = {**trans, "confidence": confidence, "timestamp": time.time()}
    prediction_log.append(result)
    if len(prediction_log) > 500:
        prediction_log.pop(0)
        
    # Save log to MongoDB asynchronously
    if prediction_collection is not None:
        try:
            mongo_doc = result.copy()
            await prediction_collection.insert_one(mongo_doc)
        except Exception as e:
            logger.error(f"MongoDB insert error: {e}")
            
    return result


@app.get("/api/model/status")
def model_status():
    history = {}
    if os.path.exists(HISTORY_PATH):
        with open(HISTORY_PATH) as f:
            history = json.load(f)
    return {
        "isLoaded": model is not None,
        "modelPath": MODEL_PATH,
        "numClasses": len(gesture_labels),
        "finalAccuracy": history.get("final_accuracy", None),
        "finalLoss": history.get("final_loss", None),
        "numEpochs": history.get("num_epochs", None),
    }


@app.get("/api/model/history")
def model_history():
    if not os.path.exists(HISTORY_PATH):
        raise HTTPException(status_code=404, detail="Training history not found. Run train.py first.")
    with open(HISTORY_PATH) as f:
        return json.load(f)


@app.get("/api/gestures")
def list_gestures():
    return {
        "gestures": gesture_labels,
        "total": len(gesture_labels),
        "categories": GESTURE_CATEGORIES,
    }


@app.get("/api/logs")
def get_logs(limit: int = 50):
    return {"logs": prediction_log[-limit:][::-1]}


@app.delete("/api/logs")
def clear_logs():
    prediction_log.clear()
    return {"message": "Logs cleared"}


# ─────────────────────────────────────────────────────────────────────────────
# WebSocket for real-time streaming
# ─────────────────────────────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)
        logger.info(f"WS connected. Total: {len(self.active)}")

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)
        logger.info(f"WS disconnected. Total: {len(self.active)}")

    async def send(self, ws: WebSocket, data: dict):
        await ws.send_json(data)


manager = ConnectionManager()


@app.websocket("/ws/predict")
async def ws_predict(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            landmarks = data.get("landmarks", [])
            if not landmarks or len(landmarks) != 21:
                await manager.send(websocket, {"error": "Invalid landmarks"})
                continue
            gesture, confidence = run_inference(landmarks)
            trans = translate(gesture)
            result = {**trans, "confidence": confidence, "timestamp": time.time()}
            prediction_log.append(result)
            if len(prediction_log) > 500:
                prediction_log.pop(0)
                
            # Save log to MongoDB asynchronously
            if prediction_collection is not None:
                try:
                    mongo_doc = result.copy()
                    await prediction_collection.insert_one(mongo_doc)
                except Exception as e:
                    logger.error(f"MongoDB insert error: {e}")
                    
            await manager.send(websocket, result)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WS error: {e}")
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
