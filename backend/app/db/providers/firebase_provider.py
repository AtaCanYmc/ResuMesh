from typing import List, Optional

from app.db.base import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse


# We will implement this fully when Firebase is selected
class FirebaseProvider(ProjectRepository):
    def __init__(self):
        # Initialize Firebase Admin SDK
        pass

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        raise NotImplementedError("Firebase provider is a stub")

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        raise NotImplementedError("Firebase provider is a stub")

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        raise NotImplementedError("Firebase provider is a stub")
