import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'CharityFlow',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    features: [
      'transaction-management',
      'form-990-auto-filing',
      'cpa-tax-optimizer',
      'location-compliance-engine',
      'donor-crm',
      'event-engine',
      'board-governance',
      'audit-trail',
      'role-based-access',
      'smart-notifications',
    ],
  })
}
