import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application Settings loaded from environment variables or .env file.
    """
    APP_NAME: str = "UniGigs Backend"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "unigigs_default_secret_key"
    
    # PostgreSQL Database Connection URL
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/unigigs"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
