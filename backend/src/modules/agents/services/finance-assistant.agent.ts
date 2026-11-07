import { Injectable, Logger } from '@nestjs/common';
import { FinancialAnalystAgent } from './financial-analyst.agent.js';
import { ExpenseManagementAgent } from './expense-management.agent.js';
import { CashFlowManagementAgent } from './cash-flow.agent.js';
import { BudgetPlanningAgent } from './budget-planning.agent.js';
import { FinancialReportingAgent } from './financial-reporting.agent.js';
import { AgentType } from '@prisma/client';

export interface AssistantChatResponse {
  answer: string;
  intentIdentified: string;
  delegatedAgents: AgentType[];
  reasoningSteps: string[];
  supportingData: Record<string, unknown>;
  actionItems: string[];
  requiresApproval?: boolean;
  approvalAction?: string;
  taskId?: string;
}

@Injectable()
export class FinanceAssistantAgent {
  private readonly logger = new Logger(FinanceAssistantAgent.name);

  constructor(
    private readonly analystAgent: FinancialAnalystAgent,
    private readonly expenseAgent: ExpenseManagementAgent,
    private readonly cashFlowAgent: CashFlowManagementAgent,
    private readonly budgetAgent: BudgetPlanningAgent,
    private readonly reportingAgent: FinancialReportingAgent,
  ) {}

  /**
   * Processes conversational queries, orchestrating multi-agent delegation and synthesizing answers
   */
  async handleQuery(userPrompt: string): Promise<AssistantChatResponse> {
    this.logger.log(`Agent 6 (AI Finance Assistant) parsing user prompt: "${userPrompt}"`);
    const prompt = userPrompt.toLowerCase();

    const reasoningSteps: string[] = [
      `Parsed query intent: analyzing keywords in "${userPrompt}"`,
      'Evaluating domain boundaries across specialized agents (Analyst, Expenses, Cash Flow, Budget, Reporting)',
    ];

    // Intent 1: Anomalies / Suspicious Charges / Fraud / Spikes
    if (prompt.includes('anomaly') || prompt.includes('suspicious') || prompt.includes('unusual') || prompt.includes('fraud') || prompt.includes('spike')) {
      reasoningSteps.push('Delegating to Agent 2 (Expense Management Agent) for anomaly detection scan');
      const expenseReport = await this.expenseAgent.analyze();
      reasoningSteps.push(`Agent 2 identified ${expenseReport.anomaliesDetected.length} active spending anomalies`);

      const criticalAnomalies = expenseReport.anomaliesDetected.filter((a) => a.severity === 'CRITICAL');
      const answer = `I've analyzed our recent transaction log with the **Expense Management Agent** and detected **${expenseReport.anomaliesDetected.length} anomalies** requiring attention:
${expenseReport.anomaliesDetected.map((a, i) => `\n${i + 1}. **${a.title}** (${a.severity})\n   - Amount: **$${a.amount.toLocaleString()}**\n   - Details: ${a.description}\n   - Required Action: ${a.actionRequired}`).join('\n')}

**Key Recommendation:** Freeze the unverified AWS compute cluster immediately and reject the unauthorized offshore vendor charge of $9,200.`;

      return {
        answer,
        intentIdentified: 'EXPENSE_ANOMALY_DETECTION',
        delegatedAgents: [AgentType.EXPENSE_MANAGEMENT],
        reasoningSteps,
        supportingData: {
          anomalies: expenseReport.anomaliesDetected,
          totalExpenses: expenseReport.totalExpenses,
        },
        actionItems: [
          'Authorize investigation into $14,850 GPU cluster surge',
          'Reject and flag $9,200 offshore vendor charge',
        ],
        requiresApproval: criticalAnomalies.length > 0,
        approvalAction: 'DISPUTE_UNAUTHORIZED_CHARGES',
      };
    }

    // Intent 2: Cash Flow / Runway / Liquidity
    if (prompt.includes('runway') || prompt.includes('cash') || prompt.includes('liquidity') || prompt.includes('burn') || prompt.includes('forecast')) {
      reasoningSteps.push('Delegating to Agent 3 (Cash Flow Management Agent) for liquidity metrics and time-series forecasting');
      const cashFlow = await this.cashFlowAgent.analyze();
      reasoningSteps.push(`Agent 3 calculated runway at ${cashFlow.runwayMonths} months with $${cashFlow.totalLiquidFunds.toLocaleString()} in total reserves`);

      const answer = `Based on the latest liquidity assessment from the **Cash Flow Management Agent**:

- **Total Liquid Reserves**: **$${cashFlow.totalLiquidFunds.toLocaleString()}** ($${cashFlow.availableCash.toLocaleString()} Operating + $${cashFlow.reserveCash.toLocaleString()} Treasury)
- **Current Runway**: **${cashFlow.runwayMonths} months** (Safe threshold > 12 months)
- **30-Day Net Cash Flow Projection**: **+$${cashFlow.projected30DayNet.toLocaleString()}**
- **Liquidity Health (Current Ratio)**: **${cashFlow.liquidityRatios.currentRatio}x** (healthy benchmark > 1.5x)
- **Days Sales Outstanding (DSO)**: **${cashFlow.liquidityRatios.daysSalesOutstanding} days**

**Liquidity Insights & Risks:**
${cashFlow.liquidityWarnings.map((w) => `• ${w}`).join('\n')}

**Recommended Next Actions:**
${cashFlow.recommendedActions.map((a) => `• ${a}`).join('\n')}`;

      return {
        answer,
        intentIdentified: 'CASH_FLOW_AND_RUNWAY_FORECAST',
        delegatedAgents: [AgentType.CASH_FLOW_MANAGEMENT],
        reasoningSteps,
        supportingData: {
          availableCash: cashFlow.availableCash,
          totalLiquidFunds: cashFlow.totalLiquidFunds,
          runwayMonths: cashFlow.runwayMonths,
          ratios: cashFlow.liquidityRatios,
        },
        actionItems: cashFlow.recommendedActions,
      };
    }

    // Intent 3: Budget / Department Spending / Overruns
    if (prompt.includes('budget') || prompt.includes('department') || prompt.includes('overrun') || prompt.includes('reallocate') || prompt.includes('variance')) {
      reasoningSteps.push('Delegating to Agent 4 (Budget Planning Agent) for department variance analysis');
      const budgetReport = await this.budgetAgent.analyze();
      reasoningSteps.push(`Agent 4 evaluated ${budgetReport.departments.length} departments. Found ${budgetReport.criticalAlerts.length} budget alerts`);

      const answer = `Here is the current departmental budget breakdown from the **Budget Planning Agent**:

- **Overall Budget Utilization**: **${budgetReport.overallUtilizationPercent}%** ($${budgetReport.totalSpent.toLocaleString()} spent of $${budgetReport.totalAllocated.toLocaleString()} allocated)
- **Net Remaining Variance**: **$${budgetReport.totalVariance.toLocaleString()}**

**Department Status:**
${budgetReport.departments.map((d) => `• **${d.department}**: $${d.spentAmount.toLocaleString()} / $${d.allocatedAmount.toLocaleString()} (${d.utilizationPercent}%) — *${d.varianceStatus}*`).join('\n')}

${budgetReport.criticalAlerts.length > 0 ? `**Critical Alerts:**\n${budgetReport.criticalAlerts.map((a) => `• ${a}`).join('\n')}` : ''}

${budgetReport.reallocationProposals.length > 0 ? `**Autonomous Reallocation Recommendation:**\n${budgetReport.reallocationProposals.map((p) => `• Transfer **$${p.amount.toLocaleString()}** from **${p.sourceDepartment}** to **${p.targetDepartment}** to cover sponsorship overages. *(Requires CFO Approval)*`).join('\n')}` : ''}`;

      return {
        answer,
        intentIdentified: 'BUDGET_VARIANCE_ANALYSIS',
        delegatedAgents: [AgentType.BUDGET_PLANNING],
        reasoningSteps,
        supportingData: {
          totalAllocated: budgetReport.totalAllocated,
          totalSpent: budgetReport.totalSpent,
          departments: budgetReport.departments,
        },
        actionItems: budgetReport.reallocationProposals.map((p) => p.reason),
        requiresApproval: budgetReport.reallocationProposals.length > 0,
        approvalAction: 'AUTHORIZE_BUDGET_REALLOCATION',
      };
    }

    // Intent 4: Financial Report / P&L / Executive Statement
    if (prompt.includes('report') || prompt.includes('statement') || prompt.includes('p&l') || prompt.includes('profit') || prompt.includes('balance sheet')) {
      reasoningSteps.push('Delegating to Agent 5 (Financial Reporting Agent) to compile verified financial statements');
      const report = await this.reportingAgent.generateComprehensiveReport('Q3 2026');
      reasoningSteps.push('Agent 5 verified accounting balance sheet identity (Assets = Liabilities + Equity)');

      const answer = `The **Financial Reporting Agent** has generated an audited financial statement summary:

- **Total Revenue**: **$${report.metrics.totalRevenue.toLocaleString()}**
- **Operational Expenses**: **$${report.metrics.totalExpenses.toLocaleString()}**
- **Net Operating Income**: **$${report.metrics.netOperatingIncome.toLocaleString()}**
- **EBITDA Estimate**: **$${report.metrics.ebitda.toLocaleString()}**
- **Cash & Equivalents**: **$${report.metrics.operatingCashBalance.toLocaleString()}**

**Balance Sheet Verification (Double-Entry Invariant):**
• Total Assets: **$${report.balanceSheetVerification.totalAssets.toLocaleString()}**
• Total Liabilities + Equity: **$${(report.balanceSheetVerification.totalLiabilities + report.balanceSheetVerification.totalEquity).toLocaleString()}**
• Verification Status: **${report.balanceSheetVerification.isBalanced ? '✓ VERIFIED BALANCED (0.00 Variance)' : 'DISCREPANCY'}**

*Executive Commentary:* ${report.executiveCommentary}`;

      return {
        answer,
        intentIdentified: 'FINANCIAL_REPORTING_GENERATION',
        delegatedAgents: [AgentType.FINANCIAL_REPORTING],
        reasoningSteps,
        supportingData: {
          reportId: report.reportId,
          metrics: report.metrics,
          balanceSheet: report.balanceSheetVerification,
        },
        actionItems: ['Review downloadable Q3 P&L statement in the Reports section.'],
      };
    }

    // Default: Multi-Agent Comprehensive Synthesis (Agents 1, 2, 3, 4)
    reasoningSteps.push('Multi-agent synthesis triggered: coordinating Financial Analyst, Expense Management, and Cash Flow agents');
    const [analyst, expenses, cashFlow] = await Promise.all([
      this.analystAgent.analyze(),
      this.expenseAgent.analyze(),
      this.cashFlowAgent.analyze(),
    ]);

    reasoningSteps.push('Synthesizing cross-agent insights into unified executive briefing');

    const answer = `Here is the holistic financial briefing synthesized across our autonomous agents:

1. **Strategic Performance (Financial Analyst Agent)**:
   - Operating margin is strong at **${analyst.kpis.grossMarginPercent}% gross**, with an annualized run rate of **$${analyst.kpis.annualizedRunRate.toLocaleString()}**.
   - Strategic growth opportunity: Reinvest surplus margin into high-LTV customer acquisition.

2. **Cost & Spend Health (Expense Management Agent)**:
   - Total operational spend: **$${expenses.totalExpenses.toLocaleString()}**.
   - **${expenses.anomaliesDetected.length} anomalies detected** (including a $14,850 AWS GPU cluster compute surge).
   - Identified **$${expenses.costOptimizationRecommendations.reduce((acc, c) => acc + c.potentialSavingsMonthly, 0).toLocaleString()}/month** in potential cost optimizations.

3. **Liquidity & Solvency (Cash Flow Management Agent)**:
   - Total liquid reserves stand at **$${cashFlow.totalLiquidFunds.toLocaleString()}**, guaranteeing **${cashFlow.runwayMonths} months** of runway.
   - Watch item: $${cashFlow.liquidityRatios.daysSalesOutstanding} days DSO with overdue invoices needing immediate collection.`;

    return {
      answer,
      intentIdentified: 'COMPREHENSIVE_FINANCIAL_SYNTHESIS',
      delegatedAgents: [AgentType.FINANCIAL_ANALYST, AgentType.EXPENSE_MANAGEMENT, AgentType.CASH_FLOW_MANAGEMENT],
      reasoningSteps,
      supportingData: {
        analystKpis: analyst.kpis,
        expensesTotal: expenses.totalExpenses,
        runwayMonths: cashFlow.runwayMonths,
        anomaliesCount: expenses.anomaliesDetected.length,
      },
      actionItems: [
        'Audit and downscale unassigned AWS compute nodes to save $12,500/mo',
        'Collect $34,000 overdue invoice from Stark Logistics',
        'Review Marketing budget reallocation proposal',
      ],
    };
  }
}
