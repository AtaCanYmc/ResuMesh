from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.base import IProjectRepository
from app.db.dependencies import get_project_repo
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate, provider: IProjectRepository = Depends(get_project_repo)
):
    try:
        result = await provider.create_project(project)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    skip: int = 0,
    limit: int = 100,
    provider: IProjectRepository = Depends(get_project_repo),
):
    try:
        projects = await provider.get_projects(skip=skip, limit=limit)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str, provider: IProjectRepository = Depends(get_project_repo)
):
    project = await provider.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
