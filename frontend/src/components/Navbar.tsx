import React from 'react';
import { ShieldCheck, Activity, Terminal } from 'lucide-react';

interface NavbarProps {
  isBackendOnline: boolean;
  environment?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendOnline, environment = 'development' }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-white tracking-tight">
                Autonomous Business Finance
              </span>
              <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Phase 1
              </span>
            </div>
            <p className="text-xs text-slate-400">Core Architecture & Development Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Env: {environment}</span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              isBackendOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <Activity className="w-3.5 h-3.5" />
            <span>{isBackendOnline ? 'Backend Online' : 'Backend Unreachable'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
