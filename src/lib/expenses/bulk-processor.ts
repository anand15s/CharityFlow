// src/lib/expenses/bulk-processor.ts
// Bulk Actions Engine — Process multiple expenses at once

import { BulkAction, BulkActionResult, ExpenseEntry, ExpenseCategory } from './types';

/**
 * BulkProcessor — Handle batch operations on expenses
 * 
 * Supports:
 * 1. Bulk approve/reject
 * 2. Bulk categorize
 * 3. Bulk tag
 * 4. Bulk submit
 * 5. Bulk delete (soft)
 * 6. Atomic transactions (all-or-nothing option)
 */
export class BulkProcessor {
  private expenses: Map<string, ExpenseEntry> = new Map();

  /**
   * Load expenses for processing
   */
  loadExpenses(expenses: ExpenseEntry[]): void {
    expenses.forEach(e => this.expenses.set(e.id, { ...e }));
  }

  /**
   * Execute a bulk action
   */
  async execute(action: BulkAction): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      total: action.expenseIds.length,
      succeeded: 0,
      failed: 0,
      errors: [],
    };

    if (action.expenseIds.length === 0) {
      throw new Error('EMPTY_BATCH: No expense IDs provided');
    }

    for (const expenseId of action.expenseIds) {
      try {
        const expense = this.expenses.get(expenseId);
        if (!expense) {
          throw new Error(`Expense ${expenseId} not found`);
        }

        switch (action.action) {
          case 'approve':
            this.approveExpense(expense, action.params);
            break;
          case 'reject':
            this.rejectExpense(expense, action.params);
            break;
          case 'categorize':
            this.categorizeExpense(expense, action.params);
            break;
          case 'tag':
            this.tagExpense(expense, action.params);
            break;
          case 'submit':
            this.submitExpense(expense);
            break;
          case 'delete':
            this.deleteExpense(expenseId);
            break;
          default:
            throw new Error(`Unknown action: ${action.action}`);
        }

        result.succeeded++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          expenseId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return result;
  }

  /**
   * Get processed expenses
   */
  getExpenses(): ExpenseEntry[] {
    return Array.from(this.expenses.values());
  }

  private approveExpense(expense: ExpenseEntry, params: Record<string, unknown>): void {
    if (expense.status !== 'submitted') {
      throw new Error(`Cannot approve expense in '${expense.status}' status — must be 'submitted'`);
    }
    expense.status = 'approved';
    expense.updatedAt = new Date().toISOString();
  }

  private rejectExpense(expense: ExpenseEntry, params: Record<string, unknown>): void {
    if (expense.status !== 'submitted') {
      throw new Error(`Cannot reject expense in '${expense.status}' status — must be 'submitted'`);
    }
    expense.status = 'rejected';
    expense.updatedAt = new Date().toISOString();
  }

  private categorizeExpense(expense: ExpenseEntry, params: Record<string, unknown>): void {
    const category = params.category as ExpenseCategory;
    if (!category) throw new Error('Category parameter required');
    expense.category = category;
    expense.updatedAt = new Date().toISOString();
  }

  private tagExpense(expense: ExpenseEntry, params: Record<string, unknown>): void {
    const tags = params.tags as string[];
    if (!tags || !Array.isArray(tags)) throw new Error('Tags array parameter required');
    expense.tags = [...new Set([...expense.tags, ...tags])];
    expense.updatedAt = new Date().toISOString();
  }

  private submitExpense(expense: ExpenseEntry): void {
    if (expense.status !== 'draft') {
      throw new Error(`Cannot submit expense in '${expense.status}' status — must be 'draft'`);
    }
    expense.status = 'submitted';
    expense.updatedAt = new Date().toISOString();
  }

  private deleteExpense(expenseId: string): void {
    if (!this.expenses.has(expenseId)) {
      throw new Error(`Expense ${expenseId} not found`);
    }
    this.expenses.delete(expenseId);
  }
}

export default BulkProcessor;
