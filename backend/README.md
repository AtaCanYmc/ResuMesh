# ⚙️ ResuMesh - Public Backend API

This is the public, read-only API engine powering the visitor-facing ResuMesh portfolio application. It is built with **FastAPI** and **SQLAlchemy** to fetch and serve portfolio data securely.

> [!NOTE]
> All administrative operations (authentication, scraping, LinkedIn imports, and AI CV generation) have been separated and moved to the administrative backend located under [admin/backend](../admin/backend). Unused libraries, templates, and LLM integrations have been completely removed from this service to optimize memory usage and container boot times.

## 🏗️ Architectural Features

1. **Modular Repository Pattern:**
   This backend uses decoupled repository interfaces and concrete database providers:
   - Interfaces are located in `app/db/repositories/` (e.g. `project.py`, `education.py`, etc.).
   - Providers are located in `app/db/providers/` (e.g. `supabase/` and `sqlalchemy/`).
   - Routers inject these repositories cleanly using FastAPI dependency injection (`app/db/dependencies.py`).
2. **Centralized Configuration Layer:**
   Environment variables are managed and validated globally using a single Pydantic settings class (`app/config/settings.py`).
3. **Local Telemetry Fallback:**
   Telemetry events (e.g., CV downloads, health checks) are tracked locally via the standard application logger, removing third-party SDK dependencies like PostHog.

## 🛠️ Tech Stack & Key Libraries
- **Framework:** FastAPI (Asynchronous lifecycle)
- **Database Connection:** Supabase (Postgres) via HTTP client and SQLAlchemy direct connection for read-only routes.
- **ORM:** SQLAlchemy 2.0

## 🚀 Local Development Setup

### Prerequisites
- Python 3.11+
- Virtualenv (`python -m venv .venv`)

### Installation Steps
1. Navigate to the backend directory and create a virtual environment:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the local server with hot-reload:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

## 🔐 Environment Variables (.env)

Create a `.env` file based on `.env.example`:

- `DATABASE_URL`: Connection string for Supabase/Postgres.
- `SUPABASE_URL`: Remote Supabase URL.
- `SUPABASE_KEY`: Remote Supabase public/private key.

---

## 🧪 Testing

We use `pytest` for unit testing. The public backend test suite verifies search functionality, health status, and read-only endpoints:

* To run public backend tests:
  ```bash
  PYTHONPATH=. pytest tests -v
  ```

---

## 📖 Interactive API Documentation

FastAPI automatically generates interactive, self-documenting API structures. Once your server is running, explore the endpoints directly from your browser:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
