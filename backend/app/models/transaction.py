from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Numeric, String, Text, DateTime, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.database import Base
from app.core.enums import TransactionStatus, TransactionType

class Transaction(Base):
    """
    Transaction Model for simulated escrow payments, releases, and refunds audit trail.
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    gig_id = Column(Integer, ForeignKey("gigs.id", ondelete="SET NULL"), nullable=True, index=True)
    transaction_type = Column(SqlEnum(TransactionType), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(SqlEnum(TransactionStatus), default=TransactionStatus.COMPLETED, nullable=False, index=True)
    description = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    gig = relationship("Gig", back_populates="transactions")
    user = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<Transaction(id={self.id}, user_id={self.user_id}, amount={self.amount}, type='{self.transaction_type}', status='{self.status}')>"
