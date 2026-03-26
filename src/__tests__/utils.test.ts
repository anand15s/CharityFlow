import { formatCurrency, formatDate, toPlainLanguage, cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats positive amounts correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })
    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })
    it('formats cents correctly', () => {
      expect(formatCurrency(99.99)).toBe('$99.99')
    })
    it('formats large amounts with commas', () => {
      expect(formatCurrency(1500000)).toBe('$1,500,000.00')
    })
  })

  describe('toPlainLanguage', () => {
    it('translates Chart of Accounts', () => {
      expect(toPlainLanguage('Chart of Accounts')).toBe('Money Categories')
    })
    it('translates Reconciliation', () => {
      expect(toPlainLanguage('Reconciliation')).toBe('Match Your Bank')
    })
    it('translates Form 990', () => {
      expect(toPlainLanguage('Form 990')).toBe('Annual Tax Report')
    })
    it('translates Restricted Funds', () => {
      expect(toPlainLanguage('Restricted Funds')).toBe('Money with Rules')
    })
    it('returns original term if no translation exists', () => {
      expect(toPlainLanguage('Custom Term')).toBe('Custom Term')
    })
  })

  describe('cn (classname merger)', () => {
    it('merges class names', () => {
      expect(cn('px-2', 'py-2')).toBe('px-2 py-2')
    })
    it('handles conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    })
  })
})
