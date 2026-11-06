import React, { useState } from 'react';
import { Database, Server, Clock, Cpu, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { HealthCheckResponse } from '../types/health';

interface HealthStatusCardProps {
  health: HealthCheckResponse | null;
  isLoading: boolean;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ health, isLoading }) => {
  const [showRawJson, setShowRawJson] = useState(false);

  if (isLoading && !health) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-slate-800/60 rounded-xl"></div>
          <div className="h-24 bg-slate-800/60 rounded-xl"></div>
          <div className="h-24 bg-slate-800/60 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!health) {
    return null;
  }

  const isDbConnected = health.database.status === 'connected';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white tracking-tight">System Health & API Diagnostics</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium ${
                health.status === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              Status: {health.status.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Endpoint: <code className="text-slate-300 font-mono">GET /api/health</code> | Response Time:{' '}
            <span className="text-emerald-400 font-mono">{new Date(health.timestamp).toLocaleTimeString()}</span>
          </p>
        </div>

        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="self-start sm:self-auto text-xs font-mono text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-1.5 transition-colors"
        >
          {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showRawJson ? 'Hide Payload' : 'View Raw Payload'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Backend API Service */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>NestJS REST API</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-white">{health.service}</div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">Version {health.version}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Uptime</span>
            <span className="font-mono text-slate-200">{health.uptimeSeconds}s</span>
          </div>
        </div>

        {/* Database Service */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
              <Database className={`w-4 h-4 ${isDbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>PostgreSQL & Prisma</span>
            </div>
            {isDbConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-white">
              {isDbConnected ? 'PostgreSQL Active' : 'Database Standby'}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              {isDbConnected ? `Latency: ${health.database.latencyMs}ms` : 'Awaiting PostgreSQL connection'}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Prisma Schema</span>
            <span className="font-mono text-slate-200">v6.19 (PostgreSQL)</span>
          </div>
        </div>

        {/* Node System Metrics */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Runtime Engine</span>
            </div>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-white">
              Node {health.system.nodeVersion}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              Platform: {health.system.platform}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Memory Heap</span>
            <span className="font-mono text-slate-200">
              {health.system.memoryUsageMb.heapUsed}MB / {health.system.memoryUsageMb.heapTotal}MB
            </span>
          </div>
        </div>
      </div>

      {/* Raw JSON Debug Viewer */}
      {showRawJson && (
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400 mb-2">Raw JSON Response:</div>
          <pre className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800/80 leading-relaxed">
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
