from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.base import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse
from app.models.project import Project
from app.config.database import SessionLocal, engine, Base

class PostgresProvider(ProjectRepository):
    def __init__(self):
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)

    def _get_session(self) -> Session:
        return SessionLocal()

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        with self._get_session() as db:
            project_data = project.model_dump()
            if project_data.get("github_url"):
                project_data["github_url"] = str(project_data["github_url"])

            db_project = Project(**project_data)
            db.add(db_project)
            db.commit()
            db.refresh(db_project)
            
            # Convert SQLAlchemy model to Pydantic Response
            return ProjectResponse.model_validate(db_project)

    async def get_projects(self, skip: int = 0, limit: int = 100) -> List[ProjectResponse]:
        with self._get_session() as db:
            projects = db.query(Project).offset(skip).limit(limit).all()
            return [ProjectResponse.model_validate(p) for p in projects]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        with self._get_session() as db:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                return ProjectResponse.model_validate(project)
            return None
