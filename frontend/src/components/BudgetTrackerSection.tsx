import React from 'react';
import { Terminal, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Budget } from '../types/finance';

interface Props {
  budgets: Budget[];
  currency?: string;
  onNavigateApprovals: () => void;
}

export const BudgetTrackerSection: React.FC<Props> = ({ budgets, currency = 'USD', onNavigateApprovals }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const overallUtilization = totalAllocated > 0 ? Number(((totalSpent / totalAllocated) * 100).toFixed(1)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-xl">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Departmental Budget Variance &amp; Utilization Tracker</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitored autonomously by Agent 4 (Budget Planning Agent) with variance pacing alarms
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Total Cap: <strong className="text-white">{formatCurrency(totalAllocated)}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Utilization: <strong className="text-emerald-400">{overallUtilization}%</strong>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          let statusColor = 'bg-emerald-500';
          let badgeBorder = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';

          if (b.computedStatus === 'EXCEEDED') {
            statusColor = 'bg-rose-500';
            badgeBorder = 'border-rose-500/30 text-rose-400 bg-rose-500/10';
          } else if (b.computedStatus === 'WARNING') {
            statusColor = 'bg-amber-500';
            badgeBorder = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
          }

          return (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-white">{b.department}</h3>
                    <p className="text-xs text-slate-400">{b.category}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${badgeBorder}`}>
                    {b.computedStatus}
                  </span>
                </div>

                {/* Spent vs Allocated Numbers */}
                <div className="mt-4 flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Spent / Cap</span>
                  <div className="font-mono">
                    <strong className="text-white text-sm">{formatCurrency(b.spentAmount)}</strong>
                    <span className="text-slate-500"> / {formatCurrency(b.allocatedAmount)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${statusColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(b.utilizationPercent, 100)}%` }}
                  ></div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{b.utilizationPercent}% utilized</span>
                  <span className={b.remainingAmount < 0 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                    {b.remainingAmount < 0
                      ? `Overrun: +${formatCurrency(Math.abs(b.remainingAmount))}`
                      : `Surplus: ${formatCurrency(b.remainingAmount)}`}
                  </span>
                </div>
              </div>

              {b.notes && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed italic">
                  &ldquo;{b.notes}&rdquo;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Autonomous Reallocation Recommendation Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">
              Agent 4 Proposed Budget Optimization Reallocation
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Marketing has exceeded allocated budget by $6,200 (109.5% utilization) due to Q4 SaaS Summit registration.
              Autonomous agent proposes rebalancing $8,200 surplus from Operations to cover the deficit.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateApprovals}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer shadow-lg shadow-emerald-600/20"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Review Approval Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
