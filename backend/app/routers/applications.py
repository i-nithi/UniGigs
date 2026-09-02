from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.core.dependencies import get_current_user
from app.core.authorization import require_gig_owner, require_application_owner
from app.core.enums import ApplicationStatus
from app.schemas.application import ApplicationCreateRequest, ApplicationResponse
from app.services.application_service import create_application, select_applicant

router = APIRouter(tags=["Gig Applications"])

@router.post(
    "/gigs/{gig_id}/applications",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Apply for a Gig"
)
def apply_to_gig(
    gig_id: int,
    create_data: ApplicationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = create_application(db, gig_id, current_user.id, create_data)
    return ApplicationResponse.model_validate(app_obj)


@router.get(
    "/gigs/{gig_id}/applications",
    response_model=list[ApplicationResponse],
    status_code=status.HTTP_200_OK,
    summary="View all applications for a Gig (Poster only)"
)
def view_gig_applications(
    gig_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Authorization: Gig Poster ONLY
    gig = require_gig_owner(db, gig_id, current_user.id)
    applications = db.query(Application).options(joinedload(Application.applicant)).filter(
        Application.gig_id == gig.id,
        Application.status != ApplicationStatus.WITHDRAWN
    ).all()
    return [ApplicationResponse.model_validate(a) for a in applications]


@router.delete(
    "/applications/{application_id}",
    status_code=status.HTTP_200_OK,
    summary="Withdraw an application (Applicant only)"
)
def withdraw_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Authorization: Applicant ONLY
    app_obj = require_application_owner(db, application_id, current_user.id)
    if app_obj.status in (ApplicationStatus.SELECTED, ApplicationStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot withdraw an application once worker selection has finalized."
        )
    app_obj.status = ApplicationStatus.WITHDRAWN
    db.add(app_obj)
    db.commit()
    return {"message": "Application withdrawn successfully."}


@router.post(
    "/applications/{application_id}/select",
    response_model=ApplicationResponse,
    status_code=status.HTTP_200_OK,
    summary="Select a student worker for a Gig (Poster only)"
)
def select_worker(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = select_applicant(db, application_id, current_user.id)
    return ApplicationResponse.model_validate(app_obj)
