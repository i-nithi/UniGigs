from pydantic import BaseModel, Field, field_validator
from app.schemas.user import UserResponse

class TokenResponse(BaseModel):
    """
    Response schema containing Bearer JWT token and safe student profile.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RequestOTPRequest(BaseModel):
    """
    Schema for requesting a 6-digit verification OTP email.
    """
    email: str = Field(..., description="Official SASTRA student email address")

    @field_validator("email")
    @classmethod
    def validate_sastra_email(cls, v: str) -> str:
        clean_email = v.strip().lower()
        if not clean_email.endswith("@sastra.ac.in"):
            raise ValueError("Only official SASTRA University student emails (@sastra.ac.in) are allowed.")
        return clean_email


class RequestOTPResponse(BaseModel):
    """
    Response schema when OTP email delivery succeeds.
    """
    message: str
    email: str
    expires_in_seconds: int = 300


class VerifyOTPRequest(BaseModel):
    """
    Schema for verifying a received 6-digit OTP code.
    """
    email: str = Field(..., description="Official SASTRA student email address")
    otp_code: str = Field(..., min_length=6, max_length=6, description="6-digit verification code")

    @field_validator("email")
    @classmethod
    def validate_sastra_email(cls, v: str) -> str:
        clean_email = v.strip().lower()
        if not clean_email.endswith("@sastra.ac.in"):
            raise ValueError("Only official SASTRA University student emails (@sastra.ac.in) are allowed.")
        return clean_email

    @field_validator("otp_code")
    @classmethod
    def validate_otp_digits(cls, v: str) -> str:
        clean_code = v.strip()
        if not clean_code.isdigit():
            raise ValueError("OTP code must consist of 6 numeric digits.")
        return clean_code


class VerifyOTPResponse(BaseModel):
    """
    Response schema when OTP code verification succeeds.
    """
    message: str
    verified: bool = True
