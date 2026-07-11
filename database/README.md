# 🗄️ ResuMesh - Local Database Configuration

This folder contains the self-contained Docker Compose configuration to spin up a local PostgreSQL database instance for development and testing.

## 🚀 Running the Database

1. Navigate to this directory:
   ```bash
   cd database
   ```

2. Spin up the container in detached mode:
   ```bash
   docker compose up -d
   ```

The database will be available on your localhost port `5432`.

## ⚙️ Connection Settings

Use the following parameters to connect your backend application or client tools (e.g. pgAdmin, DBeaver):

- **Host:** `localhost`
- **Port:** `5432`
- **Username:** `postgres`
- **Password:** `postgres`
- **Database Name:** `resumesh`

Connection string for your backend `.env` file:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resumesh
```

## 🧹 Stopping and Cleaning up

To stop the database:
```bash
docker compose down
```

To stop and completely delete the database volume data:
```bash
docker compose down -v
```
