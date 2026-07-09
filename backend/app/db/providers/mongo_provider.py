import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorClient

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


class MongoProvider(
    IProjectRepository,
    IArticleRepository,
    IExperienceRepository,
    ICertificateRepository,
    ISystemLogRepository,
    ISearchRepository,
):
    def __init__(self):
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
        db_name = os.getenv("MONGO_DB_NAME", "resumesh")
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        self.collection = self.db.projects

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        project_dict = project.model_dump()

        # Convert HttpUrl to string if present
        if project_dict.get("github_url"):
            project_dict["github_url"] = str(project_dict["github_url"])

        # Add id and timestamps
        project_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        project_dict["id"] = project_id
        project_dict["created_at"] = now
        project_dict["updated_at"] = now

        # MongoDB uses _id as primary key, but we want to return it as id
        # So we can store both or just use _id as string. Let's store id explicitly.
        project_dict["_id"] = project_id

        await self.collection.insert_one(project_dict)

        # Remove _id for Pydantic validation
        project_dict.pop("_id", None)
        return ProjectResponse(**project_dict)

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        cursor = self.collection.find().skip(skip).limit(limit)
        projects = await cursor.to_list(length=limit)

        result = []
        for p in projects:
            p.pop("_id", None)
            result.append(ProjectResponse(**p))
        return result

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        project = await self.collection.find_one({"id": project_id})
        if project:
            project.pop("_id", None)
            return ProjectResponse(**project)

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        project_dict = project.model_dump()
        if project_dict.get("github_url"):
            project_dict["github_url"] = str(project_dict["github_url"])

        now = datetime.now(timezone.utc)
        project_dict["updated_at"] = now

        # Check if exists
        existing = None
        if project.github_url:
            existing = await self.db.projects.find_one(
                {"github_url": str(project.github_url)}
            )

        if existing:
            await self.db.projects.update_one(
                {"_id": existing["_id"]}, {"$set": project_dict}
            )
            project_dict["id"] = existing["id"]
            project_dict["created_at"] = existing["created_at"]
        else:
            project_id = str(uuid.uuid4())
            project_dict["id"] = project_id
            project_dict["created_at"] = now
            project_dict["_id"] = project_id
            await self.db.projects.insert_one(project_dict)

        project_dict.pop("_id", None)
        return ProjectResponse(**project_dict)

    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        update_data = project.model_dump(exclude_unset=True)
        if "github_url" in update_data and update_data["github_url"] is not None:
            update_data["github_url"] = str(update_data["github_url"])
        update_data["updated_at"] = datetime.now(timezone.utc)

        result = await self.db.projects.find_one_and_update(
            {"id": project_id}, {"$set": update_data}, return_document=True
        )
        if not result:
            return None
        result.pop("_id", None)
        return ProjectResponse(**result)

    async def delete_project(self, project_id: str) -> bool:
        result = await self.db.projects.delete_one({"id": project_id})
        return result.deleted_count > 0

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        article_dict = article.model_dump()
        article_dict["url"] = str(article_dict["url"])

        now = datetime.now(timezone.utc)
        article_dict["updated_at"] = now

        existing = await self.db.articles.find_one({"url": article_dict["url"]})
        if existing:
            await self.db.articles.update_one(
                {"_id": existing["_id"]}, {"$set": article_dict}
            )
            article_dict["id"] = existing["id"]
            article_dict["created_at"] = existing["created_at"]
        else:
            article_id = str(uuid.uuid4())
            article_dict["id"] = article_id
            article_dict["created_at"] = now
            article_dict["_id"] = article_id
            await self.db.articles.insert_one(article_dict)

        article_dict.pop("_id", None)
        return ArticleResponse(**article_dict)

    async def update_article(
        self, article_id: str, article: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        update_data = article.model_dump(exclude_unset=True)
        if "url" in update_data and update_data["url"] is not None:
            update_data["url"] = str(update_data["url"])
        update_data["updated_at"] = datetime.now(timezone.utc)

        result = await self.db.articles.find_one_and_update(
            {"id": article_id}, {"$set": update_data}, return_document=True
        )
        if not result:
            return None
        result.pop("_id", None)
        return ArticleResponse(**result)

    async def delete_article(self, article_id: str) -> bool:
        result = await self.db.articles.delete_one({"id": article_id})
        return result.deleted_count > 0

    async def create_experience(
        self, experience: ExperienceCreate
    ) -> ExperienceResponse:
        exp_dict = experience.model_dump()
        exp_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        exp_dict["id"] = exp_id
        exp_dict["created_at"] = now
        exp_dict["updated_at"] = now
        exp_dict["_id"] = exp_id

        # Convert date to datetime for MongoDB
        if exp_dict.get("start_date"):
            exp_dict["start_date"] = datetime.combine(
                exp_dict["start_date"], datetime.min.time()
            )
        if exp_dict.get("end_date"):
            exp_dict["end_date"] = datetime.combine(
                exp_dict["end_date"], datetime.min.time()
            )

        await self.db.experiences.insert_one(exp_dict)
        exp_dict.pop("_id", None)
        return ExperienceResponse(**exp_dict)

    async def update_experience(
        self, experience_id: str, experience: ExperienceUpdate
    ) -> Optional[ExperienceResponse]:
        update_data = experience.model_dump(exclude_unset=True)
        if "start_date" in update_data and update_data["start_date"] is not None:
            update_data["start_date"] = datetime.combine(
                update_data["start_date"], datetime.min.time()
            )
        if "end_date" in update_data and update_data["end_date"] is not None:
            update_data["end_date"] = datetime.combine(
                update_data["end_date"], datetime.min.time()
            )
        update_data["updated_at"] = datetime.now(timezone.utc)

        result = await self.db.experiences.find_one_and_update(
            {"id": experience_id}, {"$set": update_data}, return_document=True
        )
        if not result:
            return None
        result.pop("_id", None)
        return ExperienceResponse(**result)

    async def delete_experience(self, experience_id: str) -> bool:
        result = await self.db.experiences.delete_one({"id": experience_id})
        return result.deleted_count > 0

    async def create_certificate(
        self, certificate: CertificateCreate
    ) -> CertificateResponse:
        cert_dict = certificate.model_dump()
        cert_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        if cert_dict.get("credential_url"):
            cert_dict["credential_url"] = str(cert_dict["credential_url"])

        cert_dict["id"] = cert_id
        cert_dict["created_at"] = now
        cert_dict["updated_at"] = now
        cert_dict["_id"] = cert_id

        if cert_dict.get("issue_date"):
            cert_dict["issue_date"] = datetime.combine(
                cert_dict["issue_date"], datetime.min.time()
            )

        await self.db.certificates.insert_one(cert_dict)
        cert_dict.pop("_id", None)
        return CertificateResponse(**cert_dict)

    async def update_certificate(
        self, certificate_id: str, certificate: CertificateUpdate
    ) -> Optional[CertificateResponse]:
        update_data = certificate.model_dump(exclude_unset=True)
        if (
            "credential_url" in update_data
            and update_data["credential_url"] is not None
        ):
            update_data["credential_url"] = str(update_data["credential_url"])
        if "issue_date" in update_data and update_data["issue_date"] is not None:
            update_data["issue_date"] = datetime.combine(
                update_data["issue_date"], datetime.min.time()
            )
        update_data["updated_at"] = datetime.now(timezone.utc)

        result = await self.db.certificates.find_one_and_update(
            {"id": certificate_id}, {"$set": update_data}, return_document=True
        )
        if not result:
            return None
        result.pop("_id", None)
        return CertificateResponse(**result)

    async def delete_certificate(self, certificate_id: str) -> bool:
        result = await self.db.certificates.delete_one({"id": certificate_id})
        return result.deleted_count > 0

    async def create_log(self, log: SystemLogCreate) -> SystemLogResponse:
        log_dict = log.model_dump()
        log_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        log_dict["id"] = log_id
        log_dict["created_at"] = now
        log_dict["_id"] = log_id

        await self.db.system_logs.insert_one(log_dict)
        log_dict.pop("_id", None)
        return SystemLogResponse(**log_dict)

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
        query = {}
        if level:
            query["level"] = level.upper()
        if module:
            query["module"] = module.upper()
        if search_query:
            query["message"] = {"$regex": search_query, "$options": "i"}

        date_query = {}
        if start_date:
            date_query["$gte"] = (
                datetime.fromisoformat(start_date)
                if isinstance(start_date, str)
                else start_date
            )
        if end_date:
            date_query["$lte"] = (
                datetime.fromisoformat(end_date)
                if isinstance(end_date, str)
                else end_date
            )

        if date_query:
            query["created_at"] = date_query

        cursor = (
            self.db.system_logs.find(query)
            .sort("created_at", -1)
            .skip((page - 1) * limit)
            .limit(limit)
        )
        logs = await cursor.to_list(length=limit)

        result = []
        for log_item in logs:
            log_item.pop("_id", None)
            result.append(SystemLogResponse(**log_item))
        return result

    async def get_logs_count(
        self,
        level: Optional[str] = None,
        module: Optional[str] = None,
        search_query: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> int:
        query = {}
        if level:
            query["level"] = level.upper()
        if module:
            query["module"] = module.upper()
        if search_query:
            query["message"] = {"$regex": search_query, "$options": "i"}

        date_query = {}
        if start_date:
            date_query["$gte"] = (
                datetime.fromisoformat(start_date)
                if isinstance(start_date, str)
                else start_date
            )
        if end_date:
            date_query["$lte"] = (
                datetime.fromisoformat(end_date)
                if isinstance(end_date, str)
                else end_date
            )

        if date_query:
            query["created_at"] = date_query

        return await self.db.system_logs.count_documents(query)

    async def global_search(self, query: str) -> GlobalSearchResponse:
        regex_query = {"$regex": query, "$options": "i"}

        # Search Projects
        projects_db = (
            await self.db.projects.find(
                {
                    "$or": [
                        {"title": regex_query},
                        {"description": regex_query},
                        {"languages": regex_query},
                        {"tags": regex_query},
                    ]
                }
            )
            .limit(10)
            .to_list(length=10)
        )

        projects = []
        for p in projects_db:
            created_at = p.get("created_at")
            date_str = (
                created_at.strftime("%Y-%m")
                if isinstance(created_at, datetime)
                else None
            )
            projects.append(
                SearchResultItem(
                    id=str(p.get("id", p.get("_id"))),
                    title=p.get("title", ""),
                    subtitle=(
                        p.get("description", "")[:100] if p.get("description") else None
                    ),
                    url=p.get("github_url"),
                    tags=(p.get("languages") or []) + (p.get("tags") or []),
                    date=date_str,
                )
            )

        # Search Articles
        articles_db = (
            await self.db.articles.find(
                {"$or": [{"title": regex_query}, {"summary": regex_query}]}
            )
            .limit(10)
            .to_list(length=10)
        )

        articles = []
        for a in articles_db:
            pub_date = a.get("published_at")
            date_str = (
                pub_date.strftime("%Y-%m") if isinstance(pub_date, datetime) else None
            )
            articles.append(
                SearchResultItem(
                    id=str(a.get("id", a.get("_id"))),
                    title=a.get("title", ""),
                    subtitle=f"Platform: {a.get('platform')}",
                    url=a.get("url"),
                    date=date_str,
                )
            )

        # Search Experiences
        experiences_db = (
            await self.db.experiences.find(
                {
                    "$or": [
                        {"title": regex_query},
                        {"company_name": regex_query},
                        {"description": regex_query},
                    ]
                }
            )
            .limit(5)
            .to_list(length=5)
        )

        experiences = []
        for e in experiences_db:
            start_date = e.get("start_date")
            end_date = e.get("end_date")
            is_current = e.get("is_current")

            s_date = (
                start_date.strftime("%Y") if isinstance(start_date, datetime) else ""
            )
            e_date = (
                "Günümüz"
                if is_current
                else (end_date.strftime("%Y") if isinstance(end_date, datetime) else "")
            )

            experiences.append(
                SearchResultItem(
                    id=str(e.get("id", e.get("_id"))),
                    title=f"{e.get('title')} @ {e.get('company_name')}",
                    subtitle=(
                        e.get("description", "")[:150] if e.get("description") else None
                    ),
                    date=f"{s_date} - {e_date}",
                )
            )

        # Search Certificates
        certificates_db = (
            await self.db.certificates.find(
                {"$or": [{"name": regex_query}, {"issuing_organization": regex_query}]}
            )
            .limit(5)
            .to_list(length=5)
        )

        certificates = []
        for c in certificates_db:
            issue_date = c.get("issue_date")
            date_str = (
                issue_date.strftime("%Y-%m")
                if isinstance(issue_date, datetime)
                else None
            )
            certificates.append(
                SearchResultItem(
                    id=str(c.get("id", c.get("_id"))),
                    title=c.get("name", ""),
                    subtitle=c.get("issuing_organization"),
                    url=c.get("credential_url"),
                    date=date_str,
                )
            )

        return GlobalSearchResponse(
            query=query,
            projects=projects,
            articles=articles,
            experiences=experiences,
            certificates=certificates,
        )

    async def get_all_experiences(self) -> List[ExperienceResponse]:
        cursor = self.db.experiences.find().sort("start_date", -1)
        experiences = await cursor.to_list(length=100)
        result = []
        for e in experiences:
            e.pop("_id", None)
            result.append(ExperienceResponse(**e))
        return result

    async def get_all_articles(self) -> List[ArticleResponse]:
        cursor = self.db.articles.find().sort("published_at", -1)
        articles = await cursor.to_list(length=100)
        result = []
        for a in articles:
            a.pop("_id", None)
            result.append(ArticleResponse(**a))
        return result

    async def get_all_certificates(self) -> List[CertificateResponse]:
        cursor = self.db.certificates.find().sort("issue_date", -1)
        certificates = await cursor.to_list(length=100)
        result = []
        for c in certificates:
            c.pop("_id", None)
            result.append(CertificateResponse(**c))
        return result
