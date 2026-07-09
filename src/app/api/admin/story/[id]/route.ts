import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const prisma = new PrismaClient();

async function checkAuth() {
  const session = await getServerSession(authOptions).catch(() => null);
  return (session as any)?.user?.role === 'admin';
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const event = await prisma.storyEvent.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.eventDate !== undefined && { eventDate: new Date(body.eventDate) }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.highlighted !== undefined && { highlighted: body.highlighted }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.published !== undefined && { published: body.published }),
      },
    });
    return NextResponse.json({ event });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.storyEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
