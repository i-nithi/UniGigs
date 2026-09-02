from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserUpdateRequest

def get_user_by_id(db: Session, user_id: int) -> User:
    """
    Retrieves a student user by their ID or raises HTTP 404 Not Found.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    return user


def update_user_profile(db: Session, user: User, update_data: UserUpdateRequest) -> User:
    """
    Selectively updates editable profile attributes of the authenticated student.
    Protected fields (email, registration_number, trust_score, etc.) CANNOT be modified via this service.
    """
    update_dict = update_data.model_dump(exclude_unset=True)

    # Allowed editable profile fields
    allowed_fields = {"name", "department", "year", "profile_image", "bio", "skills"}

    for field, value in update_dict.items():
        if field in allowed_fields and value is not None:
            setattr(user, field, value)

    user.updated_at = datetime.now(timezone.utc)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
