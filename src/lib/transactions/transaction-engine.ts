// CharityFlow Transaction Engine v3.0
// Production-ready financial transaction management for nonprofits

export interface Transaction {
  id: string;
  orgId: string;
  type: 'donation' | 'expense' | 'grant' | 'transfer' | 'in_kind';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'active' | 'voided' | 'pending';
  voidedAt?: string;
  voidedBy?: string;
  voidReason?: string;
  splits?: TransactionSplit[];
  recurring?: RecurringConfig;
  bankMatch?: BankMatchResult;
  auditTrail: AuditEntry[];
  plainLanguageCategory?: string;
}

export interface TransactionSplit {
  category: string;
  amount: number;
  description?: string;
}

export interface RecurringConfig {
  frequency: 'monthly' | 'quarterly' | 'annual';
  nextDate: string;
  active: boolean;
}

export interface BankMatchResult {
  bankTransactionId: string;
  matchType: 'exact' | 'fuzzy' | 'manual';
  confidence: number;
  matchedAt: string;
}

export interface AuditEntry {
  action: string;
  timestamp: string;
  userId: string;
  details: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  byCategory: Record<string, number>;
  functionalExpenses?: {
    program: number;
    admin: number;
    fundraising: number;
    programRatio: number;
    adminRatio: number;
    fundraisingRatio: number;
  };
}

// Plain language translations for nonprofit users
const PLAIN_LANGUAGE_MAP: Record<string, string> = {
  'Chart of Accounts': 'Money Categories',
  'General Ledger': 'Transaction History',
  'Accounts Receivable': 'Money Coming In',
  'Accounts Payable': 'Bills to Pay',
  'Reconciliation': 'Match Your Bank',
  'Restricted Funds': 'Money with Rules',
  'Unrestricted Funds': 'Flexible Money',
  'Functional Expenses': 'How We Spend',
  'Form 990': 'Annual Tax Report',
  'Fiscal Year': 'Financial Year',
  'Accrual Basis': 'Count When Promised',
  'Cash Basis': 'Count When Received',
  'Journal Entry': 'Transaction Record',
  'Trial Balance': 'Account Summary Check',
  'Balance Sheet': 'Financial Snapshot',
  'Income Statement': 'Money In vs Money Out',
  'Statement of Activities': 'What We Did With Money',
  'Statement of Financial Position': 'What We Own vs Owe',
  'In-Kind Donation': 'Non-Cash Gift',
  'Quid Pro Quo': 'Something Given Back',
  'Endowment': 'Long-Term Savings',
  'Capital Campaign': 'Big Project Fund',
  'Pledge': 'Promised Donation',
  'Grant': 'Awarded Funding',
  'UBIT': 'Tax on Side Business Income',
  'Depreciation': 'Value Decrease Over Time',
  'Amortization': 'Spreading Cost Over Time',
  'Audit': 'Financial Review',
  'Compliance': 'Following the Rules',
  'Fiduciary Duty': 'Responsibility to Manage Money Well',
};

// Auto-categorization rules
const CATEGORIZATION_RULES: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['donation', 'gift', 'tithe', 'offering', 'contribute'], category: 'Donations' },
  { keywords: ['grant', 'award', 'foundation', 'endowment'], category: 'Grants' },
  { keywords: ['rent', 'lease', 'mortgage'], category: 'Occupancy' },
  { keywords: ['electric', 'gas', 'water', 'utility', 'internet', 'phone'], category: 'Utilities' },
  { keywords: ['salary', 'wage', 'payroll', 'compensation', 'benefits'], category: 'Personnel' },
  { keywords: ['food', 'meals', 'catering', 'grocery', 'supplies'], category: 'Program Supplies' },
  { keywords: ['insurance', 'liability', 'coverage'], category: 'Insurance' },
  { keywords: ['travel', 'mileage', 'flight', 'hotel', 'transportation'], category: 'Travel' },
  { keywords: ['office', 'paper', 'printer', 'computer', 'software'], category: 'Office Expenses' },
  { keywords: ['event', 'venue', 'ticket', 'registration', 'conference'], category: 'Events' },
  { keywords: ['marketing', 'advertising', 'promotion', 'social media'], category: 'Marketing' },
  { keywords: ['legal', 'attorney', 'lawyer', 'filing'], category: 'Professional Services' },
  { keywords: ['accounting', 'audit', 'bookkeeping', 'cpa'], category: 'Professional Services' },
  { keywords: ['repair', 'maintenance', 'cleaning', 'janitorial'], category: 'Maintenance' },
  { keywords: ['membership', 'dues', 'subscription'], category: 'Membership' },
];

export class TransactionEngine {
  private transactions: Map<string, Transaction> = new Map();

  translateToPlainLanguage(term: string): string {
    return PLAIN_LANGUAGE_MAP[term] || term;
  }

  autoCategorizeBulk(terms: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const term of terms) {
      result[term] = this.autoCategorize(term);
    }
    return result;
  }

  autoCategorize(description: string): string {
    const lower = description.toLowerCase();
    for (const rule of CATEGORIZATION_RULES) {
      if (rule.keywords.some(kw => lower.includes(kw))) {
        return rule.category;
      }
    }
    return 'General';
  }

  createTransaction(input: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'auditTrail' | 'plainLanguageCategory'>): Transaction {
    if (input.amount === 0) throw new Error('Transaction amount cannot be zero');
    if (!input.description || input.description.trim() === '') throw new Error('Description is required');
    if (input.type === 'donation' && input.amount < 0) throw new Error('Donation amount must be positive');
    if (input.type === 'expense' && input.amount > 0) throw new Error('Expense amount must be negative');

    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const category = input.category || this.autoCategorize(input.description);

    const transaction: Transaction = {
      ...input,
      id,
      category,
      createdAt: now,
      updatedAt: now,
      status: 'active',
      plainLanguageCategory: this.translateToPlainLanguage(category),
      auditTrail: [{
        action: 'created',
        timestamp: now,
        userId: input.createdBy,
        details: `Transaction created: ${input.type} of $${Math.abs(input.amount)}`
      }]
    };

    if (input.splits) {
      const splitSum = input.splits.reduce((sum, s) => sum + s.amount, 0);
      if (Math.abs(splitSum - Math.abs(input.amount)) > 0.01) {
        throw new Error('Split amounts must equal transaction amount');
      }
    }

    this.transactions.set(id, transaction);
    return transaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>, userId: string): Transaction {
    const txn = this.transactions.get(id);
    if (!txn) throw new Error('Transaction not found');
    if (txn.status === 'voided') throw new Error('Cannot update voided transaction');

    const now = new Date().toISOString();
    const updated = { ...txn, ...updates, updatedAt: now };
    updated.auditTrail = [...txn.auditTrail, {
      action: 'updated',
      timestamp: now,
      userId,
      details: `Fields updated: ${Object.keys(updates).join(', ')}`
    }];

    this.transactions.set(id, updated);
    return updated;
  }

  voidTransaction(id: string, userId: string, reason: string): Transaction {
    const txn = this.transactions.get(id);
    if (!txn) throw new Error('Transaction not found');
    if (txn.status === 'voided') throw new Error('Transaction already voided');

    const now = new Date().toISOString();
    const voided: Transaction = {
      ...txn,
      status: 'voided',
      voidedAt: now,
      voidedBy: userId,
      voidReason: reason,
      updatedAt: now,
      auditTrail: [...txn.auditTrail, {
        action: 'voided',
        timestamp: now,
        userId,
        details: `Voided: ${reason}`
      }]
    };

    this.transactions.set(id, voided);
    return voided;
  }

  reconcileWithBank(bankTransactions: Array<{ id: string; amount: number; date: string; description: string }>): {
    matched: Array<{ txnId: string; bankId: string; matchType: string }>;
    unmatched: string[];
    matchRate: number;
  } {
    const matched: Array<{ txnId: string; bankId: string; matchType: string }> = [];
    const unmatchedBank = new Set(bankTransactions.map(bt => bt.id));

    for (const [txnId, txn] of this.transactions) {
      if (txn.status === 'voided') continue;

      for (const bt of bankTransactions) {
        if (!unmatchedBank.has(bt.id)) continue;

        if (Math.abs(txn.amount) === Math.abs(bt.amount) && txn.date === bt.date) {
          matched.push({ txnId, bankId: bt.id, matchType: 'exact' });
          unmatchedBank.delete(bt.id);
          break;
        }

        if (Math.abs(Math.abs(txn.amount) - Math.abs(bt.amount)) < 1.00) {
          matched.push({ txnId, bankId: bt.id, matchType: 'fuzzy' });
          unmatchedBank.delete(bt.id);
          break;
        }
      }
    }

    const totalBankTxns = bankTransactions.length;
    return {
      matched,
      unmatched: Array.from(unmatchedBank),
      matchRate: totalBankTxns > 0 ? matched.length / totalBankTxns : 0
    };
  }

  generateRecurring(): Transaction[] {
    const generated: Transaction[] = [];
    const now = new Date();

    for (const [, txn] of this.transactions) {
      if (!txn.recurring || !txn.recurring.active) continue;
      const nextDate = new Date(txn.recurring.nextDate);
      if (nextDate <= now) {
        const newTxn = this.createTransaction({
          orgId: txn.orgId,
          type: txn.type,
          amount: txn.amount,
          description: `[Recurring] ${txn.description}`,
          category: txn.category,
          date: txn.recurring.nextDate,
          createdBy: 'system',
        });
        generated.push(newTxn);
      }
    }

    return generated;
  }

  generateSummary(orgId?: string): FinancialSummary {
    let totalIncome = 0;
    let totalExpenses = 0;
    const byCategory: Record<string, number> = {};
    let program = 0, admin = 0, fundraising = 0;

    for (const [, txn] of this.transactions) {
      if (txn.status === 'voided') continue;
      if (orgId && txn.orgId !== orgId) continue;

      if (txn.amount > 0) totalIncome += txn.amount;
      else totalExpenses += Math.abs(txn.amount);

      byCategory[txn.category] = (byCategory[txn.category] || 0) + Math.abs(txn.amount);

      if (['Program Supplies', 'Events'].includes(txn.category)) program += Math.abs(txn.amount);
      else if (['Office Expenses', 'Insurance', 'Professional Services'].includes(txn.category)) admin += Math.abs(txn.amount);
      else if (['Marketing'].includes(txn.category)) fundraising += Math.abs(txn.amount);
    }

    const totalFunctional = program + admin + fundraising;
    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      byCategory,
      functionalExpenses: totalFunctional > 0 ? {
        program, admin, fundraising,
        programRatio: program / totalFunctional,
        adminRatio: admin / totalFunctional,
        fundraisingRatio: fundraising / totalFunctional,
      } : undefined
    };
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }
}

export default TransactionEngine;
