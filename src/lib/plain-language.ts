// CharityFlow Plain Language Translator v1.0
// Translates accounting jargon into everyday language

export const PLAIN_LANGUAGE_MAP: Record<string, string> = {
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

export function translateToPlainLanguage(term: string): string {
  return PLAIN_LANGUAGE_MAP[term] || term;
}

export function translateAll(terms: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const term of terms) {
    result[term] = translateToPlainLanguage(term);
  }
  return result;
}

export default { translateToPlainLanguage, translateAll, PLAIN_LANGUAGE_MAP };
