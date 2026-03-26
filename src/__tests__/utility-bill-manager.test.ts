import { UtilityBillManager, UtilityProvider, UtilityBill } from '../lib/finance/utility-bill-manager';

describe('Utility Bill Management Engine', () => {
  let manager: UtilityBillManager;

  beforeEach(() => {
    manager = new UtilityBillManager({ orgId: 'test-org' });
  });

  describe('Provider Management', () => {
    it('should link a utility provider', () => {
      const provider = manager.addProvider({ name: 'OGE Energy', type: 'electricity', accountNumber: 'OGE-12345' });
      expect(provider.id).toBeDefined();
      expect(provider.name).toBe('OGE Energy');
    });

    it('should list all linked providers', () => {
      manager.addProvider({ name: 'OGE Energy', type: 'electricity', accountNumber: 'OGE-12345' });
      manager.addProvider({ name: 'ONG', type: 'gas', accountNumber: 'ONG-67890' });
      expect(manager.getProviders().length).toBe(2);
    });

    it('should unlink a provider', () => {
      const provider = manager.addProvider({ name: 'Test', type: 'water', accountNumber: 'W-111' });
      manager.removeProvider(provider.id);
      expect(manager.getProviders().length).toBe(0);
    });

    it('should reject empty provider name', () => {
      expect(() => manager.addProvider({ name: '', type: 'electricity', accountNumber: '123' })).toThrow();
    });
  });

  describe('Bill Processing', () => {
    it('should record a utility bill', () => {
      const provider = manager.addProvider({ name: 'OGE', type: 'electricity', accountNumber: 'OGE-1' });
      const bill = manager.addBill({ providerId: provider.id, amount: 245.50, billingPeriod: '2026-03', dueDate: new Date('2026-04-15') });
      expect(bill.amount).toBe(245.50);
    });

    it('should reject zero amount bills', () => {
      const provider = manager.addProvider({ name: 'Test', type: 'water', accountNumber: 'W-1' });
      expect(() => manager.addBill({ providerId: provider.id, amount: 0, billingPeriod: '2026-03', dueDate: new Date() })).toThrow();
    });

    it('should auto-categorize utility bills', () => {
      const provider = manager.addProvider({ name: 'OGE', type: 'electricity', accountNumber: 'E-1' });
      const bill = manager.addBill({ providerId: provider.id, amount: 200, billingPeriod: '2026-03', dueDate: new Date() });
      expect(bill.category).toBe('utilities');
    });
  });

  describe('Quarter-over-Quarter Analysis', () => {
    it('should calculate QoQ spending changes', () => {
      const provider = manager.addProvider({ name: 'Electric Co', type: 'electricity', accountNumber: 'E-1' });
      manager.addBill({ providerId: provider.id, amount: 200, billingPeriod: '2026-01', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 210, billingPeriod: '2026-02', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 220, billingPeriod: '2026-03', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 300, billingPeriod: '2026-04', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 350, billingPeriod: '2026-05', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 380, billingPeriod: '2026-06', dueDate: new Date() });
      const report = manager.getQoQReport(2026, 1, 2);
      expect(report.q1Total).toBeCloseTo(630, 0);
      expect(report.q2Total).toBeCloseTo(1030, 0);
      expect(report.percentChange).toBeGreaterThan(0);
    });
  });

  describe('Plain Language', () => {
    it('should translate utility terms', () => {
      expect(manager.translate('Utility Expenses')).toBe('Building & Office Costs');
    });
  });

  // Oklahoma state tests
  describe('Oklahoma — Temple Utilities (OK-T1)', () => {
    it('should track temple electricity with summer AC spike', () => {
      const provider = manager.addProvider({ name: 'OGE Energy', type: 'electricity', accountNumber: 'OGE-T1' });
      manager.addBill({ providerId: provider.id, amount: 180, billingPeriod: '2026-01', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 175, billingPeriod: '2026-02', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 190, billingPeriod: '2026-03', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 350, billingPeriod: '2026-07', dueDate: new Date() });
      const bills = manager.getBillsByProvider(provider.id);
      expect(bills.length).toBe(4);
    });
  });

  describe('Oklahoma — Food Bank Utilities (OK-FB1)', () => {
    it('should track cold storage electricity costs', () => {
      const provider = manager.addProvider({ name: 'OGE Energy', type: 'electricity', accountNumber: 'OGE-FB1' });
      const bill = manager.addBill({ providerId: provider.id, amount: 850, billingPeriod: '2026-03', dueDate: new Date(), notes: 'Includes industrial refrigeration' });
      expect(bill.amount).toBe(850);
    });

    it('should generate member cost report', () => {
      const provider = manager.addProvider({ name: 'OGE', type: 'electricity', accountNumber: 'E-FB' });
      manager.addBill({ providerId: provider.id, amount: 800, billingPeriod: '2026-01', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 820, billingPeriod: '2026-02', dueDate: new Date() });
      manager.addBill({ providerId: provider.id, amount: 790, billingPeriod: '2026-03', dueDate: new Date() });
      const summary = manager.getQuarterlySummary(2026, 1);
      expect(summary.total).toBeCloseTo(2410, 0);
    });
  });

  describe('Oklahoma — IT Nonprofit Utilities (OK-IT1)', () => {
    it('should track internet as top utility expense', () => {
      const elec = manager.addProvider({ name: 'OGE', type: 'electricity', accountNumber: 'E-IT' });
      const internet = manager.addProvider({ name: 'ATT Fiber', type: 'internet', accountNumber: 'I-IT' });
      manager.addBill({ providerId: elec.id, amount: 120, billingPeriod: '2026-03', dueDate: new Date() });
      manager.addBill({ providerId: internet.id, amount: 250, billingPeriod: '2026-03', dueDate: new Date() });
      const providers = manager.getProviders();
      expect(providers.length).toBe(2);
    });
  });
});
