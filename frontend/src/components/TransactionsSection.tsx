import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle2, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Transaction } from '../types/finance';

interface Props {
  transactions: Transaction[];
  currency?: string;
  onAddTransaction: (tx: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    counterparty: string;
    description: string;
  }) => Promise<void>;
  isCreating: boolean;
}

export const TransactionsSection: React.FC<Props> = ({ transactions, currency = 'USD', onAddTransaction, isCreating }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [counterparty, setCounterparty] = useState('');
  const [description, setDescription] = useState('');

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amt);

  const categories = ['ALL', ...Array.from(new Set(transactions.map((t) => t.category)))];

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.counterparty.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    await onAddTransaction({ amount: parsedAmount, type, counterparty, description });
    setAmount('');
    setCounterparty('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>
            <span>Centralized Real-Time Financial Transactions</span>
            <span
              className="text-xs font-mono uppercase border px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}
            >
              {transactions.length} Records
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Autonomous ingestion layer with automated classification &amp; anomaly scanning
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
          style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl p-3 border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search counterparty, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg pl-9 pr-3 py-1.5 text-xs border focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-xs border focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
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
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Counterparty &amp; Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-primary)' }}>
              {filtered.map((t) => {
                const isIncome = t.type === 'INCOME';
                return (
                  <tr
                    key={t.id}
                    className="border-b transition-colors hover:bg-[var(--bg-hover)]"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: t.hasAnomaly ? 'var(--warning-muted)' : undefined,
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            backgroundColor: isIncome ? 'var(--success-muted)' : 'var(--danger-muted)',
                            color: isIncome ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <span>{t.counterparty}</span>
                            {t.hasAnomaly && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 rounded text-[10px] font-mono font-bold border"
                                style={{
                                  backgroundColor: 'var(--warning-muted)',
                                  color: 'var(--warning)',
                                  borderColor: 'var(--warning-border)',
                                }}
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>ANOMALY</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {t.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                        <span>{t.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold whitespace-nowrap">
                      <span style={{ color: isIncome ? 'var(--success)' : 'var(--text-secondary)' }}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No transactions match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Ingestion Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--bg-overlay)' }}
        >
          <div
            className="rounded-2xl max-w-md w-full p-6 shadow-2xl border"
            style={{ backgroundColor: 'var(--bg-modal)', borderColor: 'var(--border)' }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Ingest Financial Transaction
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Autonomous engine will classify category and check for spending anomalies.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('INCOME')}
                    className="py-2 rounded-lg text-xs font-semibold border transition-colors"
                    style={
                      type === 'INCOME'
                        ? { backgroundColor: 'var(--success-muted)', borderColor: 'var(--success)', color: 'var(--success)' }
                        : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }
                    }
                  >
                    Income (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('EXPENSE')}
                    className="py-2 rounded-lg text-xs font-semibold border transition-colors"
                    style={
                      type === 'EXPENSE'
                        ? { backgroundColor: 'var(--danger-muted)', borderColor: 'var(--danger)', color: 'var(--danger)' }
                        : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }
                    }
                  >
                    Expense (-)
                  </button>
                </div>
              </div>

              {[
                { label: 'Amount ($ USD)', placeholder: 'e.g. 14500', value: amount, setter: setAmount, type: 'number' },
                { label: 'Counterparty (Vendor or Client)', placeholder: 'e.g. Amazon Web Services', value: counterparty, setter: setCounterparty, type: 'text' },
                { label: 'Description', placeholder: 'e.g. EC2 and RDS instances monthly compute', value: description, setter: setDescription, type: 'text' },
              ].map(({ label, placeholder, value, setter, type: inputType }) => (
                <div key={label}>
                  <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </label>
                  <input
                    type={inputType}
                    step={inputType === 'number' ? '0.01' : undefined}
                    required
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-xs border focus:outline-none font-mono"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                </div>
              ))}

              <div
                className="flex items-center justify-end gap-3 pt-3 border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-lg font-semibold text-xs disabled:opacity-50 cursor-pointer"
                  style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                >
                  {isCreating ? 'Processing Ingestion...' : 'Submit Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
