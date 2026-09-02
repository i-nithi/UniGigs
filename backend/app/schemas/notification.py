from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.enums import NotificationType

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: NotificationType
    title: str
    message: str
    is_read: bool
    related_gig_id: Optional[int] = None
    related_application_id: Optional[int] = None
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    items: list[NotificationResponse]
    page: int
    limit: int
    total: int
    unread_count: int
    total_pages: int


class MarkNotificationReadResponse(BaseModel):
    message: str
    notification: NotificationResponse
