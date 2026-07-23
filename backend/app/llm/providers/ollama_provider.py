from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate

from app.config.settings import settings
from app.llm.base import LLMProvider
from app.services.template_service import TemplateService


class OllamaProvider(LLMProvider):
    def __init__(self):
        base_url = settings.OLLAMA_BASE_URL
        model = settings.OLLAMA_MODEL

        self.llm = ChatOllama(base_url=base_url, model=model, temperature=0.3)

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
