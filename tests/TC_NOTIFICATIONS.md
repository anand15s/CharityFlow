# CharityFlow — Notifications & Role-Based Alerts Test Cases

## Module: Smart Notification System

### TC-NOT-001: Admin — Critical Alert
- **Precondition:** Tax filing deadline in 7 days
- **Steps:** System detects upcoming deadline
- **Expected:** Push + email + in-app banner: "Form 990 due in 7 days. [File Now]"
- **Priority:** P0

### TC-NOT-002: Treasurer — Transaction Alert
- **Precondition:** Large expense ($5,000+) entered
- **Steps:** Expense saved by staff member
- **Expected:** Treasurer receives: "Large expense: $5,000 to ABC Catering for Spring Gala. [Review]"
- **Priority:** P0

### TC-NOT-003: Board Member — Meeting Reminder
- **Precondition:** Board meeting in 48 hours
- **Steps:** System sends reminder
- **Expected:** Email with agenda, documents, dial-in info. In-app notification with "Confirm Attendance" button
- **Priority:** P1

### TC-NOT-004: Volunteer — Task Assignment
- **Precondition:** Admin assigns task to volunteer
- **Steps:** Task "Set up chairs for Gala" assigned
- **Expected:** Volunteer gets push notification with task details, deadline, location
- **Priority:** P1

### TC-NOT-005: Notification Preferences
- **Precondition:** User in settings
- **Steps:** Disable email notifications, keep push only, set DND 10pm-7am
- **Expected:** Preferences saved, emails stop, push continues, DND respected
- **Priority:** P1

### TC-NOT-006: Compliance Deadline Escalation
- **Precondition:** Filing deadline missed by 3 days
- **Steps:** System detects overdue item
- **Expected:** Escalating alerts: Admin + Board Chair notified, red banner on dashboard, daily reminder until resolved
- **Priority:** P0

### TC-NOT-007: Donor Thank-You Trigger
- **Precondition:** Donation >$250 received
- **Steps:** Donation processed
- **Expected:** Auto thank-you email sent within 60 seconds, IRS acknowledgment attached, donor portal updated
- **Priority:** P0

### TC-NOT-008: Weekly Digest
- **Precondition:** User has weekly digest enabled
- **Steps:** Monday 8am
- **Expected:** Summary email: week's transactions, upcoming deadlines, pending approvals, campaign progress
- **Priority:** P2
