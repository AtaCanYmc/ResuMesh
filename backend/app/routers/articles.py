from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_article_repo
from app.db.repositories import IArticleRepository
from app.schemas.article import ArticleResponse

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    skip: int = 0,
    limit: int = 100,
    provider: IArticleRepository = Depends(get_article_repo),
):
    try:
        articles = await provider.get_all_articles(skip=skip, limit=limit)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
