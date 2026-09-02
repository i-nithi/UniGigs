from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserSignupRequest, UserLoginRequest
from app.core.security import hash_password, verify_password

def signup_student(db: Session, signup_data: UserSignupRequest) -> User:
    """
    Business logic for student signup.
    Validates unique constraints (email & registration number), hashes password, and persists user.
    """
    clean_email = signup_data.email.strip().lower()
    clean_reg = signup_data.registration_number.strip()

    # Check duplicate email
    existing_email = db.query(User).filter(User.email == clean_email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A student account with this SASTRA email already exists."
        )

    # Check duplicate registration number
    existing_reg = db.query(User).filter(User.registration_number == clean_reg).first()
    if existing_reg:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A student account with this registration number already exists."
        )

    # Hash password securely
    hashed_pwd = hash_password(signup_data.password)

    # Create new student user
    new_user = User(
        name=signup_data.name.strip(),
        registration_number=clean_reg,
        email=clean_email,
        hashed_password=hashed_pwd,
        is_verified=False,
        trust_score=85,
        average_rating=5.0,
        completed_gigs_count=0
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Auto-provision simulated wallet with 10,000 credits
    from app.services.wallet_service import get_or_create_wallet
    get_or_create_wallet(db, new_user.id)

    return new_user


def authenticate_student(db: Session, login_data: UserLoginRequest) -> User:
    """
    Business logic for student login.
    Verifies email and password using generic 401 error message to avoid account enumeration.
    """
    clean_email = login_data.email.strip().lower()

    # Generic authentication error
    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email address or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user = db.query(User).filter(User.email == clean_email).first()
    if not user:
        raise auth_error

    if not verify_password(login_data.password, user.hashed_password):
        raise auth_error

    return user
