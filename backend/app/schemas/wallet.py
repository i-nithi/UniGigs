from datetime import datetime
from pydantic import BaseModel, Field

class WalletResponse(BaseModel):
    """
    Private wallet balance model for the authenticated student.
    """
    id: int
    user_id: int
    available_balance: float = Field(..., description="Available simulated platform credits in INR")
    locked_balance: float = Field(..., description="Simulated funds currently reserved in escrow")
    currency: str = "INR"
    is_simulated: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
