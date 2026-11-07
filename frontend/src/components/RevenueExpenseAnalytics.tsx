import React from 'react';
import { BarChart3, PieChart, Sparkles, AlertCircle } from 'lucide-react';
import type { FinancialMetrics } from '../types/finance';

interface Props {
  metrics: FinancialMetrics | null;
  onSimulateAnomaly: () => void;
  isSimulating: boolean;
}

export const RevenueExpenseAnalytics: React.FC<Props> = ({ metrics, onSimulateAnomaly, isSimulating }) => {
  // Monthly historical data pacing
  const monthlyData = [
    { month: 'May', revenue: 195000, expenses: 165000 },
    { month: 'Jun', revenue: 210000, expenses: 178000 },
    { month: 'Jul', revenue: 228000, expenses: 192000 },
    { month: 'Aug', revenue: 235000, expenses: 205000 },
    { month: 'Sep', revenue: 242000, expenses: 218000 },
    { month: 'Oct (Current)', revenue: metrics?.totalRevenue || 245000, expenses: metrics?.totalExpenses || 239700 },
  ];

  const maxAmount = Math.max(...monthlyData.map((d) => Math.max(d.revenue, d.expenses))) * 1.15;

  const categoryBreakdown = [
    { category: 'Payroll & Engineering', percentage: 45, color: 'bg-emerald-500', amount: '$108,000' },
    { category: 'Cloud Infrastructure (AWS/GCP)', percentage: 22, color: 'bg-teal-500', amount: '$52,850' },
    { category: 'Sales & Inbound Marketing', percentage: 16, color: 'bg-cyan-500', amount: '$38,400' },
    { category: 'SaaS Software Subscriptions', percentage: 10, color: 'bg-indigo-500', amount: '$24,000' },
    { category: 'G&A & Operational', percentage: 7, color: 'bg-purple-500', amount: '$16,450' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Bar Trend */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Revenue vs. Operational Spend Velocity</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Trailing 6-month trajectory and current monthly pacing</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
              <span className="text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500/80"></span>
              <span className="text-slate-300">Expenses</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 h-48 items-end pt-4 border-b border-slate-800">
            {monthlyData.map((d, index) => {
              const revHeight = (d.revenue / maxAmount) * 100;
              const expHeight = (d.expenses / maxAmount) * 100;

              return (
                <div key={index} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-500 group-hover:brightness-110 relative"
                      title={`Revenue: $${d.revenue.toLocaleString()}`}
                    ></div>
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-1/2 bg-gradient-to-t from-rose-600 to-rose-400/80 rounded-t-sm transition-all duration-500 group-hover:brightness-110 relative"
                      title={`Expenses: $${d.expenses.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 truncate w-full text-center">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-2 gap-2">
            <span>Operating Margin: <strong className="text-emerald-400 font-mono">+{metrics?.netMarginPercent || 2.2}%</strong></span>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Autonomous categorization active across all channels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Allocation & Real-Time Demo Anomaly Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-lg pb-4 border-b border-slate-800">
            <PieChart className="w-5 h-5 text-teal-400" />
            <span>Spend Category Allocation</span>
          </div>

          <div className="mt-4 space-y-3">
            {categoryBreakdown.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{c.category}</span>
                  <span className="font-mono text-slate-400">{c.amount} ({c.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Anomaly Simulation Trigger Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous Engine Testing Harness</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Ingest a sudden high-value anomalous charge to test real-time detection by the Expense Management Agent.
          </p>
          <button
            onClick={onSimulateAnomaly}
            disabled={isSimulating}
            className="mt-3 w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSimulating ? 'Simulating Anomaly...' : 'Simulate $18,400 Compute Spike'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
