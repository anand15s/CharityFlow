import { PlainLanguageTranslator } from '../lib/plain-language';

describe('Plain Language Translator', () => {
  let translator: PlainLanguageTranslator;

  beforeEach(() => {
    translator = new PlainLanguageTranslator();
  });

  describe('Core Translations', () => {
    it('should translate Chart of Accounts', () => {
      expect(translator.translate('Chart of Accounts')).toBe('Money Categories');
    });

    it('should translate Reconciliation', () => {
      expect(translator.translate('Reconciliation')).toBe('Match Your Bank');
    });

    it('should translate Restricted Funds', () => {
      expect(translator.translate('Restricted Funds')).toBe('Money with Rules');
    });

    it('should translate Accounts Payable', () => {
      expect(translator.translate('Accounts Payable')).toBe('Bills to Pay');
    });

    it('should translate Accounts Receivable', () => {
      expect(translator.translate('Accounts Receivable')).toBe('Money Coming In');
    });

    it('should translate General Ledger', () => {
      expect(translator.translate('General Ledger')).toBe('Master Money Record');
    });

    it('should translate Fiscal Year', () => {
      expect(translator.translate('Fiscal Year')).toBe('Financial Year');
    });

    it('should translate Form 990', () => {
      expect(translator.translate('Form 990')).toBe('Annual Tax Report');
    });
  });

  describe('Edge Cases', () => {
    it('should return original for unknown terms', () => {
      expect(translator.translate('Random XYZ Term')).toBe('Random XYZ Term');
    });

    it('should handle case insensitive input', () => {
      expect(translator.translate('chart of accounts')).toBe('Money Categories');
    });

    it('should handle empty string', () => {
      expect(translator.translate('')).toBe('');
    });
  });

  // Oklahoma org context tests
  describe('Oklahoma — Temple Context', () => {
    it('should translate Tithe/Offering in religious context', () => {
      expect(translator.translate('Tithes and Offerings')).toBe('Regular Donations');
    });
  });

  describe('Oklahoma — Food Bank Context', () => {
    it('should translate In-Kind Donations', () => {
      expect(translator.translate('In-Kind Donations')).toBe('Non-Cash Gifts');
    });
  });

  describe('Oklahoma — IT Nonprofit Context', () => {
    it('should translate Depreciation', () => {
      expect(translator.translate('Depreciation')).toBe('Equipment Value Decrease');
    });
  });
});
