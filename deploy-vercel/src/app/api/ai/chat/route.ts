import { NextRequest, NextResponse } from 'next/server';
import { processAIRequest } from '@/lib/ai/gateway';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { AIContext } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, portal } = body;
    if (!message || typeof message !== 'string') return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    if (message.length > 2000) return NextResponse.json({ error: 'Message too long' }, { status: 400 });

    const session = await getServerSession(authOptions).catch(() => null);
    const user = (session as any)?.user;
    let role: AIContext['role'] = 'customer';
    if (portal === 'admin' && user?.role === 'admin') role = 'admin';
    else if (portal === 'agent' && (user?.role === 'agent' || user?.role === 'admin')) role = 'agent';
    else if (portal === 'marketing' && user?.role === 'admin') role = 'marketing';

    const context: AIContext = { role, userId: user?.id, sessionId: sessionId || `anon-${Date.now()}`, portal: portal || 'customer', permissions: [] };
    const response = await processAIRequest({ message, context });
    return NextResponse.json({ message: response.message, conversationId: response.conversationId, provider: response.provider, latencyMs: response.latencyMs, toolCalls: response.toolCalls?.length || 0 });
  } catch (e: any) {
    console.error('[AI Chat API] Error:', e);
    return NextResponse.json({ error: 'AI service unavailable', message: "I'm sorry, I'm having trouble responding right now." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ service: 'RJ AI Concierge', status: 'online', version: '1.0.0' });
}
