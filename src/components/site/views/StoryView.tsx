'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight, X, Search, Award, Users, Briefcase, Building, Star, ChevronDown } from 'lucide-react';

interface StoryEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location?: string;
  category: string;
  developer?: string;
  tags: string;
  featuredImage?: string;
  images: string;
  videoUrl?: string;
  highlighted: boolean;
  featured: boolean;
}

interface StoryDeveloper {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}

export function StoryView() {
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [developers, setDevelopers] = useState<StoryDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<StoryEvent | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterDeveloper, setFilterDeveloper] = useState('all');

  useEffect(() => {
    Promise.all([
      fetch('/api/public/story').then(r => r.json()),
      fetch('/api/public/story-developers').then(r => r.json()).catch(() => ({ developers: [] }))
    ]).then(([storyData, devData]) => {
      setEvents(storyData.events || []);
      setDevelopers(devData.developers || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const parseImages = (imgStr: string): string[] => {
    try { return JSON.parse(imgStr); } catch { return []; }
  };

  const parseTags = (tagStr: string): string[] => {
    try { return JSON.parse(tagStr); } catch { return []; }
  };

  // Get unique years and categories for filters
  const years = useMemo(() => {
    const ys = events.map(e => new Date(e.eventDate).getFullYear().toString());
    return ['all', ...Array.from(new Set(ys))].sort((a, b) => b.localeCompare(a));
  }, [events]);

  const categories = useMemo(() => {
    const cats = events.map(e => e.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [events]);

  const developerNames = useMemo(() => {
    const devs = events.map(e => e.developer).filter(Boolean);
    return ['all', ...Array.from(new Set(devs))];
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (searchTerm && !e.title.toLowerCase().includes(searchTerm.toLowerCase()) && !e.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterCategory !== 'all' && e.category !== filterCategory) return false;
      if (filterYear !== 'all' && new Date(e.eventDate).getFullYear().toString() !== filterYear) return false;
      if (filterDeveloper !== 'all' && e.developer !== filterDeveloper) return false;
      return true;
    });
  }, [events, searchTerm, filterCategory, filterYear, filterDeveloper]);

  const featuredEvents = events.filter(e => e.featured);
  const timelineEvents = events.filter(e => !e.featured).sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  const nextSlide = () => setActiveIndex(i => (i + 1) % Math.max(featuredEvents.length, 1));
  const prevSlide = () => setActiveIndex(i => (i - 1 + featuredEvents.length) % Math.max(featuredEvents.length, 1));
  const openModal = (e: StoryEvent) => { setModalEvent(e); setModalOpen(true); };
  const openLightbox = (e: StoryEvent, imgIndex: number) => { setModalEvent(e); setLightboxIndex(imgIndex); setLightboxOpen(true); };

  const categoryIcon = (cat: string) => {
    if (cat === 'award') return <Award className="text-[#C9A961]" size={14} />;
    if (cat === 'meeting') return <Briefcase className="text-[#C9A961]" size={14} />;
    if (cat === 'celebration') return <Users className="text-[#C9A961]" size={14} />;
    if (cat === 'partnership') return <Building className="text-[#C9A961]" size={14} />;
    return <Calendar className="text-[#C9A961]" size={14} />;
  };

  const stats = [
    { value: events.length, label: 'Events Attended' },
    { value: developers.length, label: 'Developer Partnerships' },
    { value: events.filter(e => e.category === 'award').length, label: 'Awards' },
    { value: 15, label: 'Years of Experience' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* === HERO === */}
      <div className="relative h-[60vh] bg-[#0A1F44] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/80 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-[#C9A961] text-sm uppercase tracking-[0.3em] mb-3">Our Story & Events</div>
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">A Journey of Excellence</h1>
            <p className="text-slate-300 text-lg max-w-2xl">From humble beginnings to becoming one of Dubai's most trusted luxury real estate brokerages. Explore our milestones, partnerships with leading developers, awards, and the events that shaped our journey in the UAE real estate market.</p>
          </motion.div>
        </div>
      </div>

      {/* === STATS === */}
      <section className="bg-[#0A1F44] py-12 border-t border-[#C9A961]/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl font-serif font-bold text-[#C9A961]">{s.value}+</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === FEATURED EVENTS SLIDER === */}
      {featuredEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif text-[#0A1F44]">Featured Events</h2>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-[#0A1F44] hover:text-white transition"><ChevronLeft size={20} /></button>
              <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-[#0A1F44] hover:text-white transition"><ChevronRight size={20} /></button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => openModal(featuredEvents[activeIndex])}
            >
              {featuredEvents[activeIndex]?.featuredImage || parseImages(featuredEvents[activeIndex]?.images || '[]')[0] ? (
                <img src={featuredEvents[activeIndex]?.featuredImage || parseImages(featuredEvents[activeIndex]?.images || '[]')[0]} alt={featuredEvents[activeIndex]?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44] to-[#1a3a5c]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  {categoryIcon(featuredEvents[activeIndex]?.category)}
                  <span className="text-[#C9A961] text-sm uppercase tracking-wider">{featuredEvents[activeIndex]?.category}</span>
                  <span className="text-slate-300 text-sm">{new Date(featuredEvents[activeIndex]?.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {featuredEvents[activeIndex]?.developer && <><span>·</span><span className="text-[#C9A961] text-sm">{featuredEvents[activeIndex]?.developer}</span></>}
                </div>
                <h3 className="text-3xl font-serif mb-2">{featuredEvents[activeIndex]?.title}</h3>
                <p className="text-slate-200 max-w-2xl line-clamp-2">{featuredEvents[activeIndex]?.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-[#C9A961] text-sm font-semibold">
                  View Details <ChevronRight size={16} />
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm">{activeIndex + 1} / {featuredEvents.length}</div>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* === EVENTS GALLERY WITH FILTERS === */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif text-[#0A1F44] mb-8 text-center">Events Gallery</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40 min-w-[200px]"
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40">
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40">
            {years.map(y => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
          </select>
          <select value={filterDeveloper} onChange={(e) => setFilterDeveloper(e.target.value)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A961]/40">
            {developerNames.map(d => <option key={d} value={d}>{d === 'all' ? 'All Developers' : d}</option>)}
          </select>
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-40" />
            <p>No events found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((e, i) => {
              const imgs = parseImages(e.images);
              const mainImg = e.featuredImage || imgs[0];
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer"
                  onClick={() => openModal(e)}
                >
                  {mainImg ? (
                    <img src={mainImg} alt={e.title} loading="lazy" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-[#0A1F44] to-[#1a3a5c]" />
                  )}
                  {/* Dark luxury overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      {categoryIcon(e.category)}
                      <span className="uppercase tracking-wider text-[#C9A961]">{e.category}</span>
                      <span>·</span>
                      <span>{new Date(e.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3 className="font-serif text-lg mb-1 line-clamp-1">{e.title}</h3>
                    {e.developer && <p className="text-xs text-[#C9A961] mb-1">{e.developer}</p>}
                    {e.location && <p className="text-xs text-slate-300 flex items-center gap-1"><MapPin size={10} />{e.location}</p>}
                  </div>
                  {/* Hover View Details */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-[#C9A961] text-[#0A1F44] px-4 py-2 rounded-lg text-sm font-semibold">View Details</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* === TIMELINE === */}
      {timelineEvents.length > 0 && (
        <section className="bg-[#F9FAFB] py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-serif text-[#0A1F44] text-center mb-12">Our Timeline</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9A961] via-slate-300 to-transparent" />
              {timelineEvents.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-20 pb-10 cursor-pointer group"
                  onClick={() => openModal(e)}
                >
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-[#C9A961] border-4 border-white shadow-lg group-hover:scale-125 transition" />
                  <div className="bg-white rounded-xl p-5 shadow-md border border-slate-100 group-hover:shadow-lg group-hover:border-[#C9A961]/30 transition">
                    <div className="flex items-center gap-2 mb-1 text-xs text-slate-500">
                      {categoryIcon(e.category)}
                      <span className="uppercase tracking-wider">{e.category}</span>
                      <span>·</span>
                      <span>{new Date(e.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                      {e.location && <><span>·</span><MapPin size={12} /><span>{e.location}</span></>}
                    </div>
                    <h3 className="text-lg font-serif text-[#0A1F44] mb-1">{e.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{e.description}</p>
                    {e.developer && <p className="text-xs text-[#C9A961] mt-1">{e.developer}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === DEVELOPER PARTNERSHIPS === */}
      {developers.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-serif text-[#0A1F44] text-center mb-12">Developer Partnerships</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {developers.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-[#C9A961]/30 transition flex flex-col items-center text-center"
                >
                  {d.logo ? (
                    <img src={d.logo} alt={d.name} className="h-16 w-auto object-contain mb-3" />
                  ) : (
                    <div className="h-16 flex items-center justify-center mb-3">
                      <Building className="size-10 text-[#C9A961]" />
                    </div>
                  )}
                  <h3 className="font-serif text-sm text-[#0A1F44]">{d.name}</h3>
                  {d.website && <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C9A961] mt-1 hover:underline">Visit Website</a>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === MODAL === */}
      <AnimatePresence>
        {modalOpen && modalEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64 bg-[#0A1F44]">
                {modalEvent.featuredImage && <img src={modalEvent.featuredImage} alt={modalEvent.title} className="w-full h-full object-cover" />}
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><X size={20} /></button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                  {categoryIcon(modalEvent.category)}
                  <span className="uppercase tracking-wider">{modalEvent.category}</span>
                  <span>·</span>
                  <Calendar size={14} />
                  <span>{new Date(modalEvent.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  {modalEvent.location && <><span>·</span><MapPin size={14} /><span>{modalEvent.location}</span></>}
                  {modalEvent.developer && <><span>·</span><Building size={14} /><span className="text-[#C9A961]">{modalEvent.developer}</span></>}
                </div>
                <h2 className="text-3xl font-serif text-[#0A1F44] mb-4">{modalEvent.title}</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-6">{modalEvent.description}</p>
                
                {/* Tags */}
                {parseTags(modalEvent.tags).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {parseTags(modalEvent.tags).map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-[#C9A961]/10 text-[#A68A3F] text-xs rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Gallery */}
                {parseImages(modalEvent.images).length > 1 && (
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {parseImages(modalEvent.images).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition" onClick={() => openLightbox(modalEvent, i)} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LIGHTBOX === */}
      <AnimatePresence>
        {lightboxOpen && modalEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 z-10" onClick={() => setLightboxOpen(false)}><X size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + parseImages(modalEvent.images).length) % parseImages(modalEvent.images).length); }} className="absolute left-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 z-10"><ChevronLeft size={24} /></button>
            <img
              src={parseImages(modalEvent.images)[lightboxIndex]}
              alt={modalEvent.title}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % parseImages(modalEvent.images).length); }} className="absolute right-4 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 z-10"><ChevronRight size={24} /></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">{lightboxIndex + 1} / {parseImages(modalEvent.images).length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
