/**
 * CharityFlow Plain Language Engine
 * Translates accounting jargon into terms anyone can understand
 */

export const translations: Record<string, string> = {
  // Financial Terms
  'Chart of Accounts': 'Money Categories',
  'Reconciliation': 'Match Your Bank',
  'Accounts Receivable': 'Money Coming In',
  'Accounts Payable': 'Bills to Pay',
  'General Ledger': 'Master Record',
  'Trial Balance': 'Quick Check',
  'Balance Sheet': 'What You Own & Owe',
  'Income Statement': 'Money In vs Money Out',
  'Cash Flow Statement': 'Where Money Went',
  'Accrual Basis': 'Count When Earned',
  'Cash Basis': 'Count When Received',
  'Depreciation': 'Value Decrease Over Time',
  'Amortization': 'Spreading Costs Over Time',

  // Nonprofit-Specific
  'Restricted Funds': 'Money with Rules',
  'Unrestricted Funds': 'Flexible Money',
  'Temporarily Restricted': 'Money with Time Limits',
  'Permanently Restricted': 'Untouchable Principal',
  'Net Assets': 'What You Have Left',
  'Functional Expenses': 'How Money Was Used',
  'Program Services': 'Mission Work',
  'Management & General': 'Running the Office',
  'Form 990': 'Annual Tax Report',
  'Form 990-N': 'Simple Tax Postcard',
  'Form 990-EZ': 'Short Tax Report',
  'UBIT': 'Tax on Side Income',
  'Donor-Advised Fund': 'Donor\'s Giving Account',
  'Quid Pro Quo': 'Donation with Perks',
  'In-Kind Donation': 'Gift of Stuff (Not Money)',
  'Fair Market Value': 'What It\'s Worth',
  'Charitable Solicitation': 'Permission to Fundraise',
  'Fiduciary Duty': 'Legal Promise to Be Careful',
}

export function translateTerm(term: string): string {
  return translations[term] || term
}

export function translateText(text: string): string {
  let result = text
  for (const [jargon, plain] of Object.entries(translations)) {
    result = result.replace(new RegExp(jargon, 'gi'), plain)
  }
  return result
}
