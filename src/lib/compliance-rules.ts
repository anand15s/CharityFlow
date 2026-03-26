/**
 * CharityFlow Location-Based Compliance Engine
 * Maps state/county/city regulations to actionable tasks
 * Updated quarterly via external legal data feeds
 */

export interface ComplianceRule {
  id: string
  title: string
  jurisdiction: 'federal' | 'state' | 'county' | 'city'
  category: 'tax' | 'filing' | 'registration' | 'license' | 'insurance' | 'governance'
  frequency: 'annual' | 'quarterly' | 'monthly' | 'one-time'
  description: string
  dueDate?: string // Relative: "May 15" or "90 days after fiscal year end"
  applicableTo: string[] // Nonprofit types: ['501c3', '501c4', etc.]
  states?: string[] // If state-specific
}

export const federalRules: ComplianceRule[] = [
  {
    id: 'fed-990',
    title: 'IRS Form 990 Filing',
    jurisdiction: 'federal',
    category: 'tax',
    frequency: 'annual',
    description: 'File appropriate Form 990 (990-N, 990-EZ, or 990) by the 15th day of the 5th month after fiscal year end.',
    dueDate: '5 months + 15 days after fiscal year end',
    applicableTo: ['501c3', '501c4', '501c6', '501c7'],
  },
  {
    id: 'fed-public-support',
    title: 'Public Support Test Monitoring',
    jurisdiction: 'federal',
    category: 'tax',
    frequency: 'annual',
    description: 'Maintain public support ratio above 33.3% on a rolling 5-year basis to retain public charity status.',
    applicableTo: ['501c3'],
  },
]

export function getComplianceRulesForOrg(state: string, nonprofitType: string): ComplianceRule[] {
  // TODO: Load state-specific rules from database
  // Updated quarterly via legal data feed integration
  return federalRules.filter(r => r.applicableTo.includes(nonprofitType))
}

export function calculateHealthScore(completedTasks: number, totalTasks: number): number {
  if (totalTasks === 0) return 100
  return Math.round((completedTasks / totalTasks) * 100)
}
