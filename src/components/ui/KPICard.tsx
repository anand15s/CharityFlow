'use client';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

// WHY: Bloomerang uses donor-centric KPI cards at the top of their dashboard.
// Users see the most important numbers instantly without scrolling.
// We adapted this for nonprofit finances + compliance — 4 cards showing
// Donations YTD, Expenses YTD, Compliance Score, Active Donors.

interface KPICardProps {
  title: string;
  value: string;
  change: number; // percentage change vs last period
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red';
  sparklineData?: number[];
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
  green:  { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100' },
  yellow: { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    icon: 'bg-red-100' },
};

export function KPICard({ title, value, change, trend, icon, color, sparklineData }: KPICardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`${c.icon} p-3 rounded-lg`}>{icon}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1 font-['Montserrat']">{value}</p>
      {sparklineData && (
        <div className="mt-3 flex items-end gap-0.5 h-8">
          {sparklineData.map((v, i) => (
            <div key={i} className={`${c.bg} rounded-sm flex-1`} style={{ height: `${(v / Math.max(...sparklineData)) * 100}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}
