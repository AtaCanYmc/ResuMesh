from abc import ABC, abstractmethod
from typing import List, Optional

from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from app.schemas.education import EducationCreate, EducationResponse, EducationUpdate
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.schemas.search import GlobalSearchResponse
from app.schemas.skill import SkillCreate, SkillResponse, SkillUpdate
from app.schemas.system_log import SystemLogCreate, SystemLogResponse


class IProjectRepository(ABC):
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
    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        pass

    @abstractmethod
    async def delete_project(self, project_id: str) -> bool:
        pass


class IArticleRepository(ABC):
    @abstractmethod
    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        """Insert or update an article based on url"""
        pass

    @abstractmethod
    async def get_all_articles(
        self, skip: int = 0, limit: int = 100
    ) -> List[ArticleResponse]:
        pass

    @abstractmethod
    async def update_article(
        self, article_id: str, article: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        pass

    @abstractmethod
    async def delete_article(self, article_id: str) -> bool:
        pass


class IExperienceRepository(ABC):
    @abstractmethod
    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        pass

    @abstractmethod
    async def get_all_experiences(
        self, skip: int = 0, limit: int = 100
    ) -> List[ExperienceResponse]:
        pass

    @abstractmethod
    async def update_experience(
        self, experience_id: str, experience: ExperienceUpdate
    ) -> Optional[ExperienceResponse]:
        pass

    @abstractmethod
    async def delete_experience(self, experience_id: str) -> bool:
        pass


class ICertificateRepository(ABC):
    @abstractmethod
    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        pass

    @abstractmethod
    async def get_all_certificates(
        self, skip: int = 0, limit: int = 100
    ) -> List[CertificateResponse]:
        pass

    @abstractmethod
    async def update_certificate(
        self, certificate_id: str, certificate: CertificateUpdate
    ) -> Optional[CertificateResponse]:
        pass

    @abstractmethod
    async def delete_certificate(self, certificate_id: str) -> bool:
        pass


class ISystemLogRepository(ABC):
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
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        pass

    @abstractmethod
    async def get_logs_count(
        self,
        level: Optional[str] = None,
        module: Optional[str] = None,
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> int:
        pass


class ISearchRepository(ABC):
    @abstractmethod
    async def global_search(self, query: str) -> GlobalSearchResponse:
        pass


class IEducationRepository(ABC):
    @abstractmethod
    def get_educations(
        self, skip: int = 0, limit: int = 100
    ) -> List[EducationResponse]:
        pass

    @abstractmethod
    def get_education_by_id(self, education_id: str) -> Optional[EducationResponse]:
        pass

    @abstractmethod
    def create_education(self, education: EducationCreate) -> EducationResponse:
        pass

    @abstractmethod
    def update_education(
        self, education_id: str, education: EducationUpdate
    ) -> Optional[EducationResponse]:
        pass

    @abstractmethod
    def delete_education(self, education_id: str) -> bool:
        pass


class ISkillRepository(ABC):
    @abstractmethod
    def get_skills(self, skip: int = 0, limit: int = 100) -> List[SkillResponse]:
        pass

    @abstractmethod
    def get_skill_by_id(self, skill_id: str) -> Optional[SkillResponse]:
        pass

    @abstractmethod
    def create_skill(self, skill: SkillCreate) -> SkillResponse:
        pass

    @abstractmethod
    def update_skill(
        self, skill_id: str, skill: SkillUpdate
    ) -> Optional[SkillResponse]:
        pass

    @abstractmethod
    def delete_skill(self, skill_id: str) -> bool:
        pass
