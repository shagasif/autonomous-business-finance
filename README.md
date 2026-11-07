# Autonomous Business Finance Platform

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-6.19-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

An industrial-grade, browser-based autonomous business finance platform engineered to operate like an intelligent AI-powered corporate finance department.

---

## Capabilities & Architecture

### 1. Coordinated 6-Agent AI Architecture
- **Agent 1: Financial Analyst** — Analyzes ARR/MRR growth, EBITDA, gross margins, and strategic expansion opportunities.
- **Agent 2: Expense Management Agent** — Categorizes transactions, tracks spend velocity, detects anomalies (z-score > 2.5), and recommends cost optimizations.
- **Agent 3: Cash Flow Management Agent** — Projects 30/60/90-day cash flow trajectories, monitors runway, computes liquidity ratios (Current Ratio, Quick Ratio, DSO, DPO), and flags liquidity shortages.
- **Agent 4: Budget Planning Agent** — Monitors departmental budget utilization, computes variance analysis, and proposes autonomous reallocations.
- **Agent 5: Financial Reporting Agent** — Generates audited Profit & Loss statements and Balance Sheets, verifying accounting invariants (`Assets = Liabilities + Equity`).
- **Agent 6: AI Finance Assistant** — Central conversational interface that parses natural-language executive queries, delegates tasks across specialized agents, and synthesizes unified briefings with reasoning transparency.

### 2. Week 7 Engineering Framework
- **Sandboxing (`agent-sandbox.ts`)**: Isolates agent execution, enforces operation whitelists, applies execution timeouts, and scopes data access.
- **Pre-Execution Hook (`agent-hooks.ts`)**: Validates input bounds, multi-tenant boundaries, and non-negative amounts.
- **Post-Execution Hook**: Verifies mathematical invariants (e.g. Net Income = Revenue - Expenses, non-negative runway, balanced balance sheet).
- **Security Approval Hook**: Quarantines high-risk operations (budget reallocations, payments, contract cancellations) into a Human-in-the-Loop CFO approval queue.
- **Audit Logging Hook**: Maintains an immutable audit trail in PostgreSQL (`agent_execution_logs` & `audit_logs`).

### 3. Central Financial Ledger & PostgreSQL Schema
- **Accounts**: Operating Checking, Treasury Reserve, Accounts Receivable, Accounts Payable.
- **Transactions**: Full ledger with automated category classification, simulated data tags, and anomaly flags.
- **Budgets**: Departmental monthly caps, spent amounts, and computed variance status (`HEALTHY`, `WARNING`, `EXCEEDED`).
- **Invoices**: Inbound client receivables and outbound vendor payables with aging schedules and payment status.
- **Anomalies**: Outlier detection records with severity ratings and resolution triage states.

---

## Quick Start

### 1. Start PostgreSQL with Docker
From the project root:
```bash
docker compose up -d
```
*(PostgreSQL 16 boots on port 5432 with health check).*

### 2. Configure Environment Variables
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

### 3. Synchronize Schema & Seed Realistic Data
```bash
cd backend
npm install
npx prisma db push
npm run seed
cd ..
```

### 4. Run the Platform

#### Option A: Root Unified Scripts
```bash
# Terminal 1 - Backend (port 3001)
npm run dev:backend

# Terminal 2 - Frontend (port 5173)
npm run dev:frontend
```

#### Option B: Individual App Startup
```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

Open your browser to `http://localhost:5173`.

---

## Quality Assurance & Verification

From project root:
```bash
npm run lint         # Runs Oxlint (backend) and ESLint (frontend) -> 0 errors
npm run test         # Runs Vitest unit tests -> 4 suites, 7 tests passed (100%)
npm run build        # Compiles NestJS backend and Vite frontend -> 0 errors
```

---

## API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/health` | GET | Diagnostic health probe (database latency, runtime, memory heap) |
| `GET /api/finance/overview` | GET | Executive financial metrics (Revenue, Expenses, Margin, Runway, Cash) |
| `GET /api/finance/transactions` | GET | Transaction ledger with category & anomaly filters |
| `POST /api/finance/transactions` | POST | Ingest transaction with automated classification & anomaly check |
| `GET /api/finance/budgets` | GET | Departmental budget variance and utilization |
| `GET /api/finance/invoices` | GET | Accounts Receivable & Accounts Payable ledger |
| `GET /api/finance/anomalies` | GET | Active detected financial anomalies |
| `PATCH /api/finance/anomalies/:id`| PATCH | Acknowledge or resolve an anomaly |
| `GET /api/finance/cash-flow/forecast` | GET | 30, 60, 90-day time-series cash flow projections |
| `GET /api/finance/reports` | GET | Audited financial statements (P&L, Balance Sheet) |
| `POST /api/finance/simulate-anomaly` | POST | Trigger demo $18,400 compute spike anomaly |
| `POST /api/agents/chat` | POST | Conversational AI assistant multi-agent dispatch |
| `GET /api/agents/status` | GET | Real-time status, latency, and throughput of all 6 agents |
| `GET /api/agents/tasks` | GET | Multi-agent execution logs and reasoning history |
| `POST /api/agents/tasks/:id/approve` | POST | Human CFO authorization of quarantined action |
| `POST /api/agents/tasks/:id/reject` | POST | Human CFO rejection of quarantined action |
| `POST /api/agents/run/:agentType` | POST | Direct trigger of a specialized agent |
