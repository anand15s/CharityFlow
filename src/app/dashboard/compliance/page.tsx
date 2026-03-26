export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">🗺️ Compliance Co-Pilot</h1><p className="text-gray-500 text-sm">Local laws and deadlines personalized for your location</p></div>

      {/* Location Banner */}
      <div className="bg-brand-light rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Your Location</p>
          <p className="text-lg font-semibold">📍 California — Los Angeles County — City of Los Angeles</p>
          <p className="text-sm text-gray-500 mt-1">501(c)(3) Public Charity • Fiscal Year: Jan-Dec</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-green-600">87%</p>
          <p className="text-xs text-gray-500">Health Score</p>
        </div>
      </div>

      {/* Compliance Roadmap */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">📋 Your Compliance Roadmap</h3>
        <div className="space-y-4">
          {[
            { task: 'California Annual Report (Form SI-100)', due: 'Apr 1, 2026', status: 'due-soon', jurisdiction: 'State', category: 'Filing' },
            { task: 'LA County Business License Renewal', due: 'Jun 30, 2026', status: 'upcoming', jurisdiction: 'County', category: 'License' },
            { task: 'Charitable Solicitation Registration Renewal', due: 'Jul 15, 2026', status: 'upcoming', jurisdiction: 'State', category: 'Registration' },
            { task: 'IRS Form 990-EZ Filing', due: 'May 15, 2026', status: 'due-soon', jurisdiction: 'Federal', category: 'Tax' },
            { task: 'Workers Comp Insurance Renewal', due: 'Sep 1, 2026', status: 'on-track', jurisdiction: 'State', category: 'Insurance' },
            { task: 'Board Meeting Minutes — Q1', due: 'Mar 31, 2026', status: 'due-now', jurisdiction: 'Internal', category: 'Governance' },
          ].map((item) => (
            <div key={item.task} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-4">
                <span className={`w-3 h-3 rounded-full ${
                  item.status === 'due-now' ? 'bg-red-500 animate-pulse' : item.status === 'due-soon' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="font-medium text-sm">{item.task}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{item.jurisdiction}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{item.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{item.due}</p>
                <p className={`text-xs ${item.status === 'due-now' ? 'text-red-600 font-semibold' : item.status === 'due-soon' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {item.status === 'due-now' ? '⚠️ Due Now!' : item.status === 'due-soon' ? 'Due Soon' : '✓ On Track'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Law Updates */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">📰 Recent Law Updates (Auto-Detected)</h3>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="font-medium text-sm text-blue-800">California AB-1234: New Fundraising Disclosure Requirements</p>
            <p className="text-xs text-blue-600 mt-1">Effective Jan 1, 2027 — Nonprofits soliciting &gt;$25K must include cost disclosures. We&apos;ll update your templates automatically.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="font-medium text-sm text-green-800">IRS Revenue Procedure 2026-12: Updated 990 Thresholds</p>
            <p className="text-xs text-green-600 mt-1">990-N threshold raised to $60K gross receipts. Your org still files 990-EZ — no change needed.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
