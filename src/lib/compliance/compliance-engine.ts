// CharityFlow Compliance Engine v2.0 — Core Logic
// Detects location, calculates scores, generates compliance roadmaps

import { STATE_RULES } from "./state-rules";

// ============================================================
// TYPES
// ============================================================

export interface OrganizationProfile {
  name: string;
  state: string;           // e.g., "California" or "US-CA"
  city?: string;
  county?: string;
  orgType: "religious" | "charitable" | "educational" | "scientific" | "literary";
  taxExemptType: string;   // e.g., "501(c)(3)"
  annualBudget: number;
  grossReceipts: number;
  totalAssets: number;
  fiscalYearEnd: string;   // e.g., "December" or "2026-12-31"
  hasUBI: boolean;
  ubiAmount?: number;
  conductsFundraising: boolean;
  conductsRaffles?: boolean;
  hasCommercialFundraiser?: boolean;
  isPrivateFoundation: boolean;
}

export interface ComplianceRoadmap {
  organization: string;
  state: string;
  generatedAt: string;
  healthScore: number;
  healthGrade: "A" | "B" | "C" | "D" | "F";
  federalRequirements: ComplianceItem[];
  stateRequirements: ComplianceItem[];
  localRequirements: ComplianceItem[];
  deadlines: DeadlineItem[];
  alerts: AlertItem[];
  estimatedCosts: CostSummary;
}

export interface ComplianceItem {
  id: string;
  category: "registration" | "filing" | "tax" | "audit" | "disclosure" | "corporate";
  title: string;
  description: string;
  form?: string;
  deadline?: string;
  fee?: number;
  status: "pending" | "due_soon" | "overdue" | "completed" | "not_applicable";
  priority: "critical" | "high" | "medium" | "low";
  actionUrl?: string;
  plainLanguage: string;  // Human-friendly description
}

export interface DeadlineItem {
  date: string;
  title: string;
  form?: string;
  daysUntil: number;
  urgency: "overdue" | "urgent" | "upcoming" | "future";
}

export interface AlertItem {
  type: "law_change" | "deadline" | "risk" | "opportunity";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  actionRequired: boolean;
  effectiveDate?: string;
}

export interface CostSummary {
  totalAnnualFees: number;
  breakdown: { item: string; amount: number }[];
}

// ============================================================
// FORM 990 VERSION DETECTOR
// ============================================================

export function determineForm990Version(org: OrganizationProfile): string {
  if (org.isPrivateFoundation) return "990-PF";
  if (org.orgType === "religious") return "990-N"; // Churches generally exempt but can file
  if (org.grossReceipts <= 50000) return "990-N";
  if (org.grossReceipts < 200000 && org.totalAssets < 500000) return "990-EZ";
  return "990";
}

export function needsForm990T(org: OrganizationProfile): boolean {
  return org.hasUBI && (org.ubiAmount ?? 0) >= 1000;
}

// ============================================================
// STATE CODE RESOLVER
// ============================================================

const STATE_NAME_TO_CODE: Record<string, string> = {
  "california": "US-CA", "ca": "US-CA",
  "texas": "US-TX", "tx": "US-TX",
  "new york": "US-NY", "ny": "US-NY",
  "florida": "US-FL", "fl": "US-FL",
  "illinois": "US-IL", "il": "US-IL",
};

export function resolveStateCode(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  if (STATE_RULES[normalized.toUpperCase()]) return normalized.toUpperCase();
  return STATE_NAME_TO_CODE[normalized] ?? null;
}

// ============================================================
// FILING FEE CALCULATOR
// ============================================================

export function calculateFilingFee(stateCode: string, revenue: number): number {
  const rules = STATE_RULES[stateCode];
  if (!rules || !rules.feeSchedule?.length) return 0;

  for (const tier of rules.feeSchedule) {
    const max = tier.revenueMax ?? Infinity;
    if (revenue >= tier.revenueMin && revenue < max) {
      return tier.fee;
    }
  }
  return 0;
}

// ============================================================
// AUDIT REQUIREMENT DETECTOR
// ============================================================

export function determineAuditRequirement(
  stateCode: string,
  revenue: number
): string {
  const rules = STATE_RULES[stateCode];
  if (!rules?.auditThresholds?.length) return "none";

  for (const tier of rules.auditThresholds) {
    const max = tier.revenueMax ?? Infinity;
    if (revenue >= tier.revenueMin && revenue < max) {
      return tier.requirement;
    }
  }
  return "none";
}

// ============================================================
// RELIGIOUS EXEMPTION CHECK
// ============================================================

export function isReligiousExempt(stateCode: string): {
  exempt: boolean;
  statute?: string;
  notes: string;
} {
  const rules = STATE_RULES[stateCode];
  if (!rules) return { exempt: false, notes: "State not found in database" };

  return {
    exempt: rules.religiousExempt ?? false,
    statute: rules.religiousStatute,
    notes: rules.religiousNotes ?? "",
  };
}

// ============================================================
// COMPLIANCE HEALTH SCORE CALCULATOR (0-100)
// ============================================================

export function calculateComplianceHealthScore(
  org: OrganizationProfile,
  completedItems: string[] // IDs of completed compliance items
): { score: number; grade: "A" | "B" | "C" | "D" | "F"; breakdown: Record<string, number> } {
  const stateCode = resolveStateCode(org.state);
  if (!stateCode) return { score: 0, grade: "F", breakdown: {} };

  const roadmap = generateComplianceRoadmap(org);
  const totalItems = [
    ...roadmap.federalRequirements,
    ...roadmap.stateRequirements,
    ...roadmap.localRequirements,
  ].filter((item) => item.status !== "not_applicable");

  if (totalItems.length === 0) return { score: 100, grade: "A", breakdown: {} };

  // Weight by priority
  const weights: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  let totalWeight = 0;
  let completedWeight = 0;

  const breakdown: Record<string, number> = {};

  for (const item of totalItems) {
    const w = weights[item.priority] ?? 1;
    totalWeight += w;
    if (completedItems.includes(item.id)) {
      completedWeight += w;
    }
    // Track by category
    if (!breakdown[item.category]) breakdown[item.category] = 0;
    if (completedItems.includes(item.id)) breakdown[item.category] += w;
  }

  const score = Math.round((completedWeight / totalWeight) * 100);
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  return { score, grade, breakdown };
}

// ============================================================
// FILING DEADLINE CALCULATOR
// ============================================================

export function calculateFilingDeadline(
  fiscalYearEnd: string,
  monthsAfter: number,
  daysAfter: number
): Date {
  const fyEnd = new Date(fiscalYearEnd);
  const deadline = new Date(fyEnd);
  deadline.setMonth(deadline.getMonth() + monthsAfter);
  deadline.setDate(deadline.getDate() + daysAfter);
  return deadline;
}

export function getIRSDeadline(fiscalYearEnd: string): Date {
  return calculateFilingDeadline(fiscalYearEnd, 4, 15); // 5th month, 15th day
}

// ============================================================
// COMPLIANCE ROADMAP GENERATOR
// ============================================================

export function generateComplianceRoadmap(org: OrganizationProfile): ComplianceRoadmap {
  const stateCode = resolveStateCode(org.state);
  const rules = stateCode ? STATE_RULES[stateCode] : null;
  const now = new Date();

  const federalReqs: ComplianceItem[] = [];
  const stateReqs: ComplianceItem[] = [];
  const localReqs: ComplianceItem[] = [];
  const deadlines: DeadlineItem[] = [];
  const alerts: AlertItem[] = [];
  const costs: { item: string; amount: number }[] = [];

  // --- FEDERAL REQUIREMENTS ---
  const form990Version = determineForm990Version(org);
  federalReqs.push({
    id: "fed-990",
    category: "filing",
    title: `File IRS ${form990Version}`,
    description: `Annual information return for tax-exempt organizations`,
    form: form990Version,
    fee: 0,
    status: "pending",
    priority: "critical",
    actionUrl: "https://www.irs.gov/charities-non-profits",
    plainLanguage: `File your Annual Tax Report (${form990Version}) with the IRS. This tells the government your nonprofit is still active and following the rules.`,
  });

  if (needsForm990T(org)) {
    federalReqs.push({
      id: "fed-990t",
      category: "tax",
      title: "File Form 990-T (Unrelated Business Income)",
      description: `Your org has $${org.ubiAmount?.toLocaleString()} in unrelated business income`,
      form: "990-T",
      fee: 0,
      status: "pending",
      priority: "high",
      plainLanguage: `You earned money from activities not related to your mission. You need to report this separately and may owe taxes on it.`,
    });
  }

  // --- STATE REQUIREMENTS ---
  if (rules) {
    // Check religious exemption
    const religiousCheck = isReligiousExempt(stateCode!);
    const isExempt = org.orgType === "religious" && religiousCheck.exempt;

    if (rules.registrationRequired && !isExempt) {
      const fee = calculateFilingFee(stateCode!, org.grossReceipts);
      stateReqs.push({
        id: `state-reg-${stateCode}`,
        category: "registration",
        title: `${rules.state} State Registration`,
        description: `Register with ${rules.agency}`,
        form: rules.registrationForm ?? rules.initialForm,
        fee,
        status: "pending",
        priority: "critical",
        actionUrl: rules.agencyUrl,
        plainLanguage: `Register your nonprofit with ${rules.state}. This lets the state know you exist and are collecting donations legally.`,
      });
      costs.push({ item: `${rules.state} registration fee`, amount: fee });
    } else if (isExempt) {
      stateReqs.push({
        id: `state-exempt-${stateCode}`,
        category: "registration",
        title: `${rules.state} — Religious Exemption Applies`,
        description: religiousCheck.notes,
        status: "not_applicable",
        priority: "low",
        plainLanguage: `Good news! As a religious organization in ${rules.state}, you are exempt from state charitable registration.`,
      });
    }

    // Audit requirement
    const auditReq = determineAuditRequirement(stateCode!, org.grossReceipts);
    if (auditReq !== "none") {
      stateReqs.push({
        id: `state-audit-${stateCode}`,
        category: "audit",
        title: `${rules.state} Audit Requirement: ${auditReq.replace(/_/g, " ")}`,
        description: `Based on $${org.grossReceipts.toLocaleString()} in gross receipts`,
        status: "pending",
        priority: "high",
        plainLanguage: `${rules.state} requires you to have your books reviewed by a certified accountant because your organization handles over the audit threshold.`,
      });
    }

    // Corporate filing
    if (rules.corporateFiling) {
      stateReqs.push({
        id: `state-corp-${stateCode}`,
        category: "corporate",
        title: `File ${rules.corporateFiling.form}`,
        description: `${rules.corporateFiling.frequency} filing`,
        form: rules.corporateFiling.form,
        fee: rules.corporateFiling.fee ?? 0,
        status: "pending",
        priority: "medium",
        plainLanguage: `File your corporate status update with the state to confirm your nonprofit is still active and your officers are current.`,
      });
      if (rules.corporateFiling.fee) {
        costs.push({ item: `${rules.state} corporate filing`, amount: rules.corporateFiling.fee });
      }
    }

    // Florida mandatory disclosure
    if (rules.mandatoryDisclosure?.required) {
      stateReqs.push({
        id: `state-disclosure-${stateCode}`,
        category: "disclosure",
        title: `${rules.state} Mandatory Solicitation Disclosure`,
        description: rules.mandatoryDisclosure.text,
        status: "pending",
        priority: "critical",
        plainLanguage: `Florida law requires you to include a specific legal disclaimer on ALL fundraising materials, emails, and donation pages. Failure to include this can result in fines.`,
      });
    }

    // Recent law updates → Alerts
    for (const update of rules.recentUpdates ?? []) {
      alerts.push({
        type: "law_change",
        severity: update.description.includes("Ban") ? "critical" : "warning",
        title: `${rules.state}: ${update.description}`,
        description: `Effective: ${update.effective}`,
        actionRequired: true,
        effectiveDate: update.effective,
      });
    }

    // Local requirements
    if (rules.localRules && org.city) {
      const cityRules = rules.localRules[org.city];
      if (cityRules) {
        if (cityRules.noticeRequired) {
          localReqs.push({
            id: `local-notice-${org.city}`,
            category: "registration",
            title: `${org.city} Event Notice Requirement`,
            description: `Must file notice ${cityRules.noticeDays} business days before fundraising events`,
            status: "pending",
            priority: "medium",
            plainLanguage: `In ${org.city}, you need to notify the city at least ${cityRules.noticeDays} business days before holding a fundraising event.`,
          });
        }
      }
    }
  }

  // Calculate total costs
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);

  return {
    organization: org.name,
    state: org.state,
    generatedAt: now.toISOString(),
    healthScore: 0, // Calculated separately with completed items
    healthGrade: "F",
    federalRequirements: federalReqs,
    stateRequirements: stateReqs,
    localRequirements: localReqs,
    deadlines,
    alerts,
    estimatedCosts: { totalAnnualFees: totalCosts, breakdown: costs },
  };
}

// ============================================================
// QUARTERLY LAW UPDATE CHECKER
// ============================================================

export function getRecentLawUpdates(stateCode?: string): AlertItem[] {
  const alerts: AlertItem[] = [];
  const states = stateCode ? [stateCode] : Object.keys(STATE_RULES);

  for (const code of states) {
    const rules = STATE_RULES[code];
    if (!rules?.recentUpdates) continue;

    for (const update of rules.recentUpdates) {
      alerts.push({
        type: "law_change",
        severity: update.description.toLowerCase().includes("ban") ? "critical" : "info",
        title: `[${rules.state}] ${update.description}`,
        description: `Effective: ${update.effective}`,
        actionRequired: true,
        effectiveDate: update.effective,
      });
    }
  }

  return alerts.sort((a, b) => (b.effectiveDate ?? "").localeCompare(a.effectiveDate ?? ""));
}

// ============================================================
// PLAIN LANGUAGE TRANSLATOR FOR COMPLIANCE TERMS
// ============================================================

export const COMPLIANCE_PLAIN_LANGUAGE: Record<string, string> = {
  "Form 990": "Annual Tax Report",
  "Form 990-EZ": "Short Annual Tax Report",
  "Form 990-N": "Annual Tax Postcard (quick online form)",
  "Form 990-PF": "Private Foundation Tax Report",
  "Form 990-T": "Business Income Tax Report",
  "501(c)(3)": "Tax-Exempt Nonprofit Status",
  "CHAR410": "New York Registration Form",
  "CHAR500": "New York Annual Report",
  "RRF-1": "California Annual Registration",
  "AG 990-IL": "Illinois Annual Report",
  "Chapter 496": "Florida Fundraising Law",
  "EPTL §8-1.4": "New York Religious Exemption Law",
  "UBIT": "Business Income Tax (money earned outside your mission)",
  "Functional Expense Ratio": "How efficiently you spend donations",
  "Public Support Test": "Proving your funding comes from the public (not just a few donors)",
  "Charitable Solicitation": "Asking people for donations",
  "Fiduciary Duty": "Legal responsibility to manage money wisely",
  "Audit": "Professional review of your financial records",
  "CPA Review": "Accountant checks your numbers for accuracy",
  "SI-100": "California Corporate Status Update",
  "Form 802": "Texas Corporate Status Update",
};

export function translateToPlainLanguage(term: string): string {
  return COMPLIANCE_PLAIN_LANGUAGE[term] ?? term;
}
