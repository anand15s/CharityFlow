'use client'

import { FileText, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react'

const filings = [
  { year: 2025, type: '990-EZ', status: 'filed', filedDate: '2026-02-15', dueDate: '2026-05-15' },
  { year: 2024, type: '990-EZ', status: 'filed', filedDate: '2025-04-10', dueDate: '2025-05-15' },
  { year: 2023, type: '990-N', status: 'filed', filedDate: '2024-03-20', dueDate: '2024-05-15' },
]

const steps = [
  { step: 1, title: 'We Pick Your Form', desc: 'Based on your budget, we auto-select 990-N, 990-EZ, or full 990.', status: 'complete' },
  { step: 2, title: 'Auto-Fill From Your Data', desc: 'Every transaction you tracked flows into the right form fields.', status: 'complete' },
  { step: 3, title: 'Review in Plain Language', desc: 'We show you what each section means — no jargon.', status: 'current' },
  { step: 4, title: 'One-Click File', desc: 'Submit directly to the IRS. We handle the e-filing.', status: 'pending' },
]

export default function Form990Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Annual Tax Report</h1>
        <p className="text-gray-500">Automated Form 990 generation and filing. We do the hard part.</p>
      </div>

      {/* Current Filing Progress */}
      <div className="card">
        <h2 className="text-lg font-bold text-brand-800 mb-2">Tax Year 2025 — In Progress</h2>
        <p className="text-sm text-gray-500 mb-6">Form 990-EZ &middot; Due May 15, 2026</p>
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.step} className="flex-1 relative">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${s.status === 'complete' ? 'bg-green-500 text-white' : s.status === 'current' ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s.status === 'complete' ? '\u2713' : s.step}
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-1 ${s.status === 'complete' ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-6">Continue Review</button>
      </div>

      {/* Filing History */}
      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b"><h2 className="font-bold text-brand-800">Filing History</h2></div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Tax Year</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Form Type</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Filed Date</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filings.map(f => (
              <tr key={f.year} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{f.year}</td>
                <td className="px-6 py-4"><span className="bg-brand-50 text-brand-500 px-2 py-1 rounded text-sm">{f.type}</span></td>
                <td className="px-6 py-4"><span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Filed</span></td>
                <td className="px-6 py-4 text-sm text-gray-600">{f.filedDate}</td>
                <td className="px-6 py-4 text-center"><button className="text-brand-500 hover:text-brand-700"><Download className="w-4 h-4 inline" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
