import { BulkProcessor, BulkAction, BulkResult } from '../lib/expenses/bulk-processor';

describe('Bulk Expense Processor', () => {
  let processor: BulkProcessor;

  beforeEach(() => {
    processor = new BulkProcessor();
  });

  describe('Bulk Approve', () => {
    it('should approve multiple expenses at once', () => {
      const expenses = [
        { id: 'exp-1', amount: 50, status: 'pending' },
        { id: 'exp-2', amount: 75, status: 'pending' },
        { id: 'exp-3', amount: 120, status: 'pending' }
      ];
      const result = processor.bulkApprove(expenses, 'treasurer@temple.org');
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
    });

    it('should skip already approved expenses', () => {
      const expenses = [
        { id: 'exp-1', amount: 50, status: 'approved' },
        { id: 'exp-2', amount: 75, status: 'pending' }
      ];
      const result = processor.bulkApprove(expenses, 'admin@org.org');
      expect(result.successCount).toBe(1);
      expect(result.skippedCount).toBe(1);
    });
  });

  describe('Bulk Reject', () => {
    it('should reject with reason', () => {
      const expenses = [
        { id: 'exp-1', amount: 500, status: 'pending' },
        { id: 'exp-2', amount: 200, status: 'pending' }
      ];
      const result = processor.bulkReject(expenses, 'Missing receipts', 'admin@org.org');
      expect(result.successCount).toBe(2);
      result.results.forEach(r => expect(r.rejectionReason).toBe('Missing receipts'));
    });
  });

  describe('Bulk Categorize', () => {
    it('should apply category to multiple expenses', () => {
      const expenses = [
        { id: 'exp-1', amount: 30, category: 'general' },
        { id: 'exp-2', amount: 45, category: 'general' },
        { id: 'exp-3', amount: 90, category: 'general' }
      ];
      const result = processor.bulkCategorize(expenses, 'office_supplies');
      expect(result.successCount).toBe(3);
      result.results.forEach(r => expect(r.newCategory).toBe('office_supplies'));
    });
  });

  describe('Bulk Tag', () => {
    it('should add tags to multiple expenses', () => {
      const expenses = [{ id: 'exp-1' }, { id: 'exp-2' }];
      const result = processor.bulkTag(expenses, ['Q1-2026', 'fundraiser']);
      expect(result.successCount).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle partial failures gracefully', () => {
      const expenses = [
        { id: 'exp-1', amount: 50, status: 'pending' },
        { id: null, amount: 0, status: 'invalid' },
        { id: 'exp-3', amount: 100, status: 'pending' }
      ];
      const result = processor.bulkApprove(expenses, 'admin@org.org');
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
    });

    it('should reject empty batch', () => {
      expect(() => processor.bulkApprove([], 'admin@org.org')).toThrow();
    });
  });

  // Oklahoma state tests
  describe('Oklahoma — Temple Bulk (OK-T1)', () => {
    it('should bulk approve temple festival expenses', () => {
      const expenses = [
        { id: 'ok-t-1', amount: 200, status: 'pending', description: 'Flowers for puja' },
        { id: 'ok-t-2', amount: 150, status: 'pending', description: 'Prasad ingredients' },
        { id: 'ok-t-3', amount: 500, status: 'pending', description: 'Sound system rental' }
      ];
      const result = processor.bulkApprove(expenses, 'treasurer@oktemple.org');
      expect(result.successCount).toBe(3);
      expect(result.totalAmount).toBe(850);
    });
  });

  describe('Oklahoma — Food Bank Bulk (OK-FB1)', () => {
    it('should bulk categorize food purchases', () => {
      const expenses = [
        { id: 'ok-fb-1', amount: 1200, category: 'general' },
        { id: 'ok-fb-2', amount: 800, category: 'general' },
        { id: 'ok-fb-3', amount: 450, category: 'general' }
      ];
      const result = processor.bulkCategorize(expenses, 'program_expenses');
      expect(result.successCount).toBe(3);
    });
  });

  describe('Oklahoma — IT Nonprofit Bulk (OK-IT1)', () => {
    it('should bulk tag tech equipment purchases', () => {
      const expenses = [
        { id: 'ok-it-1', description: '5 Chromebooks' },
        { id: 'ok-it-2', description: 'WiFi routers' },
        { id: 'ok-it-3', description: 'Coding licenses' }
      ];
      const result = processor.bulkTag(expenses, ['tech-equipment', 'Q1-2026', 'grant-funded']);
      expect(result.successCount).toBe(3);
    });
  });
});
