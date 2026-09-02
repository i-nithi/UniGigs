from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.transaction import PaginatedTransactionResponse
from app.services.transaction_service import get_user_transactions

router = APIRouter(
    prefix="/transactions",
    tags=["Simulated Financial Transactions Audit Log"]
)

@router.get(
    "",
    response_model=PaginatedTransactionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user's transaction audit trail",
    description="Returns a paginated list of financial escrow locks, payouts, and refunds for the authenticated student."
)
def list_my_transactions(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = get_user_transactions(db, current_user.id, page=page, limit=limit)
    return PaginatedTransactionResponse.model_validate(result)
