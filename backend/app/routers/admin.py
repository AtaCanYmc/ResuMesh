from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, HttpUrl
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.base import ProjectRepository
from app.db.factory import get_db_provider, get_log_provider
from app.llm.factory import get_llm_provider
from app.services.auth_service import get_current_admin
from app.services.cv_generator_service import CVGeneratorService

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/admin/logs", tags=["Admin Log Management"])


class CVGenerateRequest(BaseModel):
    job_url: HttpUrl


@router.post("/generate-cv")
@limiter.limit("5/minute")
async def generate_cv(
    request: Request,
    payload: CVGenerateRequest,
    provider: ProjectRepository = Depends(get_db_provider),
    admin=Depends(get_current_admin),
):
    try:
        llm_provider = get_llm_provider()
        cv_service = CVGeneratorService(provider, llm_provider)

        cv_markdown = await cv_service.generate_tailored_cv(str(payload.job_url))

        return {"status": "success", "cv_markdown": cv_markdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
@limiter.limit("10/minute")
async def get_system_logs(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    level: Optional[str] = None,
    module: Optional[str] = None,
    provider: ProjectRepository = Depends(get_log_provider),
    current_admin: dict = Depends(get_current_admin),
):
    """Veritabanındaki log havuzunu sayfalı ve filtreli olarak getirir."""
    total_count = await provider.get_logs_count(level=level, module=module)
    logs = await provider.get_logs(page=page, limit=limit, level=level, module=module)

    return {"total": total_count, "page": page, "limit": limit, "data": logs}
