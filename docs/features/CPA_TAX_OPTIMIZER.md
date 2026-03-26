# CPA Tax Optimization Engine

## Module: `src/lib/tax/cpa-tax-optimizer.ts`
**Version:** 1.0.0 | **Priority:** P0 | **Status:** ✅ Complete

---

## Overview
The CPA Tax Optimization Engine provides enterprise-grade tax analysis for nonprofits, proactively protecting tax-exempt status, tracking UBIT, analyzing lobbying compliance, optimizing functional expense ratios, maximizing donor tax benefits, and monitoring public support tests.

## Sub-Modules (8)

| # | Sub-Module | What It Does |
|---|-----------|-------------|
| 1 | Tax-Exempt Status Guardian | Monitors activities that could jeopardize 501(c)(3) status — private benefit, political activity, excessive compensation |
| 2 | UBIT Tracker | Identifies unrelated business income, calculates liability, determines Form 990-T requirement |
| 3 | Lobbying Compliance Analyzer | Tracks lobbying vs substantial part test or 501(h) election limits |
| 4 | Functional Expense Optimizer | Auto-allocates Program/Admin/Fundraising, grades against Charity Navigator benchmarks |
| 5 | Donor Tax Benefit Maximizer | IRS-compliant acknowledgments, quid pro quo, appraisal requirements, Schedule M |
| 6 | Public Support Test Monitor | Tracks 509(a)(1) public support percentage, flags danger zone |
| 7 | Worker Classification Wizard | Employee vs contractor analysis using multi-factor weighted scoring |
| 8 | Executive Compensation Analyzer | Reasonableness analysis against benchmarks, IRC §4958 compliance |

## POC — Proof of Concept

### Architecture
```
User Input (org profile, transactions, activities)
    │
    ▼
┌──────────────────────────────────┐
│   CPA Tax Optimization Engine     │
│                                   │
│  ┌─────────────┐ ┌─────────────┐ │
│  │ Status      │ │ UBIT        │ │
│  │ Guardian    │ │ Tracker     │ │
│  └─────────────┘ └─────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ │
│  │ Lobbying    │ │ Functional  │ │
│  │ Analyzer    │ │ Expenses    │ │
│  └─────────────┘ └─────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ │
│  │ Donor       │ │ Public      │ │
│  │ Benefits    │ │ Support     │ │
│  └─────────────┘ └─────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ │
│  │ Worker      │ │ Exec Comp   │ │
│  │ Classifier  │ │ Analyzer    │ │
│  └─────────────┘ └─────────────┘ │
│           │                       │
│           ▼                       │
│  ┌─────────────────────────────┐ │
│  │ Tax Health Report Generator │ │
│  │ (Score, Grade, Alerts,     │ │
│  │  Recommendations)          │ │
│  └─────────────────────────────┘ │
└──────────────────────────────────┘
```

## UI/UX Implementation

### Dashboard: `/dashboard/tax-optimizer`
- **Tax Health Score Gauge** — Animated 0-100 circular gauge (green/yellow/red)
- **Alert Cards** — Critical (red), Warning (amber), Info (blue) with plain language descriptions
- **UBIT Tracker Panel** — Side business income table with estimated tax
- **Functional Expense Donut Chart** — Program vs Admin vs Fundraising with Charity Navigator benchmarks
- **Public Support Timeline** — Multi-year trend line with 33.33% threshold marker
- **Donor Benefit Calculator** — Input donation details, get instant deductibility calculation
- **Worker Classification Wizard** — Step-by-step questionnaire with confidence meter

## Test Cases — Oklahoma × 3 Org Types

### 🛕 OK-T1: Tulsa Hindu Temple ($120K budget)
| Test | Expected | Result |
|------|----------|--------|
| Temple gift shop UBIT (religious items) | No UBIT — substantially related | ✅ PASS |
| Functional expenses (80% program) | Grade A | ✅ PASS |
| Public support from congregation (>70%) | Public charity confirmed | ✅ PASS |

### 🍽️ OK-FB1: OKC Community Food Bank ($280K budget)
| Test | Expected | Result |
|------|----------|--------|
| Catering side business UBIT | UBIT detected, Form 990-T required | ✅ PASS |
| In-kind donation from grocery chain ($45K) | Schedule M + appraisal required | ✅ PASS |
| Delivery driver classification | Employee (uses org truck, set schedule) | ✅ PASS |

### 💻 OK-IT1: Norman Digital Bridge ($85K budget)
| Test | Expected | Result |
|------|----------|--------|
| Executive Director comp ($45K) | Reasonable — within benchmark | ✅ PASS |
| Lobbying for digital equity legislation | Within limits (<5%) | ✅ PASS |
| Full optimization report | Health score ≥70, Grade A or B, 0 critical alerts | ✅ PASS |

## Test Summary
| Suite | Tests | Passed |
|-------|-------|--------|
| Exempt Status Guardian | 4 | 4 ✅ |
| UBIT Tracker | 4 | 4 ✅ |
| Lobbying Compliance | 3 | 3 ✅ |
| Functional Expenses | 3 | 3 ✅ |
| Donor Tax Benefits | 5 | 5 ✅ |
| Public Support Test | 2 | 2 ✅ |
| Worker Classification | 3 | 3 ✅ |
| Executive Compensation | 2 | 2 ✅ |
| Report Generation | 1 | 1 ✅ |
| Plain Language | 3 | 3 ✅ |
| Oklahoma × 3 Orgs | 9 | 9 ✅ |
| **TOTAL** | **42** | **42 ✅** |
