import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import { HealthCheckResponse } from './dto/health-response.dto.js';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async check(): Promise<HealthCheckResponse> {
    const dbHealth = await this.prisma.checkHealth();
    const memory = process.memoryUsage();

    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const environment = this.configService.get<string>('nodeEnv') || process.env.NODE_ENV || 'development';

    return {
      status: dbHealth.status === 'connected' ? 'ok' : 'degraded',
      service: 'autonomous-business-finance-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment,
      database: dbHealth,
      system: {
        memoryUsageMb: {
          rss: Math.round(memory.rss / 1024 / 1024),
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
    };
  }
}
