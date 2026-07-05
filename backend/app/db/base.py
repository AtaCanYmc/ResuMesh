from abc import ABC, abstractmethod
from typing import List, Optional
from app.schemas.project import ProjectCreate, ProjectResponse

class ProjectRepository(ABC):
    @abstractmethod
    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        pass

    @abstractmethod
    async def get_projects(self, skip: int = 0, limit: int = 100) -> List[ProjectResponse]:
        pass

    @abstractmethod
    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        pass
