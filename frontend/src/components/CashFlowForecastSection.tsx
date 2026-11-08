import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, Calendar } from 'lucide-react';
import type { CashFlowForecast } from '../types/finance';

interface Props {
  forecasts: CashFlowForecast[];
  currency?: string;
}

export const CashFlowForecastSection: React.FC<Props> = ({ forecasts, currency = 'USD' }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

  const ratios = [
    { label: 'Current Ratio', value: '4.85x', benchmark: '> 1.5x', status: 'HEALTHY' },
    { label: 'Quick Ratio (Acid-Test)', value: '4.85x', benchmark: '> 1.0x', status: 'HEALTHY' },
    { label: 'Days Sales Outstanding (DSO)', value: '50 Days', benchmark: '< 45 Days', status: 'WARNING' },
    { label: 'Days Payable Outstanding (DPO)', value: '38 Days', benchmark: '30-45 Days', status: 'HEALTHY' },
    { label: 'Net Working Capital', value: '$1,875,200', benchmark: 'Positive', status: 'HEALTHY' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
            <Activity className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Time-Series Cash Flow Projections &amp; Liquidity Health</span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Modeled by Agent 3 (Cash Flow Management Agent) using statistical moving-average pipeline
          </p>
        </div>
      </div>

      {/* Liquidity Ratios Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ratios.map((r) => (
          <div
            key={r.label}
            className="p-4 rounded-xl border shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {r.label}
            </div>
            <div className="text-lg font-bold mt-1 font-mono" style={{ color: 'var(--text-primary)' }}>
              {r.value}
            </div>
            <div
              className="flex items-center justify-between mt-2 pt-2 border-t text-[10px]"
              style={{ borderColor: 'var(--border)' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Target: {r.benchmark}</span>
              <span
                className="font-mono font-semibold"
                style={{ color: r.status === 'HEALTHY' ? 'var(--accent)' : 'var(--warning)' }}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 30, 60, 90 Day Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forecasts.map((f) => (
          <div
            key={f.periodDays}
            className="rounded-2xl p-6 shadow-sm border flex flex-col justify-between"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div>
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {f.periodDays}-Day Horizon
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--accent-muted)',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent-border)',
                  }}
                >
                  {Math.round(f.confidenceScore * 100)}% Confidence
                </span>
              </div>

              {/* Inflow vs Outflow */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Projected Inflow</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--success)' }}>
                    +{formatCurrency(f.projectedInflow)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Projected Outflow</span>
                  <span className="font-mono font-semibold text-danger">
                    -{formatCurrency(f.projectedOutflow)}
                  </span>
                </div>
                <div
                  className="pt-2 border-t flex justify-between items-center"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Net Trajectory
                  </span>
                  <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    +{formatCurrency(f.netCashFlow)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Ending Cash Buffer</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(f.closingCashBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Projected Runway</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                    {f.projectedRunwayMonths} Months
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[11px] font-mono block mb-2" style={{ color: 'var(--text-muted)' }}>
                Autonomous Risk Factors:
              </span>
              <ul className="space-y-1.5 text-xs">
                {f.riskFactors.map((rf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    <ShieldAlert className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Recommendation Callout */}
      <div
        className="p-4 rounded-xl border flex items-start gap-3"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
        <div className="text-xs">
          <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Agent 3 Liquidity Conclusion:
          </h4>
          <p className="mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Overall liquidity is secure for the next 19.7 months. The primary working capital constraint stems from
            delayed enterprise collections (DSO at 50 days). Recommending automated collection follow-up for
            overdue invoice INV-2026-074 ($34,000 Stark Logistics) to accelerate cash conversion.
          </p>
        </div>
      </div>
    </div>
  );
};
