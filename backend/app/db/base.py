from abc import ABC, abstractmethod
from typing import List, Optional

from app.schemas.article import ArticleCreate, ArticleResponse
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.search import GlobalSearchResponse
from app.schemas.system_log import SystemLogCreate, SystemLogResponse


class ProjectRepository(ABC):
    @abstractmethod
    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        pass

    @abstractmethod
    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        pass

    @abstractmethod
    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        pass

    @abstractmethod
    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        """Insert or update a project based on github_url"""
        pass

    @abstractmethod
    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        """Insert or update an article based on url"""
        pass

    @abstractmethod
    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        pass

    @abstractmethod
    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        pass

    @abstractmethod
    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        pass

    @abstractmethod
    async def get_logs(
        self,
        page: int = 1,
        limit: int = 20,
        level: Optional[str] = None,
        module: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        pass

    @abstractmethod
    async def get_logs_count(
        self, level: Optional[str] = None, module: Optional[str] = None
    ) -> int:
        pass

    @abstractmethod
    async def global_search(self, query: str) -> GlobalSearchResponse:
        pass
