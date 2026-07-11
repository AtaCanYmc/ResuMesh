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

2. Install dependencies and Playwright browsers:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
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

### ⚙️ Quick Start: Mock Mode
To run the server instantly without providing paid API keys (OpenAI or Groq), configure your `.env` as follows:
```env
LLM_PROVIDER=mock
```
When mock mode is enabled, the CV generator service will instantly return beautifully structured mock CV markdown files, making local testing cost-free and fast.

### 🗄️ Database Configurations
- `DATABASE_URL`: Connection string for PostgreSQL / Supabase.
- `LLM_PROVIDER`: Choose your LLM engine (`openai`, `groq`, `ollama`, or `mock`).

---

## 🧪 Testing and Code Quality

We use `pytest` along with an in-memory database configuration and a mock LLM provider for isolated, fast test execution.

* To run backend tests:
  ```bash
  PYTHONPATH=. pytest tests -v
  ```

* Code style and linting configuration can be verified using `.flake8` rules.

---

## 📖 Interactive API Documentation

FastAPI automatically generates interactive, self-documenting API structures. Once your server is running, explore and test the endpoints directly from your browser:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs) (Interactive testing UI, view schemas and try endpoints live)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc) (Clean, structured documentation layout for read-only references)

## 🤝 Contributing & Code Quality
Before submitting a pull request, make sure to install the **pre-commit** hooks to ensure consistent code styling:
```bash
pip install pre-commit
pre-commit install
```
This will automatically check linting rules on every commit.
