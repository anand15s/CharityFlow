# CharityFlow — Donor CRM & Fundraising Test Cases
# Module: TC_DONOR_CRM_V2
# Version: 2.1 | Date: March 26, 2026

---

## TC-DONOR-001: Donor Profile Creation
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Add new donor: Jane Smith, jane@example.com
2. Record 3 past gifts ($500, $1000, $250)
3. Verify profile shows lifetime giving total
**Expected:** Profile created with $1,750 lifetime total
**Actual:** Profile displays: "Lifetime Giving: $1,750 | Avg Gift: $583 | Giving Frequency: Occasional"

## TC-DONOR-002: Campaign Progress Thermometer
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Create "Spring Gala Fund" campaign with $10,000 goal
2. Add donations totaling $3,500
3. Verify progress visualization
**Expected:** 35% progress displayed
**Actual:** Thermometer at 35% with "35% funded — $6,500 to go" label

## TC-DONOR-003: Peer-to-Peer Fundraising Page
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Supporter creates personal fundraising page for the Spring Gala
2. Verify unique URL generated
3. Verify donations roll up to parent campaign
**Expected:** Unique URL linked to parent campaign
**Actual:** URL: charityflow.org/p2p/spring-gala/jane-smith | Parent campaign total updated in real-time

## TC-DONOR-004: Auto Thank-You Email
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Process $500 online donation
2. Measure time to thank-you email delivery
3. Verify IRS-compliant receipt included
**Expected:** Email sent within 60 seconds
**Actual:** 42 seconds | Receipt includes: org name, EIN, date, amount, goods/services statement

## TC-DONOR-005: Gift Matching
**Priority:** P2 | **Status:** ✅ PASS
**Steps:**
1. $500 donation from employee of matching-eligible company
2. System detects employer match program
3. Verify $1,000 total recorded + employer notification
**Expected:** Match detected and recorded
**Actual:** "Gift Match Found: Employer matches 1:1 up to $1,000/year. Total recorded: $1,000"

## TC-DONOR-006: Recurring Donation Setup
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Donor sets up $50/month recurring donation
2. Verify auto-charge scheduled
3. Verify annual summary receipt generation (Dec 31)
**Expected:** Auto-charge + annual receipt
**Actual:** Monthly charges scheduled, annual summary receipt auto-generated showing $600 total

## TC-DONOR-007: DAF Contribution Handling
**Priority:** P2 | **Status:** ✅ PASS
**Steps:**
1. Log contribution from Donor Advised Fund
2. Generate acknowledgment letter
3. Verify no goods/services statement (DAF-specific)
**Expected:** Correct DAF acknowledgment format
**Actual:** Acknowledgment correctly excludes goods/services language per IRS DAF guidelines

## TC-DONOR-008: Donor Retention Report
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Load 100 donors from previous fiscal year
2. 72 donors gave again in current year
3. Generate retention report
**Expected:** 72% retention rate
**Actual:** "Donor Retention Rate: 72% (72/100) | National avg: 43% | Rating: Excellent"
