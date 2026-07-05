from fastapi import APIRouter, Depends, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.base import ISearchRepository
from app.db.dependencies import get_search_repo
from app.schemas.search import GlobalSearchResponse

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get("/", response_model=GlobalSearchResponse)
@limiter.limit("60/minute")
async def global_search(
    request: Request,
    q: str = Query(..., min_length=2, description="Search keyword"),
    provider: ISearchRepository = Depends(get_search_repo),
):
    """
    Projeler, Makaleler, Deneyimler ve Sertifikalar arasında global arama yapar.
    Veritabanı Agnostik altyapıyı kullanır.
    """
    results = await provider.global_search(q)
    return results
