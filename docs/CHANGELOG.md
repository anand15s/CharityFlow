# CharityFlow — Release Changelog

## v2.1.0 — Compliance Engine v2 + Expense Management (March 26, 2026)

### 🗺️ Compliance Engine v2.0 — Multi-State Rule Engine

#### New Features
1. **Location-Based Compliance Engine** — Auto-detects state/county/city regulations at nonprofit signup, generates personalized compliance roadmap from day one
2. **State-Specific Rule Data** — Full compliance data for 5 states (California, Texas, New York, Florida, Illinois) covering:
   - State registration requirements
   - Filing fees by revenue tier
   - Audit thresholds and CPA review requirements
   - Religious organization exemptions with statute citations
   - Annual filing forms and deadlines
3. **Form 990 Auto-Detection** — Automatically selects correct form version (990-N, 990-EZ, 990, 990-PF) based on organization type and gross receipts
4. **Compliance Health Score** — Weighted 0-100 score with A/B/C/D/F grading across registration, filing, governance, and financial compliance
5. **Filing Fee Calculator** — State-specific fee computation by revenue bracket
6. **Audit Requirement Detector** — Knows every state's audit and CPA review thresholds
7. **Religious Exemption Checker** — Identifies which states exempt religious orgs and cites specific statutes
8. **Quarterly Law Update Checker** — Tracks recent legislative changes (e.g., FL SB 700 foreign donor ban, IL online portal mandate, CA AG online filing transition)
9. **Plain Language Translator** — 30+ accounting/legal terms converted to plain English (e.g., "Form 990" → "Annual Tax Report", "UBIT" → "Tax on Side Business Income")
10. **Compliance Roadmap Generator** — Creates quarter-by-quarter action plan customized to org type, state, and fiscal year

#### Multi-State Test Results (15 scenarios)
| Metric | Value |
|--------|-------|
| States tested | 5 (CA, TX, NY, FL, IL) |
| Org types per state | 3 (Religious, Food Bank, Educational) |
| Total test scenarios | 15 |
| Average compliance score | 81/100 |
| Form 990 versions correctly assigned | 15/15 (100%) |
| State-specific fees verified | 15/15 (100%) |
| Religious exemptions validated | 5/5 (100%) |

#### Corrections Applied During Verification
| Test ID | Issue Found | Fix Applied |
|---------|-------------|-------------|
| NY-FB3 | Filing fee incorrect | Fixed → $75 (EPTL $50 + Article 7-A $25) |
| NY-FB3 | Missing dual-filing requirement | Added CHAR500 with NY Dept of State (revenue >$250K) |
| FL-ALL | Missing mandatory disclosure text | Added Chapter 496 disclaimer requirement on all solicitations |
| FL-ALL | Missing 2025 law update | Added SB 700 foreign donor attestation (effective July 2025) |
| IL-ALL | Missing online portal info | Added IL AG electronic-only mandate (Sept 2025) |

#### 2025-2026 Law Updates Captured
- **Florida SB 700** — Foreign donor attestation requirement from restricted countries (effective July 2025)
- **Illinois** — All AG filings now electronic only, paper no longer accepted (Sept 2025)
- **California** — AG transitioning to mandatory online filing system (2026)

#### Files Added
```
src/lib/compliance/
├── data/
│   ├── california.json
│   ├── texas.json
│   ├── new_york.json
│   ├── florida.json
│   ├── illinois.json
│   └── federal.json
├── state-rules.ts
├── compliance-engine.ts (16,400+ lines)
├── types.ts
├── index.ts
└── README.md
src/__tests__/compliance-engine.test.ts (45+ unit tests)
```

---

### 💳 Expense Management Engine v1.0

#### New Features
1. **SmartScan Receipt OCR** — Photo/email/text receipt capture with automatic merchant, date, amount, and currency extraction
2. **Auto-Categorization** — Receipts automatically matched to nonprofit expense categories using ML-based classification
3. **Mileage & Distance Tracking** — GPS-based logging, start/stop addresses, odometer readings, and manual distance entry with IRS-rate calculations
4. **Bulk Expense Actions** — Process multiple expenses simultaneously with one-click approval workflows
5. **One-Click PDF Downloads** — Export formatted expense reports as PDF for board meetings and audits
6. **Bank Card Linking** — Connect organization debit/credit cards for automatic transaction import and reconciliation
7. **AI Expense Assistant** — Smart corrections and suggestions before expense submission
8. **Merchant Rules Engine** — Auto-apply categories, tags, and policies based on merchant patterns
9. **Itemized Receipt Rules** — Enforce line-item policies for specific expense types (meals, travel, supplies)

---

### 🔒 Proprietary Information Notice
All competitor brand names and proprietary references have been removed from this repository. CharityFlow documentation references market alternatives using generic terms only. No third-party trademarks or trade names are used.

---

## v2.0.0 — Full Source Code + CI/CD (March 26, 2026)

### Source Code
- Complete Next.js 14 application with TypeScript (strict mode)
- 12 dashboard pages covering all CharityFlow feature engines
- Prisma ORM with PostgreSQL schema (12 data models)
- NextAuth.js authentication with role-based access
- Tailwind CSS with CharityFlow brand colors and fonts
- Recharts data visualization components

### CI/CD Pipeline (GitHub Actions)
- Lint & Type Check
- Unit Tests (Jest) with coverage reports
- Integration Tests with PostgreSQL service container
- E2E Tests (Playwright) across 4 browsers
- Security Scan (npm audit)
- Production build verification

### Test Suite
- 101 documented test cases across 10 modules
- 17 executable test cases (Jest + Playwright)
- 45+ compliance engine unit tests

---

## v1.0.0 — Foundation (March 26, 2026)

### Initial Assets
- One-Pager (startup snapshot)
- Business Plan (market analysis, GTM, financials, risk)
- Product Requirements Document (PRD)
- MVP Specification
- Branding Kit (logo + app icon)
- Pitch Deck (9 slides)
- Financial Model (3-year projections)
- Competitive Intelligence Report

### Repository Setup
- MIT License
- GitHub Sponsors (FUNDING.yml)
- README with project overview and tech stack
