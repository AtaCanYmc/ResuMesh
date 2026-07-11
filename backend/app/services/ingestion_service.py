"""
Ingestion Service
==================
Orchestrates platform scraper services and saves the fetched data
to the database via the repository layer.
"""

from typing import Any, Dict

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISystemLogRepository,
)
from app.services.log_service import LogService
from app.services.mappers.linkedin_mapper import LinkedInDataMapper
from app.services.scrapers.base import IScraperService
from app.services.scrapers.exceptions import ScraperError


class IngestionService:
    def __init__(self, log_provider: ISystemLogRepository = None):
        self.log_provider = log_provider

    async def _execute_scraper(
        self,
        scraper: IScraperService,
        provider,
        platform_name: str,
        username: str,
        **kwargs,
    ):
        try:
            items = await scraper.fetch_data(username, **kwargs)
            for item in items:
                if hasattr(provider, "upsert_project"):
                    await provider.upsert_project(item)
                elif hasattr(provider, "upsert_article"):
                    await provider.upsert_article(item)
                else:
                    raise ValueError(f"Unknown provider type for {platform_name}")
        except ScraperError as exc:
            log_repo = self.log_provider or provider
            await LogService.warning(
                log_repo,
                platform_name,
                f"{platform_name} scraper error: {exc}",
                {
                    "username": username,
                    "status_code": getattr(exc, "status_code", None),
                },
            )

    async def fetch_github_repos(
        self,
        scraper: IScraperService,
        username: str,
        provider: IProjectRepository,
        pat: str | None = None,
        include_forks: bool = False,
    ):
        """Fetches GitHub repositories and saves via provider."""
        await self._execute_scraper(
            scraper, provider, "GITHUB", username, pat=pat, include_forks=include_forks
        )

    async def fetch_devto_articles(
        self,
        scraper: IScraperService,
        username: str,
        provider: IArticleRepository,
        api_key: str | None = None,
    ):
        """Fetches Dev.to articles and saves via provider."""
        await self._execute_scraper(
            scraper, provider, "DEV_TO", username, api_key=api_key
        )

    async def fetch_medium_articles(
        self,
        scraper: IScraperService,
        username: str,
        provider: IArticleRepository,
    ):
        """Fetches Medium RSS articles and saves via provider."""
        await self._execute_scraper(scraper, provider, "MEDIUM", username)

    async def import_linkedin_data(
        self,
        data: Dict[str, Any],
        exp_provider: IExperienceRepository,
        cert_provider: ICertificateRepository,
    ):
        """Processes LinkedIn data package (experiences and certificates)."""
        experiences = LinkedInDataMapper.parse_experiences(data)
        for exp in experiences:
            await exp_provider.create_experience(exp)

        certificates = LinkedInDataMapper.parse_certificates(data)
        for cert in certificates:
            await cert_provider.create_certificate(cert)
