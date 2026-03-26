# CharityFlow — Board Governance Module Test Cases
# Module: TC_BOARD_GOVERNANCE_V2
# Version: 2.1 | Date: March 26, 2026

---

## TC-BOARD-001: Schedule Board Meeting
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Create board meeting: "Q1 Budget Review" April 15, 2026, 6:00 PM
2. Add agenda items (5 items)
3. Verify invites sent to all 7 board members
**Expected:** Invites sent to all members
**Actual:** 7/7 email invites sent + in-app notifications + calendar .ics attachment

## TC-BOARD-002: Meeting Minutes Recording
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Open meeting minutes editor during active meeting
2. Record attendance (5/7 present, 2 absent)
3. Add 4 action items with assignees and due dates
4. Save and distribute
**Expected:** Minutes saved with action items assigned
**Actual:** Minutes saved, action items created as tasks, assigned members notified

## TC-BOARD-003: Motion Voting
**Priority:** P0 | **Status:** ✅ PASS
**Steps:**
1. Create motion: "Approve FY2026 budget of $250,000"
2. 5 board members vote: 3 Yes, 2 No
3. Verify result recorded in minutes
**Expected:** Motion passes (simple majority), recorded
**Actual:** "MOTION PASSED (3-2) | Recorded in minutes | All votes timestamped and attributed"

## TC-BOARD-004: Document Sharing & Version Control
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Upload bylaws amendment v2
2. Verify all board members notified
3. Verify version history shows v1 → v2
**Expected:** Notification + version tracking
**Actual:** 7 notifications sent, version history shows diff between v1 and v2

## TC-BOARD-005: Meeting History Search
**Priority:** P1 | **Status:** ✅ PASS
**Steps:**
1. Load 12 months of meeting history (24 meetings)
2. Search for keyword "budget"
3. Verify relevant meetings returned
**Expected:** Meetings containing "budget" returned
**Actual:** 8 meetings returned, keyword highlighted in context snippets
