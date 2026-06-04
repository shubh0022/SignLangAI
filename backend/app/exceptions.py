"""
Custom exception handling and error responses for SignLangAI API
"""

from fastapi import HTTPException, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import logging

logger = logging.getLogger("SignLangAI.Exceptions")


class ErrorResponse(BaseModel):
    """Standardized error response format."""
    error: str
    detail: str
    status_code: int
    timestamp: str


class LandmarkValidationError(HTTPException):
    """Raised when landmark data is invalid."""
    
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )
        logger.warning(f"Landmark validation error: {detail}")


class ModelNotLoadedError(HTTPException):
    """Raised when model is not loaded or available."""
    
    def __init__(self):
        detail = "Model not loaded. Please ensure model file exists and training is complete."
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail
        )
        logger.error("Model not available")


class InferenceError(HTTPException):
    """Raised when inference fails."""
    
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failed: {detail}"
        )
        logger.error(f"Inference error: {detail}")


class GestureNotFoundError(HTTPException):
    """Raised when gesture is not recognized."""
    
    def __init__(self, gesture: str, available: list = None):
        detail = f"Gesture '{gesture}' not found."
        if available:
            detail += f" Available: {', '.join(available[:5])}"
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )
        logger.warning(f"Gesture not found: {gesture}")


class DatabaseError(HTTPException):
    """Raised when database operation fails."""
    
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {detail}"
        )
        logger.error(f"Database error: {detail}")


async def log_error(error: Exception, context: str = ""):
    """Log error with context information."""
    timestamp = datetime.utcnow().isoformat()
    message = f"[{timestamp}] {context}: {str(error)}"
    logger.error(message)
