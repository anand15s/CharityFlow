'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/transactions', label: 'Money Tracker', icon: '💳' },
  { href: '/dashboard/donors', label: 'Donor Hub', icon: '❤️' },
  { href: '/dashboard/campaigns', label: 'Fundraising', icon: '🎯' },
  { href: '/dashboard/events', label: 'Events', icon: '🎪' },
  { href: '/dashboard/compliance', label: 'Compliance', icon: '🗺️' },
  { href: '/dashboard/tax', label: 'Tax Center', icon: '🧾' },
  { href: '/dashboard/meetings', label: 'Board Room', icon: '📝' },
  { href: '/dashboard/reports', label: 'Reports', icon: '📈' },
  { href: '/dashboard/team', label: 'Team', icon: '👥' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">CF</div>
            <span className="text-lg font-bold text-brand-dark">CharityFlow</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-brand-light text-brand-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Compliance Health Score */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-brand-mint p-4 rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Compliance Health</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold text-green-600">87%</span>
              <span className="text-xs text-green-600 mb-1">● Healthy</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-sm text-gray-500">Good morning!</h2>
            <h1 className="text-lg font-semibold text-brand-dark">Hope Community Center</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-brand-primary transition">
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
              JD
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
