from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.notification import Notification
from app.core.enums import NotificationType

def create_notification(
    db: Session,
    user_id: int,
    notification_type: NotificationType,
    title: str,
    message: str,
    related_gig_id: Optional[int] = None,
    related_application_id: Optional[int] = None
) -> Notification:
    """
    Centralized helper function for creating persistent in-app student notifications.
    Internal backend use only.
    """
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title.strip(),
        message=message.strip(),
        is_read=False,
        related_gig_id=related_gig_id,
        related_application_id=related_application_id,
        created_at=datetime.now(timezone.utc)
    )
    db.add(notification)
    return notification


def get_user_notifications(
    db: Session,
    user_id: int,
    unread_only: bool = False,
    page: int = 1,
    limit: int = 20
) -> dict:
    """
    Retrieves paginated notifications and total unread count for the authenticated student.
    """
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    # Unread count calculated on backend
    unread_count = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()

    if unread_only:
        query = query.filter(Notification.is_read == False)

    query = query.order_by(Notification.created_at.desc())

    total = query.count()
    limit = max(1, min(limit, 100))
    page = max(1, page)
    total_pages = (total + limit - 1) // limit if total > 0 else 1
    offset = (page - 1) * limit

    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "unread_count": unread_count,
        "total_pages": total_pages
    }


def mark_notification_as_read(
    db: Session,
    notification_id: int,
    current_user_id: int
) -> Notification:
    """
    Marks an unread notification as read idempotently.
    Authorization: Notification Owner ONLY.
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

    # Idempotent handling
    if not notification.is_read:
        notification.is_read = True
        notification.read_at = datetime.now(timezone.utc)
        db.add(notification)
        db.commit()
        db.refresh(notification)

    return notification
