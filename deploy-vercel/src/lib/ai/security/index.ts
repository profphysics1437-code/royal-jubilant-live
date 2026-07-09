import type { SecurityCheck, RateLimitInfo, AIContext } from '../types';
import { AI_CONFIG } from '../config';

const INJECTION_PATTERNS = [
  { pattern: /ignore\s+(all\s+)?previous\s+(instructions|prompts)/i, severity: 'critical' as const, reason: 'Attempt to override system instructions' },
  { pattern: /disregard\s+(all\s+)?(prior|previous|above)\s+instructions/i, severity: 'critical' as const, reason: 'Attempt to override system instructions' },
  { pattern: /you\s+are\s+now\s+(?:a|an)\s+/i, severity: 'high' as const, reason: 'Attempt to redefine AI role' },
  { pattern: /forget\s+(everything|all|your\s+instructions)/i, severity: 'critical' as const, reason: 'Memory wipe attempt' },
  { pattern: /system\s*prompt|system\s*instruction/i, severity: 'high' as const, reason: 'Attempting to access system prompt' },
  { pattern: /reveal\s+(your|the)\s+(prompt|instructions|rules)/i, severity: 'high' as const, reason: 'Attempting to extract system prompt' },
  { pattern: /exec\s*\(|eval\s*\(|child_process/i, severity: 'critical' as const, reason: 'Code injection attempt' },
  { pattern: /\b(DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO|UPDATE\s+.*SET)\b/i, severity: 'critical' as const, reason: 'SQL injection attempt' },
  { pattern: /rm\s+-rf|chmod\s+\+x/i, severity: 'critical' as const, reason: 'Shell injection attempt' },
  { pattern: /<script|javascript:|onerror\s*=/i, severity: 'high' as const, reason: 'XSS attempt' },
];

const rateLimitStore = new Map<string, { count: number; windowStart: number; hourlyCount: number; hourlyStart: number; }>();

export function checkPromptSafety(message: string): SecurityCheck {
  for (const rule of INJECTION_PATTERNS) {
    if (rule.pattern.test(message)) {
      return { passed: false, reason: rule.reason, severity: rule.severity, pattern: rule.pattern.source };
    }
  }
  return { passed: true };
}

export function checkRateLimit(context: AIContext): RateLimitInfo {
  const key = `${context.role}:${context.userId || context.sessionId}`;
  const now = Date.now();
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = { count: 0, windowStart: now, hourlyCount: 0, hourlyStart: now };
    rateLimitStore.set(key, entry);
  }
  if (now - entry.windowStart > 60_000) { entry.count = 0; entry.windowStart = now; }
  if (now - entry.hourlyStart > 3_600_000) { entry.hourlyCount = 0; entry.hourlyStart = now; }
  if (entry.count >= AI_CONFIG.rateLimitPerMinute || entry.hourlyCount >= AI_CONFIG.rateLimitPerHour) {
    return { allowed: false, remaining: 0, resetAt: Math.min(entry.windowStart + 60_000, entry.hourlyStart + 3_600_000) };
  }
  entry.count += 1;
  entry.hourlyCount += 1;
  return { allowed: true, remaining: Math.max(0, AI_CONFIG.rateLimitPerMinute - entry.count), resetAt: entry.windowStart + 60_000 };
}

export function hasPermission(context: AIContext, permission: string): boolean {
  if (context.permissions.includes('*')) return true;
  if (context.permissions.includes(permission)) return true;
  const wildcards = context.permissions.filter(p => p.endsWith('.*'));
  return wildcards.some(wc => permission.startsWith(wc.slice(0, -1)));
}

const auditLog: Array<{ timestamp: number; context: AIContext; action: string; details?: string; }> = [];

export function logAudit(context: AIContext, action: string, details?: string) {
  auditLog.push({ timestamp: Date.now(), context, action, details });
  if (auditLog.length > 1000) auditLog.shift();
  console.log(`[AI Audit] ${context.role}:${context.userId || context.sessionId} → ${action}${details ? ` — ${details}` : ''}`);
}
