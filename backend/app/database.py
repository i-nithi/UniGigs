import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Determine Database URL with SQLite fallback
db_url = settings.DATABASE_URL
if os.getenv("TESTING", "").lower() == "true":
    db_url = "sqlite:///./test_unigigs.db"

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        connect_args=connect_args
    )
    # Test connection
    with engine.connect() as conn:
        pass
except Exception:
    # Fallback to local SQLite database if PostgreSQL is not running
    db_url = "sqlite:///./unigigs.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        db_url,
        connect_args=connect_args
    )

# Create SessionLocal factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

def get_db():
    """
    Dependency to provide a database session per request.
    Yields session and handles cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
