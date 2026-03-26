import { getComplianceRulesForOrg, calculateHealthScore, federalRules } from '@/lib/compliance-rules'

describe('Compliance Engine', () => {
  test('returns federal rules for 501c3 organizations', () => {
    const rules = getComplianceRulesForOrg('CA', '501c3')
    expect(rules.length).toBeGreaterThan(0)
    rules.forEach(rule => {
      expect(rule.applicableTo).toContain('501c3')
    })
  })

  test('calculates health score correctly', () => {
    expect(calculateHealthScore(87, 100)).toBe(87)
    expect(calculateHealthScore(0, 10)).toBe(0)
    expect(calculateHealthScore(10, 10)).toBe(100)
    expect(calculateHealthScore(0, 0)).toBe(100) // No tasks = fully compliant
  })

  test('federal rules include Form 990 filing', () => {
    const form990Rule = federalRules.find(r => r.id === 'fed-990')
    expect(form990Rule).toBeDefined()
    expect(form990Rule?.category).toBe('tax')
    expect(form990Rule?.frequency).toBe('annual')
  })

  test('federal rules include public support test', () => {
    const pstRule = federalRules.find(r => r.id === 'fed-public-support')
    expect(pstRule).toBeDefined()
    expect(pstRule?.applicableTo).toContain('501c3')
  })
})
