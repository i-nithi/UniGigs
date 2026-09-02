from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.payment import PaymentLockRequest, PaymentReleaseRequest, PaymentResponse
from app.schemas.wallet import WalletResponse
from app.services.escrow_service import lock_payment, release_payment

router = APIRouter(
    prefix="/payment",
    tags=["Simulated Escrow & Payments"]
)

@router.post(
    "/lock",
    response_model=PaymentResponse,
    status_code=status.HTTP_200_OK,
    summary="Lock Gig reward into simulated escrow (Gig Poster only)",
    description="Reserves the Gig's reward amount from the poster's available balance into locked escrow. Amount is strictly determined from Gig.reward_amount by the backend."
)
def lock_escrow_payment(
    lock_data: PaymentLockRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    escrow, wallet = lock_payment(db, lock_data.gig_id, current_user.id)
    return PaymentResponse(
        message="Payment locked in simulated escrow.",
        gig_id=lock_data.gig_id,
        escrow_status=escrow.status,
        amount=float(escrow.amount),
        is_simulated=True,
        wallet=WalletResponse.model_validate(wallet)
    )


@router.post(
    "/release",
    response_model=PaymentResponse,
    status_code=status.HTTP_200_OK,
    summary="Release simulated escrow payment (Gig Poster only)",
    description="Releases locked escrow funds directly into the selected worker's wallet balance upon Gig completion."
)
def release_escrow_payment(
    release_data: PaymentReleaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    escrow, wallet = release_payment(db, release_data.gig_id, current_user.id)
    return PaymentResponse(
        message="Payment released from simulated escrow to worker.",
        gig_id=release_data.gig_id,
        escrow_status=escrow.status,
        amount=float(escrow.amount),
        is_simulated=True,
        wallet=WalletResponse.model_validate(wallet)
    )
