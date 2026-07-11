from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel

from app.core.exceptions import ProjectNotFoundError
from app.db.base import IProjectRepository
from app.db.dependencies import get_project_repo
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.auth_service import get_current_admin
from app.services.ingestion_service import IngestionService
from app.services.scrapers.github_scraper import GitHubScraper

router = APIRouter(prefix="/projects", tags=["projects"])


class ProjectRefreshRequest(BaseModel):
    username: str
    pat: str | None = None
    include_forks: bool = False


@router.post("/refresh", response_model=dict)
async def refresh_projects(
    request: ProjectRefreshRequest,
    background_tasks: BackgroundTasks,
    provider: IProjectRepository = Depends(get_project_repo),
    admin: dict = Depends(get_current_admin),
):
    try:
        ingestion = IngestionService()
        scraper = GitHubScraper()
        background_tasks.add_task(
            ingestion.fetch_github_repos,
            scraper=scraper,
            username=request.username,
            provider=provider,
            pat=request.pat,
            include_forks=request.include_forks,
        )
        return {
            "status": "processing",
            "message": "Projects ingestion started in background",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate, provider: IProjectRepository = Depends(get_project_repo)
):
    return await provider.create_project(project)


@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    provider: IProjectRepository = Depends(get_project_repo),
):
    return await provider.get_projects(skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str, provider: IProjectRepository = Depends(get_project_repo)
):
    project = await provider.get_project_by_id(project_id)
    if not project:
        raise ProjectNotFoundError(project_id)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project: ProjectUpdate,
    provider: IProjectRepository = Depends(get_project_repo),
):
    updated = await provider.update_project(project_id, project)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.delete("/{project_id}")
async def delete_project(
    project_id: str, provider: IProjectRepository = Depends(get_project_repo)
):
    deleted = await provider.delete_project(project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "success"}
