from decimal import Decimal
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models.transaction import Transaction
from app.core.enums import TransactionStatus, TransactionType

def log_transaction(
    db: Session,
    user_id: int,
    gig_id: Optional[int],
    transaction_type: TransactionType,
    amount: Decimal,
    description: str
) -> Transaction:
    """
    Logs an immutable financial audit transaction record.
    """
    txn = Transaction(
        user_id=user_id,
        gig_id=gig_id,
        transaction_type=transaction_type,
        amount=amount,
        status=TransactionStatus.COMPLETED,
        description=description
    )
    db.add(txn)
    return txn


def get_user_transactions(
    db: Session,
    user_id: int,
    page: int = 1,
    limit: int = 20
) -> dict:
    """
    Returns a paginated audit trail of transactions for the specified user.
    """
    query = db.query(Transaction).options(joinedload(Transaction.gig)).filter(Transaction.user_id == user_id).order_by(Transaction.created_at.desc())
    
    total = query.count()
    limit = max(1, min(limit, 100))
    page = max(1, page)
    total_pages = (total + limit - 1) // limit if total > 0 else 1
    offset = (page - 1) * limit

    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }
