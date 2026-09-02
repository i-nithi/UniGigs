from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserResponse

class TokenResponse(BaseModel):
    """
    Schema returned upon successful authentication containing JWT access token and user info.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """
    Decoded JWT token payload schema.
    """
    user_id: Optional[int] = None
