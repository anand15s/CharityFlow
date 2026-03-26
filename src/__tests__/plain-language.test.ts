import { translateTerm, translateText, translations } from '@/lib/plain-language'

describe('Plain Language Engine', () => {
  test('translates Chart of Accounts to Money Categories', () => {
    expect(translateTerm('Chart of Accounts')).toBe('Money Categories')
  })

  test('translates Reconciliation to Match Your Bank', () => {
    expect(translateTerm('Reconciliation')).toBe('Match Your Bank')
  })

  test('translates Form 990 to Annual Tax Report', () => {
    expect(translateTerm('Form 990')).toBe('Annual Tax Report')
  })

  test('returns original term if no translation exists', () => {
    expect(translateTerm('Unknown Term')).toBe('Unknown Term')
  })

  test('translates full text with multiple terms', () => {
    const input = 'Review your Chart of Accounts and complete Reconciliation'
    const result = translateText(input)
    expect(result).toContain('Money Categories')
    expect(result).toContain('Match Your Bank')
  })

  test('has translations for all critical nonprofit terms', () => {
    const criticalTerms = ['Form 990', 'Restricted Funds', 'UBIT', 'Net Assets']
    criticalTerms.forEach(term => {
      expect(translations[term]).toBeDefined()
    })
  })
})
