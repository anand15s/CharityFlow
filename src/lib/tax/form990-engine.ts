// CharityFlow — Form 990 Auto-Generation Engine v1.0
// Production-grade engine for automated IRS Form 990 preparation and filing

// ============================================================
// TYPES
// ============================================================

export interface OrganizationProfile {
  id: string;
  name: string;
  ein: string;
  address: { street: string; city: string; state: string; zip: string };
  formationYear: number;
  fiscalYearEnd: number; // month 1-12
  exemptionType: '501c3' | '501c4' | '501c6' | '501c7' | '501c8' | '501c19';
  orgType: 'religious' | 'charitable' | 'educational' | 'scientific' | 'literary';
  grossReceipts: number;
  totalAssets: number;
  website?: string;
  principalOfficer: { name: string; title: string; address: string; compensation: number };
  boardMembers: BoardMember[];
  missionStatement: string;
  programDescriptions: ProgramDescription[];
}

export interface BoardMember {
  name: string;
  title: string;
  hoursPerWeek: number;
  compensation: number;
  isOfficer: boolean;
  isDirector: boolean;
  isKeyEmployee: boolean;
}

export interface ProgramDescription {
  name: string;
  description: string;
  expenses: number;
  grants: number;
  revenue: number;
  beneficiaries: number;
}

export interface FinancialData {
  revenue: RevenueSection;
  expenses: ExpenseSection;
  assets: AssetSection;
  liabilities: LiabilitySection;
}

export interface RevenueSection {
  contributions: number;
  programService: number;
  investmentIncome: number;
  otherRevenue: number;
  specialEvents: { grossRevenue: number; directExpenses: number };
  gaming: { grossRevenue: number; directExpenses: number };
  salesOfInventory: { grossRevenue: number; costOfGoods: number };
  unrelatedBusinessIncome: number;
}

export interface ExpenseSection {
  salaries: number;
  benefits: number;
  payrollTaxes: number;
  professionalFees: number;
  accounting: number;
  legal: number;
  supplies: number;
  telephone: number;
  postage: number;
  occupancy: number;
  equipment: number;
  printing: number;
  conferences: number;
  interest: number;
  depreciation: number;
  insurance: number;
  otherExpenses: { description: string; amount: number }[];
  grants: number;
}

export interface AssetSection {
  cash: number;
  savingsAndInvestments: number;
  pledgesReceivable: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  landAndBuildings: number;
  equipment: number;
  otherAssets: number;
}

export interface LiabilitySection {
  accountsPayable: number;
  grantsPayable: number;
  deferredRevenue: number;
  taxExemptBondLiabilities: number;
  mortgages: number;
  otherLiabilities: number;
}

export type Form990Version = '990-N' | '990-EZ' | '990' | '990-PF';

export interface Form990Result {
  version: Form990Version;
  organizationName: string;
  ein: string;
  taxYear: number;
  filingDeadline: string;
  status: 'draft' | 'review' | 'ready' | 'filed';
  sections: Form990Section[];
  warnings: Form990Warning[];
  publicSupportTest?: PublicSupportResult;
  functionalExpenses?: FunctionalExpenseAllocation;
  schedules: string[];
  generatedAt: string;
  plainLanguageSummary: string;
}

export interface Form990Section {
  part: string;
  title: string;
  titlePlain: string;
  fields: Form990Field[];
  complete: boolean;
}

export interface Form990Field {
  line: string;
  label: string;
  labelPlain: string;
  value: number | string | boolean;
  required: boolean;
  validated: boolean;
  warning?: string;
}

export interface Form990Warning {
  severity: 'info' | 'caution' | 'critical';
  section: string;
  message: string;
  messagePlain: string;
  recommendation: string;
}

export interface PublicSupportResult {
  testPassed: boolean;
  publicSupportPercentage: number;
  threshold: number;
  totalSupport: number;
  publicSupport: number;
  risk: 'safe' | 'watch' | 'danger';
  recommendation: string;
}

export interface FunctionalExpenseAllocation {
  program: { amount: number; percentage: number };
  management: { amount: number; percentage: number };
  fundraising: { amount: number; percentage: number };
  total: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  benchmark: string;
}

// ============================================================
// PLAIN LANGUAGE MAPPINGS
// ============================================================

const PLAIN_LANGUAGE: Record<string, string> = {
  'Form 990': 'Annual Tax Report',
  'Form 990-EZ': 'Short Annual Tax Report',
  'Form 990-N': 'Tax E-Postcard',
  'Form 990-PF': 'Private Foundation Tax Report',
  'Gross Receipts': 'Total Money Received',
  'Total Assets': 'Everything You Own (Value)',
  'Functional Expenses': 'How You Spent Money (by Purpose)',
  'Public Support Test': 'Community Funding Check',
  'Unrelated Business Income': 'Non-Mission Revenue',
  'Schedule A': 'Public Charity Status Proof',
  'Schedule B': 'Donor Details (Confidential)',
  'Schedule D': 'Extra Financial Info',
  'Schedule G': 'Fundraising Event Details',
  'Schedule M': 'Non-Cash Donation Details',
  'Schedule O': 'Extra Explanations',
  'Part I': 'Organization Summary',
  'Part II': 'What You Did (Achievements)',
  'Part III': 'Your Programs',
  'Part IV': 'Yes/No Checklist',
  'Part V': 'IRS Compliance Statements',
  'Part VI': 'How You Are Governed',
  'Part VII': 'People & Pay',
  'Part VIII': 'Money Coming In',
  'Part IX': 'Money Going Out',
  'Part X': 'What You Own & Owe',
  'Part XI': 'Financial Reconciliation',
  'Part XII': 'Accounting Methods',
  'Exempt Purpose': 'Your Mission Activities',
  'Compensation': 'Pay & Benefits',
  'Governance': 'How Decisions Are Made',
  'Revenue': 'Money Coming In',
  'Expenses': 'Money Going Out',
  'Net Assets': 'What You Have Left',
};

export function toPlainLanguage(term: string): string {
  return PLAIN_LANGUAGE[term] || term;
}

// ============================================================
// CORE ENGINE
// ============================================================

export function determineForm990Version(grossReceipts: number, totalAssets: number, isPrivateFoundation: boolean = false): Form990Version {
  if (isPrivateFoundation) return '990-PF';
  if (grossReceipts <= 50000) return '990-N';
  if (grossReceipts < 200000 && totalAssets < 500000) return '990-EZ';
  return '990';
}

export function calculateFilingDeadline(fiscalYearEndMonth: number, taxYear: number): string {
  const deadlineMonth = ((fiscalYearEndMonth - 1 + 4) % 12) + 1;
  const deadlineYear = deadlineMonth <= fiscalYearEndMonth ? taxYear + 1 : taxYear + 1;
  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[deadlineMonth]} 15, ${deadlineYear}`;
}

export function calculatePublicSupportTest(contributions: number, totalRevenue: number, governmentGrants: number = 0): PublicSupportResult {
  const totalSupport = totalRevenue;
  const publicSupport = contributions + governmentGrants;
  const percentage = totalSupport > 0 ? (publicSupport / totalSupport) * 100 : 0;
  const threshold = 33.33;
  const testPassed = percentage >= threshold;

  let risk: 'safe' | 'watch' | 'danger';
  let recommendation: string;

  if (percentage >= 50) {
    risk = 'safe';
    recommendation = 'Your public support is strong. Keep diversifying your funding sources.';
  } else if (percentage >= threshold) {
    risk = 'watch';
    recommendation = `Your public support (${percentage.toFixed(1)}%) is above the threshold but could be stronger. Consider increasing community fundraising.`;
  } else {
    risk = 'danger';
    recommendation = `WARNING: Your public support (${percentage.toFixed(1)}%) is below 33.33%. You risk losing public charity status. Immediately increase community donations and apply for government grants.`;
  }

  return { testPassed, publicSupportPercentage: Math.round(percentage * 100) / 100, threshold, totalSupport, publicSupport, risk, recommendation };
}

export function allocateFunctionalExpenses(
  programExpenses: number,
  managementExpenses: number,
  fundraisingExpenses: number
): FunctionalExpenseAllocation {
  const total = programExpenses + managementExpenses + fundraisingExpenses;
  if (total === 0) {
    return {
      program: { amount: 0, percentage: 0 },
      management: { amount: 0, percentage: 0 },
      fundraising: { amount: 0, percentage: 0 },
      total: 0,
      rating: 'poor',
      benchmark: 'No expenses recorded'
    };
  }

  const programPct = (programExpenses / total) * 100;
  const mgmtPct = (managementExpenses / total) * 100;
  const fundPct = (fundraisingExpenses / total) * 100;

  let rating: 'excellent' | 'good' | 'fair' | 'poor';
  let benchmark: string;

  if (programPct >= 75) {
    rating = 'excellent';
    benchmark = `Program spending at ${programPct.toFixed(1)}% exceeds the 75% benchmark. Charity Navigator would rate this highly.`;
  } else if (programPct >= 65) {
    rating = 'good';
    benchmark = `Program spending at ${programPct.toFixed(1)}% is good but below the 75% excellent threshold.`;
  } else if (programPct >= 50) {
    rating = 'fair';
    benchmark = `Program spending at ${programPct.toFixed(1)}% needs improvement. Donors expect at least 65%.`;
  } else {
    rating = 'poor';
    benchmark = `WARNING: Program spending at ${programPct.toFixed(1)}% is too low. This will raise red flags with donors and auditors.`;
  }

  return {
    program: { amount: programExpenses, percentage: Math.round(programPct * 100) / 100 },
    management: { amount: managementExpenses, percentage: Math.round(mgmtPct * 100) / 100 },
    fundraising: { amount: fundraisingExpenses, percentage: Math.round(fundPct * 100) / 100 },
    total,
    rating,
    benchmark
  };
}

export function detectRequiredSchedules(org: OrganizationProfile, financials: FinancialData): string[] {
  const schedules: string[] = [];

  // Schedule A — Public Charity Status (all 501c3)
  if (org.exemptionType === '501c3') schedules.push('Schedule A');

  // Schedule B — Donors over $5K or >2% of contributions
  const donorThreshold = Math.max(5000, financials.revenue.contributions * 0.02);
  if (financials.revenue.contributions > donorThreshold) schedules.push('Schedule B');

  // Schedule D — Additional financial statements
  if (financials.assets.landAndBuildings > 0 || financials.assets.savingsAndInvestments > 0) schedules.push('Schedule D');

  // Schedule G — Fundraising events with >$15K gross
  if (financials.revenue.specialEvents.grossRevenue > 15000) schedules.push('Schedule G');

  // Schedule G — Gaming >$15K
  if (financials.revenue.gaming.grossRevenue > 15000) schedules.push('Schedule G');

  // Schedule M — Non-cash contributions >$25K
  // (simplified — would need non-cash tracking)

  // Schedule O — Supplemental information (almost always required)
  schedules.push('Schedule O');

  // Remove duplicates
  return [...new Set(schedules)];
}

export function detectUBIT(unrelatedBusinessIncome: number): { hasUBIT: boolean; taxable: boolean; estimatedTax: number; form990TRequired: boolean; warning?: string } {
  const hasUBIT = unrelatedBusinessIncome > 0;
  const taxable = unrelatedBusinessIncome > 1000;
  const estimatedTax = taxable ? Math.round(unrelatedBusinessIncome * 0.21 * 100) / 100 : 0;
  const form990TRequired = taxable;

  let warning: string | undefined;
  if (taxable) {
    warning = `You have $${unrelatedBusinessIncome.toLocaleString()} in unrelated business income. This exceeds the $1,000 threshold. You must file Form 990-T and pay an estimated $${estimatedTax.toLocaleString()} in UBIT.`;
  }

  return { hasUBIT, taxable, estimatedTax, form990TRequired, warning };
}

export function generateForm990(org: OrganizationProfile, financials: FinancialData, taxYear: number): Form990Result {
  const version = determineForm990Version(org.grossReceipts, org.totalAssets);
  const deadline = calculateFilingDeadline(org.fiscalYearEnd, taxYear);
  const schedules = detectRequiredSchedules(org, financials);
  const ubit = detectUBIT(financials.revenue.unrelatedBusinessIncome);
  const publicSupport = calculatePublicSupportTest(financials.revenue.contributions, org.grossReceipts);

  const totalExpenses = financials.expenses.salaries + financials.expenses.benefits + 
    financials.expenses.payrollTaxes + financials.expenses.professionalFees +
    financials.expenses.accounting + financials.expenses.legal +
    financials.expenses.supplies + financials.expenses.occupancy +
    financials.expenses.equipment + financials.expenses.insurance +
    financials.expenses.depreciation + financials.expenses.grants +
    financials.expenses.otherExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Estimate functional allocation (60/25/15 default split)
  const programExpenses = totalExpenses * 0.65;
  const mgmtExpenses = totalExpenses * 0.20;
  const fundExpenses = totalExpenses * 0.15;
  const functionalExpenses = allocateFunctionalExpenses(programExpenses, mgmtExpenses, fundExpenses);

  const totalRevenue = financials.revenue.contributions + financials.revenue.programService +
    financials.revenue.investmentIncome + financials.revenue.otherRevenue;
  const netAssets = (financials.assets.cash + financials.assets.savingsAndInvestments +
    financials.assets.pledgesReceivable + financials.assets.landAndBuildings +
    financials.assets.equipment + financials.assets.otherAssets) -
    (financials.liabilities.accountsPayable + financials.liabilities.grantsPayable +
    financials.liabilities.deferredRevenue + financials.liabilities.mortgages +
    financials.liabilities.otherLiabilities);

  // Build sections
  const sections: Form990Section[] = [
    {
      part: 'Header',
      title: 'Organization Information',
      titlePlain: 'About Your Organization',
      fields: [
        { line: 'A', label: 'Employer Identification Number', labelPlain: 'Your Tax ID (EIN)', value: org.ein, required: true, validated: !!org.ein },
        { line: 'B', label: 'Tax Year', labelPlain: 'Tax Year', value: taxYear, required: true, validated: true },
        { line: 'C', label: 'Organization Name', labelPlain: 'Organization Name', value: org.name, required: true, validated: !!org.name },
        { line: 'D', label: 'Gross Receipts', labelPlain: 'Total Money Received', value: org.grossReceipts, required: true, validated: org.grossReceipts >= 0 },
        { line: 'F', label: 'Accounting Method', labelPlain: 'How You Track Money', value: 'Accrual', required: true, validated: true },
        { line: 'G', label: 'Website', labelPlain: 'Website', value: org.website || 'N/A', required: false, validated: true },
        { line: 'H', label: 'Form of Organization', labelPlain: 'Organization Type', value: 'Corporation', required: true, validated: true },
      ],
      complete: true
    },
    {
      part: 'Part I',
      title: 'Summary',
      titlePlain: 'Organization Summary',
      fields: [
        { line: '1', label: 'Mission', labelPlain: 'Your Mission', value: org.missionStatement, required: true, validated: !!org.missionStatement },
        { line: '3', label: 'Voting Members of Governing Body', labelPlain: 'Board Members Who Can Vote', value: org.boardMembers.filter(m => m.isDirector).length, required: true, validated: true },
        { line: '5', label: 'Total Employees', labelPlain: 'Number of Paid Staff', value: org.boardMembers.filter(m => m.compensation > 0).length, required: true, validated: true },
        { line: '8', label: 'Contributions and Grants', labelPlain: 'Donations & Grants Received', value: financials.revenue.contributions, required: true, validated: true },
        { line: '9', label: 'Program Service Revenue', labelPlain: 'Money from Programs', value: financials.revenue.programService, required: true, validated: true },
        { line: '10', label: 'Investment Income', labelPlain: 'Money from Investments', value: financials.revenue.investmentIncome, required: true, validated: true },
        { line: '12', label: 'Total Revenue', labelPlain: 'Total Money In', value: totalRevenue, required: true, validated: true },
        { line: '18', label: 'Total Expenses', labelPlain: 'Total Money Out', value: totalExpenses, required: true, validated: true },
        { line: '19', label: 'Revenue Less Expenses', labelPlain: 'Money Left Over', value: totalRevenue - totalExpenses, required: true, validated: true },
        { line: '20', label: 'Total Assets', labelPlain: 'Everything You Own', value: org.totalAssets, required: true, validated: true },
        { line: '22', label: 'Net Assets', labelPlain: 'Net Worth', value: netAssets, required: true, validated: true },
      ],
      complete: true
    },
    {
      part: 'Part VIII',
      title: 'Statement of Revenue',
      titlePlain: 'Money Coming In',
      fields: [
        { line: '1a', label: 'Federated Campaigns', labelPlain: 'United Way & Similar', value: 0, required: false, validated: true },
        { line: '1b', label: 'Membership Dues', labelPlain: 'Member Fees', value: 0, required: false, validated: true },
        { line: '1c', label: 'Fundraising Events', labelPlain: 'Event Income', value: financials.revenue.specialEvents.grossRevenue, required: true, validated: true },
        { line: '1f', label: 'Government Grants', labelPlain: 'Government Funding', value: 0, required: false, validated: true },
        { line: '1h', label: 'Total Contributions', labelPlain: 'Total Donations', value: financials.revenue.contributions, required: true, validated: true },
        { line: '2a', label: 'Program Service Revenue', labelPlain: 'Program Income', value: financials.revenue.programService, required: true, validated: true },
        { line: '3', label: 'Investment Income', labelPlain: 'Investment Returns', value: financials.revenue.investmentIncome, required: true, validated: true },
        { line: '12', label: 'Total Revenue', labelPlain: 'Grand Total — Money In', value: totalRevenue, required: true, validated: true },
      ],
      complete: true
    }
  ];

  // Build warnings
  const warnings: Form990Warning[] = [];

  if (publicSupport.risk === 'danger') {
    warnings.push({
      severity: 'critical',
      section: 'Schedule A',
      message: `Public support test at ${publicSupport.publicSupportPercentage}% — below 33.33% threshold`,
      messagePlain: `Your community funding is only ${publicSupport.publicSupportPercentage}% — you need at least 33.33% to keep your public charity status`,
      recommendation: publicSupport.recommendation
    });
  } else if (publicSupport.risk === 'watch') {
    warnings.push({
      severity: 'caution',
      section: 'Schedule A',
      message: `Public support at ${publicSupport.publicSupportPercentage}% — above threshold but watch carefully`,
      messagePlain: `Your community funding (${publicSupport.publicSupportPercentage}%) is OK but could be stronger`,
      recommendation: publicSupport.recommendation
    });
  }

  if (ubit.taxable) {
    warnings.push({
      severity: 'critical',
      section: 'Form 990-T',
      message: `Unrelated Business Income of $${financials.revenue.unrelatedBusinessIncome.toLocaleString()} triggers UBIT filing`,
      messagePlain: `You earned $${financials.revenue.unrelatedBusinessIncome.toLocaleString()} from non-mission activities — you owe tax on this`,
      recommendation: `File Form 990-T. Estimated tax: $${ubit.estimatedTax.toLocaleString()}`
    });
  }

  if (functionalExpenses.rating === 'poor') {
    warnings.push({
      severity: 'critical',
      section: 'Part IX',
      message: `Program expense ratio at ${functionalExpenses.program.percentage}% — below 50% minimum`,
      messagePlain: `Only ${functionalExpenses.program.percentage}% of your spending goes to programs — donors want at least 65%`,
      recommendation: functionalExpenses.benchmark
    });
  }

  // Compensation warnings
  const highComp = org.boardMembers.filter(m => m.compensation > 150000);
  if (highComp.length > 0) {
    warnings.push({
      severity: 'caution',
      section: 'Part VII',
      message: `${highComp.length} person(s) with compensation >$150K — ensure reasonableness documented`,
      messagePlain: `${highComp.length} person(s) earn over $150,000 — make sure you can justify their pay`,
      recommendation: 'Document a compensation study or comparability data to support executive pay levels.'
    });
  }

  // Generate plain language summary
  const plainSummary = `
## Your ${taxYear} Annual Tax Report (${version})

**Organization:** ${org.name} (EIN: ${org.ein})
**Filing Deadline:** ${deadline}
**Form Version:** ${toPlainLanguage(version)}

### Money Summary
- **Money In:** $${totalRevenue.toLocaleString()}
- **Money Out:** $${totalExpenses.toLocaleString()}
- **Left Over:** $${(totalRevenue - totalExpenses).toLocaleString()}
- **Net Worth:** $${netAssets.toLocaleString()}

### How You Spent Money
- **Programs:** ${functionalExpenses.program.percentage}% (${functionalExpenses.rating})
- **Management:** ${functionalExpenses.management.percentage}%
- **Fundraising:** ${functionalExpenses.fundraising.percentage}%

### Community Funding Check
- **Status:** ${publicSupport.testPassed ? '✅ PASSED' : '❌ FAILED'}
- **Your Score:** ${publicSupport.publicSupportPercentage}% (need 33.33%)

### Required Attachments
${schedules.map(s => `- ${s} — ${toPlainLanguage(s)}`).join('\n')}

### Warnings (${warnings.length})
${warnings.map(w => `- ${w.severity === 'critical' ? '🔴' : '🟡'} ${w.messagePlain}`).join('\n') || '✅ No warnings — looking good!'}
`.trim();

  if (ubit.form990TRequired) {
    schedules.push('Form 990-T');
  }

  return {
    version,
    organizationName: org.name,
    ein: org.ein,
    taxYear,
    filingDeadline: deadline,
    status: 'draft',
    sections,
    warnings,
    publicSupportTest: publicSupport,
    functionalExpenses,
    schedules: [...new Set(schedules)],
    generatedAt: new Date().toISOString(),
    plainLanguageSummary: plainSummary
  };
}

// ============================================================
// VALIDATION ENGINE
// ============================================================

export function validateForm990(result: Form990Result): { valid: boolean; errors: string[]; completionPercentage: number } {
  const errors: string[] = [];
  let totalFields = 0;
  let completedFields = 0;

  for (const section of result.sections) {
    for (const field of section.fields) {
      totalFields++;
      if (field.required && !field.validated) {
        errors.push(`${section.part} Line ${field.line}: ${field.labelPlain} is required but missing`);
      } else if (field.validated) {
        completedFields++;
      }
    }
  }

  if (!result.ein || result.ein.length < 9) errors.push('EIN must be 9 digits');
  if (!result.organizationName) errors.push('Organization name is required');
  if (result.warnings.some(w => w.severity === 'critical')) {
    errors.push('Critical warnings must be resolved before filing');
  }

  const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  return { valid: errors.length === 0, errors, completionPercentage };
}

// ============================================================
// E-FILING PREPARATION
// ============================================================

export function prepareEFiling(result: Form990Result): { ready: boolean; xmlPayload: string; errors: string[] } {
  const validation = validateForm990(result);

  if (!validation.valid) {
    return { ready: false, xmlPayload: '', errors: validation.errors };
  }

  // Generate simplified XML representation
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Return xmlns="http://www.irs.gov/efile" returnVersion="${result.taxYear}v1.0">
  <ReturnHeader>
    <ReturnType>${result.version}</ReturnType>
    <TaxYear>${result.taxYear}</TaxYear>
    <Filer>
      <EIN>${result.ein}</EIN>
      <BusinessName>${result.organizationName}</BusinessName>
    </Filer>
  </ReturnHeader>
  <ReturnData>
    ${result.sections.map(s => `<${s.part.replace(' ', '')}>
      ${s.fields.map(f => `<Line${f.line}>${f.value}</Line${f.line}>`).join('\n      ')}
    </${s.part.replace(' ', '')}>`).join('\n    ')}
  </ReturnData>
</Return>`;

  return { ready: true, xmlPayload: xml, errors: [] };
}
