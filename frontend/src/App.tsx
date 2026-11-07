import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, Bot } from 'lucide-react';
import { ApiClient } from './services/api';
import type { HealthCheckResponse, ApiError } from './types/health';
import type {
  FinancialOverview,
  Transaction,
  Budget,
  Invoice,
  FinancialAnomaly,
  CashFlowForecast,
  AgentStatus,
  AgentTask,
  FinancialReport,
} from './types/finance';
import { Navbar, type ActiveTab } from './components/Navbar';
import { FinancialOverviewCards } from './components/FinancialOverviewCards';
import { RevenueExpenseAnalytics } from './components/RevenueExpenseAnalytics';
import { CashFlowForecastSection } from './components/CashFlowForecastSection';
import { BudgetTrackerSection } from './components/BudgetTrackerSection';
import { TransactionsSection } from './components/TransactionsSection';
import { InvoicesSection } from './components/InvoicesSection';
import { MultiAgentControlCenter } from './components/MultiAgentControlCenter';
import { HumanApprovalQueue } from './components/HumanApprovalQueue';
import { FinancialReportsSection } from './components/FinancialReportsSection';
import { AssistantChatDrawer } from './components/AssistantChatDrawer';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Data States
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [anomalies, setAnomalies] = useState<FinancialAnomaly[]>([]);
  const [forecasts, setForecasts] = useState<CashFlowForecast[]>([]);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);

  // Loading & Error States
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState<boolean>(false);
  const [isCreatingTx, setIsCreatingTx] = useState<boolean>(false);
  const [isRunningAgent, setIsRunningAgent] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAllData = useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);

    try {
      const [
        healthData,
        overviewData,
        txData,
        budgetData,
        invoiceData,
        anomalyData,
        forecastData,
        reportData,
        agentData,
        taskData,
      ] = await Promise.all([
        ApiClient.getHealth(),
        ApiClient.getFinancialOverview(),
        ApiClient.getTransactions({ limit: 40 }),
        ApiClient.getBudgets(),
        ApiClient.getInvoices(),
        ApiClient.getAnomalies(),
        ApiClient.getCashFlowForecasts(),
        ApiClient.getFinancialReports(),
        ApiClient.getAgentStatuses(),
        ApiClient.getAgentTasks(15),
      ]);

      setHealth(healthData);
      setOverview(overviewData);
      setTransactions(txData);
      setBudgets(budgetData);
      setInvoices(invoiceData);
      setAnomalies(anomalyData);
      setForecasts(forecastData);
      setReports(reportData);
      setAgents(agentData);
      setTasks(taskData);

      setError(null);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchAllData().finally(() => {
      if (mounted) setIsLoading(false);
    });

    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchAllData]);

  // Action Handlers
  const handleSimulateAnomaly = async () => {
    setIsSimulating(true);
    try {
      await ApiClient.triggerSimulatedAnomaly();
      await fetchAllData(true);
    } catch (err: unknown) {
      alert(`Simulation error: ${err instanceof Error ? err.message : 'Failed'}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleAddTransaction = async (tx: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    counterparty: string;
    description: string;
  }) => {
    setIsCreatingTx(true);
    try {
      await ApiClient.createTransaction({
        ...tx,
        isSimulated: true,
      });
      await fetchAllData(true);
    } catch (err: unknown) {
      alert(`Failed to ingest transaction: ${err instanceof Error ? err.message : 'Error'}`);
    } finally {
      setIsCreatingTx(false);
    }
  };

  const handleApproveTask = async (taskId: string) => {
    setIsProcessingApproval(true);
    try {
      await ApiClient.approveTask(taskId, 'Sarah Sterling (CFO)');
      await fetchAllData(true);
    } catch (err: unknown) {
      alert(`Approval failed: ${err instanceof Error ? err.message : 'Error'}`);
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleRejectTask = async (taskId: string) => {
    setIsProcessingApproval(true);
    try {
      await ApiClient.rejectTask(taskId, 'Sarah Sterling (CFO)', 'Quarantined by CFO');
      await fetchAllData(true);
    } catch (err: unknown) {
      alert(`Rejection failed: ${err instanceof Error ? err.message : 'Error'}`);
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleResolveAnomaly = async (anomalyId: string) => {
    try {
      await ApiClient.updateAnomalyStatus(anomalyId, 'RESOLVED', 'Resolved after vendor verification');
      await fetchAllData(true);
    } catch (err: unknown) {
      alert(`Failed to resolve anomaly: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const handleRunAgent = async (agentType: string) => {
    setIsRunningAgent(true);
    try {
      await ApiClient.runAgentDirect(agentType);
      await fetchAllData(true);
    } catch (err: unknown) {
      alert(`Agent run failed: ${err instanceof Error ? err.message : 'Error'}`);
    } finally {
      setIsRunningAgent(false);
    }
  };

  const pendingApprovalsCount = tasks.filter((t) => t.status === 'REQUIRES_APPROVAL').length;
  const activeAnomaliesCount = anomalies.filter((a) => a.status === 'DETECTED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendOnline={health !== null && error === null}
        pendingApprovalsCount={pendingApprovalsCount}
        activeAnomaliesCount={activeAnomaliesCount}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification Banner if Backend Offline */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-300 text-xs">
                  Backend API Communication Offline ({error.statusCode ? `HTTP ${error.statusCode}` : 'Disconnected'})
                </h3>
                <p className="text-[11px] text-rose-200/80 mt-0.5">{error.message}</p>
              </div>
            </div>
            <button
              onClick={() => fetchAllData(true)}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer flex-shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Global Controls / Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeTab === 'overview' && 'Executive Financial Overview'}
              {activeTab === 'agents' && 'Multi-Agent Autonomous Command Center'}
              {activeTab === 'cashflow' && 'Cash Flow Trajectory & Runway Health'}
              {activeTab === 'budgets' && 'Departmental Budget Pacing & Utilization'}
              {activeTab === 'invoices' && 'Accounts Receivable & Accounts Payable Ledger'}
              {activeTab === 'approvals' && 'Human-in-the-Loop Governance & Approvals'}
              {activeTab === 'reports' && 'Audited Financial Statements & GAAP Reports'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Apex Global Technologies Inc. • Multi-tenant Autonomous Finance Department
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchAllData(true)}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700/80 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Assistant</span>
            </button>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <FinancialOverviewCards
              metrics={overview?.metrics || null}
              currency={overview?.organization.currency}
              onSelectTab={setActiveTab}
            />
            <RevenueExpenseAnalytics
              metrics={overview?.metrics || null}
              onSimulateAnomaly={handleSimulateAnomaly}
              isSimulating={isSimulating}
            />
            <TransactionsSection
              transactions={transactions}
              currency={overview?.organization.currency}
              onAddTransaction={handleAddTransaction}
              isCreating={isCreatingTx}
            />
          </div>
        )}

        {activeTab === 'agents' && (
          <MultiAgentControlCenter
            agents={agents}
            tasks={tasks}
            onRunAgent={handleRunAgent}
            onRefreshTasks={() => fetchAllData(true)}
            isRunningAgent={isRunningAgent}
          />
        )}

        {activeTab === 'cashflow' && (
          <CashFlowForecastSection
            forecasts={forecasts}
            currency={overview?.organization.currency}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetTrackerSection
            budgets={budgets}
            currency={overview?.organization.currency}
            onNavigateApprovals={() => setActiveTab('approvals')}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesSection
            invoices={invoices}
            currency={overview?.organization.currency}
          />
        )}

        {activeTab === 'approvals' && (
          <HumanApprovalQueue
            pendingTasks={tasks}
            anomalies={anomalies}
            onApproveTask={handleApproveTask}
            onRejectTask={handleRejectTask}
            onResolveAnomaly={handleResolveAnomaly}
            isProcessing={isProcessingApproval}
          />
        )}

        {activeTab === 'reports' && (
          <FinancialReportsSection
            reports={reports}
            metrics={overview?.metrics || null}
            currency={overview?.organization.currency}
          />
        )}
      </main>

      {/* Footer Meta */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-4 sm:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Autonomous Business Finance System • Week 7 Engineering Framework</span>
        </div>
        <div className="font-mono text-[11px]">
          Last Telemetry Sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Initializing...'}
        </div>
      </footer>

      {/* AI Finance Assistant Drawer */}
      <AssistantChatDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSendMessage={(prompt) => ApiClient.sendChatMessage(prompt)}
        onApproveTask={handleApproveTask}
      />
    </div>
  );
}

export default App;
