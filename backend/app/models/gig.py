from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum as SqlEnum, CheckConstraint, JSON
from sqlalchemy.orm import relationship
from app.database import Base
from app.core.enums import GigStatus

class Gig(Base):
    """
    Gig Model representing a campus task posted by a student.
    """
    __tablename__ = "gigs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), index=True, nullable=False)
    reward_amount = Column(Float, nullable=False)
    location = Column(String(100), nullable=False)
    estimated_duration = Column(String(50), nullable=True)
    deadline = Column(DateTime(timezone=True), nullable=True)
    required_skills = Column(JSON, default=list, nullable=True)
    status = Column(SqlEnum(GigStatus), default=GigStatus.OPEN, nullable=False, index=True)

    poster_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_worker_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint("reward_amount > 0", name="chk_positive_reward"),
    )

    # Relationships
    poster = relationship("User", foreign_keys=[poster_id], back_populates="posted_gigs")
    selected_worker = relationship("User", foreign_keys=[selected_worker_id], back_populates="assigned_gigs")
    
    applications = relationship("Application", back_populates="gig", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="gig")
    reviews = relationship("Review", back_populates="gig")

    def __repr__(self):
        return f"<Gig(id={self.id}, title='{self.title}', reward={self.reward_amount}, status='{self.status}')>"
