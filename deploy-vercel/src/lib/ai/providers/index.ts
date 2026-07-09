import type { AIProvider, ChatMessage } from '../types';
import { AI_CONFIG } from '../config';

export interface ProviderRequest {
  messages: ChatMessage[];
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderResponse {
  content: string;
  tokensUsed: number;
  model: string;
  provider: AIProvider;
}

export async function callProvider(provider: AIProvider, request: ProviderRequest): Promise<ProviderResponse> {
  switch (provider) {
    case 'glm': return callGLM(request);
    case 'openai': throw new Error('OpenAI not configured');
    case 'claude': throw new Error('Claude not configured');
    case 'gemini': throw new Error('Gemini not configured');
    case 'deepseek': throw new Error('DeepSeek not configured');
    case 'qwen': throw new Error('Qwen not configured');
    default: return callGLM(request);
  }
}

async function callGLM(request: ProviderRequest): Promise<ProviderResponse> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  const formattedMessages = [
    { role: 'system' as const, content: request.systemPrompt },
    ...request.messages.map(m => ({
      role: m.role === 'tool' ? 'assistant' as const : m.role,
      content: m.content,
    })),
  ];
  const response = await zai.chat.completions.create({
    model: AI_CONFIG.defaultModel,
    messages: formattedMessages,
    temperature: request.temperature ?? AI_CONFIG.temperature,
    max_tokens: request.maxTokens ?? AI_CONFIG.maxTokens,
    thinking: { type: 'disabled' },
  });
  return {
    content: response.choices[0]?.message?.content || '',
    tokensUsed: response.usage?.total_tokens || 0,
    model: AI_CONFIG.defaultModel,
    provider: 'glm',
  };
}
