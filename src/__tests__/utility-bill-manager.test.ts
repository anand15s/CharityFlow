// CharityFlow — Utility Bill Management Engine Tests
// src/__tests__/utility-bill-manager.test.ts
// Executable Jest tests — NOT markdown docs

import {
  linkUtilityProvider,
  unlinkUtilityProvider,
  processBill,
  markBillPaid,
  markBillDisputed,
  generateQuarterlyReport,
  generateAnnualStatement,
  generateMemberReport,
  translateToPlainLanguage,
  resetIdCounter,
} from "../lib/finance/utility-bill-manager";

beforeEach(() => resetIdCounter());

// ============================================================
// PROVIDER MANAGEMENT
// ============================================================

describe("Utility Provider Management", () => {
  test("links a new utility provider with valid data", () => {
    const provider = linkUtilityProvider("Pacific Gas & Electric", "electricity", "PGE-001234");
    expect(provider.name).toBe("Pacific Gas & Electric");
    expect(provider.type).toBe("electricity");
    expect(provider.accountNumber).toBe("PGE-001234");
    expect(provider.status).toBe("active");
    expect(provider.id).toBeDefined();
  });

  test("rejects empty provider name", () => {
    expect(() => linkUtilityProvider("", "electricity", "ACC-001")).toThrow("Provider name is required");
  });

  test("rejects empty account number", () => {
    expect(() => linkUtilityProvider("PG&E", "electricity", "")).toThrow("Account number is required");
  });

  test("rejects invalid utility type", () => {
    expect(() => linkUtilityProvider("PG&E", "nuclear" as any, "ACC-001")).toThrow("Invalid utility type");
  });

  test("unlinks a provider (sets inactive)", () => {
    const provider = linkUtilityProvider("AT&T", "phone", "ATT-5678");
    const unlinked = unlinkUtilityProvider(provider);
    expect(unlinked.status).toBe("inactive");
    expect(unlinked.name).toBe("AT&T");
  });
});

// ============================================================
// BILL PROCESSING
// ============================================================

describe("Bill Processing", () => {
  test("processes a valid utility bill", () => {
    const bill = processBill(
      "prov-1", "PG&E", "electricity", 245.50,
      new Date("2026-01-01"), new Date("2026-01-31"),
      new Date("2026-02-15"), "org-1",
      { quantity: 1200, unit: "kWh" }
    );
    expect(bill.amount).toBe(245.50);
    expect(bill.type).toBe("electricity");
    expect(bill.category).toBe("Facilities — Electricity");
    expect(bill.usage?.quantity).toBe(1200);
  });

  test("rejects zero amount", () => {
    expect(() => processBill(
      "prov-1", "PG&E", "electricity", 0,
      new Date("2026-01-01"), new Date("2026-01-31"),
      new Date("2026-02-15"), "org-1"
    )).toThrow("Bill amount must be positive");
  });

  test("rejects negative amount", () => {
    expect(() => processBill(
      "prov-1", "PG&E", "electricity", -50,
      new Date("2026-01-01"), new Date("2026-01-31"),
      new Date("2026-02-15"), "org-1"
    )).toThrow("Bill amount must be positive");
  });

  test("rejects invalid billing period (end before start)", () => {
    expect(() => processBill(
      "prov-1", "PG&E", "electricity", 100,
      new Date("2026-02-01"), new Date("2026-01-01"),
      new Date("2026-02-15"), "org-1"
    )).toThrow("Billing end must be after start");
  });

  test("marks bill as paid", () => {
    const bill = processBill(
      "prov-1", "Water Co", "water", 85.00,
      new Date("2026-01-01"), new Date("2026-01-31"),
      new Date("2026-03-15"), "org-1"
    );
    const paid = markBillPaid(bill, new Date("2026-02-10"));
    expect(paid.status).toBe("paid");
    expect(paid.paidDate).toEqual(new Date("2026-02-10"));
  });

  test("marks bill as disputed", () => {
    const bill = processBill(
      "prov-1", "Gas Co", "gas", 320.00,
      new Date("2026-01-01"), new Date("2026-01-31"),
      new Date("2026-03-15"), "org-1"
    );
    const disputed = markBillDisputed(bill);
    expect(disputed.status).toBe("disputed");
  });

  test("auto-categorizes utility types correctly", () => {
    const types = [
      { type: "electricity", expected: "Facilities — Electricity" },
      { type: "internet", expected: "Technology — Internet" },
      { type: "rent", expected: "Facilities — Rent/Lease" },
      { type: "insurance", expected: "Insurance — General" },
    ];
    types.forEach(({ type, expected }) => {
      const bill = processBill(
        "prov-1", "Provider", type as any, 100,
        new Date("2026-01-01"), new Date("2026-01-31"),
        new Date("2026-03-15"), "org-1"
      );
      expect(bill.category).toBe(expected);
    });
  });
});

// ============================================================
// PLAIN LANGUAGE
// ============================================================

describe("Plain Language Translation", () => {
  test("translates accounting terms to plain language", () => {
    expect(translateToPlainLanguage("Utility Expenses")).toBe("Building & Office Costs");
    expect(translateToPlainLanguage("Budget Utilization")).toBe("How Much Budget Is Spent");
    expect(translateToPlainLanguage("Annual Projection")).toBe("Estimated Yearly Total");
  });

  test("returns original term if no translation exists", () => {
    expect(translateToPlainLanguage("Random Term")).toBe("Random Term");
  });
});

// ============================================================
// CALIFORNIA × 3 ORG TYPES — QUARTERLY REPORTS
// ============================================================

// Helper: generate test bills for an org
function generateTestBills(orgId: string, quarter: "Q1" | "Q2", amounts: Record<string, number>): any[] {
  const startMonth = quarter === "Q1" ? 0 : 3;
  return Object.entries(amounts).map(([type, amount]) =>
    processBill(
      `prov-${type}`, `${type} Provider`, type as any, amount,
      new Date(2026, startMonth, 1), new Date(2026, startMonth + 2, 28),
      new Date(2026, startMonth + 3, 15), orgId,
      type === "electricity" ? { quantity: Math.round(amount * 5), unit: "kWh" } : undefined
    )
  );
}

describe("STATE TEST: California — Hindu Temple of Fremont", () => {
  const orgId = "ca-temple-001";
  const orgName = "Hindu Temple of Fremont";
  const orgType = "Religious — 501(c)(3)";
  const state = "California";
  const budget = 180000;

  test("POC-UBM-CA-T1: Generates quarterly report with cost analysis", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 420, water: 180, gas: 290, internet: 89 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 580, water: 210, gas: 150, internet: 89 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.totalSpending).toBe(1029);
    expect(report.previousQuarterSpending).toBe(979);
    expect(report.changePercent).toBeCloseTo(5.1, 0);
    expect(report.state).toBe("California");
    expect(report.orgType).toBe("Religious — 501(c)(3)");
  });

  test("POC-UBM-CA-T2: Detects electricity spike for temple (summer AC for large hall)", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 420 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 680 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.warnings.length).toBeGreaterThan(0);
    expect(report.warnings.some(w => w.includes("electricity"))).toBe(true);
  });

  test("POC-UBM-CA-T3: Generates member report in plain language", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 420, water: 180 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 450, water: 170 });

    const qReport = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    const memberReport = generateMemberReport(qReport);
    expect(memberReport.plainLanguage).toBe(true);
    expect(memberReport.summary).toContain(orgName);
    expect(memberReport.summary).toContain("$");
    expect(memberReport.changes.length).toBeGreaterThan(0);
  });
});

describe("STATE TEST: California — Bay Area Food Bank", () => {
  const orgId = "ca-foodbank-001";
  const orgName = "Bay Area Food Bank";
  const orgType = "501(c)(3) — Food Distribution";
  const state = "California";
  const budget = 320000;

  test("POC-UBM-CA-FB1: Tracks cold storage electricity costs", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 1200, water: 340, gas: 180, waste: 290 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 1450, water: 380, gas: 120, waste: 310 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.topExpense.type).toBe("electricity");
    expect(report.topExpense.amount).toBe(1450);
    expect(report.byUtilityType.electricity.total).toBe(1450);
  });

  test("POC-UBM-CA-FB2: Flags missing internet bill", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 1200 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 1300 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.missingItems.some(m => m.includes("internet"))).toBe(true);
    expect(report.missingItems.some(m => m.includes("water"))).toBe(true);
  });

  test("POC-UBM-CA-FB3: Shows under-budget status", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 800, water: 200 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 850, water: 210 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.budgetUtilization).toBeLessThan(100);
    expect(report.improvements.some(i => i.includes("Under budget"))).toBe(true);
  });
});

describe("STATE TEST: California — TechBridge SF (IT Support Nonprofit)", () => {
  const orgId = "ca-itnonprofit-001";
  const orgName = "TechBridge SF";
  const orgType = "501(c)(3) — Technology/Education";
  const state = "California";
  const budget = 450000;

  test("POC-UBM-CA-IT1: Tracks high internet/cloud costs", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { internet: 890, electricity: 520, phone: 340, security: 180 });
    const q2Bills = generateTestBills(orgId, "Q2", { internet: 950, electricity: 480, phone: 340, security: 180 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.topExpense.type).toBe("internet");
    expect(report.topExpense.amount).toBe(950);
  });

  test("POC-UBM-CA-IT2: Detects cost decrease as improvement", () => {
    const q1Bills = generateTestBills(orgId, "Q1", { electricity: 800 });
    const q2Bills = generateTestBills(orgId, "Q2", { electricity: 520 });

    const report = generateQuarterlyReport(q2Bills, q1Bills, orgId, orgName, orgType, "Q2", 2026, state, budget);
    expect(report.improvements.some(i => i.includes("electricity") && i.includes("decreased"))).toBe(true);
  });

  test("POC-UBM-CA-IT3: Generates annual statement with 12-month breakdown", () => {
    const allBills: any[] = [];
    for (let month = 0; month < 12; month++) {
      allBills.push(processBill(
        "prov-internet", "ISP", "internet", 890 + Math.random() * 100,
        new Date(2026, month, 1), new Date(2026, month, 28),
        new Date(2026, month + 1, 15), orgId
      ));
      allBills.push(processBill(
        "prov-elec", "PG&E", "electricity", 450 + Math.random() * 150,
        new Date(2026, month, 1), new Date(2026, month, 28),
        new Date(2026, month + 1, 15), orgId
      ));
    }

    const annual = generateAnnualStatement(allBills, orgId, 2026, 15000);
    expect(annual.year).toBe(2026);
    expect(annual.totalSpending).toBeGreaterThan(0);
    expect(annual.quarterlyBreakdown.q1).toBeGreaterThan(0);
    expect(annual.quarterlyBreakdown.q4).toBeGreaterThan(0);
    expect(annual.costPerMonth).toBeGreaterThan(0);
    expect(annual.byUtilityType.internet).toBeGreaterThan(0);
    expect(annual.byUtilityType.electricity).toBeGreaterThan(0);
    expect(annual.highestMonth.month).toBeDefined();
    expect(annual.lowestMonth.month).toBeDefined();
  });
});

// ============================================================
// MEMBER REPORT GENERATION
// ============================================================

describe("Member Report Generation", () => {
  test("generates plain language member report", () => {
    const q1Bills = generateTestBills("org-test", "Q1", { electricity: 500, water: 200, internet: 100 });
    const q2Bills = generateTestBills("org-test", "Q2", { electricity: 550, water: 180, internet: 100 });

    const qReport = generateQuarterlyReport(q2Bills, q1Bills, "org-test", "Test Org", "501(c)(3)", "Q2", 2026, "California", 100000);
    const memberReport = generateMemberReport(qReport);

    expect(memberReport.plainLanguage).toBe(true);
    expect(memberReport.summary).toContain("Test Org");
    expect(memberReport.changes.length).toBeGreaterThanOrEqual(1);
    expect(memberReport.actionItems.length).toBeGreaterThanOrEqual(0);
  });

  test("includes action items from warnings and recommendations", () => {
    const q1Bills = generateTestBills("org-test", "Q1", { electricity: 200 });
    const q2Bills = generateTestBills("org-test", "Q2", { electricity: 500 });

    const qReport = generateQuarterlyReport(q2Bills, q1Bills, "org-test", "Test Org", "501(c)(3)", "Q2", 2026, "California", 100000);
    const memberReport = generateMemberReport(qReport);

    expect(memberReport.actionItems.length).toBeGreaterThan(0);
  });
});
