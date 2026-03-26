'use client'
import { useState } from 'react'

type Transaction = {
  id: string; date: string; description: string; amount: number;
  category: string; type: 'in' | 'out'; fund: string; matched: boolean;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-03-26', description: 'Donation — Sarah Mitchell', amount: 500, category: 'Individual Donations', type: 'in', fund: 'Unrestricted', matched: true },
  { id: '2', date: '2026-03-25', description: 'Office Supplies — Staples', amount: 124, category: 'Office Expenses', type: 'out', fund: 'Unrestricted', matched: true },
  { id: '3', date: '2026-03-24', description: 'Spring Gala Ticket Sales', amount: 2400, category: 'Event Revenue', type: 'in', fund: 'Gala Fund', matched: false },
  { id: '4', date: '2026-03-23', description: 'Venue Deposit — Community Hall', amount: 800, category: 'Event Expenses', type: 'out', fund: 'Gala Fund', matched: true },
  { id: '5', date: '2026-03-22', description: 'Monthly Grant — United Way', amount: 5000, category: 'Grants', type: 'in', fund: 'Youth Program', matched: true },
  { id: '6', date: '2026-03-21', description: 'Staff Payroll', amount: 3200, category: 'Personnel', type: 'out', fund: 'Unrestricted', matched: true },
]

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const filtered = filter === 'all' ? mockTransactions : mockTransactions.filter(t => t.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">💳 Money Tracker</h1>
          <p className="text-gray-500 text-sm">Every penny tracked, categorized, and audit-ready</p>
        </div>
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition">
          + Add Transaction
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'in', 'out'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f === 'all' ? 'All' : f === 'in' ? '↓ Money In' : '↑ Money Out'}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Money Category</th>
              <th className="px-6 py-3">Fund</th>
              <th className="px-6 py-3">Bank Match</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                <td className="px-6 py-4 text-sm font-medium">{txn.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{txn.category}</td>
                <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-brand-light text-brand-primary">{txn.fund}</span></td>
                <td className="px-6 py-4">{txn.matched ? <span className="text-green-500">✓ Matched</span> : <span className="text-yellow-500">⏳ Pending</span>}</td>
                <td className={`px-6 py-4 text-sm font-semibold text-right ${txn.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type === 'in' ? '+' : '-'}${txn.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
