from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import relationship
from app.database import Base
from app.core.enums import EscrowStatus

class Escrow(Base):
    """
    Escrow Model representing funds locked for a specific Gig task.
    """
    __tablename__ = "escrows"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    gig_id = Column(Integer, ForeignKey("gigs.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    payer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    payee_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(SqlEnum(EscrowStatus), default=EscrowStatus.LOCKED, nullable=False, index=True)

    locked_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    released_at = Column(DateTime(timezone=True), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    gig = relationship("Gig", backref="escrow", uselist=False)
    payer = relationship("User", foreign_keys=[payer_id])
    payee = relationship("User", foreign_keys=[payee_id])

    def __repr__(self):
        return f"<Escrow(gig_id={self.gig_id}, amount={self.amount}, status='{self.status}')>"
