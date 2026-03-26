# CharityFlow — Complete Test Suite Index

## 📋 Test Coverage Summary

| Module | File | Test Cases | Priority P0 | Priority P1 | Priority P2 |
|--------|------|-----------|-------------|-------------|-------------|
| Transaction Management | `TC_TRANSACTION_MANAGEMENT.md` | 12 | 6 | 5 | 1 |
| Form 990 & Tax Filing | `TC_FORM_990.md` | 10 | 7 | 1 | 2 |
| CPA Tax Optimization | `TC_CPA_TAX_ENGINE.md` | 12 | 6 | 4 | 2 |
| Location-Based Compliance | `TC_COMPLIANCE_ENGINE.md` | 10 | 4 | 4 | 2 |
| Donor CRM & Fundraising | `TC_DONOR_CRM.md` | 10 | 4 | 4 | 2 |
| Local Event Engine | `TC_EVENT_ENGINE.md` | 8 | 2 | 3 | 3 |
| Board Governance | `TC_BOARD_GOVERNANCE.md` | 7 | 3 | 3 | 1 |
| Security & Audit | `TC_SECURITY_AUDIT.md` | 12 | 6 | 4 | 2 |
| Notifications | `TC_NOTIFICATIONS.md` | 8 | 3 | 3 | 2 |
| Integration & E2E | `TC_INTEGRATION_E2E.md` | 12 | 7 | 4 | 1 |
| **TOTAL** | **10 files** | **101** | **48** | **35** | **18** |

## 🏃 How to Run Tests

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests (requires PostgreSQL)
```bash
npm run test:integration
```

### End-to-End Tests (requires Playwright)
```bash
npm run test:e2e
```

### Full Suite
```bash
npm test
```

### CI/CD
Tests run automatically via GitHub Actions on every push to `main` or `develop`.
See `.github/workflows/ci.yml` for pipeline configuration.

## 📊 Test Execution Priority

### Sprint 1 (MVP): Run all P0 tests (48 cases)
### Sprint 2 (Beta): Add P1 tests (35 cases)  
### Sprint 3 (GA): Full suite including P2 (18 cases)

## 🔄 Test Maintenance

- Tests updated with every feature addition
- Quarterly compliance test refresh (aligned with law update engine)
- Performance benchmarks re-baselined monthly
- Security tests run on every dependency update
