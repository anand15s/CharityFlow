'use client'

import { MapPin, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react'

const complianceTasks = [
  { id: '1', title: 'File State Annual Report', due: '2026-04-15', status: 'upcoming', priority: 'high', state: 'California', category: 'Filing', action: 'File Now' },
  { id: '2', title: 'Renew Charitable Solicitation Registration', due: '2026-05-01', status: 'upcoming', priority: 'medium', state: 'California', category: 'Registration', action: 'Start Renewal' },
  { id: '3', title: 'Submit Form 990', due: '2026-05-15', status: 'in_progress', priority: 'high', state: 'Federal', category: 'Tax Filing', action: 'Continue' },
  { id: '4', title: 'Board Meeting Minutes - Q1', due: '2026-03-31', status: 'upcoming', priority: 'medium', state: 'Internal', category: 'Governance', action: 'Record Minutes' },
  { id: '5', title: 'Update Conflict of Interest Policies', due: '2026-06-30', status: 'not_started', priority: 'low', state: 'Federal', category: 'Governance', action: 'Review Policy' },
  { id: '6', title: 'Workers Comp Insurance Renewal', due: '2026-04-01', status: 'completed', priority: 'high', state: 'California', category: 'Insurance', action: 'View' },
]

const stateRequirements = [
  { state: 'California', items: 12, completed: 9 },
  { state: 'Federal', items: 8, completed: 5 },
  { state: 'Los Angeles County', items: 3, completed: 3 },
]

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Compliance Co-Pilot</h1>
        <p className="text-gray-500">Location-aware compliance tracking. We know your rules so you don&apos;t have to.</p>
      </div>

      {/* Location Banner */}
      <div className="card bg-brand-50 border-brand-200 flex items-center gap-4">
        <MapPin className="w-8 h-8 text-brand-500" />
        <div>
          <p className="font-semibold text-brand-800">Tracking compliance for: Los Angeles, CA</p>
          <p className="text-sm text-brand-600">Federal + California + Los Angeles County regulations auto-detected</p>
        </div>
      </div>

      {/* Health Score + Jurisdiction Progress */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center col-span-1">
          <p className="text-sm text-gray-500 mb-2">Compliance Health Score</p>
          <div className="w-24 h-24 mx-auto rounded-full border-8 border-green-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">85%</span>
          </div>
          <p className="text-xs text-green-600 mt-2">Good Standing</p>
        </div>
        {stateRequirements.map(sr => (
          <div key={sr.state} className="stat-card">
            <p className="text-sm font-semibold text-gray-700">{sr.state}</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(sr.completed / sr.items) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">{sr.completed}/{sr.items} complete</p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b"><h2 className="font-bold text-brand-800">Compliance Roadmap</h2></div>
        <div className="divide-y">
          {complianceTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                {task.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-500" /> : task.priority === 'high' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.state} &middot; {task.category} &middot; Due {task.due}</p>
                </div>
              </div>
              <button className={`text-sm font-semibold px-3 py-1 rounded-lg ${task.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-brand-500 bg-brand-50 hover:bg-brand-100'}`}>
                {task.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
