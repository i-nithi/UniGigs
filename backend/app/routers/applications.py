from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
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
