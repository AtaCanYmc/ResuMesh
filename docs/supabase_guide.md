# Supabase Development & Migration Guide

This guide provides a comprehensive overview of how to manage your database migrations, local development environment, and deployment workflows using the Supabase CLI in the ResuMesh project.

---

## 1. Prerequisites

Before using the Supabase CLI, ensure you have the following installed on your machine:
* **Docker Desktop**: The Supabase local development stack runs entirely on Docker.
* **Supabase CLI**: Install it via Homebrew (macOS) or your preferred package manager.
  ```bash
  brew install supabase/tap/supabase
  ```

---

## 2. Local Development Workflow

### Starting Supabase
To spin up the local PostgreSQL database, auth server, storage buckets, and Studio dashboard:
```bash
supabase start
```
* Once started, the local Studio dashboard is available at: `http://localhost:54323`
* The local Postgres database runs on port `54322`.

### Stopping Supabase
To stop the local containers without losing database data:
```bash
supabase stop
```
To stop containers and reset the local database completely (destroys local data):
```bash
supabase stop --no-backup
```

---

## 3. Database Migrations

Supabase uses a migration-based workflow where database schemas are version-controlled using SQL files inside the `supabase/migrations/` directory.

### Creating a New Migration
To create a new empty migration file:
```bash
supabase migration new <migration_name>
```
This generates a timestamped SQL file under `supabase/migrations/YYYYMMDDHHMMSS_<migration_name>.sql`. You can populate it with your DDL statements (e.g. `CREATE TABLE`, `ALTER TABLE`).

### Applying Migrations Locally
To apply any outstanding migrations in the `supabase/migrations/` folder to your local database container:
```bash
supabase migration up
```

---

## 4. Syncing with Remote Supabase Instance

To sync and push changes to your live staging or production Supabase instance, you must link your local repository to the project.

### Linking Your Project
1. Get your **Project Reference ID** from your Supabase Dashboard project settings.
2. Link your CLI:
   ```bash
   supabase link --project-ref <your-project-reference-id>
   ```
3. Enter your database password when prompted.

### Pulling Schema from Remote (`db pull`)
If you made manual schema changes via the Supabase Dashboard UI on the web and want to download them into a local migration file:
```bash
supabase db pull
```
* **Shadow Database**: During `db pull`, Supabase spins up a temporary container called the *shadow database* to compare your local migrations history with the remote state and calculate the differences.

### Pushing Schema to Remote (`db push`)
To push all pending local migrations to your live remote database:
```bash
supabase db push
```

---

## 5. Troubleshooting & Common Issues

### Connection Refused (Port 54322)
**Error**: `failed to connect to postgres: dial tcp 127.0.0.1:54322: connect: connection refused`
* **Cause**: Your local Supabase stack is not running.
* **Fix**: Ensure Docker Desktop is active and run `supabase start` before performing database operations.

### Shadow Database Creation Failure
**Error**: `failed to inspect container health: Error response from daemon: No such container...`
* **Cause**: The local Docker daemon has stuck containers, invalid volumes, or is out of system resources.
* **Fix**: Clean up your Docker system cache and restart Docker Desktop:
  ```bash
  # Prune inactive Docker systems
  docker system prune -f
  ```
  Then restart your Docker Desktop application and retry the command.

### Manual SQL Reset
If your local migrations get out of sync, you can reset the entire local database to match the migration files:
```bash
supabase db reset
```
