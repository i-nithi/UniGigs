from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.enums import ApplicationStatus
from app.schemas.gig import GigPosterSummary

class ApplicationCreateRequest(BaseModel):
    message: str = Field(..., min_length=5, max_length=1000)
    estimated_time: Optional[str] = Field("2 hours", max_length=100)
    relevant_skills_note: Optional[str] = Field(None, max_length=500)


class ApplicationResponse(BaseModel):
    id: int
    gig_id: int
    applicant_id: int
    message: str
    estimated_completion_time: Optional[str] = None
    status: ApplicationStatus
    created_at: datetime
    applicant: GigPosterSummary

    class Config:
        from_attributes = True
