import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

export async function GET(req: NextRequest) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const leads = await db.lead.findMany({
    where: {
      assignedTo: session.user.email,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const body = await req.json();
  const { id, status, notes } = body;
  if (!id) return NextResponse.json({ error: "Lead id required" }, { status: 400 });

  // Verify lead is assigned to this agent
  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing || existing.assignedTo !== session.user.email) {
    return NextResponse.json({ error: "Not authorized for this lead" }, { status: 403 });
  }

  const lead = await db.lead.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  return NextResponse.json({ lead });
}
