import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();

async function checkAuth() {
  const session = await getServerSession(authOptions).catch(() => null);
  return (session as any)?.user?.role === 'admin';
}

const DEFAULTS = {
  enabled: true, autoIntro: true, introDelay: 6, soundEnabled: true, orbSize: 64, orbGlow: true, chatTransparency: 70,
  welcomeMessage: "Hello! I'm RJ AI, your personal real estate concierge. How can I help you today?",
  quickActions: 'Show me 2BR apartments in Dubai Marina for rent\nEstimate my property value\nI want to be contacted by an agent',
};

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({ where: { category: 'ai_robot' } });
    const map: any = { ...DEFAULTS };
    settings.forEach(s => {
      if (s.key.startsWith('ai_robot_')) {
        const key = s.key.replace('ai_robot_', '');
        if (['enabled', 'autoIntro', 'soundEnabled', 'orbGlow'].includes(key)) map[key] = s.value === 'true';
        else if (['introDelay', 'orbSize', 'chatTransparency'].includes(key)) map[key] = parseInt(s.value);
        else map[key] = s.value;
      }
    });
    return NextResponse.json({ settings: map });
  } catch (e: any) { return NextResponse.json({ settings: DEFAULTS, error: e.message }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const strValue = String(value);
      await prisma.siteSetting.upsert({
        where: { key: `ai_robot_${key}` },
        update: { value: strValue },
        create: { key: `ai_robot_${key}`, value: strValue, category: 'ai_robot' },
      });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
