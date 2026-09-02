from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.review import ReviewCreateRequest, ReviewResponse
from app.services.review_service import create_review, get_user_reviews

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews & Ratings"]
)


@router.post(
    "",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a review for a completed Gig",
    description="Allows a participant (poster or worker) to review their counterpart after gig completion. Prevents duplicate reviews."
)
def submit_review(
    review_data: ReviewCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_review(
        db=db,
        reviewer_id=current_user.id,
        create_data=review_data
    )


@router.get(
    "/user/{user_id}",
    response_model=list[ReviewResponse],
    status_code=status.HTTP_200_OK,
    summary="Get reviews received by a student"
)
def list_user_reviews(
    user_id: int,
    db: Session = Depends(get_db)
):
    return get_user_reviews(db=db, user_id=user_id)
