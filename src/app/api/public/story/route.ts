import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.storyEvent.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { eventDate: 'desc' }],
    });
    return NextResponse.json({ events });
  } catch (e: any) {
    return NextResponse.json({ events: [], error: e.message }, { status: 500 });
  }
}
