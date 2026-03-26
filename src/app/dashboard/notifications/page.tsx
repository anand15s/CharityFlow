'use client'

import { Bell, AlertTriangle, CheckCircle, Calendar, DollarSign, Users } from 'lucide-react'

const notifications = [
  { id: '1', type: 'compliance', title: 'State Annual Report due in 20 days', desc: 'California requires filing by April 15, 2026.', time: '2 hours ago', read: false, icon: AlertTriangle, color: 'text-red-500' },
  { id: '2', type: 'donation', title: 'New donation: $5,000 from Smith Foundation', desc: 'Auto-receipt sent. Tax acknowledgment generated.', time: '3 hours ago', read: false, icon: DollarSign, color: 'text-green-500' },
  { id: '3', type: 'meeting', title: 'Board meeting in 2 days', desc: 'Q1 Board Meeting scheduled for March 28.', time: '1 day ago', read: true, icon: Calendar, color: 'text-brand-500' },
  { id: '4', type: 'member', title: 'New member joined', desc: 'volunteer@org.com accepted your invitation as Viewer.', time: '3 days ago', read: true, icon: Users, color: 'text-purple-500' },
  { id: '5', type: 'compliance', title: 'Form 990 review ready', desc: 'Your 2025 Form 990-EZ is ready for review.', time: '5 days ago', read: true, icon: CheckCircle, color: 'text-green-500' },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Notifications</h1>
          <p className="text-gray-500">Smart alerts based on your role. Never miss a deadline.</p>
        </div>
        <button className="text-sm text-brand-500 hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`card flex items-start gap-4 ${!n.read ? 'border-l-4 border-l-brand-500 bg-brand-50/30' : ''}`}>
            <n.icon className={`w-5 h-5 mt-0.5 ${n.color}`} />
            <div className="flex-1">
              <h3 className={`font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{n.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 bg-brand-500 rounded-full mt-2" />}
          </div>
        ))}
      </div>
    </div>
  )
}
