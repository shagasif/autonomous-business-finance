import { Injectable, Logger } from '@nestjs/common';
import { FinanceService } from '../../finance/finance.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AgentType, BudgetStatus } from '@prisma/client';

export interface DepartmentBudgetAnalysis {
  department: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercent: number;
  varianceStatus: BudgetStatus;
  projectedOverrunAmount: number;
}

export interface ReallocationProposal {
  sourceDepartment: string;
  targetDepartment: string;
  amount: number;
  reason: string;
  requiresApproval: boolean;
}

export interface BudgetPlanningReport {
  agentType: AgentType;
  totalAllocated: number;
  totalSpent: number;
  totalVariance: number;
  overallUtilizationPercent: number;
  departments: DepartmentBudgetAnalysis[];
  criticalAlerts: string[];
  reallocationProposals: ReallocationProposal[];
  timestamp: string;
}

@Injectable()
export class BudgetPlanningAgent {
  private readonly logger = new Logger(BudgetPlanningAgent.name);

  constructor(
    private readonly financeService: FinanceService,
    private readonly prisma: PrismaService,
  ) {}

  async analyze(): Promise<BudgetPlanningReport> {
    this.logger.log('Agent 4 (Budget Planning) running departmental variance analysis...');
    const budgets = await this.financeService.getBudgets();

    let totalAllocated = 0;
    let totalSpent = 0;
    const criticalAlerts: string[] = [];
    const reallocationProposals: ReallocationProposal[] = [];

    const departments: DepartmentBudgetAnalysis[] = budgets.map((b) => {
      totalAllocated += b.allocatedAmount;
      totalSpent += b.spentAmount;

      const remainingAmount = Number((b.allocatedAmount - b.spentAmount).toFixed(2));
      const projectedOverrun = b.spentAmount > b.allocatedAmount ? Number((b.spentAmount - b.allocatedAmount).toFixed(2)) : 0;

      if (b.computedStatus === BudgetStatus.EXCEEDED) {
        criticalAlerts.push(
          `Overrun Alert: ${b.department} has exceeded allocated budget by $${projectedOverrun.toLocaleString()} (${b.utilizationPercent}% utilization).`,
        );
      } else if (b.computedStatus === BudgetStatus.WARNING) {
        criticalAlerts.push(
          `Pacing Warning: ${b.department} is at ${b.utilizationPercent}% of monthly cap with remaining cycle time.`,
        );
      }

      return {
        department: b.department,
        category: b.category,
        allocatedAmount: b.allocatedAmount,
        spentAmount: b.spentAmount,
        remainingAmount,
        utilizationPercent: b.utilizationPercent,
        varianceStatus: b.computedStatus,
        projectedOverrunAmount: projectedOverrun,
      };
    });

    const overallUtilization = totalAllocated > 0 ? Number(((totalSpent / totalAllocated) * 100).toFixed(1)) : 0;
    const totalVariance = Number((totalAllocated - totalSpent).toFixed(2));

    // Propose autonomous reallocations if department overruns exist and other departments have surplus
    const surplusDept = departments.find((d) => d.remainingAmount > 7000);
    const deficitDept = departments.find((d) => d.varianceStatus === BudgetStatus.EXCEEDED);

    if (surplusDept && deficitDept) {
      reallocationProposals.push({
        sourceDepartment: surplusDept.department,
        targetDepartment: deficitDept.department,
        amount: Math.min(surplusDept.remainingAmount * 0.7, deficitDept.projectedOverrunAmount + 2000),
        reason: `Rebalance surplus budget from under-utilized ${surplusDept.department} to absorb unexpected sponsorship overruns in ${deficitDept.department}.`,
        requiresApproval: true,
      });
    }

    return {
      agentType: AgentType.BUDGET_PLANNING,
      totalAllocated: Number(totalAllocated.toFixed(2)),
      totalSpent: Number(totalSpent.toFixed(2)),
      totalVariance,
      overallUtilizationPercent: overallUtilization,
      departments,
      criticalAlerts,
      reallocationProposals,
      timestamp: new Date().toISOString(),
    };
  }
}
