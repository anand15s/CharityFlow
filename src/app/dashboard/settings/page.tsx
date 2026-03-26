export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold">⚙️ Settings</h1><p className="text-gray-500 text-sm">Organization settings, integrations, and billing</p></div>
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h3 className="font-semibold">Organization Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-500">Name</label><input className="w-full mt-1 px-3 py-2 border rounded-lg" defaultValue="Hope Community Center" /></div>
          <div><label className="text-xs text-gray-500">EIN</label><input className="w-full mt-1 px-3 py-2 border rounded-lg" defaultValue="12-3456789" /></div>
          <div><label className="text-xs text-gray-500">State</label><input className="w-full mt-1 px-3 py-2 border rounded-lg" defaultValue="California" /></div>
          <div><label className="text-xs text-gray-500">City</label><input className="w-full mt-1 px-3 py-2 border rounded-lg" defaultValue="Los Angeles" /></div>
          <div><label className="text-xs text-gray-500">Nonprofit Type</label><input className="w-full mt-1 px-3 py-2 border rounded-lg" defaultValue="501(c)(3)" /></div>
          <div><label className="text-xs text-gray-500">Annual Budget</label><input className="w-full mt-1 px-3 py-2 border rounded-lg" defaultValue="$180,000" /></div>
        </div>
        <button className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm">Save Changes</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h3 className="font-semibold">Connected Services</h3>
        <div className="space-y-3">
          {[
            { name: 'Bank Account (Chase)', status: 'Connected', icon: '🏦' },
            { name: 'Payment Processor (Stripe)', status: 'Connected', icon: '💳' },
            { name: 'Email (SendGrid)', status: 'Not Connected', icon: '📧' },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3"><span>{s.icon}</span><span className="text-sm">{s.name}</span></div>
              <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
