from typing import List, Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
from app.models.article import Article
from app.models.certificate import Certificate
from app.models.experience import Experience
from app.models.project import Project
from app.models.system_log import SystemLog
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.schemas.search import GlobalSearchResponse, SearchResultItem
from app.schemas.system_log import SystemLogCreate, SystemLogResponse


class BasePostgresRepository:
    def _get_session(self) -> Session:
        return SessionLocal()


class PostgresProjectRepository(BasePostgresRepository, IProjectRepository):
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

    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        with self._get_session() as db:
            db_project = db.query(Project).filter(Project.id == project_id).first()
            if not db_project:
                return None

            project_data = project.model_dump(exclude_unset=True)
            if project_data.get("github_url"):
                project_data["github_url"] = str(project_data["github_url"])

            for key, value in project_data.items():
                setattr(db_project, key, value)

            db.commit()
            db.refresh(db_project)
            return ProjectResponse.model_validate(db_project)

    async def delete_project(self, project_id: str) -> bool:
        with self._get_session() as db:
            db_project = db.query(Project).filter(Project.id == project_id).first()
            if not db_project:
                return False
            db.delete(db_project)
            db.commit()
            return True


class PostgresArticleRepository(BasePostgresRepository, IArticleRepository):
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

    async def get_all_articles(self) -> List[ArticleResponse]:
        with self._get_session() as db:
            articles = db.query(Article).order_by(Article.published_at.desc()).all()
            return [ArticleResponse.model_validate(a) for a in articles]

    async def update_article(
        self, article_id: str, article: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        with self._get_session() as db:
            db_article = db.query(Article).filter(Article.id == article_id).first()
            if not db_article:
                return None

            article_data = article.model_dump(exclude_unset=True)
            if article_data.get("url"):
                article_data["url"] = str(article_data["url"])

            for key, value in article_data.items():
                setattr(db_article, key, value)

            db.commit()
            db.refresh(db_article)
            return ArticleResponse.model_validate(db_article)

    async def delete_article(self, article_id: str) -> bool:
        with self._get_session() as db:
            db_article = db.query(Article).filter(Article.id == article_id).first()
            if not db_article:
                return False
            db.delete(db_article)
            db.commit()
            return True


class PostgresExperienceRepository(BasePostgresRepository, IExperienceRepository):
    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        with self._get_session() as db:
            db_exp = Experience(**experience.model_dump())
            db.add(db_exp)
            db.commit()
            db.refresh(db_exp)
            return ExperienceResponse.model_validate(db_exp)

    async def get_all_experiences(self) -> List[ExperienceResponse]:
        with self._get_session() as db:
            experiences = (
                db.query(Experience).order_by(Experience.start_date.desc()).all()
            )
            return [ExperienceResponse.model_validate(e) for e in experiences]

    async def update_experience(
        self, experience_id: str, experience: ExperienceUpdate
    ) -> Optional[ExperienceResponse]:
        with self._get_session() as db:
            db_exp = db.query(Experience).filter(Experience.id == experience_id).first()
            if not db_exp:
                return None

            exp_data = experience.model_dump(exclude_unset=True)
            for key, value in exp_data.items():
                setattr(db_exp, key, value)

            db.commit()
            db.refresh(db_exp)
            return ExperienceResponse.model_validate(db_exp)

    async def delete_experience(self, experience_id: str) -> bool:
        with self._get_session() as db:
            db_exp = db.query(Experience).filter(Experience.id == experience_id).first()
            if not db_exp:
                return False
            db.delete(db_exp)
            db.commit()
            return True


class PostgresCertificateRepository(BasePostgresRepository, ICertificateRepository):
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

    async def get_all_certificates(self) -> List[CertificateResponse]:
        with self._get_session() as db:
            certificates = (
                db.query(Certificate).order_by(Certificate.issue_date.desc()).all()
            )
            return [CertificateResponse.model_validate(c) for c in certificates]

    async def update_certificate(
        self, certificate_id: str, certificate: CertificateUpdate
    ) -> Optional[CertificateResponse]:
        with self._get_session() as db:
            db_cert = (
                db.query(Certificate).filter(Certificate.id == certificate_id).first()
            )
            if not db_cert:
                return None

            cert_data = certificate.model_dump(exclude_unset=True)
            if cert_data.get("credential_url"):
                cert_data["credential_url"] = str(cert_data["credential_url"])

            for key, value in cert_data.items():
                setattr(db_cert, key, value)

            db.commit()
            db.refresh(db_cert)
            return CertificateResponse.model_validate(db_cert)

    async def delete_certificate(self, certificate_id: str) -> bool:
        with self._get_session() as db:
            db_cert = (
                db.query(Certificate).filter(Certificate.id == certificate_id).first()
            )
            if not db_cert:
                return False
            db.delete(db_cert)
            db.commit()
            return True


class PostgresSystemLogRepository(BasePostgresRepository, ISystemLogRepository):
    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        with self._get_session() as db:
            db_log = SystemLog(**log.model_dump())
            db.add(db_log)
            db.commit()
            db.refresh(db_log)
            return SystemLogResponse.model_validate(db_log)

    async def get_logs(
        self,
        page: int = 1,
        limit: int = 20,
        level: Optional[str] = None,
        module: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        with self._get_session() as db:
            query = db.query(SystemLog)
            if level:
                query = query.filter(SystemLog.level == level.upper())
            if module:
                query = query.filter(SystemLog.module == module.upper())

            logs = (
                query.order_by(SystemLog.created_at.desc())
                .offset((page - 1) * limit)
                .limit(limit)
                .all()
            )
            return [SystemLogResponse.model_validate(log_item) for log_item in logs]

    async def get_logs_count(
        self, level: Optional[str] = None, module: Optional[str] = None
    ) -> int:
        with self._get_session() as db:
            query = db.query(SystemLog)
            if level:
                query = query.filter(SystemLog.level == level.upper())
            if module:
                query = query.filter(SystemLog.module == module.upper())
            return query.count()


class PostgresSearchRepository(BasePostgresRepository, ISearchRepository):
    async def global_search(self, query: str) -> GlobalSearchResponse:
        search_term = f"%{query}%"

        with self._get_session() as db:
            # Search Projects
            projects_db = (
                db.query(Project)
                .filter(
                    or_(
                        Project.title.ilike(search_term),
                        Project.description.ilike(search_term),
                        Project.languages.any(query.capitalize()),
                        Project.tags.any(query.lower()),
                    )
                )
                .limit(10)
                .all()
            )
            projects = [
                SearchResultItem(
                    id=str(p.id),
                    title=p.title,
                    subtitle=p.description[:100] if p.description else None,
                    url=p.github_url,
                    tags=(p.languages or []) + (p.tags or []),
                    date=p.created_at.strftime("%Y-%m") if p.created_at else None,
                )
                for p in projects_db
            ]

            # Search Articles
            articles_db = (
                db.query(Article)
                .filter(
                    or_(
                        Article.title.ilike(search_term),
                        Article.summary.ilike(search_term),
                    )
                )
                .limit(10)
                .all()
            )
            articles = [
                SearchResultItem(
                    id=str(a.id),
                    title=a.title,
                    subtitle=f"Platform: {a.platform}",
                    url=a.url,
                    date=a.published_at.strftime("%Y-%m") if a.published_at else None,
                )
                for a in articles_db
            ]

            # Search Experiences
            experiences_db = (
                db.query(Experience)
                .filter(
                    or_(
                        Experience.company_name.ilike(search_term),
                        Experience.title.ilike(search_term),
                        Experience.description.ilike(search_term),
                    )
                )
                .limit(5)
                .all()
            )
            experiences = []
            for e in experiences_db:
                s_date = e.start_date.strftime("%Y") if e.start_date else ""
                e_date = (
                    "Günümüz"
                    if e.is_current
                    else (e.end_date.strftime("%Y") if e.end_date else "")
                )
                experiences.append(
                    SearchResultItem(
                        id=str(e.id),
                        title=f"{e.title} @ {e.company_name}",
                        subtitle=e.description[:150] if e.description else None,
                        date=f"{s_date} - {e_date}",
                    )
                )

            # Search Certificates
            certificates_db = (
                db.query(Certificate)
                .filter(
                    or_(
                        Certificate.name.ilike(search_term),
                        Certificate.issuing_organization.ilike(search_term),
                    )
                )
                .limit(5)
                .all()
            )
            certificates = [
                SearchResultItem(
                    id=str(c.id),
                    title=c.name,
                    subtitle=c.issuing_organization,
                    url=c.credential_url,
                    date=c.issue_date.strftime("%Y-%m") if c.issue_date else None,
                )
                for c in certificates_db
            ]

        return GlobalSearchResponse(
            query=query,
            projects=projects,
            articles=articles,
            experiences=experiences,
            certificates=certificates,
        )
