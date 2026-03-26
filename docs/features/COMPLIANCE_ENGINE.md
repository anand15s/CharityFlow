# COMPLIANCE ENGINE (Main Logic) — Module 14

## Status: COMPLETE ✅
**Priority:** P0 | **Version:** 1.0 | **Date:** 2026-03-26

## Overview
The Compliance Engine main logic ties together all 7 state data files (California, Texas, New York, Florida, Illinois, Oklahoma, Federal) into a unified rule engine that generates personalized compliance roadmaps for any nonprofit.

## Engine Capabilities (8 functions)

| Function | What It Does |
|----------|-------------|
| `determineForm990Version()` | Auto-selects 990-N / 990-EZ / 990 based on gross receipts and total assets |
| `calculateFilingFee()` | State-specific fee by revenue tier across all 6 states |
| `determineAuditRequirement()` | Checks state audit thresholds (financial review vs CPA audit) |
| `isReligiousExempt()` | Checks religious exemption with statute citation per state |
| `getRecentLawUpdates()` | Returns latest legislative changes by state or all states |
| `calculateComplianceHealthScore()` | Weighted 0-100 score across 5 categories with letter grade |
| `generateComplianceRoadmap()` | Full personalized roadmap with items, quarterly schedule, health score |
| `translateToPlainLanguage()` | 18+ compliance terms translated (e.g., "UBIT" → "Tax on Side Business Income") |

## POC Architecture

```
User Signup → Location Detection → State Rules Loaded → Compliance Roadmap Generated
                                        ↓
                                  Health Score (0-100)
                                  Quarterly Schedule
                                  Filing Deadlines
                                  Fee Calculations
                                  Audit Requirements
                                  Religious Exemptions
                                  Law Update Alerts
```

## UI/UX Implementation

### Dashboard: Compliance Co-Pilot (`/dashboard/compliance`)
- **Health Score Gauge** — Large circular gauge (0-100) with color coding (green/yellow/red)
- **Compliance Roadmap** — Timeline view with items sorted by priority and deadline
- **Quarterly Calendar** — Visual Q1-Q4 milestone tracker
- **Law Alerts** — Banner notifications for high-impact legislative changes
- **State Info Card** — Shows detected state, registration status, filing requirements

### Plain Language
All compliance terms use plain language translations:
- "Form 990" → "Annual Tax Report"
- "UBIT" → "Tax on Side Business Income"
- "Compliance Health Score" → "How Well You're Following the Rules (0-100)"

## Test Results — Oklahoma × 3 Org Types

### 🛕 Tulsa Hindu Temple (Religious, $150K budget)
- Form 990 version: 990-EZ ✅
- Religious exemption: Exempt from solicitation registration (§552.2) ✅
- Filing fee: Exempt ✅
- Audit: Not required ✅
- Roadmap: Fewer state items due to religious exemptions ✅

### 🍽️ Oklahoma City Community Food Bank (Charitable, $420K budget)
- Form 990 version: 990 (over $200K receipts) ✅
- Registration: Required with AG ✅
- Filing fee: $15 ✅
- UBIT: Form 990-T required ($5K UBI) ✅
- Audit: Not required (under $500K) ✅
- Roadmap: Most complex — includes state registration + annual filing + UBIT + law updates ✅

### 💻 OKC Digital Bridge (Educational, $85K budget)
- Form 990 version: 990-EZ ✅
- Religious exemption: Not applicable ✅
- Filing fee: $15 ✅
- Audit: Not required (under $500K) ✅
- Roadmap: Standard compliance items ✅

## Files
- `src/lib/compliance/compliance-engine.ts` — Production engine (~22 KB)
- `src/__tests__/compliance-main-engine.test.ts` — 48 executable tests
- `docs/features/COMPLIANCE_ENGINE.md` — This document
