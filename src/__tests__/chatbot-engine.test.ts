// src/__tests__/chatbot-engine.test.ts
// CharityFlow Chatbot + Feature Suggestion System — Executable Tests
// Includes: Oklahoma state × 3 org types (Temple, Food Bank, IT Support Nonprofit)

import { ChatbotEngine } from '../lib/chatbot/chatbot-engine';
import { ChatbotConfig, FeatureSuggestionInput } from '../lib/chatbot/types';

// ═══════════════════════════════════════════════════════════════
// TEST CONFIGURATIONS — 3 Oklahoma Org Types
// ═══════════════════════════════════════════════════════════════

const oklahomaTemple: ChatbotConfig = {
  orgId: 'ok-temple-001', orgName: 'Oklahoma City Hindu Temple',
  orgType: 'religious_501c3', state: 'OK', enableAI: true,
  enableFeatureSuggestions: true, autoEscalateAfter: 5,
  businessHours: { start: 8, end: 18 }
};

const oklahomaFoodBank: ChatbotConfig = {
  orgId: 'ok-foodbank-001', orgName: 'Tulsa Community Food Bank',
  orgType: 'food_bank_501c3', state: 'OK', enableAI: true,
  enableFeatureSuggestions: true, autoEscalateAfter: 5,
  businessHours: { start: 7, end: 20 }
};

const oklahomaITSupport: ChatbotConfig = {
  orgId: 'ok-it-001', orgName: 'OKC Digital Bridge',
  orgType: 'educational_501c3', state: 'OK', enableAI: true,
  enableFeatureSuggestions: true, autoEscalateAfter: 5,
  businessHours: { start: 9, end: 17 }
};

// ═══════════════════════════════════════════════════════════════
// SUITE 1: SESSION MANAGEMENT (5 tests)
// ═══════════════════════════════════════════════════════════════

describe('Chatbot Session Management', () => {
  test('starts session with greeting message', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('user-001');
    expect(session.id).toBeTruthy();
    expect(session.status).toBe('active');
    expect(session.messages.length).toBe(1);
    expect(session.messages[0].role).toBe('bot');
    expect(session.messages[0].content).toContain('CharityBot');
  });

  test('retrieves existing session', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const session = bot.startSession('user-002');
    const retrieved = bot.getSession(session.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(session.id);
  });

  test('returns undefined for non-existent session', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    expect(bot.getSession('non-existent')).toBeUndefined();
  });

  test('resolves session with satisfaction rating', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('user-003');
    const resolved = bot.resolveSession(session.id, 5);
    expect(resolved.status).toBe('resolved');
    expect(resolved.satisfaction).toBe(5);
    expect(resolved.resolvedAt).toBeDefined();
  });

  test('throws error when resolving non-existent session', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    expect(() => bot.resolveSession('fake-id')).toThrow('not found');
  });
});

// ═══════════════════════════════════════════════════════════════
// SUITE 2: INTENT CLASSIFICATION (8 tests)
// ═══════════════════════════════════════════════════════════════

describe('Intent Classification', () => {
  const bot = new ChatbotEngine(oklahomaTemple);

  test('classifies donation questions as transactions', () => {
    expect(bot.classifyIntent('How do I record a donation?')).toBe('transactions');
  });

  test('classifies tax questions as tax_filing', () => {
    expect(bot.classifyIntent('When do I file Form 990?')).toBe('tax_filing');
  });

  test('classifies compliance questions', () => {
    expect(bot.classifyIntent('What are my state compliance requirements?')).toBe('compliance');
  });

  test('classifies donor management questions', () => {
    expect(bot.classifyIntent('How do I set up a fundraising campaign?')).toBe('donors');
  });

  test('classifies event questions', () => {
    expect(bot.classifyIntent('I need to find a venue for our gala')).toBe('events');
  });

  test('classifies billing questions', () => {
    expect(bot.classifyIntent('How do I upgrade my subscription plan?')).toBe('billing');
  });

  test('classifies feature requests', () => {
    expect(bot.classifyIntent('I wish you had a new feature for grant tracking')).toBe('feature_request');
  });

  test('classifies bug reports', () => {
    expect(bot.classifyIntent('There is a bug in the transaction page, it is broken')).toBe('bug_report');
  });
});

// ═══════════════════════════════════════════════════════════════
// SUITE 3: KNOWLEDGE BASE SEARCH (6 tests)
// ═══════════════════════════════════════════════════════════════

describe('Knowledge Base Search', () => {
  const bot = new ChatbotEngine(oklahomaFoodBank);

  test('finds relevant articles for donation queries', () => {
    const results = bot.searchKnowledgeBase('How do I record a donation?');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].article.category).toBe('transactions');
  });

  test('finds compliance articles', () => {
    const results = bot.searchKnowledgeBase('What does my compliance score mean?');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchedKeywords).toContain('compliance');
  });

  test('finds tax filing articles', () => {
    const results = bot.searchKnowledgeBase('How to file 990 tax return with IRS');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].article.category).toBe('tax_filing');
  });

  test('returns empty for nonsense queries', () => {
    const results = bot.searchKnowledgeBase('xyzzy foobar baz');
    expect(results.length).toBe(0);
  });

  test('limits results to 3', () => {
    const results = bot.searchKnowledgeBase('money donation expense payment record');
    expect(results.length).toBeLessThanOrEqual(3);
  });

  test('sorts by relevance score descending', () => {
    const results = bot.searchKnowledgeBase('record a donation');
    if (results.length > 1) {
      expect(results[0].relevanceScore).toBeGreaterThanOrEqual(results[1].relevanceScore);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// SUITE 4: MESSAGE PROCESSING (7 tests)
// ═══════════════════════════════════════════════════════════════

describe('Message Processing', () => {
  test('responds to donation question with KB article', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('user-004');
    const response = bot.processMessage(session.id, 'How do I record a donation?');
    expect(response.role).toBe('bot');
    expect(response.content).toBeTruthy();
    expect(response.category).toBe('transactions');
  });

  test('responds to compliance question for food bank', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const session = bot.startSession('user-005');
    const response = bot.processMessage(session.id, 'What is my compliance score?');
    expect(response.role).toBe('bot');
    expect(response.content).toContain('Compliance');
  });

  test('handles feature request intent', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    const session = bot.startSession('user-006');
    const response = bot.processMessage(session.id, 'I wish you had a new feature for tracking volunteers');
    expect(response.category).toBe('feature_request');
    expect(response.content).toContain('suggestion');
  });

  test('handles bug report intent', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('user-007');
    const response = bot.processMessage(session.id, 'There is a bug on the transaction page, it is broken');
    expect(response.category).toBe('bug_report');
    expect(response.content).toContain('Bug Report');
  });

  test('provides fallback for unknown queries', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const session = bot.startSession('user-008');
    const response = bot.processMessage(session.id, 'What is the meaning of life?');
    expect(response.content).toContain('help with');
  });

  test('auto-escalates after threshold messages', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    const session = bot.startSession('user-009');
    // Send 5 messages to trigger escalation (autoEscalateAfter: 5)
    for (let i = 0; i < 4; i++) {
      bot.processMessage(session.id, `Question ${i + 1} about something`);
    }
    const response = bot.processMessage(session.id, 'Fifth question triggers escalation');
    expect(response.escalated).toBe(true);
    expect(session.status).toBe('escalated');
  });

  test('throws on message to non-existent session', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    expect(() => bot.processMessage('fake-session', 'hello')).toThrow('not found');
  });
});

// ═══════════════════════════════════════════════════════════════
// SUITE 5: FEATURE SUGGESTIONS (8 tests)
// ═══════════════════════════════════════════════════════════════

describe('Feature Suggestion System', () => {
  test('OK Temple — submits feature suggestion', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const suggestion = bot.submitFeatureSuggestion(
      { title: 'Add puja donation categories', description: 'We need specific categories for different types of religious offerings and puja donations' },
      'user-temple-01', 'ok-temple-001'
    );
    expect(suggestion.id).toBeTruthy();
    expect(suggestion.status).toBe('new');
    expect(suggestion.votes).toBe(1);
    expect(suggestion.title).toBe('Add puja donation categories');
  });

  test('OK Food Bank — submits feature suggestion', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const suggestion = bot.submitFeatureSuggestion(
      { title: 'Food inventory weight tracker', description: 'Track pounds of food donated and distributed for USDA reporting requirements' },
      'user-fb-01', 'ok-foodbank-001'
    );
    expect(suggestion.category).toBeDefined();
    expect(suggestion.description).toContain('USDA');
  });

  test('OK IT Nonprofit — submits feature suggestion', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    const suggestion = bot.submitFeatureSuggestion(
      { title: 'Device donation tracking', description: 'Track donated computers and laptops with serial numbers and recipient assignment for grant reporting' },
      'user-it-01', 'ok-it-001'
    );
    expect(suggestion.title).toBe('Device donation tracking');
  });

  test('rejects empty title', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    expect(() => bot.submitFeatureSuggestion(
      { title: '', description: 'Some description' },
      'user-01', 'org-01'
    )).toThrow('title is required');
  });

  test('rejects empty description', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    expect(() => bot.submitFeatureSuggestion(
      { title: 'Good title', description: '' },
      'user-01', 'org-01'
    )).toThrow('description is required');
  });

  test('rejects title over 200 characters', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    expect(() => bot.submitFeatureSuggestion(
      { title: 'A'.repeat(201), description: 'Description' },
      'user-01', 'org-01'
    )).toThrow('under 200 characters');
  });

  test('voting increments count and auto-escalates priority', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const suggestion = bot.submitFeatureSuggestion(
      { title: 'Multi-language support', description: 'Support Hindi, Spanish, Vietnamese for diverse congregations' },
      'user-01', 'ok-temple-001'
    );
    // Simulate 19 more votes (total 20 -> high priority)
    for (let i = 2; i <= 20; i++) {
      bot.voteForFeature(suggestion.id, `user-${String(i).padStart(2, '0')}`);
    }
    const updated = bot.voteForFeature(suggestion.id, 'user-21');
    expect(updated.votes).toBe(21);
    expect(updated.priority).toBe('high');
  });

  test('prevents duplicate voting', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const suggestion = bot.submitFeatureSuggestion(
      { title: 'Volunteer hour tracking', description: 'Track volunteer hours for grant reporting' },
      'user-fb-01', 'ok-foodbank-001'
    );
    expect(() => bot.voteForFeature(suggestion.id, 'user-fb-01')).toThrow('already voted');
  });
});

// ═══════════════════════════════════════════════════════════════
// SUITE 6: OKLAHOMA STATE-SPECIFIC SCENARIOS (6 tests)
// ═══════════════════════════════════════════════════════════════

describe('Oklahoma State — 3 Org Type Scenarios', () => {
  test('OK Temple — asks about Oklahoma tax filing requirements', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('temple-user-01');
    const response = bot.processMessage(session.id, 'When do I need to file my tax return in Oklahoma?');
    expect(response.role).toBe('bot');
    expect(response.category).toBe('tax_filing');
    expect(response.content).toBeTruthy();
  });

  test('OK Temple — asks about compliance for religious org', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('temple-user-02');
    const response = bot.processMessage(session.id, 'What are the compliance requirements for our temple?');
    expect(response.category).toBe('compliance');
  });

  test('OK Food Bank — asks about recording food donations', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const session = bot.startSession('fb-user-01');
    const response = bot.processMessage(session.id, 'How do I record a food donation from a local grocery store?');
    expect(response.category).toBe('transactions');
    expect(response.content).toBeTruthy();
  });

  test('OK Food Bank — asks about donor management for sponsors', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const session = bot.startSession('fb-user-02');
    const response = bot.processMessage(session.id, 'How do I track our corporate donor giving history?');
    expect(response.category).toBe('donors');
  });

  test('OK IT Nonprofit — asks about event planning for tech workshop', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    const session = bot.startSession('it-user-01');
    const response = bot.processMessage(session.id, 'We need to find a venue for our coding workshop event');
    expect(response.category).toBe('events');
    expect(response.content).toBeTruthy();
  });

  test('OK IT Nonprofit — reports billing issue', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    const session = bot.startSession('it-user-02');
    const response = bot.processMessage(session.id, 'I need to upgrade my subscription plan');
    expect(response.category).toBe('billing');
  });
});

// ═══════════════════════════════════════════════════════════════
// SUITE 7: ANALYTICS (4 tests)
// ═══════════════════════════════════════════════════════════════

describe('Chatbot Analytics', () => {
  test('tracks session counts', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    bot.startSession('user-a1');
    bot.startSession('user-a2');
    const analytics = bot.getAnalytics();
    expect(analytics.totalSessions).toBe(2);
  });

  test('tracks resolved sessions', () => {
    const bot = new ChatbotEngine(oklahomaFoodBank);
    const s1 = bot.startSession('user-b1');
    bot.resolveSession(s1.id, 4);
    const analytics = bot.getAnalytics();
    expect(analytics.resolvedSessions).toBe(1);
    expect(analytics.avgSatisfaction).toBe(4);
  });

  test('returns top feature requests sorted by votes', () => {
    const bot = new ChatbotEngine(oklahomaITSupport);
    bot.submitFeatureSuggestion({ title: 'Feature A', description: 'Desc A' }, 'u1', 'org1');
    const featB = bot.submitFeatureSuggestion({ title: 'Feature B', description: 'Desc B' }, 'u2', 'org1');
    bot.voteForFeature(featB.id, 'u3');
    const top = bot.getTopFeatureRequests();
    expect(top[0].title).toBe('Feature B');
    expect(top[0].votes).toBe(2);
  });

  test('calculates response accuracy', () => {
    const bot = new ChatbotEngine(oklahomaTemple);
    const session = bot.startSession('user-c1');
    bot.processMessage(session.id, 'How do I record a donation?');
    const analytics = bot.getAnalytics();
    expect(analytics.responseAccuracy).toBeGreaterThanOrEqual(0);
  });
});
