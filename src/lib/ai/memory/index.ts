import type { ChatMessage, ConversationMemory } from '../types';
import { AI_CONFIG } from '../config';

const memoryStore = new Map<string, ConversationMemory>();

export function getOrCreateMemory(sessionId: string): ConversationMemory {
  let memory = memoryStore.get(sessionId);
  if (!memory) {
    memory = { sessionId, messages: [], lastUpdated: Date.now(), totalTokens: 0 };
    memoryStore.set(sessionId, memory);
  }
  return memory;
}

export function addMessage(sessionId: string, message: ChatMessage) {
  const memory = getOrCreateMemory(sessionId);
  memory.messages.push(message);
  memory.lastUpdated = Date.now();
  memory.totalTokens += message.metadata?.tokensUsed || 0;
  if (memory.messages.length > AI_CONFIG.maxHistoryMessages) {
    memory.messages = memory.messages.slice(-AI_CONFIG.maxHistoryMessages);
  }
  if (memory.totalTokens > AI_CONFIG.maxTokensPerSession) {
    summarizeMemory(sessionId);
  }
}

export function getHistory(sessionId: string, limit = AI_CONFIG.maxHistoryMessages): ChatMessage[] {
  const memory = getOrCreateMemory(sessionId);
  return memory.messages.slice(-limit);
}

export function clearMemory(sessionId: string) { memoryStore.delete(sessionId); }

function summarizeMemory(sessionId: string) {
  const memory = memoryStore.get(sessionId);
  if (!memory) return;
  const older = memory.messages.slice(0, -5);
  const recent = memory.messages.slice(-5);
  const summary = `Earlier conversation topics: ${older.filter(m => m.role === 'user').map(m => m.content.slice(0, 80)).join(' | ')}`;
  memory.messages = [{ id: 'summary', role: 'system', content: summary, timestamp: Date.now() }, ...recent];
  memory.totalTokens = Math.floor(memory.totalTokens / 2);
}
