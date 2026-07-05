from app.llm.base import LLMProvider


class MockLLMProvider(LLMProvider):
    async def generate_cv(self, job_description: str, user_context: str) -> str:
        return (
            "# Mocked CV\n\nThis is a mock CV generated for testing purposes based "
            "on the provided job description and user context."
        )
