from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import projects
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
origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to ResuMesh API"}
