# flake8: noqa: E402
import os

os.environ["JWT_SECRET_KEY"] = "test-secret-key"
os.environ["ENABLE_ADMIN_WORKSPACE"] = "true"

import asyncio
import uuid
from datetime import datetime, timezone
from typing import List, Optional

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.db.dependencies import (
    get_article_repo,
    get_certificate_repo,
    get_experience_repo,
    get_project_repo,
    get_search_repo,
    get_system_log_repo,
)
from app.db.repositories import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
from app.main import app, limiter
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.schemas.search import GlobalSearchResponse, SearchResultItem
from app.schemas.system_log import SystemLogCreate, SystemLogResponse

limiter.enabled = False

# --- SHARED IN-MEMORY STATE ---
MOCK_DB_STATE = {
    "projects": [],
    "articles": [],
    "experiences": [],
    "certificates": [],
    "logs": [],
}


# --- GRANULAR MOCK REPOSITORIES ---
class MockProjectRepository(IProjectRepository):
    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        return MOCK_DB_STATE["projects"][skip : skip + limit]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        for p in MOCK_DB_STATE["projects"]:
            if p.id == project_id:
                return p
        return None

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        data = project.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = ProjectResponse(**data)
        MOCK_DB_STATE["projects"].append(resp)
        return resp

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        for i, p in enumerate(MOCK_DB_STATE["projects"]):
            if p.title == project.title:
                data = project.model_dump()
                data["id"] = p.id
                data["created_at"] = p.created_at
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ProjectResponse(**data)
                MOCK_DB_STATE["projects"][i] = resp
                return resp
        return await self.create_project(project)

    async def update_project(
        self, project_id: str, project_update: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        for i, p in enumerate(MOCK_DB_STATE["projects"]):
            if p.id == project_id:
                data = p.model_dump()
                for k, v in project_update.model_dump(exclude_unset=True).items():
                    data[k] = v
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ProjectResponse(**data)
                MOCK_DB_STATE["projects"][i] = resp
                return resp
        return None

    async def delete_project(self, project_id: str) -> bool:
        for i, p in enumerate(MOCK_DB_STATE["projects"]):
            if p.id == project_id:
                del MOCK_DB_STATE["projects"][i]
                return True
        return False


class MockArticleRepository(IArticleRepository):
    async def create_article(self, article: ArticleCreate) -> ArticleResponse:
        data = article.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = ArticleResponse(**data)
        MOCK_DB_STATE["articles"].append(resp)
        return resp

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        for i, a in enumerate(MOCK_DB_STATE["articles"]):
            if a.url == article.url:
                data = article.model_dump()
                data["id"] = a.id
                data["created_at"] = a.created_at
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ArticleResponse(**data)
                MOCK_DB_STATE["articles"][i] = resp
                return resp
        return await self.create_article(article)

    async def get_all_articles(
        self, skip: int = 0, limit: int = 100
    ) -> List[ArticleResponse]:
        return MOCK_DB_STATE["articles"][skip : skip + limit]

    async def update_article(
        self, article_id: str, article_update: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        for i, a in enumerate(MOCK_DB_STATE["articles"]):
            if a.id == article_id:
                data = a.model_dump()
                for k, v in article_update.model_dump(exclude_unset=True).items():
                    data[k] = v
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ArticleResponse(**data)
                MOCK_DB_STATE["articles"][i] = resp
                return resp
        return None

    async def delete_article(self, article_id: str) -> bool:
        for i, a in enumerate(MOCK_DB_STATE["articles"]):
            if a.id == article_id:
                del MOCK_DB_STATE["articles"][i]
                return True
        return False


class MockExperienceRepository(IExperienceRepository):
    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        data = experience.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = ExperienceResponse(**data)
        MOCK_DB_STATE["experiences"].append(resp)
        return resp

    async def get_all_experiences(
        self, skip: int = 0, limit: int = 100
    ) -> List[ExperienceResponse]:
        return MOCK_DB_STATE["experiences"][skip : skip + limit]

    async def update_experience(
        self, experience_id: str, experience_update: ExperienceUpdate
    ) -> Optional[ExperienceResponse]:
        for i, e in enumerate(MOCK_DB_STATE["experiences"]):
            if e.id == experience_id:
                data = e.model_dump()
                for k, v in experience_update.model_dump(exclude_unset=True).items():
                    data[k] = v
                data["updated_at"] = datetime.now(timezone.utc)
                resp = ExperienceResponse(**data)
                MOCK_DB_STATE["experiences"][i] = resp
                return resp
        return None

    async def delete_experience(self, experience_id: str) -> bool:
        for i, e in enumerate(MOCK_DB_STATE["experiences"]):
            if e.id == experience_id:
                del MOCK_DB_STATE["experiences"][i]
                return True
        return False


class MockCertificateRepository(ICertificateRepository):
    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        data = certificate.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        data["updated_at"] = datetime.now(timezone.utc)
        resp = CertificateResponse(**data)
        MOCK_DB_STATE["certificates"].append(resp)
        return resp

    async def get_all_certificates(
        self, skip: int = 0, limit: int = 100
    ) -> List[CertificateResponse]:
        return MOCK_DB_STATE["certificates"][skip : skip + limit]

    async def update_certificate(
        self, certificate_id: str, certificate_update: CertificateUpdate
    ) -> Optional[CertificateResponse]:
        for i, c in enumerate(MOCK_DB_STATE["certificates"]):
            if c.id == certificate_id:
                data = c.model_dump()
                for k, v in certificate_update.model_dump(exclude_unset=True).items():
                    data[k] = v
                data["updated_at"] = datetime.now(timezone.utc)
                resp = CertificateResponse(**data)
                MOCK_DB_STATE["certificates"][i] = resp
                return resp
        return None

    async def delete_certificate(self, certificate_id: str) -> bool:
        for i, c in enumerate(MOCK_DB_STATE["certificates"]):
            if c.id == certificate_id:
                del MOCK_DB_STATE["certificates"][i]
                return True
        return False


class MockSystemLogRepository(ISystemLogRepository):
    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        data = log.model_dump()
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.now(timezone.utc)
        resp = SystemLogResponse(**data)
        MOCK_DB_STATE["logs"].append(resp)
        return resp

    async def get_logs(
        self,
        page: int = 1,
        limit: int = 20,
        level: Optional[str] = None,
        module: Optional[str] = None,
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        filtered = MOCK_DB_STATE["logs"]
        if level:
            filtered = [log for log in filtered if log.level == level.upper()]
        if module:
            filtered = [log for log in filtered if log.module == module.upper()]
        if search_query:
            filtered = [
                log for log in filtered if search_query.lower() in log.message.lower()
            ]
        if start_date:
            filtered = [log for log in filtered if log.created_at >= start_date]
        if end_date:
            filtered = [log for log in filtered if log.created_at <= end_date]

        filtered.sort(key=lambda x: x.created_at, reverse=True)
        start = (page - 1) * limit
        end = start + limit
        return filtered[start:end]

    async def get_logs_count(
        self,
        level: Optional[str] = None,
        module: Optional[str] = None,
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> int:
        filtered = MOCK_DB_STATE["logs"]
        if level:
            filtered = [log for log in filtered if log.level == level.upper()]
        if module:
            filtered = [log for log in filtered if log.module == module.upper()]
        if search_query:
            filtered = [
                log for log in filtered if search_query.lower() in log.message.lower()
            ]
        if start_date:
            filtered = [log for log in filtered if log.created_at >= start_date]
        if end_date:
            filtered = [log for log in filtered if log.created_at <= end_date]
        return len(filtered)


class MockSearchRepository(ISearchRepository):
    async def global_search(self, query: str) -> GlobalSearchResponse:
        projects = []
        articles = []
        experiences = []
        certificates = []

        q = query.lower()
        for p in MOCK_DB_STATE["projects"]:
            p_langs = " ".join(p.languages).lower() if p.languages else ""
            p_tags = " ".join(p.tags).lower() if p.tags else ""

            if (
                q in p.title.lower()
                or (p.description and q in p.description.lower())
                or (q in p_langs)
                or (q in p_tags)
            ):
                url_val = str(p.url) if p.url else None
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

        for a in MOCK_DB_STATE["articles"]:
            if (q in a.title.lower()) or (a.summary and q in a.summary.lower()):
                url_val = str(a.url) if a.url else None
                articles.append(
                    SearchResultItem(
                        id=a.id,
                        title=a.title,
                        subtitle=a.summary[:100] if a.summary else None,
                        url=url_val,
                        tags=[],
                        date=(
                            a.published_at.strftime("%Y-%m-%d")
                            if a.published_at
                            else None
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


# --- WRAPPER FOR BACKWARD COMPATIBILITY IN TESTS ---
class MockProviderWrapper:
    """Wrapper that combines the mocks for test backwards compatibility"""

    def __init__(self):
        self.project_repo = MockProjectRepository()
        self.article_repo = MockArticleRepository()
        self.exp_repo = MockExperienceRepository()
        self.cert_repo = MockCertificateRepository()
        self.log_repo = MockSystemLogRepository()
        self.search_repo = MockSearchRepository()

    # Delegate methods to inner repos
    async def create_project(self, project):
        return await self.project_repo.create_project(project)

    async def upsert_project(self, project):
        return await self.project_repo.upsert_project(project)

    async def get_projects(self):
        return await self.project_repo.get_projects()

    async def create_log(self, log):
        return await self.log_repo.create_log(log)

    async def get_logs(self, **kwargs):
        return await self.log_repo.get_logs(**kwargs)

    async def create_article(self, article):
        return await self.article_repo.create_article(article)


@pytest.fixture(scope="session")
def event_loop():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
def clean_mock_state():
    """Temiz bir state sağlar"""
    MOCK_DB_STATE["projects"].clear()
    MOCK_DB_STATE["articles"].clear()
    MOCK_DB_STATE["experiences"].clear()
    MOCK_DB_STATE["certificates"].clear()
    MOCK_DB_STATE["logs"].clear()


@pytest.fixture
def mock_provider():
    return MockProviderWrapper()


@pytest_asyncio.fixture
async def client(mock_provider):
    """FastAPI istemcisi döner, bağımlılıkları granular mocklar ile ezer."""
    from unittest.mock import MagicMock

    mock_db = MagicMock()
    mock_db.query.return_value.all.return_value = []

    from app.db.dependencies import get_db

    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_project_repo] = lambda: mock_provider.project_repo
    app.dependency_overrides[get_article_repo] = lambda: mock_provider.article_repo
    app.dependency_overrides[get_experience_repo] = lambda: mock_provider.exp_repo
    app.dependency_overrides[get_certificate_repo] = lambda: mock_provider.cert_repo
    app.dependency_overrides[get_system_log_repo] = lambda: mock_provider.log_repo
    app.dependency_overrides[get_search_repo] = lambda: mock_provider.search_repo
    # Güvenlik zafiyeti (global mock) kaldırıldı.
    # Artık yetki gerektiren istekler 401/403 döner.

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
