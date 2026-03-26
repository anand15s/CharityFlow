import { ReceiptScanner, ScanResult } from '../lib/expenses/receipt-scanner';

describe('Receipt Scanner (SmartScan)', () => {
  let scanner: ReceiptScanner;

  beforeEach(() => {
    scanner = new ReceiptScanner();
  });

  describe('Text Extraction', () => {
    it('should extract merchant name from receipt text', () => {
      const result = scanner.parseReceiptText('WALMART SUPERCENTER\n123 Main St\nTotal: $45.67\nDate: 03/15/2026');
      expect(result.merchant).toBe('WALMART SUPERCENTER');
    });

    it('should extract amount from receipt', () => {
      const result = scanner.parseReceiptText('Store ABC\nSubtotal: $30.00\nTax: $2.40\nTotal: $32.40');
      expect(result.amount).toBe(32.40);
    });

    it('should extract date from receipt', () => {
      const result = scanner.parseReceiptText('OFFICE DEPOT\nDate: 03/20/2026\nTotal: $89.99');
      expect(result.date).toBeDefined();
    });

    it('should handle multiple amount formats ($, USD)', () => {
      const r1 = scanner.parseReceiptText('Total: $100.50');
      const r2 = scanner.parseReceiptText('Total: USD 100.50');
      expect(r1.amount).toBe(100.50);
      expect(r2.amount).toBe(100.50);
    });
  });

  describe('Auto-Categorization', () => {
    it('should categorize office supply stores', () => {
      const result = scanner.parseReceiptText('STAPLES\nPaper, pens\nTotal: $45.00');
      expect(result.suggestedCategory).toBe('office_supplies');
    });

    it('should categorize restaurant receipts as meals', () => {
      const result = scanner.parseReceiptText('CHIPOTLE MEXICAN GRILL\nBurrito Bowl\nTotal: $12.50');
      expect(result.suggestedCategory).toBe('meals');
    });

    it('should categorize gas station receipts as travel', () => {
      const result = scanner.parseReceiptText('SHELL GAS STATION\nUnleaded\nTotal: $55.00');
      expect(result.suggestedCategory).toBe('travel');
    });
  });

  describe('Confidence Scoring', () => {
    it('should return high confidence for complete receipts', () => {
      const result = scanner.parseReceiptText('WALMART\nDate: 03/15/2026\n3 items\nTotal: $45.67\nVISA ending 1234');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should return low confidence for incomplete text', () => {
      const result = scanner.parseReceiptText('blurry text maybe $20');
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  // Oklahoma state tests
  describe('Oklahoma — Temple Receipt (OK-T1)', () => {
    it('should scan temple supply store receipt', () => {
      const result = scanner.parseReceiptText('INDIA GROCERY & SUPPLIES\nPuja items, flowers, incense\nDate: 03/01/2026\nTotal: $125.00');
      expect(result.amount).toBe(125.00);
      expect(result.merchant).toContain('INDIA GROCERY');
    });

    it('should categorize temple maintenance receipts', () => {
      const result = scanner.parseReceiptText('HOME DEPOT\nPaint, brushes, repair materials\nTotal: $340.00');
      expect(['maintenance', 'office_supplies', 'general']).toContain(result.suggestedCategory);
    });
  });

  describe('Oklahoma — Food Bank Receipt (OK-FB1)', () => {
    it('should scan bulk food purchase receipt', () => {
      const result = scanner.parseReceiptText('SYSCO FOODS\nCanned goods x200, Rice x100\nDate: 02/15/2026\nTotal: $2,450.00');
      expect(result.amount).toBe(2450.00);
    });

    it('should handle comma-separated large amounts', () => {
      const result = scanner.parseReceiptText('Total: $12,500.00');
      expect(result.amount).toBe(12500.00);
    });
  });

  describe('Oklahoma — IT Nonprofit Receipt (OK-IT1)', () => {
    it('should scan tech equipment receipt', () => {
      const result = scanner.parseReceiptText('BEST BUY BUSINESS\n5x Chromebook Laptops\nDate: 01/10/2026\nTotal: $1,750.00');
      expect(result.amount).toBe(1750.00);
    });

    it('should categorize software receipts', () => {
      const result = scanner.parseReceiptText('ADOBE INC\nCreative Cloud Annual License\nTotal: $599.88');
      expect(['software', 'office_supplies', 'program_expenses']).toContain(result.suggestedCategory);
    });
  });
});
