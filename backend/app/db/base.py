from abc import ABC, abstractmethod
from typing import List, Optional

from app.schemas.article import ArticleCreate, ArticleResponse
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.project import ProjectCreate, ProjectResponse


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
