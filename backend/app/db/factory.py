from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
from app.db.providers.supabase_provider import SupabaseProvider


class RepositoryFactory:
    """Factory for instantiating Supabase domain repositories."""

    _instances = {}

    @classmethod
    def _get_provider_instance(cls):
        if SupabaseProvider not in cls._instances:
            cls._instances[SupabaseProvider] = SupabaseProvider()
        return cls._instances[SupabaseProvider]

    @classmethod
    def get_project_repository(cls) -> IProjectRepository:
        return cls._get_provider_instance()

    @classmethod
    def get_article_repository(cls) -> IArticleRepository:
        return cls._get_provider_instance()

    @classmethod
    def get_experience_repository(cls) -> IExperienceRepository:
        return cls._get_provider_instance()

    @classmethod
    def get_certificate_repository(cls) -> ICertificateRepository:
        return cls._get_provider_instance()

    @classmethod
    def get_system_log_repository(cls) -> ISystemLogRepository:
        return cls._get_provider_instance()

    @classmethod
    def get_search_repository(cls) -> ISearchRepository:
        return cls._get_provider_instance()
