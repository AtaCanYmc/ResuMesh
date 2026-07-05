from app.config.database import SessionLocal
from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
from app.db.factory import RepositoryFactory


def get_db():
    """Dependency to get a database session.
    Centralized here to respect DRY across routers.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_project_repo() -> IProjectRepository:
    return RepositoryFactory.get_project_repository()


def get_article_repo() -> IArticleRepository:
    return RepositoryFactory.get_article_repository()


def get_experience_repo() -> IExperienceRepository:
    return RepositoryFactory.get_experience_repository()


def get_certificate_repo() -> ICertificateRepository:
    return RepositoryFactory.get_certificate_repository()


def get_system_log_repo() -> ISystemLogRepository:
    return RepositoryFactory.get_system_log_repository()


def get_search_repo() -> ISearchRepository:
    return RepositoryFactory.get_search_repository()
