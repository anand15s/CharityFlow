# CharityFlow — Security & Audit Trail Test Cases
# Module: TC_SECURITY_AUDIT_V2
# Version: 2.1 | Date: March 26, 2026

---

## TC-SEC-001: Role-Based Access Control
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Login as Volunteer role
2. Attempt to access Financial Reports page
3. Verify access denied + incident logged
**Expected:** Access denied with audit log entry
**Actual:** "Access Denied: Insufficient permissions" | Event logged: {user, role, resource, timestamp, IP}

## TC-SEC-002: Immutable Audit Log
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Create transaction: $500 office supplies
2. Edit transaction amount to $450
3. Verify both original and edit preserved
**Expected:** Original + edit both in audit trail
**Actual:** Audit trail shows: "Created: $500 at 10:15:03" → "Modified: $450 at 10:22:17 by user@org.com (reason: correction)"

## TC-SEC-003: Notification Escalation
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Set filing deadline 7 days past due
2. Track notification escalation sequence
**Expected:** Email → SMS → Admin alert escalation
**Actual:** Day 1: Email digest | Day 3: Push notification | Day 5: SMS to treasurer | Day 7: Admin dashboard red alert

## TC-SEC-004: Data Encryption at Rest
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Query database encryption status
2. Verify AES-256 encryption on all PII fields
3. Verify encryption keys rotated per policy
**Expected:** AES-256 confirmed
**Actual:** All PII columns encrypted with AES-256-GCM, keys rotated every 90 days

## TC-SEC-005: Session Timeout
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Login and remain inactive for 30 minutes
2. Attempt to perform action
**Expected:** Auto-logout + re-authentication required
**Actual:** Session expired at 30:00, redirect to login with "Session expired" message

## TC-SEC-006: Two-Factor Authentication
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Enable 2FA on account
2. Login with password
3. Verify OTP prompt appears
4. Enter valid OTP → access granted
5. Enter invalid OTP → access denied
**Expected:** OTP required after password
**Actual:** Both scenarios work correctly, invalid OTP shows "Invalid code, X attempts remaining"

## TC-SEC-007: Failed Login Lockout
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Attempt 5 failed logins with wrong password
2. Verify account lockout
3. Verify lockout duration
**Expected:** Account locked for 15 minutes after 5 failures
**Actual:** Locked at attempt 5, unlock countdown displayed, admin notified

## TC-SEC-008: Audit Trail Export
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Navigate to Audit → Export
2. Select fiscal year 2025-2026
3. Export as CSV and PDF
**Expected:** Complete audit trail in both formats
**Actual:** CSV (12,847 entries) + PDF (formatted 234-page report) generated in 8.3 seconds
