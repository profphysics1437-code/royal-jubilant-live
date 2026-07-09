"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, Star, Award, Globe, ArrowRight } from "lucide-react";
import { agents as fallbackAgents } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useApi } from "@/lib/useApi";
import { SectionHeader } from "./FeaturedProperties";

export function Agents() {
  const { openAgent, setActiveView } = useStore();
  const { data } = useApi<{ agents: any[] }>("/api/public/agents/featured", { agents: fallbackAgents });
  const agents = data?.agents || fallbackAgents;

  return (
    <section className="py-10 lg:py-14 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <SectionHeader
            eyebrow="The Royal Jubilant Team"
            title="Meet Our Advisors"
            subtitle="Senior, multilingual and certified — our advisors serve clients across 9 markets with discreet, relationship-led counsel."
            icon={<Award className="size-4" />}
          />
          <button
            onClick={() => setActiveView("agents")}
            className="flex items-center gap-1.5 text-sm font-medium text-[#A68A3F] hover:gap-2.5 transition-all"
          >
            All Advisors <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Matches advice card sizing — 2 cols on mobile, 3 on tablet, 6 on desktop, 9:16 aspect */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mt-12">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group bg-white rounded-xl overflow-hidden border border-[#E5E7EB] lift-on-hover shadow-luxury cursor-pointer"
              onClick={() => openAgent(agent.id)}
            >
              {/* Photo with everything overlaid — 9:16 to match advice cards */}
              <div className="relative aspect-[9/16] overflow-hidden bg-[#F4F5F7]">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top zoom-img"
                />
                {/* Gradient only on bottom 45% so face is not covered */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0A1F44]/95 via-[#0A1F44]/60 to-transparent" />

                {/* Rating badge — top left */}
                <div className="absolute top-2 left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md glass-dark text-white text-[9px] tracking-luxury uppercase font-medium">
                  <Star className="size-2.5 fill-[#C9A961] text-[#A68A3F]" />
                  {agent.rating}
                </div>

                {/* Contact buttons — top right */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${agent.whatsapp}`, "_blank"); }}
                    className="size-7 rounded-full glass flex items-center justify-center hover:bg-[#C9A961] transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="size-3 text-[#0A1F44]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`tel:${agent.phone}`); }}
                    className="size-7 rounded-full glass flex items-center justify-center hover:bg-[#C9A961] transition-colors"
                    aria-label="Call"
                  >
                    <Phone className="size-3 text-[#0A1F44]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`mailto:${agent.email}`); }}
                    className="size-7 rounded-full glass flex items-center justify-center hover:bg-[#C9A961] transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="size-3 text-[#0A1F44]" />
                  </button>
                </div>

                {/* Bottom overlay — name, title, languages, stats, button */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 space-y-1.5">
                  {/* Name + title */}
                  <div>
                    <h3 className="font-serif text-sm font-medium text-white leading-tight line-clamp-1">
                      {agent.name}
                    </h3>
                    <p className="text-[10px] text-[#C9A961] font-medium mt-0.5 tracking-wide line-clamp-1">
                      {agent.title}
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-0.5 flex-wrap">
                    <Globe className="size-2.5 text-white/50" />
                    {agent.languages.slice(0, 2).map((l) => (
                      <span key={l} className="text-[8px] px-1 py-0.5 rounded-full glass-dark text-white/80 font-medium">
                        {l}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-0.5 pt-1 border-t border-white/15">
                    <Stat label="Listings" value={agent.activeListings} />
                    <Stat label="Closed" value={agent.soldProperties} />
                    <Stat label="Years" value={agent.experienceYears} />
                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); openAgent(agent.id); }}
                    className="w-full py-1.5 rounded-full bg-[#C9A961] hover:bg-[#D4B875] text-[#0A1F44] text-[10px] font-medium tracking-luxury uppercase transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0">
      <span className="text-[11px] font-semibold text-white leading-none">{value}</span>
      <span className="text-[8px] text-white/50 uppercase tracking-wide leading-tight mt-0.5">{label}</span>
    </div>
  );
}
