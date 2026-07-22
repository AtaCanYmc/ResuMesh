from abc import ABC, abstractmethod
from typing import Type

from pydantic import BaseModel


class LLMProvider(ABC):
    @abstractmethod
    async def generate_cv(self, job_description: str, user_context: str) -> str:
        """
        Takes a job description and a combined string of the user's projects,
        articles, and experiences, and returns a tailored CV in Markdown format.
        """
        pass

    @abstractmethod
    async def generate_structured_output(
        self, prompt: str, response_model: Type[BaseModel]
    ) -> BaseModel:
        """
        Takes a raw prompt and a Pydantic schema, and returns a structured output
        matching the schema.
        """
        pass
