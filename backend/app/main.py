from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config.settings import settings
from app.core.handlers import setup_exception_handlers
from app.routers import (
    admin,
    articles,
    auth,
    certificates,
    experiences,
    projects,
    search,
    seo,
)
from app.schedulers.sync_scheduler import scheduler, start_scheduler

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    scheduler.shutdown()


app = FastAPI(
    title="ResuMesh API",
    description="Açık Kaynak Akıllı Portfolyo ve CV Yönetim Sistemi",
    version="1.0.0",
    lifespan=lifespan,
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
app.include_router(experiences.router, prefix="/api/v1")
app.include_router(certificates.router, prefix="/api/v1")
app.include_router(seo.router, prefix="/api/v1/seo")


@app.get("/")
def read_root():
    return {"message": "Welcome to ResuMesh API"}
