from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from app.core.enums import GigStatus

class GigCreateRequest(BaseModel):
    """
    Schema for posting a new campus Gig.
    poster_id is automatically assigned from the authenticated JWT token.
    """
    title: str = Field(..., min_length=5, max_length=150, description="Title of the task e.g. Design a Club Event Poster")
    description: str = Field(..., min_length=10, max_length=2000, description="Detailed explanation of requirements")
    category: str = Field(..., min_length=2, max_length=50, description="Gig category e.g. Design, Printing, Academic Help")
    reward_amount: float = Field(..., gt=0, le=100000, description="Reward amount in INR")
    location: str = Field(..., min_length=2, max_length=100, description="Campus location e.g. Central Library")
    estimated_duration: Optional[str] = Field("2 hours", max_length=50)
    deadline: Optional[datetime] = Field(None, description="Task completion deadline")
    required_skills: Optional[list[str]] = Field(default_factory=list, max_length=10)

    @field_validator("required_skills")
    @classmethod
    def validate_skills(cls, v: Optional[list[str]]) -> list[str]:
        if v is not None:
            clean_skills = []
            for s in v:
                skill_str = s.strip()
                if skill_str and len(skill_str) <= 50:
                    clean_skills.append(skill_str)
            return clean_skills
        return []


class GigUpdateRequest(BaseModel):
    """
    Schema for updating an existing Gig.
    Only the original poster can update their Gig.
    """
    title: Optional[str] = Field(None, min_length=5, max_length=150)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    reward_amount: Optional[float] = Field(None, gt=0, le=100000)
    location: Optional[str] = Field(None, min_length=2, max_length=100)
    estimated_duration: Optional[str] = Field(None, max_length=50)
    deadline: Optional[datetime] = None
    required_skills: Optional[list[str]] = None


class GigPosterSummary(BaseModel):
    """
    Public summary schema for a Gig poster (used in card listings).
    Strictly excludes email, registration_number, and hashed_password.
    """
    id: int
    name: str
    profile_image: Optional[str] = None
    average_rating: float
    is_verified: bool
    trust_score: int

    class Config:
        from_attributes = True


class GigPosterDetail(BaseModel):
    """
    Detailed public profile schema for a Gig poster (used in full Gig Details view).
    Strictly excludes email, registration_number, and hashed_password.
    """
    id: int
    name: str
    department: Optional[str] = None
    year: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[list[str]] = []
    average_rating: float
    completed_gigs_count: int
    trust_score: int
    is_verified: bool

    class Config:
        from_attributes = True


class GigListItemResponse(BaseModel):
    """
    Gig listing card response model.
    """
    id: int
    title: str
    category: str
    reward_amount: float
    location: str
    estimated_duration: Optional[str] = None
    deadline: Optional[datetime] = None
    required_skills: Optional[list[str]] = []
    status: GigStatus
    created_at: datetime
    poster: GigPosterSummary

    class Config:
        from_attributes = True


class GigDetailResponse(BaseModel):
    """
    Full Gig detail response model.
    """
    id: int
    title: str
    description: str
    category: str
    reward_amount: float
    location: str
    estimated_duration: Optional[str] = None
    deadline: Optional[datetime] = None
    required_skills: Optional[list[str]] = []
    status: GigStatus
    created_at: datetime
    updated_at: datetime
    poster: GigPosterDetail

    class Config:
        from_attributes = True


class PaginatedGigResponse(BaseModel):
    """
    Paginated Gig list wrapper containing list items and page metadata.
    """
    items: list[GigListItemResponse]
    page: int
    limit: int
    total: int
    total_pages: int
