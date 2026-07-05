import asyncio
import uuid
from datetime import datetime, timezone
from typing import List, Optional

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.db.base import ProjectRepository
from app.db.factory import get_db_provider, get_log_provider
from app.main import app, limiter
from app.schemas.article import ArticleCreate, ArticleResponse
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.search import GlobalSearchResponse, SearchResultItem
from app.schemas.system_log import SystemLogCreate, SystemLogResponse
from app.services.auth_service import get_current_admin

limiter.enabled = False


class MockProvider(ProjectRepository):
    def __init__(self):
        self.projects = []
        self.articles = []
        self.experiences = []
        self.certificates = []
        self.logs = []

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        return self.projects[skip : skip + limit]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        for p in self.projects:
            if p.id == project_id:
                return p
        return None

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        data = project.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = ProjectResponse(**data)
        self.projects.append(resp)
        return resp

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        for i, p in enumerate(self.projects):
            if p.title == project.title:
                data = project.model_dump()
                data["id"] = p.id
                data["created_at"] = p.created_at
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ProjectResponse(**data)
                self.projects[i] = resp
                return resp
        return await self.create_project(project)

    async def create_article(self, article: ArticleCreate) -> ArticleResponse:
        data = article.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = ArticleResponse(**data)
        self.articles.append(resp)
        return resp

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        for i, a in enumerate(self.articles):
            if a.url == article.url:
                data = article.model_dump()
                data["id"] = a.id
                data["created_at"] = a.created_at
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ArticleResponse(**data)
                self.articles[i] = resp
                return resp
        return await self.create_article(article)

    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        data = experience.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = ExperienceResponse(**data)
        self.experiences.append(resp)
        return resp

    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        data = certificate.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        if "issue_date" in data and isinstance(data["issue_date"], str):
            # Parse dummy date if necessary, but schemas handle it usually
            pass
        resp = CertificateResponse(**data)
        self.certificates.append(resp)
        return resp

    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        data = log.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        resp = SystemLogResponse(**data)
        self.logs.append(resp)
        return resp

    async def get_logs(
        self,
        page: int = 1,
        limit: int = 20,
        level: Optional[str] = None,
        module: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        filtered = self.logs
        if level:
            filtered = [log for log in filtered if log.level == level.upper()]
        if module:
            filtered = [log for log in filtered if log.module == module.upper()]

        filtered.sort(key=lambda x: x.created_at, reverse=True)
        start = (page - 1) * limit
        end = start + limit
        return filtered[start:end]

    async def get_logs_count(
        self, level: Optional[str] = None, module: Optional[str] = None
    ) -> int:
        filtered = self.logs
        if level:
            filtered = [log for log in filtered if log.level == level.upper()]
        if module:
            filtered = [log for log in filtered if log.module == module.upper()]
        return len(filtered)

    async def global_search(self, query: str) -> GlobalSearchResponse:
        projects = []
        articles = []
        experiences = []
        certificates = []

        q = query.lower()
        for p in self.projects:
            # simple mock check
            p_langs = " ".join(p.languages).lower() if p.languages else ""
            p_tags = " ".join(p.tags).lower() if p.tags else ""

            if (
                q in p.title.lower()
                or (p.description and q in p.description.lower())
                or (q in p_langs)
                or (q in p_tags)
            ):
                url_val = (
                    str(p.github_url)
                    if p.github_url
                    else (
                        str(p.homepage_url)
                        if hasattr(p, "homepage_url") and p.homepage_url
                        else None
                    )
                )
                projects.append(
                    SearchResultItem(
                        id=p.id,
                        title=p.title,
                        subtitle=p.description[:100] if p.description else None,
                        url=url_val,
                        tags=(p.languages or []) + (p.tags or []),
                        date=p.created_at.strftime("%Y-%m") if p.created_at else None,
                    )
                )
        for a in self.articles:
            if q in a.title.lower() or (
                hasattr(a, "summary") and a.summary and q in a.summary.lower()
            ):
                url_val = str(a.url) if a.url else None
                p_val = a.platform.value if hasattr(a.platform, "value") else a.platform
                articles.append(
                    SearchResultItem(
                        id=a.id,
                        title=a.title,
                        subtitle=f"Platform: {p_val}",
                        url=url_val,
                        date=(
                            a.published_at.strftime("%Y-%m") if a.published_at else None
                        ),
                    )
                )

        return GlobalSearchResponse(
            query=query,
            projects=projects,
            articles=articles,
            experiences=experiences,
            certificates=certificates,
        )

    async def get_all_experiences(self) -> List[ExperienceResponse]:
        return self.experiences

    async def get_all_articles(self) -> List[ArticleResponse]:
        return self.articles

    async def get_all_certificates(self) -> List[CertificateResponse]:
        return self.certificates


@pytest.fixture(scope="session")
def event_loop():
    """Asenkron testler için session seviyesinde event loop oluşturur."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_provider():
    """Her test için temiz bir bellekiçi veri tabanı sunar."""
    return MockProvider()


async def override_get_current_admin():
    return {"username": "admin", "role": "admin"}


@pytest_asyncio.fixture
async def client(mock_provider):
    """FastAPI bağımlılıklarını mock'layarak asenkron bir HTTP istemcisi döner."""

    def override_get_provider():
        return mock_provider

    app.dependency_overrides[get_db_provider] = override_get_provider
    app.dependency_overrides[get_log_provider] = override_get_provider
    app.dependency_overrides[get_current_admin] = override_get_current_admin

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
