'use client'

import { Plus, FileText, Users, Vote, CheckCircle } from 'lucide-react'

const meetings = [
  { id: '1', title: 'Q1 Board Meeting', date: '2026-03-28', status: 'scheduled', attendees: 7, hasMinutes: false, votes: 0 },
  { id: '2', title: 'February Board Meeting', date: '2026-02-25', status: 'completed', attendees: 6, hasMinutes: true, votes: 3 },
  { id: '3', title: 'January Board Meeting', date: '2026-01-22', status: 'completed', attendees: 7, hasMinutes: true, votes: 2 },
  { id: '4', title: 'Annual Planning Session', date: '2025-12-15', status: 'completed', attendees: 8, hasMinutes: true, votes: 5 },
]

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Board Meetings</h1>
          <p className="text-gray-500">Schedule meetings, record minutes, manage votes, and share documents.</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Schedule Meeting</button>
      </div>

      <div className="space-y-4">
        {meetings.map(m => (
          <div key={m.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${m.status === 'completed' ? 'bg-green-50' : 'bg-brand-50'}`}>
                {m.status === 'completed' ? <CheckCircle className="w-6 h-6 text-green-500" /> : <FileText className="w-6 h-6 text-brand-500" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{m.title}</h3>
                <p className="text-sm text-gray-500">{m.date} &middot; {m.attendees} attendees</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {m.hasMinutes ? 'Minutes recorded' : 'No minutes'}</span>
                <span className="flex items-center gap-1"><Vote className="w-4 h-4" /> {m.votes} votes</span>
              </div>
              <button className="btn-secondary text-sm">
                {m.status === 'completed' ? 'View' : 'Start Meeting'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
