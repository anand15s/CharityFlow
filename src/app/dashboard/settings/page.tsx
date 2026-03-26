'use client'

import { User, Building, Bell, Shield, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Settings</h1>
        <p className="text-gray-500">Manage your organization, team, and preferences.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {[
            { icon: Building, label: 'Organization', active: true },
            { icon: User, label: 'Team Members', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Security', active: false },
            { icon: CreditCard, label: 'Billing', active: false },
          ].map(item => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${item.active ? 'bg-brand-50 text-brand-500 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-3 card">
          <h2 className="text-lg font-bold text-brand-800 mb-6">Organization Details</h2>
          <form className="space-y-4 max-w-lg">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><input type="text" className="input-field" defaultValue="Helping Hands Foundation" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">EIN (Tax ID)</label><input type="text" className="input-field" defaultValue="12-3456789" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" className="input-field" defaultValue="California" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" className="input-field" defaultValue="Los Angeles" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nonprofit Type</label>
              <select className="input-field"><option>501(c)(3) - Charitable</option><option>501(c)(4) - Social Welfare</option><option>501(c)(6) - Business League</option></select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Start</label>
              <select className="input-field"><option>January</option><option>July</option><option>October</option></select>
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  )
}
