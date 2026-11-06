# Development Environment Setup Guide

## Autonomous Business Finance Platform (Phase 1)

This guide walks you through setting up and running the local development environment for the Autonomous Business Finance Platform.

---

### 1. Prerequisites
Ensure the following tools are installed on your machine:
- **Node.js**: v20+ LTS or v24+
- **npm**: v10+
- **Git**: v2.40+
- **Docker Desktop** (optional, recommended for PostgreSQL)

---

### 2. Environment Variables Configuration

The project follows a strict zero-hardcoded-credentials policy. Environment configuration is read via environment files.

#### Backend Configuration
Copy `.env.example` to `.env` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Default parameters in `backend/.env`:
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/autonomous_finance_dev?schema=public
```

#### Frontend Configuration
Copy `.env.example` to `.env` in `frontend/`:
```bash
cp frontend/.env.example frontend/.env
```
Default parameters in `frontend/.env`:
```env
VITE_BACKEND_PROXY_URL=http://localhost:3001
VITE_API_BASE_URL=/api
```

---

### 3. Database Provisioning (PostgreSQL)

You can run PostgreSQL locally using Docker or your own PostgreSQL instance.

#### Option A: Docker Compose (Recommended)
From the repository root:
```bash
docker compose up -d
```
This boots a PostgreSQL 16 container with database `autonomous_finance_dev` on port `5432`.

#### Option B: Standalone PostgreSQL
Create a database named `autonomous_finance_dev` and update `DATABASE_URL` in `backend/.env` with your credentials.

---

### 4. Prisma Schema Generation & Migrations

Once your PostgreSQL database is reachable:
```bash
# In backend/
cd backend

# Generate Prisma Client
npx prisma generate

# Apply initial schema migration
npx prisma migrate dev --name init_foundational_models
```

---

### 5. Running the Applications

#### Running Backend
```bash
cd backend
npm run start:dev
```
The backend initializes at: `http://localhost:3001`
Health check diagnostics available at: `http://localhost:3001/api/health`

#### Running Frontend
In a separate terminal:
```bash
cd frontend
npm run dev
```
The frontend initializes at: `http://localhost:5173`

Open your browser to `http://localhost:5173` to view the live dashboard and health diagnostics.

---

### 6. Linting, Formatting & Testing

#### Frontend
```bash
cd frontend
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run build        # TypeScript check & production Vite build
```

#### Backend
```bash
cd backend
npm run lint         # Run Oxlint / TypeScript linter
npm run format       # Format code with Prettier
npm test             # Run Vitest unit tests
npm run build        # Compile NestJS TypeScript application
```
