import React, { useState } from 'react';
import { BarChart3, PieChart, Sparkles, AlertCircle } from 'lucide-react';
import type { FinancialMetrics } from '../types/finance';

interface Props {
  metrics: FinancialMetrics | null;
  onSimulateAnomaly: () => void;
  isSimulating: boolean;
}

export const RevenueExpenseAnalytics: React.FC<Props> = ({ metrics, onSimulateAnomaly, isSimulating }) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const monthlyData = [
    { month: 'May', revenue: 195000, expenses: 165000 },
    { month: 'Jun', revenue: 210000, expenses: 178000 },
    { month: 'Jul', revenue: 228000, expenses: 192000 },
    { month: 'Aug', revenue: 235000, expenses: 205000 },
    { month: 'Sep', revenue: 242000, expenses: 218000 },
    { month: 'Oct (Current)', revenue: metrics?.totalRevenue || 245000, expenses: metrics?.totalExpenses || 239700 },
  ];

  const maxAmount = Math.max(...monthlyData.map((d) => Math.max(d.revenue, d.expenses))) * 1.15;
  const chartMax = Math.ceil(maxAmount / 100000) * 100000;
  const plot = { left: 72, right: 710, top: 20, bottom: 198, height: 260 };
  const xForIndex = (index: number) => plot.left + (index * (plot.right - plot.left)) / (monthlyData.length - 1);
  const yForAmount = (amount: number) => plot.bottom - (amount / chartMax) * (plot.bottom - plot.top);
  const revenuePoints = monthlyData.map((d, index) => ({ x: xForIndex(index), y: yForAmount(d.revenue) }));
  const expensePoints = monthlyData.map((d, index) => ({ x: xForIndex(index), y: yForAmount(d.expenses) }));
  const linePath = (points: { x: number; y: number }[]) =>
    points.reduce((path, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = points[index - 1];
      const beforePrevious = points[index - 2] ?? previous;
      const next = points[index + 1] ?? point;
      const control1 = {
        x: previous.x + (point.x - beforePrevious.x) / 6,
        y: previous.y + (point.y - beforePrevious.y) / 6,
      };
      const control2 = {
        x: point.x - (next.x - previous.x) / 6,
        y: point.y - (next.y - previous.y) / 6,
      };

      return `${path} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${point.x} ${point.y}`;
    }, '');

  const categoryBreakdown = [
    { category: 'Payroll & Engineering', percentage: 45, amount: '$108,000' },
    { category: 'Cloud Infrastructure (AWS/GCP)', percentage: 22, amount: '$52,850' },
    { category: 'Sales & Inbound Marketing', percentage: 16, amount: '$38,400' },
    { category: 'SaaS Software Subscriptions', percentage: 10, amount: '$24,000' },
    { category: 'G&A & Operational', percentage: 7, amount: '$16,450' },
  ];

  const activeMonth = hoveredMonth === null ? null : monthlyData[hoveredMonth];
  const tooltipY =
    hoveredMonth === null
      ? 0
      : Math.min(yForAmount(Math.max(monthlyData[hoveredMonth].revenue, monthlyData[hoveredMonth].expenses)), 180);
  const formatTooltipAmount = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Bar Trend */}
      <div
        className="lg:col-span-2 rounded-2xl p-6 shadow-sm border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <div className="flex items-center gap-2 font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span>Revenue vs. Operational Spend Velocity</span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Trailing 6-month trajectory and current monthly pacing
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-t-2" style={{ borderColor: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-t-2" style={{ borderColor: '#C4C7CC' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Operational Expenses</span>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          {activeMonth && (
            <div
              className="pointer-events-none absolute z-10 rounded-lg border px-3 py-2 text-xs shadow-lg"
              style={{
                left: '50%',
                top: `${(tooltipY / plot.height) * 100}%`,
                transform: 'translate(-50%, -110%)',
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
              }}
            >
              <p className="mb-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
                {activeMonth.month}
              </p>
              <p className="flex items-center gap-2 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                Revenue: {formatTooltipAmount(activeMonth.revenue)}
              </p>
              <p className="flex items-center gap-2 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#C4C7CC' }} />
                Operational Expenses: {formatTooltipAmount(activeMonth.expenses)}
              </p>
            </div>
          )}
          <svg
            className="block h-[260px] w-full overflow-visible"
            viewBox={`0 0 720 ${plot.height}`}
            role="img"
            aria-label="Revenue and operational expenses over the last six months"
            onMouseLeave={() => setHoveredMonth(null)}
          >
            {[0, 1, 2, 3, 4].map((step) => {
              const amount = (chartMax * step) / 4;
              const y = yForAmount(amount);
              return (
                <g key={step}>
                  <line
                    x1={plot.left}
                    y1={y}
                    x2={plot.right}
                    y2={y}
                    stroke="var(--border)"
                    strokeOpacity="0.7"
                    strokeWidth="1"
                  />
                  <text
                    x={plot.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    fill="var(--text-muted)"
                    fontSize="10"
                  >
                    {amount === 0 ? '$0' : `$${Math.round(amount / 1000)}k`}
                  </text>
                </g>
              );
            })}
            <path
              className="chart-line"
              d={linePath(expensePoints)}
              fill="none"
              stroke="#C4C7CC"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="chart-line"
              d={linePath(revenuePoints)}
              fill="none"
              stroke="#D6AD72"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {monthlyData.map((d, index) => (
              <g key={d.month}>
                {[{ label: 'Revenue', point: revenuePoints[index], value: d.revenue, color: '#D6AD72' },
                  { label: 'Operational Expenses', point: expensePoints[index], value: d.expenses, color: '#C4C7CC' }].map(
                  ({ label, point, value, color }) => (
                    <g key={label}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="9"
                        fill="transparent"
                        tabIndex={0}
                        role="img"
                        aria-label={`${label}, ${d.month}: ${formatTooltipAmount(value)}`}
                        onMouseEnter={() => setHoveredMonth(index)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        onFocus={() => setHoveredMonth(index)}
                        onBlur={() => setHoveredMonth(null)}
                      >
                        <title>{`${label}, ${d.month}: ${formatTooltipAmount(value)}`}</title>
                      </circle>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="3.5"
                        fill={color}
                        stroke="var(--bg-card)"
                        strokeWidth="1.5"
                        pointerEvents="none"
                      />
                    </g>
                  ),
                )}
                <text
                  x={xForIndex(index)}
                  y="224"
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                >
                  {d.month.replace(' (Current)', '')}
                </text>
                {d.month.includes('(Current)') && (
                  <text
                    x={xForIndex(index)}
                    y="240"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="9"
                  >
                    Current
                  </text>
                )}
              </g>
            ))}
            <line
              x1={plot.left}
              y1={plot.bottom}
              x2={plot.right}
              y2={plot.bottom}
              stroke="var(--border)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-2 gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>
            Operating Margin:{' '}
            <strong className="font-mono" style={{ color: 'var(--accent)' }}>
              +{metrics?.netMarginPercent || 2.2}%
            </strong>
          </span>
          <div className="flex items-center gap-1 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Autonomous categorization active across all channels</span>
          </div>
        </div>
      </div>

      {/* Expense Allocation & Real-Time Demo Anomaly Trigger */}
      <div
        className="rounded-2xl p-6 shadow-sm border flex flex-col justify-between"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div>
          <div
            className="flex items-center gap-2 font-semibold text-lg pb-4 border-b"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          >
            <PieChart className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Spend Category Allocation</span>
          </div>

          <div className="mt-4 space-y-3">
            {categoryBreakdown.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {c.category}
                  </span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                    {c.amount} ({c.percentage}%)
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-1.5 overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.percentage}%`, backgroundColor: 'var(--accent)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Anomaly Simulation Trigger Box */}
        <div
          className="mt-6 p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            <Sparkles className="w-4 h-4" />
            <span>Autonomous Engine Testing Harness</span>
          </div>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Ingest a sudden high-value anomalous charge to test real-time detection by the Expense Management Agent.
          </p>
          <button
            onClick={onSimulateAnomaly}
            disabled={isSimulating}
            className="mt-3 w-full py-2 px-3 rounded-lg border font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent-muted)',
              borderColor: 'var(--accent-border)',
              color: 'var(--accent)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating Anomaly...' : 'Simulate $18,400 Compute Spike'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
