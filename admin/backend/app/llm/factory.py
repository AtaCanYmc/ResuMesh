import logging
from typing import Optional

from resumesh_llm import LLMClient, LLMClientFactory

from app.config.settings import settings as env_settings

logger = logging.getLogger("llm.factory")

# Cache the client instance (reset whenever settings change)
_client_instance: Optional[LLMClient] = None


def reset_llm_client() -> None:
    """Clear the cached LLM client so the next call to get_llm_client()
    creates a fresh instance — picking up any updated DB settings."""
    global _client_instance
    _client_instance = None
    logger.info("LLM client instance cache cleared.")


def get_llm_client(db_settings=None, db=None) -> LLMClient:
    """Return the cached LLM client, creating it if needed.

    Priority order for each config value:
    1. DB-stored value (passed in via db_settings or fetched via db session)
    2. Environment variable fallback (settings.py)
    """
    global _client_instance
    if _client_instance is not None:
        return _client_instance

    llm_db_config = {}
    if db is not None:
        from app.services.settings_store import get_setting

        llm_db_config = get_setting(db, "llm", {}) or {}

    provider_name = env_settings.LLM_PROVIDER.lower().strip()
    if isinstance(db_settings, dict) and "provider" in db_settings:
        provider_name = (db_settings["provider"] or provider_name).lower().strip()
    elif hasattr(db_settings, "llm_provider") and db_settings.llm_provider:
        provider_name = db_settings.llm_provider.lower().strip()
    elif llm_db_config.get("provider"):
        provider_name = str(llm_db_config["provider"]).lower().strip()

    logger.info(f"Initializing LLM client with provider: {provider_name}")

    if provider_name == "openai":
        api_key = (
            (
                db_settings.get("openai_api_key")
                if isinstance(db_settings, dict)
                else getattr(db_settings, "openai_api_key", None)
            )
            or llm_db_config.get("openai_api_key")
            or env_settings.OPENAI_API_KEY
        )
        model = (
            (
                db_settings.get("openai_model")
                if isinstance(db_settings, dict)
                else getattr(db_settings, "openai_model", None)
            )
            or llm_db_config.get("openai_model")
            or env_settings.OPENAI_MODEL
        )
        _client_instance = LLMClientFactory.get_client(
            provider="openai",
            api_key=api_key,
            model=model,
        )
    elif provider_name == "groq":
        api_key = (
            (
                db_settings.get("groq_api_key")
                if isinstance(db_settings, dict)
                else getattr(db_settings, "groq_api_key", None)
            )
            or llm_db_config.get("groq_api_key")
            or env_settings.GROQ_API_KEY
        )
        model = (
            (
                db_settings.get("groq_model")
                if isinstance(db_settings, dict)
                else getattr(db_settings, "groq_model", None)
            )
            or llm_db_config.get("groq_model")
            or env_settings.GROQ_MODEL
        )
        _client_instance = LLMClientFactory.get_client(
            provider="groq",
            api_key=api_key,
            model=model,
        )
    elif provider_name == "ollama":
        base_url = (
            (
                db_settings.get("ollama_base_url")
                if isinstance(db_settings, dict)
                else getattr(db_settings, "ollama_base_url", None)
            )
            or llm_db_config.get("ollama_base_url")
            or env_settings.OLLAMA_BASE_URL
        )
        model = (
            (
                db_settings.get("ollama_model")
                if isinstance(db_settings, dict)
                else getattr(db_settings, "ollama_model", None)
            )
            or llm_db_config.get("ollama_model")
            or env_settings.OLLAMA_MODEL
        )
        _client_instance = LLMClientFactory.get_client(
            provider="ollama",
            base_url=base_url,
            model=model,
        )
    elif provider_name == "mock":
        _client_instance = LLMClientFactory.get_client(provider="mock")
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider_name}")

    return _client_instance


def override_llm_provider(client: LLMClient):
    """Used for testing to inject a mock client."""
    global _client_instance
    _client_instance = client
