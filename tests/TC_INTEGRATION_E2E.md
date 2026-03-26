# CharityFlow — Integration & End-to-End Test Cases

## Module: Cross-Module Integration Tests

### TC-INT-001: Donation → Tax Receipt → Donor CRM → 990
- **Precondition:** Donor exists, campaign active
- **Steps:** Record $5,000 donation > Verify receipt > Check CRM > Generate 990
- **Expected:** Donation flows through entire pipeline: recorded in ledger, receipt emailed, CRM updated, 990 includes donation
- **Priority:** P0

### TC-INT-002: Event → Budget → Transactions → Report
- **Precondition:** Event "Spring Gala" created
- **Steps:** Add venue expense $3K > Add catering $2K > Record ticket sales $8K > Generate event report
- **Expected:** All transactions linked to event, budget dashboard accurate, ROI calculated ($8K-$5K=$3K net)
- **Priority:** P0

### TC-INT-003: Compliance → Notifications → Calendar
- **Precondition:** New nonprofit in Texas
- **Steps:** Complete onboarding > Check compliance calendar > Verify notifications
- **Expected:** TX-specific deadlines populated, notifications scheduled for each, compliance score starts at baseline
- **Priority:** P0

### TC-INT-004: Board Vote → Minutes → Action Items → Notifications
- **Precondition:** Board meeting in session
- **Steps:** Create motion > Vote passes > Assign action items > Close meeting
- **Expected:** Motion recorded, minutes auto-generated, action items assigned with notifications sent
- **Priority:** P0

### TC-INT-005: UBIT Detection → Tax Alert → 990-T
- **Precondition:** Commercial revenue entered
- **Steps:** Record parking lot rental income $15K
- **Expected:** UBIT flagged, admin alerted, 990-T preparation triggered, tax liability estimated
- **Priority:** P0

### TC-INT-006: Donor → Campaign → Peer-to-Peer → Thank You
- **Precondition:** Active fundraising campaign
- **Steps:** Supporter creates P2P page > Friend donates $100 > Campaign total updated
- **Expected:** Donation credited to both P2P page and main campaign, thank you sent, tax receipt generated
- **Priority:** P1

### TC-INT-007: Location Change → Compliance Update
- **Precondition:** Nonprofit moves from TX to CA
- **Steps:** Update address to California
- **Expected:** Compliance engine recalculates: new state requirements, updated calendar, CA-specific laws loaded
- **Priority:** P1

### TC-INT-008: Quarterly Law Update → Compliance Roadmap
- **Precondition:** Q2 starts, internet connected
- **Steps:** System pulls latest regulatory updates
- **Expected:** New laws detected, compliance roadmap updated, affected items flagged, notification sent to admin
- **Priority:** P0

## Module: Performance & Load Tests

### TC-PERF-001: Dashboard Load Time
- **Expected:** <2 seconds with 10,000 transactions
- **Priority:** P0

### TC-PERF-002: Report Generation
- **Expected:** Quarterly report generated in <10 seconds for org with 5,000 transactions
- **Priority:** P0

### TC-PERF-003: Concurrent Users
- **Expected:** 50 concurrent users per org without degradation
- **Priority:** P1

### TC-PERF-004: 990 Generation Time
- **Expected:** Full Form 990 generated in <30 seconds
- **Priority:** P0

### TC-PERF-005: Search Performance
- **Expected:** Donor/transaction search returns results in <500ms across 100K records
- **Priority:** P1

## Module: Accessibility Tests

### TC-A11Y-001: Screen Reader Compatibility
- **Expected:** All pages navigable via NVDA/JAWS, ARIA labels on all interactive elements
- **Priority:** P1

### TC-A11Y-002: Keyboard Navigation
- **Expected:** All features accessible via keyboard only, visible focus indicators, logical tab order
- **Priority:** P1

### TC-A11Y-003: Color Contrast
- **Expected:** WCAG 2.1 AA compliant (4.5:1 contrast ratio for text, 3:1 for large text)
- **Priority:** P1

### TC-A11Y-004: Mobile Responsiveness
- **Expected:** Full functionality on 320px-1440px screens, touch targets >44px
- **Priority:** P0
