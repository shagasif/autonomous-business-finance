import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Prisma ORM successfully connected to PostgreSQL');
    } catch (error: unknown) {
      this.isConnected = false;
      const message = error instanceof Error ? error.message : 'Unknown database error';
      this.logger.warn(`PostgreSQL connection pending or unavailable: ${message}`);
      this.logger.warn('The platform server will run. Ensure PostgreSQL is started to run migrations and queries.');
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.logger.log('Prisma ORM disconnected from PostgreSQL');
    }
  }

  async checkHealth(): Promise<{ status: 'connected' | 'disconnected'; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      this.isConnected = true;
      return {
        status: 'connected',
        latencyMs: Date.now() - start,
      };
    } catch (error: unknown) {
      this.isConnected = false;
      return {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Database ping failed',
      };
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }
}
