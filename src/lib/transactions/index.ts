// CharityFlow Transaction Management Engine — Public API
// v3.0

export {
  createTransaction,
  updateTransaction,
  voidTransaction,
  autoCategorize,
  translateToPlainLanguage,
  reconcileBankFeed,
  splitTransaction,
  generateRecurringTransaction,
  calculateNextDate,
  generateTransactionSummary,
  calculateFunctionalExpenseRatio,
  validateTransaction,
  DEFAULT_RULES,
  PLAIN_LANGUAGE_MAP,
} from './transaction-engine';

export type {
  Transaction,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  FunctionalCategory,
  RecurrenceFrequency,
  AuditEntry,
  RecurringTransaction,
  BankFeedEntry,
  BankFeedMatch,
  ReconciliationResult,
  TransactionSummary,
  CategoryRule,
  SplitTransaction,
} from './types';
