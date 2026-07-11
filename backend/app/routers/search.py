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
    q: str = Query(None, min_length=2, description="Search keyword"),
    query: str = Query(None, min_length=2, description="Search keyword alias"),
    provider: ISearchRepository = Depends(get_search_repo),
):
    """
    Performs global search across Projects, Articles, Experiences and Certificates.
    Uses Database Agnostic architecture.
    """
    keyword = q or query
    if not keyword:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=422,
            detail=(
                "Search query parameter 'q' or 'query' "
                "is required with min length 2."
            ),
        )

    results = await provider.global_search(keyword)
    return results
