from typing import Optional

from fastapi import APIRouter, Depends, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.base import ProjectRepository
from app.db.factory import get_log_provider
from app.services.auth_service import get_current_admin

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/admin/logs", tags=["Admin Log Management"])


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
