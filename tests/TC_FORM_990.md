# CharityFlow — Form 990 & Tax Filing Test Cases

## Module: Automated Form 990 Generation

### TC-990-001: Form Version Auto-Detection
- **Precondition:** Nonprofit profile completed with annual revenue
- **Steps:** Navigate to Tax Filing > Click "Prepare Form 990"
- **Expected:** System auto-selects correct form: 990-N (<$50K), 990-EZ ($50K-$200K), 990 (>$200K)
- **Priority:** P0

### TC-990-002: 990-N (e-Postcard) Generation
- **Precondition:** Revenue under $50K
- **Steps:** Click "Generate 990-N" > Review pre-filled fields > Submit
- **Expected:** Form auto-populated with org name, EIN, address, fiscal year, confirmation of <$50K revenue
- **Priority:** P0

### TC-990-003: 990-EZ Generation
- **Precondition:** Revenue $50K-$200K, all transactions categorized
- **Steps:** Click "Generate 990-EZ" > Review all sections
- **Expected:** Parts I-VI auto-populated from transaction data, Schedule A/B/O pre-filled
- **Priority:** P0

### TC-990-004: Full 990 Generation
- **Precondition:** Revenue >$200K, complete transaction history
- **Steps:** Click "Generate Full 990" > Review all 12 parts
- **Expected:** All parts populated, functional expense statement calculated, program accomplishments drafted
- **Priority:** P0

### TC-990-005: Schedule A — Public Support Test
- **Precondition:** 5 years of donation data
- **Steps:** Generate Schedule A
- **Expected:** Public support percentage calculated, threshold warnings if below 33.3%, tips to improve
- **Priority:** P0

### TC-990-006: Filing Deadline Tracking
- **Precondition:** Fiscal year end configured
- **Steps:** Check tax calendar
- **Expected:** 990 due date shown (5th month after fiscal year end), 90-day and 30-day reminders scheduled
- **Priority:** P0

### TC-990-007: Extension Filing (Form 8868)
- **Precondition:** 990 deadline approaching, form not ready
- **Steps:** Click "File Extension" 
- **Expected:** Form 8868 auto-generated, 6-month extension filed, new deadline calculated
- **Priority:** P1

### TC-990-008: Amended Return
- **Precondition:** 990 already filed, error discovered
- **Steps:** Click "Amend Return" > Make corrections > Submit
- **Expected:** Amended form generated with changes highlighted, original preserved
- **Priority:** P2

### TC-990-009: Data Validation Before Filing
- **Precondition:** 990 generated but incomplete data
- **Steps:** Click "Validate" before filing
- **Expected:** Checklist of missing/inconsistent data: missing EIN, math errors, blank required fields
- **Priority:** P0

### TC-990-010: One-Click E-File
- **Precondition:** 990 validated and approved by board
- **Steps:** Click "File Now"
- **Expected:** Electronic filing submitted to IRS, confirmation number received, status trackable
- **Priority:** P0