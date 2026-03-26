'use client'

import { Plus, Search, Heart, TrendingUp, Mail } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const mockDonors = [
  { id: '1', name: 'Smith Foundation', email: 'grants@smithfdn.org', totalGiven: 75000, lastGift: '2026-03-23', tags: ['Major Donor', 'Grant'], streak: 3 },
  { id: '2', name: 'Jane Cooper', email: 'jane@example.com', totalGiven: 12500, lastGift: '2026-03-15', tags: ['Monthly'], streak: 12 },
  { id: '3', name: 'Acme Corp', email: 'csr@acme.com', totalGiven: 10000, lastGift: '2026-03-19', tags: ['Corporate', 'Sponsor'], streak: 1 },
  { id: '4', name: 'Robert Williams', email: 'rwilliams@email.com', totalGiven: 5200, lastGift: '2026-02-28', tags: ['Annual'], streak: 2 },
  { id: '5', name: 'Community First Bank', email: 'giving@cfbank.com', totalGiven: 25000, lastGift: '2026-01-15', tags: ['Corporate', 'Local'], streak: 5 },
]

const campaigns = [
  { name: 'Spring Fundraiser 2026', goal: 50000, raised: 32500, donors: 89, status: 'active' },
  { name: 'Youth Program Expansion', goal: 100000, raised: 67000, donors: 156, status: 'active' },
]

export default function DonorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Donor Hub</h1>
          <p className="text-gray-500">Track relationships, run campaigns, and maximize giving.</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Donor</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-sm text-gray-500">Total Donors</p><p className="text-2xl font-bold text-brand-800">342</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500">Total Raised (YTD)</p><p className="text-2xl font-bold text-green-600">{formatCurrency(127700)}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500">Avg Gift Size</p><p className="text-2xl font-bold text-brand-500">{formatCurrency(373)}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500">Donor Retention</p><p className="text-2xl font-bold text-purple-600">72%</p></div>
      </div>

      {/* Active Campaigns */}
      <div className="card">
        <h2 className="text-lg font-bold text-brand-800 mb-4">Active Campaigns</h2>
        <div className="grid grid-cols-2 gap-4">
          {campaigns.map(c => (
            <div key={c.name} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.donors} donors</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(c.raised / c.goal) * 100}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-brand-500">{formatCurrency(c.raised)}</span>
                <span className="text-gray-500">of {formatCurrency(c.goal)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donor Table */}
      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-brand-800">All Donors</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Search donors..." className="input-field pl-10 w-64" />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Donor</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Tags</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Total Given</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Last Gift</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockDonors.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{d.name}</p>
                  <p className="text-sm text-gray-500">{d.email}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">{d.tags.map(t => <span key={t} className="text-xs bg-brand-50 text-brand-500 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-green-600">{formatCurrency(d.totalGiven)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.lastGift}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-brand-500 hover:text-brand-700"><Mail className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
