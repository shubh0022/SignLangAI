import tensorflow as tf
from tensorflow.keras import layers, models

def create_gesture_model(num_classes: int = 30, input_shape: tuple = (63,)):
    """
    Sequential Dense Network for landmark-based gesture classification.
    Input: 21 landmarks × 3 coordinates (x,y,z) = 63 features
    """
    model = models.Sequential([
        layers.Input(shape=input_shape),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(64, activation='relu'),
        layers.Dropout(0.1),
        layers.Dense(num_classes, activation='softmax')
    ], name='gesture_classifier')

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model
