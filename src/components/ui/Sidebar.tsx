'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Receipt, FileText, Shield, Users, 
  Calendar, Gavel, Bell, BarChart3, MapPin, Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Money Tracker', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Annual Tax Report', href: '/dashboard/form990', icon: FileText },
  { name: 'Tax Optimizer', href: '/dashboard/tax-optimizer', icon: BarChart3 },
  { name: 'Compliance', href: '/dashboard/compliance', icon: MapPin },
  { name: 'Donor Hub', href: '/dashboard/donors', icon: Users },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Board Meetings', href: '/dashboard/meetings', icon: Gavel },
  { name: 'Security & Audit', href: '/dashboard/audit', icon: Shield },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-3">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">CF</span>
        </div>
        <span className="font-bold text-lg text-brand-800">CharityFlow</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'sidebar-link',
              pathname === item.href && 'active'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-3 bg-brand-50 rounded-lg">
        <p className="text-xs text-brand-500 font-semibold">Compliance Score</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <span className="text-sm font-bold text-green-600">85%</span>
        </div>
      </div>
    </aside>
  )
}
