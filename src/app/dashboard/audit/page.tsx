'use client'

import { Shield, Lock, Eye, FileText, Clock } from 'lucide-react'

const auditLog = [
  { id: '1', action: 'Transaction Created', entity: 'Annual Gala Ticket Sales', user: 'admin@org.com', time: '2 hours ago', ip: '192.168.1.1' },
  { id: '2', action: 'Donor Added', entity: 'Smith Foundation', user: 'admin@org.com', time: '3 hours ago', ip: '192.168.1.1' },
  { id: '3', action: 'Meeting Scheduled', entity: 'Q1 Board Meeting', user: 'treasurer@org.com', time: '1 day ago', ip: '10.0.0.5' },
  { id: '4', action: 'Report Generated', entity: 'Q4 Financial Summary', user: 'admin@org.com', time: '2 days ago', ip: '192.168.1.1' },
  { id: '5', action: 'Member Invited', entity: 'volunteer@org.com', user: 'admin@org.com', time: '3 days ago', ip: '192.168.1.1' },
]

const securityFeatures = [
  { name: 'Immutable Transaction Logs', status: 'active', icon: Lock, desc: 'Every transaction is cryptographically hashed and cannot be altered.' },
  { name: 'Role-Based Access Control', status: 'active', icon: Shield, desc: 'Admin, Treasurer, Board Member, Staff, and Viewer roles enforced.' },
  { name: 'Audit Trail', status: 'active', icon: Eye, desc: 'Every action logged with user, timestamp, and IP address.' },
  { name: 'Encrypted Data at Rest', status: 'active', icon: Lock, desc: 'AES-256 encryption for all stored financial data.' },
]

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Security & Audit Trail</h1>
        <p className="text-gray-500">Every penny tracked. Every action logged. Audit-ready at all times.</p>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4">
        {securityFeatures.map(f => (
          <div key={f.name} className="card flex items-start gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <f.icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{f.name}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log */}
      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-brand-800">Activity Log</h2>
          <button className="btn-secondary text-sm flex items-center gap-2"><FileText className="w-4 h-4" /> Export for Audit</button>
        </div>
        <div className="divide-y">
          {auditLog.map(log => (
            <div key={log.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm"><span className="font-medium text-gray-900">{log.action}</span> — {log.entity}</p>
                  <p className="text-xs text-gray-500">{log.user} &middot; {log.ip}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
