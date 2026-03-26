// src/lib/chatbot/chatbot-engine.ts
// CharityFlow Customer Help Chatbot + Feature Suggestion System — Production Engine

import {
  ChatMessage, ChatSession, ChatbotConfig, HelpArticle,
  FeatureSuggestion, FeatureSuggestionInput, MessageCategory,
  KnowledgeBaseSearchResult, ChatbotAnalytics
} from './types';

// ═══════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Built-in help articles with plain language
// ═══════════════════════════════════════════════════════════════

const KNOWLEDGE_BASE: HelpArticle[] = [
  {
    id: 'kb-001', title: 'How to Record a Donation',
    plainLanguageTitle: 'Adding Money That Came In',
    content: 'Go to Money Tracker > Click "+ Add Money In" > Select "Donation" > Enter donor name, amount, and date > Save. The system auto-generates a tax receipt for your donor.',
    category: 'transactions', keywords: ['donation', 'record', 'add', 'money', 'income', 'gift', 'contribution'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-002', title: 'How to Record an Expense',
    plainLanguageTitle: 'Adding Money That Went Out',
    content: 'Go to Money Tracker > Click "+ Add Money Out" > Select category (e.g., "Office Supplies", "Event Costs") > Enter vendor, amount, date > Attach receipt photo > Save.',
    category: 'transactions', keywords: ['expense', 'payment', 'bill', 'cost', 'spend', 'vendor', 'receipt'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-003', title: 'Understanding Your Compliance Score',
    plainLanguageTitle: 'What Does My Compliance Score Mean?',
    content: 'Your Compliance Score (0-100%) shows how well your organization meets federal and state requirements. Green (80-100%) = On Track. Yellow (50-79%) = Needs Attention. Red (0-49%) = Action Required. Click any item to see what to do.',
    category: 'compliance', keywords: ['compliance', 'score', 'health', 'status', 'requirements', 'regulations'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-004', title: 'Filing Your Annual Tax Report (Form 990)',
    plainLanguageTitle: 'How to File Your Annual Tax Report',
    content: 'Go to Tax Center > Click "Generate Annual Tax Report" > CharityFlow auto-selects the right form (990-N, 990-EZ, or 990) based on your revenue > Review the pre-filled form > Click "File Now" for e-filing.',
    category: 'tax_filing', keywords: ['990', 'tax', 'filing', 'annual', 'report', 'irs', 'return'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-005', title: 'Managing Donors and Campaigns',
    plainLanguageTitle: 'How to Track Your Supporters',
    content: 'Go to Donor Hub > View all donors with giving history > Click "+ New Campaign" to start a fundraiser > Share the campaign link > Track progress with the thermometer > Auto-send thank-you emails.',
    category: 'donors', keywords: ['donor', 'campaign', 'fundraising', 'supporters', 'giving', 'crm'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-006', title: 'Planning a Local Event',
    plainLanguageTitle: 'How to Plan a Successful Event',
    content: 'Go to Events > Click "+ Plan Event" > Enter event details > Use Venue Finder for local spaces > Check Permits tab for required permits > Use Budget tab to track costs > After event, view ROI Analysis.',
    category: 'events', keywords: ['event', 'plan', 'venue', 'permit', 'fundraiser', 'gala', 'auction'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-007', title: 'Setting Up Board Meetings',
    plainLanguageTitle: 'How to Run Board Meetings',
    content: 'Go to Board Room > Click "+ Schedule Meeting" > Add agenda items > Invite board members > During meeting, take minutes > After meeting, conduct votes > Minutes auto-saved and shared.',
    category: 'general', keywords: ['board', 'meeting', 'minutes', 'agenda', 'vote', 'governance'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-008', title: 'Understanding Your Utility Bills',
    plainLanguageTitle: 'How to Track Building Costs',
    content: 'Go to Money Tracker > Utilities tab > Link your utility providers > Bills auto-import monthly > View quarterly comparison > Get alerts when costs spike > Annual summary for tax reporting.',
    category: 'transactions', keywords: ['utility', 'bills', 'electric', 'water', 'gas', 'internet', 'building'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-009', title: 'Subscription and Billing',
    plainLanguageTitle: 'Managing Your CharityFlow Account',
    content: 'Go to Settings > Billing > View current plan ($79/mo Starter, $149/mo Growth, $199/mo Pro) > Update payment method > Download invoices > Cancel or upgrade anytime.',
    category: 'billing', keywords: ['billing', 'subscription', 'plan', 'payment', 'invoice', 'upgrade', 'cancel', 'price'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  },
  {
    id: 'kb-010', title: 'Role-Based Access Control',
    plainLanguageTitle: 'Who Can See What in CharityFlow',
    content: 'Go to Team > Manage Roles > Admin (full access), Treasurer (finances + compliance), Board Member (reports + meetings), Staff (assigned areas), Volunteer (limited view). Each role gets customized notifications.',
    category: 'account', keywords: ['role', 'access', 'permission', 'team', 'member', 'admin', 'volunteer'],
    views: 0, helpfulVotes: 0, lastUpdated: new Date()
  }
];

// ═══════════════════════════════════════════════════════════════
// INTENT CLASSIFICATION — Keyword-based routing
// ═══════════════════════════════════════════════════════════════

const INTENT_KEYWORDS: Record<MessageCategory, string[]> = {
  transactions: ['transaction', 'donation', 'expense', 'money', 'payment', 'record', 'receipt', 'bank', 'reconcile', 'utility', 'bill'],
  compliance: ['compliance', 'regulation', 'law', 'requirement', 'filing', 'deadline', 'state', 'score', 'health'],
  tax_filing: ['tax', '990', 'irs', 'filing', 'form', 'return', 'exempt', 'ubit', 'deduction'],
  donors: ['donor', 'campaign', 'fundrais', 'giving', 'supporter', 'contribution', 'peer-to-peer', 'p2p'],
  events: ['event', 'venue', 'permit', 'gala', 'auction', 'festival', 'sponsor'],
  billing: ['billing', 'subscription', 'plan', 'payment method', 'invoice', 'upgrade', 'cancel', 'price', 'cost'],
  account: ['account', 'password', 'login', 'role', 'access', 'permission', 'team', 'member', 'setting'],
  feature_request: ['feature', 'suggestion', 'request', 'wish', 'would be nice', 'add', 'new feature', 'idea', 'improve'],
  bug_report: ['bug', 'error', 'broken', 'not working', 'issue', 'problem', 'crash', 'fix', 'wrong'],
  general: ['help', 'how', 'what', 'where', 'when', 'why', 'guide', 'tutorial']
};

// ═══════════════════════════════════════════════════════════════
// PLAIN LANGUAGE RESPONSES — Friendly, jargon-free
// ═══════════════════════════════════════════════════════════════

const GREETING_RESPONSES = [
  "Hi there! 👋 I\'m CharityBot, your nonprofit helper. I can answer questions about CharityFlow, help troubleshoot issues, or take your feature suggestions. What can I help with?",
  "Welcome! 😊 I\'m here to help you get the most out of CharityFlow. Ask me anything about managing your nonprofit — from tracking donations to filing taxes!",
  "Hello! 🌟 Need help with CharityFlow? I can guide you through any feature, explain how things work in plain language, or take note of improvements you\'d like to see."
];

const ESCALATION_RESPONSE = "I want to make sure you get the best help possible. Let me connect you with a human team member who can assist you further. 🙋 A support agent will be with you shortly!";

const SATISFACTION_PROMPT = "Was this helpful? Rate your experience: ⭐⭐⭐⭐⭐ (1-5)";

// ═══════════════════════════════════════════════════════════════
// CORE ENGINE
// ═══════════════════════════════════════════════════════════════

export class ChatbotEngine {
  private sessions: Map<string, ChatSession> = new Map();
  private suggestions: Map<string, FeatureSuggestion> = new Map();
  private config: ChatbotConfig;

  constructor(config: ChatbotConfig) {
    this.config = config;
  }

  // --- Session Management ---

  startSession(userId: string): ChatSession {
    const session: ChatSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      orgId: this.config.orgId,
      userId,
      status: 'active',
      startedAt: new Date(),
      messages: [],
      tags: []
    };

    // Add greeting
    const greeting = this.createBotMessage(
      session.id,
      GREETING_RESPONSES[Math.floor(Math.random() * GREETING_RESPONSES.length)]
    );
    session.messages.push(greeting);
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  resolveSession(sessionId: string, satisfaction?: 1 | 2 | 3 | 4 | 5): ChatSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.status = 'resolved';
    session.resolvedAt = new Date();
    if (satisfaction) session.satisfaction = satisfaction;

    // Add satisfaction prompt
    session.messages.push(this.createBotMessage(session.id, SATISFACTION_PROMPT));
    return session;
  }

  // --- Message Processing ---

  processMessage(sessionId: string, userMessage: string): ChatMessage {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);
    if (session.status !== 'active') throw new Error(`Session ${sessionId} is ${session.status}`);

    // Record user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sessionId,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    session.messages.push(userMsg);

    // Classify intent
    const category = this.classifyIntent(userMessage);
    userMsg.category = category;

    // Check for escalation trigger
    const userMessageCount = session.messages.filter(m => m.role === 'user').length;
    if (userMessageCount >= this.config.autoEscalateAfter) {
      return this.escalateSession(session);
    }

    // Handle feature request
    if (category === 'feature_request') {
      return this.handleFeatureRequest(session, userMessage);
    }

    // Handle bug report
    if (category === 'bug_report') {
      return this.handleBugReport(session, userMessage);
    }

    // Search knowledge base
    const results = this.searchKnowledgeBase(userMessage);

    if (results.length > 0) {
      const topResult = results[0];
      topResult.article.views++;

      const response = this.createBotMessage(
        sessionId,
        `📖 **${topResult.article.plainLanguageTitle}**\n\n${topResult.article.content}\n\n${results.length > 1 ? `I also found ${results.length - 1} related article(s). Would you like to see them?` : 'Did this answer your question?'}`,
        category,
        topResult.relevanceScore
      );
      response.suggestedArticles = results.map(r => r.article);
      session.messages.push(response);
      return response;
    }

    // No match — offer general help
    const fallback = this.createBotMessage(
      sessionId,
      "I\'m not sure I have a specific answer for that. Here\'s what I can help with:\n\n• 💳 **Money Tracker** — Recording donations & expenses\n• 📋 **Compliance** — State requirements & deadlines\n• 🧾 **Tax Filing** — Form 990 & tax optimization\n• ❤️ **Donors** — Managing supporters & campaigns\n• 🎪 **Events** — Planning local events\n• 💡 **Feature Suggestions** — Tell me what you\'d like to see!\n\nOr type **\"talk to a human\"** to connect with our support team.",
      category,
      0
    );
    session.messages.push(fallback);
    return fallback;
  }

  // --- Intent Classification ---

  classifyIntent(message: string): MessageCategory {
    const lower = message.toLowerCase();
    const scores: Partial<Record<MessageCategory, number>> = {};

    for (const [category, keywords] of Object.entries(INTENT_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lower.includes(keyword)) score++;
      }
      if (score > 0) scores[category as MessageCategory] = score;
    }

    if (Object.keys(scores).length === 0) return 'general';

    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as MessageCategory;
  }

  // --- Knowledge Base Search ---

  searchKnowledgeBase(query: string): KnowledgeBaseSearchResult[] {
    const lower = query.toLowerCase();
    const results: KnowledgeBaseSearchResult[] = [];

    for (const article of KNOWLEDGE_BASE) {
      const matchedKeywords: string[] = [];
      let relevanceScore = 0;

      for (const keyword of article.keywords) {
        if (lower.includes(keyword)) {
          matchedKeywords.push(keyword);
          relevanceScore += 10;
        }
      }

      // Title match bonus
      if (lower.includes(article.title.toLowerCase())) relevanceScore += 30;
      if (lower.includes(article.plainLanguageTitle.toLowerCase())) relevanceScore += 25;

      // Content word overlap
      const queryWords = lower.split(/\s+/);
      const contentWords = article.content.toLowerCase().split(/\s+/);
      const overlap = queryWords.filter(w => contentWords.includes(w) && w.length > 3).length;
      relevanceScore += overlap * 2;

      if (relevanceScore > 5) {
        results.push({ article, relevanceScore, matchedKeywords });
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
  }

  // --- Feature Suggestions ---

  submitFeatureSuggestion(input: FeatureSuggestionInput, userId: string, orgId: string): FeatureSuggestion {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Feature suggestion title is required');
    }
    if (!input.description || input.description.trim().length === 0) {
      throw new Error('Feature suggestion description is required');
    }
    if (input.title.trim().length > 200) {
      throw new Error('Feature suggestion title must be under 200 characters');
    }

    const suggestion: FeatureSuggestion = {
      id: `feat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      orgId,
      userId,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category || this.classifyIntent(input.title + ' ' + input.description),
      status: 'new',
      priority: 'medium',
      votes: 1,
      voters: [userId],
      submittedAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };

    this.suggestions.set(suggestion.id, suggestion);
    return suggestion;
  }

  voteForFeature(featureId: string, userId: string): FeatureSuggestion {
    const suggestion = this.suggestions.get(featureId);
    if (!suggestion) throw new Error(`Feature ${featureId} not found`);
    if (suggestion.voters.includes(userId)) throw new Error('User already voted for this feature');

    suggestion.votes++;
    suggestion.voters.push(userId);
    suggestion.updatedAt = new Date();

    // Auto-escalate priority based on votes
    if (suggestion.votes >= 50) suggestion.priority = 'critical';
    else if (suggestion.votes >= 20) suggestion.priority = 'high';
    else if (suggestion.votes >= 5) suggestion.priority = 'medium';

    return suggestion;
  }

  getTopFeatureRequests(limit: number = 10): FeatureSuggestion[] {
    return Array.from(this.suggestions.values())
      .filter(s => s.status !== 'declined' && s.status !== 'completed')
      .sort((a, b) => b.votes - a.votes)
      .slice(0, limit);
  }

  updateFeatureStatus(featureId: string, status: FeatureSuggestion['status'], adminResponse?: string): FeatureSuggestion {
    const suggestion = this.suggestions.get(featureId);
    if (!suggestion) throw new Error(`Feature ${featureId} not found`);

    suggestion.status = status;
    suggestion.updatedAt = new Date();
    if (adminResponse) suggestion.adminResponse = adminResponse;
    return suggestion;
  }

  // --- Escalation ---

  private escalateSession(session: ChatSession): ChatMessage {
    session.status = 'escalated';
    const msg = this.createBotMessage(session.id, ESCALATION_RESPONSE, undefined, undefined, true);
    session.messages.push(msg);
    return msg;
  }

  // --- Bug Report Handling ---

  private handleBugReport(session: ChatSession, message: string): ChatMessage {
    const response = this.createBotMessage(
      session.id,
      "🐛 **Bug Report Received!**\n\nThank you for reporting this issue. I\'ve logged it for our team. Here\'s what happens next:\n\n1. Our team will review within 24 hours\n2. You\'ll get an email update when we start working on it\n3. Critical bugs are fixed within 48 hours\n\nIn the meantime, try refreshing the page or clearing your browser cache. Would you like to add any more details?",
      'bug_report',
      100
    );
    session.messages.push(response);
    session.tags.push('bug_report');
    return response;
  }

  // --- Feature Request Handling ---

  private handleFeatureRequest(session: ChatSession, message: string): ChatMessage {
    const response = this.createBotMessage(
      session.id,
      "💡 **Great idea!** I\'d love to capture your feature suggestion.\n\nPlease tell me:\n1. **What feature** would you like? (short title)\n2. **Why** would this help your nonprofit?\n3. **How** would you use it?\n\nOr you can submit directly at **Settings > Feature Suggestions**. All suggestions are voted on by the community — popular ones get built first!",
      'feature_request',
      100
    );
    session.messages.push(response);
    session.tags.push('feature_request');
    return response;
  }

  // --- Analytics ---

  getAnalytics(): ChatbotAnalytics {
    const sessions = Array.from(this.sessions.values());
    const resolved = sessions.filter(s => s.status === 'resolved');
    const escalated = sessions.filter(s => s.status === 'escalated');

    const categoryCount: Partial<Record<MessageCategory, number>> = {};
    sessions.forEach(s => {
      s.messages.filter(m => m.category).forEach(m => {
        categoryCount[m.category!] = (categoryCount[m.category!] || 0) + 1;
      });
    });

    const avgSatisfaction = resolved.length > 0
      ? resolved.filter(s => s.satisfaction).reduce((sum, s) => sum + (s.satisfaction || 0), 0) / resolved.filter(s => s.satisfaction).length
      : 0;

    const avgResolutionTime = resolved.length > 0
      ? resolved.reduce((sum, s) => sum + ((s.resolvedAt!.getTime() - s.startedAt.getTime()) / 60000), 0) / resolved.length
      : 0;

    const accurateResponses = sessions.reduce((sum, s) => 
      sum + s.messages.filter(m => m.role === 'bot' && m.confidence && m.confidence > 50).length, 0);
    const totalBotResponses = sessions.reduce((sum, s) =>
      sum + s.messages.filter(m => m.role === 'bot').length, 0);

    return {
      totalSessions: sessions.length,
      resolvedSessions: resolved.length,
      escalatedSessions: escalated.length,
      avgResolutionTime,
      avgSatisfaction,
      topCategories: Object.entries(categoryCount)
        .map(([category, count]) => ({ category: category as MessageCategory, count: count as number }))
        .sort((a, b) => b.count - a.count),
      topFeatureRequests: this.getTopFeatureRequests(5),
      responseAccuracy: totalBotResponses > 0 ? (accurateResponses / totalBotResponses) * 100 : 0
    };
  }

  // --- Helpers ---

  private createBotMessage(
    sessionId: string,
    content: string,
    category?: MessageCategory,
    confidence?: number,
    escalated?: boolean
  ): ChatMessage {
    return {
      id: `msg-${Date.now()}-bot`,
      sessionId,
      role: 'bot',
      content,
      timestamp: new Date(),
      category,
      confidence,
      escalated
    };
  }

  getKnowledgeBase(): HelpArticle[] {
    return [...KNOWLEDGE_BASE];
  }
}

export default ChatbotEngine;
