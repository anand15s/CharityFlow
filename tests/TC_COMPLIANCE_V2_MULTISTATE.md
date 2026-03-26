# CharityFlow — Multi-State Compliance Test Cases v2.1
# Module: TC_COMPLIANCE_V2_MULTISTATE
# Version: 2.1 | Date: March 26, 2026
# Coverage: 5 States × 3 Org Types = 15 Scenarios

---

## TC-COMP-001: California Temple Onboarding
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 85/100
**Steps:**
1. Register new org: Hindu Temple of Sacramento, CA
2. Org type: Religious/501(c)(3) | Revenue: $180K
3. Verify compliance roadmap generated
**Laws Applied:** RRF-1 annual filing, FTB Form 199N (under $50K → upgraded to 199 at $180K), SI-100 biennial
**Expected:** 3 state filings identified + partial religious exemption
**Actual:** ✅ All 3 filings + note: "Religious orgs have reduced scrutiny but must still file RRF-1"

## TC-COMP-002: California Food Bank Filing Fees
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 78/100
**Steps:**
1. Register: Bay Area Food Bank, CA | Revenue: $350K
2. Verify fee calculation
**Laws Applied:** RRF-1 ($50 for revenue $100K-$1M), AG registration, FTB Form 199
**Expected:** $50 RRF-1 fee
**Actual:** ✅ $50 calculated + reminder: "Due May 15 for calendar-year filers"

## TC-COMP-003: California IT Support Audit Threshold
**Priority:** P1 | **Status:** ✅ PASS | **Score:** 85/100
**Steps:**
1. Register: TechBridge Nonprofit, CA | Revenue: $480K
2. Check audit requirement
**Laws Applied:** CA audit threshold $2M for CPA audit
**Expected:** No CPA audit required (under $2M)
**Actual:** ✅ "No audit required. CPA review recommended but not mandatory at this revenue level."

## TC-COMP-004: Texas Temple — No Registration
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 92/100
**Steps:**
1. Register: Dallas Hindu Temple, TX | Revenue: $120K
2. Verify zero state filings required
**Laws Applied:** Texas has no charitable solicitation registration (exception: law enforcement/veterans)
**Expected:** 0 state filings
**Actual:** ✅ "Texas does not require state registration for charitable organizations. Federal IRS filings only."

## TC-COMP-005: Texas Food Bank Form 990
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 90/100
**Steps:**
1. Register: Houston Community Food Bank, TX | Revenue: $200K
2. Verify Form 990 version selection
**Laws Applied:** IRS: $200K gross receipts or $500K assets → may file 990-EZ
**Expected:** Form 990-EZ auto-selected
**Actual:** ✅ "Form 990-EZ recommended (gross receipts <$250K and assets <$500K)"

## TC-COMP-006: Texas IT Support Tax Exemption
**Priority:** P1 | **Status:** ✅ PASS | **Score:** 94/100
**Steps:**
1. Register: Austin Tech4Good, TX | Revenue: $90K
2. Verify sales tax exemption guidance
**Laws Applied:** TX Comptroller Form AP-205 for sales/franchise/hotel tax exemption
**Expected:** AP-205 in compliance roadmap
**Actual:** ✅ "Apply for Texas sales tax exemption via Form AP-205 with the Comptroller's office"

## TC-COMP-007: New York Temple Religious Exemption
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 88/100
**Steps:**
1. Register: Brooklyn Orthodox Temple, NY | Revenue: $250K
2. Verify religious exemption from CHAR forms
**Laws Applied:** EPTL §8-1.4 exempts religious orgs from CHAR410/CHAR500
**Expected:** Exempt from CHAR filings
**Actual:** ✅ "Religious organization exempt from CHAR410/CHAR500 per EPTL §8-1.4. IRS filings still required."

## TC-COMP-008: New York Food Bank Dual Filing
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 70/100
**Steps:**
1. Register: Manhattan Food Rescue, NY | Revenue: $300K
2. Verify dual filing requirement + fees
**Laws Applied:** CHAR410 (initial) + CHAR500 (annual) + EPTL registration
**Expected:** 2 annual filings, $75 combined fee
**Actual:** ✅ "$25 EPTL + $50 Article 7-A = $75 total. CHAR500 required annually with Form 990 attached."

## TC-COMP-009: New York IT Support CPA Review
**Priority:** P1 | **Status:** ✅ PASS | **Score:** 80/100
**Steps:**
1. Register: CodeForGood NYC, NY | Revenue: $400K
2. Check CPA review requirement
**Laws Applied:** NY requires CPA review for orgs with $250K-$500K revenue
**Expected:** CPA review flagged
**Actual:** ✅ "CPA review required (revenue $400K falls in $250K-$500K bracket). Full CPA audit required above $500K."

## TC-COMP-010: Florida Temple Solicitation Disclaimer
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 76/100
**Steps:**
1. Register: Orlando Hindu Temple, FL | Revenue: $150K
2. Verify solicitation disclaimer requirement
**Laws Applied:** FL Chapter 496 — mandatory disclosure on ALL solicitation materials
**Expected:** Full disclaimer text generated
**Actual:** ✅ Generated: "A COPY OF THE OFFICIAL REGISTRATION AND FINANCIAL INFORMATION MAY BE OBTAINED FROM THE DIVISION OF CONSUMER SERVICES BY CALLING TOLL-FREE (800-435-7352). REGISTRATION DOES NOT IMPLY ENDORSEMENT, APPROVAL, OR RECOMMENDATION BY THE STATE."

## TC-COMP-011: Florida Food Bank SB 700
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 68/100
**Steps:**
1. Register: Tampa Bay Food Bank, FL | Revenue: $400K
2. Verify SB 700 foreign donor attestation
**Laws Applied:** SB 700 (effective July 1, 2025) — foreign donor ban attestation
**Expected:** Attestation requirement flagged
**Actual:** ✅ "NEW (2025): Must attest that organization does not knowingly accept donations from China, Russia, Iran, North Korea, Cuba, Venezuela, or Syria per SB 700."

## TC-COMP-012: Florida IT Support Registration Fees
**Priority:** P1 | **Status:** ✅ PASS | **Score:** 74/100
**Steps:**
1. Register: TechHelp Florida, FL | Revenue: $280K
2. Verify registration fee calculation
**Laws Applied:** FL Chapter 496 — annual registration, fees $10-$400 by revenue tier
**Expected:** Correct fee for $280K revenue
**Actual:** ✅ "$75 annual registration fee (revenue $200K-$500K tier)"

## TC-COMP-013: Illinois Temple AG Registration
**Priority:** P0 | **Status:** ✅ PASS | **Score:** 80/100
**Steps:**
1. Register: Chicago Buddhist Temple, IL | Revenue: $200K
2. Verify AG registration (no religious exemption in IL)
**Laws Applied:** IL Charitable Trust Act — NO religious exemption
**Expected:** Registration required
**Actual:** ✅ "Illinois requires ALL charitable organizations to register with the Attorney General, including religious organizations. File AG 990-IL + $15 fee."

## TC-COMP-014: Illinois Food Bank Online Portal
**Priority:** P1 | **Status:** ✅ PASS | **Score:** 70/100
**Steps:**
1. Register: Springfield Community Pantry, IL | Revenue: $320K
2. Verify online portal filing requirement
**Laws Applied:** IL AG launched mandatory online filing September 2025
**Expected:** Online portal instruction provided
**Actual:** ✅ "NEW (Sept 2025): All IL AG filings must be submitted electronically via the new online portal. Paper filings no longer accepted."

## TC-COMP-015: Illinois IT Support CPA Review
**Priority:** P1 | **Status:** ✅ PASS | **Score:** 82/100
**Steps:**
1. Register: Digital Bridges IL, IL | Revenue: $350K
2. Check CPA review requirement
**Laws Applied:** IL requires CPA review at $300K revenue threshold
**Expected:** CPA review required
**Actual:** ✅ "CPA review required (revenue $350K exceeds $300K threshold). Full CPA audit required above $500K."
