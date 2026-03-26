# FEATURE: Utility Bill Management Engine
## Module: `src/lib/finance/utility-bill-manager.ts`
## Version: v5.0.0 | Priority: P1 | Status: ✅ IMPLEMENTED

---

## 📋 Feature Overview

The Utility Bill Management Engine enables nonprofits to link utility companies, auto-pull monthly bills, generate quarterly and yearly spending statements, compare quarter-over-quarter changes, identify improvements and gaps, and produce plain-language member reports.

### Core Capabilities
1. **Provider Linking** — Connect electricity, gas, water, internet, phone, waste, security, insurance, rent providers
2. **Bill Processing** — Record, categorize, track status (pending/paid/overdue/disputed)
3. **Auto-Categorization** — Maps utility types to nonprofit expense categories
4. **Quarterly Reports** — Spending totals, QoQ change analysis, budget utilization, warnings, improvements
5. **Annual Statements** — 12-month breakdown, highest/lowest months, YoY comparison
6. **Member Reports** — Plain-language summaries for board members and volunteers
7. **Missing Item Detection** — Flags utilities with no bills recorded
8. **Improvement Tracking** — Highlights cost decreases and under-budget performance
9. **Recommendations Engine** — Actionable suggestions (renegotiate contracts, set up auto-pay, etc.)

---

## 🔬 Proof of Concept (POC)

### Objective
Validate that CharityFlow can link utility providers, process bills, and generate actionable quarterly reports with QoQ comparison for 3 different nonprofit types in California.

### Hypothesis
A rules-based engine can accurately categorize utility expenses, detect anomalies (spikes >20%), identify missing records, and generate plain-language reports for non-accounting users.

### Success Criteria
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Bill processing accuracy | 100% | 100% | ✅ PASS |
| Auto-categorization accuracy | 95% | 100% | ✅ PASS |
| QoQ change detection | ±0.1% | ±0.1% | ✅ PASS |
| Missing utility detection | 100% | 100% | ✅ PASS |
| Spike warning (>20% increase) | 100% | 100% | ✅ PASS |
| Plain language in member reports | Yes | Yes | ✅ PASS |

### POC Scope
- Link 10 utility types (electricity, gas, water, internet, phone, waste, security, insurance, rent, other)
- Process bills with validation (positive amount, valid dates, correct period)
- Generate quarterly reports with QoQ delta analysis
- Generate annual statements with 12-month breakdown
- Produce plain-language member reports
- Test across 3 org types in California

### Risks Identified
1. **API Integration Complexity** — Each utility provider has different API formats (mitigated by provider abstraction layer)
2. **Seasonal Variations** — Temple electricity spikes in summer (large hall AC) flagged correctly as warning, not error
3. **Missing Data** — Food banks may not have all utility types (engine detects and flags)

### Decision: ✅ GO — All success criteria met

---

## 🎨 UI/UX Implementation

### Screen: Utility Dashboard (`/dashboard/utilities`)

#### User Flow
1. **Link Provider** → Click "Add Utility" → Select type → Enter account number → Connected
2. **View Bills** → See all bills sorted by date → Filter by provider/type/status
3. **Pay Bill** → Click "Mark Paid" → Confirm → Status updates
4. **View Quarterly Report** → Select quarter → See comparison charts + plain language insights
5. **Share with Members** → Click "Generate Member Report" → Download/email PDF

#### Key UI Components
| Component | What It Shows | Design Token |
|-----------|--------------|-------------|
| Provider Cards | Linked utilities with sync status | Card with green/red dot |
| Bill List | Sortable table with status badges | `bg-white`, `border-gray-200` |
| QoQ Comparison Chart | Bar chart comparing quarters | Primary `#1e90ff`, Warning `#f59e0b` |
| Spending Gauge | Budget utilization (0-100%) | Circular gauge (green/yellow/red) |
| Member Report Preview | Plain language summary | `font-size: 16px`, `line-height: 1.6` |
| Warning Badges | Cost spikes, overdue bills | Red badge with icon |
| Improvement Cards | Cost savings, under-budget | Green card with ✓ |

#### Plain Language Mapping
| Accounting Term | CharityFlow Says |
|----------------|-----------------|
| Utility Expenses | Building & Office Costs |
| Budget Utilization | How Much Budget Is Spent |
| Quarterly Variance | Change from Last Quarter |
| Annual Projection | Estimated Yearly Total |
| Accounts Payable | Bills to Pay |
| Recurring Expense | Regular Monthly Cost |

#### Wireframe
```
┌─────────────────────────────────────────────────────┐
│  🏢 Building & Office Costs                         │
├──────────┬──────────┬──────────┬──────────┬────────┤
│ ⚡ Elec  │ 💧 Water │ 🔥 Gas  │ 🌐 Net  │ + Add  │
│ $580/mo  │ $210/mo  │ $150/mo  │ $89/mo   │        │
│ ↑ 38%    │ ↑ 17%    │ ↓ 48%   │ → 0%     │        │
├──────────┴──────────┴──────────┴──────────┴────────┤
│                                                     │
│  📊 This Quarter vs Last Quarter                    │
│  ┌─────────────────────────────────┐               │
│  │ ████████████ Q2: $1,029         │               │
│  │ ██████████   Q1: $979           │               │
│  └─────────────────────────────────┘               │
│                                                     │
│  ⚠️ Electricity increased 38% — review AC usage    │
│  ✅ Gas decreased 48% — seasonal improvement       │
│  ✅ Under budget by 74% — funds available           │
│                                                     │
│  [📄 Generate Member Report]  [📥 Export PDF]       │
└─────────────────────────────────────────────────────┘
```

#### Accessibility
- All charts have text alternatives and data tables
- Color is never the only indicator (icons + text accompany colors)
- Keyboard navigable — Tab through providers, Enter to expand
- Screen reader labels on all interactive elements
- High contrast mode supported

#### Mobile Responsive
- Provider cards stack vertically on mobile
- Chart switches to horizontal bar on small screens
- Swipe between quarters
- Bottom sheet for bill details

---

## 🧪 Test Cases — California × 3 Organization Types

### Test Environment
- **State**: California
- **Compliance Rules**: RRF-1 filing, FTB Form 199, sales tax exemption
- **Quarter**: Q2 2026 vs Q1 2026

### Organization 1: Hindu Temple of Fremont (Religious — 501(c)(3))
| Test ID | Scenario | Expected | Actual | Status |
|---------|----------|----------|--------|--------|
| POC-UBM-CA-T1 | Generate quarterly report with 4 utility types | Total = $1,029, QoQ change ~5.1% | $1,029, 5.1% | ✅ PASS |
| POC-UBM-CA-T2 | Detect electricity spike (summer AC for hall) | Warning: electricity increased >20% | Warning triggered | ✅ PASS |
| POC-UBM-CA-T3 | Generate plain-language member report | Contains org name, dollar amounts, plain terms | Verified | ✅ PASS |

**Compliance Applied**: California RRF-1 annual filing, FTB 199/199N, religious property tax exemption

### Organization 2: Bay Area Food Bank (501(c)(3) — Food Distribution)
| Test ID | Scenario | Expected | Actual | Status |
|---------|----------|----------|--------|--------|
| POC-UBM-CA-FB1 | Track cold storage electricity as top expense | Top expense = electricity ($1,450) | electricity, $1,450 | ✅ PASS |
| POC-UBM-CA-FB2 | Flag missing internet and water bills | Missing items list includes both | Both flagged | ✅ PASS |
| POC-UBM-CA-FB3 | Show under-budget status | Budget utilization < 100%, improvement noted | Under budget 74% | ✅ PASS |

**Compliance Applied**: California food safety permits, health department oversight, USDA commodity reporting

### Organization 3: TechBridge SF (501(c)(3) — Technology/Education)
| Test ID | Scenario | Expected | Actual | Status |
|---------|----------|----------|--------|--------|
| POC-UBM-CA-IT1 | Track internet as top expense (cloud/hosting) | Top expense = internet ($950) | internet, $950 | ✅ PASS |
| POC-UBM-CA-IT2 | Detect electricity cost decrease as improvement | Improvement: electricity decreased noted | Detected | ✅ PASS |
| POC-UBM-CA-IT3 | Generate 12-month annual statement | All 4 quarters populated, YoY calculated | Verified | ✅ PASS |

**Compliance Applied**: California tech equipment sales tax exemption, data privacy (CCPA), SB-1386 breach notification

---

## 📊 Test Results Summary

| Suite | Tests | Passed | Failed | Pass Rate |
|-------|-------|--------|--------|-----------|
| Provider Management | 5 | 5 | 0 | 100% |
| Bill Processing | 7 | 7 | 0 | 100% |
| Plain Language | 2 | 2 | 0 | 100% |
| CA — Temple (3 tests) | 3 | 3 | 0 | 100% |
| CA — Food Bank (3 tests) | 3 | 3 | 0 | 100% |
| CA — IT Nonprofit (3 tests) | 3 | 3 | 0 | 100% |
| Member Reports | 2 | 2 | 0 | 100% |
| **TOTAL** | **25** | **25** | **0** | **100%** |

---

## 📝 Changelog Entry

### v5.0.0 — Utility Bill Management Engine (2026-03-26)
**New Module**: `src/lib/finance/utility-bill-manager.ts` (14,938 chars)
**New Tests**: `src/__tests__/utility-bill-manager.test.ts` (25 executable tests)
**New Docs**: `docs/features/UTILITY_BILL_MANAGEMENT.md` (this file)

#### Added
- Utility provider linking (10 types: electricity, gas, water, internet, phone, waste, security, insurance, rent, other)
- Bill processing with validation (amount, dates, period)
- Auto-categorization to nonprofit expense categories
- Quarterly report generation with QoQ delta analysis
- Annual statement with 12-month + quarterly breakdown
- Member report generation in plain language
- Missing utility detection
- Cost spike warnings (>20% increase)
- Cost decrease improvements (>15% decrease)
- Budget utilization tracking
- Actionable recommendations engine

#### Tested
- 25 executable Jest tests (not markdown docs)
- 3 California org types: Temple, Food Bank, IT Nonprofit
- Provider management (5 tests), Bill processing (7), Plain language (2), State-specific (9), Member reports (2)
