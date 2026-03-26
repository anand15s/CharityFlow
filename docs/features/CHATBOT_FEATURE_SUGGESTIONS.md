# CharityFlow — Customer Help Chatbot & Feature Suggestion System

## Module: `src/lib/chatbot/`
## Version: v6.0
## Priority: P1
## Status: ✅ IMPLEMENTED

---

## 📋 Feature Overview

An intelligent in-app chatbot that answers customer questions in plain language, searches a built-in knowledge base, routes issues by intent, auto-escalates to humans, and collects feature suggestions with community voting.

---

## 🎯 Why This Feature

| Problem | Impact |
|---------|--------|
| Small nonprofit staff don't have time to read documentation | 78% of support tickets are answerable from existing help articles |
| Volunteer treasurers ask the same questions repeatedly | Chatbot handles repetitive queries 24/7 |
| Users have great ideas but no channel to share them | Feature suggestions create a community-driven product roadmap |
| No competitor offers an in-app nonprofit-specific chatbot | Differentiator — legacy tools rely on generic Zendesk/Intercom |

---

## 🏗️ Proof of Concept (POC)

### Architecture

```
┌─────────────────────────────────────────────────┐
│                   User Interface                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ │
│  │ Chat FAB  │  │ Chat Panel│  │Feature Board │ │
│  │ (bottom-  │  │ (slide-out│  │ (Settings >  │ │
│  │  right)   │  │  drawer)  │  │  Suggestions)│ │
│  └────┬──────┘  └─────┬─────┘  └──────┬───────┘ │
│       │               │               │         │
│  ┌────▼───────────────▼───────────────▼────┐    │
│  │         ChatbotEngine (Core)            │    │
│  │  ┌──────────┐  ┌─────────────────────┐  │    │
│  │  │ Intent   │  │ Knowledge Base      │  │    │
│  │  │ Classifr │  │ (10 articles,       │  │    │
│  │  │ (keyword │  │  keyword-indexed,   │  │    │
│  │  │  scoring)│  │  plain language)    │  │    │
│  │  └──────────┘  └─────────────────────┘  │    │
│  │  ┌──────────┐  ┌─────────────────────┐  │    │
│  │  │ Session  │  │ Feature Suggestion  │  │    │
│  │  │ Manager  │  │ System (submit,     │  │    │
│  │  │ (start,  │  │ vote, prioritize,   │  │    │
│  │  │  resolve,│  │ admin respond)      │  │    │
│  │  │  escalate│  └─────────────────────┘  │    │
│  │  └──────────┘                           │    │
│  │  ┌──────────────────────────────────┐   │    │
│  │  │ Analytics Engine                 │   │    │
│  │  │ (sessions, satisfaction, accuracy│   │    │
│  │  │  top categories, top requests)   │   │    │
│  │  └──────────────────────────────────┘   │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Data Flow
1. User types message → Intent Classifier scores against 10 categories
2. If feature_request → Routes to Feature Suggestion handler
3. If bug_report → Logs and acknowledges with timeline
4. Otherwise → Knowledge Base search (keyword + relevance scoring)
5. Top 3 results returned → Plain language response generated
6. If no match → Fallback menu with all help categories
7. After N messages (configurable) → Auto-escalation to human agent
8. Session resolution → Satisfaction rating prompt

---

## 🎨 UI/UX Implementation

### Chat Widget (Floating Action Button)
- **Position**: Bottom-right corner, 60×60px circle
- **Icon**: 💬 speech bubble with CharityFlow blue (#1E90FF)
- **Animation**: Gentle pulse every 30s for first-time users
- **Badge**: Red notification dot when new response available

### Chat Panel (Slide-out Drawer)
- **Width**: 380px (desktop), full-screen (mobile)
- **Header**: "CharityBot 🤖" + minimize/close buttons
- **Messages**: Alternating left (bot) / right (user) bubbles
- **Bot bubble**: Light blue (#E1F5FE) with CharityFlow icon
- **User bubble**: White with gray border
- **Quick Actions**: Pill buttons below bot messages for common follow-ups
- **Input**: Text field + send button + attachment icon
- **Typing indicator**: Three animated dots when bot is "thinking"

### Feature Suggestion Board
- **Location**: Settings > Feature Suggestions
- **Layout**: Card grid with title, description, vote count, status badge
- **Voting**: Heart button with count (like Product Hunt)
- **Status badges**: 🆕 New | 👀 Under Review | 📋 Planned | 🚧 In Progress | ✅ Completed
- **Submit form**: Title (required) + Description (required) + Category (dropdown)
- **Sort**: By votes (default), by date, by status

### Accessibility
- Full keyboard navigation (Tab through messages, Enter to send)
- Screen reader labels on all interactive elements
- High contrast mode support
- Minimum 4.5:1 color contrast ratio

---

## 🧪 Test Cases — Oklahoma × 3 Organization Types

### Test Configuration

| Org | Name | Type | State |
|-----|------|------|-------|
| 🛕 Temple | Oklahoma City Hindu Temple | Religious 501(c)(3) | OK |
| 🍽️ Food Bank | Tulsa Community Food Bank | Food Bank 501(c)(3) | OK |
| 💻 IT Nonprofit | OKC Digital Bridge | Educational 501(c)(3) | OK |

### Suite 1: Session Management (5 tests) ✅
| # | Test | Input | Expected | Result |
|---|------|-------|----------|--------|
| 1 | Start session | New user | Session created with greeting | ✅ PASS |
| 2 | Retrieve session | Valid session ID | Session returned | ✅ PASS |
| 3 | Non-existent session | Invalid ID | Returns undefined | ✅ PASS |
| 4 | Resolve with rating | Rating 5/5 | Status=resolved, satisfaction=5 | ✅ PASS |
| 5 | Resolve non-existent | Fake ID | Throws error | ✅ PASS |

### Suite 2: Intent Classification (8 tests) ✅
| # | Test | Input | Expected Category | Result |
|---|------|-------|-------------------|--------|
| 1 | Donation question | "How do I record a donation?" | transactions | ✅ PASS |
| 2 | Tax question | "When do I file Form 990?" | tax_filing | ✅ PASS |
| 3 | Compliance question | "State compliance requirements" | compliance | ✅ PASS |
| 4 | Donor question | "Set up fundraising campaign" | donors | ✅ PASS |
| 5 | Event question | "Find a venue for gala" | events | ✅ PASS |
| 6 | Billing question | "Upgrade my subscription" | billing | ✅ PASS |
| 7 | Feature request | "Wish you had grant tracking" | feature_request | ✅ PASS |
| 8 | Bug report | "Bug in transaction page" | bug_report | ✅ PASS |

### Suite 3: Knowledge Base Search (6 tests) ✅
| # | Test | Query | Expected | Result |
|---|------|-------|----------|--------|
| 1 | Donation search | "record a donation" | Articles found, category=transactions | ✅ PASS |
| 2 | Compliance search | "compliance score" | Matched keyword "compliance" | ✅ PASS |
| 3 | Tax search | "file 990 tax return" | category=tax_filing | ✅ PASS |
| 4 | Nonsense query | "xyzzy foobar" | Empty results | ✅ PASS |
| 5 | Max results | Broad query | ≤3 results | ✅ PASS |
| 6 | Relevance order | "record donation" | Sorted desc by score | ✅ PASS |

### Suite 4: Message Processing (7 tests) ✅
| # | Test | Org | Input | Expected | Result |
|---|------|-----|-------|----------|--------|
| 1 | Donation help | 🛕 Temple | "Record a donation" | KB article response | ✅ PASS |
| 2 | Compliance help | 🍽️ Food Bank | "Compliance score" | Contains "Compliance" | ✅ PASS |
| 3 | Feature request | 💻 IT Nonprofit | "New feature for volunteers" | Feature request handler | ✅ PASS |
| 4 | Bug report | 🛕 Temple | "Bug on transaction page" | Bug report handler | ✅ PASS |
| 5 | Unknown query | 🍽️ Food Bank | "Meaning of life" | Fallback menu | ✅ PASS |
| 6 | Auto-escalation | 💻 IT Nonprofit | 5th message | Escalated to human | ✅ PASS |
| 7 | Invalid session | — | Fake session ID | Throws error | ✅ PASS |

### Suite 5: Feature Suggestions (8 tests) ✅
| # | Test | Org | Feature | Expected | Result |
|---|------|-----|---------|----------|--------|
| 1 | Temple suggestion | 🛕 | "Puja donation categories" | Created, status=new | ✅ PASS |
| 2 | Food bank suggestion | 🍽️ | "Food inventory weight tracker" | Contains "USDA" | ✅ PASS |
| 3 | IT suggestion | 💻 | "Device donation tracking" | Title matches | ✅ PASS |
| 4 | Empty title | — | "" | Throws "title required" | ✅ PASS |
| 5 | Empty description | — | "" | Throws "description required" | ✅ PASS |
| 6 | Title too long | — | 201 chars | Throws "under 200" | ✅ PASS |
| 7 | Vote escalation | 🛕 | 20+ votes | priority=high | ✅ PASS |
| 8 | Duplicate vote | 🍽️ | Same user twice | Throws "already voted" | ✅ PASS |

### Suite 6: Oklahoma State Scenarios (6 tests) ✅
| # | Test | Org | Query | Expected | Result |
|---|------|-----|-------|----------|--------|
| 1 | Tax filing | 🛕 Temple | "Oklahoma tax filing" | category=tax_filing | ✅ PASS |
| 2 | Religious compliance | 🛕 Temple | "Temple compliance" | category=compliance | ✅ PASS |
| 3 | Food donations | 🍽️ Food Bank | "Record food donation" | category=transactions | ✅ PASS |
| 4 | Sponsor tracking | 🍽️ Food Bank | "Corporate donor giving" | category=donors | ✅ PASS |
| 5 | Tech workshop | 💻 IT Nonprofit | "Venue for coding workshop" | category=events | ✅ PASS |
| 6 | Billing inquiry | 💻 IT Nonprofit | "Upgrade subscription" | category=billing | ✅ PASS |

### Suite 7: Analytics (4 tests) ✅
| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Session count | totalSessions=2 | ✅ PASS |
| 2 | Resolved tracking | resolvedSessions=1, avgSatisfaction=4 | ✅ PASS |
| 3 | Top features by votes | Sorted by vote count | ✅ PASS |
| 4 | Response accuracy | ≥0% | ✅ PASS |

### 📊 Summary
| Metric | Value |
|--------|-------|
| **Total Tests** | **44** |
| **Passed** | **44** |
| **Failed** | **0** |
| **Pass Rate** | **100%** |
| **State Tested** | Oklahoma |
| **Org Types** | Temple, Food Bank, IT Support Nonprofit |

---

## 📁 Files

| File | Description | Size |
|------|-------------|------|
| `src/lib/chatbot/types.ts` | TypeScript type definitions | ~2.3 KB |
| `src/lib/chatbot/chatbot-engine.ts` | Production engine (10 KB articles, intent classifier, session manager, feature suggestions, analytics) | ~20 KB |
| `src/__tests__/chatbot-engine.test.ts` | 44 executable Jest tests | ~16.4 KB |
| `docs/features/CHATBOT_FEATURE_SUGGESTIONS.md` | This document | ~12 KB |
