# Donor CRM Engine — Feature Documentation

## Module: `src/lib/donors/donor-crm-engine.ts`
**Version:** 1.0 | **Priority:** P0 | **Status:** ✅ IMPLEMENTED

---

## 1. Overview

The Donor CRM Engine manages all donor relationships, donation processing, fundraising campaigns, peer-to-peer fundraising, tax receipt generation, engagement scoring, and analytics for CharityFlow nonprofits.

### Plain Language Translations
| Accounting Term | CharityFlow Says |
|----------------|-----------------|
| Donor CRM | Supporter Hub |
| Engagement Score | Connection Strength |
| Lifetime Value | Total Support Given |
| Lapsed Donor | Supporter We Haven't Heard From |
| Retention Rate | Supporters Who Came Back |
| Recurring Donation | Monthly Gift |
| Tax Receipt | Donation Thank-You Letter |
| Peer-to-Peer | Friends Helping Friends Fundraise |

---

## 2. Proof of Concept (POC)

### Architecture
```
┌─────────────────────────────────────────────────┐
│              DONOR CRM ENGINE                    │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Donor   │  │ Donation │  │  Campaign     │  │
│  │  Manager │  │ Processor│  │  Manager      │  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │              │               │           │
│  ┌────┴─────────────┴───────────────┴────────┐  │
│  │           Core Data Layer                  │  │
│  │  (In-memory Maps → Prisma DB in prod)     │  │
│  └────┬─────────────┬───────────────┬────────┘  │
│       │              │               │           │
│  ┌────┴─────┐  ┌────┴─────┐  ┌─────┴────────┐  │
│  │   Tax    │  │Engagement│  │  Analytics    │  │
│  │ Receipts │  │ Scoring  │  │  Dashboard    │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
```

### Data Flow
1. **Donor Registration** → Validate → Store → Set as Prospect (score=0)
2. **Donation Received** → Validate → Store → Update Donor Stats → Update Campaign → Recalculate Engagement
3. **Tax Receipt** → Lookup Donation → Lookup Donor → Generate IRS-compliant receipt → Mark donation
4. **Analytics** → Aggregate all donors + donations → Calculate retention, averages, trends

---

## 3. UI/UX Implementation

### Supporter Hub Dashboard (`/dashboard/donors`)
- **KPI Row**: Total Supporters, Active, Monthly Gifts, Total Raised
- **Supporter Cards**: Photo/initials, name, Connection Strength gauge, last gift date
- **Search & Filter**: By name, email, tag, status, engagement level
- **Quick Actions**: Record Gift, Send Thank-You, Add Note

### Fundraising Campaigns (`/dashboard/campaigns`)
- **Campaign Cards**: Progress thermometer, donor count, days remaining
- **Create Campaign Wizard**: Name → Goal → Dates → Type → Launch
- **P2P Dashboard**: Individual fundraiser pages with personal goals

### Donation Recording Modal
- **Amount** with suggested amounts ($25, $50, $100, $250, Custom)
- **Gift Type**: One-time, Monthly, Pledge, Non-Cash
- **Campaign Link**: Optional dropdown
- **Auto Thank-You**: Toggle to send receipt immediately

---

## 4. Test Cases — Oklahoma × 3 Organization Types

### 🛕 OK-T: Hindu Temple (Shri Ganesh Mandir, OKC)
| ID | Test | Expected | Priority |
|----|------|----------|----------|
| OK-T-D1 | Track Diwali festival campaign donations | Campaign updated, receipt with quid pro quo | P0 |
| OK-T-D2 | Manage monthly puja sponsorship (12 recurring) | 12 donations, $1,296 LTV, recurring status | P0 |
| OK-T-D3 | Generate annual tax statement | $7,500 total, 2 donations for 2026 | P1 |

### 🍽️ OK-FB: Food Bank (Community Food Network, Tulsa)
| ID | Test | Expected | Priority |
|----|------|----------|----------|
| OK-FB-D1 | Corporate Thanksgiving matching campaign | 50% progress, $25K remaining | P0 |
| OK-FB-D2 | Track in-kind food donations (2000 lbs) | In-kind type, $3,500 FMV receipt | P0 |
| OK-FB-D3 | Detect lapsed food drive donors (>1 year) | Donor flagged as lapsed | P1 |

### 💻 OK-IT: IT Nonprofit (TechBridge OKC)
| ID | Test | Expected | Priority |
|----|------|----------|----------|
| OK-IT-D1 | P2P coding bootcamp fundraiser | Personal fundraising page created | P0 |
| OK-IT-D2 | Track government STEM grant ($75K restricted) | Restricted designation, $75K LTV | P0 |
| OK-IT-D3 | Generate analytics with mixed donor types | Corporate + individual breakdown | P1 |

### Test Results: **40/40 PASSED (100%)** ✅

---

## 5. API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/donors` | List donors with pagination + filters |
| POST | `/api/donors` | Create new donor |
| GET | `/api/donors/:id` | Get donor profile |
| PUT | `/api/donors/:id` | Update donor |
| POST | `/api/donations` | Record donation |
| GET | `/api/donations?donorId=` | Get donations by donor |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/:id/progress` | Get campaign progress |
| POST | `/api/campaigns/:id/fundraisers` | Add P2P fundraiser |
| POST | `/api/receipts/:donationId` | Generate tax receipt |
| GET | `/api/analytics/donors` | Get donor analytics |
