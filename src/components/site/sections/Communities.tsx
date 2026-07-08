"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, TrendingUp, Star } from "lucide-react";
import { communities as fallbackCommunities } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useApi } from "@/lib/useApi";
import { SectionHeader } from "./FeaturedProperties";

export function Communities() {
  const { openCommunity, setActiveView } = useStore();
  const { data } = useApi<{ communities: any[] }>("/api/public/communities", { communities: fallbackCommunities });
  const communities = data?.communities || fallbackCommunities;

  return (
    <section className="py-20 lg:py-28 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Dubai Neighbourhoods"
            title="Explore Communities"
            subtitle="From beachfront fronds on the Palm to golf-course estates in Dubai Hills — every Royal Jubilant community is documented with lifestyle intelligence, market trends and investment potential."
            icon={<MapPin className="size-4" />}
          />
          <button
            onClick={() => setActiveView("communities")}
            className="flex items-center gap-1.5 text-sm font-medium text-[#A68A3F] hover:gap-2.5 transition-all"
          >
            All Communities <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-12">
          {communities.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer lift-on-hover"
              onClick={() => openCommunity(c.id)}
            >
              <img
                src={c.hero}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover zoom-img"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Top stats */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="px-2.5 py-1 rounded-md glass-dark text-[10px] tracking-luxury uppercase font-medium">
                  {c.totalProperties.toLocaleString()} properties
                </span>
                <span className="px-2.5 py-1 rounded-md glass-dark text-[10px] flex items-center gap-1 font-medium">
                  <Star className="size-3 fill-[#C9A961] text-[#A68A3F]" />
                  {c.rating}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mb-2">
                  Dubai · UAE
                </p>
                <h3 className="font-serif text-2xl lg:text-3xl font-medium leading-tight mb-3">
                  {c.name}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="size-3.5 text-[#A68A3F]" />
                    ROI <strong className="font-semibold ml-1">{c.roi}</strong>
                  </span>
                  <span className="text-white/70">·</span>
                  <span>From <strong className="font-semibold">{c.averagePrice}</strong></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
