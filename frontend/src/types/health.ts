export interface DatabaseHealth {
  status: 'connected' | 'disconnected';
  latencyMs?: number;
  error?: string;
}

export interface SystemHealth {
  memoryUsageMb: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
  nodeVersion: string;
  platform: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  database: DatabaseHealth;
  system: SystemHealth;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  timestamp?: string;
}
