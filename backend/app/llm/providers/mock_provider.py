from typing import Type

from pydantic import BaseModel

from app.llm.base import LLMProvider


class MockLLMProvider(LLMProvider):
    async def generate_cv(self, job_description: str, user_context: str) -> str:
        return (
            "# Mocked CV\n\nThis is a mock CV generated for testing purposes based "
            "on the provided job description and user context."
        )

    async def generate_structured_output(
        self, prompt: str, response_model: Type[BaseModel]
    ) -> BaseModel:
        # For mock, we simply return an empty instantiation of the model.
        # This assumes the model has defaults,
        # or it might fail if there are required fields.
        # In a real mock, you'd probably want to return a dummy instance.
        return response_model.model_construct()
