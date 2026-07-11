<p align="center">
  <img src="docs/images/resumesh_logo.jpg" alt="ResuMesh Logo" width="200" height="200" />
</p>

# ⚡ ResuMesh

> **An AI-powered, open-source smart portfolio aggregator and tailored CV generator.**

[![Apache License 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_15-336791.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Storybook](https://img.shields.io/badge/UI-Storybook-FF4785.svg?style=flat&logo=storybook&logoColor=white)](https://storybook.js.org/)

---

## 📌 Overview

![Dark Mode UI Placeholder](https://via.placeholder.com/800x400?text=Dark+Mode+UI+Screenshot)
![Search & Admin Panel Placeholder](https://via.placeholder.com/800x400?text=Search+and+Admin+Panel+Screenshot)

ResuMesh is a self-hosted, dynamic portfolio hub designed for modern developers. Instead of maintaining static personal websites, ResuMesh continuously syncs your digital footprint from **GitHub**, **Medium**, and **Dev.to** into a single, unified database.

It features:
- ⚡ **Global Search Bar**: Lightning-fast filtering of your skills, projects, and articles for recruiters.
- ✨ **AI CV Tailoring**: Groq/OpenAI integration for real-time, tailored PDF resume generation based on specific job descriptions.
- 🔄 **Continuous Sync**: Automatically aggregates your digital footprint into a single unified database.

## 📂 Project Structure & Component READMEs

- [/backend](./backend): FastAPI architecture, Database providers, Alembic migrations, AI CV Generator, and Pytest suite.
- [/frontend](./frontend): React + TypeScript client, Vite configuration, Tailwind CSS design system, Storybook component documentation, and Oxlint rules.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Frontend [Vite + React Client]
        UI[User Interface]
        Admin[Admin Dashboard]
        Search[Global Search Bar]
    end

    subgraph API [FastAPI Backend]
        Auth[JWT Auth]
        Ingest[Ingestion Service]
        AI[CV Generator Service]
        Logs[System Logs]
    end

    subgraph LLM [AI Providers]
        OpenAI[OpenAI]
        Groq[Groq]
        Ollama[Ollama Local]
        Mock[Mock LLM]
    end

    subgraph Data [Data Sources]
        GH[GitHub Scraper]
        Med[Medium Scraper]
        DevTo[Dev.to Scraper]
    end

    subgraph DB [Database Layer]
        PG[(PostgreSQL / Supabase)]
    end

    UI --> API
    Admin --> Auth
    Search --> PG

    Ingest --> GH
    Ingest --> Med
    Ingest --> DevTo
    Ingest --> PG

    AI --> LLM
    AI --> PG

    API --> Logs
    Logs --> PG
```

---

## 🛠️ Architectural & Engineering Decisions (ADRs)

Architecture decisions in ResuMesh are documented and justified to maintain a clean, maintainable, and decoupled codebase.
- **[ADR-0001: Record Architecture Decisions](docs/adr/0001-record-architecture-decisions.md)**: Declares the use of ADRs.
- **[ADR-0002: Frontend Tech Stack](docs/adr/0002-frontend-tech-stack-vite-react-query.md)**: Justifies React, Vite, and React Query usage.

---

## 🔄 Product Flow: How it Works

1. **Continuous Aggregation**: You enter your developer handles (GitHub, Medium, Dev.to). The backend scrapers ingest all your projects, posts, and articles in the background.
2. **Context-Driven Search**: Recruiters search your profile through the lightning-fast, fuzzy-matching search bar.
3. **AI CV Generation**: You provide a target Job Description URL. The system gathers all your DB records, constructs a context-rich prompt, feeds it to the LLM (Groq/OpenAI), and renders a tailored Markdown/PDF CV.

---

## ⚙️ Quick Start with Mock Mode (API Key Free)

You can experience and test ResuMesh locally **without any OpenAI/Groq API keys** or active databases:
1. In `backend/.env` (or `docker-compose.yml`), set the LLM provider to mock:
   ```env
   LLM_PROVIDER=mock
   ```
2. Spin up the containers (fallback databases will run automatically). The application will generate mock CVs instantly without consuming any API quota!

---

## 🚀 Running the Application

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AtaCanYmc/ResuMesh.git
   cd ResuMesh
   ```

2. **Environment Configuration:**
   Copy the example `.env` files and fill in your credentials.
   ```bash
   cp frontend/.env.example frontend/.env
   # Add your API keys to the backend environment variables or docker-compose.yml
   ```

3. **Run with Docker Compose:**
   **Run with PostgreSQL database:**
   ```bash
   docker compose --profile postgres up --build -d
   ```

   Once running:
   - **Frontend UI**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8000`
   - **Interactive API Documentation (Swagger)**: `http://localhost:8000/docs`
   - **Alternative API Documentation (ReDoc)**: `http://localhost:8000/redoc`

---

## 🌍 Cloud Deployment

Looking to deploy ResuMesh for free using Vercel (Frontend), Render (Backend), and remote PostgreSQL (Supabase)?

Read our comprehensive guide here: **[DEPLOYMENT.md](docs/DEPLOYMENT.md)**

---

## 🗄️ Database Migrations (Alembic)

This project uses [Alembic](https://alembic.sqlalchemy.org/) to handle PostgreSQL database migrations (Infrastructure as Code).

### Setting up Supabase / Remote DB
1. In `backend/.env`, set your pooler connection string (e.g., Supabase Port 6543):
   ```env
   DATABASE_URL=postgresql://[user]:[password]@[host]:6543/postgres
   ```

### Running Migrations via Docker
Because the backend container isolates its filesystem, you must mount your local volume when generating new migration files so they save to your local codebase:

**1. Create a new migration:**
```bash
docker compose run --rm -v $(pwd)/backend:/app backend alembic revision --autogenerate -m "your_message"
```

**2. Apply migrations to the database:**
```bash
docker compose run --rm backend alembic upgrade head
```

---

## 🤝 Contributing & Code Quality

Before submitting a pull request, make sure to install the **pre-commit** hooks to ensure consistent code styling.
*(Not: Bu proje hem Python hem de Node.js standartlarını korumak için pre-commit kullanır. Sadece frontend tarafına katkı yapacak olsanız bile sisteminizde Python kurulu olduğundan emin olun.)*
```bash
pip install pre-commit
pre-commit install
```
This will automatically check linting rules on every commit.

Contributions are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit a Pull Request, our code styling rules, and conventional commit standards.

---

## 📄 License

Distributed under the Apache License 2.0. See `LICENSE` for more information.
