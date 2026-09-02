from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.notification import NotificationListResponse, MarkNotificationReadResponse, NotificationResponse
from app.services.notification_service import get_user_notifications, mark_notification_as_read

router = APIRouter(
    prefix="/notifications",
    tags=["In-App Notifications"]
)


@router.get(
    "",
    response_model=NotificationListResponse,
    status_code=status.HTTP_200_OK,
    summary="Get authenticated student's notifications",
    description="Returns a paginated list of persistent in-app notifications for the authenticated student along with server-calculated total unread_count."
)
def list_notifications(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    unread_only: bool = Query(False, description="Filter for unread notifications only"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = get_user_notifications(
        db=db,
        user_id=current_user.id,
        unread_only=unread_only,
        page=page,
        limit=limit
    )
    return NotificationListResponse.model_validate(result)


@router.post(
    "/{notification_id}/read",
    response_model=MarkNotificationReadResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as read",
    description="Idempotently marks an unread notification belonging to the authenticated student as read."
)
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = mark_notification_as_read(
        db=db,
        notification_id=notification_id,
        current_user_id=current_user.id
    )
    return MarkNotificationReadResponse(
        message="Notification marked as read.",
        notification=NotificationResponse.model_validate(notification)
    )
