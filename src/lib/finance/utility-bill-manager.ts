// CharityFlow — Utility Bill Management Engine
// src/lib/finance/utility-bill-manager.ts
// Production code — NOT a stub

// ============================================================
// TYPES
// ============================================================

export interface UtilityProvider {
  id: string;
  name: string;
  type: UtilityType;
  accountNumber: string;
  apiEndpoint?: string;
  linkedAt: Date;
  lastSyncAt?: Date;
  status: "active" | "inactive" | "error";
}

export type UtilityType =
  | "electricity"
  | "gas"
  | "water"
  | "internet"
  | "phone"
  | "waste"
  | "security"
  | "insurance"
  | "rent"
  | "other";

export interface UtilityBill {
  id: string;
  providerId: string;
  providerName: string;
  type: UtilityType;
  amount: number;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  dueDate: Date;
  paidDate?: Date;
  status: "pending" | "paid" | "overdue" | "disputed";
  usage?: { quantity: number; unit: string };
  previousAmount?: number;
  category: string;
  orgId: string;
}

export interface QuarterlyReport {
  orgId: string;
  orgName: string;
  orgType: string;
  quarter: string;
  year: number;
  state: string;
  totalSpending: number;
  previousQuarterSpending: number;
  changeAmount: number;
  changePercent: number;
  byUtilityType: Record<UtilityType, { total: number; change: number; changePercent: number }>;
  topExpense: { type: UtilityType; amount: number };
  improvements: string[];
  warnings: string[];
  missingItems: string[];
  recommendations: string[];
  annualProjection: number;
  budgetUtilization: number;
}

export interface AnnualStatement {
  orgId: string;
  year: number;
  totalSpending: number;
  quarterlyBreakdown: { q1: number; q2: number; q3: number; q4: number };
  byUtilityType: Record<string, number>;
  yearOverYearChange: number;
  costPerMonth: number;
  highestMonth: { month: string; amount: number };
  lowestMonth: { month: string; amount: number };
  improvements: string[];
  missingItems: string[];
}

export interface MemberReport {
  orgId: string;
  orgName: string;
  quarter: string;
  year: number;
  generatedAt: Date;
  summary: string;
  changes: string[];
  improvements: string[];
  missingItems: string[];
  actionItems: string[];
  plainLanguage: boolean;
}

// ============================================================
// PLAIN LANGUAGE MAPPING
// ============================================================

const PLAIN_LANGUAGE: Record<string, string> = {
  "Utility Expenses": "Building & Office Costs",
  "Billing Period": "Time Covered",
  "Usage Metrics": "How Much You Used",
  "Budget Utilization": "How Much Budget Is Spent",
  "Year-over-Year": "Compared to Last Year",
  "Quarterly Variance": "Change from Last Quarter",
  "Cost Optimization": "Ways to Save Money",
  "Annual Projection": "Estimated Yearly Total",
  "Accounts Payable": "Bills to Pay",
  "Recurring Expense": "Regular Monthly Cost",
};

export function translateToPlainLanguage(term: string): string {
  return PLAIN_LANGUAGE[term] || term;
}

// ============================================================
// UTILITY PROVIDER MANAGEMENT
// ============================================================

export function linkUtilityProvider(
  name: string,
  type: UtilityType,
  accountNumber: string,
  apiEndpoint?: string
): UtilityProvider {
  if (!name || name.trim().length === 0) throw new Error("Provider name is required");
  if (!accountNumber || accountNumber.trim().length === 0) throw new Error("Account number is required");
  if (!isValidUtilityType(type)) throw new Error(`Invalid utility type: ${type}`);

  return {
    id: generateId(),
    name: name.trim(),
    type,
    accountNumber: accountNumber.trim(),
    apiEndpoint,
    linkedAt: new Date(),
    status: "active",
  };
}

export function unlinkUtilityProvider(provider: UtilityProvider): UtilityProvider {
  return { ...provider, status: "inactive" };
}

function isValidUtilityType(type: string): type is UtilityType {
  return ["electricity", "gas", "water", "internet", "phone", "waste", "security", "insurance", "rent", "other"].includes(type);
}

// ============================================================
// BILL PROCESSING
// ============================================================

export function processBill(
  providerId: string,
  providerName: string,
  type: UtilityType,
  amount: number,
  billingStart: Date,
  billingEnd: Date,
  dueDate: Date,
  orgId: string,
  usage?: { quantity: number; unit: string },
  previousAmount?: number
): UtilityBill {
  if (amount <= 0) throw new Error("Bill amount must be positive");
  if (billingEnd <= billingStart) throw new Error("Billing end must be after start");
  if (dueDate < billingEnd) throw new Error("Due date cannot be before billing end");

  const now = new Date();
  const status = dueDate < now ? "overdue" : "pending";

  return {
    id: generateId(),
    providerId,
    providerName,
    type,
    amount: Math.round(amount * 100) / 100,
    billingPeriodStart: billingStart,
    billingPeriodEnd: billingEnd,
    dueDate,
    status,
    usage,
    previousAmount,
    category: mapUtilityToCategory(type),
    orgId,
  };
}

export function markBillPaid(bill: UtilityBill, paidDate?: Date): UtilityBill {
  return { ...bill, status: "paid", paidDate: paidDate || new Date() };
}

export function markBillDisputed(bill: UtilityBill): UtilityBill {
  return { ...bill, status: "disputed" };
}

function mapUtilityToCategory(type: UtilityType): string {
  const categoryMap: Record<UtilityType, string> = {
    electricity: "Facilities — Electricity",
    gas: "Facilities — Gas/Heating",
    water: "Facilities — Water/Sewer",
    internet: "Technology — Internet",
    phone: "Technology — Phone/Communications",
    waste: "Facilities — Waste Management",
    security: "Facilities — Security",
    insurance: "Insurance — General",
    rent: "Facilities — Rent/Lease",
    other: "Operating Expenses — Other",
  };
  return categoryMap[type] || "Operating Expenses — Other";
}

// ============================================================
// QUARTERLY REPORT GENERATION
// ============================================================

export function generateQuarterlyReport(
  bills: UtilityBill[],
  previousQuarterBills: UtilityBill[],
  orgId: string,
  orgName: string,
  orgType: string,
  quarter: string,
  year: number,
  state: string,
  annualBudget: number
): QuarterlyReport {
  const totalSpending = bills.reduce((sum, b) => sum + b.amount, 0);
  const previousQuarterSpending = previousQuarterBills.reduce((sum, b) => sum + b.amount, 0);
  const changeAmount = totalSpending - previousQuarterSpending;
  const changePercent = previousQuarterSpending > 0 ? (changeAmount / previousQuarterSpending) * 100 : 0;

  // Group by utility type
  const byType: Record<string, { current: number; previous: number }> = {};
  bills.forEach((b) => {
    if (!byType[b.type]) byType[b.type] = { current: 0, previous: 0 };
    byType[b.type].current += b.amount;
  });
  previousQuarterBills.forEach((b) => {
    if (!byType[b.type]) byType[b.type] = { current: 0, previous: 0 };
    byType[b.type].previous += b.amount;
  });

  const byUtilityType: Record<string, any> = {};
  let topExpenseType: UtilityType = "other";
  let topExpenseAmount = 0;

  for (const [type, data] of Object.entries(byType)) {
    const change = data.current - data.previous;
    const pct = data.previous > 0 ? (change / data.previous) * 100 : 0;
    byUtilityType[type] = { total: Math.round(data.current * 100) / 100, change: Math.round(change * 100) / 100, changePercent: Math.round(pct * 10) / 10 };
    if (data.current > topExpenseAmount) {
      topExpenseAmount = data.current;
      topExpenseType = type as UtilityType;
    }
  }

  // Generate insights
  const improvements: string[] = [];
  const warnings: string[] = [];
  const missingItems: string[] = [];
  const recommendations: string[] = [];

  // Check for missing utility types
  const expectedTypes: UtilityType[] = ["electricity", "water", "internet"];
  expectedTypes.forEach((t) => {
    if (!byType[t]) missingItems.push(`No ${t} bills recorded this quarter — verify if this is correct`);
  });

  // Check for cost increases
  for (const [type, data] of Object.entries(byType)) {
    const pctChange = data.previous > 0 ? ((data.current - data.previous) / data.previous) * 100 : 0;
    if (pctChange > 20) warnings.push(`${type} costs increased ${Math.round(pctChange)}% — review for anomalies`);
    if (pctChange < -15 && data.previous > 0) improvements.push(`${type} costs decreased ${Math.abs(Math.round(pctChange))}% — great cost management!`);
  }

  // Budget check
  const budgetUtilization = annualBudget > 0 ? (totalSpending / (annualBudget / 4)) * 100 : 0;
  if (budgetUtilization > 100) warnings.push(`Spending exceeds quarterly budget by ${Math.round(budgetUtilization - 100)}%`);
  if (budgetUtilization < 75) improvements.push(`Under budget by ${Math.round(100 - budgetUtilization)}% — funds available for programs`);

  // Recommendations
  if (changePercent > 10) recommendations.push("Review vendor contracts for renegotiation opportunities");
  if (bills.filter((b) => b.status === "overdue").length > 0) recommendations.push("Set up auto-pay to avoid late fees and maintain vendor relationships");
  recommendations.push("Compare utility rates with nonprofit cooperative purchasing programs");

  return {
    orgId,
    orgName,
    orgType,
    quarter,
    year,
    state,
    totalSpending: Math.round(totalSpending * 100) / 100,
    previousQuarterSpending: Math.round(previousQuarterSpending * 100) / 100,
    changeAmount: Math.round(changeAmount * 100) / 100,
    changePercent: Math.round(changePercent * 10) / 10,
    byUtilityType,
    topExpense: { type: topExpenseType, amount: Math.round(topExpenseAmount * 100) / 100 },
    improvements,
    warnings,
    missingItems,
    recommendations,
    annualProjection: Math.round(totalSpending * 4 * 100) / 100,
    budgetUtilization: Math.round(budgetUtilization * 10) / 10,
  };
}

// ============================================================
// ANNUAL STATEMENT
// ============================================================

export function generateAnnualStatement(
  allBills: UtilityBill[],
  orgId: string,
  year: number,
  previousYearTotal?: number
): AnnualStatement {
  const totalSpending = allBills.reduce((sum, b) => sum + b.amount, 0);

  // Quarterly breakdown
  const quarters = { q1: 0, q2: 0, q3: 0, q4: 0 };
  const monthlyTotals: Record<string, number> = {};

  allBills.forEach((b) => {
    const month = b.billingPeriodEnd.getMonth();
    if (month <= 2) quarters.q1 += b.amount;
    else if (month <= 5) quarters.q2 += b.amount;
    else if (month <= 8) quarters.q3 += b.amount;
    else quarters.q4 += b.amount;

    const monthKey = b.billingPeriodEnd.toLocaleString("default", { month: "long" });
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + b.amount;
  });

  // By type
  const byUtilityType: Record<string, number> = {};
  allBills.forEach((b) => {
    byUtilityType[b.type] = (byUtilityType[b.type] || 0) + b.amount;
  });

  // High/low months
  let highMonth = { month: "N/A", amount: 0 };
  let lowMonth = { month: "N/A", amount: Infinity };
  for (const [month, amt] of Object.entries(monthlyTotals)) {
    if (amt > highMonth.amount) highMonth = { month, amount: amt };
    if (amt < lowMonth.amount) lowMonth = { month, amount: amt };
  }
  if (lowMonth.amount === Infinity) lowMonth = { month: "N/A", amount: 0 };

  const yearOverYearChange = previousYearTotal ? ((totalSpending - previousYearTotal) / previousYearTotal) * 100 : 0;

  const improvements: string[] = [];
  const missingItems: string[] = [];

  if (yearOverYearChange < -5) improvements.push(`Reduced utility costs by ${Math.abs(Math.round(yearOverYearChange))}% year-over-year`);
  if (yearOverYearChange > 15) missingItems.push(`Utility costs increased ${Math.round(yearOverYearChange)}% — budget review recommended`);

  // Check for months with no bills
  const months = new Set(allBills.map((b) => b.billingPeriodEnd.getMonth()));
  for (let m = 0; m < 12; m++) {
    if (!months.has(m)) {
      const monthName = new Date(year, m).toLocaleString("default", { month: "long" });
      missingItems.push(`No utility bills recorded for ${monthName}`);
    }
  }

  return {
    orgId,
    year,
    totalSpending: Math.round(totalSpending * 100) / 100,
    quarterlyBreakdown: {
      q1: Math.round(quarters.q1 * 100) / 100,
      q2: Math.round(quarters.q2 * 100) / 100,
      q3: Math.round(quarters.q3 * 100) / 100,
      q4: Math.round(quarters.q4 * 100) / 100,
    },
    byUtilityType: Object.fromEntries(Object.entries(byUtilityType).map(([k, v]) => [k, Math.round(v * 100) / 100])),
    yearOverYearChange: Math.round(yearOverYearChange * 10) / 10,
    costPerMonth: Math.round((totalSpending / 12) * 100) / 100,
    highestMonth: { ...highMonth, amount: Math.round(highMonth.amount * 100) / 100 },
    lowestMonth: { ...lowMonth, amount: Math.round(lowMonth.amount * 100) / 100 },
    improvements,
    missingItems,
  };
}

// ============================================================
// MEMBER REPORT (Plain Language)
// ============================================================

export function generateMemberReport(
  quarterlyReport: QuarterlyReport,
  generatedAt?: Date
): MemberReport {
  const { orgId, orgName, quarter, year, changePercent, improvements, warnings, missingItems, recommendations, totalSpending, previousQuarterSpending } = quarterlyReport;

  const direction = changePercent > 0 ? "increased" : changePercent < 0 ? "decreased" : "stayed the same";
  const summary = `This quarter, ${orgName} spent $${totalSpending.toLocaleString()} on building and office costs — that\'s ${direction} by ${Math.abs(changePercent)}% compared to last quarter ($${previousQuarterSpending.toLocaleString()}).`;

  const changes = [
    `Total spending: $${totalSpending.toLocaleString()} (was $${previousQuarterSpending.toLocaleString()})`,
    ...Object.entries(quarterlyReport.byUtilityType).map(([type, data]: [string, any]) => `${type}: $${data.total.toLocaleString()} (${data.changePercent > 0 ? "+" : ""}${data.changePercent}%)`),
  ];

  const actionItems = [
    ...warnings.map((w) => `⚠️ ${w}`),
    ...recommendations.map((r) => `💡 ${r}`),
  ];

  return {
    orgId,
    orgName,
    quarter,
    year,
    generatedAt: generatedAt || new Date(),
    summary,
    changes,
    improvements,
    missingItems,
    actionItems,
    plainLanguage: true,
  };
}

// ============================================================
// HELPERS
// ============================================================

let idCounter = 0;
function generateId(): string {
  return `ubm_${Date.now()}_${++idCounter}`;
}

export function resetIdCounter(): void {
  idCounter = 0;
}
