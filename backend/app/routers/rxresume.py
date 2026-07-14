from fastapi import APIRouter, Depends, HTTPException
from reactive_resume.models import Basics
from sqlalchemy.orm import Session

from app.db.base import ISystemLogRepository
from app.db.dependencies import get_db, get_system_log_repo
from app.models.education import Education
from app.models.skill import Skill
from app.services.auth_service import get_current_admin
from app.services.mappers.reactive_resume_mapper import ReactiveResumeMapper
from app.services.reactive_resume_service import ReactiveResumeService

router = APIRouter(prefix="/admin/rxresume", tags=["Admin Reactive Resume Management"])


@router.get("/resumes")
async def get_rxresume_resumes(
    admin=Depends(get_current_admin),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
):
    try:
        service = ReactiveResumeService(log_provider=log_repo)
        resumes = await service.list_resumes()
        return {
            "status": "success",
            "resumes": [
                r.model_dump(by_alias=True, exclude_none=True) for r in resumes
            ],
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch resumes: {str(e)}"
        )


@router.get("/resume/{resume_id}/pdf")
async def get_rxresume_pdf(
    resume_id: str,
    admin=Depends(get_current_admin),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
):
    try:
        service = ReactiveResumeService(log_provider=log_repo)
        pdf_url = await service.export_to_pdf(resume_id)
        return {"status": "success", "url": pdf_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get PDF URL: {str(e)}")


@router.post("/resume/{resume_id}/sync")
async def sync_rxresume(
    resume_id: str,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
):
    try:
        # Fetch all local database records
        skills = db.query(Skill).all()
        educations = db.query(Education).all()

        from app.models.article import Article
        from app.models.certificate import Certificate
        from app.models.experience import Experience
        from app.models.project import Project

        db_projects = db.query(Project).all()
        db_experiences = db.query(Experience).all()
        db_certificates = db.query(Certificate).all()
        db_articles = db.query(Article).all()

        # Build Basics
        basics = Basics(
            name="Ata Can Yaymacı",
            headline="Software Engineer",
            email="ata@example.com",
            phone="",
            website="",
            location="",
            profiles=[],
        )

        # Create Import Data using Mapper
        import_data = ReactiveResumeMapper.build_resume_import_data(
            title="ResuMesh Synced CV",
            basics=basics,
            projects=db_projects,
            experiences=db_experiences,
            educations=educations,
            certificates=db_certificates,
            articles=db_articles,
            skills=skills,
        )

        # Sync using Service
        service = ReactiveResumeService(log_provider=log_repo)
        await service.sync_mesh_data_to_resume(resume_id, import_data)

        return {
            "status": "success",
            "message": "Resume data successfully synchronized with ResuMesh.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.get("/applications")
async def get_rxresume_applications(
    admin=Depends(get_current_admin),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
):
    try:
        service = ReactiveResumeService(log_provider=log_repo)
        apps = await service.client.applications.list()
        return {
            "status": "success",
            "applications": [
                a.model_dump(by_alias=True, exclude_none=True) for a in apps
            ],
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch job applications: {str(e)}"
        )


@router.get("/agent/threads")
async def get_rxresume_agent_threads(
    admin=Depends(get_current_admin),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
):
    try:
        service = ReactiveResumeService(log_provider=log_repo)
        threads = await service.client.agent.list_threads()
        return {"status": "success", "threads": threads}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch agent threads: {str(e)}"
        )


@router.get("/ai-providers")
async def get_rxresume_ai_providers(
    admin=Depends(get_current_admin),
    log_repo: ISystemLogRepository = Depends(get_system_log_repo),
):
    try:
        service = ReactiveResumeService(log_provider=log_repo)
        providers = await service.client.ai_providers.list()
        return {"status": "success", "providers": providers}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch AI providers: {str(e)}"
        )
