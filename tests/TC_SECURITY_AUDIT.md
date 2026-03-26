# CharityFlow — Security & Audit Test Cases

## Module: Security, Access Control & Audit Trail

### TC-SEC-001: Role-Based Access — Admin
- **Precondition:** Admin user logged in
- **Steps:** Access all system features
- **Expected:** Full access to all modules, settings, user management, financial data, tax filing
- **Priority:** P0

### TC-SEC-002: Role-Based Access — Treasurer
- **Precondition:** Treasurer role user logged in
- **Steps:** Attempt to access User Management
- **Expected:** Financial modules accessible, User Management blocked, board governance read-only
- **Priority:** P0

### TC-SEC-003: Role-Based Access — Board Member
- **Precondition:** Board member logged in
- **Steps:** Attempt to edit transactions
- **Expected:** View-only access to financials, full access to governance, no edit on transactions
- **Priority:** P0

### TC-SEC-004: Role-Based Access — Volunteer
- **Precondition:** Volunteer role user logged in
- **Steps:** Attempt to view donor details
- **Expected:** Access to assigned tasks only, no donor PII visible, no financial data access
- **Priority:** P0

### TC-SEC-005: Immutable Audit Trail
- **Precondition:** Transaction exists
- **Steps:** Edit transaction > Check audit log
- **Expected:** Original value preserved, change recorded with timestamp, user ID, old/new values, cannot be deleted
- **Priority:** P0

### TC-SEC-006: Two-Factor Authentication
- **Precondition:** 2FA enabled for admin accounts
- **Steps:** Login with password > Enter 2FA code
- **Expected:** Access granted only after both factors verified, failed attempts logged
- **Priority:** P0

### TC-SEC-007: Session Timeout
- **Precondition:** User logged in, idle for 30 minutes
- **Steps:** Attempt action after timeout
- **Expected:** Session expired, redirected to login, unsaved work preserved as draft
- **Priority:** P1

### TC-SEC-008: Data Encryption
- **Precondition:** Sensitive data stored (EIN, bank details, donor SSN for major gifts)
- **Steps:** Database inspection
- **Expected:** All PII encrypted at rest (AES-256), in transit (TLS 1.3), encryption keys rotated quarterly
- **Priority:** P0

### TC-SEC-009: Failed Login Lockout
- **Precondition:** User attempts login
- **Steps:** Enter wrong password 5 times
- **Expected:** Account locked for 30 minutes, admin notified, IP logged
- **Priority:** P0

### TC-SEC-010: Audit Export for External Auditor
- **Precondition:** External audit requested
- **Steps:** Generate "Auditor Access Package"
- **Expected:** Read-only access token generated, time-limited (30 days), all transactions + documents accessible, activity logged
- **Priority:** P1

### TC-SEC-011: GDPR/Privacy Compliance
- **Precondition:** Donor requests data deletion
- **Steps:** Process "Right to be Forgotten" request
- **Expected:** Donor PII anonymized, donation records retained (legal requirement) but de-identified, confirmation sent
- **Priority:** P1

### TC-SEC-012: Backup & Recovery
- **Precondition:** System running in production
- **Steps:** Simulate data loss > Initiate recovery
- **Expected:** Full backup restored within 4 hours, RPO < 1 hour, RTO < 4 hours, data integrity verified
- **Priority:** P0
