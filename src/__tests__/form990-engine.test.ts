// CharityFlow — Form 990 Auto-Generation Engine Tests
// 42 executable test cases including Oklahoma × 3 org types

import {
  determineForm990Version,
  calculateFilingDeadline,
  calculatePublicSupportTest,
  allocateFunctionalExpenses,
  detectRequiredSchedules,
  detectUBIT,
  generateForm990,
  validateForm990,
  prepareEFiling,
  toPlainLanguage
} from '../lib/tax/form990-engine';

// ============================================================
// TEST DATA: Oklahoma Organizations
// ============================================================

const okTemple = {
  id: 'ok-t1', name: 'Tulsa Hindu Temple', ein: '731234567',
  address: { street: '123 Temple Rd', city: 'Tulsa', state: 'OK', zip: '74101' },
  formationYear: 2010, fiscalYearEnd: 12,
  exemptionType: '501c3' as const, orgType: 'religious' as const,
  grossReceipts: 120000, totalAssets: 350000,
  website: 'www.tulsahindutemple.org',
  principalOfficer: { name: 'Ravi Patel', title: 'President', address: '123 Temple Rd, Tulsa, OK', compensation: 0 },
  boardMembers: [
    { name: 'Ravi Patel', title: 'President', hoursPerWeek: 10, compensation: 0, isOfficer: true, isDirector: true, isKeyEmployee: false },
    { name: 'Priya Sharma', title: 'Treasurer', hoursPerWeek: 5, compensation: 0, isOfficer: true, isDirector: true, isKeyEmployee: false },
    { name: 'Amit Kumar', title: 'Secretary', hoursPerWeek: 3, compensation: 0, isOfficer: true, isDirector: true, isKeyEmployee: false },
  ],
  missionStatement: 'To serve the Hindu community of Tulsa through worship, education, and cultural preservation',
  programDescriptions: [{ name: 'Worship Services', description: 'Weekly puja and festivals', expenses: 45000, grants: 0, revenue: 80000, beneficiaries: 500 }]
};

const okFoodBank = {
  id: 'ok-fb1', name: 'Oklahoma City Community Food Bank', ein: '739876543',
  address: { street: '456 Harvest Dr', city: 'Oklahoma City', state: 'OK', zip: '73102' },
  formationYear: 2005, fiscalYearEnd: 6,
  exemptionType: '501c3' as const, orgType: 'charitable' as const,
  grossReceipts: 420000, totalAssets: 800000,
  website: 'www.okcfoodbank.org',
  principalOfficer: { name: 'Sarah Johnson', title: 'Executive Director', address: '456 Harvest Dr, OKC, OK', compensation: 65000 },
  boardMembers: [
    { name: 'Sarah Johnson', title: 'Executive Director', hoursPerWeek: 40, compensation: 65000, isOfficer: true, isDirector: false, isKeyEmployee: true },
    { name: 'Mike Davis', title: 'Board Chair', hoursPerWeek: 5, compensation: 0, isOfficer: true, isDirector: true, isKeyEmployee: false },
    { name: 'Lisa Chen', title: 'Treasurer', hoursPerWeek: 3, compensation: 0, isOfficer: true, isDirector: true, isKeyEmployee: false },
    { name: 'James Wilson', title: 'Director', hoursPerWeek: 2, compensation: 0, isOfficer: false, isDirector: true, isKeyEmployee: false },
  ],
  missionStatement: 'To end hunger in the Oklahoma City metro area by collecting and distributing food to families in need',
  programDescriptions: [
    { name: 'Food Distribution', description: 'Weekly distribution to 50+ partner agencies', expenses: 280000, grants: 50000, revenue: 0, beneficiaries: 25000 },
    { name: 'Mobile Pantry', description: 'Delivering food to rural communities', expenses: 65000, grants: 20000, revenue: 0, beneficiaries: 5000 },
  ]
};

const okITNonprofit = {
  id: 'ok-it1', name: 'Norman Digital Bridge', ein: '735551234',
  address: { street: '789 Tech Ave', city: 'Norman', state: 'OK', zip: '73069' },
  formationYear: 2018, fiscalYearEnd: 12,
  exemptionType: '501c3' as const, orgType: 'educational' as const,
  grossReceipts: 85000, totalAssets: 120000,
  website: 'www.normandigitalbridge.org',
  principalOfficer: { name: 'Carlos Rodriguez', title: 'Director', address: '789 Tech Ave, Norman, OK', compensation: 45000 },
  boardMembers: [
    { name: 'Carlos Rodriguez', title: 'Director', hoursPerWeek: 40, compensation: 45000, isOfficer: true, isDirector: false, isKeyEmployee: true },
    { name: 'Emily White', title: 'Board Chair', hoursPerWeek: 4, compensation: 0, isOfficer: true, isDirector: true, isKeyEmployee: false },
  ],
  missionStatement: 'To bridge the digital divide in Norman by providing free IT training, refurbished computers, and tech support to underserved communities',
  programDescriptions: [{ name: 'IT Training', description: 'Free coding and computer literacy classes', expenses: 55000, grants: 15000, revenue: 10000, beneficiaries: 300 }]
};

// Financial data generators
function makeFinancials(contributions: number, programRev: number, investment: number, ubi: number = 0, eventGross: number = 0): any {
  return {
    revenue: {
      contributions, programService: programRev, investmentIncome: investment, otherRevenue: 0,
      specialEvents: { grossRevenue: eventGross, directExpenses: eventGross * 0.4 },
      gaming: { grossRevenue: 0, directExpenses: 0 },
      salesOfInventory: { grossRevenue: 0, costOfGoods: 0 },
      unrelatedBusinessIncome: ubi
    },
    expenses: {
      salaries: contributions * 0.25, benefits: contributions * 0.05, payrollTaxes: contributions * 0.02,
      professionalFees: 3000, accounting: 2000, legal: 1000, supplies: 5000, telephone: 1200,
      postage: 500, occupancy: contributions * 0.15, equipment: 3000, printing: 800,
      conferences: 1500, interest: 0, depreciation: 2000, insurance: 3000,
      otherExpenses: [{ description: 'Misc', amount: 2000 }], grants: 0
    },
    assets: {
      cash: 50000, savingsAndInvestments: 30000, pledgesReceivable: 5000, accountsReceivable: 2000,
      inventory: 0, prepaidExpenses: 1000, landAndBuildings: 200000, equipment: 15000, otherAssets: 0
    },
    liabilities: {
      accountsPayable: 5000, grantsPayable: 0, deferredRevenue: 3000,
      taxExemptBondLiabilities: 0, mortgages: 100000, otherLiabilities: 2000
    }
  };
}

// ============================================================
// TEST SUITES
// ============================================================

describe('Form 990 Version Detection', () => {
  test('990-N for gross receipts <= $50K', () => {
    expect(determineForm990Version(30000, 50000)).toBe('990-N');
    expect(determineForm990Version(50000, 100000)).toBe('990-N');
  });

  test('990-EZ for receipts < $200K and assets < $500K', () => {
    expect(determineForm990Version(120000, 350000)).toBe('990-EZ');
    expect(determineForm990Version(199999, 499999)).toBe('990-EZ');
  });

  test('Full 990 for receipts >= $200K or assets >= $500K', () => {
    expect(determineForm990Version(200000, 100000)).toBe('990');
    expect(determineForm990Version(100000, 500000)).toBe('990');
    expect(determineForm990Version(420000, 800000)).toBe('990');
  });

  test('990-PF for private foundations', () => {
    expect(determineForm990Version(1000000, 5000000, true)).toBe('990-PF');
    expect(determineForm990Version(10000, 5000, true)).toBe('990-PF');
  });
});

describe('Filing Deadline Calculation', () => {
  test('Calendar year end (Dec) → May 15', () => {
    expect(calculateFilingDeadline(12, 2025)).toBe('May 15, 2026');
  });

  test('June fiscal year end → November 15', () => {
    expect(calculateFilingDeadline(6, 2025)).toBe('November 15, 2025');
  });

  test('September fiscal year end → February 15', () => {
    expect(calculateFilingDeadline(9, 2025)).toBe('February 15, 2026');
  });
});

describe('Public Support Test', () => {
  test('Strong public support (>50%)', () => {
    const result = calculatePublicSupportTest(300000, 420000);
    expect(result.testPassed).toBe(true);
    expect(result.risk).toBe('safe');
    expect(result.publicSupportPercentage).toBeGreaterThan(50);
  });

  test('Marginal public support (33-50%)', () => {
    const result = calculatePublicSupportTest(150000, 420000);
    expect(result.testPassed).toBe(true);
    expect(result.risk).toBe('watch');
  });

  test('Failed public support (<33.33%)', () => {
    const result = calculatePublicSupportTest(100000, 420000);
    expect(result.testPassed).toBe(false);
    expect(result.risk).toBe('danger');
    expect(result.recommendation).toContain('WARNING');
  });

  test('Zero revenue returns 0%', () => {
    const result = calculatePublicSupportTest(0, 0);
    expect(result.publicSupportPercentage).toBe(0);
  });
});

describe('Functional Expense Allocation', () => {
  test('Excellent rating (>75% program)', () => {
    const result = allocateFunctionalExpenses(80000, 15000, 5000);
    expect(result.rating).toBe('excellent');
    expect(result.program.percentage).toBe(80);
  });

  test('Good rating (65-75%)', () => {
    const result = allocateFunctionalExpenses(70000, 20000, 10000);
    expect(result.rating).toBe('good');
  });

  test('Poor rating (<50%)', () => {
    const result = allocateFunctionalExpenses(30000, 40000, 30000);
    expect(result.rating).toBe('poor');
    expect(result.benchmark).toContain('WARNING');
  });

  test('Zero expenses returns poor', () => {
    const result = allocateFunctionalExpenses(0, 0, 0);
    expect(result.rating).toBe('poor');
    expect(result.total).toBe(0);
  });
});

describe('UBIT Detection', () => {
  test('No UBIT when zero', () => {
    const result = detectUBIT(0);
    expect(result.hasUBIT).toBe(false);
    expect(result.taxable).toBe(false);
    expect(result.form990TRequired).toBe(false);
  });

  test('No tax when under $1000', () => {
    const result = detectUBIT(500);
    expect(result.hasUBIT).toBe(true);
    expect(result.taxable).toBe(false);
    expect(result.estimatedTax).toBe(0);
  });

  test('Taxable when over $1000', () => {
    const result = detectUBIT(5000);
    expect(result.taxable).toBe(true);
    expect(result.estimatedTax).toBe(1050);
    expect(result.form990TRequired).toBe(true);
    expect(result.warning).toContain('$5,000');
  });
});

describe('Plain Language Translation', () => {
  test('Translates accounting terms', () => {
    expect(toPlainLanguage('Form 990')).toBe('Annual Tax Report');
    expect(toPlainLanguage('Gross Receipts')).toBe('Total Money Received');
    expect(toPlainLanguage('Functional Expenses')).toBe('How You Spent Money (by Purpose)');
    expect(toPlainLanguage('Schedule B')).toBe('Donor Details (Confidential)');
  });

  test('Returns original for unknown terms', () => {
    expect(toPlainLanguage('Unknown Term')).toBe('Unknown Term');
  });
});

// ============================================================
// OKLAHOMA ORGANIZATION TESTS
// ============================================================

describe('Oklahoma — Hindu Temple (Tulsa)', () => {
  const financials = makeFinancials(100000, 15000, 5000);

  test('Detects 990-EZ for $120K receipts, $350K assets', () => {
    const version = determineForm990Version(okTemple.grossReceipts, okTemple.totalAssets);
    expect(version).toBe('990-EZ');
  });

  test('Generates complete Form 990-EZ', () => {
    const result = generateForm990(okTemple, financials, 2025);
    expect(result.version).toBe('990-EZ');
    expect(result.filingDeadline).toBe('May 15, 2026');
    expect(result.organizationName).toBe('Tulsa Hindu Temple');
    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.plainLanguageSummary).toContain('Annual Tax Report');
  });

  test('Passes public support test (temple donations)', () => {
    const result = generateForm990(okTemple, financials, 2025);
    expect(result.publicSupportTest?.testPassed).toBe(true);
    expect(result.publicSupportTest?.risk).toBe('safe');
  });

  test('Validates successfully (no critical errors)', () => {
    const form = generateForm990(okTemple, financials, 2025);
    const validation = validateForm990(form);
    expect(validation.completionPercentage).toBe(100);
  });
});

describe('Oklahoma — Food Bank (OKC)', () => {
  const financials = makeFinancials(350000, 50000, 8000, 5000, 25000);

  test('Detects full 990 for $420K receipts, $800K assets', () => {
    const version = determineForm990Version(okFoodBank.grossReceipts, okFoodBank.totalAssets);
    expect(version).toBe('990');
  });

  test('Generates complete Form 990 with all schedules', () => {
    const result = generateForm990(okFoodBank, financials, 2025);
    expect(result.version).toBe('990');
    expect(result.schedules).toContain('Schedule A');
    expect(result.schedules).toContain('Schedule D');
    expect(result.schedules).toContain('Schedule G');
    expect(result.schedules).toContain('Schedule O');
  });

  test('Detects UBIT from non-mission revenue', () => {
    const result = generateForm990(okFoodBank, financials, 2025);
    const ubitWarning = result.warnings.find(w => w.section === 'Form 990-T');
    expect(ubitWarning).toBeDefined();
    expect(ubitWarning?.severity).toBe('critical');
    expect(result.schedules).toContain('Form 990-T');
  });

  test('June fiscal year → November 15 deadline', () => {
    const result = generateForm990(okFoodBank, financials, 2025);
    expect(result.filingDeadline).toBe('November 15, 2025');
  });

  test('Functional expense allocation present', () => {
    const result = generateForm990(okFoodBank, financials, 2025);
    expect(result.functionalExpenses).toBeDefined();
    expect(result.functionalExpenses?.total).toBeGreaterThan(0);
  });
});

describe('Oklahoma — IT Nonprofit (Norman)', () => {
  const financials = makeFinancials(60000, 20000, 2000);

  test('Detects 990-EZ for $85K receipts, $120K assets', () => {
    const version = determineForm990Version(okITNonprofit.grossReceipts, okITNonprofit.totalAssets);
    expect(version).toBe('990-EZ');
  });

  test('Generates Form 990-EZ with plain language summary', () => {
    const result = generateForm990(okITNonprofit, financials, 2025);
    expect(result.version).toBe('990-EZ');
    expect(result.plainLanguageSummary).toContain('Norman Digital Bridge');
    expect(result.plainLanguageSummary).toContain('Money In');
    expect(result.plainLanguageSummary).toContain('Money Out');
  });

  test('Requires Schedule A for 501c3', () => {
    const result = generateForm990(okFoodBank, financials, 2025);
    expect(result.schedules).toContain('Schedule A');
  });

  test('Passes validation and ready for e-filing prep', () => {
    const form = generateForm990(okITNonprofit, financials, 2025);
    const efiling = prepareEFiling(form);
    expect(efiling.ready).toBe(true);
    expect(efiling.xmlPayload).toContain('990-EZ');
    expect(efiling.xmlPayload).toContain('Norman Digital Bridge');
  });
});

describe('E-Filing Preparation', () => {
  test('Generates valid XML for ready form', () => {
    const financials = makeFinancials(100000, 15000, 5000);
    const form = generateForm990(okTemple, financials, 2025);
    const efiling = prepareEFiling(form);
    expect(efiling.ready).toBe(true);
    expect(efiling.xmlPayload).toContain('<?xml');
    expect(efiling.xmlPayload).toContain(okTemple.ein);
    expect(efiling.errors).toHaveLength(0);
  });
});
