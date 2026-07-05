from app.db.providers.postgres_provider import (
    PostgresArticleRepository,
    PostgresCertificateRepository,
    PostgresExperienceRepository,
    PostgresProjectRepository,
    PostgresSearchRepository,
    PostgresSystemLogRepository,
)


def get_project_repo() -> PostgresProjectRepository:
    return PostgresProjectRepository()


def get_article_repo() -> PostgresArticleRepository:
    return PostgresArticleRepository()


def get_experience_repo() -> PostgresExperienceRepository:
    return PostgresExperienceRepository()


def get_certificate_repo() -> PostgresCertificateRepository:
    return PostgresCertificateRepository()


def get_system_log_repo() -> PostgresSystemLogRepository:
    return PostgresSystemLogRepository()


def get_search_repo() -> PostgresSearchRepository:
    return PostgresSearchRepository()
