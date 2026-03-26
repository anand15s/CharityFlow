import { MileageTracker, MileageEntry, TripPurpose } from '../lib/expenses/mileage-tracker';

describe('Mileage Tracker', () => {
  let tracker: MileageTracker;

  beforeEach(() => {
    tracker = new MileageTracker({ irsCharityRate: 0.14, irsBusinessRate: 0.67 });
  });

  describe('Manual Entry', () => {
    it('should create a manual mileage entry', () => {
      const entry = tracker.addEntry({
        date: new Date('2026-03-15'), miles: 25, purpose: 'charity',
        description: 'Drive to food bank warehouse', startLocation: 'Office', endLocation: 'Warehouse'
      });
      expect(entry.id).toBeDefined();
      expect(entry.miles).toBe(25);
      expect(entry.reimbursementAmount).toBeCloseTo(3.50, 2);
    });

    it('should use charity rate for nonprofit trips', () => {
      const entry = tracker.addEntry({
        date: new Date(), miles: 100, purpose: 'charity',
        description: 'Volunteer transport'
      });
      expect(entry.reimbursementAmount).toBeCloseTo(14.00, 2);
    });

    it('should reject zero or negative miles', () => {
      expect(() => tracker.addEntry({
        date: new Date(), miles: 0, purpose: 'charity', description: 'Invalid'
      })).toThrow();
    });
  });

  describe('Odometer Entry', () => {
    it('should calculate miles from odometer readings', () => {
      const entry = tracker.addOdometerEntry({
        date: new Date(), startOdometer: 50000, endOdometer: 50045,
        purpose: 'charity', description: 'Site visit'
      });
      expect(entry.miles).toBe(45);
    });

    it('should reject end < start odometer', () => {
      expect(() => tracker.addOdometerEntry({
        date: new Date(), startOdometer: 50000, endOdometer: 49990,
        purpose: 'charity', description: 'Bad reading'
      })).toThrow();
    });
  });

  describe('Monthly Summary', () => {
    it('should aggregate monthly totals', () => {
      tracker.addEntry({ date: new Date('2026-03-01'), miles: 30, purpose: 'charity', description: 'Trip 1' });
      tracker.addEntry({ date: new Date('2026-03-15'), miles: 45, purpose: 'charity', description: 'Trip 2' });
      tracker.addEntry({ date: new Date('2026-03-28'), miles: 20, purpose: 'charity', description: 'Trip 3' });
      const summary = tracker.getMonthlySummary(2026, 3);
      expect(summary.totalMiles).toBe(95);
      expect(summary.totalReimbursement).toBeCloseTo(13.30, 2);
      expect(summary.tripCount).toBe(3);
    });
  });

  describe('Annual Tax Deduction', () => {
    it('should calculate annual deduction for tax filing', () => {
      for (let i = 1; i <= 12; i++) {
        tracker.addEntry({ date: new Date(2026, i-1, 15), miles: 50, purpose: 'charity', description: `Month ${i} trip` });
      }
      const annual = tracker.getAnnualSummary(2026);
      expect(annual.totalMiles).toBe(600);
      expect(annual.taxDeduction).toBeCloseTo(84.00, 2);
    });
  });

  // Oklahoma state tests
  describe('Oklahoma — Temple Mileage (OK-T1)', () => {
    it('should track priest home visits', () => {
      const entry = tracker.addEntry({
        date: new Date('2026-03-10'), miles: 15, purpose: 'charity',
        description: 'Priest visit to devotee home for prayer ceremony',
        metadata: { state: 'OK', orgType: 'religious' }
      });
      expect(entry.reimbursementAmount).toBeCloseTo(2.10, 2);
    });
  });

  describe('Oklahoma — Food Bank Mileage (OK-FB1)', () => {
    it('should track food pickup routes', () => {
      const entry = tracker.addEntry({
        date: new Date('2026-03-05'), miles: 85, purpose: 'charity',
        description: 'Weekly grocery store pickup route - 5 stores',
        metadata: { state: 'OK', orgType: 'food_bank' }
      });
      expect(entry.reimbursementAmount).toBeCloseTo(11.90, 2);
    });
  });

  describe('Oklahoma — IT Nonprofit Mileage (OK-IT1)', () => {
    it('should track school visit for tech setup', () => {
      const entry = tracker.addEntry({
        date: new Date('2026-03-20'), miles: 40, purpose: 'charity',
        description: 'Drive to rural school for computer lab setup',
        metadata: { state: 'OK', orgType: 'educational' }
      });
      expect(entry.reimbursementAmount).toBeCloseTo(5.60, 2);
    });
  });
});
