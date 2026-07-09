"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/lib/store";
import { communities as fallbackCommunities, properties as fallbackProperties } from "@/lib/data";
import { useApi } from "@/lib/useApi";

const fallbackSlides = [
  { heading1: "Discover Dubai's", heading2: "most extraordinary", heading3: "addresses.", subtitle: "From apartments and villas in family-friendly communities to commercial offices, off-plan launches and industrial units — Royal Jubilant's RERA-certified advisors deliver personal, research-led counsel across every Dubai property category." },
  { heading1: "Your Dream Property", heading2: "Awaits in Dubai", heading3: null, subtitle: "Discover exceptional homes and investment opportunities with Royal Jubilant Real Estate. Your journey to finding the perfect property starts here." },
  { heading1: "Premium Real Estate", heading2: "Services in Dubai", heading3: null, subtitle: "Buy, sell, rent or invest in Off Plan properties with Dubai's trusted real estate broker. RERA-certified advisors, deep local knowledge, and a commitment to smoother transactions." },
];

export function Hero() {
  const { searchFilters, setSearchFilters, setActiveView } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(fallbackSlides);
  const [videoUrl, setVideoUrl] = useState("/dubai-skyline.mp4");
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [slideInterval, setSlideInterval] = useState(5500);
  const [purpose, setPurpose] = useState<"buy" | "rent">("buy");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: commData } = useApi<{ communities: any[] }>("/api/public/communities", { communities: fallbackCommunities });
  const communities = commData?.communities || fallbackCommunities;
  const { data: propData } = useApi<{ total: number }>("/api/public/properties?limit=1", { total: fallbackProperties.length });
  const propertyCount = propData?.total ?? fallbackProperties.length;

  useEffect(() => {
    fetch("/api/public/hero-slides").then((r) => r.json()).then((d) => { if (d.slides && d.slides.length > 0) setSlides(d.slides); }).catch(() => {});
    fetch("/api/public/site-settings").then((r) => r.json()).then((d) => {
      const s = d.settings || {};
      if (s["hero.videoUrl"]) setVideoUrl(s["hero.videoUrl"]);
      if (s["hero.videoSpeed"]) setVideoSpeed(parseFloat(s["hero.videoSpeed"]));
      if (s["hero.slideInterval"]) setSlideInterval(parseInt(s["hero.slideInterval"]));
    }).catch(() => {});
  }, []);

  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = videoSpeed; }, [videoSpeed, videoUrl]);
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), slideInterval);
    return () => clearInterval(timer);
  }, [slides.length, slideInterval]);

  const handleSearch = () => {
    if (purpose === "rent") setActiveView("rent");
    else setActiveView("buy");
  };

  const quickLinks = [
    { label: "Residential", view: "buy" },
    { label: "Commercial", view: "commercial" },
    { label: "Off Plan", view: "off-plan" },
  ];

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=85" className="w-full h-full object-cover" aria-hidden="true">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-center pt-24 lg:pt-32">
          <div className="container mx-auto px-4 lg:px-6 w-full">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-6">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`h-0.5 rounded-full transition-all duration-700 ${i === currentSlide ? "w-12 bg-[#C9A961]" : "w-6 bg-white/30 hover:bg-white/50"}`} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(10px)" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl xl:text-8xl leading-[1.05] font-medium tracking-tight text-white" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
                    {slides[currentSlide].heading1}<br />
                    <span className="text-[#D4B875]">{slides[currentSlide].heading2}</span>
                    {slides[currentSlide].heading3 && (<><br />{slides[currentSlide].heading3}</>)}
                  </h1>
                  <p className="mt-6 text-base lg:text-xl text-white/85 max-w-2xl leading-relaxed font-light" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>{slides[currentSlide].subtitle}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="pb-6 lg:pb-8">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch bg-transparent">
                  <div className="md:col-span-3 flex">
                    <button onClick={() => setPurpose("buy")} className={`flex-1 px-4 py-4 text-sm font-bold transition-all ${purpose === "buy" ? "bg-[#0A1F44] text-white" : "text-white/90 hover:bg-white/10"}`}>Buy</button>
                    <button onClick={() => setPurpose("rent")} className={`flex-1 px-4 py-4 text-sm font-bold transition-all ${purpose === "rent" ? "bg-[#0A1F44] text-white" : "text-white/90 hover:bg-white/10"}`}>Rent</button>
                  </div>
                  <div className="hidden md:block w-px bg-white/20 my-3" />
                  <div className="md:col-span-6 relative bg-transparent">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/60 pointer-events-none z-10" />
                    <select value={searchFilters.location} onChange={(e) => setSearchFilters({ location: e.target.value })} className="w-full h-full min-h-[56px] pl-11 pr-10 text-sm font-medium bg-transparent text-white appearance-none cursor-pointer focus:outline-none [&>option]:text-[#0A1F44]">
                      <option value="">Select Community</option>
                      {communities.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-white/60 pointer-events-none" />
                  </div>
                  <div className="hidden md:block w-px bg-white/20 my-3" />
                  <div className="md:col-span-3">
                    <button onClick={handleSearch} className="w-full h-full min-h-[56px] bg-gradient-to-r from-[#C9A961] to-[#A68A3F] hover:from-[#D4B875] hover:to-[#C9A961] text-[#0A1F44] rounded-none font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg">
                      <Search className="size-4" /><span>Search</span>
                    </button>
                  </div>
                </div>
                <div className="border-t border-white/15 bg-transparent">
                  <div className="flex flex-wrap items-center justify-center gap-1 px-4 py-2.5">
                    {quickLinks.map((q) => (
                      <button key={q.label} onClick={() => setActiveView(q.view as any)} className="px-3 py-1 text-xs font-medium text-white/80 hover:text-white transition-colors">{q.label}</button>
                    ))}
                    <span className="text-white/30">|</span>
                    <button onClick={() => setAdvancedOpen(!advancedOpen)} className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 hover:text-white transition-colors">
                      <SlidersHorizontal className="size-3" />Advanced Search
                      <ChevronDown className={`size-3 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {advancedOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden bg-transparent border-t border-white/15">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Min Price</label>
                          <select value={searchFilters.minPrice || ""} onChange={(e) => setSearchFilters({ minPrice: e.target.value })} className="w-full h-10 px-3 text-sm bg-white/90 text-[#0A1F44] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#C9A961] [&>option]:text-[#0A1F44]">
                            <option value="">No Min</option>
                            <option value="500000">500K</option>
                            <option value="1000000">1M</option>
                            <option value="2000000">2M</option>
                            <option value="5000000">5M</option>
                            <option value="10000000">10M+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Max Price</label>
                          <select value={searchFilters.maxPrice || ""} onChange={(e) => setSearchFilters({ maxPrice: e.target.value })} className="w-full h-10 px-3 text-sm bg-white/90 text-[#0A1F44] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#C9A961] [&>option]:text-[#0A1F44]">
                            <option value="">No Max</option>
                            <option value="1000000">1M</option>
                            <option value="2000000">2M</option>
                            <option value="5000000">5M</option>
                            <option value="10000000">10M</option>
                            <option value="20000000">20M+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-white/70 mb-1">No. of Beds</label>
                          <select value={searchFilters.bedrooms || ""} onChange={(e) => setSearchFilters({ bedrooms: e.target.value })} className="w-full h-10 px-3 text-sm bg-white/90 text-[#0A1F44] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#C9A961] [&>option]:text-[#0A1F44]">
                            <option value="">Any</option>
                            <option value="0">Studio</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-white/70 mb-1">No. of Baths</label>
                          <select value={searchFilters.bathrooms || ""} onChange={(e) => setSearchFilters({ bathrooms: e.target.value })} className="w-full h-10 px-3 text-sm bg-white/90 text-[#0A1F44] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#C9A961] [&>option]:text-[#0A1F44]">
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end px-4 pb-3">
                        <button onClick={() => { setAdvancedOpen(false); handleSearch(); }} className="px-4 py-2 bg-[#0A1F44] text-white text-xs font-semibold rounded-lg hover:bg-[#1a2f54] transition-colors">Apply Filters & Search</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
