from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class LLMSettingsResponse(BaseModel):
    """LLM config returned to the frontend — API keys are masked."""

    llm_provider: Optional[str] = "mock"
    openai_api_key: Optional[str] = ""  # masked: "***" if set
    openai_model: Optional[str] = "gpt-4o"
    groq_api_key: Optional[str] = ""  # masked: "***" if set
    groq_model: Optional[str] = "llama-3.3-70b-versatile"
    ollama_base_url: Optional[str] = "http://localhost:11434"
    ollama_model: Optional[str] = "llama3"


class AppSettingsBase(BaseModel):
    show_projects: bool = True
    show_certificates: bool = True
    show_videos: bool = True
    show_experiences: bool = True

    # Content columns
    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsCreate(AppSettingsBase):
    pass


class AppSettingsUpdate(BaseModel):
    show_projects: Optional[bool] = None
    show_certificates: Optional[bool] = None
    show_videos: Optional[bool] = None
    show_experiences: Optional[bool] = None

    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None

    # LLM / AI provider configuration (all optional — send only what you want to change)
    llm_provider: Optional[str] = None
    openai_api_key: Optional[str] = None
    openai_model: Optional[str] = None
    groq_api_key: Optional[str] = None
    groq_model: Optional[str] = None
    ollama_base_url: Optional[str] = None
    ollama_model: Optional[str] = None


class AppSettingsResponse(AppSettingsBase):
    id: int
    llm_config: LLMSettingsResponse

    class Config:
        from_attributes = True
