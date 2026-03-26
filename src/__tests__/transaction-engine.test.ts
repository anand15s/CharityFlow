// CharityFlow Transaction Engine — Unit Tests
// v3.0 — 38 test cases covering all modules

import {
  createTransaction, updateTransaction, voidTransaction,
  autoCategorize, translateToPlainLanguage,
  reconcileBankFeed, splitTransaction,
  generateRecurringTransaction, calculateNextDate,
  generateTransactionSummary, calculateFunctionalExpenseRatio,
  validateTransaction,
} from '../lib/transactions/transaction-engine';
import { Transaction, BankFeedEntry, RecurringTransaction } from '../lib/transactions/types';

// ============================================================
// TEST HELPERS
// ============================================================
const mockOrg = 'org_test_001';
const mockUser = 'user_test_001';

function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return createTransaction(mockOrg, {
    type: 'donation',
    amount: 100,
    description: 'Test donation from John',
    paymentMethod: 'online',
    ...overrides,
  }, mockUser);
}

function createMockBankEntry(overrides: Partial<BankFeedEntry> = {}): BankFeedEntry {
  return {
    id: `bank_${Date.now()}`,
    bankAccountId: 'acct_001',
    externalId: `ext_${Date.now()}`,
    date: new Date('2026-03-15'),
    amount: 100,
    description: 'Test donation from John',
    matched: false,
    matchConfidence: 0,
    ...overrides,
  };
}

// ============================================================
// 1. PLAIN LANGUAGE TRANSLATION (4 tests)
// ============================================================
describe('Plain Language Translation', () => {
  test('T-PL-01: Translates transaction types to plain language', () => {
    expect(translateToPlainLanguage('donation')).toBe('Money Received');
    expect(translateToPlainLanguage('expense')).toBe('Money Spent');
    expect(translateToPlainLanguage('transfer')).toBe('Money Moved');
    expect(translateToPlainLanguage('refund')).toBe('Money Returned');
  });

  test('T-PL-02: Translates statuses to plain language', () => {
    expect(translateToPlainLanguage('pending')).toBe('Waiting to Clear');
    expect(translateToPlainLanguage('reconciled')).toBe('Matched with Bank');
    expect(translateToPlainLanguage('flagged')).toBe('Needs Review');
  });

  test('T-PL-03: Translates functional categories', () => {
    expect(translateToPlainLanguage('program')).toBe('Mission Work');
    expect(translateToPlainLanguage('admin')).toBe('Running the Office');
    expect(translateToPlainLanguage('fundraising')).toBe('Raising Money');
  });

  test('T-PL-04: Returns original term for unknown inputs', () => {
    expect(translateToPlainLanguage('unknown_term')).toBe('unknown_term');
    expect(translateToPlainLanguage('CustomCategory')).toBe('CustomCategory');
  });
});

// ============================================================
// 2. AUTO-CATEGORIZATION (6 tests)
// ============================================================
describe('Auto-Categorization Engine', () => {
  test('T-AC-01: Categorizes donations correctly', () => {
    const result = autoCategorize('Monthly tithe from Smith family', 500);
    expect(result.category).toBe('Donations');
    expect(result.functionalCategory).toBe('program');
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  test('T-AC-02: Categorizes grants correctly', () => {
    const result = autoCategorize('Community Foundation Grant Q1 2026', 10000);
    expect(result.category).toBe('Grants');
    expect(result.functionalCategory).toBe('program');
  });

  test('T-AC-03: Categorizes utility expenses', () => {
    const result = autoCategorize('Electric bill - March 2026', -245);
    expect(result.category).toBe('Utilities');
    expect(result.functionalCategory).toBe('admin');
  });

  test('T-AC-04: Categorizes event expenses as fundraising', () => {
    const result = autoCategorize('Annual gala venue deposit', -5000);
    expect(result.category).toBe('Events');
    expect(result.functionalCategory).toBe('fundraising');
  });

  test('T-AC-05: Falls back to Other Income for unrecognized positive amounts', () => {
    const result = autoCategorize('xyz123 unrecognizable entry', 100);
    expect(result.category).toBe('Other Income');
    expect(result.confidence).toBe(0.5);
  });

  test('T-AC-06: Applies custom rules with higher priority', () => {
    const customRules = [{
      id: 'custom1', orgId: 'org1', pattern: 'xyz123',
      category: 'Custom Category', functionalCategory: 'program' as const,
      confidence: 0.95, isDefault: false,
    }];
    const result = autoCategorize('xyz123 unrecognizable entry', 100, customRules);
    expect(result.category).toBe('Custom Category');
    expect(result.confidence).toBe(0.95);
  });
});

// ============================================================
// 3. TRANSACTION CRUD (8 tests)
// ============================================================
describe('Transaction CRUD Operations', () => {
  test('T-CR-01: Creates a donation with all fields', () => {
    const txn = createMockTransaction();
    expect(txn.id).toBeDefined();
    expect(txn.orgId).toBe(mockOrg);
    expect(txn.type).toBe('donation');
    expect(txn.amount).toBe(100);
    expect(txn.status).toBe('pending');
    expect(txn.auditLog).toHaveLength(1);
    expect(txn.auditLog[0].action).toBe('CREATED');
  });

  test('T-CR-02: Auto-detects type from amount sign', () => {
    const income = createTransaction(mockOrg, { amount: 500, description: 'General income' }, mockUser);
    expect(income.type).toBe('donation');

    const expense = createTransaction(mockOrg, { amount: -200, description: 'Office supplies', type: 'expense' }, mockUser);
    expect(expense.type).toBe('expense');
  });

  test('T-CR-03: Generates plain language description', () => {
    const txn = createMockTransaction({ paymentMethod: 'check' });
    expect(txn.plainDescription).toContain('Money Received');
    expect(txn.plainDescription).toContain('$100.00');
    expect(txn.plainDescription).toContain('Check');
  });

  test('T-CR-04: Updates transaction with audit trail', () => {
    const txn = createMockTransaction();
    const updated = updateTransaction(txn, { amount: 200 }, mockUser);
    expect(updated.amount).toBe(200);
    expect(updated.auditLog).toHaveLength(2);
    expect(updated.auditLog[1].action).toBe('UPDATED');
    expect(updated.auditLog[1].previousValue.amount).toBe(100);
    expect(updated.auditLog[1].newValue.amount).toBe(200);
  });

  test('T-CR-05: Void transaction records reason', () => {
    const txn = createMockTransaction();
    const voided = voidTransaction(txn, mockUser, 'Duplicate entry');
    expect(voided.status).toBe('voided');
    expect(voided.notes).toContain('VOIDED: Duplicate entry');
  });

  test('T-CR-06: Cannot void already-voided transaction', () => {
    const txn = createMockTransaction();
    const voided = voidTransaction(txn, mockUser, 'Test');
    expect(() => voidTransaction(voided, mockUser, 'Again')).toThrow('already voided');
  });

  test('T-CR-07: Sets taxDeductible=true for donations', () => {
    const txn = createMockTransaction({ type: 'donation' });
    expect(txn.taxDeductible).toBe(true);
  });

  test('T-CR-08: Sets correct tax year', () => {
    const txn = createMockTransaction();
    expect(txn.taxYear).toBe(new Date().getFullYear());
  });
});

// ============================================================
// 4. VALIDATION (5 tests)
// ============================================================
describe('Transaction Validation', () => {
  test('T-VL-01: Rejects zero amount', () => {
    expect(() => createTransaction(mockOrg, { amount: 0, description: 'Test' }, mockUser))
      .toThrow('Amount cannot be zero');
  });

  test('T-VL-02: Rejects empty description', () => {
    expect(() => createTransaction(mockOrg, { amount: 100, description: '' }, mockUser))
      .toThrow('Description is required');
  });

  test('T-VL-03: Rejects negative donation amount', () => {
    expect(() => createTransaction(mockOrg, { 
      amount: -50, type: 'donation', description: 'Bad donation' 
    }, mockUser)).toThrow('Donations must have a positive amount');
  });

  test('T-VL-04: Rejects positive expense amount', () => {
    expect(() => createTransaction(mockOrg, { 
      amount: 50, type: 'expense', description: 'Bad expense' 
    }, mockUser)).toThrow('Expenses must have a negative amount');
  });

  test('T-VL-05: Accepts valid transaction without errors', () => {
    expect(() => createMockTransaction()).not.toThrow();
  });
});

// ============================================================
// 5. BANK RECONCILIATION (5 tests)
// ============================================================
describe('Bank Feed Reconciliation ("Match Your Bank")', () => {
  test('T-BR-01: Exact match by amount + date + description', () => {
    const txn = createMockTransaction({ date: new Date('2026-03-15') });
    const bankEntry = createMockBankEntry();
    const result = reconcileBankFeed([bankEntry], [txn]);
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.matchRate).toBe(1);
  });

  test('T-BR-02: Fuzzy match with close date', () => {
    const txn = createMockTransaction({ date: new Date('2026-03-14') });
    const bankEntry = createMockBankEntry({ date: new Date('2026-03-15') });
    const result = reconcileBankFeed([bankEntry], [txn]);
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].matchType).toBe('exact'); // within 1 day still high confidence
  });

  test('T-BR-03: No match for different amounts', () => {
    const txn = createMockTransaction({ amount: 500, date: new Date('2026-03-15') });
    const bankEntry = createMockBankEntry({ amount: 100 });
    const result = reconcileBankFeed([bankEntry], [txn]);
    expect(result.matched).toHaveLength(0);
    expect(result.unmatched).toHaveLength(1);
  });

  test('T-BR-04: Skips voided transactions', () => {
    const txn = createMockTransaction({ date: new Date('2026-03-15'), status: 'voided' } as any);
    // Force status to voided (bypassing create validation)
    (txn as any).status = 'voided';
    const bankEntry = createMockBankEntry();
    const result = reconcileBankFeed([bankEntry], [txn]);
    expect(result.matched).toHaveLength(0);
  });

  test('T-BR-05: Calculates correct match rate', () => {
    const txns = [
      createMockTransaction({ amount: 100, date: new Date('2026-03-15') }),
      createMockTransaction({ amount: 200, date: new Date('2026-03-15') }),
    ];
    const entries = [
      createMockBankEntry({ amount: 100 }),
      createMockBankEntry({ amount: 200, description: 'Different description' }),
      createMockBankEntry({ amount: 999 }),
    ];
    const result = reconcileBankFeed(entries, txns);
    expect(result.matched.length).toBeGreaterThanOrEqual(1);
    expect(result.matchRate).toBeGreaterThan(0);
    expect(result.matchRate).toBeLessThanOrEqual(1);
  });
});

// ============================================================
// 6. SPLIT TRANSACTIONS (4 tests)
// ============================================================
describe('Split Transactions', () => {
  test('T-SP-01: Splits transaction into equal parts', () => {
    const txn = createMockTransaction({ amount: -1000, type: 'expense', description: 'Office and program expense' });
    const splits = splitTransaction(txn, [
      { amount: 600, category: 'Program Services', functionalCategory: 'program', description: 'Program costs' },
      { amount: 400, category: 'Office', functionalCategory: 'admin', description: 'Admin costs' },
    ], mockUser);
    expect(splits).toHaveLength(2);
    expect(splits[0].amount).toBe(-600);
    expect(splits[1].amount).toBe(-400);
    expect(splits[0].functionalCategory).toBe('program');
    expect(splits[1].functionalCategory).toBe('admin');
  });

  test('T-SP-02: Rejects splits that dont sum to total', () => {
    const txn = createMockTransaction({ amount: -1000, type: 'expense', description: 'Test expense' });
    expect(() => splitTransaction(txn, [
      { amount: 500, category: 'A', functionalCategory: 'program', description: 'A' },
      { amount: 300, category: 'B', functionalCategory: 'admin', description: 'B' },
    ], mockUser)).toThrow('must equal transaction amount');
  });

  test('T-SP-03: Rejects single split', () => {
    const txn = createMockTransaction({ amount: -100, type: 'expense', description: 'Test' });
    expect(() => splitTransaction(txn, [
      { amount: 100, category: 'A', functionalCategory: 'program', description: 'A' },
    ], mockUser)).toThrow('at least 2 splits');
  });

  test('T-SP-04: Tags splits with parent reference', () => {
    const txn = createMockTransaction({ amount: -200, type: 'expense', description: 'Mixed expense' });
    const splits = splitTransaction(txn, [
      { amount: 100, category: 'A', functionalCategory: 'program', description: 'A' },
      { amount: 100, category: 'B', functionalCategory: 'admin', description: 'B' },
    ], mockUser);
    expect(splits[0].tags).toContain('split');
    expect(splits[0].tags.some(t => t.startsWith('parent:'))).toBe(true);
  });
});

// ============================================================
// 7. RECURRING TRANSACTIONS (3 tests)
// ============================================================
describe('Recurring Transactions', () => {
  test('T-RC-01: Generates monthly recurring transaction', () => {
    const recurring: RecurringTransaction = {
      id: 'rec_001', orgId: mockOrg,
      templateTransaction: { type: 'expense', amount: -500, description: 'Monthly rent' },
      frequency: 'monthly', nextDate: new Date('2026-01-01'),
      isActive: true, totalGenerated: 0,
    };
    const txn = generateRecurringTransaction(recurring, mockUser);
    expect(txn).not.toBeNull();
    expect(txn!.description).toBe('Monthly rent');
    expect(txn!.tags).toContain('recurring');
  });

  test('T-RC-02: Skips inactive recurring', () => {
    const recurring: RecurringTransaction = {
      id: 'rec_002', orgId: mockOrg,
      templateTransaction: { type: 'expense', amount: -100, description: 'Cancelled sub' },
      frequency: 'monthly', nextDate: new Date('2026-01-01'),
      isActive: false, totalGenerated: 5,
    };
    const txn = generateRecurringTransaction(recurring, mockUser);
    expect(txn).toBeNull();
  });

  test('T-RC-03: Calculates next dates correctly', () => {
    const base = new Date('2026-03-15');
    expect(calculateNextDate(base, 'weekly').getDate()).toBe(22);
    expect(calculateNextDate(base, 'monthly').getMonth()).toBe(3); // April
    expect(calculateNextDate(base, 'quarterly').getMonth()).toBe(5); // June
    expect(calculateNextDate(base, 'annually').getFullYear()).toBe(2027);
  });
});

// ============================================================
// 8. FINANCIAL REPORTING (3 tests)
// ============================================================
describe('Financial Reporting', () => {
  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-12-31');

  test('T-FR-01: Calculates income, expenses, and net correctly', () => {
    const txns = [
      createMockTransaction({ amount: 5000, description: 'Big donation', date: new Date('2026-06-01') }),
      createMockTransaction({ amount: 3000, description: 'Grant funding', date: new Date('2026-07-01') }),
      createMockTransaction({ amount: -2000, type: 'expense', description: 'Office rent', date: new Date('2026-06-15') }),
    ];
    const summary = generateTransactionSummary(txns, startDate, endDate);
    expect(summary.totalIncome).toBe(8000);
    expect(summary.totalExpenses).toBe(2000);
    expect(summary.netIncome).toBe(6000);
    expect(summary.transactionCount).toBe(3);
  });

  test('T-FR-02: Groups by functional category', () => {
    const txns = [
      createMockTransaction({ amount: -1000, type: 'expense', description: 'Program supplies', functionalCategory: 'program', date: new Date('2026-06-01') }),
      createMockTransaction({ amount: -500, type: 'expense', description: 'Office rent', functionalCategory: 'admin', date: new Date('2026-06-01') }),
      createMockTransaction({ amount: -200, type: 'expense', description: 'Gala printing', functionalCategory: 'fundraising', date: new Date('2026-06-01') }),
    ];
    const summary = generateTransactionSummary(txns, startDate, endDate);
    expect(summary.byFunctionalCategory.program).toBe(1000);
    expect(summary.byFunctionalCategory.admin).toBe(500);
    expect(summary.byFunctionalCategory.fundraising).toBe(200);
  });

  test('T-FR-03: Functional expense ratio healthy check', () => {
    const summary = {
      totalIncome: 10000, totalExpenses: 5000, netIncome: 5000,
      byCategory: {}, byFund: {}, byProgram: {},
      byFunctionalCategory: { program: 4000, admin: 700, fundraising: 300 },
      transactionCount: 10, averageTransactionSize: 500,
      period: { start: startDate, end: endDate },
    };
    const ratio = calculateFunctionalExpenseRatio(summary);
    expect(ratio.programRatio).toBe(0.8);
    expect(ratio.isHealthy).toBe(true);
    expect(ratio.recommendation).toContain('Great job');
  });
});
