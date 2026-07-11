import os
from typing import Optional

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Query,
    Request,
    UploadFile,
)
from pydantic import BaseModel, HttpUrl
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.db.base import (
    IArticleRepository,
    ICertificateRepository,
    IExperienceRepository,
    IProjectRepository,
    ISystemLogRepository,
)
from app.db.dependencies import (
    get_article_repo,
    get_certificate_repo,
    get_db,
    get_experience_repo,
    get_project_repo,
    get_system_log_repo,
)
from app.llm.factory import get_llm_provider
from app.services.auth_service import get_current_admin
from app.services.cv_generator_service import CVGeneratorService
from app.services.ingestion_service import IngestionService
from app.services.pdf_parser_service import LinkedInPDFParser
from app.services.telemetry_service import get_telemetry_data, telemetry

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/admin", tags=["Admin Log Management"])


class CVGenerateRequest(BaseModel):
    job_url: HttpUrl


@router.post("/generate-cv")
@limiter.limit("5/minute")
async def generate_cv(
    request: Request,
    payload: CVGenerateRequest,
    project_repo: IProjectRepository = Depends(get_project_repo),
    experience_repo: IExperienceRepository = Depends(get_experience_repo),
    article_repo: IArticleRepository = Depends(get_article_repo),
    cert_repo: ICertificateRepository = Depends(get_certificate_repo),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    try:
        llm_provider = get_llm_provider()
        cv_service = CVGeneratorService(
            project_repo, experience_repo, article_repo, cert_repo, llm_provider
        )

        from app.models.skill import Skill

        skills = db.query(Skill).all()

        cv_markdown = await cv_service.generate_tailored_cv(
            str(payload.job_url), skills=skills
        )

        telemetry_ctx["background_tasks"].add_task(
            telemetry.capture_event,
            distinct_id=telemetry_ctx["ip"],
            event_name="cv_generation_requested",
            properties={
                "job_url": str(payload.job_url),
                "ip": telemetry_ctx["ip"],
                "user_agent": telemetry_ctx["ua"],
            },
        )

        return {"status": "success", "cv_markdown": cv_markdown}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh-data")
@limiter.limit("2/minute")
async def refresh_data(
    request: Request,
    background_tasks: BackgroundTasks,
    project_repo: IProjectRepository = Depends(get_project_repo),
    article_repo: IArticleRepository = Depends(get_article_repo),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
    admin=Depends(get_current_admin),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    """Admin endpoint to manually trigger data scraping
    from platforms in the background."""
    github_user = os.getenv("GITHUB_USERNAME")
    medium_user = os.getenv("MEDIUM_USERNAME")
    devto_user = os.getenv("DEVTO_USERNAME")

    ingestion = IngestionService(log_provider=log_repo)
    has_tasks = False

    if github_user:
        from app.services.scrapers.github_scraper import GitHubScraper

        scraper = GitHubScraper()
        background_tasks.add_task(
            ingestion.fetch_github_repos,
            scraper=scraper,
            username=github_user,
            provider=project_repo,
        )
        has_tasks = True

    if medium_user:
        from app.services.scrapers.medium_scraper import MediumScraper

        scraper = MediumScraper()
        background_tasks.add_task(
            ingestion.fetch_medium_articles,
            scraper=scraper,
            username=medium_user,
            provider=article_repo,
        )
        has_tasks = True

    if devto_user:
        from app.services.scrapers.devto_scraper import DevToScraper

        scraper = DevToScraper()
        background_tasks.add_task(
            ingestion.fetch_devto_articles,
            scraper=scraper,
            username=devto_user,
            provider=article_repo,
        )
        has_tasks = True

    if not has_tasks:
        raise HTTPException(
            status_code=400, detail="No platform usernames configured in environment."
        )

    telemetry_ctx["background_tasks"].add_task(
        telemetry.capture_event,
        distinct_id=telemetry_ctx["ip"],
        event_name="data_refresh_triggered",
        properties={
            "github": bool(github_user),
            "medium": bool(medium_user),
            "devto": bool(devto_user),
            "ip": telemetry_ctx["ip"],
            "user_agent": telemetry_ctx["ua"],
        },
    )

    return {
        "status": "processing",
        "message": "Data ingestion started in the background.",
    }


@router.get("/logs")
@limiter.limit("10/minute")
async def get_system_logs(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    level: Optional[str] = None,
    module: Optional[str] = None,
    search_query: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    provider: ISystemLogRepository = Depends(get_system_log_repo),
    current_admin: dict = Depends(get_current_admin),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    """Retrieves the system logs from database with pagination and filtering."""
    total_count = await provider.get_logs_count(
        level=level,
        module=module,
        search_query=search_query,
        start_date=start_date,
        end_date=end_date,
    )
    logs = await provider.get_logs(
        page=page,
        limit=limit,
        level=level,
        module=module,
        search_query=search_query,
        start_date=start_date,
        end_date=end_date,
    )

    telemetry_ctx["background_tasks"].add_task(
        telemetry.capture_event,
        distinct_id=telemetry_ctx["ip"],
        event_name="system_logs_viewed",
        properties={
            "page": page,
            "limit": limit,
            "level": level,
            "module": module,
            "ip": telemetry_ctx["ip"],
            "user_agent": telemetry_ctx["ua"],
        },
    )

    return {"total": total_count, "page": page, "limit": limit, "data": logs}


@router.post("/import/linkedin-pdf")
@limiter.limit("5/minute")
async def import_linkedin_pdf(
    request: Request,
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin),
    experience_repo: IExperienceRepository = Depends(get_experience_repo),
    certificate_repo: ICertificateRepository = Depends(get_certificate_repo),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    """Parses LinkedIn profile PDF uploaded via admin panel using LLM
    and saves to database."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a valid PDF file.")

    try:
        pdf_bytes = await file.read()
        raw_text = LinkedInPDFParser.extract_raw_text(pdf_bytes)

        llm_provider = get_llm_provider()
        structured_data = await LinkedInPDFParser.parse_with_llm(raw_text, llm_provider)

        # Save to database (Upsert / Create)
        experiences = getattr(structured_data, "experiences", []) or []
        for exp in experiences:
            await experience_repo.create_experience(exp)

        certificates = getattr(structured_data, "certificates", []) or []
        for cert in certificates:
            await certificate_repo.create_certificate(cert)

        telemetry_ctx["background_tasks"].add_task(
            telemetry.capture_event,
            distinct_id=telemetry_ctx["ip"],
            event_name="linkedin_pdf_imported",
            properties={
                "filename": file.filename,
                "ip": telemetry_ctx["ip"],
                "user_agent": telemetry_ctx["ua"],
            },
        )

        return {
            "status": "success",
            "message": "PDF parsed successfully by AI and saved to database.",
            "data": structured_data.model_dump(),
            "raw": raw_text,
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Operation failed: {str(e)}")
