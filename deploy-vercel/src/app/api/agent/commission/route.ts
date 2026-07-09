import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

export async function GET() {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const commissions = await db.commission.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ commissions });
}
