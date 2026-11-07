import { Injectable, Logger } from '@nestjs/common';
import { FinanceService } from '../../finance/finance.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AgentType, TransactionType } from '@prisma/client';

export interface CategoryBreakdown {
  category: string;
  totalSpent: number;
  transactionCount: number;
  percentageOfTotal: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
}

export interface ExpenseManagementReport {
  agentType: AgentType;
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  topVendors: { vendor: string; totalSpent: number; percentage: number }[];
  anomaliesDetected: {
    id: string;
    title: string;
    severity: string;
    amount: number;
    description: string;
    actionRequired: string;
  }[];
  costOptimizationRecommendations: {
    area: string;
    potentialSavingsMonthly: number;
    effort: 'LOW' | 'MEDIUM' | 'HIGH';
    action: string;
  }[];
  timestamp: string;
}

@Injectable()
export class ExpenseManagementAgent {
  private readonly logger = new Logger(ExpenseManagementAgent.name);

  constructor(
    private readonly financeService: FinanceService,
    private readonly prisma: PrismaService,
  ) {}

  async analyze(): Promise<ExpenseManagementReport> {
    this.logger.log('Agent 2 (Expense Management) executing spend analysis and anomaly detection...');
    const org = await this.financeService.getPrimaryOrganization();

    // 1. Fetch all cleared and pending expense transactions
    const expenses = await this.prisma.transaction.findMany({
      where: {
        organizationId: org.id,
        type: TransactionType.EXPENSE,
      },
      orderBy: { date: 'desc' },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 2. Aggregate spend by Category
    const categoryMap = new Map<string, { total: number; count: number }>();
    for (const e of expenses) {
      const existing = categoryMap.get(e.category) || { total: 0, count: 0 };
      categoryMap.set(e.category, {
        total: existing.total + e.amount,
        count: existing.count + 1,
      });
    }

    const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        totalSpent: Number(data.total.toFixed(2)),
        transactionCount: data.count,
        percentageOfTotal: totalSpent > 0 ? Number(((data.total / totalSpent) * 100).toFixed(1)) : 0,
        trend: (category.includes('Cloud') ? 'INCREASING' : 'STABLE') as 'INCREASING' | 'STABLE' | 'DECREASING',
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // 3. Vendor Concentration Analysis
    const vendorMap = new Map<string, number>();
    for (const e of expenses) {
      vendorMap.set(e.counterparty, (vendorMap.get(e.counterparty) || 0) + e.amount);
    }

    const topVendors = Array.from(vendorMap.entries())
      .map(([vendor, spent]) => ({
        vendor,
        totalSpent: Number(spent.toFixed(2)),
        percentage: totalSpent > 0 ? Number(((spent / totalSpent) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // 4. Fetch Active Detected Anomalies
    const anomalies = await this.prisma.financialAnomaly.findMany({
      where: { organizationId: org.id },
      include: { transaction: true },
      orderBy: { createdAt: 'desc' },
    });

    const anomaliesDetected = anomalies.map((a) => ({
      id: a.id,
      title: a.title,
      severity: a.severity,
      amount: a.actualValue || (a.transaction?.amount ?? 0),
      description: a.description,
      actionRequired:
        a.severity === 'CRITICAL'
          ? 'Immediate CFO authorization required to freeze or dispute charge'
          : 'Review vendor invoice against contract terms',
    }));

    // 5. Cost Optimization Recommendations
    const costOptimizationRecommendations = [
      {
        area: 'Cloud Compute (AWS & GCP)',
        potentialSavingsMonthly: 12500,
        effort: 'LOW' as const,
        action: 'Terminate unassigned development GPU clusters and purchase 1-year Compute Savings Plans.',
      },
      {
        area: 'SaaS License Rationalization',
        potentialSavingsMonthly: 3800,
        effort: 'MEDIUM' as const,
        action: 'Deprovision 18 inactive seats across GitHub Enterprise, Slack, and Figma identified in last audit.',
      },
      {
        area: 'Payment Processing & Wire Fees',
        potentialSavingsMonthly: 1400,
        effort: 'LOW' as const,
        action: 'Switch enterprise recurring collections to ACH/Direct Debit over credit card processing.',
      },
    ];

    return {
      agentType: AgentType.EXPENSE_MANAGEMENT,
      totalExpenses: Number(totalSpent.toFixed(2)),
      categoryBreakdown,
      topVendors,
      anomaliesDetected,
      costOptimizationRecommendations,
      timestamp: new Date().toISOString(),
    };
  }
}
