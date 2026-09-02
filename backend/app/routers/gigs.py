from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.gig import (
    GigCreateRequest,
    GigUpdateRequest,
    GigDetailResponse,
    PaginatedGigResponse
)
from app.services.gig_service import (
    create_gig,
    get_gigs,
    get_gig_by_id,
    update_gig,
    delete_gig
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
    description="Returns full Gig details along with the poster's public-safe profile summary."
)
def get_gig(gig_id: int, db: Session = Depends(get_db)):
    gig = get_gig_by_id(db, gig_id)
    return GigDetailResponse.model_validate(gig)


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
