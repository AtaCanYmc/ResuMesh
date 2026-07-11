from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost",
        "http://127.0.0.1",
    ]
    CORS_ALLOWED_ORIGINS: str = ""
    ENVIRONMENT: str = "development"
    POSTHOG_API_KEY: str = ""
    POSTHOG_HOST: str = "https://us.i.posthog.com"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    def __init__(self, **values):
        super().__init__(**values)
        if self.ENVIRONMENT.lower() != "development":
            self.CORS_ORIGINS = [
                origin
                for origin in self.CORS_ORIGINS
                if "localhost" not in origin and "127.0.0.1" not in origin
            ]
        if self.CORS_ALLOWED_ORIGINS:
            origins = [
                o.strip() for o in self.CORS_ALLOWED_ORIGINS.split(",") if o.strip()
            ]
            for origin in origins:
                if origin not in self.CORS_ORIGINS:
                    self.CORS_ORIGINS.append(origin)


settings = Settings()
