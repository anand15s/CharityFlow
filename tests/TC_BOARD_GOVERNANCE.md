# CharityFlow — Board Governance Test Cases

## Module: Board Meeting Management

### TC-BRD-001: Schedule Board Meeting
- **Precondition:** User is Admin or Board Chair
- **Steps:** Navigate to Governance > Schedule Meeting > Set date, time, agenda > Invite members
- **Expected:** Meeting created, calendar invites sent, agenda shared with all board members
- **Priority:** P0

### TC-BRD-002: Meeting Minutes Recording
- **Precondition:** Meeting in progress
- **Steps:** Click "Start Minutes" > Record attendees, motions, votes, action items > Close meeting
- **Expected:** Formatted minutes generated, attendees verified against quorum requirement, stored immutably
- **Priority:** P0

### TC-BRD-003: Board Voting
- **Precondition:** Motion proposed during meeting
- **Steps:** Create motion "Approve Q1 Budget" > Board members vote (Yes/No/Abstain)
- **Expected:** Votes recorded, result calculated (passed/failed based on bylaws), audit trail preserved
- **Priority:** P0

### TC-BRD-004: Document Sharing & Repository
- **Precondition:** Board meeting scheduled
- **Steps:** Upload board packet (financials, reports, proposals)
- **Expected:** Documents accessible only to board members, version history maintained, read receipts tracked
- **Priority:** P1

### TC-BRD-005: Quorum Detection
- **Precondition:** 9-member board, 5 required for quorum
- **Steps:** 4 members mark attendance
- **Expected:** Warning: "Quorum not met (4/5 required). Votes taken will be non-binding."
- **Priority:** P0

### TC-BRD-006: Conflict of Interest Disclosure
- **Precondition:** Board reviewing vendor contract
- **Steps:** Board member has relationship with vendor > Disclose conflict
- **Expected:** Conflict recorded, member auto-recused from vote, documented in minutes
- **Priority:** P1

### TC-BRD-007: Action Item Tracking
- **Precondition:** Meeting concluded with 5 action items
- **Steps:** View action items dashboard
- **Expected:** Each item assigned to member, deadline set, status tracked, reminder emails sent
- **Priority:** P1
