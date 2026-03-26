# CharityFlow — Location-Based Compliance Engine Test Cases

## Module: Location-Based Compliance

### TC-COMP-001: Auto-Detection at Signup
- **Precondition:** New user creating account
- **Steps:** Enter organization address: "123 Main St, Austin, TX 78701"
- **Expected:** System detects Texas state laws, Travis County rules, Austin city regulations, generates personalized compliance roadmap
- **Priority:** P0

### TC-COMP-002: State-Specific Tax Calendar
- **Precondition:** Texas-based 501(c)(3), fiscal year Jan-Dec
- **Steps:** View compliance calendar
- **Expected:** Federal 990 due May 15, TX Annual Report due by anniversary, TX Charitable Registration if soliciting, all with countdown timers
- **Priority:** P0

### TC-COMP-003: Multi-State Fundraising Registration
- **Precondition:** Nonprofit soliciting donations online (accessible nationwide)
- **Steps:** Indicate "We accept online donations from any state"
- **Expected:** Alert: "Online solicitation may require registration in 41 states. Here are the top 10 states by donation volume to prioritize."
- **Priority:** P1

### TC-COMP-004: Compliance Health Score
- **Precondition:** Organization with 6 months of activity
- **Steps:** View Compliance Dashboard
- **Expected:** Score shown (0-100%), color-coded (green >80%, yellow 50-80%, red <50%), breakdown by category (incorporation, tax, fundraising, governance)
- **Priority:** P0

### TC-COMP-005: Law Change Notification
- **Precondition:** User in California, new AB-1234 passes affecting nonprofits
- **Steps:** Quarterly compliance update runs
- **Expected:** Push notification: "New California law AB-1234 requires [action] by [date]. Here's what you need to do." with link to action steps
- **Priority:** P1

### TC-COMP-006: Quarterly Compliance Update
- **Precondition:** Connected to internet, Q2 starts
- **Steps:** System performs quarterly law scan
- **Expected:** Updated regulations pulled for user's jurisdiction, new items added to compliance roadmap, summary email sent
- **Priority:** P0

### TC-COMP-007: Local Grant & Funding Alerts
- **Precondition:** Youth-focused nonprofit in Chicago, IL
- **Steps:** View funding opportunities
- **Expected:** Relevant local grants surfaced: City of Chicago youth grants, IL state funding, Cook County community grants
- **Priority:** P2

### TC-COMP-008: Audit Threshold Detection
- **Precondition:** Revenue crosses $500K (state audit threshold)
- **Steps:** System monitors annual revenue
- **Expected:** Alert: "Your revenue has crossed $500K — your state requires an independent audit. Here's how to prepare."
- **Priority:** P1

### TC-COMP-009: Document Expiration Tracking
- **Precondition:** Articles of Incorporation, IRS Determination Letter uploaded
- **Steps:** View document vault
- **Expected:** Expiration dates tracked, renewal reminders set, missing critical documents flagged
- **Priority:** P1

### TC-COMP-010: State-Specific Audit Prep Package
- **Precondition:** Audit required
- **Steps:** Click "Prepare for Audit"
- **Expected:** Auto-generates audit package: financial statements, board minutes, tax filings, donor records, all organized per state requirements
- **Priority:** P1
