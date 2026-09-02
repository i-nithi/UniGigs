from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey, Enum as SqlEnum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
from app.core.enums import ApplicationStatus

class Application(Base):
    """
    Application Model representing a student's proposal for a Gig.
    """
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    gig_id = Column(Integer, ForeignKey("gigs.id", ondelete="CASCADE"), nullable=False, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    estimated_completion_time = Column(String(100), nullable=True)
    status = Column(SqlEnum(ApplicationStatus), default=ApplicationStatus.PENDING, nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("gig_id", "applicant_id", name="uq_gig_applicant"),
    )

    # Relationships
    gig = relationship("Gig", back_populates="applications")
    applicant = relationship("User", back_populates="applications")

    def __repr__(self):
        return f"<Application(id={self.id}, gig_id={self.gig_id}, applicant_id={self.applicant_id}, status='{self.status}')>"
