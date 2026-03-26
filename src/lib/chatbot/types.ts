// src/lib/chatbot/types.ts
// CharityFlow Customer Help Chatbot + Feature Suggestion System — Type Definitions

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  category?: MessageCategory;
  confidence?: number;
  suggestedArticles?: HelpArticle[];
  escalated?: boolean;
}

export interface ChatSession {
  id: string;
  orgId: string;
  userId: string;
  status: 'active' | 'resolved' | 'escalated' | 'archived';
  startedAt: Date;
  resolvedAt?: Date;
  messages: ChatMessage[];
  satisfaction?: 1 | 2 | 3 | 4 | 5;
  tags: string[];
}

export type MessageCategory =
  | 'transactions'
  | 'compliance'
  | 'tax_filing'
  | 'donors'
  | 'events'
  | 'billing'
  | 'account'
  | 'feature_request'
  | 'bug_report'
  | 'general';

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: MessageCategory;
  keywords: string[];
  plainLanguageTitle: string;
  views: number;
  helpfulVotes: number;
  lastUpdated: Date;
}

export interface FeatureSuggestion {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  description: string;
  category: MessageCategory;
  status: 'new' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  votes: number;
  voters: string[];
  submittedAt: Date;
  updatedAt: Date;
  adminResponse?: string;
  tags: string[];
}

export interface FeatureSuggestionInput {
  title: string;
  description: string;
  category?: MessageCategory;
}

export interface ChatbotConfig {
  orgId: string;
  orgName: string;
  orgType: string;
  state: string;
  enableAI: boolean;
  enableFeatureSuggestions: boolean;
  autoEscalateAfter: number; // messages before escalation
  businessHours: { start: number; end: number };
}

export interface KnowledgeBaseSearchResult {
  article: HelpArticle;
  relevanceScore: number;
  matchedKeywords: string[];
}

export interface ChatbotAnalytics {
  totalSessions: number;
  resolvedSessions: number;
  escalatedSessions: number;
  avgResolutionTime: number; // minutes
  avgSatisfaction: number;
  topCategories: { category: MessageCategory; count: number }[];
  topFeatureRequests: FeatureSuggestion[];
  responseAccuracy: number; // percentage
}
