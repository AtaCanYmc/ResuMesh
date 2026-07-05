from typing import List, Optional

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
from app.schemas.article import ArticleCreate, ArticleResponse
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.search import GlobalSearchResponse
from app.schemas.system_log import SystemLogCreate, SystemLogResponse


class SupabaseProvider(
    IProjectRepository,
    IArticleRepository,
    IExperienceRepository,
    ICertificateRepository,
    ISystemLogRepository,
    ISearchRepository,
):
    def __init__(self):
        # Initialize Supabase client
        pass

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_all_articles(self) -> List[ArticleResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_all_experiences(self) -> List[ExperienceResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_all_certificates(self) -> List[CertificateResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_logs(
        self,
        page: int = 1,
        limit: int = 20,
        level: Optional[str] = None,
        module: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_logs_count(
        self, level: Optional[str] = None, module: Optional[str] = None
    ) -> int:
        raise NotImplementedError("Supabase provider is a stub")

    async def global_search(self, query: str) -> GlobalSearchResponse:
        raise NotImplementedError("Supabase provider is a stub")
