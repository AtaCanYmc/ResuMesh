from typing import List, Optional

from sqlalchemy.orm import Session

from app.config.database import Base, SessionLocal, engine
from app.db.base import ProjectRepository
from app.models.article import Article
from app.models.certificate import Certificate
from app.models.experience import Experience
from app.models.project import Project
from app.schemas.article import ArticleCreate, ArticleResponse
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.project import ProjectCreate, ProjectResponse


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
            return ProjectResponse.model_validate(db_project)

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        with self._get_session() as db:
            projects = db.query(Project).offset(skip).limit(limit).all()
            return [ProjectResponse.model_validate(p) for p in projects]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        with self._get_session() as db:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                return ProjectResponse.model_validate(project)
            return None

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        with self._get_session() as db:
            db_project = None
            if project.github_url:
                db_project = (
                    db.query(Project)
                    .filter(Project.github_url == str(project.github_url))
                    .first()
                )

            project_data = project.model_dump()
            if project_data.get("github_url"):
                project_data["github_url"] = str(project_data["github_url"])

            if db_project:
                for key, value in project_data.items():
                    setattr(db_project, key, value)
            else:
                db_project = Project(**project_data)
                db.add(db_project)

            db.commit()
            db.refresh(db_project)
            return ProjectResponse.model_validate(db_project)

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        with self._get_session() as db:
            db_article = (
                db.query(Article).filter(Article.url == str(article.url)).first()
            )
            article_data = article.model_dump()
            article_data["url"] = str(article_data["url"])

            if db_article:
                for key, value in article_data.items():
                    setattr(db_article, key, value)
            else:
                db_article = Article(**article_data)
                db.add(db_article)

            db.commit()
            db.refresh(db_article)
            return ArticleResponse.model_validate(db_article)

    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        with self._get_session() as db:
            db_exp = Experience(**experience.model_dump())
            db.add(db_exp)
            db.commit()
            db.refresh(db_exp)
            return ExperienceResponse.model_validate(db_exp)

    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        with self._get_session() as db:
            cert_data = certificate.model_dump()
            if cert_data.get("credential_url"):
                cert_data["credential_url"] = str(cert_data["credential_url"])
            db_cert = Certificate(**cert_data)
            db.add(db_cert)
            db.commit()
            db.refresh(db_cert)
            return CertificateResponse.model_validate(db_cert)
