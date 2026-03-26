export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">🎪 Event Planner</h1><p className="text-gray-500 text-sm">Plan, budget, and measure ROI for every event</p></div>
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg">+ Create Event</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Spring Gala 2026', date: 'Apr 12, 2026', venue: 'Community Hall', budget: 5000, spent: 2400, revenue: 8500, status: 'Planning', attendees: 120 },
          { name: 'Summer Food Drive', date: 'Jun 5, 2026', venue: 'TBD — Find Venue', budget: 2000, spent: 0, revenue: 0, status: 'Idea', attendees: 0 },
        ].map((event) => (
          <div key={event.name} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-500">{event.date} • {event.venue}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${event.status === 'Planning' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{event.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div><p className="text-xs text-gray-400">Budget</p><p className="font-semibold">${event.budget.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Spent</p><p className="font-semibold text-red-600">${event.spent.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Revenue</p><p className="font-semibold text-green-600">${event.revenue.toLocaleString()}</p></div>
            </div>
            {event.revenue > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-700 font-medium">ROI: {Math.round(((event.revenue - event.spent) / event.spent) * 100)}% — Net: ${(event.revenue - event.spent).toLocaleString()}</p></div>
            )}
          </div>
        ))}
      </div>

      {/* Venue Finder */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-2">🏛️ Smart Venue Finder</h3>
        <p className="text-sm text-gray-500 mb-4">Nonprofit-friendly venues near Los Angeles with discounted rates</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'LA Community Center', capacity: 200, rate: '$500/day', discount: '50% nonprofit', rating: 4.8 },
            { name: 'Griffith Park Pavilion', capacity: 150, rate: '$350/day', discount: 'Free for 501c3', rating: 4.5 },
            { name: 'First United Church Hall', capacity: 100, rate: '$200/day', discount: '30% nonprofit', rating: 4.3 },
          ].map((v) => (
            <div key={v.name} className="p-4 border rounded-lg hover:bg-brand-light/30 cursor-pointer">
              <p className="font-medium text-sm">{v.name}</p>
              <p className="text-xs text-gray-500">Cap: {v.capacity} • {v.rate}</p>
              <span className="text-xs text-green-600 font-medium">{v.discount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
