import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LandingPageLeadForm } from "@/components/site/LandingPageLeadForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await db.landingPage.findUnique({ where: { slug } });
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.subheadline || page.headline,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.subheadline || "",
      images: page.heroImage ? [{ url: page.heroImage }] : [],
    },
  };
}

export default async function LandingPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await db.landingPage.findUnique({ where: { slug } });

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      {page.heroImage && (
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img
            src={page.heroImage}
            alt={page.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/85 via-[#0A1F44]/40 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4 text-white">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium max-w-4xl leading-tight">
              {page.headline}
            </h1>
            {page.subheadline && (
              <p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl">{page.subheadline}</p>
            )}
            {page.ctaText && (
              <a
                href={page.ctaLink || "#contact"}
                className="mt-8 inline-flex items-center gap-2 bg-[#C9A961] hover:bg-[#D4AF37] text-[#0A1F44] font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {page.ctaText}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {!page.heroImage && (
          <header className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#0A1F44]">{page.headline}</h1>
            {page.subheadline && (
              <p className="mt-4 text-lg text-muted-foreground">{page.subheadline}</p>
            )}
          </header>
        )}
        <div
          className="landing-body"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
        {page.ctaText && !page.heroImage && (
          <div className="text-center mt-8">
            <a
              href={page.ctaLink || "#contact"}
              className="inline-flex items-center gap-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {page.ctaText}
            </a>
          </div>
        )}
      </article>

      {/* Lead capture form — converts visitors into CRM leads tagged with this page's slug */}
      <section className="bg-[#F9FAFB] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <LandingPageLeadForm slug={page.slug} />
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Royal Jubilant Real Estate LLC</span>
          <Link href="/" className="text-[#A68A3F] hover:underline">← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}
