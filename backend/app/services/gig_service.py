import math
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import or_, func, cast, String
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.gig import Gig
from app.core.enums import GigStatus
from app.schemas.gig import GigCreateRequest, GigUpdateRequest

def create_gig(db: Session, poster_id: int, create_data: GigCreateRequest) -> Gig:
    """
    Creates a new campus Gig with poster_id automatically set from JWT authentication.
    """
    new_gig = Gig(
        title=create_data.title.strip(),
        description=create_data.description.strip(),
        category=create_data.category.strip(),
        reward_amount=create_data.reward_amount,
        location=create_data.location.strip(),
        estimated_duration=create_data.estimated_duration or "2 hours",
        deadline=create_data.deadline,
        required_skills=create_data.required_skills or [],
        status=GigStatus.OPEN,
        is_deleted=False,
        poster_id=poster_id
    )

    db.add(new_gig)
    db.commit()
    db.refresh(new_gig)
    
    # Reload with poster relationship
    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == new_gig.id).first()


def get_gigs(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    minimum_reward: Optional[float] = None,
    maximum_reward: Optional[float] = None,
    status_filter: Optional[str] = None,
    required_skill: Optional[str] = None,
    poster_id: Optional[int] = None,
    sort_by: str = "newest",
    page: int = 1,
    limit: int = 20
) -> dict:
    """
    Retrieves a paginated list of non-deleted Gigs with filtering, search, and sorting support.
    Eagerly loads poster relationship to prevent N+1 queries.
    """
    query = db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.is_deleted == False)

    # Search filter (title, description, category, required_skills)
    if search and search.strip():
        q = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Gig.title).like(q),
                func.lower(Gig.description).like(q),
                func.lower(Gig.category).like(q),
                cast(Gig.required_skills, String).ilike(q)
            )
        )

    # Category filter
    if category and category.strip() and category.lower() != "all":
        query = query.filter(func.lower(Gig.category) == category.strip().lower())

    # Location filter
    if location and location.strip() and location.lower() != "all":
        query = query.filter(func.lower(Gig.location).like(f"%{location.strip().lower()}%"))

    # Reward range filters
    if minimum_reward is not None:
        query = query.filter(Gig.reward_amount >= minimum_reward)
    if maximum_reward is not None:
        query = query.filter(Gig.reward_amount <= maximum_reward)

    # Status filter
    if status_filter and status_filter.strip() and status_filter.lower() != "all":
        query = query.filter(func.lower(cast(Gig.status, String)) == status_filter.strip().lower())

    # Required skill filter
    if required_skill and required_skill.strip():
        skill_q = f"%{required_skill.strip().lower()}%"
        query = query.filter(cast(Gig.required_skills, String).ilike(skill_q))

    # Poster filter (e.g. My Posted Gigs)
    if poster_id is not None:
        query = query.filter(Gig.poster_id == poster_id)

    # Sorting
    if sort_by == "oldest":
        query = query.order_by(Gig.created_at.asc())
    elif sort_by == "highest_pay":
        query = query.order_by(Gig.reward_amount.desc())
    elif sort_by == "lowest_pay":
        query = query.order_by(Gig.reward_amount.asc())
    elif sort_by == "deadline":
        query = query.order_by(Gig.deadline.asc().nullslast())
    else:  # "newest" default
        query = query.order_by(Gig.created_at.desc())

    # Pagination
    total = query.count()
    limit = max(1, min(limit, 100))
    page = max(1, page)
    total_pages = math.ceil(total / limit) if total > 0 else 1
    offset = (page - 1) * limit

    gigs = query.offset(offset).limit(limit).all()

    return {
        "items": gigs,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }


def get_gig_by_id(db: Session, gig_id: int) -> Gig:
    """
    Retrieves a Gig by ID or raises HTTP 404 Not Found.
    """
    gig = db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig_id, Gig.is_deleted == False).first()
    if not gig:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found"
        )
    return gig


def update_gig(db: Session, gig: Gig, current_user_id: int, update_data: GigUpdateRequest) -> Gig:
    """
    Updates an existing Gig. Verifies backend ownership (gig.poster_id == current_user_id).
    """
    if gig.poster_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this gig."
        )

    if gig.status not in (GigStatus.OPEN, GigStatus.APPLICATIONS_OPEN):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Gig cannot be edited once a worker has been selected or work is in progress."
        )

    update_dict = update_data.model_dump(exclude_unset=True)
    allowed_fields = {"title", "description", "category", "reward_amount", "location", "estimated_duration", "deadline", "required_skills"}

    for field, value in update_dict.items():
        if field in allowed_fields and value is not None:
            setattr(gig, field, value)

    gig.updated_at = datetime.now(timezone.utc)
    db.add(gig)
    db.commit()
    db.refresh(gig)
    
    return db.query(Gig).options(joinedload(Gig.poster)).filter(Gig.id == gig.id).first()


def delete_gig(db: Session, gig: Gig, current_user_id: int) -> None:
    """
    Soft-deletes a Gig. Verifies backend ownership (gig.poster_id == current_user_id).
    """
    if gig.poster_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this gig."
        )

    gig.is_deleted = True
    gig.updated_at = datetime.now(timezone.utc)
    db.add(gig)
    db.commit()
