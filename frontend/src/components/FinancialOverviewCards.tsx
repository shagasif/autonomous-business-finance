import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, ShieldAlert, FileText } from 'lucide-react';
import type { FinancialMetrics } from '../types/finance';

interface AnimatedCurrencyProps {
  amount: number;
  currency: string;
}

const AnimatedCurrency: React.FC<AnimatedCurrencyProps> = ({ amount, currency }) => {
  const [displayAmount, setDisplayAmount] = useState(0);
  const currentAmount = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currentAmount.current = amount;
      setDisplayAmount(amount);
      return;
    }

    const startAmount = currentAmount.current;
    const startTime = performance.now();
    const duration = 750;
    let frameId = 0;

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextAmount = startAmount + (amount - startAmount) * easedProgress;
      currentAmount.current = nextAmount;
      setDisplayAmount(nextAmount);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        currentAmount.current = amount;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [amount]);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(displayAmount);

  return <span className="financial-figure">{formattedAmount}</span>;
};

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
          <div
            key={i}
            className="h-32 rounded-2xl p-5 border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          />
        ))}
      </div>
    );
  }

  const isProfitable = metrics.netIncome >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div
          className="rounded-2xl p-5 shadow-sm relative overflow-hidden border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Total Revenue</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <AnimatedCurrency amount={metrics.totalRevenue} currency={currency} />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--success)' }}>
            <span className="font-semibold">+7.4%</span>
            <span style={{ color: 'var(--text-muted)' }}>vs prior period</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div
          className="rounded-2xl p-5 shadow-sm relative overflow-hidden border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Operational Expenses</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <AnimatedCurrency amount={metrics.totalExpenses} currency={currency} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>
              Burn Rate:{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>
                <AnimatedCurrency amount={metrics.monthlyBurnRate} currency={currency} />/mo
              </strong>
            </span>
          </div>
        </div>

        {/* Net Income & Margin */}
        <div
          className="rounded-2xl p-5 shadow-sm relative overflow-hidden border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Net Operating Income</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className="mt-2 text-2xl font-bold tracking-tight"
            style={{ color: isProfitable ? 'var(--success)' : 'var(--danger)' }}
          >
            <AnimatedCurrency amount={metrics.netIncome} currency={currency} />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className="px-2 py-0.5 rounded font-mono font-medium"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              Margin: {metrics.netMarginPercent}%
            </span>
          </div>
        </div>

        {/* Liquid Reserves & Runway */}
        <div
          className="rounded-2xl p-5 shadow-sm relative overflow-hidden border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Liquid Cash &amp; Reserves</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <AnimatedCurrency amount={metrics.cashBalance} currency={currency} />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent)' }}>
            <span className="font-semibold font-mono">{metrics.runwayMonths} Months</span>
            <span style={{ color: 'var(--text-muted)' }}>estimated runway</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => onSelectTab('invoices')}
          className="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors hover:border-[var(--border-hover)]"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>Accounts Receivable</span>
          </div>
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            <AnimatedCurrency amount={metrics.accountsReceivableTotal} currency={currency} />
          </span>
        </div>

        <div
          onClick={() => onSelectTab('invoices')}
          className="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors hover:border-[var(--border-hover)]"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <FileText className="w-4 h-4 text-info" />
            <span>Accounts Payable</span>
          </div>
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            <AnimatedCurrency amount={metrics.accountsPayableTotal} currency={currency} />
          </span>
        </div>

        <div
          onClick={() => onSelectTab('invoices')}
          className="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors hover:border-[var(--border-hover)]"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <ShieldAlert className="w-4 h-4 text-danger" />
            <span>Overdue Invoices</span>
          </div>
          <span className="font-mono font-semibold text-danger">
            {metrics.overdueInvoicesCount} accounts
          </span>
        </div>

        <div
          onClick={() => onSelectTab('approvals')}
          className="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors hover:border-[var(--border-hover)]"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <ShieldAlert className="w-4 h-4 text-warning" />
            <span>Active Anomalies</span>
          </div>
          <span className="font-mono font-semibold text-warning">
            {metrics.activeAnomaliesCount} flagged
          </span>
        </div>
      </div>
    </div>
  );
};
