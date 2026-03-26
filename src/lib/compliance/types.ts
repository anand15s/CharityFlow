// CharityFlow Compliance Engine — Type Definitions

export interface FeeScheduleEntry {
  revenueMin: number;
  revenueMax: number | null;
  fee: number;
  form990Required?: boolean;
  altForm?: string;
}

export interface AuditThreshold {
  revenueMin: number;
  revenueMax: number | null;
  requirement: "none" | "cpa_review" | "cpa_review_or_audit" | "independent_audit";
}

export interface SpecialFiling {
  form: string;
  purpose: string;
}

export interface LocalRule {
  noticeRequired?: boolean;
  noticeDays?: number;
  infoCardRequired?: boolean;
  postEventReport?: boolean;
  timeRestrictions?: boolean;
  notes?: string;
}

export interface LawUpdate {
  year: number;
  description: string;
  effective: string;
}

export interface StateComplianceData {
  state: string;
  code: string;
  registrationRequired: boolean;
  registrationForm?: string;
  registrationNotes?: string;
  registrationStatute?: string;
  initialForm?: string;
  agency: string;
  agencyUrl: string;
  deadline: string;
  feeSchedule: FeeScheduleEntry[];
  registrationExceptions?: string[];
  stateTaxFiling?: Record<string, any>;
  corporateFiling?: {
    form: string;
    frequency: string;
    fee: number;
    agency?: string;
    month?: string;
    notes?: string;
  };
  taxExemptions?: Record<string, { form: string; agency: string }>;
  religiousExempt?: boolean;
  religiousStatute?: string;
  religiousNotes?: string;
  auditThresholds?: AuditThreshold[];
  specialFilings?: SpecialFiling[];
  localRules?: Record<string, LocalRule>;
  mandatoryDisclosure?: { required: boolean; text: string; notes?: string };
  dualFiling?: { threshold: number; requirement: string };
  onlineFiling?: { required: boolean; launched: string; notes: string };
  recentUpdates?: LawUpdate[];
}

export interface ComplianceResult {
  stateCode: string;
  stateName: string;
  registrationRequired: boolean;
  form990Version: string;
  filingFee: number;
  auditRequirement: string;
  religiousExempt: boolean;
  deadlines: { title: string; date: string }[];
  alerts: { severity: string; title: string; description: string }[];
  totalAnnualCost: number;
}

export interface ComplianceHealthScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: Record<string, number>;
}
