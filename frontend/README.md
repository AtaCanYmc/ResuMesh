# 🖥️ ResuMesh - Visitor Portfolio UI

This is the public visitor-facing frontend interface for ResuMesh. It is designed as a modern dark-themed single-page application (SPA) using **React**, **Vite**, and **TypeScript** for recruiters to view skills, projects, and articles.

> [!NOTE]
> All administrative control panel dashboards and forms (login, CV generation, scrapers, LinkedIn imports) have been separated and moved to the administrative frontend located under [admin/frontend](../admin/frontend).

## 🛠️ Tech Stack & Tooling
- **Build Tool:** Vite
- **Language:** TypeScript (`StrictMode` enforced)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Linter:** Oxlint (High-performance JS/TS linter)

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+

### Installation Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local configuration by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the Vite development server:
   ```bash
   npm run dev -- --port 3000
   ```

Open `http://localhost:3000` in your browser.

---

## 📚 Component Documentation & Testing

Storybook is integrated to document and develop UI components in isolation:
- **Run Storybook Server**:
  ```bash
  npm run storybook
  ```
  *Opens the interactive sandbox catalog at `http://localhost:6006`.*

### 🧪 Frontend Test Execution (Vitest)
We use **Vitest** + **React Testing Library** for unit checks:
- **Run all tests (headless)**:
  ```bash
  npm run test
  ```
