from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel

from app.db.base import IArticleRepository
from app.db.dependencies import get_article_repo
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from app.services.auth_service import get_current_admin
from app.services.ingestion_service import IngestionService
from app.services.scrapers.devto_scraper import DevToScraper
from app.services.scrapers.medium_scraper import MediumScraper

router = APIRouter(prefix="/articles", tags=["articles"])


class ArticleRefreshRequest(BaseModel):
    username: str
    platform: str  # "devto" or "medium"
    api_key: str | None = None


@router.post("/refresh", response_model=dict)
async def refresh_articles(
    request: ArticleRefreshRequest,
    background_tasks: BackgroundTasks,
    provider: IArticleRepository = Depends(get_article_repo),
    admin: dict = Depends(get_current_admin),
):
    try:
        ingestion = IngestionService()
        if request.platform.lower() == "devto":
            scraper = DevToScraper()
            background_tasks.add_task(
                ingestion.fetch_devto_articles,
                scraper=scraper,
                username=request.username,
                provider=provider,
                api_key=request.api_key,
            )
        elif request.platform.lower() == "medium":
            scraper = MediumScraper()
            background_tasks.add_task(
                ingestion.fetch_medium_articles,
                scraper=scraper,
                username=request.username,
                provider=provider,
            )
        else:
            raise HTTPException(
                status_code=400, detail="Invalid platform. Use 'devto' or 'medium'."
            )

        return {
            "status": "processing",
            "message": f"Articles from {request.platform} "
            f"ingestion started in background",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    skip: int = 0,
    limit: int = 100,
    provider: IArticleRepository = Depends(get_article_repo),
):
    try:
        articles = await provider.get_all_articles(skip=skip, limit=limit)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    article: ArticleUpdate,
    provider: IArticleRepository = Depends(get_article_repo),
):
    updated = await provider.update_article(article_id, article)
    if not updated:
        raise HTTPException(status_code=404, detail="Article not found")
    return updated


@router.delete("/{article_id}")
async def delete_article(
    article_id: str, provider: IArticleRepository = Depends(get_article_repo)
):
    deleted = await provider.delete_article(article_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"status": "success"}
