import React, { useState } from 'react';
import { FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Invoice } from '../types/finance';

interface Props {
  invoices: Invoice[];
  currency?: string;
}

export const InvoicesSection: React.FC<Props> = ({ invoices, currency = 'USD' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'RECEIVABLE' | 'PAYABLE'>('RECEIVABLE');

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

  const receivables = invoices.filter((inv) => inv.type === 'RECEIVABLE');
  const payables = invoices.filter((inv) => inv.type === 'PAYABLE');
  const currentList = activeSubTab === 'RECEIVABLE' ? receivables : payables;
  const totalReceivables = receivables.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPayables = payables.reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span>Accounts Payable &amp; Accounts Receivable Ledger</span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Tracking invoice aging schedules, DSO metrics, and vendor commitments
          </p>
        </div>

        {/* Subtabs for AR vs AP */}
        <div
          className="flex items-center border p-1 rounded-xl self-start sm:self-auto"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <button
            onClick={() => setActiveSubTab('RECEIVABLE')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border"
            style={
              activeSubTab === 'RECEIVABLE'
                ? {
                    backgroundColor: 'var(--accent-muted)',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent-border)',
                  }
                : {
                    color: 'var(--text-muted)',
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                  }
            }
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receivables ({formatCurrency(totalReceivables)})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('PAYABLE')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border"
            style={
              activeSubTab === 'PAYABLE'
                ? {
                    backgroundColor: 'var(--accent-muted)',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent-border)',
                  }
                : {
                    color: 'var(--text-muted)',
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                  }
            }
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Payables ({formatCurrency(totalPayables)})</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="border-b font-mono uppercase text-[11px]"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((inv) => {
                let badgeStyle: React.CSSProperties = {
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                };
                if (inv.status === 'PAID')
                  badgeStyle = {
                    backgroundColor: 'var(--success-muted)',
                    color: 'var(--success)',
                    border: '1px solid var(--success-border)',
                  };
                if (inv.status === 'PENDING')
                  badgeStyle = {
                    backgroundColor: 'var(--info-muted)',
                    color: 'var(--info)',
                    border: '1px solid var(--info-border)',
                  };
                if (inv.status === 'OVERDUE')
                  badgeStyle = {
                    backgroundColor: 'var(--danger-muted)',
                    color: 'var(--danger)',
                    border: '1px solid var(--danger-border)',
                    fontWeight: 700,
                  };

                return (
                  <tr
                    key={inv.id}
                    className="border-b transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {inv.counterparty}
                      </div>
                      {inv.notes && (
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {inv.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {new Date(inv.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase"
                        style={badgeStyle}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(inv.totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
