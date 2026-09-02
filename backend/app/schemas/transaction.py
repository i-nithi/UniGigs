from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.enums import TransactionStatus, TransactionType

class TransactionGigSummary(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: int
    gig_id: Optional[int] = None
    transaction_type: TransactionType
    amount: float
    status: TransactionStatus
    description: Optional[str] = None
    created_at: datetime
    gig: Optional[TransactionGigSummary] = None

    class Config:
        from_attributes = True


class PaginatedTransactionResponse(BaseModel):
    items: list[TransactionResponse]
    page: int
    limit: int
    total: int
    total_pages: int
