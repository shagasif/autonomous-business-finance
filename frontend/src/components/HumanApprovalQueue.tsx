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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-xl">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Human-in-the-Loop Security &amp; Approval Queue</span>
            <span className="text-xs font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {approvalTasks.length} Pending Actions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Week 7 Security Governance: High-risk autonomous agent operations quarantined pending CFO authorization
          </p>
        </div>
      </div>

      {/* Pending Agent Tasks Requiring CFO Approval */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
          Sensitive Financial Operations Requiring Authorization
        </h3>

        {approvalTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-bold text-white text-sm">
                  Action: {task.approvalAction || 'SENSITIVE_FINANCIAL_ACTION'}
                </span>
                <span className="text-xs font-mono text-slate-400">({task.agentType})</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Logged: {new Date(task.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-mono block mb-1">Agent Justification / Proposed Decision:</span>
              <p className="text-slate-200">{task.userPrompt}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] font-mono text-slate-400">
                Hooks Triggered: <span className="text-emerald-400">SecurityApprovalHook, PreExecutionHook</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onRejectTask(task.id)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reject &amp; Quarantine</span>
                </button>
                <button
                  onClick={() => onApproveTask(task.id)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize &amp; Execute</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {approvalTasks.length === 0 && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-white">All Autonomous Actions Authorized</p>
            <p className="text-[11px] text-slate-500 mt-1">
              No sensitive financial operations are currently pending human approval.
            </p>
          </div>
        )}
      </div>

      {/* Active Financial Anomalies Triage Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
          Detected Financial Anomalies Triage ({openAnomalies.length} Active)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openAnomalies.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${a.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}
                    />
                    <h4 className="font-semibold text-white text-xs">{a.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                      a.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{a.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Detected by: {a.detectedBy}
                </span>
                <button
                  onClick={() => onResolveAnomaly(a.id)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold cursor-pointer"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}

          {openAnomalies.length === 0 && (
            <div className="col-span-2 py-6 text-center text-slate-500 font-mono text-xs">
              Zero active anomalies. Spending patterns match expected baseline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
