import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { HealthCheckResponse } from './dto/health-response.dto.js';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: HealthService;

  const mockResponse: HealthCheckResponse = {
    status: 'ok',
    service: 'autonomous-business-finance-api',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: 42,
    environment: 'test',
    database: {
      status: 'connected',
      latencyMs: 3,
    },
    system: {
      memoryUsageMb: { rss: 120, heapTotal: 80, heapUsed: 50 },
      nodeVersion: 'v24.20.0',
      platform: 'win32',
    },
  };

  beforeEach(() => {
    healthService = {
      check: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as HealthService;
    healthController = new HealthController(healthService);
  });

  it('should return health check response payload', async () => {
    const result = await healthController.getHealth();
    expect(result).toEqual(mockResponse);
    expect(result.status).toBe('ok');
    expect(result.service).toBe('autonomous-business-finance-api');
    expect(result.database.status).toBe('connected');
  });
});
