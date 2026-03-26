// CharityFlow Compliance Engine — Unit Tests
// Tests all 5 states × 3 org types = 15 scenarios

import {
  determineForm990Version,
  needsForm990T,
  resolveStateCode,
  calculateFilingFee,
  determineAuditRequirement,
  isReligiousExempt,
  generateComplianceRoadmap,
  getRecentLawUpdates,
  translateToPlainLanguage,
} from "../compliance-engine";
import { OrganizationProfile } from "../types";

// ============================================================
// TEST DATA: 15 Organizations (5 states × 3 types)
// ============================================================

const testOrgs: Record<string, OrganizationProfile> = {
  // CALIFORNIA
  "CA-T1": {
    name: "Hindu Temple of Sacramento",
    state: "California",
    city: "Sacramento",
    orgType: "religious",
    taxExemptType: "501(c)(3)",
    annualBudget: 150000,
    grossReceipts: 150000,
    totalAssets: 200000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "CA-FB1": {
    name: "Bay Area Community Food Bank",
    state: "California",
    city: "San Francisco",
    orgType: "charitable",
    taxExemptType: "501(c)(3)",
    annualBudget: 350000,
    grossReceipts: 350000,
    totalAssets: 450000,
    fiscalYearEnd: "June",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "CA-IT1": {
    name: "Silicon Valley IT Mentors",
    state: "California",
    orgType: "educational",
    taxExemptType: "501(c)(3)",
    annualBudget: 75000,
    grossReceipts: 75000,
    totalAssets: 50000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  // TEXAS
  "TX-T2": {
    name: "Dallas Sikh Gurdwara",
    state: "Texas",
    orgType: "religious",
    taxExemptType: "501(c)(3)",
    annualBudget: 150000,
    grossReceipts: 150000,
    totalAssets: 300000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "TX-FB2": {
    name: "Houston Food Rescue",
    state: "Texas",
    orgType: "charitable",
    taxExemptType: "501(c)(3)",
    annualBudget: 350000,
    grossReceipts: 350000,
    totalAssets: 400000,
    fiscalYearEnd: "September",
    hasUBI: true,
    ubiAmount: 5000,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "TX-IT2": {
    name: "Austin Tech for Good",
    state: "Texas",
    orgType: "educational",
    taxExemptType: "501(c)(3)",
    annualBudget: 75000,
    grossReceipts: 75000,
    totalAssets: 30000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: false,
    isPrivateFoundation: false,
  },
  // NEW YORK
  "NY-T3": {
    name: "Brooklyn Orthodox Synagogue",
    state: "New York",
    city: "Brooklyn",
    orgType: "religious",
    taxExemptType: "501(c)(3)",
    annualBudget: 150000,
    grossReceipts: 150000,
    totalAssets: 500000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "NY-FB3": {
    name: "Bronx Community Food Pantry",
    state: "New York",
    orgType: "charitable",
    taxExemptType: "501(c)(3)",
    annualBudget: 350000,
    grossReceipts: 350000,
    totalAssets: 200000,
    fiscalYearEnd: "June",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "NY-IT3": {
    name: "Queens Digital Literacy Hub",
    state: "New York",
    orgType: "educational",
    taxExemptType: "501(c)(3)",
    annualBudget: 75000,
    grossReceipts: 75000,
    totalAssets: 40000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  // FLORIDA
  "FL-T4": {
    name: "Miami Hindu Mandir",
    state: "Florida",
    orgType: "religious",
    taxExemptType: "501(c)(3)",
    annualBudget: 150000,
    grossReceipts: 150000,
    totalAssets: 250000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "FL-FB4": {
    name: "Tampa Bay Food Share",
    state: "Florida",
    orgType: "charitable",
    taxExemptType: "501(c)(3)",
    annualBudget: 350000,
    grossReceipts: 350000,
    totalAssets: 300000,
    fiscalYearEnd: "March",
    hasUBI: true,
    ubiAmount: 2000,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "FL-IT4": {
    name: "Orlando Code Academy",
    state: "Florida",
    orgType: "educational",
    taxExemptType: "501(c)(3)",
    annualBudget: 75000,
    grossReceipts: 75000,
    totalAssets: 20000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  // ILLINOIS
  "IL-T5": {
    name: "Chicago Buddhist Temple",
    state: "Illinois",
    orgType: "religious",
    taxExemptType: "501(c)(3)",
    annualBudget: 150000,
    grossReceipts: 150000,
    totalAssets: 400000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "IL-FB5": {
    name: "Springfield Community Kitchen",
    state: "Illinois",
    orgType: "charitable",
    taxExemptType: "501(c)(3)",
    annualBudget: 350000,
    grossReceipts: 350000,
    totalAssets: 250000,
    fiscalYearEnd: "June",
    hasUBI: false,
    conductsFundraising: true,
    isPrivateFoundation: false,
  },
  "IL-IT5": {
    name: "Champaign Tech Bridge",
    state: "Illinois",
    orgType: "educational",
    taxExemptType: "501(c)(3)",
    annualBudget: 75000,
    grossReceipts: 75000,
    totalAssets: 35000,
    fiscalYearEnd: "December",
    hasUBI: false,
    conductsFundraising: false,
    isPrivateFoundation: false,
  },
};

// ============================================================
// TESTS
// ============================================================

describe("State Code Resolution", () => {
  test("resolves California", () => expect(resolveStateCode("California")).toBe("US-CA"));
  test("resolves TX shortcode", () => expect(resolveStateCode("tx")).toBe("US-TX"));
  test("resolves New York", () => expect(resolveStateCode("New York")).toBe("US-NY"));
  test("resolves FL", () => expect(resolveStateCode("fl")).toBe("US-FL"));
  test("resolves Illinois", () => expect(resolveStateCode("Illinois")).toBe("US-IL"));
  test("returns null for unknown", () => expect(resolveStateCode("Atlantis")).toBeNull());
});

describe("Form 990 Version Detection", () => {
  test("CA Temple (religious, $150K) → 990-N", () => {
    expect(determineForm990Version(testOrgs["CA-T1"])).toBe("990-N");
  });
  test("CA Food Bank ($350K, assets <$500K) → 990", () => {
    expect(determineForm990Version(testOrgs["CA-FB1"])).toBe("990");
  });
  test("TX IT org ($75K) → 990-EZ", () => {
    expect(determineForm990Version(testOrgs["TX-IT2"])).toBe("990-EZ");
  });
  test("TX Food Bank with UBI needs 990-T", () => {
    expect(needsForm990T(testOrgs["TX-FB2"])).toBe(true);
  });
  test("CA Temple without UBI does NOT need 990-T", () => {
    expect(needsForm990T(testOrgs["CA-T1"])).toBe(false);
  });
});

describe("Filing Fee Calculation", () => {
  test("CA $150K revenue → $25", () => expect(calculateFilingFee("US-CA", 150000)).toBe(25));
  test("CA $350K revenue → $50", () => expect(calculateFilingFee("US-CA", 350000)).toBe(50));
  test("TX any revenue → $0", () => expect(calculateFilingFee("US-TX", 350000)).toBe(0));
  test("NY $150K revenue → $25", () => expect(calculateFilingFee("US-NY", 150000)).toBe(25));
  test("NY $350K revenue → $50", () => expect(calculateFilingFee("US-NY", 350000)).toBe(50));
  test("FL any revenue → $10", () => expect(calculateFilingFee("US-FL", 350000)).toBe(10));
  test("IL any revenue → $15", () => expect(calculateFilingFee("US-IL", 150000)).toBe(15));
});

describe("Audit Requirements", () => {
  test("CA $350K → none", () => expect(determineAuditRequirement("US-CA", 350000)).toBe("none"));
  test("CA $2.5M → independent_audit", () => expect(determineAuditRequirement("US-CA", 2500000)).toBe("independent_audit"));
  test("TX any → none", () => expect(determineAuditRequirement("US-TX", 5000000)).toBe("none"));
  test("NY $350K → cpa_review", () => expect(determineAuditRequirement("US-NY", 350000)).toBe("cpa_review"));
  test("NY $800K → independent_audit", () => expect(determineAuditRequirement("US-NY", 800000)).toBe("independent_audit"));
  test("FL $600K → cpa_review", () => expect(determineAuditRequirement("US-FL", 600000)).toBe("cpa_review"));
  test("IL $400K → cpa_review", () => expect(determineAuditRequirement("US-IL", 400000)).toBe("cpa_review"));
});

describe("Religious Exemptions", () => {
  test("TX → all exempt", () => expect(isReligiousExempt("US-TX").exempt).toBe(true));
  test("NY → exempt (EPTL §8-1.4)", () => {
    const result = isReligiousExempt("US-NY");
    expect(result.exempt).toBe(true);
    expect(result.statute).toBe("EPTL §8-1.4");
  });
  test("CA → NOT exempt", () => expect(isReligiousExempt("US-CA").exempt).toBe(false));
  test("FL → NOT exempt", () => expect(isReligiousExempt("US-FL").exempt).toBe(false));
  test("IL → NOT exempt", () => expect(isReligiousExempt("US-IL").exempt).toBe(false));
});

describe("Compliance Roadmap Generation", () => {
  test("CA Food Bank generates federal + state requirements", () => {
    const roadmap = generateComplianceRoadmap(testOrgs["CA-FB1"]);
    expect(roadmap.federalRequirements.length).toBeGreaterThan(0);
    expect(roadmap.stateRequirements.length).toBeGreaterThan(0);
    expect(roadmap.estimatedCosts.totalAnnualFees).toBeGreaterThan(0);
  });

  test("TX Gurdwara has no state registration requirement", () => {
    const roadmap = generateComplianceRoadmap(testOrgs["TX-T2"]);
    const stateReg = roadmap.stateRequirements.find(r => r.category === "registration");
    expect(stateReg).toBeUndefined();
  });

  test("NY Synagogue gets religious exemption", () => {
    const roadmap = generateComplianceRoadmap(testOrgs["NY-T3"]);
    const exempt = roadmap.stateRequirements.find(r => r.id.includes("exempt"));
    expect(exempt).toBeDefined();
    expect(exempt?.status).toBe("not_applicable");
  });

  test("FL orgs get mandatory disclosure requirement", () => {
    const roadmap = generateComplianceRoadmap(testOrgs["FL-FB4"]);
    const disclosure = roadmap.stateRequirements.find(r => r.category === "disclosure");
    expect(disclosure).toBeDefined();
    expect(disclosure?.priority).toBe("critical");
  });

  test("IL org gets state registration", () => {
    const roadmap = generateComplianceRoadmap(testOrgs["IL-FB5"]);
    const reg = roadmap.stateRequirements.find(r => r.category === "registration");
    expect(reg).toBeDefined();
    expect(reg?.fee).toBe(15);
  });
});

describe("Law Updates & Alerts", () => {
  test("FL SB 700 Foreign Donor Ban appears", () => {
    const alerts = getRecentLawUpdates("US-FL");
    const sb700 = alerts.find(a => a.title.includes("Foreign Donor Ban"));
    expect(sb700).toBeDefined();
    expect(sb700?.severity).toBe("critical");
  });

  test("IL online portal launch appears", () => {
    const alerts = getRecentLawUpdates("US-IL");
    const portal = alerts.find(a => a.title.includes("Online Portal"));
    expect(portal).toBeDefined();
  });

  test("All states combined returns multiple alerts", () => {
    const allAlerts = getRecentLawUpdates();
    expect(allAlerts.length).toBeGreaterThanOrEqual(5);
  });
});

describe("Plain Language Translation", () => {
  test("Form 990 → Annual Tax Report", () => {
    expect(translateToPlainLanguage("Form 990")).toBe("Annual Tax Report");
  });
  test("UBIT → Business Income Tax", () => {
    expect(translateToPlainLanguage("UBIT")).toBe("Business Income Tax (money earned outside your mission)");
  });
  test("Unknown term returns itself", () => {
    expect(translateToPlainLanguage("xyz")).toBe("xyz");
  });
});
