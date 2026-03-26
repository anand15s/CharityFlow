import { CPATaxOptimizer } from '../lib/tax/cpa-tax-optimizer';
import type { TaxExemptOrg, UBITActivity, ClassificationFactor } from '../lib/tax/cpa-tax-optimizer';

describe('CPA Tax Optimization Engine', () => {
  let optimizer: CPATaxOptimizer;

  beforeEach(() => {
    optimizer = new CPATaxOptimizer();
  });

  // ========================================
  // TAX-EXEMPT STATUS GUARDIAN
  // ========================================
  describe('Tax-Exempt Status Guardian', () => {
    const baseOrg: TaxExemptOrg = {
      id: 'test-org', name: 'Test Org', ein: '12-3456789',
      type: '501c3', subType: 'charitable', state: 'OK',
      fiscalYearEnd: 12, annualBudget: 300000,
      grossReceipts: 300000, totalAssets: 150000, yearFounded: 2015
    };

    test('detects private benefit risk', () => {
      const activities = [{ type: 'payment', beneficiary: 'insider', amount: 50000, category: 'compensation' }];
      const alerts = optimizer.analyzeExemptStatus(baseOrg, activities);
      expect(alerts.some(a => a.category === 'exempt_status' && a.severity === 'critical')).toBe(true);
    });

    test('detects prohibited political activity', () => {
      const activities = [{ type: 'expense', category: 'political', amount: 500 }];
      const alerts = optimizer.analyzeExemptStatus(baseOrg, activities);
      expect(alerts.some(a => a.title.includes('Political'))).toBe(true);
      expect(alerts[0].severity).toBe('critical');
    });

    test('warns on excessive compensation ratio', () => {
      const activities = [{ type: 'payment', beneficiary: 'staff', amount: 150000, category: 'compensation' }];
      const alerts = optimizer.analyzeExemptStatus(baseOrg, activities);
      expect(alerts.some(a => a.title.includes('Compensation'))).toBe(true);
    });

    test('returns no alerts for clean org', () => {
      const activities = [{ type: 'expense', category: 'program', amount: 10000 }];
      const alerts = optimizer.analyzeExemptStatus(baseOrg, activities);
      expect(alerts.length).toBe(0);
    });
  });

  // ========================================
  // UBIT TRACKER
  // ========================================
  describe('UBIT Tracker', () => {
    test('identifies taxable unrelated business income', () => {
      const activities: UBITActivity[] = [{
        description: 'Gift shop selling unrelated merchandise',
        revenue: 50000, expenses: 20000, netIncome: 30000,
        isRegular: true, isTradeOrBusiness: true, isSubstantiallyRelated: false
      }];
      const result = optimizer.analyzeUBIT(activities);
      expect(result.hasUBIT).toBe(true);
      expect(result.estimatedUBIT).toBe(30000);
      expect(result.form990TRequired).toBe(true);
      expect(result.estimatedTax).toBeGreaterThan(0);
    });

    test('excludes substantially related activities', () => {
      const activities: UBITActivity[] = [{
        description: 'Thrift store supporting mission',
        revenue: 40000, expenses: 30000, netIncome: 10000,
        isRegular: true, isTradeOrBusiness: true, isSubstantiallyRelated: true
      }];
      const result = optimizer.analyzeUBIT(activities);
      expect(result.hasUBIT).toBe(false);
      expect(result.estimatedUBIT).toBe(0);
    });

    test('applies $1,000 specific deduction', () => {
      const activities: UBITActivity[] = [{
        description: 'Parking lot rental',
        revenue: 2000, expenses: 500, netIncome: 1500,
        isRegular: true, isTradeOrBusiness: true, isSubstantiallyRelated: false
      }];
      const result = optimizer.analyzeUBIT(activities);
      expect(result.estimatedTax).toBe((1500 - 1000) * 0.21); // $105
    });

    test('recognizes exempt activities with applied exemption', () => {
      const activities: UBITActivity[] = [{
        description: 'Volunteer-run bake sale',
        revenue: 5000, expenses: 1000, netIncome: 4000,
        isRegular: true, isTradeOrBusiness: true, isSubstantiallyRelated: false,
        exemptionApplied: 'volunteer_labor'
      }];
      const result = optimizer.analyzeUBIT(activities);
      expect(result.hasUBIT).toBe(false);
      expect(result.exemptActivities.length).toBe(1);
    });
  });

  // ========================================
  // LOBBYING COMPLIANCE
  // ========================================
  describe('Lobbying Compliance', () => {
    test('flags over-limit lobbying without 501(h)', () => {
      const result = optimizer.analyzeLobbyingCompliance(200000, 15000, false);
      expect(result.isWithinLimit).toBe(false);
      expect(result.alerts.some(a => a.severity === 'critical')).toBe(true);
    });

    test('passes within 501(h) election limits', () => {
      const result = optimizer.analyzeLobbyingCompliance(400000, 50000, true);
      expect(result.isWithinLimit).toBe(true);
      expect(result.limitType).toBe('501h_election');
    });

    test('warns when approaching substantial part limit', () => {
      const result = optimizer.analyzeLobbyingCompliance(200000, 8000, false); // 4%
      expect(result.isWithinLimit).toBe(true);
      expect(result.alerts.some(a => a.severity === 'warning')).toBe(true);
    });
  });

  // ========================================
  // FUNCTIONAL EXPENSE ANALYSIS
  // ========================================
  describe('Functional Expense Analysis', () => {
    test('grades A for excellent program ratio', () => {
      const result = optimizer.analyzeFunctionalExpenses(170000, 15000, 15000);
      expect(result.grade).toBe('A');
      expect(result.programRatio).toBeGreaterThan(85);
    });

    test('warns on low program ratio', () => {
      const result = optimizer.analyzeFunctionalExpenses(100000, 60000, 40000);
      expect(result.grade).toBe('D');
      expect(result.alerts.some(a => a.title.includes('Low Program'))).toBe(true);
    });

    test('warns on high fundraising ratio', () => {
      const result = optimizer.analyzeFunctionalExpenses(120000, 20000, 60000);
      expect(result.alerts.some(a => a.title.includes('Fundraising'))).toBe(true);
    });
  });

  // ========================================
  // DONOR TAX BENEFIT MAXIMIZER
  // ========================================
  describe('Donor Tax Benefit Maximizer', () => {
    test('calculates cash donation benefit', () => {
      const result = optimizer.calculateDonorBenefit('Jane Doe', 'cash', 500, 500);
      expect(result.deductibleAmount).toBe(500);
      expect(result.acknowledgmentRequired).toBe(true);
      expect(result.acknowledgmentType).toBe('written_acknowledgment');
    });

    test('handles quid pro quo correctly', () => {
      const result = optimizer.calculateDonorBenefit('John Smith', 'cash', 200, 200, 75);
      expect(result.deductibleAmount).toBe(125);
      expect(result.quidProQuoAmount).toBe(75);
      expect(result.acknowledgmentType).toBe('quid_pro_quo_disclosure');
    });

    test('requires appraisal for property over $5K', () => {
      const result = optimizer.calculateDonorBenefit('Corp LLC', 'property', 10000, 10000);
      expect(result.appraisalRequired).toBe(true);
      expect(result.form8283Required).toBe(true);
    });

    test('handles stock donations at FMV', () => {
      const result = optimizer.calculateDonorBenefit('Investor', 'stock', 25000, 25000);
      expect(result.deductibleAmount).toBe(25000);
      expect(result.appraisalRequired).toBe(true);
    });

    test('flags Schedule M for large in-kind', () => {
      const result = optimizer.calculateDonorBenefit('Big Corp', 'inkind', 30000, 30000);
      expect(result.scheduleMRequired).toBe(true);
    });
  });

  // ========================================
  // PUBLIC SUPPORT TEST
  // ========================================
  describe('Public Support Test', () => {
    test('passes with strong public support', () => {
      const data = [
        { year: 2021, publicSupport: 80000, totalSupport: 100000 },
        { year: 2022, publicSupport: 90000, totalSupport: 120000 },
        { year: 2023, publicSupport: 85000, totalSupport: 110000 }
      ];
      const result = optimizer.analyzePublicSupport(data);
      expect(result.isPublicCharity).toBe(true);
      expect(result.publicSupportPercentage).toBeGreaterThan(33.33);
    });

    test('flags danger zone', () => {
      const data = [
        { year: 2021, publicSupport: 20000, totalSupport: 100000 },
        { year: 2022, publicSupport: 25000, totalSupport: 120000 }
      ];
      const result = optimizer.analyzePublicSupport(data);
      expect(result.isPublicCharity).toBe(false);
      expect(result.dangerZone).toBe(true);
      expect(result.alerts.some(a => a.severity === 'critical')).toBe(true);
    });
  });

  // ========================================
  // WORKER CLASSIFICATION
  // ========================================
  describe('Worker Classification', () => {
    test('classifies as employee with strong factors', () => {
      const factors: ClassificationFactor[] = [
        { factor: 'Set work hours', indicatesEmployee: true, weight: 3 },
        { factor: 'Uses org equipment', indicatesEmployee: true, weight: 2 },
        { factor: 'Receives benefits', indicatesEmployee: true, weight: 2 },
        { factor: 'Works for one client', indicatesEmployee: true, weight: 1 }
      ];
      const result = optimizer.classifyWorker('Admin Staff', factors);
      expect(result.classification).toBe('employee');
      expect(result.confidence).toBeGreaterThan(50);
    });

    test('classifies as contractor with strong factors', () => {
      const factors: ClassificationFactor[] = [
        { factor: 'Sets own hours', indicatesEmployee: false, weight: 3 },
        { factor: 'Uses own tools', indicatesEmployee: false, weight: 2 },
        { factor: 'Multiple clients', indicatesEmployee: false, weight: 2 }
      ];
      const result = optimizer.classifyWorker('Web Designer', factors);
      expect(result.classification).toBe('contractor');
    });

    test('flags ambiguous classification', () => {
      const factors: ClassificationFactor[] = [
        { factor: 'Set hours', indicatesEmployee: true, weight: 2 },
        { factor: 'Own tools', indicatesEmployee: false, weight: 2 }
      ];
      const result = optimizer.classifyWorker('Part-timer', factors);
      expect(result.riskLevel).toBe('high');
      expect(result.alerts.length).toBeGreaterThan(0);
    });
  });

  // ========================================
  // EXECUTIVE COMPENSATION
  // ========================================
  describe('Executive Compensation', () => {
    test('flags unreasonable compensation', () => {
      const result = optimizer.analyzeExecutiveComp(
        'Jane Director', 'Executive Director', 200000, 300000,
        { low: 60000, median: 85000, high: 120000 }
      );
      expect(result.isReasonable).toBe(false);
      expect(result.alerts.some(a => a.severity === 'critical')).toBe(true);
    });

    test('approves reasonable compensation', () => {
      const result = optimizer.analyzeExecutiveComp(
        'John ED', 'Executive Director', 75000, 500000,
        { low: 60000, median: 85000, high: 120000 }
      );
      expect(result.isReasonable).toBe(true);
    });
  });

  // ========================================
  // OVERALL REPORT GENERATION
  // ========================================
  describe('Tax Optimization Report', () => {
    test('generates comprehensive report', () => {
      const org: TaxExemptOrg = {
        id: 'test', name: 'Test', ein: '12-3456789',
        type: '501c3', subType: 'charitable', state: 'OK',
        fiscalYearEnd: 12, annualBudget: 300000,
        grossReceipts: 300000, totalAssets: 150000, yearFounded: 2015
      };
      const ubit = optimizer.analyzeUBIT([]);
      const lobbying = optimizer.analyzeLobbyingCompliance(300000, 5000, false);
      const expenses = optimizer.analyzeFunctionalExpenses(200000, 50000, 50000);
      const support = optimizer.analyzePublicSupport([
        { year: 2023, publicSupport: 200000, totalSupport: 300000 }
      ]);
      const report = optimizer.generateOptimizationReport(org, ubit, lobbying, expenses, support);
      expect(report.overallHealthScore).toBeGreaterThan(0);
      expect(report.overallGrade).toBeDefined();
      expect(report.generatedAt).toBeDefined();
    });
  });

  // ========================================
  // PLAIN LANGUAGE
  // ========================================
  describe('Plain Language Translator', () => {
    test('translates UBIT', () => {
      expect(optimizer.translateToPlainLanguage('UBIT')).toBe('Side Business Income Tax');
    });
    test('translates Form 990-T', () => {
      expect(optimizer.translateToPlainLanguage('Form 990-T')).toBe('Side Business Tax Form');
    });
    test('returns original for unknown term', () => {
      expect(optimizer.translateToPlainLanguage('XYZ123')).toBe('XYZ123');
    });
  });

  // ========================================
  // OKLAHOMA STATE — 3 ORG TYPES
  // ========================================
  describe('Oklahoma State Tests', () => {

    // 🛕 OK Hindu Temple — $120K budget
    describe('OK-T1: Tulsa Hindu Temple', () => {
      const temple: TaxExemptOrg = {
        id: 'ok-temple', name: 'Tulsa Hindu Temple', ein: '73-1234567',
        type: '501c3', subType: 'religious', state: 'OK',
        fiscalYearEnd: 12, annualBudget: 120000,
        grossReceipts: 120000, totalAssets: 300000, yearFounded: 2008
      };

      test('temple UBIT from gift shop', () => {
        const activities: UBITActivity[] = [{
          description: 'Temple gift shop — religious items',
          revenue: 15000, expenses: 8000, netIncome: 7000,
          isRegular: true, isTradeOrBusiness: true, isSubstantiallyRelated: true
        }];
        const result = optimizer.analyzeUBIT(activities);
        expect(result.hasUBIT).toBe(false); // Religious items = substantially related
      });

      test('temple functional expenses — high program', () => {
        const result = optimizer.analyzeFunctionalExpenses(96000, 14400, 9600);
        expect(result.grade).toBe('A'); // 80% program
        expect(result.programRatio).toBe(80);
      });

      test('temple public support from congregation', () => {
        const data = [
          { year: 2023, publicSupport: 90000, totalSupport: 120000 },
          { year: 2024, publicSupport: 95000, totalSupport: 125000 }
        ];
        const result = optimizer.analyzePublicSupport(data);
        expect(result.isPublicCharity).toBe(true);
        expect(result.publicSupportPercentage).toBeGreaterThan(70);
      });
    });

    // 🍽️ OK Food Bank — $280K budget
    describe('OK-FB1: Oklahoma City Community Food Bank', () => {
      const foodBank: TaxExemptOrg = {
        id: 'ok-foodbank', name: 'OKC Community Food Bank', ein: '73-2345678',
        type: '501c3', subType: 'charitable', state: 'OK',
        fiscalYearEnd: 6, annualBudget: 280000,
        grossReceipts: 280000, totalAssets: 120000, yearFounded: 2012
      };

      test('food bank UBIT from catering side business', () => {
        const activities: UBITActivity[] = [{
          description: 'Catering service for corporate events',
          revenue: 35000, expenses: 20000, netIncome: 15000,
          isRegular: true, isTradeOrBusiness: true, isSubstantiallyRelated: false
        }];
        const result = optimizer.analyzeUBIT(activities);
        expect(result.hasUBIT).toBe(true);
        expect(result.form990TRequired).toBe(true);
        expect(result.estimatedTax).toBe((15000 - 1000) * 0.21);
      });

      test('food bank in-kind donation tracking', () => {
        const result = optimizer.calculateDonorBenefit(
          'Local Grocery Chain', 'inkind', 45000, 45000
        );
        expect(result.scheduleMRequired).toBe(true);
        expect(result.appraisalRequired).toBe(true);
        expect(result.form8283Required).toBe(true);
      });

      test('food bank worker classification — delivery driver', () => {
        const factors: ClassificationFactor[] = [
          { factor: 'Set delivery schedule', indicatesEmployee: true, weight: 3 },
          { factor: 'Uses food bank truck', indicatesEmployee: true, weight: 2 },
          { factor: 'Wears uniform', indicatesEmployee: true, weight: 1 },
          { factor: 'Works only for food bank', indicatesEmployee: true, weight: 2 }
        ];
        const result = optimizer.classifyWorker('Delivery Driver', factors);
        expect(result.classification).toBe('employee');
        expect(result.riskLevel).toBe('low');
      });
    });

    // 💻 OK IT Support Nonprofit — $85K budget  
    describe('OK-IT1: Norman Digital Bridge', () => {
      const itOrg: TaxExemptOrg = {
        id: 'ok-it', name: 'Norman Digital Bridge', ein: '73-3456789',
        type: '501c3', subType: 'educational', state: 'OK',
        fiscalYearEnd: 12, annualBudget: 85000,
        grossReceipts: 85000, totalAssets: 25000, yearFounded: 2019
      };

      test('IT org exec comp is reasonable', () => {
        const result = optimizer.analyzeExecutiveComp(
          'Director', 'Executive Director', 45000, 85000,
          { low: 35000, median: 50000, high: 70000 }
        );
        expect(result.isReasonable).toBe(true);
      });

      test('IT org lobbying for digital equity legislation', () => {
        const result = optimizer.analyzeLobbyingCompliance(85000, 2000, false);
        expect(result.isWithinLimit).toBe(true);
        expect(result.lobbyingPercentage).toBeLessThan(5);
      });

      test('IT org full optimization report', () => {
        const ubit = optimizer.analyzeUBIT([]);
        const lobbying = optimizer.analyzeLobbyingCompliance(85000, 1000, false);
        const expenses = optimizer.analyzeFunctionalExpenses(63750, 12750, 8500);
        const support = optimizer.analyzePublicSupport([
          { year: 2023, publicSupport: 60000, totalSupport: 85000 }
        ]);
        const report = optimizer.generateOptimizationReport(itOrg, ubit, lobbying, expenses, support);
        expect(report.overallHealthScore).toBeGreaterThanOrEqual(70);
        expect(report.overallGrade).toMatch(/[AB]/);
        expect(report.criticalAlerts.length).toBe(0);
      });
    });
  });
});
