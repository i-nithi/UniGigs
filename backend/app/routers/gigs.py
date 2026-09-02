from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.core.security import decode_access_token
from app.schemas.gig import (
    GigCreateRequest,
    GigUpdateRequest,
    WorkSubmissionRequest,
    GigDetailResponse,
    GigLifecycleResponse,
    PaginatedGigResponse
)
from app.services.gig_service import (
    create_gig,
    get_gigs,
    get_gig_by_id,
    update_gig,
    delete_gig
)
from app.services.gig_lifecycle_service import (
    start_work,
    submit_work,
    complete_gig,
    cancel_gig
)

router = APIRouter(
    prefix="/gigs",
    tags=["Campus Gigs"]
)


@router.post(
    "",
    response_model=GigDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Post a new campus Gig",
    description="Posts a new campus task. The authenticated student automatically becomes the poster_id."
)
def post_new_gig(
    create_data: GigCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_gig = create_gig(db, current_user.id, create_data)
    return GigDetailResponse.model_validate(new_gig)


@router.get(
    "",
    response_model=PaginatedGigResponse,
    status_code=status.HTTP_200_OK,
    summary="Browse & filter available campus Gigs",
    description="Returns a paginated list of open Gigs with support for search keywords, filtering by category, location, reward range, skill, or poster_id, and sorting."
)
def list_gigs(
    search: Optional[str] = Query(None, description="Search keyword matching title, description, category, or skills"),
    category: Optional[str] = Query(None, description="Filter by category (e.g. Design, Printing, Academic Help)"),
    location: Optional[str] = Query(None, description="Filter by location (e.g. Library, Main Block)"),
    minimum_reward: Optional[float] = Query(None, ge=0, description="Minimum reward amount (₹)"),
    maximum_reward: Optional[float] = Query(None, ge=0, description="Maximum reward amount (₹)"),
    status: Optional[str] = Query(None, description="Filter by status (e.g. OPEN, IN_PROGRESS)"),
    required_skill: Optional[str] = Query(None, description="Filter by required skill (e.g. C++, Canva)"),
    poster_id: Optional[int] = Query(None, description="Filter by poster student ID"),
    sort: str = Query("newest", description="Sort order: newest, oldest, highest_pay, lowest_pay, deadline"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    result = get_gigs(
        db=db,
        search=search,
        category=category,
        location=location,
        minimum_reward=minimum_reward,
        maximum_reward=maximum_reward,
        status_filter=status,
        required_skill=required_skill,
        poster_id=poster_id,
        sort_by=sort,
        page=page,
        limit=limit
    )
    return PaginatedGigResponse.model_validate(result)


@router.get(
    "/{gig_id}",
    response_model=GigDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get detailed information for a specific Gig",
    description="Returns full Gig details along with the poster's public-safe profile summary. Submission links are kept private from unrelated users."
)
def get_gig(
    gig_id: int,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    gig = get_gig_by_id(db, gig_id)
    response_data = GigDetailResponse.model_validate(gig)

    # Determine requesting user ID if token provided
    requester_id = None
    if authorization and authorization.startswith("Bearer "):
        try:
            token = authorization.split(" ")[1]
            payload = decode_access_token(token)
            requester_id = int(payload.get("sub"))
        except Exception:
            pass

    # Hide submission data from unrelated public users
    if requester_id != gig.poster_id and requester_id != gig.selected_worker_id:
        response_data.submission_note = None
        response_data.submission_link = None

    return response_data


@router.put(
    "/{gig_id}",
    response_model=GigDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing Gig (Poster only)",
    description="Allows the original poster to update task details. Returns HTTP 403 if requested by another user."
)
def update_existing_gig(
    gig_id: int,
    update_data: GigUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gig = get_gig_by_id(db, gig_id)
    updated_gig = update_gig(db, gig, current_user.id, update_data)
    return GigDetailResponse.model_validate(updated_gig)


@router.delete(
    "/{gig_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Soft-delete a Gig (Poster only)",
    description="Soft-deletes a Gig owned by the authenticated student. Returns HTTP 403 if requested by another user."
)
def delete_existing_gig(
    gig_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gig = get_gig_by_id(db, gig_id)
    delete_gig(db, gig, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# --------------------------------------------------
# PHASE 5: GIG LIFECYCLE TRANSITION ENDPOINTS
# --------------------------------------------------

@router.post(
    "/{gig_id}/start",
    response_model=GigLifecycleResponse,
    status_code=status.HTTP_200_OK,
    summary="Start work on Gig (Selected Worker only)",
    description="Transitions Gig status from WORKER_SELECTED to IN_PROGRESS. Only the selected worker can execute this action."
)
def start_gig_work(
    gig_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gig = start_work(db, gig_id, current_user.id)
    return {
        "message": "Work started successfully. Status updated to IN_PROGRESS.",
        "gig": GigDetailResponse.model_validate(gig)
    }


@router.post(
    "/{gig_id}/submit",
    response_model=GigLifecycleResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit completed work for review (Selected Worker only)",
    description="Transitions Gig status from IN_PROGRESS to WORK_SUBMITTED and records submission note/link. Only the selected worker can execute this action."
)
def submit_gig_work(
    gig_id: int,
    submission_data: WorkSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gig = submit_work(db, gig_id, current_user.id, submission_data)
    return {
        "message": "Work submitted successfully for requester review. Status updated to WORK_SUBMITTED.",
        "gig": GigDetailResponse.model_validate(gig)
    }


@router.post(
    "/{gig_id}/complete",
    response_model=GigLifecycleResponse,
    status_code=status.HTTP_200_OK,
    summary="Confirm Gig completion (Gig Poster only)",
    description="Transitions Gig status from WORK_SUBMITTED to COMPLETED. Only the original poster can execute this action."
)
def complete_gig_work(
    gig_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gig = complete_gig(db, gig_id, current_user.id)
    return {
        "message": "Gig confirmed and marked as COMPLETED successfully.",
        "gig": GigDetailResponse.model_validate(gig)
    }


@router.post(
    "/{gig_id}/cancel",
    response_model=GigLifecycleResponse,
    status_code=status.HTTP_200_OK,
    summary="Cancel Gig (Gig Poster only)",
    description="Cancels an open or worker-selected Gig and rejects pending applications. Only the original poster can execute this action."
)
def cancel_gig_work(
    gig_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    gig = cancel_gig(db, gig_id, current_user.id)
    return {
        "message": "Gig cancelled successfully.",
        "gig": GigDetailResponse.model_validate(gig)
    }
