export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  netMarginPercent: number;
  cashBalance: number;
  monthlyBurnRate: number;
  runwayMonths: number;
  accountsReceivableTotal: number;
  accountsPayableTotal: number;
  overdueInvoicesCount: number;
  activeAnomaliesCount: number;
}

export interface FinancialOverview {
  metrics: FinancialMetrics;
  organization: {
    id: string;
    name: string;
    currency: string;
  };
  period: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  counterparty: string;
  description: string;
  date: string;
  status: 'PENDING' | 'CLEARED' | 'RECONCILED';
  isSimulated: boolean;
  hasAnomaly: boolean;
}

export interface Budget {
  id: string;
  department: string;
  category: string;
  period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercent: number;
  computedStatus: 'HEALTHY' | 'WARNING' | 'EXCEEDED';
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'RECEIVABLE' | 'PAYABLE';
  counterparty: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export interface FinancialAnomaly {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  title: string;
  description: string;
  expectedValue?: number;
  actualValue?: number;
  zScore?: number;
  status: 'DETECTED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_POSITIVE';
  detectedBy: string;
  createdAt: string;
  transaction?: Transaction;
}

export interface CashFlowForecast {
  id: string;
  periodDays: number;
  projectedInflow: number;
  projectedOutflow: number;
  netCashFlow: number;
  closingCashBalance: number;
  projectedRunwayMonths: number;
  confidenceScore: number;
  riskFactors: string[];
}

export interface AgentStatus {
  agentType: string;
  name: string;
  role: string;
  status: 'ONLINE' | 'BUSY' | 'STANDBY';
  tasksCompleted: number;
  averageLatencyMs: number;
  lastActive: string;
}

export interface AgentExecutionLog {
  id: string;
  stepName: string;
  status: string;
  message: string;
  executionTimeMs: number;
  createdAt: string;
}

export interface AgentTask {
  id: string;
  agentType: string;
  intent: string;
  userPrompt: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'REQUIRES_APPROVAL' | 'CANCELLED';
  reasoningSteps: string[];
  requiresApproval: boolean;
  isApproved?: boolean;
  approvedBy?: string;
  approvalAction?: string;
  sandboxed: boolean;
  hooksTriggered: string[];
  executionTimeMs: number;
  createdAt: string;
  logs?: AgentExecutionLog[];
}

export interface AssistantChatResponse {
  answer: string;
  intentIdentified: string;
  delegatedAgents: string[];
  reasoningSteps: string[];
  supportingData: Record<string, unknown>;
  actionItems: string[];
  requiresApproval?: boolean;
  approvalAction?: string;
  taskId?: string;
}

export interface FinancialReport {
  id: string;
  reportType: string;
  title: string;
  period: string;
  summaryMetrics: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    netMarginPercent: number;
    cashBalance: number;
  };
  isVerified: boolean;
  generatedBy: string;
  createdAt: string;
}
