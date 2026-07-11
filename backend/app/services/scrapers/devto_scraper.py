"""
Dev.to Scraper Service
========================
Dev.to'nun herkese açık REST API'sini kullanarak kullanıcının
makalelerini çeker ve ResuMesh'in `ArticleCreate` şemasına dönüştürür.

Kullanım:
    from app.services.scrapers import DevToScraperService

    articles = await DevToScraperService.fetch_articles(
        username="atacanymc",
        api_key="your_devto_api_key",   # opsiyonel
    )

API Referansı:
    GET https://dev.to/api/articles?username={username}
    Docs: https://developers.forem.com/api/v1#tag/articles/operation/getArticles

API anahtarı almak için:
    https://dev.to/settings/extensions → "DEV Community API Keys"
"""

import logging
import re
from datetime import datetime, timezone

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.schemas.article import ArticleCreate, ArticlePlatform
from app.services.scrapers.base import IScraperService
from app.services.scrapers.exceptions import DevToScraperError

logger = logging.getLogger(__name__)

_DEVTO_API_BASE = "https://dev.to/api"
_DEFAULT_TIMEOUT = 15.0
_DEFAULT_PER_PAGE = 1000


class DevToScraperService(IScraperService):
    """
    Dev.to REST API'sini kullanarak makale verilerini çeken servis.
    """

    def _build_headers(api_key: str | None = None) -> dict[str, str]:
        """
        Dev.to API için HTTP header'larını oluşturur.

        Args:
            api_key: Dev.to API anahtarı (opsiyonel).
                     Eklenirse rate limit artar ve private makaleler dahil edilir.

        Returns:
            Header dict. Accept header her zaman eklenir.
        """
        headers: dict[str, str] = {
            "Accept": "application/vnd.forem.api-v1+json",
        }
        if api_key:
            headers["api-key"] = api_key
        return headers

    @staticmethod
    def _parse_article(raw: dict) -> ArticleCreate:
        """
        Dev.to API'nin ham makale dict'ini `ArticleCreate` şemasına dönüştürür.

        Args:
            raw: Dev.to API'nin döndürdüğü tek makale nesnesi.

        Returns:
            Veritabanına kaydedilebilir `ArticleCreate` nesnesi.
        """
        published_at: datetime | None = None
        if raw.get("published_at"):
            try:
                published_at = datetime.strptime(
                    raw["published_at"], "%Y-%m-%dT%H:%M:%SZ"
                ).replace(tzinfo=timezone.utc)
            except ValueError:
                # Bazı tarihlerde milisaniye veya timezone offset olabilir
                logger.debug(
                    "[DEV_TO] Could not parse date '%s' for article id=%s, using now()",
                    raw.get("published_at"),
                    raw.get("id"),
                )
                published_at = datetime.now(timezone.utc)

        return ArticleCreate(
            title=raw["title"],
            summary=raw.get("description"),
            url=raw["url"],
            platform=ArticlePlatform.DEV_TO,
            reading_time_minutes=raw.get("reading_time_minutes", 0),
            published_at=published_at,
            raw_platform_data=raw,
        )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def fetch_data(self, username: str, **kwargs) -> list[ArticleCreate]:
        api_key = kwargs.get("api_key")
        """
        Dev.to REST API'den kullanıcının makalelerini çeker.

        Args:
            username: Dev.to kullanıcı adı.
            api_key: Dev.to API anahtarı (opsiyonel).

        Returns:
            `ArticleCreate` nesnelerinin listesi.

        Raises:
            DevToScraperError: API isteği başarısız olursa
                               (4xx / 5xx veya ağ hatası) veya kullanıcı adı geçersizse.
        """
        if not re.match(r"^[a-zA-Z0-9\-]+$", username):
            raise DevToScraperError("Invalid DevTo username format.")

        url = (
            f"{_DEVTO_API_BASE}/articles"
            f"?username={username}&per_page={_DEFAULT_PER_PAGE}"
        )
        headers = DevToScraperService._build_headers(api_key)

        logger.info("[DEV_TO] Fetching articles for user=%s", username)

        try:
            async with httpx.AsyncClient(timeout=_DEFAULT_TIMEOUT) as client:
                response = await client.get(url, headers=headers)
        except httpx.RequestError as exc:
            raise DevToScraperError(
                f"Network error while fetching Dev.to articles: {exc}"
            ) from exc

        if response.status_code != 200:
            raise DevToScraperError(
                "Dev.to API returned HTTP "
                f"{response.status_code} for user '{username}'."
                f" Response: {response.text[:300]}",
                status_code=response.status_code,
            )

        raw_articles: list[dict] = response.json()
        logger.info(
            "[DEV_TO] Received %d articles for user=%s", len(raw_articles), username
        )

        articles: list[ArticleCreate] = []
        for raw in raw_articles:
            try:
                articles.append(DevToScraperService._parse_article(raw))
            except Exception as exc:
                # Tek bir kötü makale tüm listeyi bozmasın
                logger.warning(
                    "[DEV_TO] Skipping article id=%s due to parse error: %s",
                    raw.get("id", "unknown"),
                    exc,
                )

        logger.info("[DEV_TO] Parsed %d articles for user=%s", len(articles), username)
        return articles


# Alias for backward compatibility / router imports
DevToScraper = DevToScraperService
