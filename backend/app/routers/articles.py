from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.base import IArticleRepository
from app.db.dependencies import get_article_repo
from app.schemas.article import ArticleCreate, ArticleResponse

router = APIRouter(prefix="/articles", tags=["articles"])


@router.post("/", response_model=ArticleResponse)
async def create_article(
    article: ArticleCreate, provider: IArticleRepository = Depends(get_article_repo)
):
    try:
        result = await provider.upsert_article(article)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    provider: IArticleRepository = Depends(get_article_repo),
):
    try:
        articles = await provider.get_all_articles()
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
