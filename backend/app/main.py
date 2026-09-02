from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, users, gigs, applications, payment, wallet, transactions, notifications, reviews

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend database layer and API service for UniGigs campus marketplace.",
    version="1.0.0"
)

# Security Response Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# CORS Middleware Configuration for local development & staging
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(gigs.router)
app.include_router(applications.router)
app.include_router(payment.router)
app.include_router(wallet.router)
app.include_router(transactions.router)
app.include_router(notifications.router)
app.include_router(reviews.router)


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
