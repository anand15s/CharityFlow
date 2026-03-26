// CharityFlow Expense Module Types v4.0

export interface Expense {
  id: string;
  orgId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  receiptId?: string;
  mileageId?: string;
  submittedBy: string;
  approvedBy?: string;
  tags: string[];
}

export interface ExpenseReport {
  id: string;
  orgId: string;
  title: string;
  expenses: string[];
  totalAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'reimbursed';
  submittedAt?: string;
  approvedAt?: string;
}

export interface CardTransaction {
  id: string;
  cardLast4: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
  matched: boolean;
  matchedExpenseId?: string;
}

export type ExpenseCategory =
  | 'Program Supplies' | 'Office Expenses' | 'Travel' | 'Utilities'
  | 'Personnel' | 'Insurance' | 'Professional Services' | 'Events'
  | 'Marketing' | 'Maintenance' | 'Postage & Shipping'
  | 'Software & Technology' | 'Occupancy' | 'General';
