"""
Medium Scraper Service
========================
Medium'un herkese açık RSS besleme URL'ini kullanarak kullanıcının
makalelerini çeker ve ResuMesh'in `ArticleCreate` şemasına dönüştürür.

Kullanım:
    from app.services.scrapers import MediumScraperService

    articles = await MediumScraperService.fetch_articles(username="atacanymc")

Besleme URL formatı:
    https://medium.com/feed/@{username}

Not:
    Medium RSS beslemesi API anahtarı gerektirmez. feedparser ile parse edilir.
    Medium, RSS içeriklerinde HTML gömebilir; özet alanı ham HTML içerebilir.
"""

import html
import logging
import re
from datetime import datetime, timezone

import feedparser
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.schemas.article import ArticleCreate, ArticlePlatform
from app.services.scrapers.base import IScraperService
from app.services.scrapers.exceptions import MediumScraperError

logger = logging.getLogger(__name__)

_MEDIUM_FEED_BASE = "https://medium.com/feed/@{username}"
_DEFAULT_TIMEOUT = 20.0


class MediumScraperService(IScraperService):
    """
    Medium RSS beslemesini çekip parse eden servis.
    """

    def _parse_entry(entry: feedparser.FeedParserDict) -> ArticleCreate:
        """
        feedparser'ın tek bir RSS girdisini `ArticleCreate` şemasına dönüştürür.

        Args:
            entry: feedparser tarafından parse edilmiş RSS girdisi.

        Returns:
            Veritabanına kaydedilebilir `ArticleCreate` nesnesi.
        """
        # UTM ve tracking parametrelerini URL'den temizle
        clean_url = entry.link.split("?")[0]

        # Yayın tarihini UTC datetime'a çevir
        if entry.get("published_parsed"):
            published_at = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
        else:
            published_at = datetime.now(timezone.utc)
            logger.debug(
                "[MEDIUM] No published_parsed for entry='%s', using now()",
                entry.get("title", "unknown"),
            )

        tags = [t.term for t in entry.tags] if entry.get("tags") else []

        raw_summary = entry.get("summary", "") or ""
        clean_summary = re.sub(r"<[^>]+>", "", raw_summary).strip()
        clean_summary = html.unescape(clean_summary)

        return ArticleCreate(
            title=entry.title,
            summary=clean_summary,
            url=clean_url,
            platform=ArticlePlatform.MEDIUM,
            reading_time_minutes=0,  # Medium RSS bu bilgiyi sağlamaz
            published_at=published_at,
            raw_platform_data={"tags": tags},
        )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def fetch_data(self, username: str, **kwargs) -> list[ArticleCreate]:
        """
        Medium RSS beslemesinden kullanıcının makalelerini çeker.

        Args:
            username: Medium kullanıcı adı (@ işareti olmadan).

        Returns:
            `ArticleCreate` nesnelerinin listesi.

        Raises:
            MediumScraperError: RSS beslemesi çekilemezse veya
                                HTTP hatası oluşursa veya kullanıcı adı geçersizse.
        """
        if not re.match(r"^[a-zA-Z0-9\-]+$", username):
            raise MediumScraperError("Invalid Medium username format.")

        url = _MEDIUM_FEED_BASE.format(username=username)
        logger.info("[MEDIUM] Fetching RSS feed for user=%s", username)

        try:
            async with httpx.AsyncClient(
                timeout=_DEFAULT_TIMEOUT, follow_redirects=True
            ) as client:
                response = await client.get(url)
        except httpx.RequestError as exc:
            raise MediumScraperError(
                f"Network error while fetching Medium RSS feed: {exc}"
            ) from exc

        if response.status_code != 200:
            raise MediumScraperError(
                "Medium RSS returned HTTP "
                f"{response.status_code} for user '{username}'."
                f" Response: {response.text[:300]}",
                status_code=response.status_code,
            )

        feed = feedparser.parse(response.text)

        # bozo=True → feedparser kötü biçimlendirilmiş XML uyarısı verdi
        # Devam edebiliyorsak devam et, sadece logla
        if feed.bozo:
            logger.warning(
                "[MEDIUM] RSS parse warning for user=%s: %s",
                username,
                feed.bozo_exception,
            )

        logger.info(
            "[MEDIUM] Received %d entries from RSS for user=%s",
            len(feed.entries),
            username,
        )

        articles: list[ArticleCreate] = []
        for entry in feed.entries:
            try:
                articles.append(MediumScraperService._parse_entry(entry))
            except Exception as exc:
                # Tek bir kötü entry tüm listeyi bozmasın
                logger.warning(
                    "[MEDIUM] Skipping entry title='%s' due to parse error: %s",
                    entry.get("title", "unknown"),
                    exc,
                )

        logger.info("[MEDIUM] Parsed %d articles for user=%s", len(articles), username)
        return articles


# Alias for backward compatibility / router imports
MediumScraper = MediumScraperService
