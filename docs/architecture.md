# System Architecture Specification

## Autonomous Business Finance Platform (Capstone Multi-Agent Architecture)

### 1. Executive Summary
The **Autonomous Business Finance Platform** is an enterprise-grade autonomous financial management system designed to emulate an intelligent corporate finance department. It features a coordinated 6-agent architecture, a centralized real-time financial ledger on PostgreSQL, automated anomaly detection and cash flow forecasting engines, and a Week 7 governance framework featuring sandboxed execution, pre/post execution verification hooks, and human-in-the-loop authorization gates.

```
                                  [ User / Executive / CFO ]
                                               │
                                  [ UI / Chat Assistant Drawer ]
                                               │
                     ┌─────────────────────────▼─────────────────────────┐
                     │            Central Multi-Agent                    │
                     │                Orchestrator                       │
                     │  (Intent Parser, Task Router, State Machine)      │
                     └─────────────────────────┬─────────────────────────┘
                                               │
      ┌──────────────────┬─────────────────────┼─────────────────────┬──────────────────┐
      │                  │                     │                     │                  │
┌─────▼────────┐  ┌──────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐    ┌──────▼──────┐
│   Agent 1    │  │   Agent 2   │       │   Agent 3   │       │   Agent 4   │    │   Agent 5   │
│  Financial   │  │   Expense   │       │  Cash Flow  │       │   Budget    │    │  Financial  │
│   Analyst    │  │  Management │       │  Management │       │  Planning   │    │  Reporting  │
└─────┬────────┘  └──────┬──────┘       └──────┬──────┘       └──────┬──────┘    └──────┬──────┘
      │                  │                     │                     │                  │
      └──────────────────┴─────────────────────┼─────────────────────┴──────────────────┘
                                               │
                     ┌─────────────────────────▼─────────────────────────┐
                     │          Week 7 Engineering Controls              │
                     │   ┌───────────────────────────────────────────┐   │
                     │   │ AgentSandbox (Isolated execution runtime) │   │
                     │   ├───────────────────────────────────────────┤   │
                     │   │ PreExecutionHook (Input validation)       │   │
                     │   ├───────────────────────────────────────────┤   │
                     │   │ PostExecutionHook (Accounting invariants) │   │
                     │   ├───────────────────────────────────────────┤   │
                     │   │ SecurityApprovalHook (Human CFO Gate)     │   │
                     │   ├───────────────────────────────────────────┤   │
                     │   │ AuditLoggingHook (PostgreSQL audit trail) │   │
                     │   └───────────────────────────────────────────┘   │
                     └─────────────────────────┬─────────────────────────┘
                                               │
                     ┌─────────────────────────▼─────────────────────────┐
                     │        PostgreSQL Central Financial Store         │
                     │  (Accounts, Transactions, Budgets, Invoices,      │
                     │   Anomalies, Forecasts, AgentTasks, AuditLogs)    │
                     └───────────────────────────────────────────────────┘
```

---

### 2. Multi-Agent AI Architecture (Agents 1 – 6)

#### Agent 1: Financial Analyst (`financial-analyst.agent.ts`)
- **Domain**: High-level financial performance, EBITDA, margins, growth velocity, and strategic expansion.
- **Operations**:
  - Computes gross margins, operating net margin, and burn multiple.
  - Identifies strategic revenue opportunities (e.g. enterprise prepayments).
  - Formulates actionable executive recommendations with supporting calculations.

#### Agent 2: Expense Management Agent (`expense-management.agent.ts`)
- **Domain**: Spend categorization, vendor concentration, anomaly detection, and cost optimization.
- **Operations**:
  - Classifies business expenses using heuristic and semantic pattern matching.
  - Monitors spending patterns across categories and vendors.
  - Identifies statistical anomalies (z-score > 2.5 and surge thresholds).
  - Recommends concrete cost-cutting opportunities (e.g. cloud compute resizing, unused SaaS seat deprovisioning).

#### Agent 3: Cash Flow Management Agent (`cash-flow.agent.ts`)
- **Domain**: Liquidity analysis, cash runway, working capital, and receivables/payables aging.
- **Operations**:
  - Tracks liquid reserves across operating checking and treasury reserve accounts.
  - Calculates standard liquidity ratios: Current Ratio, Quick Ratio (Acid-Test), Cash Ratio.
  - Computes Days Sales Outstanding (DSO) and Days Payable Outstanding (DPO).
  - Projects 30, 60, and 90-day time-series cash flow trajectories and flags potential liquidity pinches.

#### Agent 4: Budget Planning Agent (`budget-planning.agent.ts`)
- **Domain**: Departmental budget utilization, variance tracking, and reallocation recommendations.
- **Operations**:
  - Monitors department budgets (Engineering, Marketing, Sales, Operations, G&A).
  - Computes budget utilization percentages and remaining variance.
  - Flags pacing alerts: `HEALTHY`, `WARNING` (≥85%), and `EXCEEDED` (>100%).
  - Formulates autonomous budget reallocation proposals (e.g. shifting surplus from Operations to cover Marketing overruns).

#### Agent 5: Financial Reporting Agent (`financial-reporting.agent.ts`)
- **Domain**: Automated financial statements, executive scorecards, and accounting invariants.
- **Operations**:
  - Synthesizes audited Profit & Loss (P&L) statements and Balance Sheet summaries.
  - Verifies the fundamental accounting invariant: `Assets = Liabilities + Stockholders' Equity`.
  - Enforces zero-tolerance variance checks before marking reports as verified.

#### Agent 6: AI Finance Assistant (`finance-assistant.agent.ts`)
- **Domain**: Central natural language conversational interface.
- **Operations**:
  - Parses executive user queries into specialized domain intents.
  - Coordinates multi-agent delegation across Agents 1 through 5.
  - Synthesizes specialized agent findings into clear natural-language executive briefings.
  - Provides step-by-step reasoning transparency and highlights items requiring human CFO approval.

---

### 3. Week 7 Engineering Concepts

#### 3.1 Sandboxing (`agent-sandbox.ts`)
- Every agent action executes inside an isolated execution harness.
- Permissions are strictly delineated per agent type:
  - Unauthorized operations are intercepted and throw `ForbiddenException`.
  - Operations exceeding timeout quotas (8,000ms - 15,000ms) are halted automatically.
  - Untrusted database writes or arbitrary balance adjustments are prevented.

#### 3.2 Hooks System (`agent-hooks.ts`)
- **`PreExecutionHook`**:
  - Enforces organization multi-tenant boundary.
  - Validates input schemas and asserts that monetary values are non-negative valid numbers.
- **`PostExecutionHook`**:
  - Verifies financial mathematical invariants (e.g. Net Margin = Revenue - Expenses).
  - Confirms non-negative runway figures and validates balance sheet equilibrium.
- **`SecurityApprovalHook`**:
  - Quarantines sensitive operations (such as budget reallocations or vendor charge cancellations).
  - Marks task status as `REQUIRES_APPROVAL` and blocks execution until authorized by a human CFO.
- **`AuditLoggingHook`**:
  - Records an immutable audit log of every step, duration, and payload snapshot in PostgreSQL `agent_execution_logs`.

---

### 4. Central Financial Ledger & PostgreSQL Schema

The schema encompasses the full business financial lifecycle:
- **`Organization`**: Multi-tenant operational boundary.
- **`Account`**: Chart of accounts (Cash, Treasury, Accounts Receivable, Accounts Payable).
- **`Transaction`**: Income, expense, and transfer records with category classification and anomaly tags.
- **`Budget`**: Departmental monthly caps, spent amounts, and computed variance status.
- **`Invoice`**: Receivable and payable invoices with aging schedules and payment status.
- **`CashFlowForecast`**: 30, 60, and 90-day time-series projections with confidence scores and risk factors.
- **`FinancialAnomaly`**: Statistical outliers detected by Expense Management Agent.
- **`AgentTask` & `AgentExecutionLog`**: Multi-agent task execution records, reasoning steps, and approval states.
- **`FinancialReport`**: Audited P&L and Balance Sheet statements with verification flags.
