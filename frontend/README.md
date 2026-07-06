# 🖥️ ResuMesh - Client Dashboard

This is the frontend user interface for ResuMesh, designed as a modern dark-themed single-page application (SPA) using **React**, **Vite**, and **TypeScript**.

## 🛠️ Tech Stack & Tooling
- **Build Tool:** Vite (Ultra-fast Hot Module Replacement)
- **Language:** TypeScript (`StrictMode` enforced)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Linter:** Oxlint (High-performance JS/TS linter)

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

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
   cp .env.example .env.local
   ```
   *(Kopyaladıktan sonra `VITE_API_URL=http://localhost:8000/api/v1` değerini kontrol ederek backend URL'nizle eşleştiğinden emin olun.)*

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in your browser.

## 📂 Codebase Architecture

* `/src/components`: Atomic and reusable UI primitives (e.g., `SearchBar.tsx`).
* `/src/pages`: Higher-level views and route components (e.g., `AdminDashboard.tsx`).
* `/src/assets`: Static visuals and global design vectors.

## 🧹 Linting and Formatting

To maintain optimal code quality and lightning-fast static analysis, we use **Oxlint**. You can audit the codebase by running:

```bash
npx oxlint
```

## 🤝 Contributing & Code Quality
Before submitting a pull request, make sure to install the **pre-commit** hooks to ensure consistent code styling:
```bash
pip install pre-commit
pre-commit install
```
This will automatically check linting rules on every commit.

*(Eğer sadece Node tabanlı araçlarla çalışmak isterseniz, ileride `husky` ve `lint-staged` entegre edilerek `npm run lint` süreçleri otomatize edilebilir. Şimdilik root dizinindeki pre-commit zorunludur.)*
