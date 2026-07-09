import type { AIProvider, AIRole } from './types';

export const AI_CONFIG = {
  defaultProvider: 'glm' as AIProvider,
  defaultModel: 'glm-4.6',
  maxTokens: 2000,
  temperature: 0.7,
  maxHistoryMessages: 20,
  maxTokensPerSession: 100000,
  rateLimitPerMinute: 30,
  rateLimitPerHour: 500,
} as const;

export const PROVIDER_CONFIG: Record<AIProvider, { enabled: boolean; models: string[]; apiBase?: string; }> = {
  glm: { enabled: true, models: ['glm-4.6', 'glm-4.5', 'glm-4-flash'] },
  openai: { enabled: false, models: ['gpt-4o', 'gpt-4o-mini'], apiBase: 'https://api.openai.com/v1' },
  claude: { enabled: false, models: ['claude-3-5-sonnet-20241022'], apiBase: 'https://api.anthropic.com/v1' },
  gemini: { enabled: false, models: ['gemini-1.5-pro'], apiBase: 'https://generativelanguage.googleapis.com/v1' },
  deepseek: { enabled: false, models: ['deepseek-chat'], apiBase: 'https://api.deepseek.com/v1' },
  qwen: { enabled: false, models: ['qwen-max'], apiBase: 'https://dashscope.aliyuncs.com/compatible-mode/v1' },
};

export const ROLE_PERMISSIONS: Record<AIRole, string[]> = {
  customer: ['property.search', 'property.details', 'valuation.estimate', 'lead.create', 'content.blog.read', 'content.faq.read'],
  agent: ['property.search', 'property.details', 'property.create', 'property.update', 'lead.read', 'lead.update', 'analytics.agent'],
  admin: ['*'],
  marketing: ['content.blog.create', 'content.blog.update', 'analytics.marketing', 'content.faq.create'],
};
