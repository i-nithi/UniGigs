from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.wallet import WalletResponse
from app.services.wallet_service import get_or_create_wallet

router = APIRouter(
    prefix="/wallet",
    tags=["Simulated Student Wallet"]
)

@router.get(
    "",
    response_model=WalletResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user's private simulated wallet",
    description="Returns the authenticated student's private wallet balance in simulated platform credits (INR)."
)
def get_my_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wallet = get_or_create_wallet(db, current_user.id)
    return WalletResponse.model_validate(wallet)
