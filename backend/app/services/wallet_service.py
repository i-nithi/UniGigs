from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.wallet import Wallet

def get_or_create_wallet(db: Session, user_id: int) -> Wallet:
    """
    Retrieves a student's wallet or provisions a new wallet with initial simulated platform credits.
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if not wallet:
        wallet = Wallet(
            user_id=user_id,
            available_balance=Decimal("10000.00"),
            locked_balance=Decimal("0.00")
        )
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet


def get_wallet_with_lock(db: Session, user_id: int) -> Wallet:
    """
    Retrieves a student's wallet using row-level locking (SELECT ... FOR UPDATE) for safe atomic mutations.
    """
    wallet = get_or_create_wallet(db, user_id)
    # Lock row for atomic transaction
    return db.query(Wallet).filter(Wallet.id == wallet.id).with_for_update().first()
