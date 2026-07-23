from fastapi import Depends
from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.db.factory import RepositoryFactory
from app.db.repositories import (
    IArticleRepository,
    ICertificateRepository,
    IEducationRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISkillRepository,
    ISystemLogRepository,
)


def get_db():
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


def get_education_repo(db: Session = Depends(get_db)) -> IEducationRepository:
    from app.db.providers.sqlalchemy import SQLAlchemyEducationRepository

    return SQLAlchemyEducationRepository(db)


def get_skill_repo(db: Session = Depends(get_db)) -> ISkillRepository:
    from app.db.providers.sqlalchemy import SQLAlchemySkillRepository

    return SQLAlchemySkillRepository(db)
