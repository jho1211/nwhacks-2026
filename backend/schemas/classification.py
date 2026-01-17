"""Pydantic schemas for classification API."""

from typing import Literal, Optional
from pydantic import BaseModel, Field


class ClassificationRequest(BaseModel):
    """Request body for classification endpoint."""
    
    image: str = Field(
        ...,
        description="Base64-encoded image data"
    )
    produce_type: Literal["avocado", "banana"] = Field(
        default="avocado",
        description="Type of produce to classify"
    )


class PredictionItem(BaseModel):
    """Individual prediction with class and confidence."""
    
    class_name: str = Field(..., description="Ripeness class name")
    class_label: str = Field(..., description="Human-readable label")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")


class ClassificationResponse(BaseModel):
    """Response from classification endpoint."""
    
    success: bool = Field(default=True)
    produce_type: str = Field(..., description="Type of produce classified")
    predicted_class: str = Field(..., description="Top predicted ripeness class")
    predicted_label: str = Field(..., description="Human-readable label")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Top prediction confidence")
    all_predictions: list[PredictionItem] = Field(
        default=[],
        description="All predictions sorted by confidence"
    )


class ErrorResponse(BaseModel):
    """Error response."""
    
    success: bool = Field(default=False)
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(default=None, description="Detailed error info")
