import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { TransactionType, TransactionStatus, InvoiceType, InvoiceStatus } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  counterparty!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsBoolean()
  @IsOptional()
  isSimulated?: boolean;
}

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber!: string;

  @IsEnum(InvoiceType)
  type!: InvoiceType;

  @IsString()
  counterparty!: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsString()
  dueDate!: string;

  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateAnomalyStatusDto {
  @IsString()
  status!: 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_POSITIVE';

  @IsString()
  @IsOptional()
  resolutionNote?: string;
}

export interface FinancialOverviewDto {
  metrics: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    netMarginPercent: number;
    cashBalance: number;
    monthlyBurnRate: number;
    runwayMonths: number;
    accountsReceivableTotal: number;
    accountsPayableTotal: number;
    overdueInvoicesCount: number;
    activeAnomaliesCount: number;
  };
  organization: {
    id: string;
    name: string;
    currency: string;
  };
  period: string;
}
