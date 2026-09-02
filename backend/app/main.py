from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from app.config import settings
from app.routers import auth

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend database layer and API service for UniGigs campus marketplace.",
    version="1.0.0"
)

# Include Auth Router
app.include_router(auth.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
