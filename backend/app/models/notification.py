from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.database import Base
from app.core.enums import NotificationType

class Notification(Base):
    """
    Notification Model representing in-app persistent alerts sent to students.
    """
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SqlEnum(NotificationType), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False, nullable=False, index=True)

    related_gig_id = Column(Integer, ForeignKey("gigs.id", ondelete="SET NULL"), nullable=True, index=True)
    related_application_id = Column(Integer, ForeignKey("applications.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")
    gig = relationship("Gig", foreign_keys=[related_gig_id])
    application = relationship("Application", foreign_keys=[related_application_id])

    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type='{self.type}', is_read={self.is_read})>"
