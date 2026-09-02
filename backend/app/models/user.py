import re
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, JSON
from sqlalchemy.orm import relationship, validates
from app.database import Base

class User(Base):
    """
    User Model representing a SASTRA University student.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    registration_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    year = Column(String(20), nullable=True)
    profile_image = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    skills = Column(JSON, default=list, nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    trust_score = Column(Integer, default=85, nullable=False)
    average_rating = Column(Float, default=5.0, nullable=False)
    completed_gigs_count = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships with explicit foreign_keys to resolve ambiguity
    posted_gigs = relationship(
        "Gig",
        foreign_keys="Gig.poster_id",
        back_populates="poster",
        cascade="all, delete-orphan"
    )
    assigned_gigs = relationship(
        "Gig",
        foreign_keys="Gig.selected_worker_id",
        back_populates="selected_worker"
    )
    applications = relationship(
        "Application",
        back_populates="applicant",
        cascade="all, delete-orphan"
    )
    transactions = relationship(
        "Transaction",
        foreign_keys="Transaction.user_id",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    reviews_given = relationship(
        "Review",
        foreign_keys="Review.reviewer_id",
        back_populates="reviewer"
    )
    reviews_received = relationship(
        "Review",
        foreign_keys="Review.reviewee_id",
        back_populates="reviewee"
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def validate_sastra_email(self, email: str) -> bool:
        """
        Validates whether the email matches registrationnumber@sastra.ac.in pattern.
        """
        pattern = r"^[a-zA-Z0-9]+@sastra\.ac\.in$"
        return bool(re.match(pattern, email.strip().lower()))

    def __repr__(self):
        return f"<User(id={self.id}, reg='{self.registration_number}', name='{self.name}')>"
