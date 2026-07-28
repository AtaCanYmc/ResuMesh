import asyncio

from resumesh_llm import LLMClient

from app.db.repositories import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
)
from app.services.scraper_service import ScraperService


class CVGeneratorService:
    def __init__(
        self,
        project_repo: IProjectRepository,
        experience_repo: IExperienceRepository,
        article_repo: IArticleRepository,
        cert_repo: ICertificateRepository,
        llm_client: LLMClient,
    ):
        self.project_repo = project_repo
        self.experience_repo = experience_repo
        self.article_repo = article_repo
        self.cert_repo = cert_repo
        self.llm = llm_client

    async def generate_tailored_cv(self, job_url: str, skills: list = None):
        # Fetch external scraping and internal database records concurrently
        job_desc_task = ScraperService.scrape_job_description(job_url)
        projects_task = self.project_repo.get_projects(limit=10)
        experiences_task = self.experience_repo.get_all_experiences()
        articles_task = self.article_repo.get_all_articles()
        certs_task = self.cert_repo.get_all_certificates()

        (
            job_description,
            projects,
            experiences,
            articles,
            certificates,
        ) = await asyncio.gather(
            job_desc_task, projects_task, experiences_task, articles_task, certs_task
        )

        context_lines = []

        if skills:
            context_lines.append("## Skills")
            # Group by category if we want, or just a comma separated list
            from collections import defaultdict

            skill_map = defaultdict(list)
            for s in skills:
                skill_map[s.category].append(s.name)
            for cat, s_names in skill_map.items():
                context_lines.append(f"- {cat}: {', '.join(s_names)}")

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

        # Security: Truncate inputs to prevent buffer overflow/context attacks
        MAX_INPUT_LENGTH = 20000
        safe_job_description = job_description[:MAX_INPUT_LENGTH]
        safe_user_context = user_context[:MAX_INPUT_LENGTH]

        # 3. Call LLM for Structured Output
        from reactive_resume.models import ResumeImportData
        from resumesh_llm import CVOptimizer

        optimizer = CVOptimizer(client=self.llm)
        tailored_cv_data = await optimizer.generate_tailored_cv(
            job_description=safe_job_description,
            user_context=safe_user_context,
            response_model=ResumeImportData,
        )

        return tailored_cv_data
