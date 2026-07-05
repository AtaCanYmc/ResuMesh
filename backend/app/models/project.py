from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from app.config.database import Base
import uuid

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    github_url = Column(String(512), nullable=True)
    stars = Column(Integer, default=0)
    watchers = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    
    # PostgreSQL ARRAY ve JSONB tiplerinin Python karşılığı
    languages = Column(ARRAY(String), default=[])
    tags = Column(ARRAY(String), default=[])
    raw_github_data = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
