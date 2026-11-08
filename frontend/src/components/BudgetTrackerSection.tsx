import React from 'react';
import { Terminal, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Budget } from '../types/finance';

interface Props {
  budgets: Budget[];
  currency?: string;
  onNavigateApprovals: () => void;
}

export const BudgetTrackerSection: React.FC<Props> = ({ budgets, currency = 'USD', onNavigateApprovals }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const overallUtilization = totalAllocated > 0 ? Number(((totalSpent / totalAllocated) * 100).toFixed(1)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
            <Terminal className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Departmental Budget Variance &amp; Utilization Tracker</span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Monitored autonomously by Agent 4 (Budget Planning Agent) with variance pacing alarms
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div
            className="px-3 py-1.5 rounded-lg border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Total Cap:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalAllocated)}</strong>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Utilization:{' '}
            <strong style={{ color: 'var(--accent)' }}>{overallUtilization}%</strong>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((b) => {
          let barColor = 'var(--success)';
          let badgeStyle = {
            borderColor: 'var(--success-border)',
            color: 'var(--success)',
            backgroundColor: 'var(--success-muted)',
          };

          if (b.computedStatus === 'EXCEEDED') {
            barColor = 'var(--danger)';
            badgeStyle = {
              borderColor: 'var(--danger-border)',
              color: 'var(--danger)',
              backgroundColor: 'var(--danger-muted)',
            };
          } else if (b.computedStatus === 'WARNING') {
            barColor = 'var(--warning)';
            badgeStyle = {
              borderColor: 'var(--warning-border)',
              color: 'var(--warning)',
              backgroundColor: 'var(--warning-muted)',
            };
          }

          return (
            <div
              key={b.id}
              className="rounded-2xl p-5 shadow-sm border flex flex-col justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {b.department}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.category}</p>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold"
                    style={badgeStyle}
                  >
                    {b.computedStatus}
                  </span>
                </div>

                {/* Spent vs Allocated Numbers */}
                <div className="mt-4 flex items-baseline justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Spent / Cap</span>
                  <div className="font-mono">
                    <strong className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(b.spentAmount)}
                    </strong>
                    <span style={{ color: 'var(--text-muted)' }}> / {formatCurrency(b.allocatedAmount)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className="mt-2 w-full rounded-full h-2 overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(b.utilizationPercent, 100)}%`, backgroundColor: barColor }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>{b.utilizationPercent}% utilized</span>
                  <span style={{ color: b.remainingAmount < 0 ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: b.remainingAmount < 0 ? 600 : 400 }}>
                    {b.remainingAmount < 0
                      ? `Overrun: +${formatCurrency(Math.abs(b.remainingAmount))}`
                      : `Surplus: ${formatCurrency(b.remainingAmount)}`}
                  </span>
                </div>
              </div>

              {b.notes && (
                <div
                  className="mt-4 pt-3 border-t text-[11px] leading-relaxed italic"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  &ldquo;{b.notes}&rdquo;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Autonomous Reallocation Recommendation Box */}
      <div
        className="p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--warning-muted)',
              borderColor: 'var(--warning)',
              color: 'var(--warning)',
            }}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Agent 4 Proposed Budget Optimization Reallocation
            </h4>
            <p className="text-xs mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Marketing has exceeded allocated budget by $6,200 (109.5% utilization) due to Q4 SaaS Summit registration.
              Autonomous agent proposes rebalancing $8,200 surplus from Operations to cover the deficit.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateApprovals}
          className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer shadow-sm"
          style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Review Approval Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
