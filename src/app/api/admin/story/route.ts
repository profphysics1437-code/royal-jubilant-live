export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();

async function checkAuth() {
  const session = await getServerSession(authOptions).catch(() => null);
  return (session as any)?.user?.role === 'admin';
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const events = await prisma.storyEvent.findMany({ orderBy: [{ order: 'asc' }, { eventDate: 'desc' }] });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const event = await prisma.storyEvent.create({
      data: {
        title: body.title, description: body.description, eventDate: new Date(body.eventDate),
        location: body.location || null, category: body.category || 'milestone',
        images: JSON.stringify(body.images || []), videoUrl: body.videoUrl || null,
        highlighted: body.highlighted || false, order: body.order || 0, published: body.published !== false,
      },
    });
    return NextResponse.json({ event });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
