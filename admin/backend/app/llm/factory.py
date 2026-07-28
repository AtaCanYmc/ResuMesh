from typing import Optional

from resumesh_llm import LLMClient, LLMClientFactory

from app.config.settings import settings

# Cache the client instance
_client_instance: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    global _client_instance
    if _client_instance is not None:
        return _client_instance

    provider_name = settings.LLM_PROVIDER.lower().strip()

    if provider_name == "openai":
        _client_instance = LLMClientFactory.get_client(
            provider="openai",
            api_key=settings.OPENAI_API_KEY,
            model=settings.OPENAI_MODEL,
        )
    elif provider_name == "groq":
        _client_instance = LLMClientFactory.get_client(
            provider="groq",
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_MODEL,
        )
    elif provider_name == "ollama":
        _client_instance = LLMClientFactory.get_client(
            provider="ollama",
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL,
        )
    elif provider_name == "mock":
        _client_instance = LLMClientFactory.get_client(provider="mock")
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider_name}")

    return _client_instance


def override_llm_provider(client: LLMClient):
    """Used for testing to inject a mock client"""
    global _client_instance
    _client_instance = client
