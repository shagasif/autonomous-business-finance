import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinanceController } from './finance.controller.js';
import { FinanceService } from './finance.service.js';

describe('FinanceController', () => {
  let controller: FinanceController;
  let financeService: FinanceService;

  beforeEach(() => {
    financeService = {
      getOverview: vi.fn().mockResolvedValue({
        metrics: {
          totalRevenue: 245000,
          totalExpenses: 182000,
          netIncome: 63000,
          netMarginPercent: 25.7,
          cashBalance: 1732500,
          monthlyBurnRate: 60666,
          runwayMonths: 28.5,
          accountsReceivableTotal: 184500,
          accountsPayableTotal: 78200,
          overdueInvoicesCount: 1,
          activeAnomaliesCount: 2,
        },
        organization: { id: 'org-1', name: 'Apex Global Technologies', currency: 'USD' },
      }),
      getTransactions: vi.fn().mockResolvedValue([]),
      getBudgets: vi.fn().mockResolvedValue([]),
      getInvoices: vi.fn().mockResolvedValue([]),
      getAnomalies: vi.fn().mockResolvedValue([]),
      getCashFlowForecasts: vi.fn().mockResolvedValue([]),
      getReports: vi.fn().mockResolvedValue([]),
      simulateAnomalyDemo: vi.fn().mockResolvedValue({ id: 'tx-anomaly' }),
    } as unknown as FinanceService;

    controller = new FinanceController(financeService);
  });

  it('should return financial overview metrics', async () => {
    const res = await controller.getOverview();
    expect(res.metrics.totalRevenue).toBe(245000);
    expect(res.metrics.netMarginPercent).toBe(25.7);
    expect(res.organization.name).toBe('Apex Global Technologies');
  });

  it('should call getBudgets', async () => {
    const res = await controller.getBudgets();
    expect(Array.isArray(res)).toBe(true);
    expect(financeService.getBudgets).toHaveBeenCalled();
  });
});
