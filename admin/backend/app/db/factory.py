from app.db.providers.supabase import (
    SupabaseArticleRepository,
    SupabaseCertificateRepository,
    SupabaseExperienceRepository,
    SupabaseProjectRepository,
    SupabaseSearchRepository,
    SupabaseSystemLogRepository,
)
from app.db.repositories import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)


class RepositoryFactory:
    _instances = {}

    @classmethod
    def get_project_repository(cls) -> IProjectRepository:
        if "project" not in cls._instances:
            cls._instances["project"] = SupabaseProjectRepository()
        return cls._instances["project"]

    @classmethod
    def get_article_repository(cls) -> IArticleRepository:
        if "article" not in cls._instances:
            cls._instances["article"] = SupabaseArticleRepository()
        return cls._instances["article"]

    @classmethod
    def get_experience_repository(cls) -> IExperienceRepository:
        if "experience" not in cls._instances:
            cls._instances["experience"] = SupabaseExperienceRepository()
        return cls._instances["experience"]

    @classmethod
    def get_certificate_repository(cls) -> ICertificateRepository:
        if "certificate" not in cls._instances:
            cls._instances["certificate"] = SupabaseCertificateRepository()
        return cls._instances["certificate"]

    @classmethod
    def get_system_log_repository(cls) -> ISystemLogRepository:
        if "system_log" not in cls._instances:
            cls._instances["system_log"] = SupabaseSystemLogRepository()
        return cls._instances["system_log"]

    @classmethod
    def get_search_repository(cls) -> ISearchRepository:
        if "search" not in cls._instances:
            cls._instances["search"] = SupabaseSearchRepository()
        return cls._instances["search"]
