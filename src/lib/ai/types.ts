// AI Operating System — Core Types
export type AIRole = 'customer' | 'agent' | 'admin' | 'marketing';
export type AIProvider = 'glm' | 'openai' | 'claude' | 'gemini' | 'deepseek' | 'qwen';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  metadata?: { provider?: AIProvider; tokensUsed?: number; latencyMs?: number; };
}

export interface ToolCall { id: string; name: string; arguments: Record<string, any>; }
export interface ToolResult { callId: string; success: boolean; data?: any; error?: string; }

export interface AITool {
  name: string;
  description: string;
  category: 'property' | 'lead' | 'content' | 'analytics';
  parameters: Record<string, { type: string; description: string; required?: boolean; enum?: string[]; }>;
  handler: (args: any, context: AIContext) => Promise<ToolResult>;
}

export interface AIContext {
  role: AIRole;
  userId?: string;
  sessionId: string;
  portal?: 'customer' | 'agent' | 'admin';
  permissions: string[];
}

export interface AIRequest { message: string; context: AIContext; history?: ChatMessage[]; provider?: AIProvider; }
export interface AIResponse {
  message: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  provider: AIProvider;
  tokensUsed: number;
  latencyMs: number;
  conversationId: string;
}

export interface SecurityCheck { passed: boolean; reason?: string; severity?: 'low' | 'medium' | 'high' | 'critical'; pattern?: string; }
export interface RateLimitInfo { allowed: boolean; remaining: number; resetAt: number; }
export interface ConversationMemory { sessionId: string; messages: ChatMessage[]; summary?: string; lastUpdated: number; totalTokens: number; }
