# CharityFlow — Donor CRM & Fundraising Test Cases

## Module: Donor CRM & Fundraising

### TC-DON-001: Add Donor Profile
- **Precondition:** User logged in as Admin
- **Steps:** Navigate to Donors > Add New > Enter name, email, phone, address > Save
- **Expected:** Donor profile created, giving history initialized, communication preferences set
- **Priority:** P0

### TC-DON-002: Donation Tracking & History
- **Precondition:** Donor "Jane Doe" exists with 5 past donations
- **Steps:** View Jane Doe's profile
- **Expected:** Full giving timeline shown, total lifetime giving calculated, average gift, largest gift, last gift date
- **Priority:** P0

### TC-DON-003: Auto Tax Receipt Generation
- **Precondition:** $500 cash donation received
- **Steps:** Record donation > Save
- **Expected:** IRS-compliant tax receipt auto-generated within 60 seconds, emailed to donor, copy stored
- **Priority:** P0

### TC-DON-004: Fundraising Campaign Creation
- **Precondition:** User is Admin
- **Steps:** Create campaign "Building Fund 2026" > Set goal $50K > Set dates > Publish
- **Expected:** Campaign page live, progress thermometer active, shareable link generated
- **Priority:** P0

### TC-DON-005: Peer-to-Peer Fundraising
- **Precondition:** Active campaign exists
- **Steps:** Donor creates personal fundraising page linked to campaign
- **Expected:** Personal page with custom story, goal, progress bar, donations roll up to main campaign
- **Priority:** P1

### TC-DON-006: Gift Matching Integration
- **Precondition:** Corporate matching database connected
- **Steps:** Donor enters employer "Microsoft"
- **Expected:** "Microsoft matches gifts up to $15,000/year. Here's how to submit your match request."
- **Priority:** P2

### TC-DON-007: Recurring Donation Setup
- **Precondition:** Donor wants monthly giving
- **Steps:** Set up $50/month recurring via Stripe
- **Expected:** Auto-charge scheduled, receipts generated monthly, annual summary in January
- **Priority:** P0

### TC-DON-008: Lapsed Donor Detection
- **Precondition:** Donor gave regularly for 2 years, no gift in 6 months
- **Steps:** System runs lapsed donor analysis weekly
- **Expected:** Donor flagged as "At Risk", re-engagement email template suggested
- **Priority:** P1

### TC-DON-009: Donor Segmentation
- **Precondition:** 200+ donors in CRM
- **Steps:** Filter by: giving level, frequency, program interest, location
- **Expected:** Segments created, exportable for targeted campaigns
- **Priority:** P1

### TC-DON-010: DAF (Donor-Advised Fund) Tracking
- **Precondition:** Donation received from a DAF
- **Steps:** Record DAF donation with sponsoring organization
- **Expected:** DAF tracked separately, proper acknowledgment (to DAF, not donor for tax purposes), reporting accurate
- **Priority:** P1
