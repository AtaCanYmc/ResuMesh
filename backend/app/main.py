# flake8: noqa: E402
import logging
import os
from contextlib import asynccontextmanager

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

    sentry_dsn = os.getenv("SENTRY_DSN")
    if sentry_dsn:
        sentry_sdk.init(
            dsn=sentry_dsn,
            traces_sample_rate=1.0,
        )
except ImportError:
    pass
from app.routers import (
    admin,
    articles,
    auth,
    certificates,
    educations,
    experiences,
    projects,
    search,
    seo,
    skills,
)
from app.schedulers.sync_scheduler import scheduler, start_scheduler

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    try:
        if scheduler.running:
            scheduler.shutdown(wait=False)
    except Exception as e:
        logger.error(f"Scheduler shutdown sırasında hata oluştu: {e}")


app = FastAPI(
    title="ResuMesh API",
    description="Açık Kaynak Akıllı Portfolyo ve CV Yönetim Sistemi",
    version="1.0.0",
    lifespan=lifespan,
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
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(articles.router, prefix="/api/v1")
app.include_router(educations.router, prefix="/api/v1")
app.include_router(experiences.router, prefix="/api/v1")
app.include_router(skills.router, prefix="/api/v1")
app.include_router(certificates.router, prefix="/api/v1")
app.include_router(seo.router, prefix="/api/v1/seo")


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
