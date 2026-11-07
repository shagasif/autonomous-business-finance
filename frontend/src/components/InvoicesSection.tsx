import React, { useState } from 'react';
import { FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Invoice } from '../types/finance';

interface Props {
  invoices: Invoice[];
  currency?: string;
}

export const InvoicesSection: React.FC<Props> = ({ invoices, currency = 'USD' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'RECEIVABLE' | 'PAYABLE'>('RECEIVABLE');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const receivables = invoices.filter((inv) => inv.type === 'RECEIVABLE');
  const payables = invoices.filter((inv) => inv.type === 'PAYABLE');

  const currentList = activeSubTab === 'RECEIVABLE' ? receivables : payables;

  const totalReceivables = receivables.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPayables = payables.reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-xl">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Accounts Payable &amp; Accounts Receivable Ledger</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking invoice aging schedules, DSO metrics, and vendor commitments
          </p>
        </div>

        {/* Subtabs for AR vs AP */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('RECEIVABLE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'RECEIVABLE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receivables ({formatCurrency(totalReceivables)})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('PAYABLE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'PAYABLE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Payables ({formatCurrency(totalPayables)})</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentList.map((inv) => {
                let badgeClass = 'bg-slate-800 text-slate-400';
                if (inv.status === 'PAID') badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                if (inv.status === 'PENDING') badgeClass = 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30';
                if (inv.status === 'OVERDUE') badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold';

                return (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{inv.counterparty}</div>
                      {inv.notes && <div className="text-[11px] text-slate-400 mt-0.5">{inv.notes}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${badgeClass}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-white">
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
