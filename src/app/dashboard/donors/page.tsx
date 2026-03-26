export default function DonorsPage() {
  const donors = [
    { name: 'Sarah Mitchell', email: 'sarah@email.com', total: 12500, gifts: 8, last: '2026-03-26', type: 'Individual' },
    { name: 'United Way', email: 'grants@unitedway.org', total: 60000, gifts: 12, last: '2026-03-22', type: 'Foundation' },
    { name: 'Local Rotary Club', email: 'rotary@local.org', total: 5000, gifts: 2, last: '2026-02-15', type: 'Corporate' },
    { name: 'David Chen', email: 'david@email.com', total: 3200, gifts: 15, last: '2026-03-18', type: 'Individual' },
    { name: 'Community Foundation', email: 'info@commfound.org', total: 25000, gifts: 4, last: '2026-01-30', type: 'DAF' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">❤️ Donor Hub</h1>
          <p className="text-gray-500 text-sm">Track relationships, giving history, and auto-send tax receipts</p>
        </div>
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg">+ Add Donor</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Total Donors</p><p className="text-2xl font-bold">142</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Total Given (YTD)</p><p className="text-2xl font-bold text-green-600">$105,700</p></div>
        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Avg Gift Size</p><p className="text-2xl font-bold">$744</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr><th className="px-6 py-3">Donor</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Total Given</th><th className="px-6 py-3">Gifts</th><th className="px-6 py-3">Last Gift</th><th className="px-6 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donors.map((d) => (
              <tr key={d.name} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4"><p className="font-medium text-sm">{d.name}</p><p className="text-xs text-gray-400">{d.email}</p></td>
                <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">{d.type}</span></td>
                <td className="px-6 py-4 font-semibold text-green-600">${d.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{d.gifts}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.last}</td>
                <td className="px-6 py-4"><button className="text-xs text-brand-primary font-medium">Send Receipt</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
