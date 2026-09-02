from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserSignupRequest(BaseModel):
    """
    Schema for student signup request with SASTRA email validation.
    """
    name: str = Field(..., min_length=1, max_length=100, description="Full name of student")
    registration_number: str = Field(..., min_length=1, max_length=50, description="SASTRA registration number e.g. 124003189")
    email: str = Field(..., description="Official SASTRA student email address ending with @sastra.ac.in")
    password: str = Field(..., min_length=6, max_length=100, description="Secure account password")

    @field_validator("email")
    @classmethod
    def validate_sastra_email(cls, v: str) -> str:
        clean_email = v.strip().lower()
        if not clean_email.endswith("@sastra.ac.in"):
            raise ValueError("Only official SASTRA University student emails (@sastra.ac.in) are allowed.")
        return clean_email

    @field_validator("registration_number")
    @classmethod
    def validate_reg_num(cls, v: str) -> str:
        clean_reg = v.strip()
        if not clean_reg.isalnum():
            raise ValueError("Registration number must not contain spaces or special characters.")
        return clean_reg


class UserLoginRequest(BaseModel):
    """
    Schema for student login request.
    """
    email: str = Field(..., description="Official SASTRA student email address")
    password: str = Field(..., description="Account password")

    @field_validator("email")
    @classmethod
    def validate_sastra_email(cls, v: str) -> str:
        clean_email = v.strip().lower()
        if not clean_email.endswith("@sastra.ac.in"):
            raise ValueError("Only official SASTRA University student emails (@sastra.ac.in) are allowed.")
        return clean_email


class UserResponse(BaseModel):
    """
    Safe public/profile user representation. Hashed passwords and secrets are NEVER returned.
    """
    id: int
    name: str
    registration_number: str
    email: str
    department: Optional[str] = None
    year: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    is_verified: bool
    trust_score: int
    average_rating: float
    completed_gigs_count: int
    created_at: datetime

    class Config:
        from_attributes = True
