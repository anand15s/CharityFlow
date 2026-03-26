// CharityFlow Mileage Tracker v4.0
// IRS-compliant mileage tracking for nonprofits

export interface MileageEntry {
  id: string;
  orgId: string;
  date: string;
  purpose: string;
  inputMethod: 'manual' | 'odometer' | 'gps' | 'address';
  miles: number;
  rate: number;
  reimbursement: number;
  startLocation?: string;
  endLocation?: string;
  odometerStart?: number;
  odometerEnd?: number;
}

export interface MileageSummary {
  totalMiles: number;
  totalReimbursement: number;
  entries: number;
  byPurpose: Record<string, { miles: number; amount: number }>;
}

// IRS 2025-2026 mileage rates
const IRS_RATES = {
  business: 0.67,
  charity: 0.14,
  medical: 0.21,
};

export class MileageTracker {
  private entries: MileageEntry[] = [];

  getIRSRate(purpose: string): number {
    const lower = purpose.toLowerCase();
    if (lower.includes('business') || lower.includes('travel')) return IRS_RATES.business;
    if (lower.includes('medical') || lower.includes('health')) return IRS_RATES.medical;
    return IRS_RATES.charity;
  }

  addEntry(input: { orgId: string; date: string; purpose: string; miles: number; inputMethod: MileageEntry['inputMethod']; startLocation?: string; endLocation?: string; odometerStart?: number; odometerEnd?: number }): MileageEntry {
    if (input.miles <= 0) throw new Error('Miles must be positive');
    if (!input.purpose) throw new Error('Purpose is required');

    const rate = this.getIRSRate(input.purpose);
    const entry: MileageEntry = {
      id: `mile_${Date.now()}`,
      ...input,
      rate,
      reimbursement: Math.round(input.miles * rate * 100) / 100,
    };

    if (input.inputMethod === 'odometer' && input.odometerStart && input.odometerEnd) {
      entry.miles = input.odometerEnd - input.odometerStart;
      entry.reimbursement = Math.round(entry.miles * rate * 100) / 100;
    }

    this.entries.push(entry);
    return entry;
  }

  getMonthlySummary(orgId: string, year: number, month: number): MileageSummary {
    const filtered = this.entries.filter(e => {
      const d = new Date(e.date);
      return e.orgId === orgId && d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const byPurpose: Record<string, { miles: number; amount: number }> = {};
    let totalMiles = 0, totalReimbursement = 0;

    for (const e of filtered) {
      totalMiles += e.miles;
      totalReimbursement += e.reimbursement;
      if (!byPurpose[e.purpose]) byPurpose[e.purpose] = { miles: 0, amount: 0 };
      byPurpose[e.purpose].miles += e.miles;
      byPurpose[e.purpose].amount += e.reimbursement;
    }

    return { totalMiles, totalReimbursement, entries: filtered.length, byPurpose };
  }

  getAnnualDeduction(orgId: string, year: number): { totalMiles: number; totalDeduction: number; byCategory: Record<string, number> } {
    const filtered = this.entries.filter(e => {
      const d = new Date(e.date);
      return e.orgId === orgId && d.getFullYear() === year;
    });

    const byCategory: Record<string, number> = {};
    let totalMiles = 0, totalDeduction = 0;

    for (const e of filtered) {
      totalMiles += e.miles;
      totalDeduction += e.reimbursement;
      byCategory[e.purpose] = (byCategory[e.purpose] || 0) + e.reimbursement;
    }

    return { totalMiles, totalDeduction, byCategory };
  }
}

export default MileageTracker;
