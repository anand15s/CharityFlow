# CharityFlow — Test Suite

**Version:** 2.1  
**Total Test Cases:** 165  
**Pass Rate:** 100%  

## Test Inventory

### v2.0 Original Tests (101 cases)
| File | Module | Cases |
|------|--------|-------|
| `TC_TRANSACTION_MANAGEMENT.md` | Ledger, bank feeds, reports | 12 |
| `TC_FORM_990.md` | 990-N/EZ/Full, e-filing | 10 |
| `TC_CPA_TAX_ENGINE.md` | UBIT, lobbying, donor benefits | 12 |
| `TC_COMPLIANCE_ENGINE.md` | Location detection, law updates | 10 |
| `TC_DONOR_CRM.md` | Profiles, campaigns, P2P | 10 |
| `TC_EVENT_ENGINE.md` | Venues, vendors, ROI | 8 |
| `TC_BOARD_GOVERNANCE.md` | Meetings, voting, minutes | 7 |
| `TC_SECURITY_AUDIT.md` | RBAC, encryption, audit trail | 12 |
| `TC_NOTIFICATIONS.md` | Alerts, digests, escalation | 8 |
| `TC_INTEGRATION_E2E.md` | Cross-module + performance | 12 |

### v2.1 New Tests (64 cases)
| File | Module | Cases |
|------|--------|-------|
| `TC_EXPENSE_MANAGEMENT_V2.md` | SmartScan, mileage, bulk actions, card linking | 12 |
| `TC_CPA_TAX_ENGINE_V2.md` | Status guardian, UBIT, worker classification | 10 |
| `TC_DONOR_CRM_V2.md` | P2P fundraising, DAF, gift matching, retention | 8 |
| `TC_EVENT_ENGINE_V2.md` | Venue search, vendor discounts, permit detection | 6 |
| `TC_BOARD_GOVERNANCE_V2.md` | Voting system, document sharing, search | 5 |
| `TC_SECURITY_AUDIT_V2.md` | 2FA, lockout, encryption, audit export | 8 |
| `TC_COMPLIANCE_V2_MULTISTATE.md` | 5 states × 3 org types (15 scenarios) | 15 |

### Test Results
| File | Description |
|------|-------------|
| `TEST_RESULTS_V2.1.md` | Complete results summary with performance benchmarks |

## Running Tests

```bash
# Unit tests
npm test

# E2E tests  
npm run test:e2e

# Full test suite with coverage
npm run test:coverage
```

## CI/CD Pipeline
Tests run automatically on every push via GitHub Actions (`.github/workflows/ci.yml`):
1. Lint & Type Check
2. Unit Tests (Jest)
3. Integration Tests (PostgreSQL service)
4. E2E Tests (Playwright — Chrome, Firefox, Safari, Mobile)
5. Security Scan (npm audit + dependency check)
6. Production Build Verification
