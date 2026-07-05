from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.db.base import ProjectRepository
from app.db.factory import get_db_provider
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate, 
    provider: ProjectRepository = Depends(get_db_provider)
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
    provider: ProjectRepository = Depends(get_db_provider)
):
    try:
        projects = await provider.get_projects(skip=skip, limit=limit)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str, 
    provider: ProjectRepository = Depends(get_db_provider)
):
    project = await provider.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
