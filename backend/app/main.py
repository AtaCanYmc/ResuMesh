# flake8: noqa: E402
import logging

logger = logging.getLogger(__name__)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config.settings import settings
from app.core.handlers import setup_exception_handlers

try:
    import sentry_sdk

    sentry_dsn = settings.SENTRY_DSN
    if sentry_dsn:
        sentry_sdk.init(
            dsn=sentry_dsn,
            traces_sample_rate=1.0,
        )
except ImportError:
    pass
from app.routers import (
    articles,
    certificates,
    cv,
    educations,
    experiences,
    packages,
    posts,
    projects,
    search,
    sections,
    seo,
    skills,
    social_links,
    videos,
)
from app.routers.app_settings import router as settings_router

limiter = Limiter(key_func=get_remote_address)


app = FastAPI(
    title="ResuMesh API",
    description="Open Source Intelligent Portfolio and CV Management System",
    version="1.0.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
setup_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(articles.router, prefix="/api/v1")
app.include_router(educations.router, prefix="/api/v1")
app.include_router(experiences.router, prefix="/api/v1")
app.include_router(skills.router, prefix="/api/v1")
app.include_router(certificates.router, prefix="/api/v1")
app.include_router(seo.router, prefix="/api/v1/seo")
app.include_router(cv.router, prefix="/api/v1")
app.include_router(packages.router, prefix="/api/v1")
app.include_router(posts.router, prefix="/api/v1")
app.include_router(videos.router, prefix="/api/v1")
app.include_router(social_links.router, prefix="/api/v1")
app.include_router(sections.router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")


@app.get("/api/v1/")
def read_root():
    return {
        "message": "Welcome to ResuMesh API",
        "version": "1.0.0",
        "title": "ResuMesh API",
        "description": "ResuMesh API",
        "author": "AtaCanYmc",
    }


@app.get("/api/v1/health", include_in_schema=False)
async def health_check():
    return {
        "status": "ok",
        "message": "ResuMesh API is healthy",
        "version": "1.0.0",
        "description": "ResuMesh API is healthy",
    }
