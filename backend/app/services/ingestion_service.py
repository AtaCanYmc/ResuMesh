from datetime import datetime, timezone
from typing import Any, Dict

import feedparser
import httpx

from app.db.base import ProjectRepository
from app.schemas.article import ArticleCreate, ArticlePlatform
from app.schemas.certificate import CertificateCreate
from app.schemas.experience import ExperienceCreate
from app.schemas.project import ProjectCreate
from app.services.log_service import LogService


class IngestionService:
    @staticmethod
    async def fetch_github_repos(
        username: str,
        provider: ProjectRepository,
        log_provider: ProjectRepository = None,
    ):
        """Fetches repos using GitHub REST API and saves via provider."""
        if not log_provider:
            log_provider = provider

        url = f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers={"User-Agent": "ResuMesh-App"})
            if response.status_code != 200:
                await LogService.warning(
                    log_provider,
                    "GITHUB",
                    f"GitHub API error: {response.status_code}",
                    {"url": url},
                )
                return

            repos = response.json()

            for repo in repos:
                if repo.get("fork"):
                    continue

                primary_lang = repo.get("language")
                languages = [primary_lang] if primary_lang else []
                tags = list(set(languages + [repo["name"].lower()]))

                project = ProjectCreate(
                    title=repo["name"],
                    description=repo.get("description"),
                    github_url=repo["html_url"],
                    stars=repo["stargazers_count"],
                    watchers=repo["watchers_count"],
                    forks=repo["forks_count"],
                    languages=languages,
                    tags=tags,
                    raw_github_data=repo,
                )
                await provider.upsert_project(project)

    @staticmethod
    async def fetch_devto_articles(
        username: str,
        provider: ProjectRepository,
        log_provider: ProjectRepository = None,
    ):
        """Fetches articles from Dev.to API and saves via provider."""
        if not log_provider:
            log_provider = provider
        url = f"https://dev.to/api/articles?username={username}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                articles = response.json()
                for art in articles:
                    published_at = None
                    if art.get("published_at"):
                        published_at = datetime.strptime(
                            art["published_at"], "%Y-%m-%dT%H:%M:%SZ"
                        ).replace(tzinfo=timezone.utc)

                    article = ArticleCreate(
                        title=art["title"],
                        summary=art.get("description"),
                        url=art["url"],
                        platform=ArticlePlatform.DEV_TO,
                        reading_time_minutes=art.get("reading_time_minutes", 0),
                        published_at=published_at,
                        raw_platform_data=art,
                    )
                    await provider.upsert_article(article)

    @staticmethod
    async def fetch_medium_articles(username: str, provider: ProjectRepository):
        """Fetches Medium RSS Feed and parses using feedparser."""
        url = f"https://medium.com/feed/@{username}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                feed = feedparser.parse(response.text)
                for entry in feed.entries:
                    clean_url = entry.link.split("?")[0]

                    published_at = None
                    if entry.get("published_parsed"):
                        published_at = datetime(
                            *entry.published_parsed[:6], tzinfo=timezone.utc
                        )
                    else:
                        published_at = datetime.now(timezone.utc)

                    tags = [t.term for t in entry.tags] if entry.get("tags") else []

                    article = ArticleCreate(
                        title=entry.title,
                        summary=entry.get("summary", ""),
                        url=clean_url,
                        platform=ArticlePlatform.MEDIUM,
                        reading_time_minutes=0,
                        published_at=published_at,
                        raw_platform_data={"tags": tags},
                    )
                    await provider.upsert_article(article)

    @staticmethod
    async def import_linkedin_data(data: Dict[str, Any], provider: ProjectRepository):
        """Processes LinkedIn data package (experiences and certificates)."""
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
                await provider.create_experience(experience)

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
                await provider.create_certificate(certificate)
