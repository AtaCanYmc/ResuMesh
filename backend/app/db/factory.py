import os

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
from app.db.providers.firebase_provider import FirebaseProvider
from app.db.providers.mongo_provider import MongoProvider
from app.db.providers.postgres_provider import (
    PostgresArticleRepository,
    PostgresCertificateRepository,
    PostgresExperienceRepository,
    PostgresProjectRepository,
    PostgresSearchRepository,
    PostgresSystemLogRepository,
)
from app.db.providers.supabase_provider import SupabaseProvider

PROVIDER_REGISTRY = {
    "local-postgres": {
        "project": PostgresProjectRepository,
        "article": PostgresArticleRepository,
        "experience": PostgresExperienceRepository,
        "certificate": PostgresCertificateRepository,
        "system_log": PostgresSystemLogRepository,
        "search": PostgresSearchRepository,
    },
    "mongodb": {
        "project": MongoProvider,
        "article": MongoProvider,
        "experience": MongoProvider,
        "certificate": MongoProvider,
        "system_log": MongoProvider,
        "search": MongoProvider,
    },
    "firebase": {
        "project": FirebaseProvider,
        "article": FirebaseProvider,
        "experience": FirebaseProvider,
        "certificate": FirebaseProvider,
        "system_log": FirebaseProvider,
        "search": FirebaseProvider,
    },
    "supabase": {
        "project": SupabaseProvider,
        "article": SupabaseProvider,
        "experience": SupabaseProvider,
        "certificate": SupabaseProvider,
        "system_log": SupabaseProvider,
        "search": SupabaseProvider,
    },
}


class RepositoryFactory:
    """Factory for instantiating correct domain repositories based on provider name."""

    _instances = {}

    @classmethod
    def _get_provider_class(cls, repo_type: str):
        provider_name = os.getenv("DB_PROVIDER", "local-postgres").lower()

        provider_map = PROVIDER_REGISTRY.get(provider_name)
        if not provider_map:
            raise ValueError(f"Unknown database provider: {provider_name}")

        repo_class = provider_map.get(repo_type)
        if not repo_class:
            raise ValueError(
                f"Repository type {repo_type} is not supported by {provider_name}"
            )

        return repo_class

    @classmethod
    def get_project_repository(cls) -> IProjectRepository:
        repo_class = cls._get_provider_class("project")
        if repo_class not in cls._instances:
            cls._instances[repo_class] = repo_class()
        return cls._instances[repo_class]

    @classmethod
    def get_article_repository(cls) -> IArticleRepository:
        repo_class = cls._get_provider_class("article")
        if repo_class not in cls._instances:
            cls._instances[repo_class] = repo_class()
        return cls._instances[repo_class]

    @classmethod
    def get_experience_repository(cls) -> IExperienceRepository:
        repo_class = cls._get_provider_class("experience")
        if repo_class not in cls._instances:
            cls._instances[repo_class] = repo_class()
        return cls._instances[repo_class]

    @classmethod
    def get_certificate_repository(cls) -> ICertificateRepository:
        repo_class = cls._get_provider_class("certificate")
        if repo_class not in cls._instances:
            cls._instances[repo_class] = repo_class()
        return cls._instances[repo_class]

    @classmethod
    def get_system_log_repository(cls) -> ISystemLogRepository:
        # allow overriding log provider if needed, per the user's suggestion
        log_provider_name = os.getenv(
            "LOG_DB_PROVIDER", os.getenv("DB_PROVIDER", "local-postgres")
        ).lower()
        provider_map = PROVIDER_REGISTRY.get(log_provider_name)
        if not provider_map:
            raise ValueError(f"Unknown log database provider: {log_provider_name}")

        repo_class = provider_map.get("system_log")
        if repo_class not in cls._instances:
            cls._instances[repo_class] = repo_class()
        return cls._instances[repo_class]

    @classmethod
    def get_search_repository(cls) -> ISearchRepository:
        repo_class = cls._get_provider_class("search")
        if repo_class not in cls._instances:
            cls._instances[repo_class] = repo_class()
        return cls._instances[repo_class]
