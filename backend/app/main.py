from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
import numpy as np
import json
import os
import time
import logging
from datetime import datetime
from typing import Optional, List

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
    landmarks: List[List[float]] = Field(..., min_items=21, max_items=21, description="21 hand landmarks [x, y, z]")
    language: str = Field("en", description="Output language: 'en', 'hi', or 'gu'")
    
    @validator('landmarks')
    def validate_landmarks(cls, v):
        for landmark in v:
            if len(landmark) < 2 or len(landmark) > 3:
                raise ValueError("Each landmark must have 2-3 coordinates (x, y, z)")
            if not all(-1.0 <= coord <= 1.0 for coord in landmark):
                raise ValueError("Landmark coordinates must be normalized (-1 to 1)")
        return v


class PredictionResponse(BaseModel):
    gesture: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    en: str
    hi: str
    gu: str
    timestamp: float
    predicted_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    model_loaded: bool
    num_gestures: int
    num_landmarks: int
    inference_backend: str


class TranslationResponse(BaseModel):
    gesture: str
    en: str
    hi: str
    gu: str


class HistoryResponse(BaseModel):
    total_predictions: int
    predictions: List[PredictionResponse]


class ConfidenceScoreResponse(BaseModel):
    gesture: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    is_reliable: bool = Field(description="True if confidence > 0.7")



# ─────────────────────────────────────────────────────────────────────────────
# Core inference helper
# ─────────────────────────────────────────────────────────────────────────────
def run_inference(landmarks_list: List[List[float]]) -> tuple[str, float]:
    """
    Run model inference on 21 landmarks and return (gesture, confidence).
    
    Args:
        landmarks_list: List of 21 [x, y, z] normalized hand landmarks
        
    Returns:
        Tuple of (gesture_name, confidence_score)
        
    Raises:
        ValueError: If landmarks count or format is invalid
    """
    global model, gesture_labels

    if len(landmarks_list) != 21:
        raise ValueError(f"Expected 21 landmarks, got {len(landmarks_list)}")

    flat = []
    for lm in landmarks_list:
        if len(lm) < 2:
            raise ValueError("Each landmark must have at least x, y coordinates")
        flat.extend([lm[0], lm[1], lm[2] if len(lm) > 2 else 0.0])

    if model is not None:
        try:
            inp = np.array([flat], dtype=np.float32)
            pred = model.predict(inp, verbose=0)[0]
            class_idx = int(np.argmax(pred))
            confidence = float(pred[class_idx])
            gesture = gesture_labels[class_idx] if class_idx < len(gesture_labels) else "Unknown"
        except Exception as e:
            logger.error(f"Inference error: {e}")
            raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")
    else:
        import random
        gesture = random.choice(gesture_labels)
        confidence = round(random.uniform(0.70, 0.99), 4)

    return gesture, round(confidence, 4)


# ─────────────────────────────────────────────────────────────────────────────
# REST Endpoints
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Status"])
def root():
    """Root endpoint - API status check."""
    return {
        "status": "online",
        "service": "SignLangAI API v2.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """
    Health check endpoint.
    Returns model status, gesture count, and inference backend info.
    """
    return HealthResponse(
        status="healthy" if model is not None else "degraded",
        timestamp=datetime.utcnow().isoformat(),
        model_loaded=model is not None,
        num_gestures=len(gesture_labels),
        num_landmarks=21,
        inference_backend="TensorFlow" if model is not None else "Random"
    )


@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict(payload: LandmarkPayload):
    """
    Predict gesture from hand landmarks.
    
    **Input**: 21 hand landmarks (x, y, z normalized coordinates)
    **Output**: Gesture name with confidence and multilingual translations
    
    **Example**:
    ```json
    {
      "landmarks": [[0.1, 0.2, 0.3], ..., [0.5, 0.6, 0.7]],
      "language": "en"
    }
    ```
    """
    try:
        gesture, confidence = run_inference(payload.landmarks)
        trans = translate(gesture)
        timestamp = time.time()
        
        result = {
            **trans,
            "confidence": confidence,
            "timestamp": timestamp,
            "predicted_at": datetime.utcnow().isoformat()
        }
        
        # Update in-memory cache
        prediction_log.append(result)
        if len(prediction_log) > 500:
            prediction_log.pop(0)
        
        # Async MongoDB persistence
        if prediction_collection is not None:
            try:
                mongo_doc = result.copy()
                mongo_doc["_id"] = f"{gesture}_{int(timestamp * 1000)}"
                await prediction_collection.insert_one(mongo_doc)
            except Exception as e:
                logger.warning(f"MongoDB logging skipped: {e}")
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")


@app.post("/api/translate", response_model=TranslationResponse, tags=["Translation"])
async def translate_gesture(gesture: str):
    """
    Get multilingual translations for a gesture.
    
    **Input**: Gesture name (e.g., "Hello", "Help")
    **Output**: Translations in English, Hindi, and Gujarati
    """
    if not gesture or not gesture.strip():
        raise HTTPException(status_code=400, detail="Gesture name cannot be empty")
    
    try:
        result = translate(gesture)
        return result
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail="Translation failed")


@app.get("/api/confidence/{gesture}", response_model=ConfidenceScoreResponse, tags=["Confidence"])
async def get_confidence_info(gesture: str):
    """
    Get confidence score metadata for a gesture.
    
    **Reliability threshold**: 0.7 (70%)
    """
    if gesture not in gesture_labels:
        raise HTTPException(
            status_code=404,
            detail=f"Gesture '{gesture}' not found. Available: {gesture_labels[:5]}..."
        )
    
    # For now, return template; in production, track average confidence per gesture
    return ConfidenceScoreResponse(
        gesture=gesture,
        confidence=0.85,
        is_reliable=True
    )


@app.get("/api/model/status", tags=["Model"])
def model_status():
    """Get model loading and performance status."""
    history = {}
    if os.path.exists(HISTORY_PATH):
        try:
            with open(HISTORY_PATH) as f:
                history = json.load(f)
        except Exception as e:
            logger.error(f"History load error: {e}")
    
    return {
        "isLoaded": model is not None,
        "modelPath": MODEL_PATH,
        "numClasses": len(gesture_labels),
        "finalAccuracy": history.get("final_accuracy"),
        "finalLoss": history.get("final_loss"),
        "numEpochs": history.get("num_epochs"),
        "backend": "TensorFlow/Keras"
    }


@app.get("/api/model/history", tags=["Model"])
def model_history():
    """Get full training history (losses, accuracies per epoch)."""
    if not os.path.exists(HISTORY_PATH):
        raise HTTPException(
            status_code=404,
            detail="Training history not found. Run train.py first."
        )
    try:
        with open(HISTORY_PATH) as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load history: {str(e)}")


@app.get("/api/gestures", tags=["Gestures"])
def list_gestures():
    """Get all available gestures and categories."""
    return {
        "gestures": gesture_labels,
        "total": len(gesture_labels),
        "categories": GESTURE_CATEGORIES,
    }


@app.get("/api/history", response_model=HistoryResponse, tags=["History"])
def get_history(limit: int = 50):
    """
    Get recent prediction history.
    
    **Query Parameters**:
    - limit: Number of recent predictions (default: 50, max: 500)
    """
    if limit > 500 or limit < 1:
        limit = 50
    
    recent = prediction_log[-limit:] if prediction_log else []
    
    return HistoryResponse(
        total_predictions=len(prediction_log),
        predictions=recent[::-1]  # Most recent first
    )


@app.delete("/api/history", tags=["History"])
def clear_history():
    """Clear all prediction history."""
    prediction_log.clear()
    return {
        "message": "History cleared",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/logs", tags=["Logs"])
def get_logs(limit: int = 50):
    """Get prediction logs (alias for /api/history)."""
    if limit > 500 or limit < 1:
        limit = 50
    return {"logs": prediction_log[-limit:][::-1]}


@app.delete("/api/logs", tags=["Logs"])
def clear_logs():
    """Clear prediction logs."""
    prediction_log.clear()
    return {"message": "Logs cleared"}



# ─────────────────────────────────────────────────────────────────────────────
# WebSocket for real-time streaming
# ─────────────────────────────────────────────────────────────────────────────
class ConnectionManager:
    """Manages WebSocket connections for real-time gesture prediction streaming."""
    
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        """Accept and register a WebSocket connection."""
        await ws.accept()
        self.active.append(ws)
        logger.info(f"🔌 WS connected. Total: {len(self.active)}")

    def disconnect(self, ws: WebSocket):
        """Unregister a WebSocket connection."""
        if ws in self.active:
            self.active.remove(ws)
        logger.info(f"🔌 WS disconnected. Total: {len(self.active)}")

    async def send(self, ws: WebSocket, data: dict):
        """Send JSON data to a specific WebSocket."""
        try:
            await ws.send_json(data)
        except Exception as e:
            logger.error(f"WS send error: {e}")

    async def broadcast(self, data: dict):
        """Broadcast JSON data to all connected clients."""
        disconnected = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception as e:
                logger.warning(f"Broadcast error, marking for removal: {e}")
                disconnected.append(ws)
        
        for ws in disconnected:
            self.disconnect(ws)


manager = ConnectionManager()


@app.websocket("/ws/predict")
async def ws_predict(websocket: WebSocket):
    """
    WebSocket endpoint for real-time gesture prediction streaming.
    
    **Message format (incoming)**:
    ```json
    {"landmarks": [[x, y, z], ..., [x, y, z]]}
    ```
    
    **Response format (outgoing)**:
    ```json
    {
      "gesture": "Hello",
      "confidence": 0.95,
      "en": "Hello",
      "hi": "नमस्ते",
      "gu": "હેલ્લો",
      "timestamp": 1234567890.123,
      "predicted_at": "2024-01-15T10:30:00"
    }
    ```
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            landmarks = data.get("landmarks", [])
            
            if not landmarks or len(landmarks) != 21:
                error_msg = {
                    "error": "Invalid landmarks",
                    "detail": f"Expected 21 landmarks, got {len(landmarks) if landmarks else 0}",
                    "timestamp": datetime.utcnow().isoformat()
                }
                await manager.send(websocket, error_msg)
                continue
            
            try:
                gesture, confidence = run_inference(landmarks)
                trans = translate(gesture)
                timestamp = time.time()
                
                result = {
                    **trans,
                    "confidence": confidence,
                    "timestamp": timestamp,
                    "predicted_at": datetime.utcnow().isoformat()
                }
                
                # Cache update
                prediction_log.append(result)
                if len(prediction_log) > 500:
                    prediction_log.pop(0)
                
                # Async MongoDB persistence
                if prediction_collection is not None:
                    try:
                        mongo_doc = result.copy()
                        mongo_doc["_id"] = f"{gesture}_{int(timestamp * 1000)}"
                        await prediction_collection.insert_one(mongo_doc)
                    except Exception as e:
                        logger.warning(f"MongoDB logging skipped: {e}")
                
                await manager.send(websocket, result)
            
            except ValueError as e:
                error_msg = {
                    "error": "Validation error",
                    "detail": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                }
                await manager.send(websocket, error_msg)
            except Exception as e:
                logger.error(f"WS prediction error: {e}")
                error_msg = {
                    "error": "Prediction failed",
                    "detail": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                }
                await manager.send(websocket, error_msg)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket disconnected cleanly")
    except Exception as e:
        logger.error(f"WS error: {e}")
        manager.disconnect(websocket)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")

