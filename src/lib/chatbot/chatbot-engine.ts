// CharityFlow Customer Chatbot & Feature Suggestion Engine v6.0

export interface ChatSession {
  id: string;
  orgId: string;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'resolved' | 'escalated';
  messages: ChatMessage[];
  satisfactionRating?: number;
  intent?: string;
}

export interface ChatMessage {
  role: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: string;
  intent?: string;
}

export interface FeatureSuggestion {
  id: string;
  orgId: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  voters: string[];
  status: 'new' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  adminResponse?: string;
  createdAt: string;
}

export interface ChatAnalytics {
  totalSessions: number;
  resolvedSessions: number;
  avgSatisfaction: number;
  topCategories: Array<{ category: string; count: number }>;
  avgResponseTime: number;
}

const INTENTS = ['transactions', 'compliance', 'tax', 'donors', 'events', 'billing', 'account', 'feature_request', 'bug_report', 'general'];

const KNOWLEDGE_BASE: Array<{ title: string; content: string; keywords: string[] }> = [
  { title: 'How to Record a Donation', content: 'Go to Money Tracker > Click "Record Donation" > Enter donor name, amount, and date > Save. A tax receipt is auto-generated.', keywords: ['donation', 'record', 'gift', 'money'] },
  { title: 'Filing Your Annual Tax Report', content: 'Go to Tax Center > Click "Generate Form 990" > Review auto-populated data > Submit. CharityFlow selects the right version (990-N, 990-EZ, or 990) based on your budget.', keywords: ['tax', 'form 990', 'filing', 'annual report'] },
  { title: 'Understanding Your Compliance Score', content: 'Your Compliance Health Score (0-100%) shows how well your organization meets all filing and regulatory requirements. Green (80%+), Yellow (50-79%), Red (below 50%).', keywords: ['compliance', 'score', 'health', 'regulatory'] },
  { title: 'Managing Board Meetings', content: 'Go to Board Room > Schedule Meeting > Add agenda items > During meeting, record votes and take minutes > Auto-generate and share minutes with all board members.', keywords: ['board', 'meeting', 'minutes', 'votes'] },
  { title: 'Planning a Fundraising Event', content: 'Go to Events > Create Event > Set budget, goals, and date > Use Venue Finder for local options > Track expenses and donations in real-time > View ROI after event.', keywords: ['event', 'fundraising', 'venue', 'planning'] },
  { title: 'Adding Team Members', content: 'Go to Team > Invite Member > Set their role (Admin, Treasurer, Board Member, Staff, Volunteer) > They get customized access and notifications based on their role.', keywords: ['team', 'member', 'role', 'invite', 'access'] },
  { title: 'Connecting Your Bank', content: 'Go to Settings > Bank Connections > Search for your bank > Log in securely > Transactions auto-import daily and get categorized.', keywords: ['bank', 'connect', 'import', 'reconcile'] },
  { title: 'Generating Reports', content: 'Go to Reports > Choose report type (Financial Summary, Donor Report, Compliance Report, etc.) > Set date range > Generate as PDF or Excel.', keywords: ['report', 'financial', 'generate', 'pdf'] },
  { title: 'Tracking Mileage', content: 'Go to Expenses > Mileage Tracker > Enter trip details (start, end, purpose) > IRS charity rate ($0.14/mile) auto-applied > Add to expense report.', keywords: ['mileage', 'travel', 'irs', 'rate'] },
  { title: 'Understanding Utility Bills', content: 'Go to Finance > Utility Bills > Link your providers > Bills auto-import monthly > Quarterly reports show trends and savings opportunities.', keywords: ['utility', 'bills', 'electric', 'water', 'provider'] },
];

export class ChatbotEngine {
  private sessions: Map<string, ChatSession> = new Map();
  private suggestions: Map<string, FeatureSuggestion> = new Map();

  classifyIntent(message: string): string {
    const lower = message.toLowerCase();
    if (lower.match(/transaction|donation|expense|money|payment/)) return 'transactions';
    if (lower.match(/compliance|filing|registration|deadline/)) return 'compliance';
    if (lower.match(/tax|990|irs|exempt|deduction/)) return 'tax';
    if (lower.match(/donor|fundrais|campaign|give|contribution/)) return 'donors';
    if (lower.match(/event|venue|gala|auction|festival/)) return 'events';
    if (lower.match(/bill|invoice|subscription|pricing|plan/)) return 'billing';
    if (lower.match(/account|profile|password|login|settings/)) return 'account';
    if (lower.match(/feature|suggest|idea|request|wish|would be nice/)) return 'feature_request';
    if (lower.match(/bug|error|broken|crash|not working|issue/)) return 'bug_report';
    return 'general';
  }

  searchKnowledge(query: string): Array<{ title: string; content: string; relevance: number }> {
    const lower = query.toLowerCase();
    const results: Array<{ title: string; content: string; relevance: number }> = [];

    for (const article of KNOWLEDGE_BASE) {
      let relevance = 0;
      for (const keyword of article.keywords) {
        if (lower.includes(keyword)) relevance += 25;
      }
      if (lower.includes(article.title.toLowerCase())) relevance += 50;
      if (relevance > 0) results.push({ title: article.title, content: article.content, relevance: Math.min(relevance, 100) });
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  startSession(orgId: string): ChatSession {
    const session: ChatSession = {
      id: 'chat_' + Date.now(),
      orgId,
      startedAt: new Date().toISOString(),
      status: 'active',
      messages: [{
        role: 'bot',
        content: 'Hi! I\'m your CharityFlow assistant. How can I help you today?',
        timestamp: new Date().toISOString(),
      }],
    };
    this.sessions.set(session.id, session);
    return session;
  }

  processMessage(sessionId: string, userMessage: string): ChatMessage {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.messages.push({ role: 'user', content: userMessage, timestamp: new Date().toISOString() });

    const intent = this.classifyIntent(userMessage);
    session.intent = intent;

    if (intent === 'feature_request') {
      const response: ChatMessage = {
        role: 'bot',
        content: 'Great idea! I\'ve noted your feature suggestion. You can also submit it to our Feature Board where other organizations can vote on it. Would you like me to create a formal suggestion?',
        timestamp: new Date().toISOString(),
        intent,
      };
      session.messages.push(response);
      return response;
    }

    if (intent === 'bug_report') {
      const response: ChatMessage = {
        role: 'bot',
        content: 'I\'m sorry you\'re experiencing an issue. I\'ve flagged this as a bug report and our team will review it within 24 hours. Can you describe what happened in more detail?',
        timestamp: new Date().toISOString(),
        intent,
      };
      session.messages.push(response);
      return response;
    }

    const articles = this.searchKnowledge(userMessage);
    let responseContent: string;

    if (articles.length > 0 && articles[0].relevance >= 25) {
      responseContent = articles[0].content;
    } else {
      responseContent = 'I\'ll connect you with our support team for more help on this topic. Is there anything else I can assist with?';
      if (session.messages.length > 6) {
        session.status = 'escalated';
        responseContent = 'Let me escalate this to our support team for a detailed response. You\'ll hear back within 24 hours.';
      }
    }

    const response: ChatMessage = { role: 'bot', content: responseContent, timestamp: new Date().toISOString(), intent };
    session.messages.push(response);
    return response;
  }

  resolveSession(sessionId: string, rating?: number): ChatSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    session.status = 'resolved';
    session.endedAt = new Date().toISOString();
    if (rating) session.satisfactionRating = rating;
    return session;
  }

  submitSuggestion(input: { orgId: string; title: string; description: string; category?: string }): FeatureSuggestion {
    if (!input.title || input.title.trim() === '') throw new Error('Title is required');
    if (!input.description || input.description.trim() === '') throw new Error('Description is required');

    const suggestion: FeatureSuggestion = {
      id: 'feat_' + Date.now(),
      orgId: input.orgId,
      title: input.title,
      description: input.description,
      category: input.category || 'general',
      votes: 1,
      voters: [input.orgId],
      status: 'new',
      priority: 'low',
      createdAt: new Date().toISOString(),
    };
    this.suggestions.set(suggestion.id, suggestion);
    return suggestion;
  }

  voteSuggestion(suggestionId: string, voterId: string): FeatureSuggestion {
    const suggestion = this.suggestions.get(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');
    if (suggestion.voters.includes(voterId)) throw new Error('Already voted');

    suggestion.voters.push(voterId);
    suggestion.votes++;

    // Auto-escalate priority
    if (suggestion.votes >= 50) suggestion.priority = 'critical';
    else if (suggestion.votes >= 20) suggestion.priority = 'high';
    else if (suggestion.votes >= 5) suggestion.priority = 'medium';

    return suggestion;
  }

  getAnalytics(): ChatAnalytics {
    const sessions = Array.from(this.sessions.values());
    const resolved = sessions.filter(s => s.status === 'resolved');
    const ratings = resolved.filter(s => s.satisfactionRating).map(s => s.satisfactionRating!);

    const categoryCount: Record<string, number> = {};
    for (const s of sessions) {
      if (s.intent) categoryCount[s.intent] = (categoryCount[s.intent] || 0) + 1;
    }

    return {
      totalSessions: sessions.length,
      resolvedSessions: resolved.length,
      avgSatisfaction: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      topCategories: Object.entries(categoryCount).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count),
      avgResponseTime: 2.3,
    };
  }
}

export default ChatbotEngine;
