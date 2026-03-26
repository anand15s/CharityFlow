# Transaction Management Engine — Test Cases v3.0

## Overview
- **Module:** Transaction Management Engine
- **Version:** 3.0.0
- **Total Cases:** 38
- **Priority:** P0 (Critical)

## Test Suites

### Suite 1: Plain Language Translation (4 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-PL-01 | Translate types | P0 | Engine loaded | Call translateToPlainLanguage('donation') | Returns 'Money Received' |
| T-PL-02 | Translate statuses | P0 | Engine loaded | Call translateToPlainLanguage('reconciled') | Returns 'Matched with Bank' |
| T-PL-03 | Translate categories | P0 | Engine loaded | Call translateToPlainLanguage('program') | Returns 'Mission Work' |
| T-PL-04 | Unknown terms | P1 | Engine loaded | Call with 'xyz_unknown' | Returns original term |

### Suite 2: Auto-Categorization (6 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-AC-01 | Donations | P0 | Rules loaded | Categorize 'tithe offering' | Category: Donations, Func: program |
| T-AC-02 | Grants | P0 | Rules loaded | Categorize 'foundation grant' | Category: Grants, Func: program |
| T-AC-03 | Utilities | P0 | Rules loaded | Categorize 'electric bill' | Category: Utilities, Func: admin |
| T-AC-04 | Events | P0 | Rules loaded | Categorize 'annual gala' | Category: Events, Func: fundraising |
| T-AC-05 | Fallback | P1 | Rules loaded | Categorize 'xyz123' positive amount | Category: Other Income, Confidence: 0.5 |
| T-AC-06 | Custom rules | P0 | Custom rule added | Categorize matching custom pattern | Custom rule takes priority |

### Suite 3: Transaction CRUD (8 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-CR-01 | Create donation | P0 | Valid org/user | Create with amount=100, type=donation | Returns full transaction with audit log |
| T-CR-02 | Auto-detect type | P0 | Valid org/user | Create with positive amount, no type | Type auto-detected as 'donation' |
| T-CR-03 | Plain description | P0 | Valid org/user | Create with check payment | plainDescription contains 'Check' |
| T-CR-04 | Update audit | P0 | Existing txn | Update amount from 100 to 200 | Audit log has UPDATED entry with prev/new |
| T-CR-05 | Void with reason | P0 | Existing txn | Void with reason 'Duplicate' | Status=voided, notes contain reason |
| T-CR-06 | Double-void guard | P0 | Voided txn | Attempt second void | Throws 'already voided' error |
| T-CR-07 | Tax deductible | P1 | None | Create donation | taxDeductible=true |
| T-CR-08 | Tax year | P1 | None | Create transaction | taxYear=current year |

### Suite 4: Validation (5 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-VL-01 | Zero amount | P0 | None | Create with amount=0 | Throws validation error |
| T-VL-02 | Empty desc | P0 | None | Create with description='' | Throws validation error |
| T-VL-03 | Negative donation | P0 | None | Create donation with amount=-50 | Throws validation error |
| T-VL-04 | Positive expense | P0 | None | Create expense with amount=50 | Throws validation error |
| T-VL-05 | Valid txn | P0 | None | Create with valid data | No error thrown |

### Suite 5: Bank Reconciliation (5 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-BR-01 | Exact match | P0 | Txn + bank entry same amount/date/desc | Reconcile | Confidence >= 0.9, matchRate = 1 |
| T-BR-02 | Fuzzy match | P0 | Txn + bank entry 1 day apart | Reconcile | Still matches with high confidence |
| T-BR-03 | No match | P0 | Different amounts | Reconcile | matched=[], unmatched has entry |
| T-BR-04 | Skip voided | P0 | Voided txn + matching entry | Reconcile | No match (voided ignored) |
| T-BR-05 | Match rate | P0 | 3 entries, 2 matching txns | Reconcile | matchRate between 0 and 1 |

### Suite 6: Split Transactions (4 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-SP-01 | Equal split | P0 | Expense of -1000 | Split 600/400 | 2 txns, correct amounts and categories |
| T-SP-02 | Sum mismatch | P0 | Expense of -1000 | Split 500/300 | Throws 'must equal' error |
| T-SP-03 | Single split | P0 | Any txn | Split into 1 | Throws 'at least 2' error |
| T-SP-04 | Parent tag | P1 | Any txn | Split into 2 | Tags contain 'split' and 'parent:id' |

### Suite 7: Recurring Transactions (3 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-RC-01 | Monthly | P0 | Active recurring, past nextDate | Generate | Returns new transaction with recurring tag |
| T-RC-02 | Inactive | P0 | Inactive recurring | Generate | Returns null |
| T-RC-03 | Next dates | P0 | Base date 2026-03-15 | Calculate weekly/monthly/quarterly/annually | Correct future dates |

### Suite 8: Financial Reporting (3 cases)
| ID | Name | Priority | Preconditions | Steps | Expected Result |
|----|------|----------|---------------|-------|-----------------|
| T-FR-01 | Summary | P0 | 3 txns (5000+3000-2000) | Generate summary | Income=8000, Expenses=2000, Net=6000 |
| T-FR-02 | Functional groups | P0 | 3 expense txns | Generate summary | Correct program/admin/fundraising totals |
| T-FR-03 | Healthy ratio | P0 | 80% program, 14% admin, 6% fundraising | Calculate ratio | isHealthy=true, recommendation='Great job' |