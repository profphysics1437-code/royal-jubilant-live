import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ blogPosts: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body: any = await req.json();
  if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const item = await db.blogPost.create({
    data: {
      title: body.title,
      excerpt: body.excerpt || "",
      category: body.category || "Market Insights",
      readTime: body.readTime || "5 min",
      authorName: body.authorName || "Royal Jubilant",
      image: body.image || "",
      content: body.content || body.excerpt || "",
      published: body.published !== false,
    },
  });
  return NextResponse.json({ blogPost: item });
}
