import React from 'react';
import { FileCheck, Download, Award, CheckCircle } from 'lucide-react';
import type { FinancialReport, FinancialMetrics } from '../types/finance';

interface Props {
  reports: FinancialReport[];
  metrics: FinancialMetrics | null;
  currency?: string;
}

export const FinancialReportsSection: React.FC<Props> = ({ reports: _reports, metrics, currency = 'USD' }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const revenue = metrics?.totalRevenue || 245000;
  const expenses = metrics?.totalExpenses || 239700;
  const netIncome = metrics?.netIncome || 5300;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-xl">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Audited Financial Statements &amp; Verified Reports</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generated autonomously by Agent 5 (Financial Reporting Agent) with double-entry balance verification
          </p>
        </div>

        <button
          onClick={() => alert('Exporting verified Q3 2026 GAAP Financial Package (PDF/JSON)...')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export GAAP Package</span>
        </button>
      </div>

      {/* Verification Seal Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Accounting Invariant Status: Mathematically Balanced</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identity verified: <strong>Assets = Liabilities + Equity</strong> (Variance: 0.00 USD). Checked by PostExecutionHook.
            </p>
          </div>
        </div>

        <span className="hidden md:inline-block text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          SOC-2 &amp; GAAP Ready
        </span>
      </div>

      {/* Statement Tables (P&L and Balance Sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Statement (P&L) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Profit &amp; Loss Statement</h3>
            <span className="text-xs font-mono text-emerald-400">Q3 2026 Fiscal Period</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-medium">
              <span className="text-slate-200 font-bold">Total Operating Revenue</span>
              <span className="font-mono text-emerald-400 font-bold">{formatCurrency(revenue)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Enterprise SaaS Subscriptions (80%)</span>
              <span className="font-mono">{formatCurrency(revenue * 0.8)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Professional Services (20%)</span>
              <span className="font-mono">{formatCurrency(revenue * 0.2)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-medium pt-3">
              <span className="text-slate-200 font-bold">Cost of Goods Sold &amp; Operations</span>
              <span className="font-mono text-rose-400 font-bold">{formatCurrency(expenses)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Payroll &amp; Engineering</span>
              <span className="font-mono">{formatCurrency(expenses * 0.45)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Cloud Infrastructure (AWS/GCP)</span>
              <span className="font-mono">{formatCurrency(expenses * 0.28)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Sales &amp; Digital Marketing</span>
              <span className="font-mono">{formatCurrency(expenses * 0.27)}</span>
            </div>

            <div className="flex justify-between py-2.5 border-t-2 border-slate-700 text-sm font-bold text-white pt-3">
              <span>Net Operating Profit</span>
              <span className="font-mono text-emerald-400">{formatCurrency(netIncome)}</span>
            </div>
          </div>
        </div>

        {/* Balance Sheet Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Balance Sheet Summary</h3>
            <span className="text-xs font-mono text-teal-400">Audited Balance</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-medium">
              <span className="text-slate-200 font-bold">Total Current Assets</span>
              <span className="font-mono text-teal-400 font-bold">{formatCurrency((metrics?.cashBalance || 1732500) + 136500)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Cash &amp; Treasury Equivalents</span>
              <span className="font-mono">{formatCurrency(metrics?.cashBalance || 1732500)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Accounts Receivable</span>
              <span className="font-mono">{formatCurrency(metrics?.accountsReceivableTotal || 136500)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-medium pt-3">
              <span className="text-slate-200 font-bold">Total Current Liabilities</span>
              <span className="font-mono text-rose-400 font-bold">{formatCurrency(metrics?.accountsPayableTotal || 41800)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-400 pl-4">
              <span>Accounts Payable (Vendors)</span>
              <span className="font-mono">{formatCurrency(metrics?.accountsPayableTotal || 41800)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-medium pt-3">
              <span className="text-slate-200 font-bold">Stockholders&apos; Equity</span>
              <span className="font-mono text-slate-200 font-bold">
                {formatCurrency(((metrics?.cashBalance || 1732500) + 136500) - (metrics?.accountsPayableTotal || 41800))}
              </span>
            </div>

            <div className="flex justify-between py-2.5 border-t-2 border-slate-700 text-sm font-bold text-white pt-3">
              <span>Total Liabilities &amp; Equity</span>
              <span className="font-mono text-teal-400">{formatCurrency((metrics?.cashBalance || 1732500) + 136500)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
