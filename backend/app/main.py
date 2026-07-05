from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, projects
from app.schedulers.sync_scheduler import scheduler, start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Uygulama başlarken: Zamanlayıcıyı çalıştır
    start_scheduler()
    yield
    # Uygulama kapanırken: Zamanlayıcıyı güvenli kapat
    scheduler.shutdown()


app = FastAPI(
    title="StackEcho API",
    description="Açık Kaynak Akıllı Portfolyo ve CV Yönetim Sistemi",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to ResuMesh API"}
