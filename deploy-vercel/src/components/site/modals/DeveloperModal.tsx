"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Award, Check, ArrowRight, MapPin, Calendar, HardHat, Trophy, TrendingUp } from "lucide-react";
import { developers as fallbackDevelopers, getPropertiesByDeveloper } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useApi } from "@/lib/useApi";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";

// Developer brand styling — each developer gets a unique premium look
const developerBrands: Record<string, { gradient: string; logoText: string; logoStyle: string; accent: string; pattern: string }> = {
  "Emaar Properties": {
    gradient: "from-[#0A1F44] via-[#0D2B5C] to-[#1a3a6e]",
    logoText: "EMAAR",
    logoStyle: "font-sans font-bold tracking-[0.3em] text-white text-3xl",
    accent: "#C9A961",
    pattern: "radial-gradient(circle at 20% 50%, rgba(201,169,97,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(201,169,97,0.1) 0%, transparent 50%)",
  },
  "Nakheel": {
    gradient: "from-[#003D7A] via-[#0066B3] to-[#0088CC]",
    logoText: "NAKHEEL",
    logoStyle: "font-sans font-bold tracking-[0.15em] text-white text-3xl",
    accent: "#FFD700",
    pattern: "radial-gradient(circle at 30% 30%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)",
  },
  "DAMAC Properties": {
    gradient: "from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]",
    logoText: "DAMAC",
    logoStyle: "font-serif font-bold italic tracking-wider text-[#C9A961] text-4xl",
    accent: "#C9A961",
    pattern: "radial-gradient(circle at 50% 0%, rgba(201,169,97,0.2) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(201,169,97,0.1) 0%, transparent 50%)",
  },
  "Sobha Realty": {
    gradient: "from-[#5C0000] via-[#8B0000] to-[#B22222]",
    logoText: "SOBHA",
    logoStyle: "font-serif font-bold tracking-[0.2em] text-white text-3xl",
    accent: "#FFD700",
    pattern: "radial-gradient(circle at 20% 80%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
  },
  "Meydan Group": {
    gradient: "from-[#1a1a2e] via-[#2C3E50] to-[#34495E]",
    logoText: "MEYDAN",
    logoStyle: "font-sans font-bold tracking-[0.25em] text-[#C9A961] text-3xl",
    accent: "#C9A961",
    pattern: "radial-gradient(circle at 40% 40%, rgba(201,169,97,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.08) 0%, transparent 50%)",
  },
  "The Omniyat": {
    gradient: "from-[#2D0A31] via-[#4A0E4E] to-[#7B1FA2]",
    logoText: "OMNIYAT",
    logoStyle: "font-sans font-light tracking-[0.4em] text-white text-2xl",
    accent: "#E0C3FC",
    pattern: "radial-gradient(circle at 30% 50%, rgba(224,195,252,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
  },
};

function getBrand(name: string) {
  return developerBrands[name] || {
    gradient: "from-[#0A1F44] via-[#0D2B5C] to-[#1a3a6e]",
    logoText: name.toUpperCase(),
    logoStyle: "font-serif font-bold text-white text-2xl",
    accent: "#C9A961",
    pattern: "radial-gradient(circle at 50% 50%, rgba(201,169,97,0.1) 0%, transparent 50%)",
  };
}

export function DeveloperModal() {
  const { activeDeveloperId, closeDeveloper, setActiveView } = useStore();
  const { data } = useApi<{ developer: any }>(activeDeveloperId ? `/api/public/developers/${activeDeveloperId}` : null);
  const developer = data?.developer || fallbackDevelopers.find((d) => d.id === activeDeveloperId);

  const listings = developer ? getPropertiesByDeveloper(developer.name) : [];

  return (
    <AnimatePresence>
      {developer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md overflow-y-auto"
        >
          {/* Click backdrop to close — but NOT when clicking inside the modal */}
          <div className="min-h-screen flex items-start justify-center" onClick={closeDeveloper}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-none lg:rounded-3xl w-full max-w-6xl my-0 lg:my-8 overflow-hidden shadow-2xl relative"
            >
              {/* Close button — placed at modal level, above everything */}
              <button
                onClick={() => closeDeveloper()}
                className="absolute top-4 right-4 z-[100] size-11 rounded-full bg-white/20 hover:bg-white hover:text-[#0A1F44] backdrop-blur-md flex items-center justify-center transition-all text-white shadow-lg"
                aria-label="Close"
                style={{ position: 'absolute', zIndex: 100 }}
              >
                <X className="size-5" />
              </button>

              {/* Hero — branded gradient with logo */}
              <div className={`relative h-[35vh] lg:h-[45vh] bg-gradient-to-br ${getBrand(developer.name).gradient} overflow-hidden`}>
                {/* Pattern overlay */}
                <div className="absolute inset-0" style={{ background: getBrand(developer.name).pattern }} />

                {/* Hero image faded in background */}
                <img
                  src={developer.hero}
                  alt={developer.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />

                {/* Logo — branded text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="bg-white rounded-xl px-8 py-5 shadow-2xl flex items-center justify-center">
                    <img
                      src={developer.logo}
                      alt={`${developer.name} logo`}
                      className="max-h-16 max-w-[200px] object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; const p = (e.target as HTMLImageElement).parentElement; if (p && !p.querySelector('.fb')) { const s = document.createElement('span'); s.className = 'fb font-serif text-2xl font-bold text-[#0A1F44]'; s.textContent = developer.name; p.appendChild(s); } }}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-white/80">
                    <span className="text-xs tracking-luxury uppercase flex items-center gap-1.5">
                      <Calendar className="size-3" /> Est. {developer.founded}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-xs tracking-luxury uppercase flex items-center gap-1.5">
                      <MapPin className="size-3" /> {developer.headquarters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 lg:p-10">
                {/* Stats strip — premium cards */}
                <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-8">
                  <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#0A1F44] to-[#1a3a6e] text-white">
                    <Building2 className="absolute -bottom-2 -right-2 size-12 text-white/10" />
                    <div className="font-serif text-2xl lg:text-3xl font-bold">{developer.totalProjects}</div>
                    <div className="text-[9px] tracking-luxury uppercase text-[#C9A961] mt-1">Total Projects</div>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#C9A961]/15 to-[#A68A3F]/10 border border-[#C9A961]/20">
                    <Check className="absolute -bottom-2 -right-2 size-12 text-[#C9A961]/15" />
                    <div className="font-serif text-2xl lg:text-3xl font-bold text-[#0A1F44]">{developer.completedProjects}</div>
                    <div className="text-[9px] tracking-luxury uppercase text-[#A68A3F] mt-1">Completed</div>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#0A1F44]/10 to-[#0A1F44]/5 border border-border/60">
                    <HardHat className="absolute -bottom-2 -right-2 size-12 text-[#0A1F44]/10" />
                    <div className="font-serif text-2xl lg:text-3xl font-bold text-[#0A1F44]">{developer.ongoingProjects}</div>
                    <div className="text-[9px] tracking-luxury uppercase text-muted-foreground mt-1">Ongoing</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main content */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section>
                      <h2 className="font-serif text-xl lg:text-2xl font-medium text-[#0A1F44] mb-3 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#C9A961]" /> About the Developer
                      </h2>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{developer.overview}</p>
                    </section>

                    {/* Featured Projects */}
                    <section>
                      <h2 className="font-serif text-xl lg:text-2xl font-medium text-[#0A1F44] mb-4 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#C9A961]" /> Featured Projects
                      </h2>
                      <div className="space-y-2">
                        {developer.topProjects.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-xl bg-white border border-border/60 hover:border-[#C9A961] hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-lg bg-[#0A1F44] flex items-center justify-center text-[#C9A961] font-serif font-bold text-sm flex-shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <div className="font-medium text-[#0A1F44] text-sm">{p.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <MapPin className="size-3" /> {p.community}
                                </div>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide flex-shrink-0 ${
                              p.status === "Completed" ? "bg-green-100 text-green-700" :
                              p.status === "Under Construction" ? "bg-amber-100 text-amber-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Available listings */}
                    {listings.length > 0 && (
                      <section>
                        <div className="flex items-end justify-between mb-4">
                          <h2 className="font-serif text-xl lg:text-2xl font-medium text-[#0A1F44] flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[#C9A961]" /> Available Inventory ({listings.length})
                          </h2>
                          <Button
                            onClick={() => { closeDeveloper(); setActiveView("buy"); }}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#C9A961] text-[#A68A3F]"
                          >
                            View all <ArrowRight className="size-3.5 ml-1" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {listings.slice(0, 4).map((p, i) => (
                            <PropertyCard key={p.id} property={p} index={i} />
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar */}
                  <aside className="space-y-4">
                    {/* Awards */}
                    <div className="bg-gradient-to-br from-[#F9FAFB] to-white rounded-2xl p-6 border border-border/60">
                      <h3 className="text-xs tracking-luxury uppercase text-[#A68A3F] font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="size-3.5" /> Awards & Recognition
                      </h3>
                      <div className="space-y-3">
                        {developer.awards.map((a) => (
                          <div key={a} className="flex items-start gap-2.5">
                            <div className="size-1.5 rounded-full bg-[#C9A961] mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-[#0A1F44] leading-relaxed">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA card */}
                    <div className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6e] rounded-2xl p-6 text-white relative overflow-hidden">
                      <div className="absolute -top-4 -right-4 size-24 rounded-full bg-[#C9A961]/10" />
                      <div className="absolute -bottom-8 -left-4 size-32 rounded-full bg-[#C9A961]/5" />
                      <div className="relative">
                        <TrendingUp className="size-6 text-[#C9A961] mb-3" />
                        <h3 className="font-serif text-lg font-medium mb-2">First-call allocations</h3>
                        <p className="text-xs text-white/70 mb-4 leading-relaxed">
                          Royal Jubilant clients get priority access to {developer.name.split(" ")[0]}'s pre-launch inventory before public release.
                        </p>
                        <Button
                          onClick={() => { closeDeveloper(); setActiveView("contact"); }}
                          className="w-full bg-[#C9A961] hover:bg-[#D4AF37] text-[#0A1F44] rounded-full font-semibold"
                        >
                          Speak to a Specialist
                        </Button>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
