import React from 'react';
import { ShieldCheck, Activity, Terminal, Bot, AlertTriangle, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ActiveTab = 'overview' | 'agents' | 'cashflow' | 'budgets' | 'invoices' | 'approvals' | 'reports';

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isBackendOnline: boolean;
  pendingApprovalsCount: number;
  activeAnomaliesCount: number;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isBackendOnline,
  pendingApprovalsCount,
  activeAnomaliesCount,
  onOpenAssistant,
}) => {
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Financial Overview', icon: Layers },
    { id: 'agents', label: 'Autonomous Agents', icon: Bot },
    { id: 'cashflow', label: 'Cash Flow & Runway', icon: Activity },
    { id: 'budgets', label: 'Budgets & Spend', icon: Terminal },
    { id: 'invoices', label: 'Invoices & AP/AR', icon: Layers },
    {
      id: 'approvals',
      label: 'Security & Approvals',
      icon: ShieldCheck,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { id: 'reports', label: 'Audited Reports', icon: Terminal },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">
                  Autonomous Finance
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Multi-Agent AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Apex Global Technologies Inc.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Anomaly Badge */}
            {activeAnomaliesCount > 0 && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{activeAnomaliesCount} Anomalies Flagged</span>
              </div>
            )}

            {/* AI Finance Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>Ask AI Assistant</span>
            </button>

            {/* Backend Connectivity Status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
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
              <span className="hidden sm:inline">{isBackendOnline ? 'Live API' : 'API Offline'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/60 text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
