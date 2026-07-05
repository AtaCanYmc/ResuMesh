from app.db.base import ProjectRepository
from app.llm.base import LLMProvider
from app.services.scraper_service import ScraperService


class CVGeneratorService:
    def __init__(self, db_provider: ProjectRepository, llm_provider: LLMProvider):
        self.db = db_provider
        self.llm = llm_provider

    async def generate_tailored_cv(self, job_url: str) -> str:
        # 1. Scrape the job description
        job_description = await ScraperService.scrape_job_description(job_url)

        # 2. Assemble context from DB
        projects = await self.db.get_projects(limit=10)
        experiences = await self.db.get_all_experiences()
        articles = await self.db.get_all_articles()
        certificates = await self.db.get_all_certificates()

        context_lines = []

        if projects:
            context_lines.append("## Projects")
            for p in projects:
                tech = ", ".join(p.languages + p.tags)
                context_lines.append(f"- {p.title}: {p.description} (Tech: {tech})")

        if experiences:
            context_lines.append("\n## Experiences")
            for e in experiences:
                context_lines.append(
                    f"- {e.title} at {e.company_name}: {e.description}"
                )

        if articles:
            context_lines.append("\n## Articles")
            for a in articles[:5]:  # Top 5 articles
                context_lines.append(f"- {a.title}: {a.summary}")

        if certificates:
            context_lines.append("\n## Certificates")
            for c in certificates:
                context_lines.append(f"- {c.name} by {c.issuing_organization}")

        user_context = "\n".join(context_lines)

        # 3. Call LLM
        cv_markdown = await self.llm.generate_cv(
            job_description=job_description, user_context=user_context
        )

        return cv_markdown
