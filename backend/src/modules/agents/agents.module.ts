import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module.js';
import { AgentsController } from './agents.controller.js';
import { OrchestratorService } from './orchestrator.service.js';
import { AgentSandbox } from './sandbox/agent-sandbox.js';
import { PreExecutionHook, PostExecutionHook, SecurityApprovalHook, AuditLoggingHook } from './hooks/agent-hooks.js';
import { FinancialAnalystAgent } from './services/financial-analyst.agent.js';
import { ExpenseManagementAgent } from './services/expense-management.agent.js';
import { CashFlowManagementAgent } from './services/cash-flow.agent.js';
import { BudgetPlanningAgent } from './services/budget-planning.agent.js';
import { FinancialReportingAgent } from './services/financial-reporting.agent.js';
import { FinanceAssistantAgent } from './services/finance-assistant.agent.js';

@Module({
  imports: [FinanceModule],
  controllers: [AgentsController],
  providers: [
    AgentSandbox,
    PreExecutionHook,
    PostExecutionHook,
    SecurityApprovalHook,
    AuditLoggingHook,
    FinancialAnalystAgent,
    ExpenseManagementAgent,
    CashFlowManagementAgent,
    BudgetPlanningAgent,
    FinancialReportingAgent,
    FinanceAssistantAgent,
    OrchestratorService,
  ],
  exports: [OrchestratorService, FinanceAssistantAgent],
})
export class AgentsModule {}
