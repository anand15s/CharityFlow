// CharityFlow Transaction Management Engine — Type Definitions
// v3.0 — Production Implementation

export type TransactionType = 'donation' | 'expense' | 'transfer' | 'in_kind' | 'grant' | 'refund';
export type TransactionStatus = 'pending' | 'cleared' | 'reconciled' | 'voided' | 'flagged';
export type PaymentMethod = 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'online' | 'in_kind' | 'stock' | 'crypto';
export type FunctionalCategory = 'program' | 'admin' | 'fundraising';
export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';

export interface Transaction {
  id: string;
  orgId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  plainDescription: string; // Auto-generated plain language
  category: string;
  subcategory?: string;
  functionalCategory: FunctionalCategory;
  paymentMethod: PaymentMethod;
  fund?: string;
  program?: string;
  donorId?: string;
  vendorId?: string;
  eventId?: string;
  grantId?: string;
  receiptUrl?: string;
  bankFeedId?: string;
  reconciled: boolean;
  reconciledAt?: Date;
  reconciledBy?: string;
  taxDeductible: boolean;
  taxYear: number;
  tags: string[];
  notes?: string;
  attachments: string[];
  auditLog: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface AuditEntry {
  action: string;
  userId: string;
  timestamp: Date;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export interface RecurringTransaction {
  id: string;
  orgId: string;
  templateTransaction: Partial<Transaction>;
  frequency: RecurrenceFrequency;
  nextDate: Date;
  endDate?: Date;
  isActive: boolean;
  totalGenerated: number;
}

export interface BankFeedEntry {
  id: string;
  bankAccountId: string;
  externalId: string;
  date: Date;
  amount: number;
  description: string;
  matched: boolean;
  matchedTransactionId?: string;
  matchConfidence: number;
}

export interface ReconciliationResult {
  matched: BankFeedMatch[];
  unmatched: BankFeedEntry[];
  unmatchedTransactions: Transaction[];
  matchRate: number;
  totalBankEntries: number;
  totalTransactions: number;
}

export interface BankFeedMatch {
  bankEntry: BankFeedEntry;
  transaction: Transaction;
  confidence: number;
  matchType: 'exact' | 'fuzzy' | 'amount_only' | 'manual';
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  byCategory: Record<string, number>;
  byFund: Record<string, number>;
  byProgram: Record<string, number>;
  byFunctionalCategory: Record<FunctionalCategory, number>;
  transactionCount: number;
  averageTransactionSize: number;
  period: { start: Date; end: Date };
}

export interface CategoryRule {
  id: string;
  orgId: string;
  pattern: string; // regex or keyword
  category: string;
  subcategory?: string;
  functionalCategory: FunctionalCategory;
  confidence: number;
  isDefault: boolean;
}

export interface SplitTransaction {
  parentId: string;
  splits: {
    amount: number;
    category: string;
    functionalCategory: FunctionalCategory;
    fund?: string;
    program?: string;
    description: string;
  }[];
}
