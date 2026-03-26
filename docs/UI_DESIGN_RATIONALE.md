# CharityFlow UI/UX Design Rationale

## Research Summary — 3 Top Nonprofit Platforms Analyzed

### 1. Bloomerang (Donor-Centric CRM)
**What they do well:**
- Donor engagement scoring with visual indicators
- KPI cards at dashboard top for instant insights
- Retention rate tracking with clear visualizations
- Customizable reporting dashboards

**What we adopted and WHY:**
- **KPI Cards (Top Row):** Volunteer treasurers need to see financial health at a glance. No scrolling, no clicking — the 4 most important numbers (Donations YTD, Expenses YTD, Compliance Score, Active Donors) are visible immediately.
- **Engagement Hearts:** Simple 1-5 heart system makes donor health instantly scannable even for non-data people. We adapted this from Bloomerang's donor engagement tracking.
- **Trend Arrows + Sparklines:** Small visual cues that show direction without requiring users to interpret complex charts.

### 2. Aplos (Nonprofit Accounting)
**What they do well:**
- Oversight Dashboard with consolidated multi-org views
- Color-coded task status (green/yellow/red)
- Inline task management — act without leaving the dashboard
- Customizable widget layout
- Favorites & recently used report panels

**What we adopted and WHY:**
- **Compliance Gauge (Circular):** Aplos uses color-coded status across their dashboard. We concentrated this into one powerful gauge — the Compliance Health Score. Green/yellow/red is universally understood, even by volunteers with zero accounting background.
- **Action Items Widget:** Aplos showed that inline task management reduces friction. Our Action Items widget surfaces filing deadlines, compliance tasks, and upcoming events in priority order with countdown badges. Users never miss a deadline.
- **Sidebar Navigation:** Aplos's left sidebar with icon+label navigation is the proven pattern for complex dashboards. It provides persistent navigation without consuming horizontal space.
- **Report Grid:** Aplos's favorites and search/filter approach to reports. We created a card-based report browser so users can star their frequently-used reports.

### 3. Keela (Nonprofit CRM + Analytics)
**What they do well:**
- Donor analytics with predictive insights
- Lifetime value tracking per donor
- Outcome visualization showing fund impact
- Segmentation tools for donor categories
- Mobile-responsive design throughout

**What we adopted and WHY:**
- **Donor Cards with Analytics:** Keela pioneered per-donor analytics in the nonprofit space. Our Donor Hub shows lifetime giving, engagement score, recurrence status, and trend direction — all on one card. Small nonprofits get enterprise-level donor intelligence.
- **Filter Chips:** Keela's segmentation approach (Major Donors, Monthly, Lapsed, New) lets users quickly focus on the donors that need attention. We adopted this with one-click filter chips.
- **Slide-Out Detail Panel:** Instead of navigating to a new page (which loses context), clicking a donor opens a slide-out panel with full history — a pattern Keela uses effectively.

## CharityFlow Original Innovations (Not from Competitors)
- **Quick Actions FAB:** None of the 3 platforms offer a floating action button. Volunteers at events need to record transactions FAST.
- **Plain Language Throughout:** "Chart of Accounts" → "Money Categories." No competitor does this.
- **Compliance Countdown Badges:** Deadline-aware badges that turn red as due dates approach.
- **Event Budget Cards:** No competitor has event-specific financial tracking.

## Accessibility Decisions
- Base font size: 16px (larger than industry standard 14px)
- Color contrast ratios: All exceed WCAG 2.1 AA
- Touch targets: Minimum 44x44px for mobile
- Loading skeletons: Prevent layout shift during data fetching
- Reduced motion: Respects prefers-reduced-motion media query
