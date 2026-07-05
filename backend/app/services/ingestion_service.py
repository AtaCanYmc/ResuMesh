"""
Ingestion Service
==================
Platform scraper servislerini orkestre eder ve çekilen verileri
repository katmanı aracılığıyla veritabanına kaydeder.

Scraping mantığı bu serviste bulunmaz; her platform için ayrı
servis sınıfları kullanılır:
    - GitHubScraperService  → app/services/scrapers/github_scraper.py
    - MediumScraperService  → app/services/scrapers/medium_scraper.py
    - DevToScraperService   → app/services/scrapers/devto_scraper.py
"""

from datetime import datetime
from typing import Any, Dict

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISystemLogRepository,
)
from app.schemas.certificate import CertificateCreate
from app.schemas.experience import ExperienceCreate
from app.services.log_service import LogService
from app.services.scrapers.devto_scraper import DevToScraperService
from app.services.scrapers.exceptions import ScraperError
from app.services.scrapers.github_scraper import GitHubScraperService
from app.services.scrapers.medium_scraper import MediumScraperService


class IngestionService:
    @staticmethod
    async def fetch_github_repos(
        username: str,
        provider: IProjectRepository,
        log_provider: ISystemLogRepository = None,
    ):
        """GitHub repolarını çeker ve provider üzerinden kaydeder."""
        if not log_provider:
            log_provider = provider

        try:
            projects = await GitHubScraperService.fetch_repos(username)
            for project in projects:
                await provider.upsert_project(project)
        except ScraperError as exc:
            await LogService.warning(
                log_provider,
                "GITHUB",
                f"GitHub scraper error: {exc}",
                {"username": username, "status_code": exc.status_code},
            )

    @staticmethod
    async def fetch_devto_articles(
        username: str,
        provider: IArticleRepository,
        log_provider: ISystemLogRepository = None,
    ):
        """Dev.to makalelerini çeker ve provider üzerinden kaydeder."""
        if not log_provider:
            log_provider = provider

        try:
            articles = await DevToScraperService.fetch_articles(username)
            for article in articles:
                await provider.upsert_article(article)
        except ScraperError as exc:
            await LogService.warning(
                log_provider,
                "DEV_TO",
                f"Dev.to scraper error: {exc}",
                {"username": username, "status_code": exc.status_code},
            )

    @staticmethod
    async def fetch_medium_articles(
        username: str,
        provider: IArticleRepository,
        log_provider: ISystemLogRepository = None,
    ):
        """Medium RSS makalelerini çeker ve provider üzerinden kaydeder."""
        if not log_provider:
            log_provider = provider

        try:
            articles = await MediumScraperService.fetch_articles(username)
            for article in articles:
                await provider.upsert_article(article)
        except ScraperError as exc:
            await LogService.warning(
                log_provider,
                "MEDIUM",
                f"Medium scraper error: {exc}",
                {"username": username, "status_code": exc.status_code},
            )

    @staticmethod
    async def import_linkedin_data(
        data: Dict[str, Any],
        exp_provider: IExperienceRepository,
        cert_provider: ICertificateRepository,
    ):
        """LinkedIn veri paketini (deneyimler ve sertifikalar) işler."""
        if "experiences" in data:
            for exp in data["experiences"]:
                start_date = None
                end_date = None
                if exp.get("start_date"):
                    start_date = datetime.strptime(exp["start_date"], "%Y-%m").date()
                if exp.get("end_date"):
                    end_date = datetime.strptime(exp["end_date"], "%Y-%m").date()

                experience = ExperienceCreate(
                    company_name=exp["company"],
                    title=exp["title"],
                    location=exp.get("location"),
                    start_date=start_date,
                    end_date=end_date,
                    is_current=exp.get("is_current", False),
                    description=exp.get("description"),
                )
                await exp_provider.create_experience(experience)

        if "certificates" in data:
            for cert in data["certificates"]:
                issue_date = None
                if cert.get("issue_date"):
                    issue_date = datetime.strptime(cert["issue_date"], "%Y-%m").date()

                certificate = CertificateCreate(
                    name=cert["name"],
                    issuing_organization=cert["authority"],
                    issue_date=issue_date,
                    credential_id=cert.get("license_number"),
                    credential_url=cert.get("url"),
                )
                await cert_provider.create_certificate(certificate)
