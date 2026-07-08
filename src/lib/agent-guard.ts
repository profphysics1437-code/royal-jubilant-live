import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAgent() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session as any;
}
