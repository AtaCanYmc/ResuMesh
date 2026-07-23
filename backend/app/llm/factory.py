from typing import Optional

from app.config.settings import settings
from app.llm.base import LLMProvider

# Cache the provider instance
_provider_instance: Optional[LLMProvider] = None


def get_llm_provider() -> LLMProvider:
    global _provider_instance
    if _provider_instance is not None:
        return _provider_instance

    provider_name = settings.LLM_PROVIDER.lower()

    if provider_name == "openai":
        from app.llm.providers.openai_provider import OpenAIProvider

        _provider_instance = OpenAIProvider()
    elif provider_name == "groq":
        from app.llm.providers.groq_provider import GroqProvider

        _provider_instance = GroqProvider()
    elif provider_name == "ollama":
        from app.llm.providers.ollama_provider import OllamaProvider

        _provider_instance = OllamaProvider()
    elif provider_name == "mock":
        from app.llm.providers.mock_provider import MockLLMProvider

        _provider_instance = MockLLMProvider()
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider_name}")

    return _provider_instance


def override_llm_provider(provider: LLMProvider):
    """Used for testing to inject a mock provider"""
    global _provider_instance
    _provider_instance = provider
