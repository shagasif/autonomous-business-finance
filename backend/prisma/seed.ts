import { PrismaClient, AccountType, TransactionType, TransactionStatus, BudgetPeriod, BudgetStatus, InvoiceType, InvoiceStatus, AnomalySeverity, AnomalyStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Autonomous Business Finance Platform...');

  // 1. Clean existing records to ensure deterministic idempotent seeding
  await prisma.agentExecutionLog.deleteMany({});
  await prisma.agentTask.deleteMany({});
  await prisma.financialAnomaly.deleteMany({});
  await prisma.cashFlowForecast.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});

  // 2. Organization Baseline
  const org = await prisma.organization.create({
    data: {
      name: 'Apex Global Technologies Inc.',
      slug: 'apex-global-tech',
      currency: 'USD',
      industry: 'Enterprise B2B SaaS',
      fiscalYearStart: 1,
    },
  });

  console.log(`✓ Created Organization: ${org.name} (${org.id})`);

  // 3. User Accounts
  await prisma.user.createMany({
    data: [
      {
        organizationId: org.id,
        email: 'cfo@apextech.io',
        name: 'Sarah Sterling, CFO',
        role: 'FINANCE_ADMIN',
      },
      {
        organizationId: org.id,
        email: 'lead.analyst@apextech.io',
        name: 'David Vance, Lead Financial Analyst',
        role: 'ANALYST',
      },
    ],
  });

  // 4. Chart of Accounts
  const opAccount = await prisma.account.create({
    data: {
      organizationId: org.id,
      name: 'Operating Checking Account (Silicon Valley Bank)',
      code: '1010',
      type: AccountType.ASSET,
      balance: 482500.0,
      currency: 'USD',
      description: 'Primary liquidity account for operational payroll and AP',
      isSystem: true,
    },
  });

  const reserveAccount = await prisma.account.create({
    data: {
      organizationId: org.id,
      name: 'Treasury & Yield Reserve (Goldman Sachs)',
      code: '1020',
      type: AccountType.ASSET,
      balance: 1250000.0,
      currency: 'USD',
      description: 'High-yield treasury bill reserve maintaining 6+ months runway',
      isSystem: true,
    },
  });

  const arAccount = await prisma.account.create({
    data: {
      organizationId: org.id,
      name: 'Accounts Receivable',
      code: '1200',
      type: AccountType.ASSET,
      balance: 184500.0,
      currency: 'USD',
      description: 'Uncollected customer invoice receivables',
      isSystem: true,
    },
  });

  const apAccount = await prisma.account.create({
    data: {
      organizationId: org.id,
      name: 'Accounts Payable',
      code: '2010',
      type: AccountType.LIABILITY,
      balance: 78200.0,
      currency: 'USD',
      description: 'Outstanding vendor obligations and bills due',
      isSystem: true,
    },
  });

  // 5. Budgets across Departments for Current Fiscal Period
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const budgets = await Promise.all([
    prisma.budget.create({
      data: {
        organizationId: org.id,
        department: 'Engineering',
        category: 'Cloud Infrastructure & R&D',
        period: BudgetPeriod.MONTHLY,
        allocatedAmount: 110000.0,
        spentAmount: 107500.0,
        startDate: startOfMonth,
        endDate: endOfMonth,
        status: BudgetStatus.WARNING,
        notes: 'AWS cluster scaling increased spend; monitoring compute nodes',
      },
    }),
    prisma.budget.create({
      data: {
        organizationId: org.id,
        department: 'Marketing',
        category: 'Paid Acquisition & Events',
        period: BudgetPeriod.MONTHLY,
        allocatedAmount: 65000.0,
        spentAmount: 71200.0,
        startDate: startOfMonth,
        endDate: endOfMonth,
        status: BudgetStatus.EXCEEDED,
        notes: 'Exceeded budget due to Q4 SaaS Summit early registration sponsorships',
      },
    }),
    prisma.budget.create({
      data: {
        organizationId: org.id,
        department: 'Sales',
        category: 'Commissions & Travel',
        period: BudgetPeriod.MONTHLY,
        allocatedAmount: 50000.0,
        spentAmount: 41800.0,
        startDate: startOfMonth,
        endDate: endOfMonth,
        status: BudgetStatus.HEALTHY,
        notes: 'Healthy pacing within quota allocation',
      },
    }),
    prisma.budget.create({
      data: {
        organizationId: org.id,
        department: 'Operations & Facilities',
        category: 'SaaS Software & Office',
        period: BudgetPeriod.MONTHLY,
        allocatedAmount: 35000.0,
        spentAmount: 26400.0,
        startDate: startOfMonth,
        endDate: endOfMonth,
        status: BudgetStatus.HEALTHY,
        notes: 'Under budget following license consolidation audit',
      },
    }),
    prisma.budget.create({
      data: {
        organizationId: org.id,
        department: 'General & Administrative',
        category: 'Legal, Audit & Insurance',
        period: BudgetPeriod.MONTHLY,
        allocatedAmount: 25000.0,
        spentAmount: 22100.0,
        startDate: startOfMonth,
        endDate: endOfMonth,
        status: BudgetStatus.HEALTHY,
        notes: 'Annual SOC2 compliance audit reserve scheduled next quarter',
      },
    }),
  ]);

  console.log(`✓ Seeded ${budgets.length} Departmental Budgets`);

  // 6. Invoices (Accounts Receivable and Accounts Payable)
  const invoices = await Promise.all([
    // Receivables (Inbound Revenue)
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'INV-2026-081',
        type: InvoiceType.RECEIVABLE,
        counterparty: 'Acme Global Enterprises',
        amount: 48000.0,
        tax: 0.0,
        totalAmount: 48000.0,
        status: InvoiceStatus.PAID,
        issueDate: new Date(now.getTime() - 25 * 86400000),
        dueDate: new Date(now.getTime() - 5 * 86400000),
        paidDate: new Date(now.getTime() - 7 * 86400000),
        items: [{ description: 'Enterprise Platform Annual Tier', qty: 1, unitPrice: 48000.0 }],
        notes: 'Wire transfer confirmed via SVB',
      },
    }),
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'INV-2026-089',
        type: InvoiceType.RECEIVABLE,
        counterparty: 'Cyberdyne Systems Corp',
        amount: 62500.0,
        tax: 0.0,
        totalAmount: 62500.0,
        status: InvoiceStatus.PENDING,
        issueDate: new Date(now.getTime() - 10 * 86400000),
        dueDate: new Date(now.getTime() + 10 * 86400000),
        items: [{ description: 'Q4 Dedicated Multi-Tenant Infrastructure', qty: 1, unitPrice: 62500.0 }],
        notes: 'Expected via ACH before month end',
      },
    }),
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'INV-2026-074',
        type: InvoiceType.RECEIVABLE,
        counterparty: 'Stark Logistics LLC',
        amount: 34000.0,
        tax: 0.0,
        totalAmount: 34000.0,
        status: InvoiceStatus.OVERDUE,
        issueDate: new Date(now.getTime() - 45 * 86400000),
        dueDate: new Date(now.getTime() - 15 * 86400000),
        items: [{ description: 'Custom Integration & Enterprise License', qty: 1, unitPrice: 34000.0 }],
        notes: 'Payment overdue by 15 days; Cash Flow Agent flagged for collection reminder',
      },
    }),
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'INV-2026-092',
        type: InvoiceType.RECEIVABLE,
        counterparty: 'OmniCorp Dynamics',
        amount: 40000.0,
        tax: 0.0,
        totalAmount: 40000.0,
        status: InvoiceStatus.PENDING,
        issueDate: new Date(now.getTime() - 2 * 86400000),
        dueDate: new Date(now.getTime() + 28 * 86400000),
        items: [{ description: 'Autonomous Business AI Expansion Seats', qty: 40, unitPrice: 1000.0 }],
      },
    }),

    // Payables (Outbound Bills)
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'BILL-AWS-9182',
        type: InvoiceType.PAYABLE,
        counterparty: 'Amazon Web Services',
        amount: 28400.0,
        tax: 0.0,
        totalAmount: 28400.0,
        status: InvoiceStatus.PENDING,
        issueDate: new Date(now.getTime() - 5 * 86400000),
        dueDate: new Date(now.getTime() + 8 * 86400000),
        items: [{ description: 'EC2, RDS PostgreSQL, CloudFront, EKS', qty: 1, unitPrice: 28400.0 }],
      },
    }),
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'BILL-GCP-4421',
        type: InvoiceType.PAYABLE,
        counterparty: 'Google Cloud Platform',
        amount: 8600.0,
        tax: 0.0,
        totalAmount: 8600.0,
        status: InvoiceStatus.PENDING,
        issueDate: new Date(now.getTime() - 3 * 86400000),
        dueDate: new Date(now.getTime() + 12 * 86400000),
        items: [{ description: 'BigQuery Analytics and Cloud Storage', qty: 1, unitPrice: 8600.0 }],
      },
    }),
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'BILL-SLACK-102',
        type: InvoiceType.PAYABLE,
        counterparty: 'Slack Technologies',
        amount: 3200.0,
        tax: 0.0,
        totalAmount: 3200.0,
        status: InvoiceStatus.PAID,
        issueDate: new Date(now.getTime() - 18 * 86400000),
        dueDate: new Date(now.getTime() - 2 * 86400000),
        paidDate: new Date(now.getTime() - 4 * 86400000),
        items: [{ description: 'Enterprise Grid Subscription', qty: 1, unitPrice: 3200.0 }],
      },
    }),
    prisma.invoice.create({
      data: {
        organizationId: org.id,
        invoiceNumber: 'BILL-DATADOG-88',
        type: InvoiceType.PAYABLE,
        counterparty: 'Datadog Inc.',
        amount: 4800.0,
        tax: 0.0,
        totalAmount: 4800.0,
        status: InvoiceStatus.PENDING,
        issueDate: new Date(now.getTime() - 4 * 86400000),
        dueDate: new Date(now.getTime() + 5 * 86400000),
        items: [{ description: 'Infrastructure APM & Log Management', qty: 1, unitPrice: 4800.0 }],
      },
    }),
  ]);

  console.log(`✓ Seeded ${invoices.length} Invoices`);

  // 7. Realistic Financial Transactions (Historical + Recent)
  const transactionsData = [
    // Inbound Revenues
    {
      accountId: opAccount.id,
      amount: 48000.0,
      type: TransactionType.INCOME,
      category: 'Subscription Revenue',
      counterparty: 'Acme Global Enterprises',
      description: 'Annual Enterprise SaaS License Renewal',
      date: new Date(now.getTime() - 7 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 35000.0,
      type: TransactionType.INCOME,
      category: 'Subscription Revenue',
      counterparty: 'Pied Piper Tech',
      description: 'Monthly Cloud Platform API Usage',
      date: new Date(now.getTime() - 14 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 52000.0,
      type: TransactionType.INCOME,
      category: 'Professional Services',
      counterparty: 'Hooli Software Holdings',
      description: 'Custom Enterprise Implementation & Integration',
      date: new Date(now.getTime() - 22 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 42000.0,
      type: TransactionType.INCOME,
      category: 'Subscription Revenue',
      counterparty: 'Wayne Enterprises',
      description: 'Autonomous Finance SaaS Tier 3 Renewal',
      date: new Date(now.getTime() - 35 * 86400000),
      status: TransactionStatus.RECONCILED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 68000.0,
      type: TransactionType.INCOME,
      category: 'Subscription Revenue',
      counterparty: 'Massive Dynamic Inc',
      description: 'Multi-Tenant Autonomous Finance Platform Annual',
      date: new Date(now.getTime() - 50 * 86400000),
      status: TransactionStatus.RECONCILED,
      isSimulated: true,
      hasAnomaly: false,
    },

    // Operational Expenses & Payroll
    {
      accountId: opAccount.id,
      amount: 54000.0,
      type: TransactionType.EXPENSE,
      category: 'Payroll & Compensation',
      counterparty: 'Rippling Payroll Services',
      description: 'Bi-Weekly Engineering and Operations Payroll Run',
      date: new Date(now.getTime() - 4 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 53500.0,
      type: TransactionType.EXPENSE,
      category: 'Payroll & Compensation',
      counterparty: 'Rippling Payroll Services',
      description: 'Bi-Weekly Engineering and Operations Payroll Run',
      date: new Date(now.getTime() - 18 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 52800.0,
      type: TransactionType.EXPENSE,
      category: 'Payroll & Compensation',
      counterparty: 'Rippling Payroll Services',
      description: 'Bi-Weekly Engineering and Operations Payroll Run',
      date: new Date(now.getTime() - 32 * 86400000),
      status: TransactionStatus.RECONCILED,
      isSimulated: true,
      hasAnomaly: false,
    },

    // Cloud Infrastructure
    {
      accountId: opAccount.id,
      amount: 27100.0,
      type: TransactionType.EXPENSE,
      category: 'Cloud Infrastructure',
      counterparty: 'Amazon Web Services',
      description: 'Monthly AWS Compute, Kubernetes & S3 Storage',
      date: new Date(now.getTime() - 12 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 8400.0,
      type: TransactionType.EXPENSE,
      category: 'Cloud Infrastructure',
      counterparty: 'Google Cloud Platform',
      description: 'Monthly BigQuery & AI Model Inference Engine',
      date: new Date(now.getTime() - 16 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },

    // Marketing & Advertising
    {
      accountId: opAccount.id,
      amount: 22000.0,
      type: TransactionType.EXPENSE,
      category: 'Sales & Marketing',
      counterparty: 'Google Ads & Search Partners',
      description: 'Global Inbound Lead Generation Campaign',
      date: new Date(now.getTime() - 8 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 14500.0,
      type: TransactionType.EXPENSE,
      category: 'Sales & Marketing',
      counterparty: 'LinkedIn B2B Advertising',
      description: 'Targeted Enterprise Decision-Maker Campaign',
      date: new Date(now.getTime() - 15 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },

    // Software Subscriptions
    {
      accountId: opAccount.id,
      amount: 4200.0,
      type: TransactionType.EXPENSE,
      category: 'Software & Subscriptions',
      counterparty: 'GitHub Enterprise',
      description: 'Annual Copilot & Enterprise CI/CD Runners',
      date: new Date(now.getTime() - 20 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },
    {
      accountId: opAccount.id,
      amount: 3200.0,
      type: TransactionType.EXPENSE,
      category: 'Software & Subscriptions',
      counterparty: 'Slack Technologies',
      description: 'Monthly Workspace Enterprise Grid',
      date: new Date(now.getTime() - 4 * 86400000),
      status: TransactionStatus.CLEARED,
      isSimulated: true,
      hasAnomaly: false,
    },

    // -------------------------------------------------------------
    // REALISTIC ANOMALIES EMBEDDED FOR AGENT DETECTION
    // -------------------------------------------------------------
    {
      accountId: opAccount.id,
      amount: 14850.0,
      type: TransactionType.EXPENSE,
      category: 'Cloud Infrastructure',
      counterparty: 'Amazon Web Services (Unassigned US-West)',
      description: 'Unscheduled GPU Node Provisioning & Egress Spike',
      date: new Date(now.getTime() - 2 * 86400000),
      status: TransactionStatus.PENDING,
      isSimulated: true,
      hasAnomaly: true,
      metadata: { reason: '380% surge over historical median daily compute cost' },
    },
    {
      accountId: opAccount.id,
      amount: 9200.0,
      type: TransactionType.EXPENSE,
      category: 'Software & Subscriptions',
      counterparty: 'Unknown Offshore Vendor Pte',
      description: 'Recurring Enterprise License Seat Auto-Renewal',
      date: new Date(now.getTime() - 1 * 86400000),
      status: TransactionStatus.PENDING,
      isSimulated: true,
      hasAnomaly: true,
      metadata: { reason: 'Unrecognized counterparty with no existing PO or contract' },
    },
  ];

  const createdTransactions = [];
  for (const t of transactionsData) {
    const tx = await prisma.transaction.create({
      data: {
        organizationId: org.id,
        ...t,
      },
    });
    createdTransactions.push(tx);
  }

  console.log(`✓ Seeded ${createdTransactions.length} Financial Transactions`);

  // 8. Financial Anomaly Records (Pre-configured for Agent 2 and Orchestrator)
  const anomalyTx1 = createdTransactions.find(t => t.amount === 14850.0);
  const anomalyTx2 = createdTransactions.find(t => t.amount === 9200.0);

  if (anomalyTx1) {
    await prisma.financialAnomaly.create({
      data: {
        organizationId: org.id,
        transactionId: anomalyTx1.id,
        severity: AnomalySeverity.CRITICAL,
        category: 'Cloud Infrastructure',
        title: 'Unusual GPU Compute Spike (380% above baseline)',
        description: 'Sudden spike of $14,850 detected on unassigned AWS US-West compute cluster. Typical daily cloud compute cost is $900-$1,200.',
        expectedValue: 1100.0,
        actualValue: 14850.0,
        zScore: 4.82,
        status: AnomalyStatus.DETECTED,
        detectedBy: 'Expense Management Agent',
      },
    });
  }

  if (anomalyTx2) {
    await prisma.financialAnomaly.create({
      data: {
        organizationId: org.id,
        transactionId: anomalyTx2.id,
        severity: AnomalySeverity.HIGH,
        category: 'Software & Subscriptions',
        title: 'Unverified Vendor Charge ($9,200)',
        description: 'Debit from "Unknown Offshore Vendor Pte" lacks matching purchase order or authorization. Human CFO review recommended.',
        expectedValue: 0.0,
        actualValue: 9200.0,
        zScore: 3.65,
        status: AnomalyStatus.DETECTED,
        detectedBy: 'Expense Management Agent',
      },
    });
  }

  console.log('✓ Seeded Financial Anomalies');

  // 9. Initial Cash Flow Forecast (30, 60, 90 Days)
  await prisma.cashFlowForecast.createMany({
    data: [
      {
        organizationId: org.id,
        periodDays: 30,
        projectedInflow: 185000.0,
        projectedOutflow: 138000.0,
        netCashFlow: 47000.0,
        closingCashBalance: 529500.0,
        projectedRunwayMonths: 14.8,
        confidenceScore: 0.92,
        breakdown: {
          scheduledReceivables: 136500.0,
          expectedRenewals: 48500.0,
          fixedPayroll: 108000.0,
          cloudAndSaas: 30000.0,
        },
        riskFactors: [
          'Stark Logistics invoice INV-2026-074 is overdue by 15 days ($34,000)',
          'Marketing budget is trending 9.5% above monthly allocation',
        ],
      },
      {
        organizationId: org.id,
        periodDays: 60,
        projectedInflow: 360000.0,
        projectedOutflow: 275000.0,
        netCashFlow: 85000.0,
        closingCashBalance: 567500.0,
        projectedRunwayMonths: 15.6,
        confidenceScore: 0.86,
        breakdown: {
          q4ExpansionRevenue: 240000.0,
          regularSaaSSubscriptions: 120000.0,
          payrollAndHeadcount: 216000.0,
          vendorPayables: 59000.0,
        },
        riskFactors: [
          'Anticipated Q4 hiring could increase monthly payroll burn by $18,000/mo',
        ],
      },
      {
        organizationId: org.id,
        periodDays: 90,
        projectedInflow: 545000.0,
        projectedOutflow: 412000.0,
        netCashFlow: 133000.0,
        closingCashBalance: 615500.0,
        projectedRunwayMonths: 16.4,
        confidenceScore: 0.81,
        breakdown: {
          enterpriseAnnualRenewals: 380000.0,
          servicesRevenue: 165000.0,
          totalOperationalBurn: 412000.0,
        },
        riskFactors: ['Macro SaaS churn volatility buffer modeled at 4.5%'],
      },
    ],
  });

  console.log('✓ Seeded Cash Flow Forecasts');

  // 10. Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org.id,
        action: 'PLATFORM_INITIALIZATION',
        entityType: 'Organization',
        entityId: org.id,
        actor: 'SYSTEM',
        details: { message: 'Autonomous Business Finance system initialized with multi-agent architecture' },
      },
      {
        organizationId: org.id,
        action: 'CHART_OF_ACCOUNTS_VERIFIED',
        entityType: 'Account',
        entityId: opAccount.id,
        actor: 'SYSTEM',
        details: { verifiedBalance: 482500.0, currency: 'USD' },
      },
      {
        organizationId: org.id,
        action: 'ANOMALY_DETECTED',
        entityType: 'FinancialAnomaly',
        actor: 'Expense Management Agent',
        details: { severity: 'CRITICAL', title: 'Unusual GPU Compute Spike (380% above baseline)' },
      },
    ],
  });

  console.log('✓ Seeded Audit Logs');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
