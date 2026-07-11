export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Returns menu items as a nested structure: top-level items with their children attached.
// Optionally filter by menu group via ?menu=main|footer|mobile
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const menu = searchParams.get("menu") || "main";

  const all = await db.menuItem.findMany({
    where: { menu, visible: true },
    orderBy: [{ order: "asc" }],
  });

  // Build nested structure
  const topItems = all
    .filter((i) => !i.parentId)
    .map((i) => ({ ...i, children: [] as any[] }));

  const childItems = all.filter((i) => i.parentId);

  // Attach children to their parents
  for (const child of childItems) {
    const parent = topItems.find((t) => t.id === child.parentId);
    if (parent) parent.children.push(child);
  }

  return NextResponse.json(
    { items: topItems },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
