import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, Calendar } from 'lucide-react';
import type { CashFlowForecast } from '../types/finance';

interface Props {
  forecasts: CashFlowForecast[];
  currency?: string;
}

export const CashFlowForecastSection: React.FC<Props> = ({ forecasts, currency = 'USD' }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-xl">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>Time-Series Cash Flow Projections &amp; Liquidity Health</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Modeled by Agent 3 (Cash Flow Management Agent) using statistical moving-average pipeline
          </p>
        </div>
      </div>

      {/* Liquidity Ratios Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ratios.map((r) => (
          <div key={r.label} className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="text-[11px] text-slate-400 truncate">{r.label}</div>
            <div className="text-lg font-bold text-white mt-1 font-mono">{r.value}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
              <span className="text-slate-500">Target: {r.benchmark}</span>
              <span
                className={`font-mono font-semibold ${
                  r.status === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'
                }`}
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
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">{f.periodDays}-Day Horizon</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {Math.round(f.confidenceScore * 100)}% Confidence
                </span>
              </div>

              {/* Inflow vs Outflow */}
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Projected Inflow</span>
                  <span className="font-mono font-semibold text-emerald-400">+{formatCurrency(f.projectedInflow)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Projected Outflow</span>
                  <span className="font-mono font-semibold text-rose-400">-{formatCurrency(f.projectedOutflow)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Net Trajectory</span>
                  <span className="font-mono font-bold text-white text-sm">+{formatCurrency(f.netCashFlow)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ending Cash Buffer</span>
                  <span className="font-mono text-slate-200">{formatCurrency(f.closingCashBalance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Projected Runway</span>
                  <span className="font-mono text-teal-400 font-semibold">{f.projectedRunwayMonths} Months</span>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">Autonomous Risk Factors:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {f.riskFactors.map((rf, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Recommendation Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <h4 className="font-semibold text-white">Agent 3 Liquidity Conclusion:</h4>
          <p className="text-slate-300 mt-1 leading-relaxed">
            Overall liquidity is secure for the next 19.7 months. The primary working capital constraint stems from 
            delayed enterprise collections (DSO at 50 days). Recommending automated collection follow-up for 
            overdue invoice INV-2026-074 ($34,000 Stark Logistics) to accelerate cash conversion.
          </p>
        </div>
      </div>
    </div>
  );
};
