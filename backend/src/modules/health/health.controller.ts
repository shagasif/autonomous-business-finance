import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';
import { HealthCheckResponse } from './dto/health-response.dto.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth(): Promise<HealthCheckResponse> {
    return this.healthService.check();
  }
}
