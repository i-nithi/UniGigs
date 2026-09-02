from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.user import (
    CurrentUserProfileResponse,
    PublicUserProfileResponse,
    UserUpdateRequest
)
from app.services.user_service import get_user_by_id, update_user_profile

router = APIRouter(
    prefix="/users",
    tags=["User Profiles"]
)


@router.get(
    "/me",
    response_model=CurrentUserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current student's full private profile",
    description="Returns the full private profile of the currently logged-in student, including email and registration number."
)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return CurrentUserProfileResponse.model_validate(current_user)


@router.put(
    "/me",
    response_model=CurrentUserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current student's profile",
    description="Allows the authenticated student to update their name, department, year, bio, profile image, and skills."
)
def update_my_profile(
    update_data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = update_user_profile(db, current_user, update_data)
    return CurrentUserProfileResponse.model_validate(updated_user)


@router.get(
    "/{user_id}",
    response_model=PublicUserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get another student's public profile",
    description="Returns another student's public-safe profile. Email and registration number are strictly excluded for privacy."
)
def get_public_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_id(db, user_id)
    return PublicUserProfileResponse.model_validate(user)
