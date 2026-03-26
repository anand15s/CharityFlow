'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Download, Upload } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockTransactions = [
  { id: '1', date: '2026-03-25', description: 'Annual Gala Ticket Sales', amount: 15000, type: 'income', category: 'Events', fund: 'Unrestricted' },
  { id: '2', date: '2026-03-24', description: 'Office Supplies - Staples', amount: -245.50, type: 'expense', category: 'Administration', fund: 'Unrestricted' },
  { id: '3', date: '2026-03-23', description: 'Smith Foundation Grant', amount: 25000, type: 'income', category: 'Grants', fund: 'Youth Programs' },
  { id: '4', date: '2026-03-22', description: 'Program Materials', amount: -890, type: 'expense', category: 'Programs', fund: 'Youth Programs' },
  { id: '5', date: '2026-03-21', description: 'Online Donations', amount: 3200, type: 'income', category: 'Donations', fund: 'Unrestricted' },
  { id: '6', date: '2026-03-20', description: 'Rent Payment', amount: -2500, type: 'expense', category: 'Facilities', fund: 'Unrestricted' },
  { id: '7', date: '2026-03-19', description: 'Corporate Sponsorship - Acme', amount: 10000, type: 'income', category: 'Sponsorships', fund: 'Gala 2026' },
  { id: '8', date: '2026-03-18', description: 'Insurance Premium', amount: -450, type: 'expense', category: 'Administration', fund: 'Unrestricted' },
]

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = mockTransactions.filter(tx => {
    if (filter === 'income') return tx.amount > 0
    if (filter === 'expense') return tx.amount < 0
    return true
  }).filter(tx => tx.description.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Money Tracker</h1>
          <p className="text-gray-500">Track every dollar in and out. We handle the accounting.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" /> Import</button>
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Transaction</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-gray-500">Money Coming In (March)</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(53200)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">Money Going Out (March)</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(4085.50)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500">What We Have Left</p>
          <p className="text-2xl font-bold text-brand-500">{formatCurrency(49114.50)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder="Search transactions..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-48" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Transactions</option>
          <option value="income">Money Coming In</option>
          <option value="expense">Money Going Out</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Description</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Category</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Fund</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.description}</td>
                <td className="px-6 py-4"><span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{tx.category}</span></td>
                <td className="px-6 py-4"><span className="text-xs bg-brand-50 text-brand-500 px-2 py-1 rounded-full">{tx.fund}</span></td>
                <td className={`px-6 py-4 text-sm font-semibold text-right ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
