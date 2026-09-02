from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserSignupRequest, UserLoginRequest, UserResponse
from app.schemas.auth import TokenResponse, RequestOTPRequest, RequestOTPResponse, VerifyOTPRequest, VerifyOTPResponse
from app.services.auth_service import signup_student, authenticate_student
from app.services.otp_service import create_and_send_otp, verify_otp_code
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication & Security"]
)


@router.post(
    "/request-otp",
    response_model=RequestOTPResponse,
    status_code=status.HTTP_200_OK,
    summary="Request a 6-digit transactional email OTP code",
    description="Generates a 6-digit verification code and delivers it to the student's @sastra.ac.in email address. Returns success ONLY if email provider accepts message."
)
def request_otp(request_data: RequestOTPRequest, db: Session = Depends(get_db)):
    create_and_send_otp(db=db, email=request_data.email)
    return RequestOTPResponse(
        message=f"Verification code sent to {request_data.email}",
        email=request_data.email,
        expires_in_seconds=300
    )


@router.post(
    "/verify-otp",
    response_model=VerifyOTPResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify a 6-digit email OTP code",
    description="Verifies an active, non-expired 6-digit OTP verification code."
)
def verify_otp(verify_data: VerifyOTPRequest, db: Session = Depends(get_db)):
    verify_otp_code(db=db, email=verify_data.email, code=verify_data.otp_code)
    return VerifyOTPResponse(
        message="OTP code verified successfully.",
        verified=True
    )


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new SASTRA student account",
    description="Registers a new SASTRA University student using their official @sastra.ac.in email address and returns a JWT access token."
)
def signup(signup_data: UserSignupRequest, db: Session = Depends(get_db)):
    user = signup_student(db, signup_data)
    access_token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate SASTRA student and receive JWT access token",
    description="Authenticates a student via SASTRA email and password, returning a JWT access token."
)
def login(login_data: UserLoginRequest, db: Session = Depends(get_db)):
    user = authenticate_student(db, login_data)
    access_token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get currently authenticated student profile",
    description="Retrieves the safe profile details of the currently logged in student. Requires Bearer JWT token."
)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
