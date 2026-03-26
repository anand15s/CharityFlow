// CharityFlow Utility Bill Management Engine v5.0

export interface UtilityProvider {
  id: string;
  orgId: string;
  name: string;
  type: 'electric' | 'gas' | 'water' | 'internet' | 'phone' | 'waste' | 'other';
  accountNumber?: string;
  active: boolean;
}

export interface UtilityBill {
  id: string;
  orgId: string;
  providerId: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  category: string;
  plainLanguageCategory: string;
}

export interface QuarterlyReport {
  quarter: string;
  year: number;
  totalSpend: number;
  byProvider: Record<string, number>;
  byType: Record<string, number>;
  qoqChange: number;
  qoqChangePercent: number;
  warnings: string[];
  recommendations: string[];
}

const PLAIN_LANGUAGE = {
  'Utility Expenses': 'Building & Office Costs',
  'Electric': 'Electricity',
  'Gas': 'Natural Gas / Heating',
  'Water': 'Water & Sewer',
  'Internet': 'Internet & WiFi',
  'Phone': 'Phone Service',
  'Waste': 'Trash & Recycling',
};

export class UtilityBillManager {
  private providers: Map<string, UtilityProvider> = new Map();
  private bills: Map<string, UtilityBill> = new Map();

  translateToPlainLanguage(term: string): string {
    return (PLAIN_LANGUAGE as any)[term] || term;
  }

  linkProvider(input: Omit<UtilityProvider, 'id' | 'active'>): UtilityProvider {
    if (!input.name || input.name.trim() === '') throw new Error('Provider name is required');
    if (!input.type) throw new Error('Provider type is required');

    const provider: UtilityProvider = {
      ...input,
      id: 'prov_' + Date.now(),
      active: true,
    };
    this.providers.set(provider.id, provider);
    return provider;
  }

  unlinkProvider(providerId: string): void {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error('Provider not found');
    provider.active = false;
  }

  addBill(input: { orgId: string; providerId: string; amount: number; date: string; dueDate: string }): UtilityBill {
    if (input.amount <= 0) throw new Error('Bill amount must be positive');
    if (input.amount < 0) throw new Error('Bill amount cannot be negative');

    const provider = this.providers.get(input.providerId);
    const type = provider ? provider.type : 'other';

    const bill: UtilityBill = {
      ...input,
      id: 'bill_' + Date.now(),
      status: 'pending',
      category: 'Utility Expenses',
      plainLanguageCategory: this.translateToPlainLanguage(type.charAt(0).toUpperCase() + type.slice(1)),
    };
    this.bills.set(bill.id, bill);
    return bill;
  }

  generateQuarterlyReport(orgId: string, year: number, quarter: number): QuarterlyReport {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 3;

    const currentBills: UtilityBill[] = [];
    const previousBills: UtilityBill[] = [];

    for (const [, bill] of this.bills) {
      if (bill.orgId !== orgId) continue;
      const d = new Date(bill.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      if (y === year && m >= startMonth && m < endMonth) currentBills.push(bill);
      // Previous quarter
      const prevQ = quarter > 1 ? quarter - 1 : 4;
      const prevY = quarter > 1 ? year : year - 1;
      const prevStart = (prevQ - 1) * 3;
      const prevEnd = prevStart + 3;
      if (y === prevY && m >= prevStart && m < prevEnd) previousBills.push(bill);
    }

    const totalSpend = currentBills.reduce((sum, b) => sum + b.amount, 0);
    const prevSpend = previousBills.reduce((sum, b) => sum + b.amount, 0);

    const byProvider: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const bill of currentBills) {
      const provider = this.providers.get(bill.providerId);
      const name = provider ? provider.name : 'Unknown';
      const type = provider ? provider.type : 'other';
      byProvider[name] = (byProvider[name] || 0) + bill.amount;
      byType[type] = (byType[type] || 0) + bill.amount;
    }

    const warnings: string[] = [];
    const recommendations: string[] = [];

    const qoqChange = totalSpend - prevSpend;
    const qoqChangePercent = prevSpend > 0 ? (qoqChange / prevSpend) * 100 : 0;

    if (qoqChangePercent > 20) warnings.push('Utility spending increased by ' + Math.round(qoqChangePercent) + '% vs last quarter');
    if (qoqChangePercent < -10) recommendations.push('Great job! Utility costs decreased by ' + Math.abs(Math.round(qoqChangePercent)) + '%');

    // Check for missing utilities
    const expectedTypes = ['electric', 'water', 'internet'];
    for (const type of expectedTypes) {
      if (!byType[type]) warnings.push('No ' + type + ' bills recorded this quarter — verify with provider');
    }

    return {
      quarter: 'Q' + quarter,
      year,
      totalSpend: Math.round(totalSpend * 100) / 100,
      byProvider,
      byType,
      qoqChange: Math.round(qoqChange * 100) / 100,
      qoqChangePercent: Math.round(qoqChangePercent * 10) / 10,
      warnings,
      recommendations,
    };
  }

  generateMemberReport(orgId: string, year: number, quarter: number): string {
    const report = this.generateQuarterlyReport(orgId, year, quarter);
    let doc = '# ' + report.quarter + ' ' + report.year + ' Building & Office Costs Report\n\n';
    doc += '## Summary\n';
    doc += 'Total spending this quarter: $' + report.totalSpend.toLocaleString() + '\n';
    if (report.qoqChange !== 0) {
      doc += 'Change from last quarter: ' + (report.qoqChange > 0 ? '+' : '') + '$' + report.qoqChange.toLocaleString();
      doc += ' (' + (report.qoqChangePercent > 0 ? '+' : '') + report.qoqChangePercent + '%)\n';
    }
    if (report.warnings.length > 0) {
      doc += '\n## Items Needing Attention\n';
      for (const w of report.warnings) doc += '- ⚠️ ' + w + '\n';
    }
    if (report.recommendations.length > 0) {
      doc += '\n## Recommendations\n';
      for (const r of report.recommendations) doc += '- ✅ ' + r + '\n';
    }
    return doc;
  }
}

export default UtilityBillManager;
