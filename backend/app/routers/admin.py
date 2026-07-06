import asyncio
import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, HttpUrl
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISystemLogRepository,
)
from app.db.dependencies import (
    get_article_repo,
    get_certificate_repo,
    get_experience_repo,
    get_project_repo,
    get_system_log_repo,
)
from app.llm.factory import get_llm_provider
from app.services.auth_service import get_current_admin
from app.services.cv_generator_service import CVGeneratorService
from app.services.ingestion_service import IngestionService

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/admin", tags=["Admin Log Management"])


class CVGenerateRequest(BaseModel):
    job_url: HttpUrl


@router.post("/generate-cv")
@limiter.limit("5/minute")
async def generate_cv(
    request: Request,
    payload: CVGenerateRequest,
    project_repo: IProjectRepository = Depends(get_project_repo),
    experience_repo: IExperienceRepository = Depends(get_experience_repo),
    article_repo: IArticleRepository = Depends(get_article_repo),
    cert_repo: ICertificateRepository = Depends(get_certificate_repo),
    admin=Depends(get_current_admin),
):
    try:
        llm_provider = get_llm_provider()
        cv_service = CVGeneratorService(
            project_repo, experience_repo, article_repo, cert_repo, llm_provider
        )

        cv_markdown = await cv_service.generate_tailored_cv(str(payload.job_url))

        return {"status": "success", "cv_markdown": cv_markdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh-data")
@limiter.limit("2/minute")
async def refresh_data(
    request: Request,
    project_repo: IProjectRepository = Depends(get_project_repo),
    article_repo: IArticleRepository = Depends(get_article_repo),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
    admin=Depends(get_current_admin),
):
    """Admin endpoint to manually trigger data scraping from platforms."""
    github_user = os.getenv("GITHUB_USERNAME")
    medium_user = os.getenv("MEDIUM_USERNAME")
    devto_user = os.getenv("DEVTO_USERNAME")

    tasks = []

    if github_user:
        tasks.append(
            IngestionService.fetch_github_repos(github_user, project_repo, log_repo)
        )
    if medium_user:
        tasks.append(
            IngestionService.fetch_medium_articles(medium_user, article_repo, log_repo)
        )
    if devto_user:
        tasks.append(
            IngestionService.fetch_devto_articles(devto_user, article_repo, log_repo)
        )

    if not tasks:
        raise HTTPException(
            status_code=400, detail="No platform usernames configured in environment."
        )

    try:
        await asyncio.gather(*tasks)
        return {
            "status": "success",
            "message": "Data successfully refreshed from configured platforms.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs")
@limiter.limit("10/minute")
async def get_system_logs(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    level: Optional[str] = None,
    module: Optional[str] = None,
    provider: ISystemLogRepository = Depends(get_system_log_repo),
    current_admin: dict = Depends(get_current_admin),
):
    """Veritabanındaki log havuzunu sayfalı ve filtreli olarak getirir."""
    total_count = await provider.get_logs_count(level=level, module=module)
    logs = await provider.get_logs(page=page, limit=limit, level=level, module=module)

    return {"total": total_count, "page": page, "limit": limit, "data": logs}
