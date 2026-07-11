import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const developers = await prisma.storyDeveloper.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ developers });
  } catch (e: any) {
    return NextResponse.json({ developers: [], error: e.message }, { status: 500 });
  }
}
