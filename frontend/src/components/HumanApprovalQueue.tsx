import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { AgentTask, FinancialAnomaly } from '../types/finance';

interface Props {
  pendingTasks: AgentTask[];
  anomalies: FinancialAnomaly[];
  onApproveTask: (taskId: string) => Promise<void>;
  onRejectTask: (taskId: string) => Promise<void>;
  onResolveAnomaly: (anomalyId: string) => Promise<void>;
  isProcessing: boolean;
}

export const HumanApprovalQueue: React.FC<Props> = ({
  pendingTasks,
  anomalies,
  onApproveTask,
  onRejectTask,
  onResolveAnomaly,
  isProcessing,
}) => {
  const approvalTasks = pendingTasks.filter((t) => t.status === 'REQUIRES_APPROVAL');
  const openAnomalies = anomalies.filter((a) => a.status === 'DETECTED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
            <ShieldAlert className="w-5 h-5 text-warning" />
            <span>Human-in-the-Loop Security &amp; Approval Queue</span>
            <span className="text-xs font-mono uppercase border px-2 py-0.5 rounded-full bg-warning/10 text-warning border-warning/20">
              {approvalTasks.length} Pending Actions
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Week 7 Security Governance: High-risk autonomous agent operations quarantined pending CFO authorization
          </p>
        </div>
      </div>

      {/* Pending Agent Tasks Requiring CFO Approval */}
      <div className="space-y-4">
        <h3
          className="text-sm font-semibold uppercase tracking-wider font-mono"
          style={{ color: 'var(--text-primary)' }}
        >
          Sensitive Financial Operations Requiring Authorization
        </h3>

        {approvalTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--warning-border)',
            }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-warning animate-ping" />
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Action: {task.approvalAction || 'SENSITIVE_FINANCIAL_ACTION'}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  ({task.agentType})
                </span>
              </div>
              <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                Logged: {new Date(task.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <div
              className="text-xs leading-relaxed p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <span className="font-mono block mb-1" style={{ color: 'var(--text-muted)' }}>
                Agent Justification / Proposed Decision:
              </span>
              <p style={{ color: 'var(--text-secondary)' }}>{task.userPrompt}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                Hooks Triggered:{' '}
                <span style={{ color: 'var(--accent)' }}>SecurityApprovalHook, PreExecutionHook</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onRejectTask(task.id)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 border hover:bg-[var(--danger-muted)] text-[var(--danger)] border-[var(--danger-border)]"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject &amp; Quarantine</span>
                </button>
                <button
                  onClick={() => onApproveTask(task.id)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize &amp; Execute</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {approvalTasks.length === 0 && (
          <div
            className="p-8 rounded-2xl border text-center text-xs"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--success)' }} />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              All Autonomous Actions Authorized
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              No sensitive financial operations are currently pending human approval.
            </p>
          </div>
        )}
      </div>

      {/* Active Financial Anomalies Triage Section */}
      <div
        className="space-y-4 pt-4 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-wider font-mono"
          style={{ color: 'var(--text-primary)' }}
        >
          Detected Financial Anomalies Triage ({openAnomalies.length} Active)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openAnomalies.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl border flex flex-col justify-between space-y-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${a.severity === 'CRITICAL' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}`}
                    />
                    <h4 className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                      {a.title}
                    </h4>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                    style={
                      a.severity === 'CRITICAL'
                        ? { backgroundColor: 'var(--danger-muted)', color: 'var(--danger)' }
                        : { backgroundColor: 'var(--warning-muted)', color: 'var(--warning)' }
                    }
                  >
                    {a.severity}
                  </span>
                </div>
                <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {a.description}
                </p>
              </div>

              <div
                className="pt-2 border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Detected by: {a.detectedBy}
                </span>
                <button
                  onClick={() => onResolveAnomaly(a.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors hover:bg-[var(--success-muted)] hover:border-[var(--success-border)]"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--success)',
                  }}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}

          {openAnomalies.length === 0 && (
            <div className="col-span-2 py-6 text-center font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              Zero active anomalies. Spending patterns match expected baseline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
