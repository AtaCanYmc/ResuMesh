"""
GitHub Scraper Service
========================
GitHub REST API'den kullanıcının public repolarını çeker ve
ResuMesh'in `ProjectCreate` şemasına dönüştürür.

Kullanım:
    from app.services.scrapers import GitHubScraperService

    projects = await GitHubScraperService.fetch_repos(
        username="octocat",
        pat="ghp_...",          # opsiyonel — rate limit 60 → 5000/saat
    )

API Referansı:
    GET https://api.github.com/users/{username}/repos
    Docs: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
"""

import logging
import re
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.schemas.project import ProjectCreate
from app.services.scrapers.base import IScraperService
from app.services.scrapers.exceptions import GitHubScraperError

logger = logging.getLogger(__name__)

_GITHUB_API_BASE = "https://api.github.com"
_DEFAULT_TIMEOUT = 15.0
_DEFAULT_PER_PAGE = 100


class GitHubScraperService(IScraperService):
    """
    GitHub REST API'yi kullanarak repo verilerini çeken servis.
    """

    def _build_headers(pat: str | None = None) -> dict[str, str]:
        """
        GitHub API için HTTP header'larını oluşturur.

        Args:
            pat: GitHub Personal Access Token (opsiyonel).
                 Eklenirse rate limit 60/saat → 5000/saat olur.

        Returns:
            Header dict. `User-Agent` her zaman eklenir.
        """
        headers: dict[str, str] = {"User-Agent": "ResuMesh-App"}
        if pat:
            headers["Authorization"] = f"Bearer {pat}"
        return headers

    @staticmethod
    def _parse_repo(raw: dict[str, Any]) -> ProjectCreate:
        """
        GitHub API'nin ham repo dict'ini `ProjectCreate` şemasına dönüştürür.

        Fork repoları bu metoda ulaşmaz; filtreleme `fetch_repos` içinde yapılır.

        Args:
            raw: GitHub API'nin döndürdüğü tek repo nesnesi.

        Returns:
            Veritabanına kaydedilebilir `ProjectCreate` nesnesi.
        """
        primary_lang = raw.get("language")
        languages = [primary_lang] if primary_lang else []
        # repo adı küçük harfli etiket olarak eklenir, dil ile birleştirilir
        tags = list(set(languages + [raw["name"].lower()]))

        return ProjectCreate(
            title=raw["name"],
            description=raw.get("description"),
            github_url=raw["html_url"],
            stars=raw.get("stargazers_count", 0),
            watchers=raw.get("watchers_count", 0),
            forks=raw.get("forks_count", 0),
            languages=languages,
            tags=tags,
            raw_github_data=raw,
        )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def fetch_data(self, username: str, **kwargs) -> list[ProjectCreate]:
        pat = kwargs.get("pat")
        include_forks = kwargs.get("include_forks", False)
        """
        Kullanıcının GitHub repolarını çeker ve `ProjectCreate` listesi döndürür.

        Args:
            username: GitHub kullanıcı adı.
            pat: Personal Access Token (opsiyonel).
            include_forks: True ise fork repolar da dahil edilir.
                           Varsayılan False — yalnızca özgün repolar.

        Returns:
            `ProjectCreate` nesnelerinin listesi.

        Raises:
            GitHubScraperError: API isteği başarısız olursa
                                (4xx / 5xx veya ağ hatası)
                                veya kullanıcı adı geçersizse.
        """
        if not re.match(r"^[a-zA-Z0-9\-]+$", username):
            raise GitHubScraperError("Invalid GitHub username format.")

        url = (
            f"{_GITHUB_API_BASE}/users/{username}/repos"
            f"?per_page={_DEFAULT_PER_PAGE}&sort=updated"
        )
        headers = GitHubScraperService._build_headers(pat)

        logger.info("[GITHUB] Fetching repos for user=%s", username)

        try:
            async with httpx.AsyncClient(timeout=_DEFAULT_TIMEOUT) as client:
                response = await client.get(url, headers=headers)
        except httpx.RequestError as exc:
            raise GitHubScraperError(
                f"Network error while fetching GitHub repos: {exc}"
            ) from exc

        if response.status_code != 200:
            raise GitHubScraperError(
                "GitHub API returned HTTP "
                f"{response.status_code} for user '{username}'."
                f" Response: {response.text[:300]}",
                status_code=response.status_code,
            )

        raw_repos: list[dict] = response.json()
        logger.info("[GITHUB] Received %d repos for user=%s", len(raw_repos), username)

        projects: list[ProjectCreate] = []
        for raw in raw_repos:
            if not include_forks and raw.get("fork"):
                continue
            projects.append(GitHubScraperService._parse_repo(raw))

        logger.info(
            "[GITHUB] Parsed %d repos (include_forks=%s) for user=%s",
            len(projects),
            include_forks,
            username,
        )
        return projects


# Alias for backward compatibility / router imports
GitHubScraper = GitHubScraperService
