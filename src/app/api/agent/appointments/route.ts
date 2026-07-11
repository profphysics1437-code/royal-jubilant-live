export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

export async function GET() {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const appointments = await db.appointment.findMany({
    where: { agentEmail: session.user.email },
    orderBy: { scheduledAt: "desc" },
    include: { lead: true },
  });

  return NextResponse.json({ appointments });
}

export async function PATCH(req: NextRequest) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const body = await req.json();
  const { id, status } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const appointment = await db.appointment.update({
    where: { id },
    data: { status: status || "scheduled" },
  });

  return NextResponse.json({ appointment });
}
