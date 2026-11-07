import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, ShieldAlert, FileText } from 'lucide-react';
import type { FinancialMetrics } from '../types/finance';

interface Props {
  metrics: FinancialMetrics | null;
  currency?: string;
  onSelectTab: (tab: 'overview' | 'agents' | 'cashflow' | 'budgets' | 'invoices' | 'approvals' | 'reports') => void;
}

export const FinancialOverviewCards: React.FC<Props> = ({ metrics, currency = 'USD', onSelectTab }) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl p-5"></div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isProfitable = metrics.netIncome >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="font-semibold">+7.4%</span>
            <span className="text-slate-400">vs prior period</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Operational Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatCurrency(metrics.totalExpenses)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Burn Rate: <strong className="text-slate-200">{formatCurrency(metrics.monthlyBurnRate)}/mo</strong></span>
          </div>
        </div>

        {/* Net Income & Margin */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Net Operating Income</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isProfitable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`mt-2 text-2xl font-bold tracking-tight ${
              isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(metrics.netIncome)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-medium">
              Margin: {metrics.netMarginPercent}%
            </span>
          </div>
        </div>

        {/* Liquid Reserves & Runway */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Liquid Cash &amp; Reserves</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatCurrency(metrics.cashBalance)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-400">
            <span className="font-semibold font-mono">{metrics.runwayMonths} Months</span>
            <span className="text-slate-400">estimated runway</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => onSelectTab('invoices')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Accounts Receivable</span>
          </div>
          <span className="font-mono font-semibold text-white">
            {formatCurrency(metrics.accountsReceivableTotal)}
          </span>
        </div>

        <div
          onClick={() => onSelectTab('invoices')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Accounts Payable</span>
          </div>
          <span className="font-mono font-semibold text-white">
            {formatCurrency(metrics.accountsPayableTotal)}
          </span>
        </div>

        <div
          onClick={() => onSelectTab('invoices')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Overdue Invoices</span>
          </div>
          <span className="font-mono font-semibold text-rose-400">
            {metrics.overdueInvoicesCount} accounts
          </span>
        </div>

        <div
          onClick={() => onSelectTab('approvals')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Active Anomalies</span>
          </div>
          <span className="font-mono font-semibold text-amber-400">
            {metrics.activeAnomaliesCount} flagged
          </span>
        </div>
      </div>
    </div>
  );
};
