export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">📈 Reports</h1><p className="text-gray-500 text-sm">Financial statements, donor reports, and compliance documents — one click</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Statement of Activities', desc: 'Revenue vs expenses by program', icon: '💰', category: 'Financial' },
          { name: 'Statement of Financial Position', desc: 'Assets, liabilities, net assets', icon: '📊', category: 'Financial' },
          { name: 'Functional Expense Report', desc: 'Program vs Admin vs Fundraising', icon: '📋', category: 'Financial' },
          { name: 'Donor Giving Summary', desc: 'All donors with YTD totals', icon: '❤️', category: 'Donor' },
          { name: 'Campaign Performance', desc: 'ROI by fundraising campaign', icon: '🎯', category: 'Donor' },
          { name: 'Tax Receipt Batch', desc: 'Generate all year-end receipts', icon: '🧾', category: 'Tax' },
          { name: 'Compliance Status Report', desc: 'All deadlines and filings', icon: '🗺️', category: 'Compliance' },
          { name: 'Board Minutes Archive', desc: 'All meeting minutes and votes', icon: '📝', category: 'Governance' },
          { name: 'Audit Trail Export', desc: 'Complete immutable transaction log', icon: '🔐', category: 'Audit' },
        ].map((r) => (
          <div key={r.name} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer group">
            <span className="text-2xl">{r.icon}</span>
            <h3 className="font-semibold mt-2">{r.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{r.category}</span>
              <span className="text-xs text-brand-primary font-medium opacity-0 group-hover:opacity-100 transition">Generate →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
