from abc import ABC, abstractmethod


class LLMProvider(ABC):
    @abstractmethod
    async def generate_cv(self, job_description: str, user_context: str) -> str:
        """
        Takes a job description and a combined string of the user's projects,
        articles, and experiences, and returns a tailored CV in Markdown format.
        """
        pass
