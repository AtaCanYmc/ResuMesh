# ⚙️ ResuMesh - Backend API

This is the core asynchronous API engine powering ResuMesh, built with **FastAPI**, **SQLAlchemy**, and integrated with various database providers and LLMs.

## 🛠️ Tech Stack & Key Libraries
- **Framework:** FastAPI (Asynchronous lifecycle)
- **Database Migrations:** Alembic
- **Web Scraping:** Playwright + Tenacity (for resilient job board scraping)
- **Rate Limiting:** Slowapi (IP-based throttling)

## 🚀 Local Development Setup

### Prerequisites
- Python 3.11+
- Virtualenv (`pip install venv`)

### Installation Steps
1. Navigate to the backend directory and create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run database migrations using **Alembic**:
   ```bash
   alembic upgrade head
   ```

4. Start the local server with hot-reload:
   ```bash
   uvicorn app.main:app --reload
   ```

## 🔐 Environment Variables (.env)

Create a `.env` file based on `.env.example`:

* `DATABASE_URL`: Connection string for PostgreSQL/Supabase.
* `DB_PROVIDER`: `local-postgres`, `mongodb`, `supabase`, or `firebase`.
* `LLM_PROVIDER`: LLM engine configuration (`openai`, `ollama`, `groq`, or `mock`).

## 🧪 Testing and Code Quality

We use `pytest` along with an in-memory `MockProvider` for isolated, fast test execution.

* To run tests:
  ```bash
  pytest -v
  ```

* Code style and linting configuration can be verified using `.flake8` rules.

## 📖 API Documentation

Once the server is running, you can explore and test the interactive API endpoints at:

* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing & Code Quality
Before submitting a pull request, make sure to install the **pre-commit** hooks to ensure consistent code styling:
```bash
pip install pre-commit
pre-commit install
```
This will automatically check linting rules on every commit.
