'use client';

// WHY: Keela's donor analytics feature "engagement scores" and visual
// lifetime giving histories. This gives small nonprofits the same
// donor intelligence that large orgs get from enterprise CRMs.
// Each donor shows: avatar, name, lifetime value, engagement hearts,
// last gift, and a giving trend indicator.

interface DonorCardProps {
  name: string;
  email: string;
  lifetimeGiving: number;
  lastGiftDate: string;
  lastGiftAmount: number;
  engagementScore: 1 | 2 | 3 | 4 | 5;
  isRecurring: boolean;
  trend: 'increasing' | 'stable' | 'declining' | 'lapsed';
}

const trendConfig = {
  increasing: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Growing' },
  stable:     { color: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Stable' },
  declining:  { color: 'text-amber-600',   bg: 'bg-amber-50',   label: 'Declining' },
  lapsed:     { color: 'text-red-600',     bg: 'bg-red-50',     label: 'Lapsed' },
};

export function DonorCard({ name, email, lifetimeGiving, lastGiftDate, lastGiftAmount, engagementScore, isRecurring, trend }: DonorCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const t = trendConfig[trend];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {isRecurring && <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 font-medium">Monthly</span>}
          </div>
          <p className="text-sm text-gray-500 truncate">{email}</p>
        </div>

        {/* Lifetime Value */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-gray-900">${lifetimeGiving.toLocaleString()}</p>
          <p className="text-xs text-gray-400">lifetime</p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        {/* Engagement hearts */}
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <span key={i} className={i <= engagementScore ? 'text-red-400' : 'text-gray-200'}>♥</span>
          ))}
        </div>

        {/* Trend badge */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.bg} ${t.color}`}>{t.label}</span>

        {/* Last gift */}
        <span className="text-xs text-gray-400">Last: ${lastGiftAmount} · {lastGiftDate}</span>
      </div>
    </div>
  );
}
