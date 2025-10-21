from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "AI Med Platform API"
    APP_VERSION: str = "0.1.0"
    API_PREFIX: str = "/api"

    JWT_SECRET: str = "change-me"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    DATABASE_URL: str = "sqlite:///./local.db"

    CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("CORS_ORIGINS", mode="before")
    def split_origins(cls, v):
        if isinstance(v, str) and "," in v:
            return [o.strip() for o in v.split(",")]
        return v

settings = Settings(_env_file=".env", _env_file_encoding="utf-8")
