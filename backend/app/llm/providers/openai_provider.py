import os

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from app.llm.base import LLMProvider


class OpenAIProvider(LLMProvider):
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY is not set.")

        self.llm = ChatOpenAI(
            api_key=api_key, model=os.getenv("OPENAI_MODEL", "gpt-4o"), temperature=0.3
        )

        self.prompt = PromptTemplate(
            input_variables=["job_description", "user_context"],
            template="""
You are an expert career consultant and CV writer.
I will provide you with a Job Description and a User Context containing all their projects, articles, experiences, and certificates.

Job Description:
{job_description}

User Context:
{user_context}

Your task is to generate a tailored, professional CV in Markdown format.
Highlight the experiences, projects, and skills from the User Context that best match the Job Description.  # noqa: E501
Do not invent any information. Only use the facts provided in the User Context.
The output should only contain the Markdown CV, without any conversational filler.
""",
        )

        self.chain = self.prompt | self.llm

    async def generate_cv(self, job_description: str, user_context: str) -> str:
        response = await self.chain.ainvoke(
            {"job_description": job_description, "user_context": user_context}
        )
        return response.content
