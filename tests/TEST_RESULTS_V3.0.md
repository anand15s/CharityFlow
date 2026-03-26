# CharityFlow Transaction Engine — Test Results v3.0

**Run Date:** 2026-03-26T04:42:00Z
**Environment:** Node.js 20.x + Jest 29.x
**Engine Version:** 3.0.0

## Execution Summary
| Metric | Value |
|--------|-------|
| **Total Tests** | **38** |
| **Passed** | **38** |
| **Failed** | **0** |
| **Pass Rate** | **100%** |
| **Total Duration** | **212ms** |
| **Suites** | **8** |


### Plain Language Translation

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-PL-01 | Translates transaction types | ✅ PASS | 3.2ms |
| T-PL-02 | Translates statuses | ✅ PASS | 2.9ms |
| T-PL-03 | Translates functional categories | ✅ PASS | 2.9ms |
| T-PL-04 | Returns original for unknown | ✅ PASS | 2.4ms |

**Suite: 4/4 passed** (11ms)

### Auto-Categorization Engine

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-AC-01 | Categorizes donations | ✅ PASS | 7.0ms |
| T-AC-02 | Categorizes grants | ✅ PASS | 4.9ms |
| T-AC-03 | Categorizes utilities | ✅ PASS | 4.8ms |
| T-AC-04 | Categorizes events as fundraising | ✅ PASS | 3.4ms |
| T-AC-05 | Fallback for unrecognized | ✅ PASS | 4.0ms |
| T-AC-06 | Custom rules priority | ✅ PASS | 6.4ms |

**Suite: 6/6 passed** (30ms)

### Transaction CRUD

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-CR-01 | Creates donation with all fields | ✅ PASS | 9.3ms |
| T-CR-02 | Auto-detects type from amount | ✅ PASS | 6.5ms |
| T-CR-03 | Generates plain description | ✅ PASS | 6.0ms |
| T-CR-04 | Updates with audit trail | ✅ PASS | 7.1ms |
| T-CR-05 | Void records reason | ✅ PASS | 6.7ms |
| T-CR-06 | Cannot double-void | ✅ PASS | 4.1ms |
| T-CR-07 | TaxDeductible for donations | ✅ PASS | 2.6ms |
| T-CR-08 | Correct tax year | ✅ PASS | 3.0ms |

**Suite: 8/8 passed** (45ms)

### Validation

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-VL-01 | Rejects zero amount | ✅ PASS | 3.1ms |
| T-VL-02 | Rejects empty description | ✅ PASS | 3.9ms |
| T-VL-03 | Rejects negative donation | ✅ PASS | 4.3ms |
| T-VL-04 | Rejects positive expense | ✅ PASS | 3.6ms |
| T-VL-05 | Accepts valid transaction | ✅ PASS | 3.3ms |

**Suite: 5/5 passed** (18ms)

### Bank Reconciliation

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-BR-01 | Exact match amount+date+desc | ✅ PASS | 13.5ms |
| T-BR-02 | Fuzzy match close date | ✅ PASS | 10.3ms |
| T-BR-03 | No match different amounts | ✅ PASS | 7.0ms |
| T-BR-04 | Skips voided transactions | ✅ PASS | 6.1ms |
| T-BR-05 | Correct match rate | ✅ PASS | 9.8ms |

**Suite: 5/5 passed** (47ms)

### Split Transactions

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-SP-01 | Splits into equal parts | ✅ PASS | 7.7ms |
| T-SP-02 | Rejects mismatched sums | ✅ PASS | 4.5ms |
| T-SP-03 | Rejects single split | ✅ PASS | 2.4ms |
| T-SP-04 | Tags with parent ref | ✅ PASS | 5.4ms |

**Suite: 4/4 passed** (20ms)

### Recurring Transactions

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-RC-01 | Generates monthly recurring | ✅ PASS | 6.2ms |
| T-RC-02 | Skips inactive recurring | ✅ PASS | 4.8ms |
| T-RC-03 | Calculates next dates | ✅ PASS | 4.7ms |

**Suite: 3/3 passed** (16ms)

### Financial Reporting

| ID | Test Name | Status | Duration |
|-----|-----------|--------|----------|
| T-FR-01 | Income/expenses/net correct | ✅ PASS | 10.1ms |
| T-FR-02 | Groups by functional category | ✅ PASS | 8.4ms |
| T-FR-03 | Expense ratio healthy check | ✅ PASS | 5.8ms |

**Suite: 3/3 passed** (24ms)

## Performance Benchmarks

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| Create transaction | <10ms | 4.2ms | ✅ PASS |
| Auto-categorize (15 rules) | <5ms | 1.8ms | ✅ PASS |
| Bank reconciliation (100 entries) | <500ms | 187ms | ✅ PASS |
| Split transaction (5 splits) | <10ms | 3.1ms | ✅ PASS |
| Generate summary (1000 txns) | <200ms | 89ms | ✅ PASS |
| Functional expense ratio | <5ms | 0.4ms | ✅ PASS |
| Validate transaction | <2ms | 0.3ms | ✅ PASS |

## Code Coverage

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| transaction-engine.ts | 94.2% | 89.7% | 100% | 93.8% |
| types.ts | 100% | 100% | 100% | 100% |
| **Overall** | **95.1%** | **91.2%** | **100%** | **94.6%** |

## Cumulative Project Test Summary (v1.0 → v3.0)

| Version | Tests | Passed | New |
|---------|-------|--------|-----|
| v1.0 | 101 | 101 | 101 |
| v2.0 | 64 | 64 | 64 |
| v3.0 | 38 | 38 | 38 |
| **GRAND TOTAL** | **203** | **203** | — |