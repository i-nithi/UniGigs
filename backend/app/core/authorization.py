from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.models.application import Application
from app.models.notification import Notification

def require_gig_owner(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Verifies that the Gig exists and belongs to current_user_id.
    Raises 404 if Gig not found, 403 Forbidden if user is not the poster.
    """
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found."
        )
    if gig.poster_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access or modify this gig."
        )
    return gig


def require_selected_worker(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Verifies that the Gig exists and current_user_id is the selected worker.
    Raises 404 if Gig not found, 403 Forbidden if user is not the assigned worker.
    """
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found."
        )
    if gig.selected_worker_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the selected worker can perform this action on the gig."
        )
    return gig


def require_application_owner(db: Session, application_id: int, current_user_id: int) -> Application:
    """
    Verifies that the Application exists and belongs to current_user_id.
    Raises 404 if Application not found, 403 Forbidden if user is not the applicant.
    """
    app_obj = db.query(Application).filter(Application.id == application_id).first()
    if not app_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found."
        )
    if app_obj.applicant_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this application."
        )
    return app_obj


def require_notification_owner(db: Session, notification_id: int, current_user_id: int) -> Notification:
    """
    Verifies that the Notification exists and belongs to current_user_id.
    Raises 404 if Notification not found, 403 Forbidden if user is not the notification owner.
    """
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found."
        )
    if notification.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this notification."
        )
    return notification
