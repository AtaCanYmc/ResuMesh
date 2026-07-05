import os
import uuid
from typing import List, Optional
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from app.db.base import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectResponse

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

    async def get_projects(self, skip: int = 0, limit: int = 100) -> List[ProjectResponse]:
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
        return None
