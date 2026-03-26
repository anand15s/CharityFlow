'use client';

// WHY: Aplos's 2025 Oversight Dashboard introduced inline task management
// with color-coded status tracking. For nonprofits, missed deadlines = 
// lost tax-exempt status. This widget surfaces urgent compliance
// deadlines, upcoming filings, and pending tasks in a priority-sorted
// feed with countdown badges.

interface ActionItem {
  id: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
  category: 'compliance' | 'tax' | 'donor' | 'event' | 'board';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'overdue' | 'due_soon' | 'upcoming' | 'completed';
}

const categoryIcons = {
  compliance: '🛡️', tax: '🧾', donor: '❤️', event: '🎪', board: '📋',
};

const statusConfig = {
  overdue:   { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-500 text-white',    text: 'Overdue' },
  due_soon:  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-500 text-white',  text: 'Due Soon' },
  upcoming:  { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700', text: 'Upcoming' },
  completed: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', text: 'Done' },
};

export function ActionItemsWidget({ items }: { items: ActionItem[] }) {
  const sorted = [...items].sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 font-['Montserrat']">Action Items</h3>
        <span className="text-xs text-gray-400">{items.filter(i => i.status !== 'completed').length} pending</span>
      </div>
      <div className="space-y-3">
        {sorted.slice(0, 5).map(item => {
          const s = statusConfig[item.status];
          return (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${s.bg} border ${s.border} transition-all hover:scale-[1.01]`}>
              <span className="text-xl">{categoryIcons[item.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.badge}`}>
                {item.status === 'completed' ? '✓' : `${item.daysRemaining}d`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
