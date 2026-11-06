import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, ExternalLink, GitBranch, Shield, Zap } from 'lucide-react';
import { ApiClient } from './services/api';
import type { HealthCheckResponse, ApiError } from './types/health';
import { Navbar } from './components/Navbar';
import { HealthStatusCard } from './components/HealthStatusCard';
import { ArchitectureOverview } from './components/ArchitectureOverview';

export function App() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchStatus = useCallback(async (manual = false) => {
    if (manual) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await ApiClient.getHealth();
      setHealth(data);
      setError(null);
      setLastChecked(new Date());
    } catch (err: unknown) {
      setHealth(null);
      setError(err as ApiError);
      setLastChecked(new Date());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on component mount
    let active = true;

    ApiClient.getHealth()
      .then((data) => {
        if (active) {
          setHealth(data);
          setError(null);
          setLastChecked(new Date());
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setHealth(null);
          setError(err as ApiError);
          setLastChecked(new Date());
          setIsLoading(false);
        }
      });

    const interval = setInterval(() => {
      fetchStatus();
    }, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [fetchStatus]);

  const isOnline = health !== null && error === null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar isBackendOnline={isOnline} environment={health?.environment} />

      {/* Hero Banner Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Phase 1 Initialized — Industrial Baseline</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Autonomous Business Finance Platform
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
              Industrial-grade browser-based finance engineering foundation. Initialized with
              React, TypeScript, Vite, Tailwind CSS, NestJS REST API, and Prisma ORM with
              PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchStatus(true)}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600 text-sm font-medium transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
            </button>
            <a
              href="http://localhost:3001/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20"
            >
              <span>API Health Direct</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Backend Error Banner if Unreachable */}
        {error && (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-rose-300 text-sm">
                  Backend API Communication Offline ({error.statusCode ? `HTTP ${error.statusCode}` : 'Connection Refused'})
                </h2>
                <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                  {error.message}
                </p>
                <div className="mt-2 text-xs font-mono text-rose-300/90 bg-rose-950/40 px-2.5 py-1 rounded inline-block">
                  Run: <span className="text-white font-bold">cd backend &amp;&amp; npm run start:dev</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fetchStatus(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors flex-shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Live Diagnostics & Health Check */}
        <HealthStatusCard health={health} isLoading={isLoading} />

        {/* Platform Architecture & Scoping Overview */}
        <ArchitectureOverview />

        {/* Diagnostics & Setup Meta Footer */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-slate-500" />
              <span>Git Repository Configured</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Security &amp; Env Isolation</span>
            </span>
          </div>

          <div className="text-slate-500 font-mono">
            Last checked:{' '}
            <span className="text-slate-300">
              {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
