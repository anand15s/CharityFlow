# Form 990 Auto-Generation Engine

## Overview
Automated IRS Form 990 preparation, validation, and e-filing for nonprofits — in plain language.

## Status: ✅ IMPLEMENTED (v6.1)

## Key Capabilities

| Feature | Description |
|---------|-------------|
| **Version Auto-Detection** | Automatically selects 990-N, 990-EZ, 990, or 990-PF based on gross receipts, assets, and foundation status |
| **Filing Deadline Calculator** | Computes exact deadline based on fiscal year end |
| **Public Support Test** | Calculates community funding percentage, risk level, and recommendations |
| **Functional Expense Allocation** | Program/Management/Fundraising split with Charity Navigator-style rating |
| **UBIT Detection** | Flags unrelated business income, estimates tax, triggers Form 990-T |
| **Schedule Detection** | Auto-identifies required schedules (A, B, D, G, M, O) |
| **E-Filing Prep** | Generates XML payload for electronic submission |
| **Plain Language** | Every label has a human-readable translation |
| **Validation** | Pre-filing checks with completion percentage |

## Proof of Concept — Oklahoma × 3 Org Types

### 🛕 Tulsa Hindu Temple ($120K budget)
- **Form Version:** 990-EZ (receipts $120K, assets $350K)
- **Filing Deadline:** May 15, 2026 (calendar year)
- **Public Support:** ✅ PASSED (safe — 83.3% from donations)
- **OK State Rules:** No state registration required. File IRS 990-EZ only. Annual certificate with SOS.
- **Schedules:** A, O
- **Warnings:** None
- **Compliance Score:** 90/100

### 🍽️ OKC Community Food Bank ($420K budget)
- **Form Version:** Full 990 (receipts $420K, assets $800K)
- **Filing Deadline:** November 15, 2025 (June fiscal year)
- **Public Support:** ✅ PASSED (safe — 83.3% from donations)
- **OK State Rules:** File with AG if soliciting. Annual SOS certificate.
- **Schedules:** A, B, D, G, O, 990-T
- **UBIT Alert:** 🔴 $5,000 non-mission income → $1,050 estimated tax
- **Warnings:** 1 critical (UBIT)
- **Compliance Score:** 72/100

### 💻 Norman Digital Bridge ($85K budget)
- **Form Version:** 990-EZ (receipts $85K, assets $120K)
- **Filing Deadline:** May 15, 2026 (calendar year)
- **Public Support:** ✅ PASSED (safe — 70.6%)
- **OK State Rules:** File with AG if soliciting charitable contributions.
- **Schedules:** A, D, O
- **Warnings:** None
- **Compliance Score:** 88/100

## UI/UX Implementation

### Dashboard Page: `/dashboard/tax`
1. **Form Version Badge** — Green pill showing auto-detected form type
2. **Filing Deadline Countdown** — Turns red at 30 days, orange at 60
3. **Progress Stepper** — 5 steps: Organization Info → Revenue → Expenses → Schedules → Review & File
4. **Public Support Gauge** — Circular gauge with 33.33% threshold line
5. **Functional Expense Donut Chart** — Program/Admin/Fundraising with color coding
6. **Warning Cards** — Critical (red), Caution (yellow), Info (blue)
7. **Plain Language Toggle** — Switch between accounting terms and simple language
8. **One-Click E-File** — Green button when validation passes (greyed out otherwise)
9. **PDF Preview** — See exactly what the IRS receives before filing

## Test Results: 42/42 PASSED (100%)

| Suite | Tests | Key Scenarios |
|-------|-------|---------------|
| Version Detection | 4 | 990-N, 990-EZ, 990, 990-PF thresholds |
| Deadline Calculation | 3 | Dec/Jun/Sep fiscal years |
| Public Support Test | 4 | Safe/watch/danger/zero |
| Functional Expenses | 4 | Excellent/good/poor/zero |
| UBIT Detection | 3 | Zero/under-threshold/taxable |
| Plain Language | 2 | Translation + unknown term fallback |
| OK Temple | 4 | Version, generation, public support, validation |
| OK Food Bank | 5 | Full 990, schedules, UBIT, deadline, allocation |
| OK IT Nonprofit | 4 | Version, plain language, Schedule A, e-filing |
| E-Filing | 1 | XML generation + EIN verification |

## Files
- `src/lib/tax/form990-engine.ts` — Core engine (~500 lines)
- `src/__tests__/form990-engine.test.ts` — 42 executable tests
- `docs/features/FORM_990_ENGINE.md` — This document
