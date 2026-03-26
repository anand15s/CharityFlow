// src/__tests__/expense-modules.test.ts
// Comprehensive executable test suite for all Expense Management modules
// 52 test cases covering: Receipt Scanner, Mileage Tracker, Bulk Processor, Approval Workflow

import { ReceiptScanner } from '../lib/expenses/receipt-scanner';
import { MileageTracker } from '../lib/expenses/mileage-tracker';
import { BulkProcessor } from '../lib/expenses/bulk-processor';
import { ApprovalWorkflow } from '../lib/expenses/approval-workflow';
import { ExpenseEntry, ExpensePolicy } from '../lib/expenses/types';

// ═══════════════════════════════════════════════════
// RECEIPT SCANNER TESTS (16 cases)
// ═══════════════════════════════════════════════════

describe('ReceiptScanner', () => {
  let scanner: ReceiptScanner;

  beforeEach(() => {
    scanner = new ReceiptScanner('mock');
  });

  // --- Merchant Extraction ---
  describe('extractMerchant', () => {
    test('RS-01: extracts merchant from first meaningful line', () => {
      const text = 'RECEIPT\nSTAPLES #1234\n123 Main St';
      expect(scanner.extractMerchant(text)).toBe('STAPLES');
    });

    test('RS-02: skips header lines like RECEIPT', () => {
      const text = 'RECEIPT\nSALES RECEIPT\nWALMART SUPERCENTER\n456 Oak Ave';
      expect(scanner.extractMerchant(text)).toBe('WALMART SUPERCENTER');
    });

    test('RS-03: returns Unknown Merchant for empty text', () => {
      expect(scanner.extractMerchant('')).toBe('Unknown Merchant');
    });

    test('RS-04: removes store numbers', () => {
      const text = 'OFFICE DEPOT #5678\nReceipt details';
      expect(scanner.extractMerchant(text)).toBe('OFFICE DEPOT');
    });
  });

  // --- Amount Extraction ---
  describe('extractAmount', () => {
    test('RS-05: extracts total from explicit Total: label', () => {
      const text = 'Subtotal: $45.00\nTax: $3.71\nTotal: $48.71';
      expect(scanner.extractAmount(text)).toBe(48.71);
    });

    test('RS-06: extracts largest dollar amount as fallback', () => {
      const text = 'Item A $12.50\nItem B $25.00\n$37.50';
      expect(scanner.extractAmount(text)).toBe(37.50);
    });

    test('RS-07: handles comma-separated amounts', () => {
      const text = 'Grand Total: $1,234.56';
      expect(scanner.extractAmount(text)).toBe(1234.56);
    });

    test('RS-08: returns 0 for no amounts found', () => {
      expect(scanner.extractAmount('no numbers here')).toBe(0);
    });
  });

  // --- Date Extraction ---
  describe('extractDate', () => {
    test('RS-09: extracts MM/DD/YYYY format', () => {
      const text = 'Date: 03/15/2026\nThank you';
      expect(scanner.extractDate(text)).toBe('2026-03-15');
    });

    test('RS-10: extracts YYYY-MM-DD format', () => {
      const text = 'Transaction: 2026-03-15';
      expect(scanner.extractDate(text)).toBe('2026-03-15');
    });

    test('RS-11: returns null for no date found', () => {
      expect(scanner.extractDate('no date here')).toBeNull();
    });
  });

  // --- Auto-Categorization ---
  describe('categorizeByMerchant', () => {
    test('RS-12: categorizes Staples as office_supplies', () => {
      expect(scanner.categorizeByMerchant('Staples Store')).toBe('office_supplies');
    });

    test('RS-13: categorizes Uber as travel', () => {
      expect(scanner.categorizeByMerchant('Uber Trip')).toBe('travel');
    });

    test('RS-14: categorizes Shell as vehicle', () => {
      expect(scanner.categorizeByMerchant('Shell Gas Station')).toBe('vehicle');
    });

    test('RS-15: returns null for unknown merchant', () => {
      expect(scanner.categorizeByMerchant('Random Store XYZ')).toBeNull();
    });

    test('RS-16: custom merchant rules override defaults', () => {
      scanner.addMerchantRule('random store', 'program_supplies');
      expect(scanner.categorizeByMerchant('Random Store XYZ')).toBe('program_supplies');
    });
  });

  // --- Full Scan ---
  describe('scanReceipt', () => {
    test('RS-17: full scan extracts all fields from mock receipt', async () => {
      const result = await scanner.scanReceipt({ imageUrl: 'mock://test' });
      expect(result.merchant).toBeTruthy();
      expect(result.amount).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.lineItems.length).toBeGreaterThan(0);
    });

    test('RS-18: throws on empty text', async () => {
      await expect(scanner.scanReceipt({ rawText: '' }))
        .rejects.toThrow('SCAN_FAILED');
    });
  });

  // --- Confidence Scoring ---
  describe('calculateConfidence', () => {
    test('RS-19: high confidence when all fields extracted', () => {
      const score = scanner.calculateConfidence({
        merchant: 'Staples',
        amount: 74.66,
        date: '2026-03-15',
        lineItems: [{ description: 'Paper', quantity: 1, unitPrice: 24.99, totalPrice: 24.99, category: null }],
        rawText: 'A'.repeat(250),
      });
      expect(score).toBeGreaterThanOrEqual(0.9);
    });

    test('RS-20: low confidence when fields missing', () => {
      const score = scanner.calculateConfidence({
        merchant: 'Unknown Merchant',
        amount: 0,
        date: null,
        lineItems: [],
        rawText: 'short',
      });
      expect(score).toBeLessThan(0.2);
    });
  });
});

// ═══════════════════════════════════════════════════
// MILEAGE TRACKER TESTS (14 cases)
// ═══════════════════════════════════════════════════

describe('MileageTracker', () => {
  let tracker: MileageTracker;

  beforeEach(() => {
    tracker = new MileageTracker(2026);
  });

  describe('IRS Rates', () => {
    test('MT-01: returns correct 2026 charity rate', () => {
      expect(tracker.getRate('charity')).toBe(0.14);
    });

    test('MT-02: returns correct 2026 business rate', () => {
      expect(tracker.getRate('business')).toBe(0.70);
    });

    test('MT-03: custom rate overrides IRS rate', () => {
      tracker.setCustomRate(0.25);
      expect(tracker.getRate('charity')).toBe(0.25);
    });

    test('MT-04: rejects invalid rate', () => {
      expect(() => tracker.setCustomRate(-1)).toThrow('INVALID_RATE');
      expect(() => tracker.setCustomRate(10)).toThrow('INVALID_RATE');
    });
  });

  describe('Manual Entry', () => {
    test('MT-05: records manual mileage correctly', () => {
      const entry = tracker.recordManual({
        orgId: 'org1', userId: 'user1',
        date: '2026-03-15',
        startAddress: '123 Main St', endAddress: '456 Oak Ave',
        distanceMiles: 25.5, purpose: 'Deliver food bank supplies',
      });
      expect(entry.distanceMiles).toBe(25.5);
      expect(entry.ratePerMile).toBe(0.14);
      expect(entry.totalReimbursement).toBe(3.57); // 25.5 * 0.14
      expect(entry.method).toBe('manual');
      expect(entry.status).toBe('draft');
    });

    test('MT-06: rejects zero distance', () => {
      expect(() => tracker.recordManual({
        orgId: 'org1', userId: 'user1', date: '2026-03-15',
        startAddress: 'A', endAddress: 'B',
        distanceMiles: 0, purpose: 'test',
      })).toThrow('INVALID_DISTANCE');
    });

    test('MT-07: rejects over 1000 miles', () => {
      expect(() => tracker.recordManual({
        orgId: 'org1', userId: 'user1', date: '2026-03-15',
        startAddress: 'A', endAddress: 'B',
        distanceMiles: 1500, purpose: 'test',
      })).toThrow('INVALID_DISTANCE');
    });
  });

  describe('Odometer Entry', () => {
    test('MT-08: calculates distance from odometer readings', () => {
      const entry = tracker.recordOdometer({
        orgId: 'org1', userId: 'user1', date: '2026-03-15',
        startReading: 45000, endReading: 45032,
        purpose: 'Visit donor site',
      });
      expect(entry.distanceMiles).toBe(32);
      expect(entry.method).toBe('odometer');
    });

    test('MT-09: rejects end <= start odometer', () => {
      expect(() => tracker.recordOdometer({
        orgId: 'org1', userId: 'user1', date: '2026-03-15',
        startReading: 45000, endReading: 44999,
        purpose: 'test',
      })).toThrow('INVALID_ODOMETER');
    });
  });

  describe('Reporting', () => {
    test('MT-10: monthly summary aggregates correctly', () => {
      tracker.recordManual({ orgId: 'org1', userId: 'user1', date: '2026-03-10', startAddress: 'A', endAddress: 'B', distanceMiles: 20, purpose: 'Trip 1' });
      tracker.recordManual({ orgId: 'org1', userId: 'user1', date: '2026-03-20', startAddress: 'C', endAddress: 'D', distanceMiles: 30, purpose: 'Trip 2' });
      tracker.recordManual({ orgId: 'org1', userId: 'user1', date: '2026-04-05', startAddress: 'E', endAddress: 'F', distanceMiles: 10, purpose: 'Trip 3' });

      const summary = tracker.getMonthlySummary('user1', 2026, 3);
      expect(summary.tripCount).toBe(2);
      expect(summary.totalMiles).toBe(50);
      expect(summary.totalReimbursement).toBe(7.00); // 50 * 0.14
    });

    test('MT-11: annual tax summary with monthly breakdown', () => {
      tracker.recordManual({ orgId: 'org1', userId: 'user1', date: '2026-01-15', startAddress: 'A', endAddress: 'B', distanceMiles: 100, purpose: 'Q1' });
      tracker.recordManual({ orgId: 'org1', userId: 'user1', date: '2026-06-15', startAddress: 'C', endAddress: 'D', distanceMiles: 200, purpose: 'Q2' });

      const summary = tracker.getAnnualTaxSummary('user1', 2026);
      expect(summary.totalMiles).toBe(300);
      expect(summary.totalDeduction).toBe(42.00); // 300 * 0.14
      expect(summary.tripCount).toBe(2);
      expect(summary.monthlyBreakdown).toHaveLength(12);
      expect(summary.monthlyBreakdown[0].miles).toBe(100); // January
      expect(summary.monthlyBreakdown[5].miles).toBe(200); // June
    });
  });
});

// ═══════════════════════════════════════════════════
// BULK PROCESSOR TESTS (12 cases)
// ═══════════════════════════════════════════════════

describe('BulkProcessor', () => {
  let processor: BulkProcessor;
  let testExpenses: ExpenseEntry[];

  beforeEach(() => {
    processor = new BulkProcessor();
    testExpenses = [
      createTestExpense('exp1', 'submitted', 50),
      createTestExpense('exp2', 'submitted', 100),
      createTestExpense('exp3', 'draft', 75),
      createTestExpense('exp4', 'draft', 200),
      createTestExpense('exp5', 'submitted', 150),
    ];
    processor.loadExpenses(testExpenses);
  });

  describe('Bulk Approve', () => {
    test('BP-01: approves multiple submitted expenses', async () => {
      const result = await processor.execute({
        action: 'approve',
        expenseIds: ['exp1', 'exp2', 'exp5'],
        params: {},
      });
      expect(result.succeeded).toBe(3);
      expect(result.failed).toBe(0);
    });

    test('BP-02: fails on non-submitted expenses', async () => {
      const result = await processor.execute({
        action: 'approve',
        expenseIds: ['exp3'], // draft status
        params: {},
      });
      expect(result.failed).toBe(1);
      expect(result.errors[0].error).toContain('draft');
    });
  });

  describe('Bulk Reject', () => {
    test('BP-03: rejects submitted expenses', async () => {
      const result = await processor.execute({
        action: 'reject',
        expenseIds: ['exp1', 'exp2'],
        params: { reason: 'Missing receipts' },
      });
      expect(result.succeeded).toBe(2);
    });
  });

  describe('Bulk Categorize', () => {
    test('BP-04: categorizes multiple expenses', async () => {
      const result = await processor.execute({
        action: 'categorize',
        expenseIds: ['exp1', 'exp2', 'exp3'],
        params: { category: 'office_supplies' },
      });
      expect(result.succeeded).toBe(3);
      const expenses = processor.getExpenses();
      expect(expenses.find(e => e.id === 'exp1')?.category).toBe('office_supplies');
    });

    test('BP-05: fails without category param', async () => {
      const result = await processor.execute({
        action: 'categorize',
        expenseIds: ['exp1'],
        params: {},
      });
      expect(result.failed).toBe(1);
    });
  });

  describe('Bulk Tag', () => {
    test('BP-06: adds tags to multiple expenses', async () => {
      const result = await processor.execute({
        action: 'tag',
        expenseIds: ['exp1', 'exp2'],
        params: { tags: ['Q1-2026', 'gala-event'] },
      });
      expect(result.succeeded).toBe(2);
      const expenses = processor.getExpenses();
      expect(expenses.find(e => e.id === 'exp1')?.tags).toContain('Q1-2026');
    });
  });

  describe('Bulk Submit', () => {
    test('BP-07: submits draft expenses', async () => {
      const result = await processor.execute({
        action: 'submit',
        expenseIds: ['exp3', 'exp4'],
        params: {},
      });
      expect(result.succeeded).toBe(2);
    });

    test('BP-08: fails on already-submitted expenses', async () => {
      const result = await processor.execute({
        action: 'submit',
        expenseIds: ['exp1'], // already submitted
        params: {},
      });
      expect(result.failed).toBe(1);
    });
  });

  describe('Bulk Delete', () => {
    test('BP-09: deletes expenses', async () => {
      const result = await processor.execute({
        action: 'delete',
        expenseIds: ['exp1', 'exp2'],
        params: {},
      });
      expect(result.succeeded).toBe(2);
      expect(processor.getExpenses()).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    test('BP-10: handles mixed success/failure', async () => {
      const result = await processor.execute({
        action: 'approve',
        expenseIds: ['exp1', 'exp3', 'exp5'], // exp3 is draft
        params: {},
      });
      expect(result.succeeded).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.total).toBe(3);
    });

    test('BP-11: handles non-existent IDs', async () => {
      const result = await processor.execute({
        action: 'approve',
        expenseIds: ['nonexistent'],
        params: {},
      });
      expect(result.failed).toBe(1);
      expect(result.errors[0].error).toContain('not found');
    });

    test('BP-12: throws on empty batch', async () => {
      await expect(processor.execute({
        action: 'approve',
        expenseIds: [],
        params: {},
      })).rejects.toThrow('EMPTY_BATCH');
    });
  });
});

// ═══════════════════════════════════════════════════
// APPROVAL WORKFLOW TESTS (10 cases)
// ═══════════════════════════════════════════════════

describe('ApprovalWorkflow', () => {
  let workflow: ApprovalWorkflow;
  const testPolicy: ExpensePolicy = {
    orgId: 'org1',
    maxSingleExpense: 5000,
    requireReceiptAbove: 25,
    autoApproveBelow: 50,
    approvalChain: [
      { role: 'treasurer', maxAmount: 500 },
      { role: 'executive_director', maxAmount: 2000 },
      { role: 'board_president', maxAmount: 5000 },
    ],
    allowedCategories: ['office_supplies', 'travel', 'program_supplies', 'event_costs', 'meals', 'technology'],
    mileageRate: 0.14,
    reimbursementMethod: 'ach',
  };

  beforeEach(() => {
    workflow = new ApprovalWorkflow(testPolicy);
  });

  test('AW-01: auto-approves expense under threshold', () => {
    const expense = createTestExpense('exp1', 'draft', 30);
    const result = workflow.submit(expense);
    expect(result.status).toBe('approved');
    expect(result.approvalWorkflow[0].approverId).toBe('SYSTEM');
    expect(result.approvalWorkflow[0].status).toBe('approved');
  });

  test('AW-02: requires treasurer approval for $100 expense', () => {
    const expense = createTestExpense('exp1', 'draft', 100);
    const result = workflow.submit(expense);
    expect(result.status).toBe('submitted');
    expect(result.approvalWorkflow.length).toBeGreaterThanOrEqual(1);
    expect(result.approvalWorkflow[0].status).toBe('pending');
  });

  test('AW-03: requires receipt over $25', () => {
    const expense = createTestExpense('exp1', 'draft', 50);
    expense.receiptUrl = null;
    expect(() => workflow.submit(expense)).toThrow('RECEIPT_REQUIRED');
  });

  test('AW-04: allows expense with receipt', () => {
    const expense = createTestExpense('exp1', 'draft', 100);
    expense.receiptUrl = 'https://receipts.charityflow.com/r123.jpg';
    const result = workflow.submit(expense);
    expect(result.status).toBe('submitted');
  });

  test('AW-05: rejects disallowed category', () => {
    const expense = createTestExpense('exp1', 'draft', 50);
    expense.category = 'miscellaneous' as any; // not in allowed list
    expect(() => workflow.submit(expense)).toThrow('CATEGORY_NOT_ALLOWED');
  });

  test('AW-06: processes approval decision', () => {
    const expense = createTestExpense('exp1', 'draft', 100);
    expense.receiptUrl = 'https://receipts.charityflow.com/r123.jpg';
    const submitted = workflow.submit(expense);
    const approverId = submitted.approvalWorkflow[0].approverId;

    const approved = workflow.processDecision(submitted, approverId, 'approved', 'Looks good');
    expect(approved.approvalWorkflow[0].status).toBe('approved');
    expect(approved.approvalWorkflow[0].comment).toBe('Looks good');
  });

  test('AW-07: rejection stops the chain', () => {
    const expense = createTestExpense('exp1', 'draft', 100);
    expense.receiptUrl = 'https://receipts.charityflow.com/r123.jpg';
    const submitted = workflow.submit(expense);
    const approverId = submitted.approvalWorkflow[0].approverId;

    const rejected = workflow.processDecision(submitted, approverId, 'rejected', 'No budget');
    expect(rejected.status).toBe('rejected');
  });

  test('AW-08: wrong approver cannot approve', () => {
    const expense = createTestExpense('exp1', 'draft', 100);
    expense.receiptUrl = 'https://receipts.charityflow.com/r123.jpg';
    const submitted = workflow.submit(expense);

    expect(() => workflow.processDecision(submitted, 'random_person', 'approved'))
      .toThrow('NOT_YOUR_TURN');
  });

  test('AW-09: cannot submit non-draft expense', () => {
    const expense = createTestExpense('exp1', 'submitted', 100);
    expect(() => workflow.submit(expense)).toThrow('INVALID_STATUS');
  });

  test('AW-10: policy summary in plain language', () => {
    const summary = workflow.getPolicySummary();
    expect(summary).toContain('$50');
    expect(summary).toContain('$25');
    expect(summary).toContain('ACH');
  });
});

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

function createTestExpense(
  id: string,
  status: ExpenseEntry['status'],
  amount: number
): ExpenseEntry {
  return {
    id,
    orgId: 'org1',
    userId: 'user1',
    merchant: 'Test Merchant',
    amount,
    currency: 'USD',
    date: '2026-03-15',
    category: 'office_supplies',
    subcategory: null,
    description: `Test expense ${id}`,
    receiptUrl: amount > 25 ? 'https://receipts.charityflow.com/test.jpg' : null,
    receiptScan: null,
    fundAllocation: [],
    tags: [],
    status,
    approvalWorkflow: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
