import asyncio
import os
from typing import List, Optional

from supabase import AsyncClientOptions
from supabase._async.client import AsyncClient

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISearchRepository,
    ISystemLogRepository,
)
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


class SupabaseProvider(
    IProjectRepository,
    IArticleRepository,
    IExperienceRepository,
    ICertificateRepository,
    ISystemLogRepository,
    ISearchRepository,
):
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        if not self.url or not self.key:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_KEY environment variables must be defined!"
            )

        # Configure client for asynchronous HTTP requests
        self.client: AsyncClient = AsyncClient(
            supabase_url=self.url,
            supabase_key=self.key,
            options=AsyncClientOptions(postgrest_client_timeout=10),
        )

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        project_data = project.model_dump(mode="json")
        response = await self.client.table("projects").insert(project_data).execute()
        if not response.data:
            raise Exception("Failed to create project in Supabase.")
        return ProjectResponse(**response.data[0])

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        start = skip
        end = skip + limit - 1
        response = (
            await self.client.table("projects").select("*").range(start, end).execute()
        )
        return [ProjectResponse(**item) for item in response.data]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        response = (
            await self.client.table("projects")
            .select("*")
            .eq("id", project_id)
            .execute()
        )
        if not response.data:
            return None
        return ProjectResponse(**response.data[0])

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        project_data = project.model_dump(mode="json")
        response = (
            await self.client.table("projects")
            .upsert(project_data, on_conflict="github_url")
            .execute()
        )
        if not response.data:
            raise Exception("Failed to upsert project in Supabase.")
        return ProjectResponse(**response.data[0])

    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        update_data = project.model_dump(exclude_unset=True)
        if "github_url" in update_data and update_data["github_url"] is not None:
            update_data["github_url"] = str(update_data["github_url"])
        response = (
            await self.client.table("projects")
            .update(update_data)
            .eq("id", project_id)
            .execute()
        )
        if not response.data:
            return None
        return ProjectResponse(**response.data[0])

    async def delete_project(self, project_id: str) -> bool:
        response = (
            await self.client.table("projects").delete().eq("id", project_id).execute()
        )
        return len(response.data) > 0

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        article_data = article.model_dump(mode="json")
        response = (
            await self.client.table("articles")
            .upsert(article_data, on_conflict="url")
            .execute()
        )
        if not response.data:
            raise Exception("Failed to upsert article in Supabase.")
        return ArticleResponse(**response.data[0])

    async def get_all_articles(
        self, skip: int = 0, limit: int = 100
    ) -> List[ArticleResponse]:
        start = skip
        end = skip + limit - 1
        response = (
            await self.client.table("articles").select("*").range(start, end).execute()
        )
        return [ArticleResponse(**item) for item in response.data]

    async def update_article(
        self, article_id: str, article: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        update_data = article.model_dump(exclude_unset=True)
        if "url" in update_data and update_data["url"] is not None:
            update_data["url"] = str(update_data["url"])
        response = (
            await self.client.table("articles")
            .update(update_data)
            .eq("id", article_id)
            .execute()
        )
        if not response.data:
            return None
        return ArticleResponse(**response.data[0])

    async def delete_article(self, article_id: str) -> bool:
        response = (
            await self.client.table("articles").delete().eq("id", article_id).execute()
        )
        return len(response.data) > 0

    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        exp_data = experience.model_dump(mode="json")
        response = await self.client.table("experiences").insert(exp_data).execute()
        if not response.data:
            raise Exception("Failed to create experience in Supabase.")
        return ExperienceResponse(**response.data[0])

    async def get_all_experiences(
        self, skip: int = 0, limit: int = 100
    ) -> List[ExperienceResponse]:
        start = skip
        end = skip + limit - 1
        response = (
            await self.client.table("experiences")
            .select("*")
            .range(start, end)
            .execute()
        )
        return [ExperienceResponse(**item) for item in response.data]

    async def update_experience(
        self, experience_id: str, experience: ExperienceUpdate
    ) -> Optional[ExperienceResponse]:
        update_data = experience.model_dump(exclude_unset=True)
        response = (
            await self.client.table("experiences")
            .update(update_data)
            .eq("id", experience_id)
            .execute()
        )
        if not response.data:
            return None
        return ExperienceResponse(**response.data[0])

    async def delete_experience(self, experience_id: str) -> bool:
        response = (
            await self.client.table("experiences")
            .delete()
            .eq("id", experience_id)
            .execute()
        )
        return len(response.data) > 0

    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        cert_data = certificate.model_dump(mode="json")
        response = await self.client.table("certificates").insert(cert_data).execute()
        if not response.data:
            raise Exception("Failed to create certificate in Supabase.")
        return CertificateResponse(**response.data[0])

    async def get_all_certificates(
        self, skip: int = 0, limit: int = 100
    ) -> List[CertificateResponse]:
        start = skip
        end = skip + limit - 1
        response = (
            await self.client.table("certificates")
            .select("*")
            .range(start, end)
            .execute()
        )
        return [CertificateResponse(**item) for item in response.data]

    async def update_certificate(
        self, certificate_id: str, certificate: CertificateUpdate
    ) -> Optional[CertificateResponse]:
        update_data = certificate.model_dump(exclude_unset=True)
        if (
            "credential_url" in update_data
            and update_data["credential_url"] is not None
        ):
            update_data["credential_url"] = str(update_data["credential_url"])
        response = (
            await self.client.table("certificates")
            .update(update_data)
            .eq("id", certificate_id)
            .execute()
        )
        if not response.data:
            return None
        return CertificateResponse(**response.data[0])

    async def delete_certificate(self, certificate_id: str) -> bool:
        response = (
            await self.client.table("certificates")
            .delete()
            .eq("id", certificate_id)
            .execute()
        )
        return len(response.data) > 0

    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        log_data = log.model_dump(mode="json")
        response = await self.client.table("system_logs").insert(log_data).execute()
        if not response.data:
            raise Exception("Failed to create system log in Supabase.")
        return SystemLogResponse(**response.data[0])

    async def get_logs(
        self,
        page: int = 1,
        limit: int = 20,
        level: Optional[str] = None,
        module: Optional[str] = None,
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[SystemLogResponse]:
        skip = (page - 1) * limit
        start = skip
        end = skip + limit - 1
        query = self.client.table("system_logs").select("*")
        if level:
            query = query.eq("level", level.upper())
        if module:
            query = query.eq("module", module.upper())
        if search_query:
            query = query.ilike("message", f"%{search_query}%")
        if start_date:
            query = query.gte("created_at", start_date)
        if end_date:
            query = query.lte("created_at", end_date)

        response = (
            await query.order("created_at", desc=True).range(start, end).execute()
        )
        return [SystemLogResponse(**item) for item in response.data]

    async def get_logs_count(
        self,
        level: Optional[str] = None,
        module: Optional[str] = None,
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> int:
        query = self.client.table("system_logs").select("id", count="exact")
        if level:
            query = query.eq("level", level.upper())
        if module:
            query = query.eq("module", module.upper())
        if search_query:
            query = query.ilike("message", f"%{search_query}%")
        if start_date:
            query = query.gte("created_at", start_date)
        if end_date:
            query = query.lte("created_at", end_date)

        response = await query.execute()
        return response.count if response.count is not None else 0

    async def global_search(self, query: str) -> GlobalSearchResponse:
        search_term = f"ilike.%{query}%"  # Case-insensitive search filter

        tasks = [
            self.client.table("projects")
            .select("*")
            .or_(f"title.{search_term},description.{search_term}")
            .execute(),
            self.client.table("articles")
            .select("*")
            .or_(f"title.{search_term},summary.{search_term}")
            .execute(),
            self.client.table("experiences")
            .select("*")
            .or_(f"title.{search_term},company_name.{search_term}")
            .execute(),
            self.client.table("certificates")
            .select("*")
            .or_(f"name.{search_term},issuing_organization.{search_term}")
            .execute(),
        ]

        projects_res, articles_res, experiences_res, certificates_res = (
            await asyncio.gather(*tasks)
        )

        projects = [
            SearchResultItem(
                id=str(p["id"]),
                title=p["title"],
                subtitle=p.get("description")[:100] if p.get("description") else None,
                url=p.get("github_url"),
                tags=p.get("languages", []) + p.get("tags", []),
            )
            for p in projects_res.data
        ]

        articles = [
            SearchResultItem(
                id=str(a["id"]),
                title=a["title"],
                subtitle=a.get("summary")[:100] if a.get("summary") else None,
                url=a.get("url"),
                tags=[],
                date=a.get("published_at"),
            )
            for a in articles_res.data
        ]

        experiences = [
            SearchResultItem(
                id=str(e["id"]),
                title=e["title"],
                subtitle=e.get("company_name"),
                url=None,
                tags=[],
                date=f"{e.get('start_date')} - {e.get('end_date') or 'Present'}",
            )
            for e in experiences_res.data
        ]

        certificates = [
            SearchResultItem(
                id=str(c["id"]),
                title=c["name"],
                subtitle=c.get("issuing_organization"),
                url=c.get("credential_url"),
                tags=[],
                date=c.get("issue_date"),
            )
            for c in certificates_res.data
        ]

        return GlobalSearchResponse(
            query=query,
            projects=projects,
            articles=articles,
            experiences=experiences,
            certificates=certificates,
        )
