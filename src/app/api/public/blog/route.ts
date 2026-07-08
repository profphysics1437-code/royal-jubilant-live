import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  const mapped = posts.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date.toISOString(),
    readTime: p.readTime,
    authorName: p.authorName,
    image: p.image,
    content: p.content || "",
  }));

  return NextResponse.json({ posts: mapped }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
