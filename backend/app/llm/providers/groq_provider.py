import os
from typing import Type

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel

from app.llm.base import LLMProvider
from app.services.template_service import TemplateService


class GroqProvider(LLMProvider):
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set.")

        self.llm = ChatGroq(
            api_key=api_key,
            model_name=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
            temperature=0.3,
        )

        template_str = TemplateService.get_template_content(
            "prompts/cv_generator.jinja2"
        )
        self.prompt = PromptTemplate.from_template(
            template_str, template_format="jinja2"
        )

        self.chain = self.prompt | self.llm

    async def generate_cv(self, job_description: str, user_context: str) -> str:
        response = await self.chain.ainvoke(
            {"job_description": job_description, "user_context": user_context}
        )
        return response.content

    async def generate_structured_output(
        self, prompt: str, response_model: Type[BaseModel]
    ) -> BaseModel:
        structured_llm = self.llm.with_structured_output(response_model)
        return await structured_llm.ainvoke(prompt)
