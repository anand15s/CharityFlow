export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">📝 Board Room</h1><p className="text-gray-500 text-sm">Schedule meetings, record minutes, manage votes and documents</p></div>
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg">+ Schedule Meeting</button>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Q1 Board Meeting', date: 'Mar 28, 2026 — 6:00 PM', attendees: ['JD', 'SM', 'RC', 'LW'], status: 'Upcoming', hasMinutes: false, votes: 0 },
          { title: 'February Board Meeting', date: 'Feb 20, 2026 — 6:00 PM', attendees: ['JD', 'SM', 'RC', 'LW', 'PT'], status: 'Completed', hasMinutes: true, votes: 3 },
          { title: 'Annual Planning Session', date: 'Jan 15, 2026 — 10:00 AM', attendees: ['JD', 'SM', 'RC', 'LW', 'PT', 'AK'], status: 'Completed', hasMinutes: true, votes: 5 },
        ].map((meeting) => (
          <div key={meeting.title} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{meeting.title}</h3>
                <p className="text-sm text-gray-500">{meeting.date}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${meeting.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{meeting.status}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {meeting.attendees.map((a, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center border-2 border-white">{a}</div>
                  ))}
                </div>
                <span className="text-xs text-gray-400">{meeting.attendees.length} members</span>
              </div>
              <div className="flex gap-4 text-xs">
                <span>{meeting.hasMinutes ? '✅ Minutes recorded' : '⏳ Minutes pending'}</span>
                {meeting.votes > 0 && <span>🗳️ {meeting.votes} votes recorded</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
