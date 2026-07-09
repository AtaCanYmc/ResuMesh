# Contributing to ResuMesh

First off, thank you for considering contributing to **ResuMesh**! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🚀 How Can I Contribute?

### 1. Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/AtaCanYmc/ResuMesh/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### 2. Suggesting Enhancements
- Open a new issue and provide a clear, detailed explanation of the feature.
- Explain why this enhancement would be useful to most users.

### 3. Pull Requests
1. Fork the project.
2. Create your feature branch: `git checkout -b feature/AmazingFeature` or `git checkout -b fix/BugFix`.
3. Commit your changes following our **Commit Message Standard** (see below).
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request and describe the changes thoroughly.

---

## 💬 Commit Message Standard

We use [Conventional Commits](https://www.conventionalcommits.org/). This means all your commit messages should be formatted like so:

```
<type>(<optional scope>): <description>
```

**Allowed Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

*Example:* `feat(ai): add support for local Ollama models`

---

## 💅 Code Style Guide

We enforce strict coding standards to keep the codebase clean and maintainable. Our CI pipeline will automatically reject code that doesn't meet these standards.

### Backend (Python)
We use `flake8` for linting, `black` for formatting, and `isort` for import sorting.
```bash
# Inside the backend/ directory:
black app tests
isort app tests
flake8 app tests
```
*Note: Our max-line-length is configured to `88` characters to be compatible with Black.*

### Frontend (React/Vite)
We use `oxlint` and standard npm scripts for linting the frontend.
```bash
# Inside the frontend/ directory:
npm run lint
```

---

## 🧪 Testing

Before submitting a PR, make sure your code passes all existing tests and include new tests if you are adding new functionality.

```bash
# Inside the backend directory
PYTHONPATH=. pytest -v
```

---

## 🏗️ Architecture & Guidelines

### Adding a new Database Provider
ResuMesh supports multiple databases (Postgres, MongoDB, Firebase, etc.). To add a new provider:
1. Create a new file under `backend/app/db/providers/` (e.g., `sqlite_provider.py`).
2. Implement the `DatabaseProvider` interface methods.
3. Register your provider in `backend/app/db/factory.py` so it can be instantiated via configuration.
4. Update the `.env.example` with any new required environment variables.

### Adding a new Scraper Service
Scrapers are responsible for fetching data from external sources (e.g., Medium, GitHub).
1. Create a new service under `backend/app/services/scrapers/` (e.g., `devto_scraper.py`).
2. Inherit from the base scraper class if available, or ensure it implements a standard `fetch_data()` method.
3. Add a background job in `backend/app/services/scheduler.py` if the scraping should run periodically.

### Architecture Decision Records (ADRs)
We keep track of significant architectural decisions in the `docs/adr/` directory. If you are introducing a new technology, framework, or making a major architectural change, please write an ADR outlining the context, decision, and consequences.

Thank you for your contribution! 🎉
