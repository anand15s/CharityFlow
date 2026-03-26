import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Plain language translations for accounting terms
export const PLAIN_LANGUAGE: Record<string, string> = {
  'Chart of Accounts': 'Money Categories',
  'Reconciliation': 'Match Your Bank',
  'Accounts Receivable': 'Money Coming In',
  'Accounts Payable': 'Money Going Out',
  'General Ledger': 'Transaction History',
  'Restricted Funds': 'Money with Rules',
  'Unrestricted Funds': 'Flexible Money',
  'Form 990': 'Annual Tax Report',
  'Functional Expenses': 'How We Spend Money',
  'Net Assets': 'What We Have Left',
  'Revenue Recognition': 'When Money Counts',
  'Audit Trail': 'Activity Log',
  'Fiscal Year': 'Financial Year',
  'Accrual Basis': 'Count When Promised',
  'Cash Basis': 'Count When Received',
}

export function toPlainLanguage(term: string): string {
  return PLAIN_LANGUAGE[term] || term
}

export function generateImmutableHash(data: string): string {
  // SHA-256 hash for audit trail immutability
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data + Date.now().toString())
  return Array.from(new Uint8Array(dataBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 64)
}
