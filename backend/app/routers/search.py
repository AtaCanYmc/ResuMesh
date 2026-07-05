from typing import List

from fastapi import APIRouter, Depends, Query

from app.db.base import ProjectRepository
from app.db.factory import get_db_provider
from app.schemas.search import SearchResponse

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get("/", response_model=List[SearchResponse])
async def global_search(
    q: str = Query(..., min_length=2, description="Search keyword"),
    provider: ProjectRepository = Depends(get_db_provider),
):
    """
    Projeler, Makaleler, Deneyimler ve Sertifikalar arasında global arama yapar.
    Veritabanı Agnostik altyapıyı kullanır.
    """
    results = await provider.global_search(q)
    return results
