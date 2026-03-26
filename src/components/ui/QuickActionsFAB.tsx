'use client';
import { useState } from 'react';

// WHY: None of the top 3 platforms offer a quick-action FAB.
// This is our innovation — volunteer treasurers need to record
// transactions FAST during events or board meetings. The FAB
// gives one-tap access to the 4 most common actions without
// navigating away from any page.

const actions = [
  { label: 'Record Donation', icon: '💰', color: 'bg-emerald-500 hover:bg-emerald-600' },
  { label: 'Add Expense', icon: '📝', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Generate Report', icon: '📊', color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Create Event', icon: '🎪', color: 'bg-amber-500 hover:bg-amber-600' },
];

export function QuickActionsFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {actions.map((action) => (
          <button key={action.label} className={`${action.color} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium transition-all hover:scale-105`}>
            <span className="text-lg">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 ${open ? 'rotate-45 bg-gray-600 hover:bg-gray-700' : ''}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
