from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.enums import EscrowStatus
from app.schemas.wallet import WalletResponse

class PaymentLockRequest(BaseModel):
    """
    Request model for locking payment into simulated escrow.
    Amount is strictly derived by backend from Gig.reward_amount.
    """
    gig_id: int = Field(..., description="ID of the Gig to lock escrow funds for")


class PaymentReleaseRequest(BaseModel):
    """
    Request model for releasing simulated escrow payment.
    """
    gig_id: int = Field(..., description="ID of the Gig to release escrow funds for")


class PaymentResponse(BaseModel):
    """
    Response model for payment lock/release operations.
    """
    message: str
    gig_id: int
    escrow_status: EscrowStatus
    amount: float
    is_simulated: bool = True
    wallet: WalletResponse
