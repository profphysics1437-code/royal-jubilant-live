"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  Star,
  Building,
  School,
  Cross,
  Bus,
  ShoppingBag,
  MapPin,
  Award,
  ArrowRight,
  Check,
} from "lucide-react";
import { communities as fallbackCommunities, getPropertiesByCommunity } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useApi } from "@/lib/useApi";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";

export function CommunityModal() {
  const { activeCommunityId, closeCommunity, openProperty, setActiveView } = useStore();
  const { data } = useApi<{ community: any }>(activeCommunityId ? `/api/public/communities/${activeCommunityId}` : null);
  const community = data?.community || fallbackCommunities.find((c) => c.id === activeCommunityId);

  return (
    <AnimatePresence>
      {community && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCommunity}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="min-h-screen flex items-start justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-none lg:rounded-3xl w-full max-w-7xl my-0 overflow-hidden shadow-2xl"
            >
              {/* Hero */}
              <div className="relative h-[40vh] lg:h-[55vh] bg-muted">
                <img
                  src={community.hero}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
                <button onClick={closeCommunity} className="absolute top-4 right-4 size-10 rounded-full glass flex items-center justify-center hover:bg-white/95 transition-colors">
                  <X className="size-5" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 text-white">
                  <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mb-3 flex items-center gap-2">
                    <MapPin className="size-3.5" /> Dubai · United Arab Emirates
                  </div>
                  <h1 className="font-serif text-4xl lg:text-6xl font-medium leading-tight mb-3">
                    {community.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Star className="size-4 fill-[#C9A961] text-[#A68A3F]" />
                      {community.rating} · {community.totalProperties.toLocaleString()} properties
                    </span>
                    <span className="text-white/60">·</span>
                    <span>Population {community.population}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 lg:p-12">
                {/* Stats strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                  {community.stats.map((s) => (
                    <div key={s.label} className="p-5 rounded-2xl bg-[#F9FAFB] border border-border/60 text-center">
                      <div className="font-serif text-2xl lg:text-3xl font-semibold text-gradient-gold">{s.value}</div>
                      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-2">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main content */}
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h2 className="font-serif text-2xl font-medium text-[#0A1F44] mb-3">Overview</h2>
                      <p className="text-base text-muted-foreground leading-relaxed">{community.overview}</p>
                    </section>

                    <section>
                      <h2 className="font-serif text-2xl font-medium text-[#0A1F44] mb-3">Lifestyle</h2>
                      <p className="text-base text-muted-foreground leading-relaxed">{community.lifestyle}</p>
                    </section>

                    <section>
                      <h2 className="font-serif text-2xl font-medium text-[#0A1F44] mb-3">Highlights</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {community.highlights.map((h) => (
                          <div key={h} className="flex items-center gap-2 p-3 rounded-xl bg-[#F9FAFB]">
                            <Check className="size-4 text-[#A68A3F]" />
                            <span className="text-sm text-[#0A1F44]">{h}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Nearby grid */}
                    <section>
                      <h2 className="font-serif text-2xl font-medium text-[#0A1F44] mb-4">What's Nearby</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <NearbyCard
                          icon={<School className="size-4" />}
                          title="Schools"
                          items={community.schools.map((s) => `${s.name} · ${s.rating} · ${s.type}`)}
                        />
                        <NearbyCard
                          icon={<Cross className="size-4" />}
                          title="Hospitals"
                          items={community.hospitals.map((h) => `${h.name} · ${h.distance}`)}
                        />
                        <NearbyCard
                          icon={<Bus className="size-4" />}
                          title="Transport"
                          items={community.transport.map((t) => `${t.name} · ${t.type} · ${t.distance}`)}
                        />
                        <NearbyCard
                          icon={<ShoppingBag className="size-4" />}
                          title="Shopping"
                          items={community.shopping.map((s) => `${s.name} · ${s.type}`)}
                        />
                      </div>
                    </section>

                    {/* Map */}
                    <section>
                      <h2 className="font-serif text-2xl font-medium text-[#0A1F44] mb-4">Map</h2>
                      <div className="rounded-2xl overflow-hidden border border-border/60 aspect-[16/9]">
                        <iframe
                          title={`${community.name} map`}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=55.05,25.05,55.40,25.25&layer=mapnik`}
                          className="w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </section>

                    {/* Properties */}
                    {getPropertiesByCommunity(community.name).length > 0 && (
                      <section>
                        <div className="flex items-end justify-between mb-4">
                          <h2 className="font-serif text-2xl font-medium text-[#0A1F44]">
                            Properties in {community.shortName}
                          </h2>
                          <Button
                            onClick={() => {
                              closeCommunity();
                              setActiveView("buy");
                            }}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#C9A961] text-[#A68A3F]"
                          >
                            View all <ArrowRight className="size-3.5 ml-1" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getPropertiesByCommunity(community.name).slice(0, 6).map((p, i) => (
                            <PropertyCard key={p.id} property={p} index={i} />
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar */}
                  <aside className="space-y-5">
                    {/* Investment summary */}
                    <div className="bg-royal-gradient-diagonal text-white rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="size-4 text-[#A68A3F]" />
                        <h3 className="text-xs tracking-luxury uppercase text-[#A68A3F] font-semibold">Investment Snapshot</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between pb-3 border-b border-white/10">
                          <span className="text-xs text-white/60">Average price</span>
                          <span className="font-serif text-lg font-semibold">{community.averagePrice}</span>
                        </div>
                        <div className="flex items-baseline justify-between pb-3 border-b border-white/10">
                          <span className="text-xs text-white/60">Price per sqft</span>
                          <span className="font-serif text-lg font-semibold">{community.pricePerSqft}</span>
                        </div>
                        <div className="flex items-baseline justify-between pb-3 border-b border-white/10">
                          <span className="text-xs text-white/60">Annual ROI</span>
                          <span className="font-serif text-lg font-semibold text-gradient-gold">{community.roi}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-white/60">Total properties</span>
                          <span className="font-serif text-lg font-semibold">{community.totalProperties.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Nearby communities */}
                    <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-border/60">
                      <h3 className="text-xs tracking-luxury uppercase text-[#A68A3F] font-semibold mb-3">Nearby Communities</h3>
                      <div className="space-y-2">
                        {community.nearbyCommunities.map((c) => (
                          <div key={c} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors">
                            <MapPin className="size-3.5 text-[#A68A3F]" />
                            <span className="text-sm text-[#0A1F44]">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white rounded-2xl p-6 border border-border/60">
                      <h3 className="font-serif text-lg font-medium text-[#0A1F44] mb-2">
                        Speak to a {community.shortName} specialist
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Our advisors have closed {Math.floor(community.totalProperties * 0.08)}+ transactions here.
                      </p>
                      <Button
                        onClick={() => setActiveView("agents")}
                        className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white rounded-full"
                      >
                        Meet the Specialists
                      </Button>
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

function NearbyCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-border/60">
      <div className="flex items-center gap-2 mb-3 text-[#A68A3F]">
        {icon}
        <span className="text-xs tracking-luxury uppercase font-semibold">{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-xs text-[#0A1F44] flex items-start gap-1.5">
            <span className="text-[#A68A3F] mt-0.5">·</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
