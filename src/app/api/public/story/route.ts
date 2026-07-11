export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.storyEvent.findMany({ where: { published: true }, orderBy: [{ order: 'asc' }, { eventDate: 'desc' }] });
    return NextResponse.json({ events });
  } catch (e: any) { return NextResponse.json({ events: [], error: e.message }, { status: 500 }); }
}
