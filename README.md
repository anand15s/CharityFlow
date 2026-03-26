# CharityFlow

> The first all-in-one nonprofit operating system built for people who don't know accounting.

## What is CharityFlow?

CharityFlow replaces 6+ disconnected tools with one intuitive platform. Small nonprofits get automated Form 990 filing, CPA-grade tax optimization, location-based compliance guidance, donor CRM, event management, and board governance — all in plain language.

## Core Engine Modules

| Module | Status | Description |
|--------|--------|-------------|
| Transaction Engine | ✅ | Financial transaction management with auto-categorization |
| Compliance Engine | ✅ | Location-based compliance for 7 states (CA, TX, NY, FL, IL, OK, Federal) |
| Receipt Scanner | ✅ | OCR-powered receipt scanning with merchant recognition |
| Mileage Tracker | ✅ | IRS-compliant mileage tracking ($0.14/mile charity rate) |
| Bulk Processor | ✅ | Batch approve/reject/categorize expenses |
| Approval Workflow | ✅ | Policy-based auto-approve with multi-step chains |
| Utility Bill Manager | ✅ | Link utility providers, track bills, quarterly reports |
| Customer Chatbot | ✅ | Help desk + feature suggestions + knowledge base |
| Donor CRM Engine | ✅ | Donor management, campaigns, P2P fundraising |
| Form 990 Engine | ✅ | Auto-detect 990 version, generate, validate, file |
| Plain Language | ✅ | 30+ accounting terms translated to everyday language |

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript (strict)
- **Styling**: Tailwind CSS with CharityFlow brand colors
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Testing**: Jest + Playwright
- **CI/CD**: GitHub Actions (6-stage pipeline)

## Quick Start

```bash
git clone https://github.com/anand15s/CharityFlow.git
cd CharityFlow
npm install
npm run dev
```

## Testing

```bash
npm test          # Run unit tests
npm run test:e2e  # Run E2E tests
```

## License

MIT License — see [LICENSE](LICENSE) for details.
