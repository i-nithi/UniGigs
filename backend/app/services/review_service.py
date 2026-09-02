from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.models.review import Review
from app.models.user import User
from app.core.enums import GigStatus, NotificationType
from app.schemas.review import ReviewCreateRequest
from app.services.notification_service import create_notification

def create_review(db: Session, reviewer_id: int, create_data: ReviewCreateRequest) -> Review:
    """
    Creates a new review for a completed Gig with strict participation and duplicate protection.
    Authorization: Only Gig Poster or Selected Worker can submit a review.
    """
    gig = db.query(Gig).filter(Gig.id == create_data.gig_id).first()
    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found."
        )

    if gig.status != GigStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reviews can only be submitted for completed gigs."
        )

    # Participation verification
    is_poster = (gig.poster_id == reviewer_id)
    is_worker = (gig.selected_worker_id == reviewer_id)

    if not is_poster and not is_worker:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review gigs you participated in as poster or worker."
        )

    # Reviewee verification
    expected_reviewee_id = gig.selected_worker_id if is_poster else gig.poster_id
    if create_data.reviewee_id != expected_reviewee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reviewee for this gig."
        )

    if reviewer_id == create_data.reviewee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot review yourself."
        )

    # Duplicate review check
    existing = db.query(Review).filter(
        Review.gig_id == gig.id,
        Review.reviewer_id == reviewer_id,
        Review.reviewee_id == create_data.reviewee_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already submitted a review for this gig."
        )

    review = Review(
        gig_id=gig.id,
        reviewer_id=reviewer_id,
        reviewee_id=create_data.reviewee_id,
        rating=create_data.rating,
        comment=create_data.comment.strip() if create_data.comment else None,
        created_at=datetime.now(timezone.utc)
    )

    db.add(review)

    # Recalculate average rating & trust score for reviewee
    reviewee = db.query(User).filter(User.id == create_data.reviewee_id).first()
    if reviewee:
        reviews_received = db.query(Review).filter(Review.reviewee_id == reviewee.id).all()
        ratings = [r.rating for r in reviews_received] + [create_data.rating]
        avg = sum(ratings) / len(ratings)
        reviewee.average_rating = round(avg, 2)
        
        # Calculate dynamic trust score (85 base + completed gigs * 2 + rating boost)
        base_score = 85
        gig_boost = min(15, (reviewee.completed_gigs_count or 0) * 2)
        rating_boost = min(10, int((avg - 3.0) * 5)) if avg >= 3.0 else 0
        reviewee.trust_score = min(100, max(50, base_score + gig_boost + rating_boost))
        db.add(reviewee)

    # Notify reviewee
    reviewer_user = db.query(User).filter(User.id == reviewer_id).first()
    reviewer_name = reviewer_user.name if reviewer_user else "A student"

    create_notification(
        db=db,
        user_id=create_data.reviewee_id,
        notification_type=NotificationType.REVIEW_RECEIVED,
        title="New Review Received",
        message=f"{reviewer_name} left a {create_data.rating}-star review for '{gig.title[:30]}'",
        related_gig_id=gig.id
    )

    db.commit()
    db.refresh(review)
    return review


def get_user_reviews(db: Session, user_id: int) -> list[Review]:
    """
    Retrieves all reviews received by a student.
    """
    return db.query(Review).filter(Review.reviewee_id == user_id).order_by(Review.created_at.desc()).all()
