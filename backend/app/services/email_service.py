import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

logger = logging.getLogger("unigigs.email")

def send_otp_email(to_email: str, otp_code: str, expiry_minutes: int = 5) -> bool:
    """
    Sends a transactional OTP verification email using configured SMTP provider.
    Returns True if the email was accepted for delivery by the mail provider;
    Returns False if sending failed.
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #090d16; color: #ffffff; margin: 0; padding: 20px; }}
            .container {{ max-width: 500px; margin: 0 auto; background-color: #0c101c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
            .logo {{ font-size: 24px; font-weight: 800; color: #ffffff; text-align: center; margin-bottom: 24px; }}
            .highlight {{ color: #84cc16; }}
            .card {{ background-color: #121826; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; border: 1px solid rgba(132, 204, 22, 0.2); }}
            .otp-code {{ font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #84cc16; margin: 16px 0; font-family: monospace; }}
            .meta {{ font-size: 13px; color: #94a3b8; line-height: 1.6; text-align: center; margin-top: 16px; }}
            .footer {{ margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Uni<span class="highlight">Gigs</span></div>
            <h2 style="margin-top:0; font-size: 18px; text-align: center;">Verify Your SASTRA Student Account</h2>
            <p style="color: #cbd5e1; font-size: 14px; text-align: center;">Enter the verification code below to complete your registration on UniGigs Campus Marketplace:</p>
            
            <div class="card">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Your 6-Digit OTP Code</div>
                <div class="otp-code">{otp_code}</div>
                <div class="meta">⏱ Expires in <strong>{expiry_minutes} minutes</strong></div>
            </div>

            <p class="meta">If you did not request this verification code, please ignore this email. Do not share your OTP code with anyone.</p>
            
            <div class="footer">
                UniGigs Campus Marketplace &bull; SASTRA Deemed University, Thanjavur
            </div>
        </div>
    </body>
    </html>
    """

    # Check if SMTP credentials are configured
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning(f"SMTP credentials not configured. Cannot deliver OTP email to {to_email}.")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"UniGigs Verification Code: {otp_code}"
        msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
        msg["To"] = to_email

        part = MIMEText(html_content, "html")
        msg.attach(part)

        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, [to_email], msg.as_string())

        logger.info(f"Successfully sent OTP email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to deliver OTP email to {to_email}: {str(e)}")
        return False
