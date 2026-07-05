import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorClient

from app.db.base import ProjectRepository
from app.schemas.article import ArticleCreate, ArticleResponse
from app.schemas.certificate import CertificateCreate, CertificateResponse
from app.schemas.experience import ExperienceCreate, ExperienceResponse
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.system_log import SystemLogCreate, SystemLogResponse


class MongoProvider(ProjectRepository):
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
    ) -> List[SystemLogResponse]:
        query = {}
        if level:
            query["level"] = level.upper()
        if module:
            query["module"] = module.upper()

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
        self, level: Optional[str] = None, module: Optional[str] = None
    ) -> int:
        query = {}
        if level:
            query["level"] = level.upper()
        if module:
            query["module"] = module.upper()

        return await self.db.system_logs.count_documents(query)
