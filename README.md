# Autonomous Business Finance Platform

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

An industrial-grade, browser-based autonomous business finance platform engineered for resilience, multi-tenant security, and automated financial operations.

> **Phase 1 Status**: Project Architecture & Development Environment Initialized. Core financial operations and autonomous agents are deferred to Phase 2.

---

## Architecture Overview

The system is decoupled into two primary applications with clean boundary separation:
1. **Frontend (`frontend/`)**: React 19, TypeScript, Vite, Tailwind CSS with responsive enterprise UI layout and resilient API communication.
2. **Backend (`backend/`)**: NestJS 12, TypeScript, modular REST API, global exception handling, request logging, and health diagnostics.
3. **Database Layer**: PostgreSQL managed via Prisma ORM 6 with schema models for organizations, multi-tenant users, and audit logs.

```
autonomous-business-finance/
├── .gitignore               # Root Git exclusion rules
├── README.md                # System documentation
├── docker-compose.yml       # PostgreSQL 16 container definition
├── package.json             # Root orchestration scripts
├── docs/                    # Architectural specs and guides
│   ├── architecture.md      # Detailed system architecture specification
│   └── setup-guide.md       # Onboarding and environment setup guide
├── frontend/                # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── .env.example         # Frontend environment template
│   ├── eslint.config.js     # ESLint configuration
│   ├── tailwind.config.js   # Tailwind theme settings
│   ├── vite.config.ts       # Vite proxy & server config
│   └── src/                 # Components, services, types
└── backend/                 # NestJS 12 + TypeScript + Prisma ORM
    ├── .env.example         # Backend environment template
    ├── prisma/schema.prisma # PostgreSQL relational schema
    └── src/                 # Modules, filters, config, health probe
```

---

## Quick Start

### 1. Prerequisites
- **Node.js** (v20+ or v24 LTS recommended)
- **npm** (v10+)
- **Git**
- **Docker** (optional, for local PostgreSQL container)

### 2. Configure Environment Variables

```bash
# Backend environment setup
cp backend/.env.example backend/.env

# Frontend environment setup
cp frontend/.env.example frontend/.env
```

### 3. (Optional) Start PostgreSQL Database with Docker

```bash
docker compose up -d
```
*Alternatively, configure your local PostgreSQL database credentials in `backend/.env`.*

### 4. Install Dependencies & Generate Prisma Client

```bash
# Backend dependencies and Prisma client
cd backend
npm install
npx prisma generate
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

---

## Running the Applications

### Option A: From Project Root (Unified Scripts)

```bash
# Start backend server (port 3001)
npm run dev:backend

# Start frontend development server (port 5173, in a separate terminal)
npm run dev:frontend
```

### Option B: Running Individually

#### Backend
```bash
cd backend
npm run start:dev
```
- Server URL: `http://localhost:3001`
- Health Check: `http://localhost:3001/api/health`

#### Frontend
```bash
cd frontend
npm run dev
```
- Client URL: `http://localhost:5173`

---

## Health Check API Contract

### `GET /api/health`

Returns live telemetry of the backend service, PostgreSQL connectivity, node runtime, memory usage, and uptime.

#### Sample Response:
```json
{
  "status": "ok",
  "service": "autonomous-business-finance-api",
  "version": "0.1.0",
  "timestamp": "2026-11-06T18:15:15.636Z",
  "uptimeSeconds": 42,
  "environment": "development",
  "database": {
    "status": "connected",
    "latencyMs": 4
  },
  "system": {
    "memoryUsageMb": {
      "rss": 93,
      "heapTotal": 38,
      "heapUsed": 32
    },
    "nodeVersion": "v24.20.0",
    "platform": "win32"
  }
}
```

*Note: If PostgreSQL is disconnected, the server gracefully returns `"status": "degraded"` with database error details without crashing.*

---

## Quality Assurance & Verification

### Frontend Quality Checks
```bash
cd frontend
npm run lint         # ESLint validation (0 errors, 0 warnings)
npm run format       # Prettier code formatting
npm run build        # Typecheck and production bundle build
```

### Backend Quality Checks
```bash
cd backend
npm run lint         # TypeScript linter (0 errors, 0 warnings)
npm run format       # Prettier formatting
npm test             # Vitest unit test suite (100% pass)
npm run build        # NestJS compiler build
```

---

## Security & Secrets Policy
- **Zero Hardcoded Credentials**: All ports, database URLs, and environment variables are strictly sourced via `.env`.
- **CORS Protection**: Access to backend REST endpoints is restricted to configured origins.
- **Git Protection**: Sensitive `.env` files and certificates are excluded across all `.gitignore` layers.

---

## Phase Roadmap

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Project Architecture, Dual-App Scaffolding, Prisma ORM, Diagnostics | **Completed** |
| **Phase 2** | Chart of Accounts, General Ledger, Multi-Currency, Invoicing, Banking | Next |
| **Phase 3** | Autonomous AI Agents, Reconciliation Engine, Cash Flow Anomaly Detection | Planned |
| **Phase 4** | Autonomous Financial Reporting, Compliance Audits, ERP Connectors | Planned |
