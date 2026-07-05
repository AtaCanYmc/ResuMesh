import os
from typing import List, Optional
from fastapi import HTTPException
from app.db.base import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse

# We will implement this fully when Supabase is selected
class SupabaseProvider(ProjectRepository):
    def __init__(self):
        # Initialize Supabase client
        pass

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_projects(self, skip: int = 0, limit: int = 100) -> List[ProjectResponse]:
        raise NotImplementedError("Supabase provider is a stub")

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        raise NotImplementedError("Supabase provider is a stub")
