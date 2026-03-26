import { ComplianceState } from '../compliance/data/types';

// ========================================
// TYPES
// ========================================

export interface TaxExemptOrg {
  id: string;
  name: string;
  ein: string;
  type: '501c3' | '501c4' | '501c6' | '501c7';
  subType: 'religious' | 'charitable' | 'educational' | 'scientific' | 'literary';
  state: string;
  county?: string;
  city?: string;
  fiscalYearEnd: number; // month 1-12
  annualBudget: number;
  grossReceipts: number;
  totalAssets: number;
  yearFounded: number;
}

export interface TaxAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  recommendation: string;
  deadline?: string;
  statute?: string;
}

export interface UBITAnalysis {
  hasUBIT: boolean;
  estimatedUBIT: number;
  taxableActivities: UBITActivity[];
  exemptActivities: string[];
  estimatedTax: number;
  form990TRequired: boolean;
}

export interface UBITActivity {
  description: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  isRegular: boolean;
  isTradeOrBusiness: boolean;
  isSubstantiallyRelated: boolean;
  exemptionApplied?: string;
}

export interface LobbyingAnalysis {
  totalExpenditures: number;
  lobbyingExpenses: number;
  lobbyingPercentage: number;
  isWithinLimit: boolean;
  limit: number;
  limitType: 'substantial_part' | '501h_election';
  alerts: TaxAlert[];
}

export interface FunctionalExpenseAnalysis {
  programServices: number;
  managementGeneral: number;
  fundraising: number;
  totalExpenses: number;
  programRatio: number;
  adminRatio: number;
  fundraisingRatio: number;
  charityNavigatorBenchmark: { program: number; admin: number; fundraising: number };
  alerts: TaxAlert[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface DonorTaxBenefit {
  donorName: string;
  donationType: 'cash' | 'property' | 'stock' | 'vehicle' | 'inkind' | 'daf';
  amount: number;
  fairMarketValue: number;
  deductibleAmount: number;
  acknowledgmentRequired: boolean;
  acknowledgmentType: string;
  quidProQuoAmount: number;
  appraisalRequired: boolean;
  form8283Required: boolean;
  scheduleMRequired: boolean;
}

export interface PublicSupportTest {
  totalSupport: number;
  publicSupport: number;
  publicSupportPercentage: number;
  isPublicCharity: boolean;
  testUsed: '509a1' | '509a2';
  yearsAnalyzed: number;
  dangerZone: boolean;
  alerts: TaxAlert[];
}

export interface WorkerClassification {
  workerName: string;
  classification: 'employee' | 'contractor';
  factors: ClassificationFactor[];
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: TaxAlert[];
}

export interface ClassificationFactor {
  factor: string;
  indicatesEmployee: boolean;
  weight: number;
}

export interface ExecutiveCompAnalysis {
  name: string;
  title: string;
  totalCompensation: number;
  isReasonable: boolean;
  benchmarkRange: { low: number; median: number; high: number };
  percentile: number;
  alerts: TaxAlert[];
}

export interface TaxOptimizationReport {
  orgId: string;
  generatedAt: string;
  overallHealthScore: number; // 0-100
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  totalAlertsCount: number;
  criticalAlerts: TaxAlert[];
  warnings: TaxAlert[];
  infoAlerts: TaxAlert[];
  ubitAnalysis: UBITAnalysis;
  lobbyingAnalysis: LobbyingAnalysis;
  functionalExpenses: FunctionalExpenseAnalysis;
  publicSupportTest: PublicSupportTest;
  estimatedTaxSavings: number;
  recommendations: string[];
}

// ========================================
// CPA TAX OPTIMIZATION ENGINE
// ========================================

export class CPATaxOptimizer {

  // --- TAX-EXEMPT STATUS GUARDIAN ---
  analyzeExemptStatus(org: TaxExemptOrg, activities: any[]): TaxAlert[] {
    const alerts: TaxAlert[] = [];

    // Check private benefit / private inurement
    if (org.type === '501c3') {
      const hasPrivateBenefit = activities.some((a: any) => 
        a.type === 'payment' && a.beneficiary === 'insider' && a.amount > org.annualBudget * 0.05
      );
      if (hasPrivateBenefit) {
        alerts.push({
          id: `alert-private-benefit-${org.id}`,
          severity: 'critical',
          category: 'exempt_status',
          title: 'Private Benefit Risk Detected',
          description: 'Payments to insiders exceed 5% of annual budget, potentially jeopardizing 501(c)(3) status.',
          recommendation: 'Review all insider transactions. Document fair market value and board approval for each payment.',
          statute: 'IRC §501(c)(3), Treas. Reg. §1.501(c)(3)-1(d)(1)(ii)'
        });
      }
    }

    // Check political activity (absolute prohibition for 501c3)
    const politicalActivity = activities.filter((a: any) => a.category === 'political');
    if (politicalActivity.length > 0 && org.type === '501c3') {
      alerts.push({
        id: `alert-political-${org.id}`,
        severity: 'critical',
        category: 'exempt_status',
        title: 'PROHIBITED Political Activity Detected',
        description: `${politicalActivity.length} political activities found. 501(c)(3) organizations are ABSOLUTELY PROHIBITED from political campaign intervention.`,
        recommendation: 'Immediately cease all political campaign activities. This is grounds for revocation of tax-exempt status.',
        statute: 'IRC §501(c)(3), Rev. Rul. 2007-41'
      });
    }

    // Check excessive compensation
    const compensationPayments = activities.filter((a: any) => a.category === 'compensation');
    const totalComp = compensationPayments.reduce((sum: number, a: any) => sum + a.amount, 0);
    if (totalComp > org.annualBudget * 0.4) {
      alerts.push({
        id: `alert-excessive-comp-${org.id}`,
        severity: 'warning',
        category: 'exempt_status',
        title: 'High Compensation Ratio',
        description: `Total compensation (${((totalComp / org.annualBudget) * 100).toFixed(1)}%) exceeds 40% of budget. This may attract IRS scrutiny.`,
        recommendation: 'Document reasonableness of all compensation using comparable data. Ensure board approved comp through independent review.',
        statute: 'IRC §4958 (Excess Benefit Transactions)'
      });
    }

    return alerts;
  }

  // --- UBIT TRACKER ---
  analyzeUBIT(activities: UBITActivity[]): UBITAnalysis {
    const taxableActivities: UBITActivity[] = [];
    const exemptActivities: string[] = [];

    for (const activity of activities) {
      if (activity.isRegular && activity.isTradeOrBusiness && !activity.isSubstantiallyRelated) {
        // Check for specific exemptions
        if (activity.exemptionApplied) {
          exemptActivities.push(`${activity.description} (exempt: ${activity.exemptionApplied})`);
        } else {
          taxableActivities.push(activity);
        }
      } else {
        const reason = !activity.isRegular ? 'not regularly carried on' : 
                       !activity.isTradeOrBusiness ? 'not a trade or business' : 
                       'substantially related to exempt purpose';
        exemptActivities.push(`${activity.description} (${reason})`);
      }
    }

    const estimatedUBIT = taxableActivities.reduce((sum, a) => sum + Math.max(0, a.netIncome), 0);
    // Specific deduction of $1,000 for UBIT
    const taxableAmount = Math.max(0, estimatedUBIT - 1000);
    const estimatedTax = taxableAmount * 0.21; // Corporate rate 21%

    return {
      hasUBIT: taxableActivities.length > 0,
      estimatedUBIT,
      taxableActivities,
      exemptActivities,
      estimatedTax,
      form990TRequired: estimatedUBIT >= 1000
    };
  }

  // --- LOBBYING ANALYSIS ---
  analyzeLobbyingCompliance(
    totalExpenditures: number,
    lobbyingExpenses: number,
    has501hElection: boolean
  ): LobbyingAnalysis {
    const lobbyingPercentage = totalExpenditures > 0 ? (lobbyingExpenses / totalExpenditures) * 100 : 0;
    const alerts: TaxAlert[] = [];

    let limit: number;
    let limitType: 'substantial_part' | '501h_election';

    if (has501hElection) {
      // 501(h) election sliding scale
      limitType = '501h_election';
      if (totalExpenditures <= 500000) {
        limit = totalExpenditures * 0.20;
      } else if (totalExpenditures <= 1000000) {
        limit = 100000 + (totalExpenditures - 500000) * 0.15;
      } else if (totalExpenditures <= 1500000) {
        limit = 175000 + (totalExpenditures - 1000000) * 0.10;
      } else {
        limit = Math.min(225000 + (totalExpenditures - 1500000) * 0.05, 1000000);
      }
    } else {
      // Substantial part test (generally <5% is safe)
      limitType = 'substantial_part';
      limit = totalExpenditures * 0.05;
    }

    const isWithinLimit = lobbyingExpenses <= limit;

    if (!isWithinLimit) {
      alerts.push({
        id: 'alert-lobbying-over-limit',
        severity: 'critical',
        category: 'lobbying',
        title: 'Lobbying Expenditures Exceed Limit',
        description: `Lobbying expenses ($${lobbyingExpenses.toLocaleString()}) exceed the ${limitType === '501h_election' ? '501(h)' : 'substantial part'} limit ($${limit.toLocaleString()}).`,
        recommendation: limitType === 'substantial_part' 
          ? 'Consider making a 501(h) election for clearer lobbying limits, or reduce lobbying activities immediately.'
          : 'Reduce lobbying activities to stay within 501(h) safe harbor limits. Exceeding by 150% over 4 years results in loss of exemption.',
        statute: limitType === '501h_election' ? 'IRC §501(h), §4911' : 'IRC §501(c)(3)'
      });
    } else if (lobbyingPercentage > 3 && limitType === 'substantial_part') {
      alerts.push({
        id: 'alert-lobbying-approaching',
        severity: 'warning',
        category: 'lobbying',
        title: 'Lobbying Approaching Substantial Part Limit',
        description: `Lobbying at ${lobbyingPercentage.toFixed(1)}% of expenditures — approaching the threshold.`,
        recommendation: 'Consider making a 501(h) election for clearer, higher lobbying limits.',
        statute: 'IRC §501(c)(3)'
      });
    }

    return { totalExpenditures, lobbyingExpenses, lobbyingPercentage, isWithinLimit, limit, limitType, alerts };
  }

  // --- FUNCTIONAL EXPENSE ANALYZER ---
  analyzeFunctionalExpenses(
    programServices: number,
    managementGeneral: number,
    fundraising: number
  ): FunctionalExpenseAnalysis {
    const totalExpenses = programServices + managementGeneral + fundraising;
    const programRatio = totalExpenses > 0 ? (programServices / totalExpenses) * 100 : 0;
    const adminRatio = totalExpenses > 0 ? (managementGeneral / totalExpenses) * 100 : 0;
    const fundraisingRatio = totalExpenses > 0 ? (fundraising / totalExpenses) * 100 : 0;

    const benchmark = { program: 75, admin: 15, fundraising: 10 };
    const alerts: TaxAlert[] = [];

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (programRatio >= 85) grade = 'A';
    else if (programRatio >= 75) grade = 'B';
    else if (programRatio >= 65) grade = 'C';
    else if (programRatio >= 50) grade = 'D';
    else grade = 'F';

    if (programRatio < 65) {
      alerts.push({
        id: 'alert-low-program-ratio',
        severity: 'warning',
        category: 'functional_expenses',
        title: 'Low Program Spending Ratio',
        description: `Program ratio (${programRatio.toFixed(1)}%) is below the 65% threshold. Donors and rating agencies flag this.`,
        recommendation: 'Review expense allocations. Ensure all program-related costs are properly categorized. Consider joint cost allocations per ASC 958-720.'
      });
    }

    if (fundraisingRatio > 25) {
      alerts.push({
        id: 'alert-high-fundraising',
        severity: 'warning',
        category: 'functional_expenses',
        title: 'High Fundraising Cost Ratio',
        description: `Fundraising costs at ${fundraisingRatio.toFixed(1)}% significantly exceed the 10% benchmark.`,
        recommendation: 'Evaluate fundraising efficiency. Consider shifting to lower-cost channels (digital, peer-to-peer).'
      });
    }

    return {
      programServices, managementGeneral, fundraising, totalExpenses,
      programRatio, adminRatio, fundraisingRatio,
      charityNavigatorBenchmark: benchmark, alerts, grade
    };
  }

  // --- DONOR TAX BENEFIT MAXIMIZER ---
  calculateDonorBenefit(
    donorName: string,
    donationType: DonorTaxBenefit['donationType'],
    amount: number,
    fairMarketValue: number,
    quidProQuoValue: number = 0
  ): DonorTaxBenefit {
    let deductibleAmount = fairMarketValue - quidProQuoValue;
    let acknowledgmentRequired = amount >= 250;
    let appraisalRequired = false;
    let form8283Required = false;
    let scheduleMRequired = false;
    let acknowledgmentType = 'none';

    // IRS thresholds
    if (amount >= 250) {
      acknowledgmentType = 'written_acknowledgment';
    }
    if (quidProQuoValue > 0 && amount > 75) {
      acknowledgmentType = 'quid_pro_quo_disclosure';
    }

    // Property donations
    if (donationType === 'property' || donationType === 'vehicle') {
      if (fairMarketValue > 5000) {
        appraisalRequired = true;
        form8283Required = true;
      } else if (fairMarketValue > 500) {
        form8283Required = true;
      }
    }

    // Stock donations (FMV, no capital gains)
    if (donationType === 'stock') {
      deductibleAmount = fairMarketValue; // Full FMV for long-term held stock
      if (fairMarketValue > 5000) {
        appraisalRequired = true;
        form8283Required = true;
      }
    }

    // In-kind donations
    if (donationType === 'inkind') {
      scheduleMRequired = fairMarketValue > 25000;
      if (fairMarketValue > 5000) {
        appraisalRequired = true;
        form8283Required = true;
      }
    }

    return {
      donorName, donationType, amount, fairMarketValue,
      deductibleAmount: Math.max(0, deductibleAmount),
      acknowledgmentRequired, acknowledgmentType,
      quidProQuoAmount: quidProQuoValue,
      appraisalRequired, form8283Required, scheduleMRequired
    };
  }

  // --- PUBLIC SUPPORT TEST ---
  analyzePublicSupport(
    supportData: { year: number; publicSupport: number; totalSupport: number }[]
  ): PublicSupportTest {
    const totalSupport = supportData.reduce((sum, d) => sum + d.totalSupport, 0);
    const publicSupport = supportData.reduce((sum, d) => sum + d.publicSupport, 0);
    const percentage = totalSupport > 0 ? (publicSupport / totalSupport) * 100 : 0;

    const isPublicCharity = percentage >= 33.33;
    const dangerZone = percentage >= 10 && percentage < 33.33;
    const alerts: TaxAlert[] = [];

    if (!isPublicCharity && percentage >= 10) {
      alerts.push({
        id: 'alert-public-support-danger',
        severity: 'critical',
        category: 'public_support',
        title: 'Public Support Test — Danger Zone',
        description: `Public support at ${percentage.toFixed(1)}% — below the 33.33% threshold. Organization may be reclassified as a private foundation.`,
        recommendation: 'Increase broad-based public fundraising. Consider facts-and-circumstances test if between 10-33.33%. Diversify revenue sources immediately.',
        statute: 'IRC §509(a)(1), Treas. Reg. §1.170A-9(f)'
      });
    } else if (percentage < 40 && percentage >= 33.33) {
      alerts.push({
        id: 'alert-public-support-warning',
        severity: 'warning',
        category: 'public_support',
        title: 'Public Support — Monitor Closely',
        description: `Public support at ${percentage.toFixed(1)}% — above threshold but not comfortable margin.`,
        recommendation: 'Continue diversifying funding sources. Target small-dollar donations to strengthen public support percentage.'
      });
    }

    return {
      totalSupport, publicSupport,
      publicSupportPercentage: percentage,
      isPublicCharity, testUsed: '509a1',
      yearsAnalyzed: supportData.length,
      dangerZone, alerts
    };
  }

  // --- WORKER CLASSIFICATION ---
  classifyWorker(
    workerName: string,
    factors: ClassificationFactor[]
  ): WorkerClassification {
    let employeeScore = 0;
    let contractorScore = 0;
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);

    for (const factor of factors) {
      if (factor.indicatesEmployee) {
        employeeScore += factor.weight;
      } else {
        contractorScore += factor.weight;
      }
    }

    const employeePercentage = totalWeight > 0 ? (employeeScore / totalWeight) * 100 : 0;
    const classification = employeePercentage >= 50 ? 'employee' : 'contractor';
    const confidence = Math.abs(employeePercentage - 50) * 2; // 0-100

    const riskLevel = confidence < 30 ? 'high' : confidence < 60 ? 'medium' : 'low';
    const alerts: TaxAlert[] = [];

    if (riskLevel === 'high') {
      alerts.push({
        id: `alert-worker-class-${workerName}`,
        severity: 'warning',
        category: 'worker_classification',
        title: `Ambiguous Classification: ${workerName}`,
        description: `Classification confidence is only ${confidence.toFixed(0)}%. Misclassification risk is HIGH.`,
        recommendation: 'Consider filing Form SS-8 with IRS for determination. Document all factors supporting classification.',
        statute: 'IRC §3509, IRS Revenue Ruling 87-41'
      });
    }

    return { workerName, classification, factors, confidence, riskLevel, alerts };
  }

  // --- EXECUTIVE COMPENSATION ANALYSIS ---
  analyzeExecutiveComp(
    name: string,
    title: string,
    totalCompensation: number,
    orgBudget: number,
    benchmarkData: { low: number; median: number; high: number }
  ): ExecutiveCompAnalysis {
    const isReasonable = totalCompensation <= benchmarkData.high;
    const alerts: TaxAlert[] = [];

    // Calculate approximate percentile
    let percentile: number;
    if (totalCompensation <= benchmarkData.low) percentile = 25;
    else if (totalCompensation <= benchmarkData.median) {
      percentile = 25 + ((totalCompensation - benchmarkData.low) / (benchmarkData.median - benchmarkData.low)) * 25;
    } else if (totalCompensation <= benchmarkData.high) {
      percentile = 50 + ((totalCompensation - benchmarkData.median) / (benchmarkData.high - benchmarkData.median)) * 25;
    } else {
      percentile = 75 + Math.min(25, ((totalCompensation - benchmarkData.high) / benchmarkData.high) * 50);
    }

    if (!isReasonable) {
      alerts.push({
        id: `alert-exec-comp-${name}`,
        severity: 'critical',
        category: 'executive_compensation',
        title: `Excess Compensation: ${name}`,
        description: `Compensation ($${totalCompensation.toLocaleString()}) exceeds benchmark high ($${benchmarkData.high.toLocaleString()}). IRC §4958 excise tax may apply.`,
        recommendation: 'Conduct independent comparability study. Ensure board rebuttable presumption process (independent board, comparable data, contemporaneous documentation).',
        statute: 'IRC §4958, Treas. Reg. §53.4958-4'
      });
    }

    if (totalCompensation > orgBudget * 0.15) {
      alerts.push({
        id: `alert-comp-ratio-${name}`,
        severity: 'warning',
        category: 'executive_compensation',
        title: `High Comp-to-Budget Ratio: ${name}`,
        description: `Compensation is ${((totalCompensation / orgBudget) * 100).toFixed(1)}% of total budget. This exceeds the 15% guideline.`,
        recommendation: 'Document board review and justification. Consider if budget growth will bring ratio in line.'
      });
    }

    return { name, title, totalCompensation, isReasonable, benchmarkRange: benchmarkData, percentile, alerts };
  }

  // --- OVERALL TAX HEALTH REPORT ---
  generateOptimizationReport(
    org: TaxExemptOrg,
    ubit: UBITAnalysis,
    lobbying: LobbyingAnalysis,
    functionalExpenses: FunctionalExpenseAnalysis,
    publicSupport: PublicSupportTest
  ): TaxOptimizationReport {
    const allAlerts = [
      ...ubit.taxableActivities.length > 0 ? [{
        id: 'alert-ubit-detected',
        severity: 'warning' as const,
        category: 'ubit',
        title: 'Unrelated Business Income Detected',
        description: `${ubit.taxableActivities.length} activities generating $${ubit.estimatedUBIT.toLocaleString()} in UBIT. Estimated tax: $${ubit.estimatedTax.toLocaleString()}.`,
        recommendation: 'Review activities for restructuring opportunities. Consider moving UBIT activities to a taxable subsidiary.'
      }] : [],
      ...lobbying.alerts,
      ...functionalExpenses.alerts,
      ...publicSupport.alerts
    ];

    const criticalAlerts = allAlerts.filter(a => a.severity === 'critical');
    const warnings = allAlerts.filter(a => a.severity === 'warning');
    const infoAlerts = allAlerts.filter(a => a.severity === 'info');

    // Calculate health score
    let healthScore = 100;
    healthScore -= criticalAlerts.length * 20;
    healthScore -= warnings.length * 10;
    healthScore -= infoAlerts.length * 2;

    // Bonus for good functional expense ratio
    if (functionalExpenses.programRatio >= 75) healthScore += 5;
    if (publicSupport.isPublicCharity) healthScore += 5;

    healthScore = Math.max(0, Math.min(100, healthScore));

    let overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (healthScore >= 90) overallGrade = 'A';
    else if (healthScore >= 75) overallGrade = 'B';
    else if (healthScore >= 60) overallGrade = 'C';
    else if (healthScore >= 40) overallGrade = 'D';
    else overallGrade = 'F';

    const estimatedTaxSavings = ubit.estimatedTax * 0.3 + // Potential restructuring savings
      (functionalExpenses.programRatio < 75 ? org.annualBudget * 0.02 : 0); // Better allocation

    return {
      orgId: org.id,
      generatedAt: new Date().toISOString(),
      overallHealthScore: healthScore,
      overallGrade,
      totalAlertsCount: allAlerts.length,
      criticalAlerts,
      warnings,
      infoAlerts,
      ubitAnalysis: ubit,
      lobbyingAnalysis: lobbying,
      functionalExpenses,
      publicSupportTest: publicSupport,
      estimatedTaxSavings,
      recommendations: [
        ...criticalAlerts.map(a => a.recommendation),
        ...warnings.map(a => a.recommendation),
        functionalExpenses.grade !== 'A' ? 'Review expense allocations to maximize program service ratio.' : '',
        ubit.form990TRequired ? 'File Form 990-T for unrelated business income.' : '',
        !publicSupport.isPublicCharity ? 'Increase public fundraising to maintain public charity status.' : ''
      ].filter(Boolean)
    };
  }

  // --- PLAIN LANGUAGE TRANSLATOR ---
  translateToPlainLanguage(term: string): string {
    const translations: Record<string, string> = {
      'UBIT': 'Side Business Income Tax',
      'Unrelated Business Income': 'Money from activities not related to your mission',
      'Form 990-T': 'Side Business Tax Form',
      'IRC §4958': 'Excess Pay Penalty Rule',
      'Private Inurement': 'Insiders profiting unfairly from the nonprofit',
      'Quid Pro Quo': 'Something given in exchange for a donation',
      'Public Support Test': 'Proving your funding comes from the public',
      'Functional Expense Ratio': 'How much goes to programs vs. overhead',
      'Lobbying': 'Trying to influence legislation',
      '501(h) Election': 'Choosing clearer lobbying spending limits',
      'Excess Benefit Transaction': 'Paying someone more than fair value',
      'Substantial Part Test': 'Old way of measuring if too much lobbying',
      'Form SS-8': 'IRS form asking them to decide if someone is employee or contractor',
      'Joint Cost Allocation': 'Splitting shared costs between programs and fundraising',
      'DAF': 'Donor-Advised Fund — a charitable giving account',
      'Fair Market Value': 'What something would sell for on the open market',
      'Form 8283': 'Tax form for non-cash donations over $500',
      'Schedule M': 'Part of Form 990 reporting non-cash donations'
    };
    return translations[term] || term;
  }
}
