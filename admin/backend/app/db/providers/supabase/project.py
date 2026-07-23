from typing import List, Optional

from app.db.providers.supabase.client import SupabaseClientManager
from app.db.repositories import IProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate


class SupabaseProjectRepository(IProjectRepository):
    def __init__(self):
        self.client = SupabaseClientManager.get_client()

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        project_data = project.model_dump(mode="json")
        response = await self.client.table("projects").insert(project_data).execute()
        if not response.data:
            raise Exception("Failed to create project in Supabase.")
        return ProjectResponse(**response.data[0])

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        start = skip
        end = skip + limit - 1
        response = (
            await self.client.table("projects").select("*").range(start, end).execute()
        )
        return [ProjectResponse(**item) for item in response.data]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        response = (
            await self.client.table("projects")
            .select("*")
            .eq("id", project_id)
            .execute()
        )
        if not response.data:
            return None
        return ProjectResponse(**response.data[0])

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        project_data = project.model_dump(mode="json")
        existing = (
            await self.client.table("projects")
            .select("*")
            .eq("github_url", project_data["github_url"])
            .execute()
        )
        if existing.data:
            proj_id = existing.data[0]["id"]
            response = (
                await self.client.table("projects")
                .update(project_data)
                .eq("id", proj_id)
                .execute()
            )
        else:
            response = (
                await self.client.table("projects").insert(project_data).execute()
            )
        if not response.data:
            raise Exception("Failed to upsert project in Supabase.")
        return ProjectResponse(**response.data[0])

    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        update_data = project.model_dump(mode="json", exclude_unset=True)
        if "github_url" in update_data and update_data["github_url"] is not None:
            update_data["github_url"] = str(update_data["github_url"])
        response = (
            await self.client.table("projects")
            .update(update_data)
            .eq("id", project_id)
            .execute()
        )
        if not response.data:
            return None
        return ProjectResponse(**response.data[0])

    async def delete_project(self, project_id: str) -> bool:
        response = (
            await self.client.table("projects").delete().eq("id", project_id).execute()
        )
        return len(response.data) > 0
