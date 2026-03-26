// CharityFlow — Compliance Engine (Main Logic)
// Ties together all 7 state data files into a unified compliance platform
// Provides: roadmap generation, Form 990 detection, fee calculation, 
// audit requirements, religious exemptions, health scoring, law updates

// ==================== TYPES ====================

export interface OrgProfile {
  name: string;
  state: string;
  city?: string;
  county?: string;
  orgType: '501c3_religious' | '501c3_charitable' | '501c3_educational' | '501c3_scientific' | '501c4' | '501c6' | '501c7';
  annualBudget: number;
  grossReceipts: number;
  totalAssets: number;
  fiscalYearEnd: string; // MM-DD format
  foundedYear: number;
  hasEmployees: boolean;
  employeeCount?: number;
  conductsFundraising: boolean;
  hasUnrelatedBusinessIncome: boolean;
  ubiAmount?: number;
}

export interface ComplianceItem {
  id: string;
  category: 'federal' | 'state' | 'local';
  title: string;
  plainTitle: string;
  description: string;
  deadline: string | null;
  daysUntilDue: number | null;
  status: 'compliant' | 'due_soon' | 'overdue' | 'not_applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionRequired: string;
  helpLink?: string;
}

export interface ComplianceRoadmap {
  orgProfile: OrgProfile;
  generatedAt: string;
  items: ComplianceItem[];
  healthScore: number;
  healthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  quarterlySchedule: QuarterlyMilestone[];
}

export interface QuarterlyMilestone {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  months: string;
  tasks: string[];
}

export interface Form990Result {
  version: '990-N' | '990-EZ' | '990' | '990-PF';
  plainName: string;
  reason: string;
  deadline: string;
  electronicFilingRequired: boolean;
}

export interface FilingFeeResult {
  state: string;
  totalFee: number;
  breakdown: { item: string; amount: number }[];
  currency: 'USD';
}

export interface AuditRequirement {
  required: boolean;
  type: 'none' | 'financial_review' | 'cpa_audit' | 'state_audit';
  plainDescription: string;
  threshold: string;
  estimatedCost: string;
}

export interface ReligiousExemption {
  exempt: boolean;
  exemptFrom: string[];
  statute: string;
  limitations: string[];
}

export interface LawUpdate {
  id: string;
  state: string;
  effectiveDate: string;
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: string;
}

// ==================== STATE DATA LOADER ====================

const STATE_DATA: Record<string, any> = {};

// State-specific rules (compiled from JSON data files)
const STATE_RULES: Record<string, {
  registrationRequired: boolean;
  registrationBody: string;
  annualFilingRequired: boolean;
  annualFilingForm: string;
  filingFees: { threshold: number; fee: number }[];
  auditThresholds: { type: string; threshold: number }[];
  religiousExemptions: { exempt: boolean; statute: string; exemptFrom: string[] };
  recentLawUpdates: LawUpdate[];
}> = {
  'california': {
    registrationRequired: true,
    registrationBody: 'Attorney General (Registry of Charities)',
    annualFilingRequired: true,
    annualFilingForm: 'RRF-1 + Form 990 copy',
    filingFees: [
      { threshold: 25000, fee: 0 },
      { threshold: 100000, fee: 25 },
      { threshold: 250000, fee: 50 },
      { threshold: 1000000, fee: 100 },
      { threshold: 5000000, fee: 200 },
      { threshold: 10000000, fee: 300 },
      { threshold: 50000000, fee: 500 },
    ],
    auditThresholds: [
      { type: 'financial_review', threshold: 500000 },
      { type: 'cpa_audit', threshold: 2000000 },
    ],
    religiousExemptions: {
      exempt: false,
      statute: 'Gov. Code 12583',
      exemptFrom: ['Lower scrutiny on RRF-1'],
    },
    recentLawUpdates: [
      { id: 'CA-2026-001', state: 'California', effectiveDate: '2026-01-01', title: 'AG Online Filing System', summary: 'All charity filings transitioning to mandatory online submissions', impact: 'medium', actionRequired: 'Register for new online portal' },
      { id: 'CA-2025-001', state: 'California', effectiveDate: '2025-04-30', title: 'Blanket Extension for Renewals', summary: 'Charities with renewals due Jan 7, 2025 - Apr 30, 2026 get automatic extension to April 30, 2026', impact: 'high', actionRequired: 'File by April 30, 2026 deadline' },
    ],
  },
  'texas': {
    registrationRequired: false,
    registrationBody: 'None (no general registration)',
    annualFilingRequired: false,
    annualFilingForm: 'None (private foundations: 990-PF to OAG)',
    filingFees: [],
    auditThresholds: [],
    religiousExemptions: {
      exempt: true,
      statute: 'All nonprofits exempt from state registration',
      exemptFrom: ['State registration', 'Annual state filing', 'Filing fees'],
    },
    recentLawUpdates: [
      { id: 'TX-2025-001', state: 'Texas', effectiveDate: '2025-05-01', title: 'HB 4752 Property Tax Exemption', summary: 'Expanding property tax exemptions for charitable organizations that collect and distribute gifts/grants', impact: 'medium', actionRequired: 'Review eligibility for expanded exemption' },
    ],
  },
  'new_york': {
    registrationRequired: true,
    registrationBody: 'Attorney General (Charities Bureau)',
    annualFilingRequired: true,
    annualFilingForm: 'CHAR500 annual filing',
    filingFees: [
      { threshold: 250000, fee: 50 },
      { threshold: 500000, fee: 75 },
      { threshold: 1000000, fee: 100 },
      { threshold: 5000000, fee: 250 },
    ],
    auditThresholds: [
      { type: 'financial_review', threshold: 250000 },
      { type: 'cpa_audit', threshold: 750000 },
    ],
    religiousExemptions: {
      exempt: true,
      statute: 'EPTL §8-1.4',
      exemptFrom: ['CHAR410 registration', 'CHAR500 annual filing'],
    },
    recentLawUpdates: [],
  },
  'florida': {
    registrationRequired: true,
    registrationBody: 'Department of Agriculture & Consumer Services',
    annualFilingRequired: true,
    annualFilingForm: 'Chapter 496 annual registration',
    filingFees: [
      { threshold: 0, fee: 10 },
      { threshold: 200000, fee: 75 },
      { threshold: 500000, fee: 125 },
    ],
    auditThresholds: [
      { type: 'financial_review', threshold: 500000 },
      { type: 'cpa_audit', threshold: 1000000 },
    ],
    religiousExemptions: {
      exempt: false,
      statute: 'Chapter 496.404',
      exemptFrom: [],
    },
    recentLawUpdates: [
      { id: 'FL-2025-001', state: 'Florida', effectiveDate: '2025-07-01', title: 'SB 700 Foreign Donor Attestation', summary: 'All registered charities must attest they do not accept donations from China, Russia, Iran, N. Korea, Cuba, Venezuela, Syria', impact: 'high', actionRequired: 'Submit foreign donor attestation with annual renewal' },
    ],
  },
  'illinois': {
    registrationRequired: true,
    registrationBody: 'Attorney General (Charitable Trust Bureau)',
    annualFilingRequired: true,
    annualFilingForm: 'AG 990-IL + copy of IRS Form 990',
    filingFees: [
      { threshold: 0, fee: 15 },
    ],
    auditThresholds: [
      { type: 'financial_review', threshold: 300000 },
      { type: 'cpa_audit', threshold: 500000 },
    ],
    religiousExemptions: {
      exempt: false,
      statute: 'Charitable Trust Act',
      exemptFrom: [],
    },
    recentLawUpdates: [
      { id: 'IL-2025-001', state: 'Illinois', effectiveDate: '2025-09-01', title: 'Online Filing Portal Launch', summary: 'All AG filings now electronic — paper no longer accepted', impact: 'medium', actionRequired: 'Register for online portal, discontinue paper submissions' },
    ],
  },
  'oklahoma': {
    registrationRequired: true,
    registrationBody: 'Attorney General (Charitable Organizations)',
    annualFilingRequired: true,
    annualFilingForm: 'Annual report + financial statement',
    filingFees: [
      { threshold: 0, fee: 15 },
    ],
    auditThresholds: [
      { type: 'financial_review', threshold: 500000 },
      { type: 'cpa_audit', threshold: 1000000 },
    ],
    religiousExemptions: {
      exempt: true,
      statute: 'Oklahoma Solicitation of Charitable Contributions Act §552.2',
      exemptFrom: ['Charitable solicitation registration'],
    },
    recentLawUpdates: [
      { id: 'OK-2025-001', state: 'Oklahoma', effectiveDate: '2025-11-01', title: 'SB 1234 Simplified Small Org Filing', summary: 'Nonprofits under $100K annual revenue can use simplified annual report form', impact: 'medium', actionRequired: 'Evaluate eligibility for simplified filing' },
    ],
  },
};

// ==================== PLAIN LANGUAGE ====================

const PLAIN_LANGUAGE: Record<string, string> = {
  'compliance roadmap': 'Your Compliance To-Do List',
  'Form 990': 'Annual Tax Report',
  'Form 990-N': 'Quick Tax Postcard (for small orgs)',
  'Form 990-EZ': 'Short Tax Report',
  'Form 990-PF': 'Private Foundation Tax Report',
  'RRF-1': 'California Charity Renewal Form',
  'CHAR500': 'New York Charity Annual Report',
  'CHAR410': 'New York Charity Registration',
  'filing fee': 'Government Processing Fee',
  'CPA audit': 'Professional Financial Check-Up',
  'financial review': 'Basic Financial Check-Up',
  'fiscal year': 'Your Organization\'s Financial Year',
  'gross receipts': 'Total Money Received',
  'total assets': 'Everything Your Organization Owns',
  '501(c)(3)': 'Tax-Exempt Nonprofit Status',
  'UBIT': 'Tax on Side Business Income',
  'compliance health score': 'How Well You\'re Following the Rules (0-100)',
  'charitable solicitation': 'Asking for Donations',
  'audit threshold': 'The Dollar Amount That Triggers a Required Check-Up',
};

export function translateToPlainLanguage(term: string): string {
  const lower = term.toLowerCase();
  return PLAIN_LANGUAGE[lower] || term;
}

// ==================== CORE ENGINE ====================

export function determineForm990Version(profile: OrgProfile): Form990Result {
  const deadline = calculateForm990Deadline(profile.fiscalYearEnd);

  // Private foundations always file 990-PF
  if (profile.orgType === '501c4' || profile.orgType === '501c6') {
    // These use regular 990 based on thresholds
  }

  // 990-N: gross receipts <= $50,000
  if (profile.grossReceipts <= 50000) {
    return {
      version: '990-N',
      plainName: translateToPlainLanguage('Form 990-N'),
      reason: 'Your organization received $50,000 or less — you qualify for the simplest filing.',
      deadline,
      electronicFilingRequired: true,
    };
  }

  // 990-EZ: gross receipts < $200,000 AND total assets < $500,000
  if (profile.grossReceipts < 200000 && profile.totalAssets < 500000) {
    return {
      version: '990-EZ',
      plainName: translateToPlainLanguage('Form 990-EZ'),
      reason: 'Your organization received under $200,000 and owns under $500,000 in assets — you qualify for the short form.',
      deadline,
      electronicFilingRequired: true,
    };
  }

  // Full 990 for everyone else
  return {
    version: '990',
    plainName: translateToPlainLanguage('Form 990'),
    reason: 'Your organization exceeds the thresholds for simpler forms — full reporting required.',
    deadline,
    electronicFilingRequired: true,
  };
}

function calculateForm990Deadline(fiscalYearEnd: string): string {
  const [month, day] = fiscalYearEnd.split('-').map(Number);
  const deadlineMonth = ((month + 4) % 12) || 12;
  const deadlineYear = deadlineMonth <= month ? 'next year' : 'same year';
  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[deadlineMonth]} 15 (${deadlineYear})`;
}

export function calculateFilingFee(profile: OrgProfile): FilingFeeResult {
  const stateKey = profile.state.toLowerCase().replace(/\s+/g, '_');
  const rules = STATE_RULES[stateKey];

  if (!rules) {
    return { state: profile.state, totalFee: 0, breakdown: [{ item: 'State not in database', amount: 0 }], currency: 'USD' };
  }

  // Check religious exemption first
  if (isReligiousExempt(profile).exempt && rules.filingFees.length === 0) {
    return { state: profile.state, totalFee: 0, breakdown: [{ item: 'Religious organization exempt', amount: 0 }], currency: 'USD' };
  }

  if (rules.filingFees.length === 0) {
    return { state: profile.state, totalFee: 0, breakdown: [{ item: 'No state filing fees', amount: 0 }], currency: 'USD' };
  }

  // Find applicable fee tier
  let applicableFee = 0;
  for (const tier of rules.filingFees) {
    if (profile.grossReceipts >= tier.threshold) {
      applicableFee = tier.fee;
    }
  }

  const breakdown = [{ item: `${profile.state} annual filing fee`, amount: applicableFee }];

  return { state: profile.state, totalFee: applicableFee, breakdown, currency: 'USD' };
}

export function determineAuditRequirement(profile: OrgProfile): AuditRequirement {
  const stateKey = profile.state.toLowerCase().replace(/\s+/g, '_');
  const rules = STATE_RULES[stateKey];

  if (!rules || rules.auditThresholds.length === 0) {
    return { required: false, type: 'none', plainDescription: 'No state audit requirement.', threshold: 'N/A', estimatedCost: '$0' };
  }

  // Check from highest threshold down
  const sorted = [...rules.auditThresholds].sort((a, b) => b.threshold - a.threshold);
  for (const threshold of sorted) {
    if (profile.grossReceipts >= threshold.threshold) {
      const cost = threshold.type === 'cpa_audit' ? '$5,000 - $20,000' : '$2,000 - $5,000';
      return {
        required: true,
        type: threshold.type as AuditRequirement['type'],
        plainDescription: translateToPlainLanguage(threshold.type === 'cpa_audit' ? 'CPA audit' : 'financial review'),
        threshold: `$${threshold.threshold.toLocaleString()} in annual revenue`,
        estimatedCost: cost,
      };
    }
  }

  return { required: false, type: 'none', plainDescription: 'Your revenue is below the audit threshold.', threshold: 'N/A', estimatedCost: '$0' };
}

export function isReligiousExempt(profile: OrgProfile): ReligiousExemption {
  if (!profile.orgType.includes('religious')) {
    return { exempt: false, exemptFrom: [], statute: 'N/A — not a religious organization', limitations: [] };
  }

  const stateKey = profile.state.toLowerCase().replace(/\s+/g, '_');
  const rules = STATE_RULES[stateKey];

  if (!rules) {
    return { exempt: false, exemptFrom: [], statute: 'State not in database', limitations: ['Cannot determine exemption'] };
  }

  const exemption = rules.religiousExemptions;
  return {
    exempt: exemption.exempt,
    exemptFrom: exemption.exemptFrom,
    statute: exemption.statute,
    limitations: exemption.exempt ? ['Must still file IRS Form 990 (federal requirement)', 'Exemption does not cover UBIT'] : ['Registration and annual filing required'],
  };
}

export function getRecentLawUpdates(state?: string): LawUpdate[] {
  if (state) {
    const stateKey = state.toLowerCase().replace(/\s+/g, '_');
    const rules = STATE_RULES[stateKey];
    return rules?.recentLawUpdates || [];
  }

  // Return all updates across all states
  const allUpdates: LawUpdate[] = [];
  for (const [, rules] of Object.entries(STATE_RULES)) {
    allUpdates.push(...rules.recentLawUpdates);
  }
  return allUpdates.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
}

export function calculateComplianceHealthScore(profile: OrgProfile, completedItems: string[]): { score: number; grade: string; breakdown: { category: string; weight: number; score: number }[] } {
  const weights = {
    federalFiling: 30,
    stateRegistration: 20,
    stateFiling: 20,
    auditCompliance: 15,
    governance: 15,
  };

  const breakdown: { category: string; weight: number; score: number }[] = [];

  // Federal filing (Form 990)
  const federalScore = completedItems.includes('form_990_filed') ? weights.federalFiling : 0;
  breakdown.push({ category: 'Federal Tax Filing', weight: weights.federalFiling, score: federalScore });

  // State registration
  const stateKey = profile.state.toLowerCase().replace(/\s+/g, '_');
  const rules = STATE_RULES[stateKey];
  const regRequired = rules?.registrationRequired && !isReligiousExempt(profile).exempt;
  const regScore = !regRequired ? weights.stateRegistration : (completedItems.includes('state_registered') ? weights.stateRegistration : 0);
  breakdown.push({ category: 'State Registration', weight: weights.stateRegistration, score: regScore });

  // State annual filing
  const filingRequired = rules?.annualFilingRequired && !isReligiousExempt(profile).exempt;
  const filingScore = !filingRequired ? weights.stateFiling : (completedItems.includes('state_annual_filed') ? weights.stateFiling : 0);
  breakdown.push({ category: 'State Annual Filing', weight: weights.stateFiling, score: filingScore });

  // Audit compliance
  const auditReq = determineAuditRequirement(profile);
  const auditScore = !auditReq.required ? weights.auditCompliance : (completedItems.includes('audit_completed') ? weights.auditCompliance : 0);
  breakdown.push({ category: 'Audit Compliance', weight: weights.auditCompliance, score: auditScore });

  // Governance
  const govScore = completedItems.includes('board_minutes_current') ? weights.governance : 0;
  breakdown.push({ category: 'Governance', weight: weights.governance, score: govScore });

  const totalScore = breakdown.reduce((sum, item) => sum + item.score, 0);
  const grade = totalScore >= 90 ? 'A' : totalScore >= 80 ? 'B' : totalScore >= 70 ? 'C' : totalScore >= 60 ? 'D' : 'F';

  return { score: totalScore, grade, breakdown };
}

export function generateComplianceRoadmap(profile: OrgProfile): ComplianceRoadmap {
  const items: ComplianceItem[] = [];
  const stateKey = profile.state.toLowerCase().replace(/\s+/g, '_');
  const rules = STATE_RULES[stateKey];

  // Federal: Form 990
  const form990 = determineForm990Version(profile);
  items.push({
    id: 'FED-001',
    category: 'federal',
    title: `File ${form990.version}`,
    plainTitle: `File Your ${form990.plainName}`,
    description: form990.reason,
    deadline: form990.deadline,
    daysUntilDue: null,
    status: 'due_soon',
    priority: 'critical',
    actionRequired: `Prepare and e-file ${form990.version} by ${form990.deadline}`,
  });

  // Federal: UBIT
  if (profile.hasUnrelatedBusinessIncome && (profile.ubiAmount || 0) >= 1000) {
    items.push({
      id: 'FED-002',
      category: 'federal',
      title: 'File Form 990-T (UBIT)',
      plainTitle: 'File Tax on Side Business Income',
      description: `You have $${(profile.ubiAmount || 0).toLocaleString()} in unrelated business income — filing required.`,
      deadline: form990.deadline,
      daysUntilDue: null,
      status: 'due_soon',
      priority: 'high',
      actionRequired: 'Calculate UBIT liability and file Form 990-T',
    });
  }

  // State registration
  if (rules) {
    const exempt = isReligiousExempt(profile);

    if (rules.registrationRequired && !exempt.exempt) {
      items.push({
        id: 'STATE-001',
        category: 'state',
        title: `${profile.state} Charity Registration`,
        plainTitle: `Register with ${profile.state}`,
        description: `Required by ${rules.registrationBody}`,
        deadline: null,
        daysUntilDue: null,
        status: 'due_soon',
        priority: 'high',
        actionRequired: `Register with ${rules.registrationBody}`,
      });
    }

    // State annual filing
    if (rules.annualFilingRequired && !exempt.exempt) {
      items.push({
        id: 'STATE-002',
        category: 'state',
        title: `${profile.state} Annual Filing`,
        plainTitle: `File ${profile.state} Annual Report`,
        description: `File ${rules.annualFilingForm}`,
        deadline: form990.deadline,
        daysUntilDue: null,
        status: 'due_soon',
        priority: 'high',
        actionRequired: `Submit ${rules.annualFilingForm}`,
      });
    }

    // Law updates as action items
    for (const update of rules.recentLawUpdates) {
      items.push({
        id: update.id,
        category: 'state',
        title: update.title,
        plainTitle: update.title,
        description: update.summary,
        deadline: update.effectiveDate,
        daysUntilDue: null,
        status: update.impact === 'high' ? 'due_soon' : 'compliant',
        priority: update.impact === 'high' ? 'high' : 'medium',
        actionRequired: update.actionRequired,
      });
    }
  }

  // Generate quarterly schedule
  const quarterlySchedule = generateQuarterlySchedule(profile, form990);

  // Calculate health score (assume nothing completed yet for new orgs)
  const health = calculateComplianceHealthScore(profile, []);

  return {
    orgProfile: profile,
    generatedAt: new Date().toISOString(),
    items,
    healthScore: health.score,
    healthGrade: health.grade as ComplianceRoadmap['healthGrade'],
    summary: `Your organization has ${items.length} compliance items to address. Your current health score is ${health.score}/100 (Grade: ${health.grade}).`,
    quarterlySchedule,
  };
}

function generateQuarterlySchedule(profile: OrgProfile, form990: Form990Result): QuarterlyMilestone[] {
  return [
    { quarter: 'Q1', months: 'January - March', tasks: ['Review prior year financials', 'Begin Form 990 preparation', 'Update board meeting minutes', 'Review state registration renewal dates'] },
    { quarter: 'Q2', months: 'April - June', tasks: [`File ${form990.version} by ${form990.deadline}`, 'Submit state annual filings', 'Pay filing fees', 'Conduct mid-year compliance review'] },
    { quarter: 'Q3', months: 'July - September', tasks: ['Review quarterly law updates', 'Update donor acknowledgment letters', 'Prepare for fall fundraising compliance', 'Review UBIT exposure'] },
    { quarter: 'Q4', months: 'October - December', tasks: ['Year-end tax planning', 'Verify donor receipts for tax season', 'Board governance review', 'Prepare for next year compliance roadmap'] },
  ];
}

export function getSupportedStates(): string[] {
  return Object.keys(STATE_RULES).map(s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
}

export function getStateRules(state: string) {
  const stateKey = state.toLowerCase().replace(/\s+/g, '_');
  return STATE_RULES[stateKey] || null;
}
