from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.models.escrow import Escrow
from app.models.wallet import Wallet
from app.core.enums import EscrowStatus, TransactionType, GigStatus
from app.services.wallet_service import get_or_create_wallet, get_wallet_with_lock
from app.services.transaction_service import log_transaction
from app.services.gig_service import get_gig_by_id

def lock_payment(db: Session, gig_id: int, poster_id: int) -> tuple[Escrow, Wallet]:
    """
    Locks Gig.reward_amount from Poster's available wallet balance into simulated escrow.
    Amount is strictly determined by backend from Gig.reward_amount.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.poster_id != poster_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the gig poster can lock payment in escrow."
        )

    if not gig.selected_worker_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A worker must be selected before locking payment into escrow."
        )

    # Check for existing active escrow
    existing_escrow = db.query(Escrow).filter(Escrow.gig_id == gig.id).first()
    if existing_escrow and existing_escrow.status == EscrowStatus.LOCKED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment has already been locked in escrow for this gig."
        )

    reward_decimal = Decimal(str(round(gig.reward_amount, 2)))
    if reward_decimal <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid gig reward amount."
        )

    # Row-level lock on poster wallet for atomic deduction
    poster_wallet = get_wallet_with_lock(db, poster_id)
    if poster_wallet.available_balance < reward_decimal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient simulated wallet balance. You have ₹{poster_wallet.available_balance:.2f} available, but ₹{reward_decimal:.2f} is required."
        )

    # Deduct available balance and add to locked balance
    poster_wallet.available_balance -= reward_decimal
    poster_wallet.locked_balance += reward_decimal
    poster_wallet.updated_at = datetime.now(timezone.utc)

    # Create Escrow record
    if existing_escrow:
        escrow = existing_escrow
        escrow.payer_id = poster_id
        escrow.payee_id = gig.selected_worker_id
        escrow.amount = reward_decimal
        escrow.status = EscrowStatus.LOCKED
        escrow.locked_at = datetime.now(timezone.utc)
    else:
        escrow = Escrow(
            gig_id=gig.id,
            payer_id=poster_id,
            payee_id=gig.selected_worker_id,
            amount=reward_decimal,
            status=EscrowStatus.LOCKED,
            locked_at=datetime.now(timezone.utc)
        )
        db.add(escrow)

    # Create audit log transaction
    log_transaction(
        db=db,
        user_id=poster_id,
        gig_id=gig.id,
        transaction_type=TransactionType.ESCROW_LOCK,
        amount=reward_decimal,
        description=f"Locked ₹{reward_decimal:.2f} into simulated escrow for '{gig.title[:30]}'"
    )

    db.commit()
    db.refresh(poster_wallet)
    db.refresh(escrow)

    return escrow, poster_wallet


def release_payment(db: Session, gig_id: int, poster_id: int) -> tuple[Escrow, Wallet]:
    """
    Releases locked escrow payment to the Selected Worker upon Gig completion.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.poster_id != poster_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the gig poster can release payment."
        )

    escrow = db.query(Escrow).filter(Escrow.gig_id == gig.id).first()
    if not escrow or escrow.status != EscrowStatus.LOCKED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No locked escrow funds exist to release for this gig."
        )

    # Row-level lock on poster and worker wallets
    poster_wallet = get_wallet_with_lock(db, poster_id)
    worker_wallet = get_wallet_with_lock(db, escrow.payee_id)

    amount = escrow.amount

    # Update balances
    poster_wallet.locked_balance = max(Decimal("0.00"), poster_wallet.locked_balance - amount)
    worker_wallet.available_balance += amount

    poster_wallet.updated_at = datetime.now(timezone.utc)
    worker_wallet.updated_at = datetime.now(timezone.utc)

    escrow.status = EscrowStatus.RELEASED
    escrow.released_at = datetime.now(timezone.utc)

    # Create audit log transaction for worker payout
    log_transaction(
        db=db,
        user_id=escrow.payee_id,
        gig_id=gig.id,
        transaction_type=TransactionType.ESCROW_RELEASE,
        amount=amount,
        description=f"Received ₹{amount:.2f} payout for completing '{gig.title[:30]}'"
    )

    db.commit()
    db.refresh(poster_wallet)
    db.refresh(escrow)

    return escrow, poster_wallet


def refund_payment(db: Session, gig_id: int, poster_id: int) -> Optional[Escrow]:
    """
    Refunds locked escrow funds back to Poster's available wallet balance upon Gig cancellation.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.poster_id != poster_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the gig poster can refund payment."
        )

    escrow = db.query(Escrow).filter(Escrow.gig_id == gig.id).first()
    if not escrow or escrow.status != EscrowStatus.LOCKED:
        return None

    poster_wallet = get_wallet_with_lock(db, poster_id)
    amount = escrow.amount

    poster_wallet.locked_balance = max(Decimal("0.00"), poster_wallet.locked_balance - amount)
    poster_wallet.available_balance += amount
    poster_wallet.updated_at = datetime.now(timezone.utc)

    escrow.status = EscrowStatus.REFUNDED
    escrow.refunded_at = datetime.now(timezone.utc)

    log_transaction(
        db=db,
        user_id=poster_id,
        gig_id=gig.id,
        transaction_type=TransactionType.ESCROW_REFUND,
        amount=amount,
        description=f"Refunded ₹{amount:.2f} from simulated escrow for cancelled '{gig.title[:30]}'"
    )

    db.commit()
    db.refresh(poster_wallet)
    db.refresh(escrow)

    return escrow
