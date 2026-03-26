// CharityFlow Approval Workflow v4.0

export interface ApprovalPolicy {
  autoApproveUnder: number;
  requireReceiptOver: number;
  approvalChain: string[];
}

export interface ApprovalRequest {
  id: string;
  expenseId: string;
  amount: number;
  submittedBy: string;
  hasReceipt: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  currentApprover?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export class ApprovalWorkflow {
  private policy: ApprovalPolicy;

  constructor(policy: ApprovalPolicy) {
    this.policy = policy;
  }

  submit(expense: { id: string; amount: number; submittedBy: string; hasReceipt: boolean }): ApprovalRequest {
    const request: ApprovalRequest = {
      id: `apr_${Date.now()}`,
      expenseId: expense.id,
      amount: expense.amount,
      submittedBy: expense.submittedBy,
      hasReceipt: expense.hasReceipt,
      status: 'pending',
    };

    // Auto-approve small amounts
    if (expense.amount <= this.policy.autoApproveUnder) {
      request.status = 'auto_approved';
      request.approvedBy = 'system';
      return request;
    }

    // Require receipt for amounts over threshold
    if (expense.amount > this.policy.requireReceiptOver && !expense.hasReceipt) {
      request.status = 'rejected';
      request.rejectedBy = 'system';
      request.rejectionReason = 'Receipt required for expenses over $' + this.policy.requireReceiptOver;
      return request;
    }

    // Set first approver in chain
    request.currentApprover = this.policy.approvalChain[0];
    return request;
  }

  approve(request: ApprovalRequest, approverId: string): ApprovalRequest {
    if (request.status !== 'pending') throw new Error('Request is not pending');
    if (request.currentApprover !== approverId) throw new Error('Not authorized to approve');

    const chainIndex = this.policy.approvalChain.indexOf(approverId);
    if (chainIndex < this.policy.approvalChain.length - 1) {
      request.currentApprover = this.policy.approvalChain[chainIndex + 1];
    } else {
      request.status = 'approved';
      request.approvedBy = approverId;
    }

    return request;
  }

  reject(request: ApprovalRequest, rejectorId: string, reason: string): ApprovalRequest {
    if (request.status !== 'pending') throw new Error('Request is not pending');
    request.status = 'rejected';
    request.rejectedBy = rejectorId;
    request.rejectionReason = reason;
    return request;
  }
}

export default ApprovalWorkflow;
