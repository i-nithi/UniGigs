from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.models.application import Application
from app.core.enums import GigStatus, ApplicationStatus, EscrowStatus, NotificationType
from app.core.lifecycle import validate_transition
from app.schemas.gig import WorkSubmissionRequest
from app.services.gig_service import get_gig_by_id
from app.services.notification_service import create_notification

def start_work(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Transitions Gig status from WORKER_SELECTED to IN_PROGRESS.
    Authorization: Selected Worker ONLY.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.selected_worker_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the selected worker can start work on this gig."
        )

    validate_transition(gig.status, GigStatus.IN_PROGRESS)

    gig.status = GigStatus.IN_PROGRESS
    gig.updated_at = datetime.now(timezone.utc)
    
    # Notify poster that work has started
    worker_name = gig.selected_worker.name if gig.selected_worker else "Worker"
    create_notification(
        db=db,
        user_id=gig.poster_id,
        notification_type=NotificationType.GIG_STARTED,
        title="Work Started",
        message=f"{worker_name} has started working on '{gig.title[:30]}'",
        related_gig_id=gig.id
    )

    db.add(gig)
    db.commit()
    db.refresh(gig)
    
    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()


def submit_work(db: Session, gig_id: int, current_user_id: int, submission_data: WorkSubmissionRequest) -> Gig:
    """
    Transitions Gig status from IN_PROGRESS to WORK_SUBMITTED and records submission metadata.
    Authorization: Selected Worker ONLY.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.selected_worker_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the selected worker can submit work for this gig."
        )

    validate_transition(gig.status, GigStatus.WORK_SUBMITTED)

    gig.submission_note = submission_data.submission_note.strip() if submission_data.submission_note else None
    gig.submission_link = submission_data.submission_link.strip() if submission_data.submission_link else None
    gig.submitted_at = datetime.now(timezone.utc)
    gig.status = GigStatus.WORK_SUBMITTED
    gig.updated_at = datetime.now(timezone.utc)

    # Notify poster that work has been submitted
    worker_name = gig.selected_worker.name if gig.selected_worker else "Worker"
    create_notification(
        db=db,
        user_id=gig.poster_id,
        notification_type=NotificationType.WORK_SUBMITTED,
        title="Work Submitted",
        message=f"{worker_name} submitted work for '{gig.title[:30]}'",
        related_gig_id=gig.id
    )

    db.add(gig)
    db.commit()
    db.refresh(gig)

    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()


def complete_gig(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Transitions Gig status from WORK_SUBMITTED to COMPLETED.
    Authorization: Gig Poster ONLY. Auto-releases escrow payment if locked.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.poster_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the gig poster can confirm completion."
        )

    validate_transition(gig.status, GigStatus.COMPLETED)

    gig.completed_at = datetime.now(timezone.utc)
    gig.status = GigStatus.COMPLETED
    gig.updated_at = datetime.now(timezone.utc)

    # Increment completed gigs count for worker & poster if available
    if gig.selected_worker:
        gig.selected_worker.completed_gigs_count = (gig.selected_worker.completed_gigs_count or 0) + 1
    if gig.poster:
        gig.poster.completed_gigs_count = (gig.poster.completed_gigs_count or 0) + 1

    # Notify worker that gig is completed
    if gig.selected_worker_id:
        create_notification(
            db=db,
            user_id=gig.selected_worker_id,
            notification_type=NotificationType.GIG_COMPLETED,
            title="Gig Completed",
            message=f"'{gig.title[:30]}' has been marked as completed.",
            related_gig_id=gig.id
        )

    db.add(gig)
    db.commit()

    # Automatically release escrow payment if active locked escrow exists
    from app.services.escrow_service import release_payment
    from app.models.escrow import Escrow
    escrow = db.query(Escrow).filter(Escrow.gig_id == gig.id).first()
    if escrow and escrow.status == EscrowStatus.LOCKED:
        release_payment(db, gig_id, current_user_id)

    db.refresh(gig)

    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()


def cancel_gig(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Transitions Gig status to CANCELLED.
    Authorization: Gig Poster ONLY. Auto-refunds escrow payment if locked.
    """
    gig = get_gig_by_id(db, gig_id)

    if gig.poster_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the gig poster can cancel this gig."
        )

    validate_transition(gig.status, GigStatus.CANCELLED)

    # Reject remaining pending applications
    db.query(Application).filter(
        Application.gig_id == gig.id,
        Application.status == ApplicationStatus.PENDING
    ).update({"status": ApplicationStatus.REJECTED}, synchronize_session=False)

    gig.cancelled_at = datetime.now(timezone.utc)
    gig.status = GigStatus.CANCELLED
    gig.updated_at = datetime.now(timezone.utc)

    # Notify selected worker if assigned
    if gig.selected_worker_id:
        create_notification(
            db=db,
            user_id=gig.selected_worker_id,
            notification_type=NotificationType.GIG_CANCELLED,
            title="Gig Cancelled",
            message=f"'{gig.title[:30]}' has been cancelled.",
            related_gig_id=gig.id
        )

    db.add(gig)
    db.commit()

    # Automatically refund escrow payment if active locked escrow exists
    from app.services.escrow_service import refund_payment
    from app.models.escrow import Escrow
    escrow = db.query(Escrow).filter(Escrow.gig_id == gig.id).first()
    if escrow and escrow.status == EscrowStatus.LOCKED:
        refund_payment(db, gig_id, current_user_id)

    db.refresh(gig)

    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()
