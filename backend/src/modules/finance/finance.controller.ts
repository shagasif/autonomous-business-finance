import { Controller, Get, Post, Patch, Body, Query, Param } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { CreateTransactionDto, UpdateAnomalyStatusDto } from './dto/finance.dto.js';
import { TransactionType, AnomalyStatus } from '@prisma/client';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('overview')
  async getOverview() {
    return this.financeService.getOverview();
  }

  @Get('transactions')
  async getTransactions(
    @Query('category') category?: string,
    @Query('type') type?: TransactionType,
    @Query('hasAnomaly') hasAnomaly?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.getTransactions({
      category,
      type,
      hasAnomaly: hasAnomaly !== undefined ? hasAnomaly === 'true' : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post('transactions')
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.financeService.createTransaction(dto);
  }

  @Get('budgets')
  async getBudgets() {
    return this.financeService.getBudgets();
  }

  @Get('invoices')
  async getInvoices(@Query('type') type?: 'RECEIVABLE' | 'PAYABLE') {
    return this.financeService.getInvoices(type);
  }

  @Get('anomalies')
  async getAnomalies(@Query('status') status?: AnomalyStatus) {
    return this.financeService.getAnomalies(status);
  }

  @Patch('anomalies/:id')
  async updateAnomalyStatus(@Param('id') id: string, @Body() dto: UpdateAnomalyStatusDto) {
    return this.financeService.updateAnomalyStatus(id, dto);
  }

  @Get('cash-flow/forecast')
  async getCashFlowForecasts() {
    return this.financeService.getCashFlowForecasts();
  }

  @Get('reports')
  async getReports() {
    return this.financeService.getReports();
  }

  @Post('simulate-anomaly')
  async simulateAnomalyDemo() {
    return this.financeService.simulateAnomalyDemo();
  }
}
