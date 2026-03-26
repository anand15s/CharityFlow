// CharityFlow Compliance Engine v2.0
// Location-Based Compliance with Real State Law Data
// Covers: California, Texas, New York, Florida, Illinois + Federal

import { StateComplianceData, ComplianceResult, ComplianceHealthScore } from "./types";

// ============================================================
// STATE COMPLIANCE DATABASE
// ============================================================

export const STATE_RULES: Record<string, StateComplianceData> = {
  "US-CA": {
    state: "California",
    code: "US-CA",
    registrationRequired: true,
    registrationForm: "RRF-1 (Annual Registration Renewal Fee Report)",
    initialForm: "CT-1 (Initial Registration)",
    agency: "CA Attorney General - Registry of Charities",
    agencyUrl: "https://oag.ca.gov/charities",
    deadline: "4 months + 15 days after fiscal year end",
    feeSchedule: [
      { revenueMin: 0, revenueMax: 50000, fee: 25, form990Required: false, altForm: "CT-TR-1" },
      { revenueMin: 50000, revenueMax: 250000, fee: 25, form990Required: true },
      { revenueMin: 250000, revenueMax: 1000000, fee: 50, form990Required: true },
      { revenueMin: 1000000, revenueMax: 5000000, fee: 200, form990Required: true },
      { revenueMin: 5000000, revenueMax: 50000000, fee: 300, form990Required: true },
      { revenueMin: 50000000, revenueMax: 500000000, fee: 600, form990Required: true },
      { revenueMin: 500000000, revenueMax: Infinity, fee: 1200, form990Required: true },
    ],
    stateTaxFiling: {
      formOver50k: "Form 199",
      formUnder50k: "Form 199N (e-Postcard)",
      ubitForm: "Form 109",
    },
    corporateFiling: { form: "SI-100", frequency: "Biennial", fee: 20 },
    religiousExempt: false,
    religiousNotes: "Must file RRF-1 but lower scrutiny; churches exempt from Form 990 at federal level",
    auditThresholds: [
      { revenueMin: 0, revenueMax: 2000000, requirement: "none" },
      { revenueMin: 2000000, revenueMax: Infinity, requirement: "independent_audit" },
    ],
    specialFilings: [
      { form: "CT-NRP-1", purpose: "Raffle registration" },
      { form: "CT-NRP-2", purpose: "Raffle report" },
      { form: "CT-3CF", purpose: "Fundraising counsel registration" },
      { form: "CT-1CF", purpose: "Commercial fundraiser registration" },
      { form: "CT-694", purpose: "Annual financial solicitation report (>50% income from CA donors AND >$1M)" },
    ],
    localRules: {
      "Los Angeles": {
        noticeRequired: true,
        noticeDays: 15,
        infoCardRequired: true,
        postEventReport: true,
      },
    },
    recentUpdates: [
      { year: 2026, description: "AG Online Filing System mandatory for all new registrations", effective: "2026-01-01" },
      { year: 2025, description: "Blanket extension for renewals due Jan 7 2025 - Apr 30 2026", effective: "2025-01-07" },
    ],
  },

  "US-TX": {
    state: "Texas",
    code: "US-TX",
    registrationRequired: false,
    registrationNotes: "Texas is a no-registration state for most nonprofits",
    agency: "Texas Attorney General - Charitable Trusts",
    agencyUrl: "https://texasattorneygeneral.gov/divisions/charitable-trusts",
    deadline: "N/A (no state filing required)",
    feeSchedule: [],
    registrationExceptions: [
      "Law enforcement orgs soliciting by telephone ($50 registration with OAG)",
      "Public safety organizations and publications",
      "Veterans organizations",
      "Commercial telephone solicitors ($50,000 surety bond with SOS)",
    ],
    stateTaxFiling: {
      required: false,
      exception: "Private foundations must send Form 990-PF to OAG simultaneously with IRS filing",
    },
    corporateFiling: { form: "Form 802", frequency: "Every 4 years", fee: 0 },
    taxExemptions: {
      salesTax: { form: "AP-205", agency: "Texas Comptroller" },
      franchiseTax: { form: "AP-205", agency: "Texas Comptroller" },
      hotelOccupancyTax: { form: "AP-205", agency: "Texas Comptroller" },
    },
    religiousExempt: true,
    religiousNotes: "All nonprofits exempt from state registration (most nonprofit-friendly state)",
    auditThresholds: [{ revenueMin: 0, revenueMax: Infinity, requirement: "none" }],
    recentUpdates: [
      { year: 2025, description: "HB 4752 - Property tax exemptions for charitable orgs (passed House, pending Senate)", effective: "Pending" },
    ],
  },

  "US-NY": {
    state: "New York",
    code: "US-NY",
    registrationRequired: true,
    registrationForm: "CHAR500 (Annual Filing)",
    initialForm: "CHAR410 (Registration Statement)",
    agency: "NY Attorney General - Charities Bureau",
    agencyUrl: "https://charitiesnys.com",
    deadline: "4 months + 15 days after fiscal year end",
    feeSchedule: [
      { revenueMin: 0, revenueMax: 250000, fee: 25 },
      { revenueMin: 250000, revenueMax: 500000, fee: 50 },
      { revenueMin: 500000, revenueMax: 1000000, fee: 100 },
      { revenueMin: 1000000, revenueMax: 5000000, fee: 250 },
      { revenueMin: 5000000, revenueMax: Infinity, fee: 750 },
    ],
    dualFiling: { threshold: 250000, requirement: "Must also file CHAR500 with NY Dept of State" },
    religiousExempt: true,
    religiousStatute: "EPTL §8-1.4",
    religiousNotes: "Religious orgs exempt from CHAR410/CHAR500 filing",
    auditThresholds: [
      { revenueMin: 0, revenueMax: 250000, requirement: "none" },
      { revenueMin: 250000, revenueMax: 500000, requirement: "cpa_review" },
      { revenueMin: 500000, revenueMax: 750000, requirement: "cpa_review_or_audit" },
      { revenueMin: 750000, revenueMax: Infinity, requirement: "independent_audit" },
    ],
    recentUpdates: [
      { year: 2025, description: "EPTL filing fee: $50 base + Article 7-A $25 = $75 minimum", effective: "2025-01-01" },
    ],
  },

  "US-FL": {
    state: "Florida",
    code: "US-FL",
    registrationRequired: true,
    registrationStatute: "Chapter 496 - Solicitation of Contributions Act",
    agency: "FL Dept of Agriculture & Consumer Services",
    agencyUrl: "https://fdacs.gov",
    deadline: "Annual renewal",
    feeSchedule: [{ revenueMin: 0, revenueMax: Infinity, fee: 10 }],
    mandatoryDisclosure: {
      required: true,
      text: "A COPY OF THE OFFICIAL REGISTRATION AND FINANCIAL INFORMATION MAY BE OBTAINED FROM THE DIVISION OF CONSUMER SERVICES BY CALLING TOLL-FREE WITHIN THE STATE. REGISTRATION DOES NOT IMPLY ENDORSEMENT, APPROVAL, OR RECOMMENDATION BY THE STATE.",
    },
    religiousExempt: false,
    religiousNotes: "Religious orgs NOT exempt - must register under Chapter 496",
    auditThresholds: [
      { revenueMin: 0, revenueMax: 500000, requirement: "none" },
      { revenueMin: 500000, revenueMax: 1000000, requirement: "cpa_review" },
      { revenueMin: 1000000, revenueMax: Infinity, requirement: "independent_audit" },
    ],
    recentUpdates: [
      { year: 2025, description: "SB 700 - Foreign Donor Ban: Must attest no donations from China, Russia, Iran, N. Korea, Cuba, Venezuela, Syria", effective: "2025-07-01" },
      { year: 2025, description: "Increased enforcement of Chapter 496 disclosure requirements", effective: "2025-01-01" },
    ],
  },

  "US-IL": {
    state: "Illinois",
    code: "US-IL",
    registrationRequired: true,
    registrationStatute: "Charitable Trust Act + Solicitation for Charity Act",
    registrationForm: "AG 990-IL (Illinois Annual Report)",
    agency: "IL Attorney General - Charitable Trust Bureau",
    agencyUrl: "https://illinoisattorneygeneral.gov/charities",
    deadline: "6 months after fiscal year end",
    feeSchedule: [{ revenueMin: 0, revenueMax: Infinity, fee: 15 }],
    onlineFiling: { required: true, launched: "September 2025", notes: "Paper filings no longer accepted" },
    religiousExempt: false,
    religiousNotes: "Religious organizations must register with AG under Charitable Trust Act",
    corporateFiling: { form: "Annual Report", agency: "IL Secretary of State", fee: 0 },
    auditThresholds: [
      { revenueMin: 0, revenueMax: 300000, requirement: "none" },
      { revenueMin: 300000, revenueMax: 500000, requirement: "cpa_review" },
      { revenueMin: 500000, revenueMax: Infinity, requirement: "independent_audit" },
    ],
    recentUpdates: [
      { year: 2025, description: "Online Portal Launch - All AG filings now electronic", effective: "2025-09-01" },
    ],
  },
};
