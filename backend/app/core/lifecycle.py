from fastapi import HTTPException, status
from app.core.enums import GigStatus

# Centralized mapping of allowed state transitions
ALLOWED_TRANSITIONS = {
    GigStatus.OPEN: {
        GigStatus.APPLICATIONS_OPEN,
        GigStatus.WORKER_SELECTED,
        GigStatus.CANCELLED
    },
    GigStatus.APPLICATIONS_OPEN: {
        GigStatus.WORKER_SELECTED,
        GigStatus.CANCELLED
    },
    GigStatus.WORKER_SELECTED: {
        GigStatus.IN_PROGRESS,
        GigStatus.CANCELLED
    },
    GigStatus.IN_PROGRESS: {
        GigStatus.WORK_SUBMITTED
    },
    GigStatus.WORK_SUBMITTED: {
        GigStatus.COMPLETED,
        GigStatus.DISPUTED
    },
    GigStatus.COMPLETED: set(),
    GigStatus.CANCELLED: set(),
    GigStatus.DISPUTED: set()
}

def validate_transition(current_status: GigStatus, target_status: GigStatus) -> None:
    """
    Validates if transitioning from current_status to target_status is permitted by the state machine.
    Raises HTTP 400 Bad Request or HTTP 409 Conflict if transition is illegal.
    """
    if current_status == target_status:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Gig is already in {current_status.value} status."
        )

    allowed_targets = ALLOWED_TRANSITIONS.get(current_status, set())
    if target_status not in allowed_targets:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from '{current_status.value}' to '{target_status.value}'."
        )
