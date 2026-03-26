# CharityFlow — Transaction Management Test Cases

## Module: Plain-Language Transaction Management

### TC-TM-001: Add Donation (Happy Path)
- **Precondition:** User logged in as Admin or Treasurer
- **Steps:** Navigate to Dashboard > Click "Add Donation" > Enter donor name, amount ($500), date, category ("General Fund") > Save
- **Expected:** Transaction saved, appears in ledger, auto-categorized under "Money Coming In", bank balance updated
- **Priority:** P0

### TC-TM-002: Add Expense (Happy Path)
- **Precondition:** User logged in as Admin or Treasurer
- **Steps:** Navigate to Dashboard > Click "Add Expense" > Enter vendor, amount ($150), date, category ("Office Supplies") > Save
- **Expected:** Expense recorded, categorized under "Money Going Out", receipt upload prompt shown
- **Priority:** P0

### TC-TM-003: Auto-Categorization Engine
- **Precondition:** Bank feed connected
- **Steps:** Bank transaction "Staples Office Supply $89.99" imported
- **Expected:** Auto-categorized as "Office Supplies" under "Money Going Out" with 95%+ confidence badge
- **Priority:** P0

### TC-TM-004: Bank Feed Sync
- **Precondition:** Bank account linked via Plaid
- **Steps:** Wait for daily sync > Check imported transactions
- **Expected:** All new transactions imported within 24hrs, duplicates detected and flagged
- **Priority:** P0

### TC-TM-005: Plain Language Labels
- **Precondition:** Any transaction view
- **Steps:** View transaction details
- **Expected:** "Chart of Accounts" shows as "Money Categories", "Reconciliation" shows as "Match Your Bank", "Accounts Receivable" shows as "Money Coming In"
- **Priority:** P1

### TC-TM-006: Transaction Edit
- **Precondition:** Existing transaction in ledger
- **Steps:** Click transaction > Edit amount from $500 to $550 > Save
- **Expected:** Amount updated, audit log entry created with old/new values, immutable trail preserved
- **Priority:** P0

### TC-TM-007: Duplicate Detection
- **Precondition:** Manual entry + bank feed active
- **Steps:** Enter $500 donation from "John Smith" manually > Bank feed imports same transaction
- **Expected:** System flags potential duplicate, shows side-by-side comparison, user confirms merge or keep both
- **Priority:** P1

### TC-TM-008: Event-Specific Itemization
- **Precondition:** Event "Spring Gala" created
- **Steps:** Add 5 expenses tagged to "Spring Gala" > View event budget
- **Expected:** All transactions grouped under event, running total shown, budget vs. actual comparison
- **Priority:** P1

### TC-TM-009: Quarterly Report Generation
- **Precondition:** 3 months of transactions entered
- **Steps:** Navigate to Reports > Select "Q1 Report" > Generate
- **Expected:** PDF generated with income statement, expense breakdown by category, fund balances, all in plain language
- **Priority:** P0

### TC-TM-010: Multi-Fund Allocation
- **Precondition:** Multiple funds configured (General, Building, Youth)
- **Steps:** Add $1000 donation > Split: $500 General, $300 Building, $200 Youth
- **Expected:** Each fund balance updated correctly, split recorded in audit log
- **Priority:** P1

### TC-TM-011: Negative Balance Alert
- **Precondition:** Fund balance at $100
- **Steps:** Enter expense of $150 against that fund
- **Expected:** Warning displayed: "This will overdraw your [Fund Name] by $50", requires confirmation
- **Priority:** P1

### TC-TM-012: CSV/Excel Import
- **Precondition:** CSV file with 100 transactions
- **Steps:** Upload CSV > Map columns > Confirm import
- **Expected:** All 100 transactions imported, mapping remembered for future imports, duplicates flagged
- **Priority:** P2
