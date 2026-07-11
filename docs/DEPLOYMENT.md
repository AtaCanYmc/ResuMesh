# 🚀 Free "Golden Trio" Architecture Plan (Deployment)

If you want your project to stay online with "0 USD" cost while maintaining performance and persistence, you can apply the **"Golden Trio"** method used by developers worldwide for their side-projects.

Since your current file structure contains both a frontend (React/Vite) and a backend (Python/FastAPI), we will separate them and combine the "free tiers".

Here is the most sustainable free architecture plan:

| Layer | Platform | Why Choose This? |
| --- | --- | --- |
| **Frontend** | **Vercel** | Perfectly compatible with Vite/React. Unlimited bandwidth and never sleeps. |
| **Backend** | **Render (Free)** | Best free option for your setup due to Docker support. |
| **Database** | **Neon / Supabase** | Unlike Render, it never deletes your data and provides a free PostgreSQL database indefinitely. |

---

## How to Implement This Plan?

### Step 1: Frontend (Vercel)

Connect your Vite/React project (`/frontend` directory) to GitHub. When you import it into Vercel, it deploys with one click. There is no "sleep mode", your site is always instantly available.

### Step 2: Backend (Render) and the "Sleep" Solution

We will use Render for the backend (`/backend` directory). Render's free plan offers Docker support.

* **Sleep Issue:** Render's free plan spins down your backend if it doesn't receive requests for 15 minutes.
* **Solution:** By using a service like **[cron-job.org](https://cron-job.org/)**, send a "ping" (request) to your backend URL every 10 minutes. This way, your server never goes to sleep and is always ready.

### Step 3: Database (Neon or Supabase) - *Very Important*

**DO NOT USE Render's internal PostgreSQL service.** Render automatically deletes its free databases after 30 days.

* Instead, create a free database via **[Neon.tech](https://neon.tech/)** (Serverless PostgreSQL) or **[Supabase](https://supabase.com/)**.
* Add the `DATABASE_URL` (connection string) they provide into the "Environment Variables" section of your backend settings on Render. This ensures your data stays in the Neon/Supabase cloud forever, even if your app goes down.

---

## Why This Method?

* **Sustainability:** You avoid the risk of Render deleting your database.
* **Cost:** You are not locked into platforms like Railway that force you into paid tiers after 30 days.
* **Security:** Since you will manage DNS via **Cloudflare**, both your frontend on Vercel and your backend on Render will remain behind Cloudflare's DDoS protection.

**Summary:**
1. Frontend -> **Vercel** (DNS: Cloudflare)
2. Backend -> **Render** (Docker + Ping service)
3. Database -> **Neon / Supabase** (External database)

---

## ⚙️ Monorepo Configuration Strategy

The secret to using two different platforms (Vercel and Render) in a monorepo structure is correctly configuring the **"Root Directory"** setting on both platforms. This allows the platforms to build only the relevant folder (frontend or backend) rather than the entire repository.

Here is the step-by-step configuration strategy:

### 1. Frontend: Vercel Configuration

Vercel should detect your `frontend/` folder as a "React/Vite" project.

* **On the Platform:** When importing the project to Vercel, select **`frontend`** as the "Root Directory" setting.
* **Build Command:** Vercel usually detects this automatically, but ensure it is `npm run build`.
* **Output Directory:** Leave it as `dist` (Vite's default).
* **Environment Variables:** This is the most critical part. You will need to add the API URL you receive after deploying the backend here:
  * `VITE_API_URL` = (Backend URL from Render)

*Note: You already have a `frontend/vercel.json` file in your repository, which will handle routing and static configurations.*

### 2. Backend: Render Configuration

On Render, we will take the opposite approach.

* **On the Platform:** Go to "New + Service" -> "Web Service". Select your repository.
* **Root Directory:** Change the setting to **`backend`**. This ensures Render only looks for the `Dockerfile` inside this folder and executes it.
* **Environment Variables:**
  * `DATABASE_URL`: The connection string from Neon or Supabase.
  * `CORS_ORIGINS`: Add your deployed frontend URL from Vercel here (e.g., `https://resumesh.vercel.app`), otherwise, the backend will reject the request due to security.
* **⚠️ Memory Constraints & OOM Warnings:**
  Playwright headless browser execution and LLM data processing are memory-intensive. Running the backend on Render's lowest Free plan (512MB RAM) will likely trigger "Out of Memory (OOM)" crashes when scraping jobs. For stable production operation, it is **strongly recommended** to use a tier with at least 1GB/2GB of RAM (e.g. Render Starter or Standard plan).

### 3. Critical: About the "render.yaml" File

There is a `render.yaml` file in the root directory of your repository. If you use this file, Render will try to manage the entire repo as a single project using "Infrastructure as Code" (IaC).

**Recommendation:** If you want to start quickly and simply, instead of using the `render.yaml` file, **create a manual "Web Service"** via the Render dashboard and set the Root Directory to `backend`. If you insist on using IaC, you should edit the `render.yaml` file to only include the backend service definition:

```yaml
# Example: render.yaml (for backend only)
services:
  - type: web
    name: resumesh-backend
    runtime: docker
    repo: https://github.com/your-username/resumesh
    rootDir: backend
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: db-name
```

### 4. Deployment Order

Follow this order to connect the systems properly:

1. **Prepare the Database:** Create your SQL tables on Neon/Supabase (Run Alembic migrations).
2. **Deploy Backend (Render):** Once the backend is successfully up, it will give you a URL (e.g., `resumesh-api.onrender.com`).
3. **Deploy Frontend (Vercel):** Paste the URL you got in the previous step (`https://resumesh-api.onrender.com`) into the `VITE_API_URL` variable in the frontend build settings.
4. **Update CORS Setting:** Add the URL Vercel gives you to the backend's Environment Variables (`CORS_ORIGINS`).

**Summary:** The repo may be single, but the "deployment pipelines" are separated. Each platform looks at its own root directory.

While doing this configuration, if you encounter "build failed" errors on Vercel or Render, simply checking the error codes from the "Logs" section of that service will suffice.

---

## CI/CD: Auto-Deploy Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automates testing and deployment.

### Pipeline Flow

```
Push/PR to main
      │
      ├── backend-tests (pytest + lint)
      │
      ├── frontend-build (vitest + build)
      │
      └── deploy (only on push to main, after both jobs pass)
              │
              └── Triggers Render Deploy Hook via curl
```

### Setup Steps

1. **Get Render Deploy Hook URL:**
   - Go to your Render service dashboard → **Settings** → **Deploy Hook**
   - Copy the URL (format: `https://api.render.com/deploy/srv-xxx?key=yyy`)

2. **Add GitHub Secret:**
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Create a new secret named `RENDER_DEPLOY_HOOK_URL` and paste the URL

3. **How it works:**
   - Every push or PR to `main` runs `backend-tests` and `frontend-build` in parallel
   - On **push to main only**: if both test jobs pass, the `deploy` job fires the Render webhook
   - Render receives the webhook and triggers a new build + deploy automatically
   - If the secret is not set, the deploy step is skipped gracefully (no failure)

### Admin Workspace Flag

The `ENABLE_ADMIN_WORKSPACE` environment variable is set to `true` in the CI test environment so that admin-dependent tests execute normally. On the deployed Render instance, it defaults to `false` (via `render.yaml`), disabling heavy admin operations to prevent OOM crashes on resource-constrained plans.
