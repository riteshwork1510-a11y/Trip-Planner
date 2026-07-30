import os
from functools import lru_cache
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App Information
    APP_NAME: str = Field(default="WanderAI", description="Application Name")
    APP_ENV: str = Field(default="development", description="Environment: development, staging, production")
    APP_VERSION: str = Field(default="1.0.0", description="Application Version")
    LOG_LEVEL: str = Field(default="INFO", description="Logging Level: DEBUG, INFO, WARNING, ERROR, CRITICAL")

    # API & Network Config
    REQUEST_TIMEOUT: int = Field(default=30, description="HTTP Request Timeout in seconds")
    MAX_RETRIES: int = Field(default=3, description="Maximum Retry Attempts for transient failures")
    FRONTEND_URL: str = Field(default="http://localhost:3000", description="Frontend URL for CORS")

    # Database Settings
    MONGO_URI: str = Field(default="mongodb://localhost:27017", description="MongoDB Connection URI")
    MONGODB_URI: Optional[str] = Field(default=None, description="Alternative MongoDB URI alias")
    DATABASE_NAME: str = Field(default="wanderai", description="MongoDB Database Name")

    # JWT Authentication
    JWT_SECRET_KEY: str = Field(default="wanderai-dev-secret-key-change-in-production-2026", description="JWT Secret")
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT Signing Algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="JWT Access Token expiry")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=30, description="JWT Refresh Token expiry")

    # AI & Google Gemini Settings
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API Key")
    GEMINI_MODEL: str = Field(default="gemini-2.0-flash", description="Default Google Gemini Model")

    @property
    def effective_mongo_uri(self) -> str:
        return self.MONGODB_URI or self.MONGO_URI

    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        allowed = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        upper_v = v.upper()
        if upper_v not in allowed:
            raise ValueError(f"LOG_LEVEL must be one of {allowed}, got '{v}'")
        return upper_v

    @field_validator("REQUEST_TIMEOUT")
    @classmethod
    def validate_request_timeout(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("REQUEST_TIMEOUT must be a positive integer greater than 0")
        return v

    @field_validator("MAX_RETRIES")
    @classmethod
    def validate_max_retries(cls, v: int) -> int:
        if v < 0:
            raise ValueError("MAX_RETRIES must be greater than or equal to 0")
        return v

    def validate_required_environment(self) -> None:
        missing = []
        if not self.effective_mongo_uri:
            missing.append("MONGO_URI / MONGODB_URI")
        
        if missing:
            raise RuntimeError(f"CRITICAL: Required environment variables are missing: {', '.join(missing)}")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    settings.validate_required_environment()
    return settings
