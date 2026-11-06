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
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-lg pb-4 border-b border-slate-800">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span>Industrial Tech Stack</span>
          </div>

          <div className="mt-4 space-y-3">
            {stack.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-slate-200">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.role}</div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero hardcoded secrets. Environment variable isolated.</span>
        </div>
      </div>

      {/* Roadmap & Architectural Scoping Card */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Platform Lifecycle Roadmap</span>
          </div>
          <span className="text-xs font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
            Phase 1 Scoped
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`p-4 rounded-xl border transition-all ${
                phase.status === 'completed'
                  ? 'bg-slate-800/50 border-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {phase.status === 'completed' ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-mono font-medium text-emerald-400 block">
                      {phase.id}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{phase.title}</h3>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    phase.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {phase.status === 'completed' ? 'Active / Initialized' : 'Phase 2+'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 ml-8 leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL Prisma schema & migration pipeline ready</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-emerald-400">
            <span>Ready for Phase 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
