export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

const ENTITIES = [
  { key: "users", label: "Users", model: "user" },
  { key: "properties", label: "Properties", model: "property" },
  { key: "agents", label: "Agents", model: "agent" },
  { key: "communities", label: "Communities", model: "community" },
  { key: "developers", label: "Developers", model: "developer" },
  { key: "leads", label: "Leads", model: "lead" },
  { key: "appointments", label: "Appointments", model: "appointment" },
  { key: "valuations", label: "Valuation Requests", model: "valuationRequest" },
  { key: "mortgages", label: "Mortgage Enquiries", model: "mortgageEnquiry" },
  { key: "newsletter", label: "Newsletter Subscribers", model: "newsletterSubscriber" },
  { key: "blogPosts", label: "Blog Posts", model: "blogPost" },
  { key: "testimonials", label: "Testimonials", model: "testimonial" },
  { key: "awards", label: "Awards", model: "award" },
  { key: "siteSettings", label: "Site Settings", model: "siteSetting" },
  { key: "heroSlides", label: "Hero Slides", model: "heroSlide" },
  { key: "locations", label: "Locations", model: "location" },
  { key: "categories", label: "Property Categories", model: "propertyCategory" },
  { key: "amenities", label: "Amenities", model: "amenity" },
  { key: "mediaFiles", label: "Media Files", model: "mediaFile" },
  { key: "popups", label: "Popups", model: "popup" },
  { key: "seoMeta", label: "SEO Meta", model: "seoMeta" },
  { key: "menuItems", label: "Menu Items", model: "menuItem" },
  { key: "emailTemplates", label: "Email Templates", model: "emailTemplate" },
  { key: "landingPages", label: "Landing Pages", model: "landingPage" },
  { key: "activityLogs", label: "Activity Logs", model: "activityLog" },
  { key: "auditLogs", label: "Audit Logs", model: "auditLog" },
] as const;

function csvEscape(v: any): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCSV(rows: any[]): string {
  if (rows.length === 0) return "";
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const header = cols.join(",");
  const body = rows
    .map((r) => cols.map((c) => csvEscape(r[c])).join(","))
    .join("\n");
  return header + "\n" + body;
}

export async function GET(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const url = new URL(req.url);
  const entity = url.searchParams.get("entity");
  const format = url.searchParams.get("format") || "csv";
  const all = url.searchParams.get("all") === "1";

  // If no entity, return catalog (counts)
  if (!entity && !all) {
    const catalog: any[] = [];
    for (const e of ENTITIES) {
      // @ts-ignore
      const count = await (db as any)[e.model].count();
      catalog.push({ key: e.key, label: e.label, count });
    }
    return NextResponse.json({ entities: catalog });
  }

  // Single entity CSV
  if (entity) {
    const ent = ENTITIES.find((e) => e.key === entity);
    if (!ent) return NextResponse.json({ error: "Unknown entity" }, { status: 400 });

    // @ts-ignore
    const rows = await (db as any)[ent.model].findMany();
    await logActivity(req, "export", ent.model, undefined, `Exported ${rows.length} ${ent.label}`);

    if (format === "json") {
      return new NextResponse(JSON.stringify(rows, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${ent.key}-${Date.now()}.json"`,
        },
      });
    }

    const csv = toCSV(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${ent.key}-${Date.now()}.csv"`,
      },
    });
  }

  // Full JSON backup
  if (all) {
    const backup: any = {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: "3.0",
        entity: "Royal Jubilant Real Estate LLC",
      },
    };
    for (const e of ENTITIES) {
      // @ts-ignore
      backup[e.key] = await (db as any)[e.model].findMany();
    }
    await logActivity(req, "export", "database", undefined, "Full database backup");

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="royal-jubilant-backup-${Date.now()}.json"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
