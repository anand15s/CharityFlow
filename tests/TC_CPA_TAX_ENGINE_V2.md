# CharityFlow — CPA Tax Optimization Engine Test Cases
# Module: TC_CPA_TAX_ENGINE_V2
# Version: 2.1 | Date: March 26, 2026

---

## TC-TAX-001: 501(c)(3) Status Guardian
**Priority:** P0 | **Status:** ✅ PASS
**Precondition:** Organization with public support data loaded
**Steps:**
1. Set public support ratio to 28% (danger zone <33%)
2. Navigate to Tax Center → Status Guardian
3. Verify red alert displayed with remediation steps
**Expected:** Red alert + actionable remediation plan
**Actual:** Alert triggered with 5-step remediation plan including:
  - Increase public fundraising campaigns
  - Diversify donor base (reduce major donor concentration)
  - Apply for advance ruling extension
  - Document unusual grant circumstances
  - Schedule CPA consultation

## TC-TAX-002: UBIT Detection
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Add $5,000 in unrelated business income (merchandise sales)
2. Navigate to Tax Center → UBIT Tracker
3. Verify Form 990-T requirement flagged + liability estimated
**Expected:** 990-T flagged, liability calculated
**Actual:** $1,050 estimated liability (21% corporate rate), Form 990-T auto-generated

## TC-TAX-003: Donor Tax Receipt (Quid Pro Quo)
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Record $5,000 donation at gala dinner
2. Set dinner fair market value at $200
3. Generate donor tax receipt
**Expected:** Receipt shows $4,800 deductible amount
**Actual:** IRS-compliant receipt: "Your contribution of $5,000 less $200 fair market value of dinner = $4,800 tax-deductible"

## TC-TAX-004: In-Kind Donation >$5K
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Log $8,000 equipment donation (used computers)
2. Verify appraisal requirement notification
3. Verify Schedule M auto-population
**Expected:** Appraisal flagged + Schedule M populated
**Actual:** Warning: "IRS requires qualified appraisal for non-cash gifts >$5,000" + Schedule M line items pre-filled

## TC-TAX-005: Functional Expense Ratio Analysis
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Load budget: 55% program, 25% admin, 20% fundraising
2. Navigate to Tax Center → Expense Optimizer
3. Verify benchmark comparison
**Expected:** Warning that program ratio below 65% benchmark
**Actual:** Yellow alert: "Program spending at 55% — below 65% recommended benchmark. Current rating: Below Average"

## TC-TAX-006: Worker Classification Wizard
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Add worker: 40hrs/week, on-site, uses org equipment, 12-month engagement
2. Run classification wizard
3. Verify misclassification risk assessment
**Expected:** High misclassification risk warning
**Actual:** "HIGH RISK: This worker likely qualifies as an employee under IRS 20-factor test. 14/20 factors indicate employee status."

## TC-TAX-007: Sales Tax Exemption Renewal
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Set state sales tax exemption expiring April 25, 2026
2. Verify reminder schedule
**Expected:** Escalating reminders at 30/14/7/1 days
**Actual:** All 4 reminders scheduled + renewal form link provided

## TC-TAX-008: Form 990 Version Auto-Selection
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Test 4 scenarios:
   a. $45K gross receipts → 990-N
   b. $180K gross receipts → 990-EZ
   c. $350K gross receipts → Full 990
   d. Private foundation → 990-PF
**Expected:** Correct form version for each
**Actual:** All 4 correctly selected ✅

## TC-TAX-009: Lobbying Limit Monitor
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Log lobbying expenses totaling 18% of total expenditures
2. Navigate to Tax Center → Status Guardian
3. Verify warning level
**Expected:** Yellow warning at 15%+ (red at 20%)
**Actual:** "CAUTION: Lobbying at 18% of expenditures. Limit is 20% under §501(h) election. Consider reducing or filing Form 5768."

## TC-TAX-010: Year-End Tax Planning Dashboard
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Set system date to December 1
2. Navigate to Tax Center → Year-End Planning
3. Verify checklist generated
**Expected:** Comprehensive checklist with missing docs highlighted
**Actual:** 18-item checklist generated:
  - ✅ Bank reconciliation current
  - ⚠️ 3 missing W-9 forms from contractors
  - ❌ Board minutes not uploaded for Q3
  - ✅ Donor receipts sent for gifts >$250
  - ⚠️ Functional expense allocation needs review
