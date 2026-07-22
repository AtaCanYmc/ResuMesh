# ⚙️ ResuMesh - Private Admin Backend API

This is the private administrative backend API service powering ResuMesh administrative actions. It handles all authentication write operations, database mutations, background scraping, LinkedIn PDF imports, and AI-driven CV tailoring.

## 🛠️ Tech Stack & Key Libraries
- **Framework:** FastAPI (Asynchronous lifecycle)
- **Database Connection:** Supabase (Postgres) via HTTP client and SQLAlchemy direct connection.
- **ORM:** SQLAlchemy 2.0
- **Web Ingestion Scraping:** Playwright + Tenacity (for resilient scraper retries)
- **LLM Integration:** Groq, OpenAI, and Ollama

## 🚀 Local Development Setup

### Prerequisites
- Python 3.11+
- Virtualenv (`python -m venv .venv`)

### Installation Steps
1. Navigate to the admin backend directory and create a virtual environment:
   ```bash
   cd admin/backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies and Playwright browsers:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

3. Start the local server with hot-reload:
   ```bash
   PYTHONPATH=. uvicorn app.main:app --port 8001 --reload
   ```

## 🔐 Environment Variables (.env)

Create a `.env` file based on `.env.example`:

- `DATABASE_URL`: Connection string for Supabase/Postgres.
- `SUPABASE_URL`: Remote Supabase URL.
- `SUPABASE_KEY`: Remote Supabase private key.
- `ADMIN_USERNAME`: Admin login username.
- `ADMIN_PASSWORD`: Admin login password.
- `JWT_SECRET_KEY`: Private secret key for JWT session authorization.
- `LLM_PROVIDER`: Groq, OpenAI, Ollama, or mock.
- `GROQ_API_KEY`: Groq Cloud API key.

---

## 🧪 Testing

We use `pytest` for unit/integration checks:

* To run tests:
  ```bash
  PYTHONPATH=. pytest tests -v
  ```

---

## 📖 Interactive API Documentation

FastAPI automatically generates interactive, self-documenting API structures. Once your server is running, explore the admin endpoints directly from your browser:

- **Swagger UI**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **ReDoc**: [http://localhost:8001/redoc](http://localhost:8001/redoc)
