import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { AgentType } from '@prisma/client';

export interface SandboxContext {
  organizationId: string;
  allowedOperations: string[];
  maxExecutionTimeMs: number;
  readOnly: boolean;
  requiresApprovalForActions: string[];
}

export interface SandboxedExecutionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  executionTimeMs: number;
  sandboxed: boolean;
  requiresHumanApproval?: boolean;
  approvalAction?: string;
}

@Injectable()
export class AgentSandbox {
  private readonly logger = new Logger(AgentSandbox.name);

  /**
   * Defines default sandbox permission policies per agent type
   */
  getPolicyForAgent(agentType: AgentType): SandboxContext {
    const baseActions = ['ANALYZE_FINANCES', 'READ_TRANSACTIONS', 'READ_BUDGETS', 'READ_INVOICES', 'READ_FORECASTS'];

    switch (agentType) {
      case AgentType.EXPENSE_MANAGEMENT:
        return {
          organizationId: '',
          allowedOperations: [...baseActions, 'FLAG_ANOMALY', 'RECOMMEND_COST_CUT'],
          maxExecutionTimeMs: 8000,
          readOnly: false,
          requiresApprovalForActions: ['CANCEL_VENDOR_CONTRACT', 'DISPUTE_CHARGE'],
        };

      case AgentType.BUDGET_PLANNING:
        return {
          organizationId: '',
          allowedOperations: [...baseActions, 'CALCULATE_VARIANCE', 'PROPOSE_REALLOCATION'],
          maxExecutionTimeMs: 8000,
          readOnly: false,
          requiresApprovalForActions: ['REALLOCATE_BUDGET', 'INCREASE_DEPARTMENT_CAP'],
        };

      case AgentType.CASH_FLOW_MANAGEMENT:
        return {
          organizationId: '',
          allowedOperations: [...baseActions, 'COMPUTE_RUNWAY', 'PROJECT_CASH_FLOW'],
          maxExecutionTimeMs: 8000,
          readOnly: false,
          requiresApprovalForActions: ['TRIGGER_INVOICE_FACTORING', 'DELAY_VENDOR_PAYMENT'],
        };

      case AgentType.FINANCIAL_REPORTING:
        return {
          organizationId: '',
          allowedOperations: [...baseActions, 'GENERATE_REPORT', 'VERIFY_BALANCE_SHEET'],
          maxExecutionTimeMs: 10000,
          readOnly: false,
          requiresApprovalForActions: ['PUBLISH_EXTERNAL_REPORT'],
        };

      case AgentType.FINANCIAL_ANALYST:
      case AgentType.AI_FINANCE_ASSISTANT:
      case AgentType.ORCHESTRATOR:
      default:
        return {
          organizationId: '',
          allowedOperations: [...baseActions, 'SYNTHESIZE_INSIGHTS', 'DELEGATE_TASK'],
          maxExecutionTimeMs: 15000,
          readOnly: true,
          requiresApprovalForActions: ['EXECUTE_WIRE_TRANSFER', 'MODIFY_CHART_OF_ACCOUNTS'],
        };
    }
  }

  /**
   * Executes an agent task within an isolated, monitored boundary
   */
  async execute<T>(
    agentType: AgentType,
    actionName: string,
    operation: () => Promise<T>,
  ): Promise<SandboxedExecutionResult<T>> {
    const policy = this.getPolicyForAgent(agentType);
    const start = Date.now();

    // 1. Permission Check
    if (!policy.allowedOperations.includes(actionName)) {
      this.logger.warn(`Sandbox violation: Agent ${agentType} attempted unauthorized action "${actionName}"`);
      throw new ForbiddenException(`Agent ${agentType} is not authorized to execute operation: ${actionName}`);
    }

    // 2. Sensitive Action Check (Requires Human Authorization)
    if (policy.requiresApprovalForActions.includes(actionName)) {
      this.logger.log(`Operation "${actionName}" by ${agentType} quarantined pending human authorization.`);
      return {
        success: true,
        executionTimeMs: Date.now() - start,
        sandboxed: true,
        requiresHumanApproval: true,
        approvalAction: actionName,
      };
    }

    // 3. Execution with Timeout Guard
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Sandbox execution timeout (${policy.maxExecutionTimeMs}ms exceeded)`)), policy.maxExecutionTimeMs),
      );

      const result = await Promise.race([operation(), timeoutPromise]);
      const executionTimeMs = Date.now() - start;

      return {
        success: true,
        data: result,
        executionTimeMs,
        sandboxed: true,
      };
    } catch (err: unknown) {
      const executionTimeMs = Date.now() - start;
      const errorMsg = err instanceof Error ? err.message : 'Unknown sandboxed execution error';
      this.logger.error(`Sandbox execution failed for ${agentType}: ${errorMsg}`);

      return {
        success: false,
        error: errorMsg,
        executionTimeMs,
        sandboxed: true,
      };
    }
  }
}
