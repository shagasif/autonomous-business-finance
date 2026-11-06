# System Architecture Specification

## Autonomous Business Finance Platform (Phase 1 Baseline)

### 1. Architectural Philosophy
The **Autonomous Business Finance Platform** is engineered as an industrial-grade, browser-based financial operations system. It provides high resilience, strict security, verifiable audit trails, and modular scalability.

Phase 1 establishes the foundational infrastructure, decoupled dual-tier architecture, type-safe data access layer, environment configuration isolation, and diagnostic health infrastructure.

```
                         +-----------------------------+
                         |      Web Browser Client     |
                         |   (React 19 + TypeScript)   |
                         +--------------+--------------+
                                        |
                          Vite Proxy / REST API (JSON)
                          HTTP GET /api/health
                                        |
                         +--------------v--------------+
                         |     NestJS REST API Core    |
                         |  (Modular Architecture)     |
                         +--------------+--------------+
                                        |
                            Prisma ORM (PostgreSQL)
                                        |
                         +--------------v--------------+
                         |      PostgreSQL Database    |
                         |  (Organizations, Users, Logs)
                         +-----------------------------+
```

---

### 2. Tier Breakdown

#### Frontend Application (`frontend/`)
- **Framework**: React 19 with TypeScript in strict mode (`verbatimModuleSyntax`).
- **Build Tooling**: Vite 8 with HMR and multi-stage production bundling.
- **Styling**: Tailwind CSS 3.4 with custom enterprise dark-slate palette and responsive layout.
- **API Client Layer**: AbortController-enabled fetch client with timeout enforcement and structured error mapping.
- **State & Lifecycle**: Resilient health polling, graceful degradation handling, raw telemetry viewer.

#### Backend Application (`backend/`)
- **Framework**: NestJS 12 running on Node.js (v24 LTS compatible).
- **Architecture**: Modular DDD-ready layout (`modules/`, `prisma/`, `config/`, `common/`).
- **REST Endpoints**: Global `/api` prefix with standard HTTP routing.
- **Data Access**: Prisma ORM 6.19 with PostgreSQL provider.
- **Cross-Origin Security**: Configurable CORS supporting decoupled frontend deployments.
- **Resilience**: Non-fatal database boot hook allowing diagnostic API availability even when PostgreSQL is initializing.
- **Telemetry & Health**: Comprehensive diagnostic payload (`GET /api/health`) reporting service status, database connectivity, heap memory metrics, node version, and uptime.

---

### 3. Scalable Directory Structure

```
autonomous-business-finance/
├── .gitignore                      # Monorepo/Root Git exclusion rules
├── README.md                       # Master setup & developer documentation
├── docker-compose.yml              # Local PostgreSQL container service
├── package.json                    # Root orchestration scripts
│
├── docs/                           # Architecture and setup documentation
│   ├── architecture.md             # System design & component specification
│   └── setup-guide.md              # Step-by-step developer onboarding
│
├── frontend/                       # Client web application
│   ├── .env.example                # Frontend environment template
│   ├── .gitignore                  # Frontend Git exclusions
│   ├── .prettierrc                 # Code formatting configuration
│   ├── eslint.config.js            # Flat ESLint configuration (TypeScript + React)
│   ├── index.html                  # HTML5 entry document
│   ├── package.json                # Frontend package dependencies & scripts
│   ├── postcss.config.js           # PostCSS Tailwind processor
│   ├── tailwind.config.js          # Tailwind theme & utility configuration
│   ├── tsconfig.json               # Root TypeScript configuration
│   ├── tsconfig.app.json           # React application TypeScript rules
│   ├── tsconfig.node.json          # Node/Vite build TypeScript rules
│   ├── vite.config.ts              # Vite server & API proxy configuration
│   └── src/
│       ├── App.tsx                 # Core UI component & diagnostic dashboard
│       ├── main.tsx                # React DOM entry point
│       ├── index.css               # Global styles & Tailwind directives
│       ├── components/             # Reusable UI components
│       │   ├── Navbar.tsx          # Top navigation bar
│       │   ├── HealthStatusCard.tsx# Live API & Database health metrics card
│       │   └── ArchitectureOverview.tsx # Tech stack and phase roadmap
│       ├── services/               # API clients and HTTP communication
│       │   └── api.ts              # Resilient fetch API client
│       └── types/                  # Shared TypeScript interfaces
│           └── health.ts           # Health check and error response definitions
│
└── backend/                        # Server application
    ├── .env.example                # Backend environment template
    ├── .gitignore                  # Backend Git exclusions
    ├── .prettierrc                 # Code formatting rules
    ├── nest-cli.json               # NestJS CLI configuration
    ├── package.json                # Backend dependencies and scripts
    ├── tsconfig.json               # NodeNext TypeScript configuration
    ├── tsconfig.build.json         # Production build exclusion rules
    ├── vitest.config.ts            # Unit test configuration
    ├── vitest.config.e2e.ts        # End-to-end test configuration
    ├── prisma/
    │   └── schema.prisma           # Prisma PostgreSQL schema definition
    └── src/
        ├── main.ts                 # Server bootstrap & global middleware
        ├── app.module.ts           # Root dependency injection module
        ├── app.controller.ts       # Base controller
        ├── app.service.ts          # Base service
        ├── config/
        │   └── configuration.ts    # Type-safe environment configuration loader
        ├── prisma/
        │   ├── prisma.service.ts   # PrismaClient lifecycle & health probe
        │   └── prisma.module.ts    # Global database module
        ├── common/
        │   ├── filters/
        │   │   └── all-exceptions.filter.ts # Global HTTP exception handling
        │   └── interceptors/
        │       └── logging.interceptor.ts   # Request latency & access logging
        └── modules/
            └── health/
                ├── health.controller.ts     # Health endpoint controller (GET /api/health)
                ├── health.service.ts        # Diagnostic metrics aggregator
                ├── health.module.ts         # Encapsulated health module
                ├── health.controller.spec.ts# Unit tests for health endpoint
                └── dto/
                    └── health-response.dto.ts # Diagnostic payload contract
```

---

### 4. Database Schema Baseline (`backend/prisma/schema.prisma`)
The foundational data model establishes multi-tenant isolation and security auditing:
- **Organization**: Scopes all business operations, currency preferences, and entity data.
- **User**: Multi-tenant user identity with role-based access scoping.
- **AuditLog**: Tamper-evident operational logging for financial compliance.

---

### 5. Phase 2 Scope Demarcation
Financial operations (general ledger, chart of accounts, multi-currency journal entries, invoices, automated bank reconciliation, and autonomous AI agents) are strictly deferred to Phase 2.
