"""
MediaPipe Hand Landmark Detection Module
Extracts hand landmarks from video frames using MediaPipe Holistic
"""

import cv2
import mediapipe as mp
import numpy as np
import logging
from typing import Optional, List, Tuple

logger = logging.getLogger("SignLangAI.MediaPipe")


class HandLandmarkDetector:
    """Detects and extracts hand landmarks from video frames."""
    
    def __init__(self, static_image_mode: bool = False, max_num_hands: int = 1):
        """
        Initialize MediaPipe hand detector.
        
        Args:
            static_image_mode: If True, treats each frame independently
            max_num_hands: Maximum number of hands to detect (1 or 2)
        """
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils
        
    def detect(self, frame: np.ndarray) -> Tuple[Optional[List[List[float]]], float]:
        """
        Detect hand landmarks in a frame.
        
        Args:
            frame: BGR image frame from OpenCV
            
        Returns:
            Tuple of (landmarks, confidence) or (None, 0.0) if no hand detected
            - landmarks: List of 21 [x, y, z] coordinates (normalized 0-1)
            - confidence: Detection confidence score
        """
        if frame is None or frame.size == 0:
            logger.warning("Empty frame received")
            return None, 0.0
        
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(frame_rgb)
        
        if results.multi_hand_landmarks and len(results.multi_hand_landmarks) > 0:
            hand_landmarks = results.multi_hand_landmarks[0]
            
            # Extract landmarks: 21 points × (x, y, z)
            landmarks = [
                [lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark
            ]
            
            # Get confidence from handedness (0-1 scale)
            confidence = results.multi_handedness[0].score if results.multi_handedness else 0.0
            
            logger.debug(f"Hand detected with {len(landmarks)} landmarks, confidence: {confidence:.2f}")
            return landmarks, float(confidence)
        
        logger.debug("No hand detected in frame")
        return None, 0.0
    
    def draw_landmarks(self, frame: np.ndarray, landmarks: List[List[float]]) -> np.ndarray:
        """
        Draw hand landmarks on frame for visualization.
        
        Args:
            frame: BGR image frame from OpenCV
            landmarks: List of 21 [x, y, z] normalized coordinates
            
        Returns:
            Frame with drawn landmarks
        """
        if landmarks is None or len(landmarks) != 21:
            return frame
        
        height, width = frame.shape[:2]
        
        # Convert normalized coordinates to pixel coordinates
        points = []
        for x, y, z in landmarks:
            px = int(x * width)
            py = int(y * height)
            points.append((px, py))
        
        # Draw circles for each landmark
        for i, (px, py) in enumerate(points):
            cv2.circle(frame, (px, py), 3, (0, 255, 0), -1)
        
        # Draw connections between landmarks (MediaPipe hand skeleton)
        HAND_CONNECTIONS = [
            (0, 1), (1, 2), (2, 3), (3, 4),  # Thumb
            (0, 5), (5, 6), (6, 7), (7, 8),  # Index
            (0, 9), (9, 10), (10, 11), (11, 12),  # Middle
            (0, 13), (13, 14), (14, 15), (15, 16),  # Ring
            (0, 17), (17, 18), (18, 19), (19, 20),  # Pinky
            (5, 9), (9, 13), (13, 17)  # Palm
        ]
        
        for start, end in HAND_CONNECTIONS:
            x1, y1 = points[start]
            x2, y2 = points[end]
            cv2.line(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        
        return frame
    
    def close(self):
        """Clean up resources."""
        self.hands.close()
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()


class PoseLandmarkDetector:
    """Detects and extracts pose landmarks (full body) from video frames."""
    
    def __init__(self):
        """Initialize MediaPipe pose detector."""
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def detect(self, frame: np.ndarray) -> Tuple[Optional[List[List[float]]], float]:
        """
        Detect pose landmarks in a frame.
        
        Args:
            frame: BGR image frame from OpenCV
            
        Returns:
            Tuple of (landmarks, confidence) or (None, 0.0) if detection failed
            - landmarks: List of pose keypoints
            - confidence: Detection confidence
        """
        if frame is None or frame.size == 0:
            return None, 0.0
        
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(frame_rgb)
        
        if results.pose_landmarks:
            landmarks = [
                [lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark
            ]
            return landmarks, 0.85  # Pose detection confidence
        
        return None, 0.0
    
    def close(self):
        """Clean up resources."""
        self.pose.close()
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
