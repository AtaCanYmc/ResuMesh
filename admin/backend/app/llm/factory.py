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


def get_llm_client(db_settings=None) -> LLMClient:
    """Return the cached LLM client, creating it if needed.

    Priority order for each config value:
    1. DB-stored value (passed in via db_settings)
    2. Environment variable fallback (settings.py)
    """
    global _client_instance
    if _client_instance is not None:
        return _client_instance

    # Resolve provider — DB first, then env
    if db_settings is not None:
        provider_name = (
            (db_settings.llm_provider or env_settings.LLM_PROVIDER).lower().strip()
        )
    else:
        provider_name = env_settings.LLM_PROVIDER.lower().strip()

    logger.info(f"Initializing LLM client with provider: {provider_name}")

    if provider_name == "openai":
        api_key = (
            db_settings.openai_api_key if db_settings else None
        ) or env_settings.OPENAI_API_KEY
        model = (
            db_settings.openai_model if db_settings else None
        ) or env_settings.OPENAI_MODEL
        _client_instance = LLMClientFactory.get_client(
            provider="openai",
            api_key=api_key,
            model=model,
        )
    elif provider_name == "groq":
        api_key = (
            db_settings.groq_api_key if db_settings else None
        ) or env_settings.GROQ_API_KEY
        model = (
            db_settings.groq_model if db_settings else None
        ) or env_settings.GROQ_MODEL
        _client_instance = LLMClientFactory.get_client(
            provider="groq",
            api_key=api_key,
            model=model,
        )
    elif provider_name == "ollama":
        base_url = (
            db_settings.ollama_base_url if db_settings else None
        ) or env_settings.OLLAMA_BASE_URL
        model = (
            db_settings.ollama_model if db_settings else None
        ) or env_settings.OLLAMA_MODEL
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
