# CharityFlow — Local Event Success Engine Test Cases
# Module: TC_EVENT_ENGINE_V2
# Version: 2.1 | Date: March 26, 2026

---

## TC-EVENT-001: Venue Search by Location
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Search venues in Austin, TX for 200-person gala
2. Filter: nonprofit-friendly, indoor, capacity 150-250
3. Verify results with pricing and availability
**Expected:** 5+ venues with nonprofit rates
**Actual:** 8 venues returned, 5 with verified nonprofit discounts (avg 20% off standard rate)

## TC-EVENT-002: Vendor Discount Network
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Search catering vendors in Chicago, IL
2. Filter: nonprofit discount available
3. Verify discount details and contact info
**Expected:** 3+ vendors with nonprofit discount
**Actual:** 5 vendors found, average 15% discount, all with online booking

## TC-EVENT-003: Permit Detection
**Priority:** P2 | **Status:** ✅ PASS
**Steps:**
1. Plan outdoor food event in Los Angeles County
2. Event type: food service, music, 500+ attendees
3. Verify required permits identified
**Expected:** Relevant permits detected
**Actual:** 3 permits identified: LA County Health Permit, Noise Variance Permit, Temporary Use Permit | Links to application portals provided

## TC-EVENT-004: Event Budget Template
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Select "Fundraising Gala" event type in Dallas, TX
2. Set capacity: 200 attendees
3. Verify pre-populated budget with local costs
**Expected:** Budget template with local market rates
**Actual:** 24-line budget generated with Dallas-area avg costs: Venue $3,500, Catering $8,000, AV $1,200, Decor $2,000...

## TC-EVENT-005: Event ROI Calculator
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Input: Event cost $5,000 | Revenue raised $18,000
2. Calculate ROI
**Expected:** 260% ROI displayed
**Actual:** "Event ROI: 260% | Net Raised: $13,000 | Cost per Dollar Raised: $0.28"

## TC-EVENT-006: Event Marketing Auto-Flyer
**Priority:** P2 | **Status:** ✅ PASS
**Steps:**
1. Create event: "Spring Charity Gala" in Austin, TX
2. Click "Generate Event Flyer"
3. Verify branded design with QR code
**Expected:** Branded flyer with donation QR code
**Actual:** Professional flyer with org logo, brand colors, event details, and QR code linking to donation/RSVP page
