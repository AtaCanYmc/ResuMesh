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
        if response_model.__name__ == "ResumeImportData":
            from reactive_resume.models.resume import Basics, Section, WorkItem

            return response_model(
                title="Mocked CV",
                basics=Basics(
                    name="Mock Candidate",
                    headline="Python Developer",
                    email="mock@example.com",
                    phone="123-456-7890",
                    location="Remote",
                ),
                sections={
                    "work": Section(
                        id="work",
                        name="Work Experience",
                        items=[
                            WorkItem(
                                id="mock-w1",
                                company="Mock Corp",
                                position="Mock Engineer",
                                summary="Tailored experience in Python and FastAPI.",
                            )
                        ],
                    )
                },
            )
        # For mock, we simply return an empty instantiation of the model.
        return response_model.model_construct()
