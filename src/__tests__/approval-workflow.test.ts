import { ApprovalWorkflow, ApprovalPolicy, ApprovalStep } from '../lib/expenses/approval-workflow';

describe('Approval Workflow Engine', () => {
  let workflow: ApprovalWorkflow;

  beforeEach(() => {
    workflow = new ApprovalWorkflow({
      policies: [
        { maxAmount: 100, autoApprove: true, requireReceipt: false },
        { maxAmount: 500, autoApprove: false, requireReceipt: true, approvers: ['treasurer@org.org'] },
        { maxAmount: 5000, autoApprove: false, requireReceipt: true, approvers: ['treasurer@org.org', 'ed@org.org'] },
        { maxAmount: Infinity, autoApprove: false, requireReceipt: true, approvers: ['treasurer@org.org', 'ed@org.org', 'board@org.org'] }
      ]
    });
  });

  describe('Auto-Approve Policy', () => {
    it('should auto-approve expenses under $100', () => {
      const result = workflow.submitExpense({ amount: 50, description: 'Office pens', submitter: 'staff@org.org' });
      expect(result.status).toBe('approved');
      expect(result.autoApproved).toBe(true);
    });

    it('should not auto-approve expenses over $100', () => {
      const result = workflow.submitExpense({ amount: 150, description: 'Printer', submitter: 'staff@org.org' });
      expect(result.status).toBe('pending_approval');
      expect(result.autoApproved).toBe(false);
    });
  });

  describe('Receipt Enforcement', () => {
    it('should require receipt for expenses over $100', () => {
      const result = workflow.submitExpense({ amount: 200, description: 'Equipment', submitter: 'staff@org.org', hasReceipt: false });
      expect(result.status).toBe('receipt_required');
    });

    it('should accept expense with receipt', () => {
      const result = workflow.submitExpense({ amount: 200, description: 'Equipment', submitter: 'staff@org.org', hasReceipt: true });
      expect(result.status).toBe('pending_approval');
    });
  });

  describe('Multi-Step Approval Chain', () => {
    it('should require ED approval for $1000+ expenses', () => {
      const result = workflow.submitExpense({ amount: 1500, description: 'Conference', submitter: 'staff@org.org', hasReceipt: true });
      expect(result.requiredApprovers).toContain('ed@org.org');
    });

    it('should require board approval for $5000+ expenses', () => {
      const result = workflow.submitExpense({ amount: 8000, description: 'Vehicle', submitter: 'staff@org.org', hasReceipt: true });
      expect(result.requiredApprovers).toContain('board@org.org');
    });

    it('should process approval chain step by step', () => {
      const submission = workflow.submitExpense({ amount: 2000, description: 'Equipment', submitter: 'staff@org.org', hasReceipt: true });
      const step1 = workflow.approveStep(submission.id, 'treasurer@org.org');
      expect(step1.status).toBe('pending_approval');
      const step2 = workflow.approveStep(submission.id, 'ed@org.org');
      expect(step2.status).toBe('approved');
    });

    it('should stop chain if any approver rejects', () => {
      const submission = workflow.submitExpense({ amount: 2000, description: 'Equipment', submitter: 'staff@org.org', hasReceipt: true });
      const rejection = workflow.rejectStep(submission.id, 'treasurer@org.org', 'Not budgeted');
      expect(rejection.status).toBe('rejected');
      expect(rejection.rejectionReason).toBe('Not budgeted');
    });
  });

  describe('Wrong Approver', () => {
    it('should reject approval from unauthorized user', () => {
      const submission = workflow.submitExpense({ amount: 300, description: 'Supplies', submitter: 'staff@org.org', hasReceipt: true });
      expect(() => workflow.approveStep(submission.id, 'random@org.org')).toThrow();
    });
  });

  // Oklahoma state tests
  describe('Oklahoma — Temple Workflow (OK-T1)', () => {
    it('should auto-approve small puja supply purchases', () => {
      const result = workflow.submitExpense({ amount: 45, description: 'Incense and flowers', submitter: 'volunteer@oktemple.org' });
      expect(result.status).toBe('approved');
    });

    it('should require treasurer approval for festival budget', () => {
      const result = workflow.submitExpense({ amount: 2500, description: 'Diwali festival budget', submitter: 'coordinator@oktemple.org', hasReceipt: true });
      expect(result.requiredApprovers).toContain('treasurer@org.org');
    });
  });

  describe('Oklahoma — Food Bank Workflow (OK-FB1)', () => {
    it('should auto-approve emergency food purchases under $100', () => {
      const result = workflow.submitExpense({ amount: 85, description: 'Emergency bread and milk', submitter: 'driver@okfoodbank.org' });
      expect(result.status).toBe('approved');
    });
  });

  describe('Oklahoma — IT Nonprofit Workflow (OK-IT1)', () => {
    it('should require board approval for server purchase', () => {
      const result = workflow.submitExpense({ amount: 7500, description: 'Server rack for training center', submitter: 'admin@oktech.org', hasReceipt: true });
      expect(result.requiredApprovers).toContain('board@org.org');
    });
  });
});
