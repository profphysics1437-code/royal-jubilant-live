import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

/**
 * Log an activity performed by an admin/agent.
 * Call from API routes after a successful mutation.
 */
export async function logActivity(
  req: NextRequest | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    const ipAddress = req?.headers?.get("x-forwarded-for") || req?.headers?.get("x-real-ip") || null;

    await db.activityLog.create({
      data: {
        userId: user?.id || null,
        userName: user?.name || user?.email || "System",
        userRole: user?.role || "system",
        action,
        entity,
        entityId: entityId || null,
        details: details || null,
        ipAddress,
      },
    });
  } catch (e) {
    // Activity logging should never break the main operation
    console.error("[activity] Failed to log:", e);
  }
}

/**
 * Variant that accepts pre-resolved session data (e.g., when called from
 * contexts where the session has already been fetched).
 */
export async function logActivityRaw(
  user: { id?: string; name?: string | null; email?: string | null; role?: string } | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  ipAddress?: string | null,
) {
  try {
    await db.activityLog.create({
      data: {
        userId: user?.id || null,
        userName: user?.name || user?.email || "System",
        userRole: user?.role || "system",
        action,
        entity,
        entityId: entityId || null,
        details: details || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (e) {
    console.error("[activity] Failed to log:", e);
  }
}
