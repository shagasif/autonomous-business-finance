import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AgentType } from '@prisma/client';

export interface HookContext {
  taskId: string;
  agentType: AgentType;
  action: string;
  inputPayload?: unknown;
  outputPayload?: unknown;
  organizationId: string;
}

@Injectable()
export class PreExecutionHook {
  private readonly logger = new Logger(PreExecutionHook.name);

  async execute(context: HookContext): Promise<boolean> {
    this.logger.log(`[PreExecutionHook] Validating input for agent: ${context.agentType}, action: ${context.action}`);

    if (!context.organizationId) {
      throw new BadRequestException('Security violation: Organization boundary required.');
    }

    if (!context.taskId) {
      throw new BadRequestException('Audit violation: Task tracking ID missing.');
    }

    // Input schema validation
    if (context.inputPayload && typeof context.inputPayload === 'object') {
      const payload = context.inputPayload as Record<string, unknown>;
      if (payload.amount !== undefined && typeof payload.amount === 'number') {
        if (isNaN(payload.amount) || payload.amount < 0) {
          throw new BadRequestException('Validation failed: Financial amounts must be non-negative valid numbers.');
        }
      }
    }

    return true;
  }
}

@Injectable()
export class PostExecutionHook {
  private readonly logger = new Logger(PostExecutionHook.name);

  async execute(context: HookContext): Promise<boolean> {
    this.logger.log(`[PostExecutionHook] Verifying financial invariants for: ${context.agentType}`);

    if (!context.outputPayload) {
      return true;
    }

    const output = context.outputPayload as Record<string, unknown>;

    // Invariant 1: If runway is calculated, it cannot be negative
    if (output.runwayMonths !== undefined && typeof output.runwayMonths === 'number') {
      if (output.runwayMonths < 0) {
        this.logger.warn(`Post-execution invariant warning: Negative runway ${output.runwayMonths} detected.`);
      }
    }

    // Invariant 2: If balance sheet or net margin is present, verify mathematical consistency
    if (output.metrics && typeof output.metrics === 'object') {
      const m = output.metrics as Record<string, number>;
      if (m.totalRevenue !== undefined && m.totalExpenses !== undefined && m.netIncome !== undefined) {
        const expectedNet = Number((m.totalRevenue - m.totalExpenses).toFixed(2));
        const actualNet = Number(m.netIncome.toFixed(2));
        if (Math.abs(expectedNet - actualNet) > 0.05) {
          this.logger.error(`Financial invariant check FAILED: Revenue (${m.totalRevenue}) - Expenses (${m.totalExpenses}) != NetIncome (${m.netIncome})`);
          throw new Error('Financial invariant violation: P&L calculation mismatch.');
        }
      }
    }

    return true;
  }
}

@Injectable()
export class SecurityApprovalHook {
  private readonly logger = new Logger(SecurityApprovalHook.name);

  /**
   * Evaluates if the agent's proposed action requires explicit Human-in-the-Loop CFO authorization
   */
  evaluate(context: HookContext): { requiresApproval: boolean; approvalAction?: string; reason?: string } {
    const action = context.action.toUpperCase();

    // Sensitive actions requiring mandatory human authorization
    if (action.includes('REALLOCATE') || action.includes('BUDGET_CHANGE')) {
      return {
        requiresApproval: true,
        approvalAction: 'AUTHORIZE_BUDGET_REALLOCATION',
        reason: 'Adjusting departmental allocations exceeds autonomous threshold and requires CFO sign-off.',
      };
    }

    if (action.includes('PAY_INVOICE') || action.includes('DISBURSE')) {
      return {
        requiresApproval: true,
        approvalAction: 'EXECUTE_PAYMENT_DISBURSEMENT',
        reason: 'Outbound funds disbursement over $5,000 requires two-party human approval.',
      };
    }

    if (action.includes('DISPUTE') || action.includes('CANCEL_VENDOR')) {
      return {
        requiresApproval: true,
        approvalAction: 'VENDOR_CONTRACT_ACTION',
        reason: 'Vendor contract cancellation or formal payment dispute requires legal/finance verification.',
      };
    }

    return { requiresApproval: false };
  }
}

@Injectable()
export class AuditLoggingHook {
  private readonly logger = new Logger(AuditLoggingHook.name);

  constructor(private readonly prisma: PrismaService) {}

  async logExecutionStep(params: {
    taskId: string;
    agentType: AgentType;
    stepName: string;
    status: 'STARTED' | 'SUCCESS' | 'WARNING' | 'FAILED' | 'PENDING_APPROVAL';
    message: string;
    payloadSnapshot?: unknown;
    executionTimeMs?: number;
  }) {
    try {
      await this.prisma.agentExecutionLog.create({
        data: {
          taskId: params.taskId,
          agentType: params.agentType,
          stepName: params.stepName,
          status: params.status,
          message: params.message,
          payloadSnapshot: params.payloadSnapshot ? (params.payloadSnapshot as object) : undefined,
          executionTimeMs: params.executionTimeMs || 0,
        },
      });
    } catch (err: unknown) {
      this.logger.error(`Failed to record agent execution log: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  }
}
