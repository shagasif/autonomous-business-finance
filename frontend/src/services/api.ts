import type { HealthCheckResponse } from '../types/health';
import type {
  FinancialOverview,
  Transaction,
  Budget,
  Invoice,
  FinancialAnomaly,
  CashFlowForecast,
  AgentStatus,
  AgentTask,
  AssistantChatResponse,
  FinancialReport,
} from '../types/finance';
import {
  mockHealth,
  initialOverview,
  initialTransactions,
  initialBudgets,
  initialInvoices,
  initialAnomalies,
  initialForecasts,
  initialReports,
  initialAgents,
  initialTasks,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiClient {
  private static readonly DEFAULT_TIMEOUT_MS = 3000;
  public static isLiveBackend = false;

  // In-memory mock store for offline/Vercel standalone mode
  private static localTransactions: Transaction[] = [...initialTransactions];
  private static localOverview: FinancialOverview = JSON.parse(JSON.stringify(initialOverview));
  private static localBudgets: Budget[] = [...initialBudgets];
  private static localInvoices: Invoice[] = [...initialInvoices];
  private static localAnomalies: FinancialAnomaly[] = [...initialAnomalies];
  private static localForecasts: CashFlowForecast[] = [...initialForecasts];
  private static localReports: FinancialReport[] = [...initialReports];
  private static localAgents: AgentStatus[] = [...initialAgents];
  private static localTasks: AgentTask[] = [...initialTasks];

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: T = await response.json();
      this.isLiveBackend = true;
      return data;
    } catch {
      clearTimeout(timeoutId);
      this.isLiveBackend = false;
      throw new Error('BACKEND_UNAVAILABLE');
    }
  }

  // --- Diagnostics ---
  public static async getHealth(): Promise<HealthCheckResponse> {
    try {
      const res = await this.request<HealthCheckResponse>('/health');
      return res;
    } catch {
      return {
        ...mockHealth,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // --- Financial Core ---
  public static async getFinancialOverview(): Promise<FinancialOverview> {
    try {
      return await this.request<FinancialOverview>('/finance/overview');
    } catch {
      return this.localOverview;
    }
  }

  public static async getTransactions(params?: {
    category?: string;
    type?: string;
    hasAnomaly?: boolean;
    limit?: number;
  }): Promise<Transaction[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.type) query.append('type', params.type);
      if (params?.hasAnomaly !== undefined) query.append('hasAnomaly', String(params.hasAnomaly));
      if (params?.limit) query.append('limit', String(params.limit));

      const qs = query.toString() ? `?${query.toString()}` : '';
      return await this.request<Transaction[]>(`/finance/transactions${qs}`);
    } catch {
      let filtered = [...this.localTransactions];
      if (params?.category && params.category !== 'ALL') {
        filtered = filtered.filter((t) => t.category === params.category);
      }
      if (params?.type) {
        filtered = filtered.filter((t) => t.type === params.type);
      }
      if (params?.hasAnomaly !== undefined) {
        filtered = filtered.filter((t) => t.hasAnomaly === params.hasAnomaly);
      }
      if (params?.limit) {
        filtered = filtered.slice(0, params.limit);
      }
      return filtered;
    }
  }

  public static async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    try {
      return await this.request<Transaction>('/finance/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newTx: Transaction = {
        id: `tx-loc-${Date.now()}`,
        amount: data.amount || 0,
        type: data.type || 'EXPENSE',
        category: data.category || 'General & Operational',
        counterparty: data.counterparty || 'External Vendor',
        description: data.description || 'Manual transaction entry',
        date: new Date().toISOString(),
        status: 'CLEARED',
        isSimulated: true,
        hasAnomaly: (data.amount || 0) > 15000,
      };

      this.localTransactions = [newTx, ...this.localTransactions];

      // Update overview metrics
      if (newTx.type === 'INCOME') {
        this.localOverview.metrics.totalRevenue += newTx.amount;
        this.localOverview.metrics.cashBalance += newTx.amount;
      } else {
        this.localOverview.metrics.totalExpenses += newTx.amount;
        this.localOverview.metrics.cashBalance -= newTx.amount;
      }
      this.localOverview.metrics.netIncome =
        this.localOverview.metrics.totalRevenue - this.localOverview.metrics.totalExpenses;
      this.localOverview.metrics.netMarginPercent = Number(
        ((this.localOverview.metrics.netIncome / this.localOverview.metrics.totalRevenue) * 100).toFixed(2)
      );

      return newTx;
    }
  }

  public static async getBudgets(): Promise<Budget[]> {
    try {
      return await this.request<Budget[]>('/finance/budgets');
    } catch {
      return this.localBudgets;
    }
  }

  public static async getInvoices(type?: 'RECEIVABLE' | 'PAYABLE'): Promise<Invoice[]> {
    try {
      const qs = type ? `?type=${type}` : '';
      return await this.request<Invoice[]>(`/finance/invoices${qs}`);
    } catch {
      if (type) {
        return this.localInvoices.filter((i) => i.type === type);
      }
      return this.localInvoices;
    }
  }

  public static async getAnomalies(status?: string): Promise<FinancialAnomaly[]> {
    try {
      const qs = status ? `?status=${status}` : '';
      return await this.request<FinancialAnomaly[]>(`/finance/anomalies${qs}`);
    } catch {
      if (status) {
        return this.localAnomalies.filter((a) => a.status === status);
      }
      return this.localAnomalies;
    }
  }

  public static async updateAnomalyStatus(
    id: string,
    status: string,
    resolutionNote?: string
  ): Promise<FinancialAnomaly> {
    try {
      return await this.request<FinancialAnomaly>(`/finance/anomalies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, resolutionNote }),
      });
    } catch {
      const index = this.localAnomalies.findIndex((a) => a.id === id);
      if (index !== -1) {
        this.localAnomalies[index] = {
          ...this.localAnomalies[index],
          status: status as FinancialAnomaly['status'],
        };
        this.localOverview.metrics.activeAnomaliesCount = Math.max(
          0,
          this.localAnomalies.filter((a) => a.status === 'DETECTED').length
        );
        return this.localAnomalies[index];
      }
      throw new Error('Anomaly not found');
    }
  }

  public static async getCashFlowForecasts(): Promise<CashFlowForecast[]> {
    try {
      return await this.request<CashFlowForecast[]>('/finance/cash-flow/forecast');
    } catch {
      return this.localForecasts;
    }
  }

  public static async getFinancialReports(): Promise<FinancialReport[]> {
    try {
      return await this.request<FinancialReport[]>('/finance/reports');
    } catch {
      return this.localReports;
    }
  }

  public static async triggerSimulatedAnomaly(): Promise<Transaction> {
    try {
      return await this.request<Transaction>('/finance/simulate-anomaly', {
        method: 'POST',
      });
    } catch {
      const simulatedTx: Transaction = {
        id: `tx-sim-${Date.now()}`,
        amount: 18400,
        type: 'EXPENSE',
        category: 'Cloud Infrastructure',
        counterparty: 'Amazon Web Services',
        description: 'Sudden unexpected $18,400 GPU compute spike detected on cluster #8',
        date: new Date().toISOString(),
        status: 'PENDING',
        isSimulated: true,
        hasAnomaly: true,
      };

      this.localTransactions = [simulatedTx, ...this.localTransactions];

      const newAnomaly: FinancialAnomaly = {
        id: `anom-${Date.now()}`,
        severity: 'HIGH',
        category: 'Cloud Compute Spend',
        title: 'Unexpected $18,400 Compute Spike on AWS',
        description: 'Sudden 340% divergence from historical trailing baseline detected by autonomous hooks.',
        expectedValue: 4200,
        actualValue: 18400,
        zScore: 3.42,
        status: 'DETECTED',
        detectedBy: 'Agent 2 (Expense Management Agent)',
        createdAt: new Date().toISOString(),
        transaction: simulatedTx,
      };

      this.localAnomalies = [newAnomaly, ...this.localAnomalies];
      this.localOverview.metrics.activeAnomaliesCount = this.localAnomalies.filter(
        (a) => a.status === 'DETECTED'
      ).length;

      return simulatedTx;
    }
  }

  // --- Multi-Agent Operations ---
  public static async getAgentStatuses(): Promise<AgentStatus[]> {
    try {
      return await this.request<AgentStatus[]>('/agents/status');
    } catch {
      return this.localAgents;
    }
  }

  public static async getAgentTasks(limit = 15): Promise<AgentTask[]> {
    try {
      return await this.request<AgentTask[]>(`/agents/tasks?limit=${limit}`);
    } catch {
      return this.localTasks.slice(0, limit);
    }
  }

  public static async sendChatMessage(prompt: string): Promise<AssistantChatResponse> {
    try {
      return await this.request<AssistantChatResponse>('/agents/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    } catch {
      const lower = prompt.toLowerCase();
      let answer =
        'I have coordinated across our autonomous finance agents. Our current cash reserves stand at $1,732,500 with an estimated runway of 21.7 months. All core ledgers remain mathematically balanced under double-entry invariants.';
      let delegated = ['Agent 1 (Financial Analyst)', 'Agent 3 (Cash Flow Forecaster)'];
      let actions = ['Monitor Q3 burn pacing', 'Inspect DSO collections on overdue accounts'];
      let requiresApproval = false;
      let approvalAction: string | undefined = undefined;
      let taskId: string | undefined = undefined;

      if (lower.includes('anomal') || lower.includes('fraud') || lower.includes('spike')) {
        answer =
          'Agent 2 (Expense Management) identified 2 active spending anomalies: an unbudgeted $18,400 compute spike on AWS and a $6,200 marketing overrun on Q4 SaaS Summit registration. Both have been quarantined.';
        delegated = ['Agent 2 (Expense Management Agent)'];
        actions = ['Review AWS GPU cluster reservation', 'Examine Marketing surplus rebalancing'];
      } else if (lower.includes('budget') || lower.includes('marketing') || lower.includes('overrun')) {
        answer =
          'Agent 4 (Budget Planning) reports Marketing exceeded its $65,000 cap by $6,200 (109.5% utilization). Operations holds an uncommitted surplus of $8,200. Proposing an autonomous budget rebalance.';
        delegated = ['Agent 4 (Budget Planning Agent)'];
        actions = ['Rebalance $8,200 from Operations to Marketing'];
        requiresApproval = true;
        approvalAction = 'REBALANCE_BUDGET_SURPLUS';
        taskId = 'task-sec-01';
      } else if (lower.includes('runway') || lower.includes('cash') || lower.includes('forecast')) {
        answer =
          'Agent 3 (Cash Flow Forecaster) projected 30-day net cash flow of +$53,000 with 94% confidence. Total runway extends 21.7 months. Primary liquidity drag is Stark Logistics overdue invoice ($34,000).';
        delegated = ['Agent 3 (Cash Flow Forecaster)'];
        actions = ['Trigger automated collections for invoice INV-2026-074'];
      } else if (lower.includes('report') || lower.includes('gaap') || lower.includes('audit')) {
        answer =
          'Agent 5 (Financial Reporting) generated the Q3 2026 GAAP Financial Package. Accounting invariant check verified: Assets = Liabilities + Equity (Variance: 0.00 USD).';
        delegated = ['Agent 5 (Financial Reporting Agent)'];
        actions = ['Export GAAP Package PDF', 'Archive audit trail hash'];
      }

      return {
        answer,
        intentIdentified: 'AUTONOMOUS_FINANCIAL_QUERY',
        delegatedAgents: delegated,
        reasoningSteps: [
          'Received natural language query from finance operator',
          `Parsed intent and dispatched context to: ${delegated.join(', ')}`,
          'Verified sandboxed invariant constraints and security hooks',
          'Formatted executive multi-agent synthesis',
        ],
        supportingData: {
          cashBalance: this.localOverview.metrics.cashBalance,
          runwayMonths: this.localOverview.metrics.runwayMonths,
        },
        actionItems: actions,
        requiresApproval,
        approvalAction,
        taskId,
      };
    }
  }

  public static async approveTask(
    taskId: string,
    approvedBy = 'Sarah Sterling (CFO)'
  ): Promise<AgentTask> {
    try {
      return await this.request<AgentTask>(`/agents/tasks/${taskId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approvedBy }),
      });
    } catch {
      const taskIndex = this.localTasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        this.localTasks[taskIndex] = {
          ...this.localTasks[taskIndex],
          status: 'COMPLETED',
          isApproved: true,
          approvedBy,
          requiresApproval: false,
        };
        return this.localTasks[taskIndex];
      }
      return {
        id: taskId,
        agentType: 'BUDGET_PLANNING',
        intent: 'REBALANCE_DEPARTMENT_BUDGET',
        userPrompt: 'Task authorized by CFO',
        status: 'COMPLETED',
        reasoningSteps: ['CFO authorization verified', 'Surplus rebalance executed'],
        requiresApproval: false,
        isApproved: true,
        approvedBy,
        sandboxed: true,
        hooksTriggered: ['SecurityApprovalHook'],
        executionTimeMs: 120,
        createdAt: new Date().toISOString(),
      };
    }
  }

  public static async rejectTask(
    taskId: string,
    rejectedBy = 'Sarah Sterling (CFO)',
    reason = 'Rejected by CFO review'
  ): Promise<AgentTask> {
    try {
      return await this.request<AgentTask>(`/agents/tasks/${taskId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ approvedBy: rejectedBy, reason }),
      });
    } catch {
      const taskIndex = this.localTasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        this.localTasks[taskIndex] = {
          ...this.localTasks[taskIndex],
          status: 'CANCELLED',
          isApproved: false,
          approvedBy: rejectedBy,
          requiresApproval: false,
        };
        return this.localTasks[taskIndex];
      }
      return {
        id: taskId,
        agentType: 'BUDGET_PLANNING',
        intent: 'REBALANCE_DEPARTMENT_BUDGET',
        userPrompt: 'Task quarantined by CFO',
        status: 'CANCELLED',
        reasoningSteps: ['CFO rejection verified', 'Operation quarantined'],
        requiresApproval: false,
        isApproved: false,
        approvedBy: rejectedBy,
        sandboxed: true,
        hooksTriggered: ['SecurityApprovalHook'],
        executionTimeMs: 95,
        createdAt: new Date().toISOString(),
      };
    }
  }

  public static async runAgentDirect(agentType: string): Promise<unknown> {
    try {
      return await this.request<unknown>(`/agents/run/${agentType}`, {
        method: 'POST',
      });
    } catch {
      const agent = this.localAgents.find((a) => a.agentType === agentType);
      if (agent) {
        agent.tasksCompleted += 1;
        agent.lastActive = new Date().toISOString();
      }

      const newTask: AgentTask = {
        id: `task-manual-${Date.now()}`,
        agentType,
        intent: 'DIRECT_OPERATOR_INVOCATION',
        userPrompt: `Operator triggered direct autonomous analysis cycle for ${agentType}.`,
        status: 'COMPLETED',
        reasoningSteps: [
          'Operator triggered execution cycle',
          'Sandbox verification passed',
          'Telemetry ingested and invariants checked',
        ],
        requiresApproval: false,
        isApproved: true,
        sandboxed: true,
        hooksTriggered: ['PreExecutionHook', 'PostExecutionHook'],
        executionTimeMs: Math.floor(Math.random() * 80) + 75,
        createdAt: new Date().toISOString(),
      };
      this.localTasks = [newTask, ...this.localTasks];

      return { success: true, agentType, taskId: newTask.id };
    }
  }
}
