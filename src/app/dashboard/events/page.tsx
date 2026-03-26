'use client'

import { Plus, MapPin, Calendar, DollarSign, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const events = [
  { id: '1', name: 'Annual Spring Gala', date: '2026-04-20', venue: 'Riverside Community Center', budget: 15000, revenue: 32000, attendees: 250, status: 'planning' },
  { id: '2', name: 'Youth Workshop Series', date: '2026-05-10', venue: 'City Library - Main Branch', budget: 2500, revenue: 0, attendees: 45, status: 'planning' },
  { id: '3', name: 'Community Food Drive', date: '2026-03-15', venue: 'Downtown Park', budget: 800, revenue: 5200, attendees: 120, status: 'completed' },
]

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Event Success Engine</h1>
          <p className="text-gray-500">Plan events, find venues, track ROI — powered by your location.</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Plan New Event</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(evt => (
          <div key={evt.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${evt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {evt.status === 'completed' ? 'Completed' : 'Planning'}
              </span>
              {evt.status === 'completed' && evt.revenue > evt.budget && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-semibold">
                  +{formatCurrency(evt.revenue - evt.budget)} ROI
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-brand-800 mb-3">{evt.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {evt.date}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {evt.venue}</p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {evt.attendees} attendees</p>
              <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Budget: {formatCurrency(evt.budget)}</p>
            </div>
            <button className="btn-secondary w-full mt-4 text-sm">
              {evt.status === 'completed' ? 'View Report' : 'Manage Event'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
