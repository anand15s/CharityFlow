'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// WHY: Aplos uses a clean left sidebar with icon+label navigation.
// This pattern is proven for complex dashboards — it provides
// persistent navigation without consuming horizontal space on
// the main content area. We use a dark sidebar (slate-900) for
// visual hierarchy, with active state indicators.

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/transactions', label: 'Money Tracker', icon: '💳' },
  { href: '/dashboard/donors', label: 'Donor Hub', icon: '❤️' },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: '🎯' },
  { href: '/dashboard/events', label: 'Events', icon: '🎪' },
  { href: '/dashboard/compliance', label: 'Compliance', icon: '🛡️' },
  { href: '/dashboard/tax', label: 'Tax Center', icon: '🧾' },
  { href: '/dashboard/meetings', label: 'Board Room', icon: '📋' },
  { href: '/dashboard/reports', label: 'Reports', icon: '📈' },
  { href: '/dashboard/team', label: 'Team', icon: '👥' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold font-['Montserrat'] text-blue-400">CharityFlow</h1>
        <p className="text-xs text-slate-400 mt-1">Nonprofit Operating System</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active ? 'bg-blue-600/20 text-blue-400 border-l-3 border-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">CF</div>
          <div><p className="text-sm font-medium">My Nonprofit</p><p className="text-xs text-slate-400">Free Plan</p></div>
        </div>
      </div>
    </aside>
  );
}
