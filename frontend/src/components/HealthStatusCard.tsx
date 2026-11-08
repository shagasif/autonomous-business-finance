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
      <div
        className="rounded-2xl p-6 shadow-sm border animate-pulse"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="h-6 rounded w-1/3 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!health) return null;

  const isDbConnected = health.database.status === 'connected';

  return (
    <div
      className="rounded-2xl p-6 shadow-sm border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              System Health &amp; API Diagnostics
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border"
              style={
                health.status === 'ok'
                  ? {
                      backgroundColor: 'var(--success-muted)',
                      color: 'var(--success)',
                      borderColor: 'var(--success-border)',
                    }
                  : {
                      backgroundColor: 'var(--danger-muted)',
                      color: 'var(--danger)',
                      borderColor: 'var(--danger-border)',
                    }
              }
            >
              Status: {health.status.toUpperCase()}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Endpoint: <code style={{ color: 'var(--text-secondary)' }} className="font-mono">GET /api/health</code> | Response Time:{' '}
            <span className="font-mono" style={{ color: 'var(--accent)' }}>
              {new Date(health.timestamp).toLocaleTimeString()}
            </span>
          </p>
        </div>

        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="self-start sm:self-auto text-xs font-mono border flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
          style={{
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showRawJson ? 'Hide Payload' : 'View Raw Payload'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Backend API Service */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Server className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <span>NestJS REST API</span>
            </div>
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {health.service}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Version {health.version}
            </div>
          </div>
          <div
            className="mt-3 pt-3 border-t flex items-center justify-between text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <span>Uptime</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
              {health.uptimeSeconds}s
            </span>
          </div>
        </div>

        {/* Database Service */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Database
                className="w-4 h-4"
                style={{ color: isDbConnected ? 'var(--success)' : 'var(--danger)' }}
              />
              <span>PostgreSQL &amp; Prisma</span>
            </div>
            {isDbConnected ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {isDbConnected ? 'PostgreSQL Active' : 'Database Standby'}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isDbConnected ? `Latency: ${health.database.latencyMs}ms` : 'Awaiting PostgreSQL connection'}
            </div>
          </div>
          <div
            className="mt-3 pt-3 border-t flex items-center justify-between text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <span>Prisma Schema</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>v6.19 (PostgreSQL)</span>
          </div>
        </div>

        {/* Node System Metrics */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Cpu className="w-4 h-4 text-warning" />
              <span>Runtime Engine</span>
            </div>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Node {health.system.nodeVersion}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Platform: {health.system.platform}
            </div>
          </div>
          <div
            className="mt-3 pt-3 border-t flex items-center justify-between text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <span>Memory Heap</span>
            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
              {health.system.memoryUsageMb.heapUsed}MB / {health.system.memoryUsageMb.heapTotal}MB
            </span>
          </div>
        </div>
      </div>

      {/* Raw JSON Debug Viewer */}
      {showRawJson && (
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
            Raw JSON Response:
          </div>
          <pre
            className="p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--accent)',
              borderColor: 'var(--border)',
            }}
          >
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
