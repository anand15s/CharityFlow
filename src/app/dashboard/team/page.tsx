export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">👥 Team</h1><p className="text-gray-500 text-sm">Manage members, roles, and notification preferences</p></div>
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg">+ Invite Member</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr><th className="px-6 py-3">Member</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Notifications</th><th className="px-6 py-3">Last Active</th><th className="px-6 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: 'Jane Doe', email: 'jane@hope.org', role: 'Admin', notifs: 'All', active: 'Today' },
              { name: 'Sarah Mitchell', email: 'sarah@hope.org', role: 'Treasurer', notifs: 'Financial + Compliance', active: 'Today' },
              { name: 'Robert Chen', email: 'robert@hope.org', role: 'Board Member', notifs: 'Meetings + Votes', active: 'Mar 24' },
              { name: 'Lisa Wang', email: 'lisa@hope.org', role: 'Executive Director', notifs: 'All', active: 'Mar 25' },
              { name: 'Mike Peters', email: 'mike@hope.org', role: 'Volunteer', notifs: 'Events Only', active: 'Mar 20' },
            ].map((m) => (
              <tr key={m.email} className="hover:bg-gray-50">
                <td className="px-6 py-4"><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></td>
                <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-brand-light text-brand-primary">{m.role}</span></td>
                <td className="px-6 py-4 text-xs text-gray-500">{m.notifs}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{m.active}</td>
                <td className="px-6 py-4"><button className="text-xs text-brand-primary font-medium">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
