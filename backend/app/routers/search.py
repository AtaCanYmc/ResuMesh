from fastapi import APIRouter, Depends, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.base import ProjectRepository
from app.db.factory import get_db_provider
from app.schemas.search import GlobalSearchResponse

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get("/", response_model=GlobalSearchResponse)
@limiter.limit("60/minute")
async def global_search(
    request: Request,
    q: str = Query(..., min_length=2, description="Search keyword"),
    provider: ProjectRepository = Depends(get_db_provider),
):
    """
    Projeler, Makaleler, Deneyimler ve Sertifikalar arasında global arama yapar.
    Veritabanı Agnostik altyapıyı kullanır.
    """
    results = await provider.global_search(q)
    return results
