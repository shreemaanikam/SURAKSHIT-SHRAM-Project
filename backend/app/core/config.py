import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SURAKSHIT SHRAM Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "surakshit-shram-super-secret-jwt-key-2026-production-ready-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day token lifetime
    
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "surakshit_user"
    POSTGRES_PASSWORD: str = "surakshit_password"
    POSTGRES_DB: str = "surakshit_shram_db"
    DATABASE_URL: str = "sqlite:///./surakshit_shram.db"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str = ""
    USE_REDIS_FALLBACK: bool = True
    
    # Document Storage
    UPLOAD_DIR: str = "./storage/documents"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {"pdf", "png", "jpg", "jpeg", "doc", "docx", "csv"}
    
    # Security & CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def sync_database_url(self) -> str:
        if self.DATABASE_URL and "sqlite" in self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()
