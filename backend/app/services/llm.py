from resumesh_llm import CVOptimizer, GitHubSummarizer, LLMClient, LLMClientFactory

from app.config.settings import settings


def get_llm_client() -> LLMClient:
    """Returns an instance of LLMClient configured using application settings."""
    provider = settings.LLM_PROVIDER.lower().strip()

    if provider == "openai":
        return LLMClientFactory.get_client(
            provider="openai",
            api_key=settings.OPENAI_API_KEY,
            model=settings.OPENAI_MODEL,
        )
    elif provider == "groq":
        return LLMClientFactory.get_client(
            provider="groq",
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_MODEL,
        )
    elif provider == "ollama":
        return LLMClientFactory.get_client(
            provider="ollama",
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL,
        )
    else:
        # Fallback to mock
        return LLMClientFactory.get_client(provider="mock")


def get_cv_optimizer() -> CVOptimizer:
    """Returns an instance of CVOptimizer configured with the LLMClient."""
    return CVOptimizer(client=get_llm_client())


def get_github_summarizer() -> GitHubSummarizer:
    """Returns an instance of GitHubSummarizer configured with the LLMClient."""
    return GitHubSummarizer(client=get_llm_client())
