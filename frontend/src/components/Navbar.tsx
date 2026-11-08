import React from 'react';
import { ShieldCheck, Activity, Terminal, Bot, AlertTriangle, Layers, Sun, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

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
    <header
      className="border-b sticky top-0 z-40 backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onTabChange('overview')}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'var(--btn-primary-bg)' }}
            >
              <ShieldCheck className="w-6 h-6" style={{ color: 'var(--text-on-accent)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Autonomous Finance
                </span>
                <span
                  className="hidden sm:inline-block text-[11px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold border"
                  style={{
                    backgroundColor: 'var(--accent-muted)',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent-border)',
                  }}
                >
                  Multi-Agent AI
                </span>
              </div>
              <p className="text-[11px] hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                Apex Global Technologies Inc.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Anomaly Badge */}
            {activeAnomaliesCount > 0 && (
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border"
                style={{
                  backgroundColor: 'var(--warning-muted)',
                  borderColor: 'var(--warning-border)',
                  color: 'var(--warning)',
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{activeAnomaliesCount} Anomalies Flagged</span>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border transition-colors cursor-pointer hover:border-[var(--border-hover)]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* AI Finance Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer"
              style={{
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </button>

            {/* Backend Connectivity Status */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: isBackendOnline ? 'var(--success-muted)' : 'var(--accent-muted)',
                color: isBackendOnline ? 'var(--success)' : 'var(--accent)',
                borderColor: isBackendOnline ? 'var(--success-border)' : 'var(--accent-border)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isBackendOnline ? 'var(--success)' : 'var(--accent)',
                  boxShadow: isBackendOnline ? '0 0 0 2px var(--success-muted)' : undefined,
                }}
              />
              <span className="hidden sm:inline">{isBackendOnline ? 'Live API' : 'Standalone Mode'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t text-xs"
          style={{ borderColor: 'var(--border)' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer border"
                style={
                  isActive
                    ? {
                        background: 'var(--accent-highlight)',
                        color: 'var(--accent)',
                        borderColor: 'var(--accent-border)',
                          boxShadow: 'inset 0 1px 0 var(--surface-edge)',
                        }
                    : {
                        color: 'var(--text-secondary)',
                        borderColor: 'transparent',
                      }
                }
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className="px-1.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
                  >
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
