// src/lib/expenses/approval-workflow.ts
// Expense Approval Workflow Engine — Multi-step approvals

import { ExpenseEntry, ExpensePolicy, ApprovalStep } from './types';

/**
 * ApprovalWorkflow — Role-based multi-step expense approval
 * 
 * Features:
 * 1. Policy-based auto-approval (under threshold)
 * 2. Multi-step approval chains
 * 3. Receipt requirement enforcement
 * 4. Over-budget alerts
 * 5. Delegation support
 * 6. Audit trail for every decision
 */
export class ApprovalWorkflow {
  private policy: ExpensePolicy;

  constructor(policy: ExpensePolicy) {
    this.policy = policy;
  }

  /**
   * Submit an expense for approval
   * Returns: updated expense with approval steps
   */
  submit(expense: ExpenseEntry): ExpenseEntry {
    // Validate expense is in draft status
    if (expense.status !== 'draft') {
      throw new Error(`INVALID_STATUS: Cannot submit expense in '${expense.status}' status`);
    }

    // Validate receipt requirement
    if (expense.amount > this.policy.requireReceiptAbove && !expense.receiptUrl) {
      throw new Error(
        `RECEIPT_REQUIRED: Expenses over $${this.policy.requireReceiptAbove} require a receipt`
      );
    }

    // Validate category is allowed
    if (!this.policy.allowedCategories.includes(expense.category)) {
      throw new Error(`CATEGORY_NOT_ALLOWED: '${expense.category}' is not in the approved category list`);
    }

    // Auto-approve if under threshold
    if (expense.amount <= this.policy.autoApproveBelow) {
      return {
        ...expense,
        status: 'approved',
        approvalWorkflow: [{
          stepOrder: 0,
          approverId: 'SYSTEM',
          approverName: 'Auto-Approved (Policy)',
          status: 'approved',
          decidedAt: new Date().toISOString(),
          comment: `Auto-approved: amount $${expense.amount} is under $${this.policy.autoApproveBelow} threshold`,
        }],
        updatedAt: new Date().toISOString(),
      };
    }

    // Build approval chain based on amount
    const steps = this.buildApprovalChain(expense.amount);

    return {
      ...expense,
      status: 'submitted',
      approvalWorkflow: steps,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Process an approval decision
   */
  processDecision(
    expense: ExpenseEntry,
    approverId: string,
    decision: 'approved' | 'rejected',
    comment?: string
  ): ExpenseEntry {
    if (expense.status !== 'submitted') {
      throw new Error(`INVALID_STATUS: Cannot process decision for '${expense.status}' expense`);
    }

    // Find the pending step for this approver
    const stepIndex = expense.approvalWorkflow.findIndex(
      s => s.approverId === approverId && s.status === 'pending'
    );

    if (stepIndex === -1) {
      throw new Error('NOT_YOUR_TURN: No pending approval step found for this approver');
    }

    // Update the step
    const updatedSteps = [...expense.approvalWorkflow];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      status: decision,
      decidedAt: new Date().toISOString(),
      comment: comment || null,
    };

    // If rejected, the whole expense is rejected
    if (decision === 'rejected') {
      return {
        ...expense,
        status: 'rejected',
        approvalWorkflow: updatedSteps,
        updatedAt: new Date().toISOString(),
      };
    }

    // If approved, check if all steps are complete
    const allApproved = updatedSteps.every(s => s.status === 'approved');
    const newStatus = allApproved ? 'approved' : 'submitted';

    return {
      ...expense,
      status: newStatus,
      approvalWorkflow: updatedSteps,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Check if expense requires additional approval
   */
  requiresAdditionalApproval(expense: ExpenseEntry): boolean {
    if (expense.amount > this.policy.maxSingleExpense) return true;
    return false;
  }

  /**
   * Get policy summary in plain language
   */
  getPolicySummary(): string {
    return [
      `Auto-approved under: $${this.policy.autoApproveBelow}`,
      `Receipt required over: $${this.policy.requireReceiptAbove}`,
      `Max single expense: $${this.policy.maxSingleExpense}`,
      `Approval steps: ${this.policy.approvalChain.length}`,
      `Reimbursement: ${this.policy.reimbursementMethod.toUpperCase()}`,
    ].join('\n');
  }

  private buildApprovalChain(amount: number): ApprovalStep[] {
    const steps: ApprovalStep[] = [];
    let stepOrder = 1;

    for (const level of this.policy.approvalChain) {
      if (amount > level.maxAmount || stepOrder === 1) {
        steps.push({
          stepOrder,
          approverId: level.role,
          approverName: level.role,
          status: 'pending',
          decidedAt: null,
          comment: null,
        });
        stepOrder++;
      }
    }

    // Always have at least one approval step
    if (steps.length === 0) {
      steps.push({
        stepOrder: 1,
        approverId: 'treasurer',
        approverName: 'Treasurer',
        status: 'pending',
        decidedAt: null,
        comment: null,
      });
    }

    return steps;
  }
}

export default ApprovalWorkflow;
