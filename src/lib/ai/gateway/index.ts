import type { AIRequest, AIResponse, AITool, ToolCall, ToolResult, AIContext, ChatMessage } from '../types';
import { AI_CONFIG, ROLE_PERMISSIONS } from '../config';
import { callProvider } from '../providers';
import { checkPromptSafety, checkRateLimit, hasPermission, logAudit } from '../security';
import { getHistory, addMessage } from '../memory';
import { SYSTEM_PROMPTS } from '../prompts';
import { propertyTools } from '../tools/property';
import { leadTools } from '../tools/lead';
import { contentTools } from '../tools/content';
import { analyticsTools } from '../tools/analytics';

const ALL_TOOLS: AITool[] = [...propertyTools, ...leadTools, ...contentTools, ...analyticsTools];
const TOOLS_BY_NAME = new Map(ALL_TOOLS.map(t => [t.name, t]));

export async function processAIRequest(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now();
  const conversationId = request.context.sessionId;
  const context: AIContext = { ...request.context, permissions: ROLE_PERMISSIONS[request.context.role] || [] };

  const safetyCheck = checkPromptSafety(request.message);
  if (!safetyCheck.passed) {
    logAudit(context, 'prompt_injection_blocked', safetyCheck.reason);
    return { message: "I'm sorry, but I can't process that request. How else can I help you with your real estate needs?", provider: 'glm', tokensUsed: 0, latencyMs: Date.now() - startTime, conversationId };
  }

  const rateLimit = checkRateLimit(context);
  if (!rateLimit.allowed) {
    logAudit(context, 'rate_limit_exceeded');
    return { message: "You're sending messages too quickly. Please wait a moment and try again.", provider: 'glm', tokensUsed: 0, latencyMs: Date.now() - startTime, conversationId };
  }

  const history = request.history || getHistory(context.sessionId);
  const systemPrompt = SYSTEM_PROMPTS[context.role];
  const userMessage: ChatMessage = { id: `msg-${Date.now()}-u`, role: 'user', content: request.message, timestamp: Date.now() };
  addMessage(context.sessionId, userMessage);

  const toolCalls = detectToolIntent(request.message, context);
  const toolResults: ToolResult[] = [];
  for (const call of toolCalls) {
    const tool = TOOLS_BY_NAME.get(call.name);
    if (!tool) continue;
    if (!hasPermission(context, `${tool.category}.${call.name.split('_')[0]}`) && !context.permissions.includes('*')) continue;
    try {
      const result = await tool.handler(call.arguments, context);
      result.callId = call.id;
      toolResults.push(result);
      logAudit(context, 'tool_executed', `${call.name} → ${result.success ? 'success' : 'failed'}`);
    } catch (e: any) {
      toolResults.push({ callId: call.id, success: false, error: e.message });
    }
  }

  const toolContext = toolResults.length > 0 ? `\n\n[Tool Results]\n${toolResults.map(r => `${r.callId}: ${r.success ? JSON.stringify(r.data).slice(0, 1500) : `ERROR: ${r.error}`}`).join('\n')}\n\nUse this data to answer naturally.` : '';
  const provider = request.provider || AI_CONFIG.defaultProvider;
  const providerResponse = await callProvider(provider, { messages: [...history, { ...userMessage, content: userMessage.content + toolContext } as any], systemPrompt, temperature: AI_CONFIG.temperature, maxTokens: AI_CONFIG.maxTokens });

  const assistantMessage: ChatMessage = { id: `msg-${Date.now()}-a`, role: 'assistant', content: providerResponse.content, timestamp: Date.now(), toolCalls: toolCalls.length > 0 ? toolCalls : undefined, toolResults: toolResults.length > 0 ? toolResults : undefined, metadata: { provider: providerResponse.provider, tokensUsed: providerResponse.tokensUsed } };
  addMessage(context.sessionId, assistantMessage);
  logAudit(context, 'request_processed', `provider=${provider} tokens=${providerResponse.tokensUsed} tools=${toolCalls.length}`);

  return { message: providerResponse.content, toolCalls: toolCalls.length > 0 ? toolCalls : undefined, toolResults: toolResults.length > 0 ? toolResults : undefined, provider: providerResponse.provider, tokensUsed: providerResponse.tokensUsed, latencyMs: Date.now() - startTime, conversationId };
}

function detectToolIntent(message: string, context: AIContext): ToolCall[] {
  const calls: ToolCall[] = [];
  const lower = message.toLowerCase();

  if (/\b(buy|rent|looking\s+for|search|find|show\s+me|properties?\s+in|apartments?\s+in|villas?\s+in)\b/i.test(lower)) {
    const purposeMatch = lower.match(/\b(rent|buy|sale|commercial|off[\s-]?plan)\b/i);
    const locationMatch = message.match(/(?:in|at|near)\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:with|for|under|below|above|priced)|[.,?!]|$)/);
    const bedsMatch = lower.match(/(\d+)\s*(?:br|bed|bedroom)/);
    const maxPriceMatch = lower.match(/(?:under|below|max|up\s+to)\s*([\d,]+)\s*(?:k|m|aed|million|thousand)?/i);
    let purpose: string | undefined;
    if (purposeMatch) {
      const p = purposeMatch[0].toLowerCase();
      if (p.includes('rent')) purpose = 'rent';
      else if (p.includes('commercial')) purpose = 'commercial';
      else if (p.includes('off')) purpose = 'off-plan';
      else purpose = 'sale';
    }
    calls.push({ id: `call-${Date.now()}-1`, name: 'search_properties', arguments: { purpose, location: locationMatch?.[1]?.trim(), beds: bedsMatch ? parseInt(bedsMatch[1]) : undefined, maxPrice: parsePrice(maxPriceMatch?.[1], maxPriceMatch?.[2]), limit: 6 } });
  }

  if (/\b(valu|worth|apprais|estimat).{0,30}(my\s+)?(property|house|apartment|villa)/i.test(lower)) {
    calls.push({ id: `call-${Date.now()}-2`, name: 'estimate_valuation', arguments: { location: 'Dubai', type: 'apartment', area: 1000, beds: 1 } });
  }

  if (/\b(contact|call\s+me|reach\s+me|interested|my\s+name\s+is|my\s+phone|email\s+me)\b/i.test(lower)) {
    const nameMatch = message.match(/(?:my\s+name\s+is|i'?m|i\s+am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    const phoneMatch = message.match(/\+?\d[\d\s\-()]{7,}/);
    const emailMatch = message.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (nameMatch || phoneMatch || emailMatch) {
      calls.push({ id: `call-${Date.now()}-3`, name: 'create_lead', arguments: { name: nameMatch?.[1] || 'Lead from AI Chat', phone: phoneMatch?.[0], email: emailMatch?.[0], interest: message.slice(0, 200), source: 'ai-chat' } });
    }
  }

  if (/\b(blog|article|news|market\s+insight|guide|tips?|advice)\b/i.test(lower)) {
    calls.push({ id: `call-${Date.now()}-4`, name: 'search_blog_posts', arguments: { keyword: message.slice(0, 50), limit: 3 } });
  }

  if (context.role !== 'customer' && /\b(stats|analytics|market\s+report|performance|insights?)\b/i.test(lower)) {
    calls.push({ id: `call-${Date.now()}-5`, name: 'get_market_stats', arguments: {} });
  }

  return calls;
}

function parsePrice(numStr?: string, unit?: string): number | undefined {
  if (!numStr) return undefined;
  const num = parseFloat(numStr.replace(/,/g, ''));
  if (isNaN(num)) return undefined;
  const u = (unit || '').toLowerCase();
  if (u.includes('m') || u.includes('million')) return num * 1_000_000;
  if (u.includes('k') || u.includes('thousand')) return num * 1000;
  return num;
}

export { ALL_TOOLS };
