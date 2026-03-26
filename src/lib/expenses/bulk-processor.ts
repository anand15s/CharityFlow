// CharityFlow Bulk Expense Processor v4.0

export type BulkAction = 'approve' | 'reject' | 'categorize' | 'tag' | 'submit' | 'delete';

export interface BulkResult {
  action: BulkAction;
  total: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

export class BulkProcessor {
  process(ids: string[], action: BulkAction, params?: { category?: string; tag?: string; reason?: string }): BulkResult {
    if (!ids || ids.length === 0) throw new Error('No items provided');

    const result: BulkResult = { action, total: ids.length, succeeded: 0, failed: 0, errors: [] };

    for (const id of ids) {
      try {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID');
        }
        // Process the action
        switch (action) {
          case 'approve':
          case 'reject':
          case 'submit':
          case 'delete':
            result.succeeded++;
            break;
          case 'categorize':
            if (!params?.category) throw new Error('Category required for categorize action');
            result.succeeded++;
            break;
          case 'tag':
            if (!params?.tag) throw new Error('Tag required for tag action');
            result.succeeded++;
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
      } catch (err: any) {
        result.failed++;
        result.errors.push({ id, error: err.message });
      }
    }

    return result;
  }
}

export default BulkProcessor;
