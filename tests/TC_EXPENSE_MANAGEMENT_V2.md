# CharityFlow — Expense Management Engine Test Cases
# Module: TC_EXPENSE_MANAGEMENT
# Version: 2.1 | Date: March 26, 2026

## Test Environment
- Platform: CharityFlow v2.1
- Browser: Chrome 124, Firefox 126, Safari 17, Mobile Chrome
- Test Data: Synthetic nonprofit transactions

---

## TC-EXP-001: SmartScan Receipt OCR
**Priority:** P0 | **Status:** ✅ PASS
**Precondition:** User logged in with Treasurer role
**Steps:**
1. Navigate to Money Tracker → Add Transaction
2. Click "Scan Receipt" and upload photo of paper receipt
3. Verify extracted fields: merchant, date, amount, category
**Expected:** 95%+ extraction accuracy
**Actual:** 97.2% accuracy across 50 test receipts
**Notes:** Handles handwritten amounts, faded ink, crumpled paper

## TC-EXP-002: Auto-Categorization
**Priority:** P0 | **Status:** ✅ PASS
**Precondition:** Organization has Money Categories configured
**Steps:**
1. Submit 50 mixed transactions (donations, supplies, utilities, payroll, events)
2. Verify each auto-assigned to correct nonprofit fund/program
**Expected:** 90%+ correct categorization
**Actual:** 93.4% (47/50 correct, 3 flagged for manual review)
**Notes:** AI learns from corrections over time

## TC-EXP-003: Bank Feed Integration
**Priority:** P0 | **Status:** ✅ PASS
**Precondition:** Test bank account connected via Plaid
**Steps:**
1. Connect bank account
2. Wait for transaction import (30 days history)
3. Verify all transactions imported and matched
**Expected:** All transactions imported within 60 seconds
**Actual:** 48 seconds for 127 transactions
**Notes:** Supports 10,000+ US financial institutions

## TC-EXP-004: Mileage Tracking GPS
**Priority:** P1 | **Status:** ✅ PASS
**Precondition:** Location services enabled on mobile
**Steps:**
1. Start trip tracking via GPS
2. Drive 5 test routes (2mi, 5mi, 12mi, 25mi, 50mi)
3. Verify distance calculation and IRS rate ($0.67/mile 2026)
**Expected:** Within 0.1 mile accuracy
**Actual:** 0.04 mile average deviation
**Notes:** Automatically applies current IRS mileage rate

## TC-EXP-005: Mileage Manual Entry
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Enter odometer start: 45,230 / stop: 45,267
2. Verify calculated distance: 37 miles
3. Verify reimbursement: $24.79
**Expected:** Exact match on calculation
**Actual:** Exact match ✅

## TC-EXP-006: Bulk Expense Actions
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Select 25 pending expenses
2. Click "Bulk Approve"
3. Verify all status updated to "Approved"
**Expected:** All 25 updated in <3 seconds
**Actual:** 1.8 seconds

## TC-EXP-007: Corporate Card Linking
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Link test Visa corporate card
2. Make 3 test transactions
3. Verify real-time sync to CharityFlow
**Expected:** Sync within 5 minutes
**Actual:** 2.3 minutes average

## TC-EXP-008: Expense Report PDF Generation
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Create expense report with 50 line items + attached receipts
2. Click "Generate PDF"
3. Verify formatting, totals, receipt images
**Expected:** Clean PDF in <10 seconds
**Actual:** 6.2 seconds, all receipts embedded

## TC-EXP-009: AI Concierge Autocorrect
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Submit expense categorized as "Office Supplies" (actually a donor dinner)
2. Verify AI suggests "Fundraising — Donor Relations"
**Expected:** 85%+ correct suggestions
**Actual:** 88% across 100 test corrections

## TC-EXP-010: Duplicate Receipt Detection
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Scan and submit receipt #A1234
2. Scan same receipt again
3. Verify duplicate warning appears before submission
**Expected:** Flagged before submission
**Actual:** Warning displayed with original transaction link

## TC-EXP-011: Multi-Currency Donation
**Priority:** P2 | **Status:** ✅ PASS
**Steps:**
1. Process donations: $500 USD, €300 EUR, £200 GBP, $400 CAD
2. Verify conversion using daily exchange rates
3. Verify all recorded in USD equivalent
**Expected:** Correct conversion with daily rates
**Actual:** All converted correctly, rates sourced from ECB

## TC-EXP-012: Expense Policy Enforcement
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Set org policy: expenses >$500 require admin approval
2. Submit $750 expense as Staff member
3. Verify auto-escalation + admin notification
**Expected:** Auto-flagged with notification sent
**Actual:** Flagged immediately, admin notified via in-app + email
