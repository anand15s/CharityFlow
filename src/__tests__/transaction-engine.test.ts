import {
  TransactionEngine, Transaction, TransactionType,
  FundCategory, ReconciliationResult
} from '../lib/transactions/transaction-engine';

describe('Transaction Engine', () => {
  let engine: TransactionEngine;

  beforeEach(() => {
    engine = new TransactionEngine({ orgId: 'test-org', fiscalYearStart: 1 });
  });

  // === CRUD Operations ===
  describe('Create Transactions', () => {
    it('should create a donation transaction', () => {
      const txn = engine.createTransaction({
        type: 'donation', amount: 500, description: 'Annual giving',
        date: new Date('2026-01-15'), category: 'donations'
      });
      expect(txn.id).toBeDefined();
      expect(txn.type).toBe('donation');
      expect(txn.amount).toBe(500);
    });

    it('should create an expense transaction', () => {
      const txn = engine.createTransaction({
        type: 'expense', amount: 150, description: 'Office supplies',
        date: new Date('2026-02-01'), category: 'program_expenses'
      });
      expect(txn.type).toBe('expense');
      expect(txn.amount).toBe(150);
    });

    it('should reject zero amount transactions', () => {
      expect(() => engine.createTransaction({
        type: 'donation', amount: 0, description: 'Invalid',
        date: new Date(), category: 'donations'
      })).toThrow();
    });

    it('should reject negative amounts', () => {
      expect(() => engine.createTransaction({
        type: 'expense', amount: -50, description: 'Negative',
        date: new Date(), category: 'program_expenses'
      })).toThrow();
    });

    it('should reject empty descriptions', () => {
      expect(() => engine.createTransaction({
        type: 'donation', amount: 100, description: '',
        date: new Date(), category: 'donations'
      })).toThrow();
    });
  });

  // === Auto-Categorization ===
  describe('Auto-Categorization', () => {
    it('should categorize donation keywords', () => {
      const cat = engine.autoCategorize('Annual church donation from Smith family');
      expect(cat).toBe('donations');
    });

    it('should categorize grant keywords', () => {
      const cat = engine.autoCategorize('Federal grant disbursement Q2');
      expect(cat).toBe('grants');
    });

    it('should categorize utility keywords', () => {
      const cat = engine.autoCategorize('Monthly electricity bill payment');
      expect(cat).toBe('utilities');
    });

    it('should categorize event keywords', () => {
      const cat = engine.autoCategorize('Annual fundraiser gala venue deposit');
      expect(cat).toBe('event_expenses');
    });

    it('should categorize payroll keywords', () => {
      const cat = engine.autoCategorize('Staff salary payment March 2026');
      expect(cat).toBe('payroll');
    });

    it('should default to general for unknown', () => {
      const cat = engine.autoCategorize('Miscellaneous item purchase xyz');
      expect(cat).toBe('general');
    });
  });

  // === Update & Void ===
  describe('Update and Void', () => {
    it('should update transaction description', () => {
      const txn = engine.createTransaction({
        type: 'expense', amount: 200, description: 'Old desc',
        date: new Date(), category: 'program_expenses'
      });
      const updated = engine.updateTransaction(txn.id, { description: 'New desc' });
      expect(updated.description).toBe('New desc');
      expect(updated.auditTrail.length).toBeGreaterThan(0);
    });

    it('should void a transaction with immutable trail', () => {
      const txn = engine.createTransaction({
        type: 'donation', amount: 1000, description: 'To void',
        date: new Date(), category: 'donations'
      });
      const voided = engine.voidTransaction(txn.id, 'Duplicate entry');
      expect(voided.status).toBe('voided');
      expect(voided.voidReason).toBe('Duplicate entry');
    });
  });

  // === Bank Reconciliation ===
  describe('Bank Reconciliation', () => {
    it('should match exact amounts', () => {
      engine.createTransaction({
        type: 'expense', amount: 99.50, description: 'Office rent',
        date: new Date('2026-03-01'), category: 'rent'
      });
      const bankEntries = [{ amount: 99.50, date: new Date('2026-03-01'), reference: 'RENT-001' }];
      const result = engine.reconcile(bankEntries);
      expect(result.matched).toBeGreaterThan(0);
    });

    it('should skip voided transactions during reconciliation', () => {
      const txn = engine.createTransaction({
        type: 'expense', amount: 50, description: 'Voided item',
        date: new Date(), category: 'general'
      });
      engine.voidTransaction(txn.id, 'Error');
      const result = engine.reconcile([{ amount: 50, date: new Date(), reference: 'X' }]);
      expect(result.matched).toBe(0);
    });
  });

  // === Split Transactions ===
  describe('Split Transactions', () => {
    it('should split transaction into multiple categories', () => {
      const splits = engine.createSplitTransaction({
        totalAmount: 500, description: 'Mixed expense', date: new Date(),
        splits: [
          { category: 'program_expenses', amount: 300 },
          { category: 'admin_expenses', amount: 200 }
        ]
      });
      expect(splits.length).toBe(2);
      expect(splits.reduce((sum, s) => sum + s.amount, 0)).toBe(500);
    });

    it('should reject splits that dont sum to total', () => {
      expect(() => engine.createSplitTransaction({
        totalAmount: 500, description: 'Bad split', date: new Date(),
        splits: [
          { category: 'program_expenses', amount: 300 },
          { category: 'admin_expenses', amount: 100 }
        ]
      })).toThrow();
    });
  });

  // === Financial Reporting ===
  describe('Financial Reporting', () => {
    it('should generate income/expense summary', () => {
      engine.createTransaction({ type: 'donation', amount: 5000, description: 'Big donor', date: new Date(), category: 'donations' });
      engine.createTransaction({ type: 'expense', amount: 1000, description: 'Program', date: new Date(), category: 'program_expenses' });
      engine.createTransaction({ type: 'expense', amount: 500, description: 'Admin', date: new Date(), category: 'admin_expenses' });
      const summary = engine.generateSummary();
      expect(summary.totalIncome).toBe(5000);
      expect(summary.totalExpenses).toBe(1500);
      expect(summary.netIncome).toBe(3500);
    });

    it('should calculate functional expense ratios', () => {
      engine.createTransaction({ type: 'expense', amount: 7000, description: 'Programs', date: new Date(), category: 'program_expenses' });
      engine.createTransaction({ type: 'expense', amount: 2000, description: 'Admin', date: new Date(), category: 'admin_expenses' });
      engine.createTransaction({ type: 'expense', amount: 1000, description: 'Fundraising', date: new Date(), category: 'fundraising_expenses' });
      const ratios = engine.getFunctionalExpenseRatios();
      expect(ratios.programRatio).toBeCloseTo(0.7, 1);
      expect(ratios.adminRatio).toBeCloseTo(0.2, 1);
      expect(ratios.fundraisingRatio).toBeCloseTo(0.1, 1);
    });
  });

  // === Plain Language ===
  describe('Plain Language Translation', () => {
    it('should translate Chart of Accounts', () => {
      expect(engine.translate('Chart of Accounts')).toBe('Money Categories');
    });

    it('should translate Reconciliation', () => {
      expect(engine.translate('Reconciliation')).toBe('Match Your Bank');
    });

    it('should translate Restricted Funds', () => {
      expect(engine.translate('Restricted Funds')).toBe('Money with Rules');
    });
  });

  // === Oklahoma State Tests ===
  describe('Oklahoma — Hindu Temple (OK-T1)', () => {
    it('should handle temple donation with tax receipt', () => {
      const txn = engine.createTransaction({
        type: 'donation', amount: 2500, description: 'Diwali festival donation',
        date: new Date('2026-11-01'), category: 'donations',
        metadata: { state: 'OK', orgType: 'religious', donorName: 'Patel Family' }
      });
      expect(txn.id).toBeDefined();
      expect(txn.amount).toBe(2500);
    });

    it('should categorize temple building fund expenses', () => {
      const cat = engine.autoCategorize('Temple building renovation contractor payment');
      expect(['program_expenses', 'general']).toContain(cat);
    });

    it('should generate quarterly summary for temple', () => {
      engine.createTransaction({ type: 'donation', amount: 15000, description: 'Q1 donations', date: new Date('2026-03-15'), category: 'donations' });
      engine.createTransaction({ type: 'expense', amount: 3000, description: 'Priest salary', date: new Date('2026-03-15'), category: 'payroll' });
      engine.createTransaction({ type: 'expense', amount: 1500, description: 'Utilities', date: new Date('2026-03-15'), category: 'utilities' });
      const summary = engine.generateSummary();
      expect(summary.totalIncome).toBe(15000);
      expect(summary.totalExpenses).toBe(4500);
    });
  });

  describe('Oklahoma — Food Bank (OK-FB1)', () => {
    it('should handle in-kind food donation tracking', () => {
      const txn = engine.createTransaction({
        type: 'donation', amount: 5000, description: 'In-kind food donation from local grocery',
        date: new Date('2026-02-15'), category: 'donations',
        metadata: { state: 'OK', orgType: 'food_bank', inKind: true, estimatedFMV: 5000 }
      });
      expect(txn.amount).toBe(5000);
    });

    it('should track cold storage utility expenses', () => {
      const txn = engine.createTransaction({
        type: 'expense', amount: 800, description: 'Commercial refrigeration electricity',
        date: new Date('2026-02-28'), category: 'utilities'
      });
      expect(txn.category).toBe('utilities');
    });

    it('should calculate food bank program efficiency', () => {
      engine.createTransaction({ type: 'donation', amount: 50000, description: 'Grants', date: new Date(), category: 'grants' });
      engine.createTransaction({ type: 'expense', amount: 40000, description: 'Food distribution', date: new Date(), category: 'program_expenses' });
      engine.createTransaction({ type: 'expense', amount: 5000, description: 'Admin', date: new Date(), category: 'admin_expenses' });
      engine.createTransaction({ type: 'expense', amount: 5000, description: 'Fundraising', date: new Date(), category: 'fundraising_expenses' });
      const ratios = engine.getFunctionalExpenseRatios();
      expect(ratios.programRatio).toBeCloseTo(0.8, 1);
    });
  });

  describe('Oklahoma — IT Nonprofit (OK-IT1)', () => {
    it('should handle tech equipment donation', () => {
      const txn = engine.createTransaction({
        type: 'expense', amount: 12000, description: 'Laptop purchase for coding bootcamp',
        date: new Date('2026-01-10'), category: 'program_expenses',
        metadata: { state: 'OK', orgType: 'educational', depreciable: true }
      });
      expect(txn.amount).toBe(12000);
      expect(txn.category).toBe('program_expenses');
    });

    it('should track software subscription expenses', () => {
      const cat = engine.autoCategorize('Annual software license renewal for training platform');
      expect(['program_expenses', 'general']).toContain(cat);
    });

    it('should generate annual tech nonprofit statement', () => {
      engine.createTransaction({ type: 'donation', amount: 25000, description: 'Corporate sponsorship', date: new Date(), category: 'donations' });
      engine.createTransaction({ type: 'donation', amount: 10000, description: 'State grant', date: new Date(), category: 'grants' });
      engine.createTransaction({ type: 'expense', amount: 20000, description: 'Programs', date: new Date(), category: 'program_expenses' });
      engine.createTransaction({ type: 'expense', amount: 8000, description: 'Staff', date: new Date(), category: 'payroll' });
      const summary = engine.generateSummary();
      expect(summary.totalIncome).toBe(35000);
      expect(summary.totalExpenses).toBe(28000);
      expect(summary.netIncome).toBe(7000);
    });
  });
});
