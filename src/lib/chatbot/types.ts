// CharityFlow Chatbot Types v6.0

export type ChatIntent = 
  | 'transactions' | 'compliance' | 'tax' | 'donors' 
  | 'events' | 'billing' | 'account' 
  | 'feature_request' | 'bug_report' | 'general';

export type SuggestionStatus = 
  | 'new' | 'under_review' | 'planned' 
  | 'in_progress' | 'completed' | 'declined';

export type SuggestionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface KnowledgeArticle {
  title: string;
  content: string;
  keywords: string[];
  category: ChatIntent;
}
