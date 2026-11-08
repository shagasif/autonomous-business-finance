import React from 'react';
import { Layers, CheckCircle2, Lock, ArrowRight, ShieldCheck, Database, Code2 } from 'lucide-react';

export const ArchitectureOverview: React.FC = () => {
  const stack = [
    { name: 'React 19 + TypeScript', role: 'Frontend UI & View Layer', category: 'Frontend' },
    { name: 'Vite 8', role: 'Next-Gen Build & Fast Dev Server', category: 'Frontend' },
    { name: 'Tailwind CSS 3.4', role: 'Enterprise Responsive Styling', category: 'Frontend' },
    { name: 'NestJS 12 + TypeScript', role: 'Enterprise Modular REST Backend', category: 'Backend' },
    { name: 'Prisma ORM 6', role: 'Type-Safe Data Access Layer', category: 'Backend' },
    { name: 'PostgreSQL', role: 'Industrial Relational Database', category: 'Database' },
  ];

  const phases = [
    {
      id: 'Phase 1',
      title: 'Project Architecture & Environment',
      status: 'completed',
      description:
        'Dual-app scaffolding, Vite/React client, NestJS REST backend, Prisma ORM schema, environment variables, ESLint/Prettier, and health check diagnostics.',
    },
    {
      id: 'Phase 2',
      title: 'Financial Core & Data Models',
      status: 'pending',
      description:
        'Chart of accounts, general ledger, double-entry bookkeeping, multi-currency exchange, transaction auditing, and business entity scoping.',
    },
    {
      id: 'Phase 3',
      title: 'Autonomous Financial Agents',
      status: 'pending',
      description:
        'AI agents for invoice matching, payment reconciliation, cash flow anomaly detection, and autonomous ledger verification.',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tech Stack Card */}
      <div
        className="lg:col-span-1 rounded-2xl p-6 shadow-sm border flex flex-col justify-between"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div>
          <div
            className="flex items-center gap-2 font-semibold text-lg pb-4 border-b"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}
          >
            <Code2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Industrial Tech Stack</span>
          </div>

          <div className="mt-4 space-y-3">
            {stack.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl border flex items-center justify-between"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {item.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {item.role}
                  </div>
                </div>
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 pt-4 border-t flex items-center gap-2 text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span>Zero hardcoded secrets. Environment variable isolated.</span>
        </div>
      </div>

      {/* Roadmap & Architectural Scoping Card */}
      <div
        className="lg:col-span-2 rounded-2xl p-6 shadow-sm border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            <Layers className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Platform Lifecycle Roadmap</span>
          </div>
          <span
            className="text-xs font-mono border px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--accent-muted)',
              color: 'var(--accent)',
              borderColor: 'var(--accent-border)',
            }}
          >
            Phase 1 Scoped
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="p-4 rounded-xl border transition-all"
              style={
                phase.status === 'completed'
                  ? {
                      backgroundColor: 'var(--accent-muted)',
                      borderColor: 'var(--accent-border)',
                    }
                  : {
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                      opacity: 0.7,
                    }
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {phase.status === 'completed' ? (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-mono font-medium block" style={{ color: 'var(--accent)' }}>
                      {phase.id}
                    </span>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {phase.title}
                    </h3>
                  </div>
                </div>

                <span
                  className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full border"
                  style={
                    phase.status === 'completed'
                      ? {
                          backgroundColor: 'var(--accent-muted)',
                          color: 'var(--accent)',
                          borderColor: 'var(--accent-border)',
                        }
                      : {
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-muted)',
                          borderColor: 'var(--border)',
                        }
                  }
                >
                  {phase.status === 'completed' ? 'Active / Initialized' : 'Phase 2+'}
                </span>
              </div>
              <p className="text-xs mt-2.5 ml-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-6 pt-4 border-t flex items-center justify-between text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span>PostgreSQL Prisma schema &amp; migration pipeline ready</span>
          </div>
          <div className="flex items-center gap-1 font-mono" style={{ color: 'var(--accent)' }}>
            <span>Ready for Phase 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
