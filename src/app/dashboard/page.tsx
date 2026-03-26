'use client'

import { DollarSign, TrendingUp, Users, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const stats = [
  { label: 'Total Money In', value: 125340, change: 12.5, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Money Out', value: 89210, change: -3.2, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Donors', value: 342, change: 8.1, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Compliance Alerts', value: 2, change: 0, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const recentTransactions = [
  { id: 1, desc: 'Annual Gala Ticket Sales', amount: 15000, type: 'income', date: '2026-03-25', category: 'Events' },
  { id: 2, desc: 'Office Supplies', amount: -245.50, type: 'expense', date: '2026-03-24', category: 'Administration' },
  { id: 3, desc: 'Monthly Donation - Smith Foundation', amount: 5000, type: 'income', date: '2026-03-23', category: 'Donations' },
  { id: 4, desc: 'Program Supplies - Youth Workshop', amount: -890, type: 'expense', date: '2026-03-22', category: 'Programs' },
  { id: 5, desc: 'Online Fundraising Campaign', amount: 3200, type: 'income', date: '2026-03-21', category: 'Campaigns' },
]

const complianceAlerts = [
  { title: 'State Annual Report Due', due: 'April 15, 2026', priority: 'high', action: 'File Now' },
  { title: 'Charitable Solicitation Renewal', due: 'May 1, 2026', priority: 'medium', action: 'Start Renewal' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Welcome back!</h1>
        <p className="text-gray-500">Here&apos;s what&apos;s happening with your nonprofit today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.change !== 0 && (
                <span className={`flex items-center text-sm font-medium ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-brand-800 mt-3">
              {typeof stat.value === 'number' && stat.value > 999 ? formatCurrency(stat.value) : stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-brand-800 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{tx.desc}</p>
                  <p className="text-sm text-gray-500">{tx.category} &middot; {tx.date}</p>
                </div>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="card">
          <h2 className="text-lg font-bold text-brand-800 mb-4">Compliance Alerts</h2>
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.title} className={`p-3 rounded-lg border ${alert.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs text-gray-500 mt-1">Due: {alert.due}</p>
                <button className="mt-2 text-xs font-semibold text-brand-500 hover:underline">
                  {alert.action} &rarr;
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-700">Compliance Health Score</p>
            <p className="text-3xl font-bold text-green-600 mt-1">85%</p>
            <p className="text-xs text-green-600 mt-1">2 items need attention</p>
          </div>
        </div>
      </div>
    </div>
  )
}
