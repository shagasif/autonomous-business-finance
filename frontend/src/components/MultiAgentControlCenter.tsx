import React, { useState } from 'react';
import { Bot, Play, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import type { AgentStatus, AgentTask } from '../types/finance';

interface Props {
  agents: AgentStatus[];
  tasks: AgentTask[];
  onRunAgent: (agentType: string) => Promise<void>;
  onRefreshTasks: () => void;
  isRunningAgent: boolean;
}

export const MultiAgentControlCenter: React.FC<Props> = ({
  agents,
  tasks,
  onRunAgent,
  onRefreshTasks,
  isRunningAgent,
}) => {
  const [activeAgentRun, setActiveAgentRun] = useState<string | null>(null);

  const handleRun = async (agentType: string) => {
    setActiveAgentRun(agentType);
    try {
      await onRunAgent(agentType);
    } finally {
      setActiveAgentRun(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-xl">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span>Coordinated Multi-Agent AI Architecture</span>
            <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              6 Active Agents
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous specialized financial agents executing in isolated sandboxes with pre/post execution verification hooks
          </p>
        </div>

        <button
          onClick={onRefreshTasks}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700/80 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Refresh Agent Logs</span>
        </button>
      </div>

      {/* 6 Specialized Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => (
          <div
            key={agent.agentType}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">{agent.status}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Latency: {agent.averageLatencyMs}ms</span>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-white tracking-tight">{agent.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{agent.role}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Autonomous Ops</span>
                <span className="font-bold text-white">{agent.tasksCompleted} Completed</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleRun(agent.agentType)}
                disabled={isRunningAgent}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${activeAgentRun === agent.agentType ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
                <span>{activeAgentRun === agent.agentType ? 'Running Analysis...' : 'Trigger Agent Run'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Week 7 Engineering Architecture: Sandboxing & Hooks Activity Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-white text-base">
              Week 7 Engineering Controls: Sandboxing &amp; Execution Hooks Feed
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">PostgreSQL Audit Trail</span>
        </div>

        <div className="mt-4 space-y-3">
          {tasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-400 font-semibold">{task.agentType}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300 font-semibold">{task.intent}</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full border ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : task.status === 'REQUIRES_APPROVAL'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1 font-mono truncate max-w-xl">
                  &ldquo;{task.userPrompt}&rdquo;
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sandboxed</span>
                </span>
                <span className="text-slate-500">{task.executionTimeMs}ms</span>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="py-6 text-center text-slate-500 font-mono text-xs">
              No recent task logs. Ingest a transaction or query the AI assistant to view telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
