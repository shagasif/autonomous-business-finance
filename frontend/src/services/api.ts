import type { HealthCheckResponse, ApiError } from '../types/health';
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiClient {
  private static readonly DEFAULT_TIMEOUT_MS = 12000;

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
        const errorText = await response.text();
        let parsedMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const jsonError = JSON.parse(errorText);
          parsedMessage = jsonError.message || parsedMessage;
        } catch {
          if (errorText) parsedMessage = errorText;
        }

        const err: ApiError = {
          statusCode: response.status,
          message: typeof parsedMessage === 'string' ? parsedMessage : JSON.stringify(parsedMessage),
          timestamp: new Date().toISOString(),
        };
        throw err;
      }

      const data: T = await response.json();
      return data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if ((err as Error)?.name === 'AbortError') {
        const timeoutError: ApiError = {
          statusCode: 408,
          message: `Request timed out after ${this.DEFAULT_TIMEOUT_MS / 1000}s.`,
          timestamp: new Date().toISOString(),
        };
        throw timeoutError;
      }

      if ((err as ApiError).message) {
        throw err;
      }

      const genericError: ApiError = {
        statusCode: 0,
        message: err instanceof Error ? err.message : 'Network connection failed.',
        timestamp: new Date().toISOString(),
      };
      throw genericError;
    }
  }

  // --- Diagnostics ---
  public static async getHealth(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health');
  }

  // --- Financial Core ---
  public static async getFinancialOverview(): Promise<FinancialOverview> {
    return this.request<FinancialOverview>('/finance/overview');
  }

  public static async getTransactions(params?: { category?: string; type?: string; hasAnomaly?: boolean; limit?: number }): Promise<Transaction[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.type) query.append('type', params.type);
    if (params?.hasAnomaly !== undefined) query.append('hasAnomaly', String(params.hasAnomaly));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<Transaction[]>(`/finance/transactions${qs}`);
  }

  public static async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>('/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async getBudgets(): Promise<Budget[]> {
    return this.request<Budget[]>('/finance/budgets');
  }

  public static async getInvoices(type?: 'RECEIVABLE' | 'PAYABLE'): Promise<Invoice[]> {
    const qs = type ? `?type=${type}` : '';
    return this.request<Invoice[]>(`/finance/invoices${qs}`);
  }

  public static async getAnomalies(status?: string): Promise<FinancialAnomaly[]> {
    const qs = status ? `?status=${status}` : '';
    return this.request<FinancialAnomaly[]>(`/finance/anomalies${qs}`);
  }

  public static async updateAnomalyStatus(id: string, status: string, resolutionNote?: string): Promise<FinancialAnomaly> {
    return this.request<FinancialAnomaly>(`/finance/anomalies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNote }),
    });
  }

  public static async getCashFlowForecasts(): Promise<CashFlowForecast[]> {
    return this.request<CashFlowForecast[]>('/finance/cash-flow/forecast');
  }

  public static async getFinancialReports(): Promise<FinancialReport[]> {
    return this.request<FinancialReport[]>('/finance/reports');
  }

  public static async triggerSimulatedAnomaly(): Promise<Transaction> {
    return this.request<Transaction>('/finance/simulate-anomaly', {
      method: 'POST',
    });
  }

  // --- Multi-Agent Operations ---
  public static async getAgentStatuses(): Promise<AgentStatus[]> {
    return this.request<AgentStatus[]>('/agents/status');
  }

  public static async getAgentTasks(limit = 15): Promise<AgentTask[]> {
    return this.request<AgentTask[]>(`/agents/tasks?limit=${limit}`);
  }

  public static async sendChatMessage(prompt: string): Promise<AssistantChatResponse> {
    return this.request<AssistantChatResponse>('/agents/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  public static async approveTask(taskId: string, approvedBy = 'Sarah Sterling (CFO)'): Promise<AgentTask> {
    return this.request<AgentTask>(`/agents/tasks/${taskId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy }),
    });
  }

  public static async rejectTask(taskId: string, rejectedBy = 'Sarah Sterling (CFO)', reason = 'Rejected by CFO review'): Promise<AgentTask> {
    return this.request<AgentTask>(`/agents/tasks/${taskId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy: rejectedBy, reason }),
    });
  }

  public static async runAgentDirect(agentType: string): Promise<unknown> {
    return this.request<unknown>(`/agents/run/${agentType}`, {
      method: 'POST',
    });
  }
}
