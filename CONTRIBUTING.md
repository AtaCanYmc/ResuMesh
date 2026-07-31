# Contributing to ResuMesh

First off, thank you for considering contributing to **ResuMesh**! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

---

## 🚀 How Can I Contribute?

### 1. Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/AtaCanYmc/ResuMesh/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a clear title and description, steps to reproduce, and any error logs or screenshots.

### 2. Suggesting Enhancements
- Open a new issue and provide a clear, detailed explanation of the proposed feature or improvement.
- Explain why this enhancement would be useful to the community and how it fits into the ResuMesh ecosystem.

### 3. Pull Requests (PRs)
1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   # or for bug fixes
   git checkout -b fix/BugFix
   ```
3. Commit your changes following our **Commit Message Standard** (see below).
4. Push to your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request on GitHub and fill in the PR template/description thoroughly.

---

## 💬 Commit Message Standard

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <description>
```

### Allowed Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi-colons, code style changes (no production logic change)
- `refactor`: Refactoring code without adding a feature or fixing a bug
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance, CI/CD pipeline, dependency updates

*Example:* `feat(frontend): add packages page with platform filters`

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+ & `npm` / `pnpm`
- **Python**: v3.10+ & `pip` / `venv`
- **Docker & Docker Compose** (Optional for local PostgreSQL / Supabase stack)

### 2. Setting Up Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Setting Up Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Setting Up Admin Panel
```bash
# Admin Backend
cd admin/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Admin Frontend
cd admin/frontend
npm install
npm run dev
```

---

## 💅 Code Style & Linting Guidelines

We enforce clean coding standards across both frontend and backend projects.

### Backend (Python)
We use `flake8`, `black`, and `isort`:
```bash
# In backend/ or admin/backend/
black app tests
isort app tests
flake8 app tests
```

### Frontend (React & TypeScript)
We use `oxlint` and TypeScript compiler checks:
```bash
# In frontend/ or admin/frontend/
npm run lint
```

---

## 🧪 Testing

Make sure all automated tests pass before submitting your Pull Request:

```bash
# Run backend tests
cd backend
pytest -v

# Run admin backend tests
cd admin/backend
pytest -v
```

---

## 📜 Code of Conduct

Help us keep ResuMesh open, welcoming, and inclusive. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all project spaces.

Thank you for contributing to ResuMesh! 🎉
