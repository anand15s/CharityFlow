export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Money Coming In', value: '$24,580', change: '+12%', icon: '💰', color: 'text-green-600' },
          { label: 'Bills Paid', value: '$18,230', change: '-3%', icon: '📄', color: 'text-blue-600' },
          { label: 'Donors This Month', value: '47', change: '+8', icon: '❤️', color: 'text-pink-600' },
          { label: 'Compliance Score', value: '87%', change: '+2%', icon: '✅', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{stat.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* Two Column: Upcoming + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">📅 Upcoming Deadlines</h3>
          <div className="space-y-3">
            {[
              { task: 'File Annual Tax Report (990-EZ)', due: 'May 15, 2026', priority: 'high', days: 50 },
              { task: 'State Annual Report — California', due: 'Apr 1, 2026', priority: 'high', days: 6 },
              { task: 'Charitable Solicitation Renewal', due: 'Jun 30, 2026', priority: 'medium', days: 96 },
              { task: 'Q1 Board Meeting Minutes', due: 'Mar 31, 2026', priority: 'low', days: 5 },
            ].map((item) => (
              <div key={item.task} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-brand-light/50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-gray-400">{item.due}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.days <= 7 ? 'bg-red-100 text-red-600' : item.days <= 30 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.days}d left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">💳 Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { desc: 'Donation — Sarah M.', amount: '+$500', type: 'in', date: 'Today' },
              { desc: 'Office Supplies', amount: '-$124', type: 'out', date: 'Yesterday' },
              { desc: 'Spring Gala Tickets', amount: '+$2,400', type: 'in', date: 'Mar 24' },
              { desc: 'Venue Deposit — Community Hall', amount: '-$800', type: 'out', date: 'Mar 23' },
              { desc: 'Monthly Grant — United Way', amount: '+$5,000', type: 'in', date: 'Mar 22' },
            ].map((txn, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    txn.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {txn.type === 'in' ? '↓' : '↑'}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{txn.desc}</p>
                    <p className="text-xs text-gray-400">{txn.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${txn.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CPA Tax Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800">CPA Tax Alert</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your public support test ratio is at <strong>34%</strong> — the IRS threshold is 33.3%. 
              You&apos;re close to the edge. Consider diversifying your donor base this quarter to maintain public charity status.
            </p>
            <button className="mt-3 text-sm text-yellow-800 font-semibold underline">View Tax Dashboard →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
