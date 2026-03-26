# CharityFlow Compliance Engine v2.0

## Overview
Location-based compliance engine that auto-detects state/county/city regulations at signup and provides a personalized compliance roadmap with deadline tracking and a Compliance Health Score.

## Supported States (v2.0)
| State | Registration | Religious Exempt | Online Filing |
|-------|-------------|-----------------|---------------|
| California | Required (RRF-1) | Partial | 2026 (mandatory) |
| Texas | Not required | All exempt | N/A |
| New York | Required (CHAR410/500) | Yes (EPTL §8-1.4) | Available |
| Florida | Required (Ch. 496) | Not exempt | Available |
| Illinois | Required (AG 990-IL) | Not exempt | 2025 (mandatory) |

## Key Features
- **Form 990 Auto-Detection**: Determines correct version (990-N, 990-EZ, 990, 990-PF) based on org size
- **Filing Fee Calculator**: State-specific fee schedules based on revenue
- **Audit Requirement Detector**: Knows each state's audit thresholds
- **Religious Exemption Check**: Identifies which states exempt religious orgs
- **Compliance Health Score**: 0-100 weighted score across all requirements
- **Plain Language Translation**: Converts legal jargon to human-friendly terms
- **Law Update Alerts**: Tracks recent legislative changes (e.g., FL SB 700 Foreign Donor Ban)
- **Quarterly Update System**: Pulls latest law changes every quarter

## Data Sources
- IRS.gov (Form 990 instructions, Publication 557)
- State Attorney General offices (CA, NY, IL)
- State Comptroller/DOR (TX, FL)
- Secretary of State corporate filings
- Legislative tracking (TrackBill, LegiScan)

## Test Coverage
- 15 test organizations (5 states × 3 org types)
- 45+ unit test cases covering all engine functions
- Org types: Religious (temples/churches), Food Banks, Educational (IT/tech nonprofits)

## Usage
```typescript
import {
  generateComplianceRoadmap,
  determineForm990Version,
  calculateFilingFee,
  getRecentLawUpdates,
} from "@/lib/compliance";

// Generate full roadmap for an organization
const roadmap = generateComplianceRoadmap({
  name: "My Nonprofit",
  state: "California",
  orgType: "charitable",
  grossReceipts: 350000,
  // ... other fields
});

// Check recent law changes
const alerts = getRecentLawUpdates("US-FL");
// Returns: FL SB 700 Foreign Donor Ban (critical), etc.
```
