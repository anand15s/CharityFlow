import { ChatbotEngine, ChatSession, FeatureSuggestion } from '../lib/chatbot/chatbot-engine';

describe('Customer Chatbot & Feature Suggestions', () => {
  let chatbot: ChatbotEngine;

  beforeEach(() => {
    chatbot = new ChatbotEngine();
  });

  describe('Session Management', () => {
    it('should start a new chat session', () => {
      const session = chatbot.startSession({ userId: 'user-1', orgId: 'org-1' });
      expect(session.id).toBeDefined();
      expect(session.status).toBe('active');
    });

    it('should end session with satisfaction rating', () => {
      const session = chatbot.startSession({ userId: 'user-1', orgId: 'org-1' });
      const ended = chatbot.endSession(session.id, { rating: 5, resolved: true });
      expect(ended.status).toBe('resolved');
      expect(ended.rating).toBe(5);
    });

    it('should auto-escalate after max messages', () => {
      const session = chatbot.startSession({ userId: 'user-1', orgId: 'org-1' });
      for (let i = 0; i < 10; i++) {
        chatbot.processMessage(session.id, `Question ${i}`);
      }
      const updated = chatbot.getSession(session.id);
      expect(updated.escalated).toBe(true);
    });
  });

  describe('Intent Classification', () => {
    it('should classify transaction questions', () => {
      expect(chatbot.classifyIntent('How do I record a donation?')).toBe('transactions');
    });

    it('should classify compliance questions', () => {
      expect(chatbot.classifyIntent('When is my Form 990 due?')).toBe('compliance');
    });

    it('should classify tax questions', () => {
      expect(chatbot.classifyIntent('How do I maximize tax deductions?')).toBe('tax');
    });

    it('should classify donor questions', () => {
      expect(chatbot.classifyIntent('How do I send a thank you to donors?')).toBe('donors');
    });

    it('should classify event questions', () => {
      expect(chatbot.classifyIntent('How do I plan a fundraiser event?')).toBe('events');
    });
  });

  describe('Knowledge Base Search', () => {
    it('should find relevant help articles', () => {
      const results = chatbot.searchKnowledge('record donation');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].relevanceScore).toBeGreaterThan(0.5);
    });

    it('should return empty for irrelevant queries', () => {
      const results = chatbot.searchKnowledge('quantum physics dark matter');
      expect(results.length).toBe(0);
    });
  });

  describe('Feature Suggestions', () => {
    it('should submit a feature suggestion', () => {
      const suggestion = chatbot.submitFeatureSuggestion({
        title: 'Add payroll integration', description: 'Would love to run payroll directly',
        userId: 'user-1', category: 'integrations'
      });
      expect(suggestion.id).toBeDefined();
      expect(suggestion.votes).toBe(1);
      expect(suggestion.status).toBe('new');
    });

    it('should allow voting on suggestions', () => {
      const suggestion = chatbot.submitFeatureSuggestion({
        title: 'Dark mode', description: 'Please add dark mode', userId: 'user-1', category: 'ui'
      });
      chatbot.voteFeature(suggestion.id, 'user-2');
      chatbot.voteFeature(suggestion.id, 'user-3');
      const updated = chatbot.getFeatureSuggestion(suggestion.id);
      expect(updated.votes).toBe(3);
    });

    it('should prevent duplicate votes', () => {
      const suggestion = chatbot.submitFeatureSuggestion({
        title: 'Export CSV', description: 'Export data as CSV', userId: 'user-1', category: 'reporting'
      });
      chatbot.voteFeature(suggestion.id, 'user-2');
      chatbot.voteFeature(suggestion.id, 'user-2');
      const updated = chatbot.getFeatureSuggestion(suggestion.id);
      expect(updated.votes).toBe(2);
    });

    it('should auto-escalate priority at 20+ votes', () => {
      const suggestion = chatbot.submitFeatureSuggestion({
        title: 'Mobile app', description: 'Native mobile app', userId: 'user-1', category: 'platform'
      });
      for (let i = 2; i <= 25; i++) {
        chatbot.voteFeature(suggestion.id, `user-${i}`);
      }
      const updated = chatbot.getFeatureSuggestion(suggestion.id);
      expect(updated.priority).toBe('high');
    });
  });

  // Oklahoma state tests
  describe('Oklahoma — Temple Chatbot (OK-T1)', () => {
    it('should answer temple tax filing question', () => {
      const session = chatbot.startSession({ userId: 'temple-treasurer', orgId: 'ok-temple' });
      const response = chatbot.processMessage(session.id, 'When do we need to file our annual tax report in Oklahoma?');
      expect(response.message).toBeDefined();
      expect(response.intent).toBe('compliance');
    });
  });

  describe('Oklahoma — Food Bank Chatbot (OK-FB1)', () => {
    it('should answer food bank donation tracking question', () => {
      const session = chatbot.startSession({ userId: 'fb-manager', orgId: 'ok-foodbank' });
      const response = chatbot.processMessage(session.id, 'How do I track in-kind food donations?');
      expect(response.message).toBeDefined();
      expect(response.intent).toBe('transactions');
    });
  });

  describe('Oklahoma — IT Nonprofit Chatbot (OK-IT1)', () => {
    it('should handle feature request from IT nonprofit', () => {
      const suggestion = chatbot.submitFeatureSuggestion({
        title: 'GitHub integration for volunteer tracking',
        description: 'Track volunteer developer hours via GitHub commits',
        userId: 'it-admin', category: 'integrations'
      });
      expect(suggestion.title).toContain('GitHub');
      expect(suggestion.status).toBe('new');
    });
  });
});
