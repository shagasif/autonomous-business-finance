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
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
            <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Coordinated Multi-Agent AI Architecture</span>
            <span
              className="text-xs font-mono uppercase border px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--accent-muted)',
                color: 'var(--accent)',
                borderColor: 'var(--accent-border)',
              }}
            >
              6 Active Agents
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Autonomous specialized financial agents executing in isolated sandboxes with pre/post execution verification hooks
          </p>
        </div>

        <button
          onClick={onRefreshTasks}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border cursor-pointer self-start sm:self-auto transition-colors hover:bg-[var(--bg-hover)]"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span>Refresh Agent Logs</span>
        </button>
      </div>

      {/* 6 Specialized Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => (
          <div
            key={agent.agentType}
            className="rounded-2xl p-5 shadow-sm border flex flex-col justify-between transition-colors hover:border-[var(--border-hover)]"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div>
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--success)' }}
                  />
                  <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {agent.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Latency: {agent.averageLatencyMs}ms
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {agent.name}
                </h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {agent.role}
                </p>
              </div>

              <div
                className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <span>Autonomous Ops</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {agent.tasksCompleted} Completed
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => handleRun(agent.agentType)}
                disabled={isRunningAgent}
                className="agent-trigger-button w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 border"
                style={{
                  backgroundColor: 'var(--accent-muted)',
                  borderColor: 'var(--accent-border)',
                  color: 'var(--text-primary)',
                }}
              >
                <Play
                  className={`w-3.5 h-3.5 ${activeAgentRun === agent.agentType ? 'animate-spin' : ''}`}
                  style={{ color: 'var(--accent)' }}
                />
                <span>
                  {activeAgentRun === agent.agentType ? 'Running Analysis...' : 'Trigger Agent Run'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sandboxing & Hooks Activity Feed */}
      <div
        className="rounded-2xl p-6 shadow-sm border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
              Week 7 Engineering Controls: Sandboxing &amp; Execution Hooks Feed
            </h3>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            PostgreSQL Audit Trail
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {tasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                    {task.agentType}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {task.intent}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={
                      task.status === 'COMPLETED'
                        ? { backgroundColor: 'var(--success-muted)', color: 'var(--success)', borderColor: 'var(--success-border)' }
                        : task.status === 'REQUIRES_APPROVAL'
                        ? { backgroundColor: 'var(--warning-muted)', color: 'var(--warning)', borderColor: 'var(--warning-border)' }
                        : { backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                    }
                  >
                    {task.status}
                  </span>
                </div>
                <div className="text-[11px] mt-1 font-mono truncate max-w-xl" style={{ color: 'var(--text-muted)' }}>
                  &ldquo;{task.userPrompt}&rdquo;
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                  <span>Sandboxed</span>
                </span>
                <span>{task.executionTimeMs}ms</span>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="py-6 text-center font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              No recent task logs. Ingest a transaction or query the AI assistant to view telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
