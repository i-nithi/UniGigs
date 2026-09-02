from pydantic import BaseModel

class UploadResponse(BaseModel):
    """
    Response schema for uploaded file attachments.
    """
    filename: str
    file_url: str
    content_type: str
    size_bytes: int
