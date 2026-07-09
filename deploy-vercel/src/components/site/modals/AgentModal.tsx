"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Star,
  Award,
  Globe,
  Building,
  Check,
  MapPin,
  Linkedin,
  Instagram,
} from "lucide-react";
import { agents as fallbackAgents, getPropertiesByAgent } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useApi } from "@/lib/useApi";
import { PropertyCard } from "@/components/site/PropertyCard";
import { LeadForm } from "@/components/site/widgets/LeadForm";

export function AgentModal() {
  const { activeAgentId, closeAgent } = useStore();
  const { data } = useApi<{ agent: any }>(activeAgentId ? `/api/public/agents/${activeAgentId}` : null);
  const agent = data?.agent || fallbackAgents.find((a) => a.id === activeAgentId);

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAgent}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="min-h-screen p-0 lg:p-6 flex items-start lg:items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-none lg:rounded-3xl w-full max-w-6xl my-0 lg:my-6 overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative bg-royal-gradient-diagonal text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, rgba(191,160,106,1) 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }} />
                <button onClick={closeAgent} className="absolute top-4 right-4 size-10 rounded-full glass-dark flex items-center justify-center hover:bg-white/15 z-10">
                  <X className="size-5" />
                </button>

                <div className="relative p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="relative">
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="size-32 lg:size-40 rounded-full object-cover object-top border-4 border-[#C9A961]/40"
                      />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#C9A961] text-[#0A1F44] text-[10px] font-bold tracking-luxury uppercase whitespace-nowrap">
                        ★ {agent.rating}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 text-center lg:text-left">
                    <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mb-2">
                      {agent.experienceYears} years in Dubai real estate
                    </div>
                    <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-1">{agent.name}</h1>
                    <p className="text-white/70 mb-4">{agent.title}</p>

                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {agent.specializations.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full glass-dark text-[10px] text-white/85">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 justify-center lg:justify-start mt-5">
                      <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1faa50] text-white text-xs font-medium transition-colors">
                        <MessageCircle className="size-3.5" /> WhatsApp
                      </a>
                      <a href={`tel:${agent.phone}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C9A961] hover:bg-[#D4B875] text-[#0A1F44] text-xs font-medium transition-colors">
                        <Phone className="size-3.5" /> Call
                      </a>
                      <a href={`mailto:${agent.email}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-dark text-white text-xs font-medium hover:bg-white/15 transition-colors">
                        <Mail className="size-3.5" /> Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className="font-serif text-xl font-medium text-[#0A1F44] mb-3">Biography</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{agent.biography}</p>
                  </section>

                  <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Stat label="Active Listings" value={agent.activeListings} />
                    <Stat label="Closed Deals" value={agent.soldProperties} />
                    <Stat label="Client Reviews" value={agent.reviewsCount} />
                    <Stat label="Years Experience" value={agent.experienceYears} />
                  </section>

                  <section>
                    <h2 className="font-serif text-xl font-medium text-[#0A1F44] mb-3">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                      {agent.languages.map((l) => (
                        <span key={l} className="px-3 py-1.5 rounded-full bg-[#F9FAFB] text-xs font-medium text-[#0A1F44] flex items-center gap-1.5">
                          <Globe className="size-3.5 text-[#A68A3F]" />
                          {l}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="font-serif text-xl font-medium text-[#0A1F44] mb-3">Communities Served</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agent.communities.map((c) => (
                        <div key={c} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F9FAFB]">
                          <MapPin className="size-3.5 text-[#A68A3F]" />
                          <span className="text-sm text-[#0A1F44]">{c}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="font-serif text-xl font-medium text-[#0A1F44] mb-3">Awards & Recognition</h2>
                    <div className="space-y-2">
                      {agent.awards.map((a) => (
                        <div key={a} className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB]">
                          <Award className="size-4 text-[#A68A3F] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#0A1F44]">{a}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Active listings */}
                  {getPropertiesByAgent(agent.id).length > 0 && (
                    <section>
                      <h2 className="font-serif text-xl font-medium text-[#0A1F44] mb-4">Active Listings ({getPropertiesByAgent(agent.id).length})</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {getPropertiesByAgent(agent.id).slice(0, 4).map((p, i) => (
                          <PropertyCard key={p.id} property={p} index={i} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-5">
                  {/* Social */}
                  <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-border/60">
                    <h3 className="text-xs tracking-luxury uppercase text-[#A68A3F] font-semibold mb-3">Connect</h3>
                    <div className="flex gap-2">
                      {agent.socials.linkedin && (
                        <a href={agent.socials.linkedin} className="size-9 rounded-full bg-white hover:bg-[#C9A961] flex items-center justify-center transition-colors group">
                          <Linkedin className="size-4 text-[#0A1F44] group-hover:text-white" />
                        </a>
                      )}
                      {agent.socials.instagram && (
                        <a href={agent.socials.instagram} className="size-9 rounded-full bg-white hover:bg-[#C9A961] flex items-center justify-center transition-colors group">
                          <Instagram className="size-4 text-[#0A1F44] group-hover:text-white" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Lead form */}
                  <div className="bg-white rounded-2xl p-5 border border-border/60 sticky top-6">
                    <h3 className="font-serif text-lg font-medium text-[#0A1F44] mb-1">
                      Contact {agent.name.split(" ")[0]}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Send a private message — typically responds within 2 hours.
                    </p>
                    <LeadForm
                      source="contact"
                      agentId={agent.id}
                      contextLabel={`Direct message to ${agent.name}`}
                      compact
                    />
                  </div>
                </aside>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-border/60 text-center">
      <div className="font-serif text-2xl font-semibold text-[#0A1F44]">{value}</div>
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
