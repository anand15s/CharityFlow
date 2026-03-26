// CharityFlow Transaction Management Engine — Core Logic
// v3.0 — Production Implementation
// Handles: CRUD, auto-categorization, bank reconciliation, 
// split transactions, recurring, reporting, audit trail

import { 
  Transaction, TransactionType, TransactionStatus, PaymentMethod,
  FunctionalCategory, AuditEntry, BankFeedEntry, BankFeedMatch,
  ReconciliationResult, TransactionSummary, CategoryRule,
  RecurringTransaction, SplitTransaction
} from './types';

// ============================================================
// PLAIN LANGUAGE TRANSLATIONS
// ============================================================
const PLAIN_LANGUAGE_MAP: Record<string, string> = {
  'donation': 'Money Received',
  'expense': 'Money Spent',
  'transfer': 'Money Moved',
  'in_kind': 'Non-Cash Gift',
  'grant': 'Grant Funding',
  'refund': 'Money Returned',
  'pending': 'Waiting to Clear',
  'cleared': 'Confirmed',
  'reconciled': 'Matched with Bank',
  'voided': 'Cancelled',
  'flagged': 'Needs Review',
  'program': 'Mission Work',
  'admin': 'Running the Office',
  'fundraising': 'Raising Money',
  'cash': 'Cash',
  'check': 'Check',
  'credit_card': 'Card Payment',
  'bank_transfer': 'Bank Transfer',
  'online': 'Online Payment',
  'in_kind': 'Donated Goods/Services',
  'stock': 'Stock Donation',
  'crypto': 'Cryptocurrency',
};

export function translateToPlainLanguage(term: string): string {
  return PLAIN_LANGUAGE_MAP[term.toLowerCase()] || term;
}

// ============================================================
// AUTO-CATEGORIZATION ENGINE
// ============================================================
const DEFAULT_RULES: CategoryRule[] = [
  { id: 'r1', orgId: '*', pattern: 'donation|tithe|offering|gift', category: 'Donations', functionalCategory: 'program', confidence: 0.9, isDefault: true },
  { id: 'r2', orgId: '*', pattern: 'grant|foundation|award', category: 'Grants', functionalCategory: 'program', confidence: 0.85, isDefault: true },
  { id: 'r3', orgId: '*', pattern: 'rent|lease|mortgage', category: 'Occupancy', functionalCategory: 'admin', confidence: 0.9, isDefault: true },
  { id: 'r4', orgId: '*', pattern: 'salary|payroll|wage|compensation', category: 'Personnel', functionalCategory: 'program', confidence: 0.85, isDefault: true },
  { id: 'r5', orgId: '*', pattern: 'electric|gas|water|utility|internet|phone', category: 'Utilities', functionalCategory: 'admin', confidence: 0.9, isDefault: true },
  { id: 'r6', orgId: '*', pattern: 'office|supplies|paper|printer|toner', category: 'Office Supplies', functionalCategory: 'admin', confidence: 0.85, isDefault: true },
  { id: 'r7', orgId: '*', pattern: 'food|meal|catering|grocery', category: 'Food & Meals', functionalCategory: 'program', confidence: 0.8, isDefault: true },
  { id: 'r8', orgId: '*', pattern: 'insurance|liability|coverage', category: 'Insurance', functionalCategory: 'admin', confidence: 0.9, isDefault: true },
  { id: 'r9', orgId: '*', pattern: 'event|gala|fundraiser|auction|concert', category: 'Events', functionalCategory: 'fundraising', confidence: 0.85, isDefault: true },
  { id: 'r10', orgId: '*', pattern: 'marketing|advertising|ad|promo|campaign', category: 'Marketing', functionalCategory: 'fundraising', confidence: 0.85, isDefault: true },
  { id: 'r11', orgId: '*', pattern: 'travel|flight|hotel|mileage|uber|lyft', category: 'Travel', functionalCategory: 'program', confidence: 0.8, isDefault: true },
  { id: 'r12', orgId: '*', pattern: 'legal|attorney|lawyer|filing fee', category: 'Professional Services', functionalCategory: 'admin', confidence: 0.85, isDefault: true },
  { id: 'r13', orgId: '*', pattern: 'volunteer|service hours', category: 'In-Kind Services', functionalCategory: 'program', confidence: 0.75, isDefault: true },
  { id: 'r14', orgId: '*', pattern: 'software|subscription|saas|license', category: 'Technology', functionalCategory: 'admin', confidence: 0.85, isDefault: true },
  { id: 'r15', orgId: '*', pattern: 'training|workshop|conference|seminar', category: 'Education', functionalCategory: 'program', confidence: 0.8, isDefault: true },
];

export function autoCategorize(
  description: string,
  amount: number,
  customRules: CategoryRule[] = []
): { category: string; functionalCategory: FunctionalCategory; confidence: number } {
  const allRules = [...customRules.filter(r => !r.isDefault), ...DEFAULT_RULES];
  const lowerDesc = description.toLowerCase();

  for (const rule of allRules) {
    const regex = new RegExp(rule.pattern, 'i');
    if (regex.test(lowerDesc)) {
      return {
        category: rule.category,
        functionalCategory: rule.functionalCategory,
        confidence: rule.confidence,
      };
    }
  }

  // Fallback: income vs expense based on amount sign
  if (amount > 0) {
    return { category: 'Other Income', functionalCategory: 'program', confidence: 0.5 };
  }
  return { category: 'Other Expenses', functionalCategory: 'admin', confidence: 0.5 };
}

// ============================================================
// TRANSACTION CRUD
// ============================================================
export function createTransaction(
  orgId: string,
  data: Partial<Transaction>,
  userId: string
): Transaction {
  const now = new Date();
  const categorization = autoCategorize(
    data.description || '',
    data.amount || 0
  );

  const txn: Transaction = {
    id: generateId(),
    orgId,
    type: data.type || (data.amount && data.amount > 0 ? 'donation' : 'expense'),
    status: 'pending',
    amount: data.amount || 0,
    currency: data.currency || 'USD',
    date: data.date || now,
    description: data.description || '',
    plainDescription: generatePlainDescription(data),
    category: data.category || categorization.category,
    subcategory: data.subcategory,
    functionalCategory: data.functionalCategory || categorization.functionalCategory,
    paymentMethod: data.paymentMethod || 'bank_transfer',
    fund: data.fund,
    program: data.program,
    donorId: data.donorId,
    vendorId: data.vendorId,
    eventId: data.eventId,
    grantId: data.grantId,
    receiptUrl: data.receiptUrl,
    bankFeedId: data.bankFeedId,
    reconciled: false,
    taxDeductible: data.taxDeductible ?? (data.type === 'donation'),
    taxYear: data.taxYear || now.getFullYear(),
    tags: data.tags || [],
    notes: data.notes,
    attachments: data.attachments || [],
    auditLog: [{
      action: 'CREATED',
      userId,
      timestamp: now,
      newValue: { amount: data.amount, type: data.type, description: data.description },
    }],
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  };

  validateTransaction(txn);
  return txn;
}

export function updateTransaction(
  txn: Transaction,
  updates: Partial<Transaction>,
  userId: string
): Transaction {
  const now = new Date();
  const auditEntry: AuditEntry = {
    action: 'UPDATED',
    userId,
    timestamp: now,
    previousValue: {},
    newValue: {},
  };

  // Track changes for audit
  for (const [key, value] of Object.entries(updates)) {
    if (key !== 'auditLog' && key !== 'updatedAt') {
      (auditEntry.previousValue as any)[key] = (txn as any)[key];
      (auditEntry.newValue as any)[key] = value;
    }
  }

  const updated: Transaction = {
    ...txn,
    ...updates,
    updatedAt: now,
    auditLog: [...txn.auditLog, auditEntry],
  };

  // Re-generate plain description if description changed
  if (updates.description) {
    updated.plainDescription = generatePlainDescription(updated);
  }

  validateTransaction(updated);
  return updated;
}

export function voidTransaction(txn: Transaction, userId: string, reason: string): Transaction {
  if (txn.status === 'voided') {
    throw new Error('Transaction is already voided');
  }

  return updateTransaction(txn, {
    status: 'voided',
    notes: `${txn.notes || ''} [VOIDED: ${reason}]`.trim(),
  }, userId);
}

// ============================================================
// BANK FEED RECONCILIATION ("Match Your Bank")
// ============================================================
export function reconcileBankFeed(
  bankEntries: BankFeedEntry[],
  transactions: Transaction[]
): ReconciliationResult {
  const matched: BankFeedMatch[] = [];
  const unmatchedBank: BankFeedEntry[] = [];
  const matchedTxnIds = new Set<string>();

  for (const entry of bankEntries) {
    let bestMatch: BankFeedMatch | null = null;

    for (const txn of transactions) {
      if (matchedTxnIds.has(txn.id)) continue;
      if (txn.status === 'voided') continue;

      const confidence = calculateMatchConfidence(entry, txn);

      if (confidence > 0.7 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = {
          bankEntry: entry,
          transaction: txn,
          confidence,
          matchType: confidence >= 0.95 ? 'exact' : confidence >= 0.8 ? 'fuzzy' : 'amount_only',
        };
      }
    }

    if (bestMatch) {
      matched.push(bestMatch);
      matchedTxnIds.add(bestMatch.transaction.id);
    } else {
      unmatchedBank.push(entry);
    }
  }

  const unmatchedTransactions = transactions.filter(
    t => !matchedTxnIds.has(t.id) && t.status !== 'voided' && t.status !== 'reconciled'
  );

  return {
    matched,
    unmatched: unmatchedBank,
    unmatchedTransactions,
    matchRate: bankEntries.length > 0 ? matched.length / bankEntries.length : 0,
    totalBankEntries: bankEntries.length,
    totalTransactions: transactions.length,
  };
}

function calculateMatchConfidence(entry: BankFeedEntry, txn: Transaction): number {
  let score = 0;

  // Amount match (most important — 50%)
  const amountDiff = Math.abs(Math.abs(entry.amount) - Math.abs(txn.amount));
  if (amountDiff === 0) score += 0.5;
  else if (amountDiff < 0.01) score += 0.45;
  else if (amountDiff < 1) score += 0.3;
  else return 0; // Amount must be close

  // Date match (30%)
  const daysDiff = Math.abs(
    (entry.date.getTime() - txn.date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff === 0) score += 0.3;
  else if (daysDiff <= 1) score += 0.25;
  else if (daysDiff <= 3) score += 0.15;
  else if (daysDiff <= 7) score += 0.05;

  // Description match (20%)
  const descSimilarity = calculateStringSimilarity(
    entry.description.toLowerCase(),
    txn.description.toLowerCase()
  );
  score += descSimilarity * 0.2;

  return Math.min(score, 1);
}

function calculateStringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));
  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));

  return (2 * intersection.size) / (wordsA.size + wordsB.size);
}

// ============================================================
// SPLIT TRANSACTIONS
// ============================================================
export function splitTransaction(
  txn: Transaction,
  splits: SplitTransaction['splits'],
  userId: string
): Transaction[] {
  const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);

  if (Math.abs(totalSplit - Math.abs(txn.amount)) > 0.01) {
    throw new Error(
      `Split amounts ($${totalSplit.toFixed(2)}) must equal transaction amount ($${Math.abs(txn.amount).toFixed(2)})`
    );
  }

  if (splits.length < 2) {
    throw new Error('Must have at least 2 splits');
  }

  return splits.map((split, index) => ({
    ...txn,
    id: `${txn.id}-split-${index + 1}`,
    amount: txn.amount > 0 ? split.amount : -split.amount,
    category: split.category,
    functionalCategory: split.functionalCategory,
    fund: split.fund || txn.fund,
    program: split.program || txn.program,
    description: split.description || `${txn.description} (Split ${index + 1}/${splits.length})`,
    plainDescription: `Part ${index + 1} of ${splits.length}: ${translateToPlainLanguage(split.functionalCategory)}`,
    tags: [...txn.tags, 'split', `parent:${txn.id}`],
    auditLog: [...txn.auditLog, {
      action: 'SPLIT',
      userId,
      timestamp: new Date(),
      newValue: { splitIndex: index + 1, totalSplits: splits.length, amount: split.amount },
    }],
  }));
}

// ============================================================
// RECURRING TRANSACTIONS
// ============================================================
export function generateRecurringTransaction(
  recurring: RecurringTransaction,
  userId: string
): Transaction | null {
  if (!recurring.isActive) return null;
  if (recurring.endDate && new Date() > recurring.endDate) return null;
  if (new Date() < recurring.nextDate) return null;

  const txn = createTransaction(
    recurring.orgId,
    {
      ...recurring.templateTransaction,
      date: recurring.nextDate,
      tags: [...(recurring.templateTransaction.tags || []), 'recurring', `recurring:${recurring.id}`],
    },
    userId
  );

  return txn;
}

export function calculateNextDate(current: Date, frequency: RecurringTransaction['frequency']): Date {
  const next = new Date(current);
  switch (frequency) {
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'biweekly': next.setDate(next.getDate() + 14); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'quarterly': next.setMonth(next.getMonth() + 3); break;
    case 'annually': next.setFullYear(next.getFullYear() + 1); break;
  }
  return next;
}

// ============================================================
// FINANCIAL REPORTING
// ============================================================
export function generateTransactionSummary(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): TransactionSummary {
  const filtered = transactions.filter(
    t => t.date >= startDate && t.date <= endDate && t.status !== 'voided'
  );

  const summary: TransactionSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    byCategory: {},
    byFund: {},
    byProgram: {},
    byFunctionalCategory: { program: 0, admin: 0, fundraising: 0 },
    transactionCount: filtered.length,
    averageTransactionSize: 0,
    period: { start: startDate, end: endDate },
  };

  for (const txn of filtered) {
    // Income vs Expense
    if (txn.amount > 0) {
      summary.totalIncome += txn.amount;
    } else {
      summary.totalExpenses += Math.abs(txn.amount);
    }

    // By category
    summary.byCategory[txn.category] = (summary.byCategory[txn.category] || 0) + Math.abs(txn.amount);

    // By fund
    if (txn.fund) {
      summary.byFund[txn.fund] = (summary.byFund[txn.fund] || 0) + Math.abs(txn.amount);
    }

    // By program
    if (txn.program) {
      summary.byProgram[txn.program] = (summary.byProgram[txn.program] || 0) + Math.abs(txn.amount);
    }

    // By functional category
    if (txn.amount < 0) {
      summary.byFunctionalCategory[txn.functionalCategory] += Math.abs(txn.amount);
    }
  }

  summary.netIncome = summary.totalIncome - summary.totalExpenses;
  summary.averageTransactionSize = filtered.length > 0
    ? (summary.totalIncome + summary.totalExpenses) / filtered.length
    : 0;

  return summary;
}

export function calculateFunctionalExpenseRatio(summary: TransactionSummary): {
  programRatio: number;
  adminRatio: number;
  fundraisingRatio: number;
  isHealthy: boolean;
  recommendation: string;
} {
  const total = summary.byFunctionalCategory.program + 
                summary.byFunctionalCategory.admin + 
                summary.byFunctionalCategory.fundraising;

  if (total === 0) {
    return {
      programRatio: 0, adminRatio: 0, fundraisingRatio: 0,
      isHealthy: true,
      recommendation: 'No expenses recorded yet',
    };
  }

  const programRatio = summary.byFunctionalCategory.program / total;
  const adminRatio = summary.byFunctionalCategory.admin / total;
  const fundraisingRatio = summary.byFunctionalCategory.fundraising / total;

  const isHealthy = programRatio >= 0.65 && adminRatio <= 0.25;
  let recommendation = '';

  if (programRatio < 0.65) {
    recommendation = `Your Mission Work spending is ${(programRatio * 100).toFixed(1)}%. Donors and watchdogs like to see at least 65%. Consider reallocating some office or fundraising costs.`;
  } else if (adminRatio > 0.25) {
    recommendation = `Your office costs are ${(adminRatio * 100).toFixed(1)}% of total spending. Try to keep this under 25% for better ratings.`;
  } else {
    recommendation = `Great job! Your spending ratios look healthy. ${(programRatio * 100).toFixed(1)}% goes to your mission.`;
  }

  return { programRatio, adminRatio, fundraisingRatio, isHealthy, recommendation };
}

// ============================================================
// VALIDATION
// ============================================================
export function validateTransaction(txn: Transaction): void {
  const errors: string[] = [];

  if (!txn.orgId) errors.push('Organization ID is required');
  if (!txn.description || txn.description.trim().length === 0) errors.push('Description is required');
  if (txn.amount === 0) errors.push('Amount cannot be zero');
  if (!txn.date || isNaN(txn.date.getTime())) errors.push('Valid date is required');
  if (!txn.type) errors.push('Transaction type is required');
  if (!txn.createdBy) errors.push('Creator user ID is required');

  // Donation-specific validations
  if (txn.type === 'donation' && txn.amount < 0) {
    errors.push('Donations must have a positive amount');
  }

  // Expense-specific validations
  if (txn.type === 'expense' && txn.amount > 0) {
    errors.push('Expenses must have a negative amount');
  }

  if (errors.length > 0) {
    throw new Error(`Transaction validation failed: ${errors.join('; ')}`);
  }
}

// ============================================================
// HELPERS
// ============================================================
function generateId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generatePlainDescription(data: Partial<Transaction>): string {
  const type = translateToPlainLanguage(data.type || 'expense');
  const amount = data.amount ? `$${Math.abs(data.amount).toFixed(2)}` : '';
  const method = data.paymentMethod ? ` via ${translateToPlainLanguage(data.paymentMethod)}` : '';
  return `${type}: ${amount}${method} — ${data.description || 'No description'}`;
}

// ============================================================
// EXPORTS
// ============================================================
export {
  PLAIN_LANGUAGE_MAP,
  DEFAULT_RULES,
  calculateMatchConfidence as _calculateMatchConfidence,
  calculateStringSimilarity as _calculateStringSimilarity,
};
