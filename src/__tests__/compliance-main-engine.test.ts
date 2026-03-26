// CharityFlow — Compliance Engine (Main Logic) — Executable Tests
// Module 14 — Oklahoma × 3 Org Types + Core Engine Tests

import {
  determineForm990Version,
  calculateFilingFee,
  determineAuditRequirement,
  isReligiousExempt,
  getRecentLawUpdates,
  calculateComplianceHealthScore,
  generateComplianceRoadmap,
  translateToPlainLanguage,
  getSupportedStates,
  getStateRules,
} from '../lib/compliance/compliance-engine';

// ==================== FIXTURES ====================

const oklahomaTemple = {
  name: 'Tulsa Hindu Temple',
  state: 'Oklahoma',
  city: 'Tulsa',
  orgType: '501c3_religious' as const,
  annualBudget: 180000,
  grossReceipts: 150000,
  totalAssets: 200000,
  fiscalYearEnd: '12-31',
  foundedYear: 2010,
  hasEmployees: false,
  conductsFundraising: true,
  hasUnrelatedBusinessIncome: false,
};

const oklahomaFoodBank = {
  name: 'Oklahoma City Community Food Bank',
  state: 'Oklahoma',
  city: 'Oklahoma City',
  orgType: '501c3_charitable' as const,
  annualBudget: 420000,
  grossReceipts: 380000,
  totalAssets: 250000,
  fiscalYearEnd: '06-30',
  foundedYear: 2015,
  hasEmployees: true,
  employeeCount: 8,
  conductsFundraising: true,
  hasUnrelatedBusinessIncome: true,
  ubiAmount: 5000,
};

const oklahomaITNonprofit = {
  name: 'OKC Digital Bridge',
  state: 'Oklahoma',
  city: 'Oklahoma City',
  orgType: '501c3_educational' as const,
  annualBudget: 85000,
  grossReceipts: 72000,
  totalAssets: 45000,
  fiscalYearEnd: '12-31',
  foundedYear: 2020,
  hasEmployees: false,
  conductsFundraising: true,
  hasUnrelatedBusinessIncome: false,
};

// ==================== FORM 990 VERSION DETECTION ====================

describe('Form 990 Version Detection', () => {
  test('Small org (under $50K) gets 990-N', () => {
    const smallOrg = { ...oklahomaITNonprofit, grossReceipts: 40000 };
    const result = determineForm990Version(smallOrg);
    expect(result.version).toBe('990-N');
    expect(result.electronicFilingRequired).toBe(true);
  });

  test('Mid org (under $200K receipts, under $500K assets) gets 990-EZ', () => {
    const result = determineForm990Version(oklahomaTemple);
    expect(result.version).toBe('990-EZ');
    expect(result.reason).toContain('under $200,000');
  });

  test('Larger org (over $200K receipts) gets full 990', () => {
    const largeOrg = { ...oklahomaFoodBank, grossReceipts: 250000 };
    const result = determineForm990Version(largeOrg);
    expect(result.version).toBe('990');
  });

  test('Deadline calculated correctly for Dec fiscal year', () => {
    const result = determineForm990Version(oklahomaTemple);
    expect(result.deadline).toContain('May 15');
  });

  test('Deadline calculated correctly for June fiscal year', () => {
    const result = determineForm990Version(oklahomaFoodBank);
    expect(result.deadline).toContain('November 15');
  });
});

// ==================== FILING FEE CALCULATION ====================

describe('Filing Fee Calculation', () => {
  test('Oklahoma filing fee is $15', () => {
    const result = calculateFilingFee(oklahomaFoodBank);
    expect(result.totalFee).toBe(15);
    expect(result.state).toBe('Oklahoma');
  });

  test('Texas has zero filing fees', () => {
    const texasOrg = { ...oklahomaFoodBank, state: 'Texas' };
    const result = calculateFilingFee(texasOrg);
    expect(result.totalFee).toBe(0);
  });

  test('California fee scales with revenue', () => {
    const caOrg = { ...oklahomaFoodBank, state: 'California', grossReceipts: 300000 };
    const result = calculateFilingFee(caOrg);
    expect(result.totalFee).toBe(50);
  });

  test('Unknown state returns $0', () => {
    const unknownOrg = { ...oklahomaFoodBank, state: 'Mars' };
    const result = calculateFilingFee(unknownOrg);
    expect(result.totalFee).toBe(0);
  });
});

// ==================== AUDIT REQUIREMENTS ====================

describe('Audit Requirements', () => {
  test('Oklahoma org under $500K has no audit', () => {
    const result = determineAuditRequirement(oklahomaFoodBank);
    expect(result.required).toBe(false);
  });

  test('Oklahoma org over $500K needs financial review', () => {
    const bigOrg = { ...oklahomaFoodBank, grossReceipts: 600000 };
    const result = determineAuditRequirement(bigOrg);
    expect(result.required).toBe(true);
    expect(result.type).toBe('financial_review');
  });

  test('Oklahoma org over $1M needs CPA audit', () => {
    const hugeOrg = { ...oklahomaFoodBank, grossReceipts: 1200000 };
    const result = determineAuditRequirement(hugeOrg);
    expect(result.required).toBe(true);
    expect(result.type).toBe('cpa_audit');
  });

  test('Texas has no audit requirements', () => {
    const texasOrg = { ...oklahomaFoodBank, state: 'Texas', grossReceipts: 5000000 };
    const result = determineAuditRequirement(texasOrg);
    expect(result.required).toBe(false);
  });
});

// ==================== RELIGIOUS EXEMPTIONS ====================

describe('Religious Exemptions', () => {
  test('Oklahoma temple IS exempt from solicitation registration', () => {
    const result = isReligiousExempt(oklahomaTemple);
    expect(result.exempt).toBe(true);
    expect(result.statute).toContain('552.2');
    expect(result.exemptFrom).toContain('Charitable solicitation registration');
  });

  test('Oklahoma food bank is NOT exempt (not religious)', () => {
    const result = isReligiousExempt(oklahomaFoodBank);
    expect(result.exempt).toBe(false);
  });

  test('New York religious org exempt from CHAR410/CHAR500', () => {
    const nyTemple = { ...oklahomaTemple, state: 'New York' };
    const result = isReligiousExempt(nyTemple);
    expect(result.exempt).toBe(true);
    expect(result.statute).toContain('EPTL');
  });

  test('Florida religious org NOT exempt from Chapter 496', () => {
    const flTemple = { ...oklahomaTemple, state: 'Florida' };
    const result = isReligiousExempt(flTemple);
    expect(result.exempt).toBe(false);
  });

  test('Texas all orgs exempt (no state registration)', () => {
    const txTemple = { ...oklahomaTemple, state: 'Texas' };
    const result = isReligiousExempt(txTemple);
    expect(result.exempt).toBe(true);
  });
});

// ==================== LAW UPDATES ====================

describe('Law Updates', () => {
  test('Oklahoma has at least one law update', () => {
    const updates = getRecentLawUpdates('Oklahoma');
    expect(updates.length).toBeGreaterThan(0);
    expect(updates[0].state).toBe('Oklahoma');
  });

  test('Florida has SB 700 foreign donor ban', () => {
    const updates = getRecentLawUpdates('Florida');
    const sb700 = updates.find(u => u.id === 'FL-2025-001');
    expect(sb700).toBeDefined();
    expect(sb700!.impact).toBe('high');
  });

  test('All states combined returns sorted updates', () => {
    const all = getRecentLawUpdates();
    expect(all.length).toBeGreaterThan(3);
    // Verify sorted by date descending
    for (let i = 1; i < all.length; i++) {
      expect(new Date(all[i-1].effectiveDate).getTime()).toBeGreaterThanOrEqual(new Date(all[i].effectiveDate).getTime());
    }
  });
});

// ==================== HEALTH SCORE ====================

describe('Compliance Health Score', () => {
  test('New org with nothing completed scores 0 (or only exempt items)', () => {
    const result = calculateComplianceHealthScore(oklahomaFoodBank, []);
    expect(result.score).toBeLessThanOrEqual(30); // May get exempt categories
    expect(result.grade).toBe('F');
  });

  test('Fully compliant org scores 100', () => {
    const result = calculateComplianceHealthScore(oklahomaFoodBank, [
      'form_990_filed', 'state_registered', 'state_annual_filed', 'audit_completed', 'board_minutes_current'
    ]);
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
  });

  test('Partially compliant org gets proportional score', () => {
    const result = calculateComplianceHealthScore(oklahomaFoodBank, ['form_990_filed', 'state_registered']);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
  });

  test('Texas org gets auto-credit for exempt categories', () => {
    const texasOrg = { ...oklahomaFoodBank, state: 'Texas' };
    const result = calculateComplianceHealthScore(texasOrg, ['form_990_filed', 'board_minutes_current']);
    // TX has no state registration or annual filing, so those are auto-credited
    expect(result.score).toBeGreaterThan(50);
  });

  test('Health score breakdown has 5 categories', () => {
    const result = calculateComplianceHealthScore(oklahomaFoodBank, []);
    expect(result.breakdown.length).toBe(5);
  });
});

// ==================== ROADMAP GENERATION ====================

describe('Compliance Roadmap Generation', () => {
  test('Oklahoma food bank roadmap has federal + state items', () => {
    const roadmap = generateComplianceRoadmap(oklahomaFoodBank);
    expect(roadmap.items.length).toBeGreaterThan(2);
    const federal = roadmap.items.filter(i => i.category === 'federal');
    const state = roadmap.items.filter(i => i.category === 'state');
    expect(federal.length).toBeGreaterThan(0);
    expect(state.length).toBeGreaterThan(0);
  });

  test('Oklahoma food bank with UBIT gets Form 990-T item', () => {
    const roadmap = generateComplianceRoadmap(oklahomaFoodBank);
    const ubitItem = roadmap.items.find(i => i.id === 'FED-002');
    expect(ubitItem).toBeDefined();
    expect(ubitItem!.plainTitle).toContain('Side Business Income');
  });

  test('Oklahoma temple (religious) has fewer state items', () => {
    const templeRoadmap = generateComplianceRoadmap(oklahomaTemple);
    const foodBankRoadmap = generateComplianceRoadmap(oklahomaFoodBank);
    // Temple exempt from solicitation registration
    expect(templeRoadmap.items.length).toBeLessThanOrEqual(foodBankRoadmap.items.length);
  });

  test('Roadmap includes quarterly schedule with 4 quarters', () => {
    const roadmap = generateComplianceRoadmap(oklahomaITNonprofit);
    expect(roadmap.quarterlySchedule.length).toBe(4);
    expect(roadmap.quarterlySchedule[0].quarter).toBe('Q1');
    expect(roadmap.quarterlySchedule[3].quarter).toBe('Q4');
  });

  test('Roadmap includes health score and grade', () => {
    const roadmap = generateComplianceRoadmap(oklahomaITNonprofit);
    expect(roadmap.healthScore).toBeDefined();
    expect(['A', 'B', 'C', 'D', 'F']).toContain(roadmap.healthGrade);
  });
});

// ==================== PLAIN LANGUAGE ====================

describe('Plain Language Translation', () => {
  test('Form 990 translates correctly', () => {
    expect(translateToPlainLanguage('Form 990')).toBe('Annual Tax Report');
  });

  test('UBIT translates correctly', () => {
    expect(translateToPlainLanguage('UBIT')).toBe('Tax on Side Business Income');
  });

  test('Compliance health score translates', () => {
    expect(translateToPlainLanguage('compliance health score')).toContain('Following the Rules');
  });

  test('Unknown term returns as-is', () => {
    expect(translateToPlainLanguage('xyzzy')).toBe('xyzzy');
  });
});

// ==================== UTILITY FUNCTIONS ====================

describe('Utility Functions', () => {
  test('getSupportedStates returns 6 states', () => {
    const states = getSupportedStates();
    expect(states.length).toBe(6);
    expect(states).toContain('Oklahoma');
    expect(states).toContain('California');
  });

  test('getStateRules returns rules for Oklahoma', () => {
    const rules = getStateRules('Oklahoma');
    expect(rules).not.toBeNull();
    expect(rules!.registrationRequired).toBe(true);
  });

  test('getStateRules returns null for unknown state', () => {
    const rules = getStateRules('Mars');
    expect(rules).toBeNull();
  });
});

// ==================== OKLAHOMA × 3 ORG TYPE SCENARIOS ====================

describe('Oklahoma — Hindu Temple (Religious)', () => {
  test('Temple gets 990-EZ and is exempt from solicitation registration', () => {
    const form = determineForm990Version(oklahomaTemple);
    const exemption = isReligiousExempt(oklahomaTemple);
    expect(form.version).toBe('990-EZ');
    expect(exemption.exempt).toBe(true);
  });

  test('Temple compliance roadmap reflects religious exemptions', () => {
    const roadmap = generateComplianceRoadmap(oklahomaTemple);
    // Should not have state registration item (exempt)
    const stateReg = roadmap.items.find(i => i.id === 'STATE-001');
    expect(stateReg).toBeUndefined();
  });

  test('Temple health score credits exempt categories', () => {
    const health = calculateComplianceHealthScore(oklahomaTemple, ['form_990_filed', 'board_minutes_current']);
    expect(health.score).toBeGreaterThan(40);
  });
});

describe('Oklahoma — Community Food Bank (Charitable)', () => {
  test('Food bank must register and file annually in Oklahoma', () => {
    const rules = getStateRules('Oklahoma');
    expect(rules!.registrationRequired).toBe(true);
    expect(rules!.annualFilingRequired).toBe(true);
    const fee = calculateFilingFee(oklahomaFoodBank);
    expect(fee.totalFee).toBe(15);
  });

  test('Food bank with UBIT gets additional Form 990-T requirement', () => {
    const roadmap = generateComplianceRoadmap(oklahomaFoodBank);
    const ubitItem = roadmap.items.find(i => i.title.includes('990-T'));
    expect(ubitItem).toBeDefined();
  });

  test('Food bank compliance is more complex than temple', () => {
    const fbRoadmap = generateComplianceRoadmap(oklahomaFoodBank);
    const templeRoadmap = generateComplianceRoadmap(oklahomaTemple);
    expect(fbRoadmap.items.length).toBeGreaterThan(templeRoadmap.items.length);
  });
});

describe('Oklahoma — IT Education Nonprofit (Educational)', () => {
  test('IT nonprofit gets 990-EZ (under thresholds)', () => {
    const form = determineForm990Version(oklahomaITNonprofit);
    expect(form.version).toBe('990-EZ');
  });

  test('IT nonprofit is NOT religiously exempt', () => {
    const exemption = isReligiousExempt(oklahomaITNonprofit);
    expect(exemption.exempt).toBe(false);
  });

  test('IT nonprofit has no audit requirement (under $500K)', () => {
    const audit = determineAuditRequirement(oklahomaITNonprofit);
    expect(audit.required).toBe(false);
    expect(audit.type).toBe('none');
  });
});
