from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.models.application import Application
from app.core.enums import GigStatus, ApplicationStatus
from app.core.lifecycle import validate_transition
from app.schemas.gig import WorkSubmissionRequest
from app.services.gig_service import get_gig_by_id

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

    db.add(gig)
    db.commit()
    db.refresh(gig)

    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()


def complete_gig(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Transitions Gig status from WORK_SUBMITTED to COMPLETED.
    Authorization: Gig Poster ONLY.
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

    db.add(gig)
    db.commit()
    db.refresh(gig)

    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()


def cancel_gig(db: Session, gig_id: int, current_user_id: int) -> Gig:
    """
    Transitions Gig status to CANCELLED.
    Authorization: Gig Poster ONLY. Allowed in OPEN, APPLICATIONS_OPEN, WORKER_SELECTED.
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

    db.add(gig)
    db.commit()
    db.refresh(gig)

    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()
