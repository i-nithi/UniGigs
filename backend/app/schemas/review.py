from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class ReviewCreateRequest(BaseModel):
    """
    Schema for creating a review for a completed Gig.
    """
    gig_id: int = Field(..., description="ID of the completed Gig")
    reviewee_id: int = Field(..., description="ID of student being reviewed")
    rating: int = Field(..., ge=1, le=5, description="Star rating between 1 and 5")
    comment: Optional[str] = Field(None, max_length=1000, description="Optional review comment")

    @field_validator("comment")
    @classmethod
    def clean_comment(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.strip() or None
        return v


class ReviewResponse(BaseModel):
    """
    Response model for a review.
    """
    id: int
    gig_id: int
    reviewer_id: int
    reviewee_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
