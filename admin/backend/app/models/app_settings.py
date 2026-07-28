from sqlalchemy import JSON, Boolean, Column, Integer, String

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

    # LLM / AI provider configuration
    llm_provider = Column(String(50), nullable=True, default="mock")
    openai_api_key = Column(String(500), nullable=True)
    openai_model = Column(String(100), nullable=True, default="gpt-4o")
    groq_api_key = Column(String(500), nullable=True)
    groq_model = Column(String(100), nullable=True, default="llama-3.3-70b-versatile")
    ollama_base_url = Column(
        String(255), nullable=True, default="http://localhost:11434"
    )
    ollama_model = Column(String(100), nullable=True, default="llama3")
