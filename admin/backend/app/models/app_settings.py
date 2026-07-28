from sqlalchemy import Boolean, Column, Integer

from app.config.database import Base


class AppSettings(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)

    show_projects = Column(Boolean, default=True, nullable=False)
    show_certificates = Column(Boolean, default=True, nullable=False)
    show_videos = Column(Boolean, default=True, nullable=False)
    show_experiences = Column(Boolean, default=True, nullable=False)
