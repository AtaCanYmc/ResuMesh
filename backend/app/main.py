from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import projects

app = FastAPI(
    title="ResuMesh API",
    description="API for personal portfolio and CV generation",
    version="0.1.0"
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
