// src/lib/expenses/types.ts
// Expense Management Module - Type Definitions

export interface ReceiptScanResult {
  merchant: string;
  amount: number;
  currency: string;
  date: string; // ISO 8601
  category: ExpenseCategory | null;
  taxAmount: number | null;
  paymentMethod: string | null;
  lineItems: LineItem[];
  confidence: number; // 0-1
  rawText: string;
  imageUrl: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: ExpenseCategory | null;
}

export interface MileageEntry {
  id: string;
  orgId: string;
  userId: string;
  date: string;
  startAddress: string;
  endAddress: string;
  distanceMiles: number;
  purpose: string;
  ratePerMile: number; // IRS standard rate or custom
  totalReimbursement: number;
  method: 'gps' | 'odometer' | 'manual' | 'address';
  status: 'draft' | 'submitted' | 'approved' | 'reimbursed';
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReport {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  period: { start: string; end: string };
  expenses: ExpenseEntry[];
  mileageEntries: MileageEntry[];
  totalAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  submittedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseEntry {
  id: string;
  orgId: string;
  userId: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: ExpenseCategory;
  subcategory: string | null;
  description: string;
  receiptUrl: string | null;
  receiptScan: ReceiptScanResult | null;
  fundAllocation: FundAllocation[];
  tags: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  approvalWorkflow: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

export interface FundAllocation {
  fundId: string;
  fundName: string;
  amount: number;
  percentage: number;
}

export interface ApprovalStep {
  stepOrder: number;
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedAt: string | null;
  comment: string | null;
}

export interface MerchantRule {
  id: string;
  orgId: string;
  merchantPattern: string; // regex pattern
  category: ExpenseCategory;
  subcategory: string | null;
  fundId: string | null;
  tags: string[];
  isActive: boolean;
}

export interface BulkAction {
  action: 'approve' | 'reject' | 'categorize' | 'tag' | 'submit' | 'delete';
  expenseIds: string[];
  params: Record<string, unknown>;
}

export interface BulkActionResult {
  total: number;
  succeeded: number;
  failed: number;
  errors: { expenseId: string; error: string }[];
}

export type ExpenseCategory =
  | 'office_supplies'
  | 'travel'
  | 'meals'
  | 'utilities'
  | 'rent'
  | 'insurance'
  | 'professional_services'
  | 'technology'
  | 'marketing'
  | 'fundraising'
  | 'program_supplies'
  | 'event_costs'
  | 'vehicle'
  | 'mileage'
  | 'postage'
  | 'printing'
  | 'training'
  | 'bank_fees'
  | 'donations_out'
  | 'grants_out'
  | 'miscellaneous';

// IRS mileage rates (updated annually)
export const IRS_MILEAGE_RATES: Record<number, { business: number; charity: number; medical: number }> = {
  2024: { business: 0.67, charity: 0.14, medical: 0.21 },
  2025: { business: 0.70, charity: 0.14, medical: 0.22 },
  2026: { business: 0.70, charity: 0.14, medical: 0.22 },
};

export interface ExpensePolicy {
  orgId: string;
  maxSingleExpense: number; // max amount without additional approval
  requireReceiptAbove: number; // require receipt above this amount
  autoApproveBelow: number; // auto-approve expenses below this
  approvalChain: { role: string; maxAmount: number }[];
  allowedCategories: ExpenseCategory[];
  mileageRate: number; // custom or IRS
  reimbursementMethod: 'ach' | 'check' | 'manual';
}
