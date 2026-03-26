export default function TaxCenterPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">🧾 Tax Center</h1><p className="text-gray-500 text-sm">CPA-grade tax optimization for your nonprofit</p></div>

      {/* Tax Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Tax-Exempt Status</p><p className="text-lg font-bold text-green-600">✓ Active</p><p className="text-xs text-gray-400">501(c)(3)</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Public Support Test</p><p className="text-lg font-bold text-yellow-600">34.1%</p><p className="text-xs text-gray-400">Min: 33.3%</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Program Efficiency</p><p className="text-lg font-bold text-green-600">72%</p><p className="text-xs text-gray-400">Target: 65%+</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">UBIT Exposure</p><p className="text-lg font-bold text-green-600">$0</p><p className="text-xs text-gray-400">No unrelated income</p></div>
      </div>

      {/* Form 990 Status */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">📋 Annual Tax Report (Form 990-EZ)</h3>
        <div className="flex items-center justify-between p-4 bg-brand-light rounded-lg">
          <div>
            <p className="font-medium">Tax Year 2025 — Form 990-EZ</p>
            <p className="text-sm text-gray-500 mt-1">Due: May 15, 2026 • Auto-selected based on your revenue ($180K)</p>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">Draft — 78% Complete</span>
            <button className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium">Continue Filing →</button>
          </div>
        </div>

        {/* Form Progress */}
        <div className="mt-6 space-y-3">
          {[
            { section: 'Organization Info', status: 'complete' },
            { section: 'Revenue & Expenses', status: 'complete' },
            { section: 'Balance Sheet', status: 'complete' },
            { section: 'Program Accomplishments', status: 'in-progress' },
            { section: 'Officer Compensation', status: 'pending' },
            { section: 'Governance Questions', status: 'pending' },
          ].map((s) => (
            <div key={s.section} className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                s.status === 'complete' ? 'bg-green-500 text-white' : s.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
              }`}>{s.status === 'complete' ? '✓' : s.status === 'in-progress' ? '…' : ''}</span>
              <p className="text-sm">{s.section}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CPA Alerts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">🛡️ CPA Tax Alerts</h3>
        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="font-medium text-sm text-yellow-800">⚠️ Public Support Test Warning</p>
            <p className="text-xs text-yellow-600 mt-1">Your 5-year public support ratio is 34.1% — just 0.8% above the 33.3% threshold. Consider diversifying your donor base to avoid reclassification as a private foundation.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="font-medium text-sm text-green-800">✓ Lobbying Activity — Compliant</p>
            <p className="text-xs text-green-600 mt-1">Total lobbying expenditures ($0) are well within the 20% cap for your budget size.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium text-sm text-blue-800">💡 Functional Expense Tip</p>
            <p className="text-xs text-blue-600 mt-1">Your admin ratio is 18%. Charity Navigator rates &lt;15% as excellent. Consider reclassifying shared costs using a reasonable allocation method.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
