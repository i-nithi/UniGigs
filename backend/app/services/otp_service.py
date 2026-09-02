import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.otp import OTPRecord
from app.services.email_service import send_otp_email

def create_and_send_otp(db: Session, email: str) -> OTPRecord:
    """
    Generates a secure 6-digit OTP, saves it to database with 5-minute expiry,
    and attempts transactional email delivery.
    Raises HTTP 502 Bad Gateway if email delivery fails.
    """
    clean_email = email.strip().lower()

    # Invalidate older unused OTP records for this email
    db.query(OTPRecord).filter(
        OTPRecord.email == clean_email,
        OTPRecord.is_used == False
    ).update({"is_used": True}, synchronize_session=False)

    # Generate 6-digit numeric OTP code
    otp_code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    otp_record = OTPRecord(
        email=clean_email,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False,
        created_at=datetime.now(timezone.utc)
    )
    db.add(otp_record)
    db.commit()

    # Attempt transactional email delivery
    sent_successfully = send_otp_email(to_email=clean_email, otp_code=otp_code, expiry_minutes=5)

    if not sent_successfully:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to deliver verification email right now. Please try again later or contact support."
        )

    db.refresh(otp_record)
    return otp_record


def verify_otp_code(db: Session, email: str, code: str) -> bool:
    """
    Verifies that a 6-digit OTP is active, valid, and not expired.
    Marks OTP as used (single-use enforcement).
    """
    clean_email = email.strip().lower()
    clean_code = code.strip()

    otp_record = db.query(OTPRecord).filter(
        OTPRecord.email == clean_email,
        OTPRecord.otp_code == clean_code,
        OTPRecord.is_used == False
    ).order_by(OTPRecord.created_at.desc()).first()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP verification code."
        )

    now = datetime.now(timezone.utc)
    # Ensure timezone aware comparison
    expires_at = otp_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now > expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP verification code has expired. Please request a new code."
        )

    # Mark as used (single-use)
    otp_record.is_used = True
    db.add(otp_record)
    db.commit()

    return True
