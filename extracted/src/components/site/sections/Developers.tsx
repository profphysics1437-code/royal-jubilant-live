"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, Award, Briefcase } from "lucide-react";
import { developers as fallbackDevelopers } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useApi } from "@/lib/useApi";
import { SectionHeader } from "./FeaturedProperties";

export function Developers() {
  const { openDeveloper, setActiveView } = useStore();
  const { data } = useApi<{ developers: any[] }>("/api/public/developers", { developers: fallbackDevelopers });
  const developers = data?.developers || fallbackDevelopers;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionHeader
          eyebrow="Trusted Partnerships"
          title="Featured Developers"
          subtitle="Royal Jubilant maintains first-call access to inventory from Dubai's leading master developers — from Emaar and Nakheel to DAMAC, Sobha and Omniyat."
          icon={<Building2 className="size-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-12">
          {developers.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              onClick={() => openDeveloper(d.id)}
              className="group bg-white rounded-2xl overflow-hidden border border-border/60 lift-on-hover cursor-pointer shadow-sm"
            >
              {/* Hero image with real logo overlay */}
              <div className="relative h-44 overflow-hidden bg-[#0A1F44]">
                <img
                  src={d.hero}
                  alt={d.name}
                  className="w-full h-full object-cover zoom-img opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/90 via-[#0A1F44]/40 to-[#0A1F44]/20" />

                {/* Real developer logo — white card with logo image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-xl px-6 py-4 shadow-2xl max-w-[80%] flex items-center justify-center">
                    <img
                      src={d.logo}
                      alt={`${d.name} logo`}
                      className="max-h-14 max-w-[160px] object-contain"
                      onError={(e) => {
                        // Fallback: if logo image fails to load, show text
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const span = document.createElement('span');
                          span.className = 'fallback-text font-serif text-xl font-bold text-[#0A1F44]';
                          span.textContent = d.name;
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Founded badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] tracking-luxury uppercase text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                    Est. {d.founded}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg font-medium text-[#0A1F44] group-hover:text-[#A68A3F] transition-colors">
                    {d.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">{d.headquarters}</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                  {d.overview}
                </p>

                <div className="grid grid-cols-3 gap-2 pb-4 mb-4 border-b border-border/60">
                  <Stat label="Total" value={d.totalProjects} />
                  <Stat label="Completed" value={d.completedProjects} />
                  <Stat label="Ongoing" value={d.ongoingProjects} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#A68A3F]">
                    <Award className="size-3.5" />
                    <span className="line-clamp-1">{d.awards[0]}</span>
                  </div>
                  <span className="text-[10px] tracking-luxury uppercase text-muted-foreground group-hover:text-[#A68A3F] transition-colors flex items-center gap-1">
                    View Profile <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveView("developers")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#A68A3F] hover:gap-2.5 transition-all"
          >
            View All Developers <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="font-serif text-xl font-semibold text-[#0A1F44]">{value}</div>
      <div className="text-[9px] tracking-luxury uppercase text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
