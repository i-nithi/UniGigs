from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Wallet(Base):
    """
    Wallet Model representing a student's simulated balance in platform credits.
    """
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    available_balance = Column(Numeric(12, 2), default=10000.00, nullable=False)
    locked_balance = Column(Numeric(12, 2), default=0.00, nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    user = relationship("User", backref="wallet", uselist=False)

    def __repr__(self):
        return f"<Wallet(user_id={self.user_id}, available={self.available_balance}, locked={self.locked_balance})>"
