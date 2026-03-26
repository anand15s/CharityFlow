export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">🎯 Fundraising Campaigns</h1><p className="text-gray-500 text-sm">Run campaigns, peer-to-peer fundraising, and track every dollar</p></div>
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg">+ New Campaign</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Spring Gala 2026', goal: 15000, raised: 8500, donors: 47, daysLeft: 17, type: 'Event' },
          { name: 'Youth Program Fund', goal: 25000, raised: 18200, donors: 92, daysLeft: 45, type: 'General' },
          { name: 'Emergency Food Drive', goal: 5000, raised: 5000, donors: 63, daysLeft: 0, type: 'P2P' },
        ].map((c) => (
          <div key={c.name} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start">
              <div><h3 className="font-semibold text-lg">{c.name}</h3><span className="text-xs px-2 py-1 bg-gray-100 rounded">{c.type}</span></div>
              {c.daysLeft > 0 ? <span className="text-xs text-gray-500">{c.daysLeft}d left</span> : <span className="text-xs text-green-600 font-semibold">✓ Goal Reached!</span>}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">${c.raised.toLocaleString()} raised</span><span className="font-semibold">${c.goal.toLocaleString()} goal</span></div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full ${c.raised >= c.goal ? 'bg-green-500' : 'bg-brand-primary'}`} style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">{c.donors} donors • {Math.round((c.raised / c.goal) * 100)}% funded</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
