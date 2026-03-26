import { GET } from '@/app/api/health/route'

describe('Health API', () => {
  it('returns healthy status', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.status).toBe('healthy')
    expect(data.app).toBe('CharityFlow')
    expect(data.version).toBe('0.1.0')
    expect(data.features).toContain('transaction-management')
    expect(data.features).toContain('form-990-auto-filing')
    expect(data.features).toContain('cpa-tax-optimizer')
    expect(data.features).toContain('location-compliance-engine')
    expect(data.features).toContain('donor-crm')
    expect(data.features).toContain('audit-trail')
  })

  it('includes timestamp', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data.timestamp).toBeDefined()
    expect(new Date(data.timestamp).getTime()).not.toBeNaN()
  })
})
