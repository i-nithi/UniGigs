import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.upload import UploadResponse

router = APIRouter(
    prefix="/upload",
    tags=["File Uploads"]
)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

# Target uploads directory path
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)


@router.post(
    "",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload image or document attachment (JPG, PNG, PDF <= 10MB)",
    description="Validates and stores uploaded file attachment in local uploads directory and returns static URL."
)
async def upload_file(file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file selected for upload."
        )

    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS or (file.content_type and file.content_type not in ALLOWED_MIME_TYPES):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and PDF files are supported."
        )

    # Read content to validate size
    content = await file.read()
    file_size = len(content)

    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size ({file_size / (1024*1024):.2f} MB) exceeds maximum allowed limit of 10 MB."
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(UPLOADS_DIR, unique_filename)

    with open(target_path, "wb") as f:
        f.write(content)

    file_url = f"/uploads/{unique_filename}"

    return UploadResponse(
        filename=file.filename,
        file_url=file_url,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=file_size
    )
