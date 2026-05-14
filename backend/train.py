"""
Training Script for Sign Language Gesture Classifier
Generates synthetic landmark data, trains, evaluates, and saves the model.
Replace generate_synthetic_data() with real dataset loading for production use.
"""

import numpy as np
import json
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.architecture import create_gesture_model
from app.services.translator import get_all_gestures

GESTURES = get_all_gestures()
NUM_CLASSES = len(GESTURES)
MODEL_DIR = "app/models"
MODEL_PATH = f"{MODEL_DIR}/gesture_model.keras"
HISTORY_PATH = f"{MODEL_DIR}/training_history.json"
LABELS_PATH = f"{MODEL_DIR}/gesture_labels.json"


def generate_synthetic_data(num_samples: int = 10000):
    """
    Generate synthetic 63-feature landmark data.
    In production: load real MediaPipe landmarks from your dataset.
    """
    print(f"Generating {num_samples} synthetic samples for {NUM_CLASSES} gesture classes...")
    X = np.random.randn(num_samples, 63).astype(np.float32)
    # Normalize to [0,1] range like real MediaPipe coordinates
    X = (X - X.min(axis=1, keepdims=True)) / (X.max(axis=1, keepdims=True) - X.min(axis=1, keepdims=True) + 1e-8)
    y = np.random.randint(0, NUM_CLASSES, num_samples)
    return X, y


def augment_data(X, y):
    """Apply simple augmentations: add small noise and scale jitter."""
    X_aug = X + np.random.normal(0, 0.02, X.shape).astype(np.float32)
    X_aug = np.clip(X_aug, 0, 1)
    return np.vstack([X, X_aug]), np.concatenate([y, y])


def train():
    os.makedirs(MODEL_DIR, exist_ok=True)

    # Save gesture labels for inference
    with open(LABELS_PATH, "w") as f:
        json.dump(GESTURES, f, ensure_ascii=False)
    print(f"Saved {NUM_CLASSES} gesture labels to {LABELS_PATH}")

    # Generate & augment data
    X, y = generate_synthetic_data(10000)
    X, y = augment_data(X, y)

    # Shuffle
    idx = np.random.permutation(len(X))
    X, y = X[idx], y[idx]

    # Train/val split (85/15)
    split = int(0.85 * len(X))
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    print(f"Train: {len(X_train)} | Val: {len(X_val)}")

    model = create_gesture_model(num_classes=NUM_CLASSES)
    model.summary()

    # Callbacks
    callbacks = [
        __import__('tensorflow').keras.callbacks.EarlyStopping(
            monitor='val_accuracy', patience=5, restore_best_weights=True
        ),
        __import__('tensorflow').keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss', factor=0.5, patience=3, verbose=1
        ),
    ]

    print("\n🚀 Starting training...")
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=64,
        validation_data=(X_val, y_val),
        callbacks=callbacks,
        verbose=1
    )

    # Evaluate
    loss, acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"\n✅ Final Validation Accuracy: {acc:.4f} | Loss: {loss:.4f}")

    # Save model
    model.save(MODEL_PATH)
    print(f"💾 Model saved → {MODEL_PATH}")

    # Save training history
    hist = {
        'accuracy': [round(v, 4) for v in history.history['accuracy']],
        'val_accuracy': [round(v, 4) for v in history.history['val_accuracy']],
        'loss': [round(v, 4) for v in history.history['loss']],
        'val_loss': [round(v, 4) for v in history.history['val_loss']],
        'final_accuracy': round(acc, 4),
        'final_loss': round(loss, 4),
        'num_classes': NUM_CLASSES,
        'num_epochs': len(history.history['accuracy']),
    }
    with open(HISTORY_PATH, "w") as f:
        json.dump(hist, f)
    print(f"📊 Training history saved → {HISTORY_PATH}")


if __name__ == "__main__":
    train()
