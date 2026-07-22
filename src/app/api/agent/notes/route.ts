export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

export async function GET() {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const notes = await db.crmNote.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { lead: true },
  });

  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const body = await req.json();
  if (!body.note) return NextResponse.json({ error: "Note required" }, { status: 400 });

  const note = await db.crmNote.create({
    data: {
      agentId: session.user.id,
      leadId: body.leadId || null,
      note: body.note,
    },
  });

  return NextResponse.json({ note });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Verify ownership
  const existing = await db.crmNote.findUnique({ where: { id } });
  if (!existing || existing.agentId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await db.crmNote.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
