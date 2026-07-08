"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Home, BedDouble, ArrowRight, ChevronDown, Building2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { communities as fallbackCommunities, properties as fallbackProperties } from "@/lib/data";
import { useApi } from "@/lib/useApi";

const tabs = [
  { id: "rent", label: "Rent" },
  { id: "sale", label: "Buy" },
  { id: "commercial", label: "Commercial" },
  { id: "off-plan", label: "Off-Plan" },
] as const;

const fallbackSlides = [
  { heading1: "Discover Dubai's", heading2: "most extraordinary", heading3: "addresses.", subtitle: "From apartments and villas in family-friendly communities to commercial offices, off-plan launches and industrial units — Royal Jubilant's RERA-certified advisors deliver personal, research-led counsel across every Dubai property category." },
  { heading1: "Your Dream Property", heading2: "Awaits in Dubai", heading3: null, subtitle: "Discover exceptional homes and investment opportunities with Royal Jubilant Real Estate. Your journey to finding the perfect property starts here." },
  { heading1: "Premium Real Estate", heading2: "Services in Dubai", heading3: null, subtitle: "Buy, sell, rent or invest in Off Plan properties with Dubai's trusted real estate broker. RERA-certified advisors, deep local knowledge, and a commitment to smoother transactions." },
];

export function Hero() {
  const { searchTab, setSearchTab, searchFilters, setSearchFilters, setActiveView } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(fallbackSlides);
  const [videoUrl, setVideoUrl] = useState("/dubai-skyline.mp4");
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [slideInterval, setSlideInterval] = useState(5500);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: commData } = useApi<{ communities: any[] }>("/api/public/communities", { communities: fallbackCommunities });
  const communities = commData?.communities || fallbackCommunities;
  const { data: propData } = useApi<{ total: number }>("/api/public/properties?limit=1", { total: fallbackProperties.length });
  const propertyCount = propData?.total ?? fallbackProperties.length;

  useEffect(() => {
    fetch("/api/public/hero-slides").then((r) => r.json()).then((d) => {
      if (d.slides && d.slides.length > 0) setSlides(d.slides);
    }).catch(() => {});
    fetch("/api/public/site-settings").then((r) => r.json()).then((d) => {
      const s = d.settings || {};
      if (s["hero.videoUrl"]) setVideoUrl(s["hero.videoUrl"]);
      if (s["hero.videoSpeed"]) setVideoSpeed(parseFloat(s["hero.videoSpeed"]));
      if (s["hero.slideInterval"]) setSlideInterval(parseInt(s["hero.slideInterval"]));
    }).catch(() => {});
  }, []);

  // Apply playback speed to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed, videoUrl]);

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), slideInterval);
    return () => clearInterval(timer);
  }, [slides.length, slideInterval]);

  const handleSearch = () => {
    if (searchTab === "rent") setActiveView("rent");
    else if (searchTab === "sale") setActiveView("buy");
    else if (searchTab === "commercial") setActiveView("commercial");
    else if (searchTab === "off-plan") setActiveView("off-plan");
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Full-screen background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=85"
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top spacer for navbar */}
        <div className="flex-1 flex items-center pt-24 lg:pt-32">
          <div className="container mx-auto px-4 lg:px-6 w-full">
            <div className="max-w-4xl">
              {/* Slide indicators — top */}
              <div className="flex items-center gap-2 mb-6">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-0.5 rounded-full transition-all duration-700 ${
                      i === currentSlide ? "w-12 bg-[#C9A961]" : "w-6 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Sliding hero text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1
                    className="font-serif text-4xl sm:text-5xl lg:text-7xl xl:text-8xl leading-[1.05] font-medium tracking-tight text-white"
                    style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
                  >
                    {slides[currentSlide].heading1}
                    <br />
                    <span className="text-[#D4B875]">{slides[currentSlide].heading2}</span>
                    {slides[currentSlide].heading3 && (
                      <>
                        <br />
                        {slides[currentSlide].heading3}
                      </>
                    )}
                  </h1>
                  <p
                    className="mt-6 text-base lg:text-xl text-white/85 max-w-2xl leading-relaxed font-light"
                    style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
                  >
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom search bar — Emaar style glass-morphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pb-6 lg:pb-8"
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="flex gap-0.5 mb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSearchTab(tab.id)}
                    className={`px-5 lg:px-7 py-2.5 text-xs lg:text-sm font-semibold rounded-t-xl transition-all ${
                      searchTab === tab.id
                        ? "bg-white text-[#0A1F44] shadow-lg"
                        : "bg-black/30 backdrop-blur-md text-white hover:bg-black/50 border border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search bar — glass card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl rounded-tl-none p-4 lg:p-5 shadow-2xl border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Location */}
                  <div className="md:col-span-4 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none z-10" />
                    <select
                      value={searchFilters.location}
                      onChange={(e) => setSearchFilters({ location: e.target.value })}
                      className="w-full h-12 pl-10 pr-8 text-sm font-medium border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40 focus:border-[#C9A961] text-[#0A1F44] appearance-none cursor-pointer"
                    >
                      <option value="">Location</option>
                      {communities.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none" />
                  </div>

                  {/* Property Type */}
                  <div className="md:col-span-3 relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none z-10" />
                    <select
                      value={searchFilters.propertyType}
                      onChange={(e) => setSearchFilters({ propertyType: e.target.value })}
                      className="w-full h-12 pl-10 pr-8 text-sm font-medium border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40 focus:border-[#C9A961] text-[#0A1F44] appearance-none cursor-pointer"
                    >
                      <option value="">Property Type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Penthouse</option>
                      <option>Townhouse</option>
                      <option>Studio</option>
                      <option>Private Room</option>
                      <option>Bed Space</option>
                      <option>Office</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none" />
                  </div>

                  {/* Bedrooms */}
                  <div className="md:col-span-3 relative">
                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none z-10" />
                    <select
                      value={searchFilters.bedrooms}
                      onChange={(e) => setSearchFilters({ bedrooms: e.target.value })}
                      className="w-full h-12 pl-10 pr-8 text-sm font-medium border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40 focus:border-[#C9A961] text-[#0A1F44] appearance-none cursor-pointer"
                    >
                      <option value="">No. of Beds</option>
                      <option value="0">Studio</option>
                      <option value="1">1+ beds</option>
                      <option value="2">2+ beds</option>
                      <option value="3">3+ beds</option>
                      <option value="4">4+ beds</option>
                      <option value="5">5+ beds</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF] pointer-events-none" />
                  </div>

                  {/* Search button */}
                  <div className="md:col-span-2">
                    <button
                      onClick={handleSearch}
                      className="w-full h-12 bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Search className="size-4" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {/* Bottom row — listing count + browse all */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Building2 className="size-3.5 text-[#A68A3F]" />
                    <span><strong className="text-[#0A1F44]">{propertyCount}</strong> live listings available</span>
                  </div>
                  <button
                    onClick={() => setActiveView("search-results")}
                    className="flex items-center gap-1 text-xs font-semibold text-[#0A1F44] hover:text-[#A68A3F] transition-colors"
                  >
                    Browse all properties <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
