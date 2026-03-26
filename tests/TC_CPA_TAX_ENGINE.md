# CharityFlow — CPA-Grade Tax Optimization Test Cases

## Module: Tax Benefit Optimization Engine

### TC-TAX-001: 501(c)(3) Status Guardian
- **Precondition:** Organization registered as 501(c)(3)
- **Steps:** Enter revenue from a commercial activity (renting space for weddings)
- **Expected:** UBIT flag raised: "This revenue may be subject to Unrelated Business Income Tax. Review needed."
- **Priority:** P0

### TC-TAX-002: Lobbying Limit Monitor
- **Precondition:** 501(c)(3) public charity
- **Steps:** Categorize $50K in expenses as "Advocacy & Lobbying"
- **Expected:** Warning: "Your lobbying expenses are at 15% of total — approaching the 20% safe harbor. Consider reducing."
- **Priority:** P0

### TC-TAX-003: Political Activity Detection
- **Precondition:** 501(c)(3) organization
- **Steps:** Enter expense "Campaign Fundraiser Sponsorship $5,000"
- **Expected:** Red alert: "501(c)(3) organizations are absolutely prohibited from political campaign activities. This expense may jeopardize your tax-exempt status."
- **Priority:** P0

### TC-TAX-004: UBIT Calculator
- **Precondition:** Unrelated business income identified
- **Steps:** Navigate to Tax Optimizer > UBIT section
- **Expected:** UBIT liability calculated, Form 990-T auto-generated, $1,000 specific deduction applied
- **Priority:** P0

### TC-TAX-005: Functional Expense Ratio Optimizer
- **Precondition:** Full year of categorized expenses
- **Steps:** View "Efficiency Dashboard"
- **Expected:** Program:Admin:Fundraising ratio displayed (e.g., 75:15:10), benchmarked against Charity Navigator standards, suggestions to improve
- **Priority:** P0

### TC-TAX-006: Donor Tax Benefit Maximizer — Cash
- **Precondition:** $1,000 cash donation received
- **Steps:** Generate donor acknowledgment letter
- **Expected:** IRS-compliant letter with org name, EIN, date, amount, statement of no goods/services provided
- **Priority:** P0

### TC-TAX-007: Donor Tax Benefit Maximizer — In-Kind
- **Precondition:** Donor gives used computer valued at $800
- **Steps:** Record in-kind donation > Enter description and estimated value
- **Expected:** Form 8283 guidance if >$500, appraisal reminder if >$5,000, Schedule M population
- **Priority:** P1

### TC-TAX-008: Quid Pro Quo Calculation
- **Precondition:** $200 gala ticket where dinner value is $75
- **Steps:** Record event donation/ticket sale
- **Expected:** Auto-calculates deductible portion ($125), generates proper disclosure: "Only $125 of your payment is tax-deductible"
- **Priority:** P0

### TC-TAX-009: Worker Classification Wizard
- **Precondition:** Need to pay someone for services
- **Steps:** Answer classification questionnaire (20 IRS factors)
- **Expected:** Recommendation: Employee vs. Contractor with confidence score, proper form guidance (W-2 vs 1099)
- **Priority:** P1

### TC-TAX-010: Executive Compensation Reasonableness
- **Precondition:** ED salary set at $150K
- **Steps:** Run compensation analysis
- **Expected:** Comparison against comparable orgs by budget/region, flag if exceeds reasonable range, documentation template for board
- **Priority:** P2

### TC-TAX-011: Sales Tax Exemption Tracker
- **Precondition:** Exempt in 3 states
- **Steps:** View exemption dashboard
- **Expected:** Expiration dates shown, renewal reminders 60 days before, exemption certificate storage
- **Priority:** P1

### TC-TAX-012: Year-End Tax Planning Dashboard
- **Precondition:** November (pre-year-end)
- **Steps:** Open Year-End Planning
- **Expected:** Projected savings shown, missing documents listed, donor communication templates ready, checklist of actions
- **Priority:** P0