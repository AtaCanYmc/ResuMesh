from sqlalchemy import JSON, Boolean, Column, Integer

from app.config.database import Base


class AppSettings(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)

    show_projects = Column(Boolean, default=True, nullable=False)
    show_certificates = Column(Boolean, default=True, nullable=False)
    show_videos = Column(Boolean, default=True, nullable=False)
    show_experiences = Column(Boolean, default=True, nullable=False)

    # Content columns
    socials = Column(JSON, nullable=True)
    footer = Column(JSON, nullable=True)
    marquee = Column(JSON, nullable=True)
    en = Column(JSON, nullable=True)
    tr = Column(JSON, nullable=True)
