from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.models.application import Application
from app.core.enums import GigStatus, ApplicationStatus, NotificationType
from app.schemas.application import ApplicationCreateRequest
from app.services.gig_service import get_gig_by_id
from app.services.notification_service import create_notification

def create_application(db: Session, gig_id: int, applicant_id: int, create_data: ApplicationCreateRequest) -> Application:
    gig = get_gig_by_id(db, gig_id)

    if gig.status not in (GigStatus.OPEN, GigStatus.APPLICATIONS_OPEN):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Applications are closed for this gig."
        )

    if gig.poster_id == applicant_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot apply to your own posted gig."
        )

    existing = db.query(Application).filter(
        Application.gig_id == gig_id,
        Application.applicant_id == applicant_id,
        Application.status != ApplicationStatus.WITHDRAWN
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied for this gig."
        )

    app_obj = Application(
        gig_id=gig_id,
        applicant_id=applicant_id,
        message=create_data.message.strip(),
        estimated_completion_time=create_data.estimated_time or "2 hours",
        status=ApplicationStatus.PENDING
    )

    db.add(app_obj)

    # Fetch applicant name for notification message
    from app.models.user import User
    applicant_user = db.query(User).filter(User.id == applicant_id).first()
    applicant_name = applicant_user.name if applicant_user else "A student"

    # Create notification for Gig Poster
    create_notification(
        db=db,
        user_id=gig.poster_id,
        notification_type=NotificationType.GIG_APPLICATION_RECEIVED,
        title="New Application Received",
        message=f"{applicant_name} applied for your gig: '{gig.title[:30]}'",
        related_gig_id=gig.id,
        related_application_id=app_obj.id
    )

    db.commit()
    db.refresh(app_obj)

    return db.query(Application).options(joinedload(Application.applicant)).filter(Application.id == app_obj.id).first()


def select_applicant(db: Session, application_id: int, poster_id: int) -> Application:
    app_obj = db.query(Application).options(joinedload(Application.gig), joinedload(Application.applicant)).filter(Application.id == application_id).first()
    
    if not app_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    gig = app_obj.gig
    if gig.poster_id != poster_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the gig poster can select a worker.")

    # Find all other pending applications for this gig
    other_pending_apps = db.query(Application).filter(
        Application.gig_id == gig.id,
        Application.id != application_id,
        Application.status == ApplicationStatus.PENDING
    ).all()

    # Reject other applications
    for other_app in other_pending_apps:
        other_app.status = ApplicationStatus.REJECTED
        db.add(other_app)

        # Notify rejected applicant
        create_notification(
            db=db,
            user_id=other_app.applicant_id,
            notification_type=NotificationType.APPLICATION_REJECTED,
            title="Application Update",
            message=f"Another student was selected for '{gig.title[:30]}'",
            related_gig_id=gig.id,
            related_application_id=other_app.id
        )

    app_obj.status = ApplicationStatus.SELECTED
    gig.selected_worker_id = app_obj.applicant_id
    gig.status = GigStatus.WORKER_SELECTED
    gig.updated_at = datetime.now(timezone.utc)

    # Notify selected worker
    create_notification(
        db=db,
        user_id=app_obj.applicant_id,
        notification_type=NotificationType.WORKER_SELECTED,
        title="You Were Selected!",
        message=f"Congratulations! You were selected to work on '{gig.title[:30]}'",
        related_gig_id=gig.id,
        related_application_id=app_obj.id
    )

    db.add(app_obj)
    db.add(gig)
    db.commit()
    db.refresh(app_obj)

    return app_obj
