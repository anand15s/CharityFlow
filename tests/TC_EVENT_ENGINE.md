# CharityFlow — Local Event Success Engine Test Cases

## Module: Local Event Management

### TC-EVT-001: Create Event
- **Precondition:** User is Admin or Event Manager
- **Steps:** Create "Annual Charity Gala" > Set date, time, location, capacity > Save
- **Expected:** Event created, budget template generated, checklist initialized
- **Priority:** P0

### TC-EVT-002: Smart Venue Finder
- **Precondition:** Event in "Chicago, IL" for 200 guests
- **Steps:** Click "Find Venue" > Set capacity 200, budget $5K
- **Expected:** Local venues listed with nonprofit-friendly rates, capacity, photos, reviews from other nonprofits
- **Priority:** P1

### TC-EVT-003: Local Vendor Discounts
- **Precondition:** Planning a gala in Austin, TX
- **Steps:** Browse vendor marketplace
- **Expected:** Local caterers, photographers, AV companies shown with nonprofit discount rates and savings estimates
- **Priority:** P1

### TC-EVT-004: Permit & Regulations Check
- **Precondition:** Outdoor event in public park
- **Steps:** Enter event type "Outdoor festival with food and music"
- **Expected:** Checklist: park permit, food handler's license, noise ordinance hours, insurance requirement, fire marshal approval
- **Priority:** P2

### TC-EVT-005: Event Budget Tracking
- **Precondition:** Event created with $10K budget
- **Steps:** Add expenses as they occur
- **Expected:** Budget vs. actual dashboard, category breakdown, remaining balance, projections
- **Priority:** P0

### TC-EVT-006: Event ROI Analysis
- **Precondition:** Event completed, all income/expenses entered
- **Steps:** View "Event Results"
- **Expected:** Total revenue, total cost, net proceeds, cost per dollar raised, comparison to past events, donor acquisition cost
- **Priority:** P1

### TC-EVT-007: Ticket Sales & Registration
- **Precondition:** Gala with $200 tickets
- **Steps:** Configure ticket tiers (VIP $500, General $200, Student $50) > Open registration
- **Expected:** Online registration page, payment processing, quid pro quo auto-calculated, attendee list managed
- **Priority:** P1

### TC-EVT-008: Event Marketing Toolkit
- **Precondition:** Event created in Denver, CO
- **Steps:** Click "Generate Marketing Materials"
- **Expected:** Flyer templates with local landmarks, social media posts, local hashtags, QR code to donation page
- **Priority:** P2
