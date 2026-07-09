from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import ProjectNotFoundError
from app.db.base import IProjectRepository
from app.db.dependencies import get_project_repo
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])


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
