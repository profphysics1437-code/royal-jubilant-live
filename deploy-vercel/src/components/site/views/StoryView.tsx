'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight, X, Award, Users, Briefcase } from 'lucide-react';

interface StoryEvent {
  id: string; title: string; description: string; eventDate: string; location?: string;
  category: string; images: string; videoUrl?: string; highlighted: boolean;
}

export function StoryView() {
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<StoryEvent | null>(null);

  useEffect(() => {
    fetch('/api/public/story').then(r => r.json()).then(d => { setEvents(d.events || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const parseImages = (imgStr: string): string[] => { try { return JSON.parse(imgStr); } catch { return []; } };
  const nextSlide = () => setActiveIndex(i => (i + 1) % Math.max(events.length, 1));
  const prevSlide = () => setActiveIndex(i => (i - 1 + events.length) % Math.max(events.length, 1));
  const openModal = (e: StoryEvent) => { setModalEvent(e); setModalOpen(true); };

  const categoryIcon = (cat: string) => {
    if (cat === 'award') return <Award className="text-amber-500" />;
    if (cat === 'meeting') return <Briefcase className="text-blue-500" />;
    if (cat === 'celebration') return <Users className="text-purple-500" />;
    return <Calendar className="text-emerald-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="relative h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-amber-500 text-sm uppercase tracking-[0.3em] mb-3">Our Story & Events</div>
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">A Journey of Excellence</h1>
            <p className="text-slate-300 text-lg max-w-2xl">From humble beginnings to becoming one of Dubai's most trusted luxury real estate brokerages — every milestone, every award, every celebration.</p>
          </motion.div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif text-slate-900">Featured Moments</h2>
          {events.length > 1 && (
            <div className="flex gap-2">
              <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white transition"><ChevronLeft size={20} /></button>
              <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white transition"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
        {loading ? <div className="h-96 bg-slate-100 animate-pulse rounded-2xl" /> : events.length === 0 ? (
          <div className="text-center py-20 text-slate-500"><Calendar size={48} className="mx-auto mb-4 opacity-40" /><p>Story events will appear here soon.</p></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group" onClick={() => openModal(events[activeIndex])}>
              {parseImages(events[activeIndex].images)[0] ? <img src={parseImages(events[activeIndex].images)[0]} alt={events[activeIndex].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  {categoryIcon(events[activeIndex].category)}
                  <span className="text-amber-400 text-sm uppercase tracking-wider">{events[activeIndex].category}</span>
                  <span className="text-slate-300 text-sm">{new Date(events[activeIndex].eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h3 className="text-3xl font-serif mb-2">{events[activeIndex].title}</h3>
                <p className="text-slate-200 max-w-2xl line-clamp-2">{events[activeIndex].description}</p>
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm">{activeIndex + 1} / {events.length}</div>
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {events.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-serif text-slate-900 text-center mb-12">Our Timeline</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-slate-300 to-transparent" />
            {events.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-20 pb-10 cursor-pointer group" onClick={() => { setActiveIndex(i); openModal(e); }}>
                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-lg group-hover:scale-125 transition" />
                <div className="bg-white rounded-xl p-5 shadow-md border border-slate-100 group-hover:shadow-lg group-hover:border-amber-200 transition">
                  <div className="flex items-center gap-2 mb-1 text-xs text-slate-500">
                    {categoryIcon(e.category)}
                    <span className="uppercase tracking-wider">{e.category}</span>
                    <span>·</span>
                    <span>{new Date(e.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                    {e.location && <><span>·</span><MapPin size={12} /><span>{e.location}</span></>}
                  </div>
                  <h3 className="text-lg font-serif text-slate-900 mb-1">{e.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{e.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {modalOpen && modalEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 bg-slate-900">
                {parseImages(modalEvent.images)[0] && <img src={parseImages(modalEvent.images)[0]} alt={modalEvent.title} className="w-full h-full object-cover" />}
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
                </div>
                <h2 className="text-3xl font-serif text-slate-900 mb-4">{modalEvent.title}</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{modalEvent.description}</p>
                {parseImages(modalEvent.images).length > 1 && (
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {parseImages(modalEvent.images).slice(1).map((img, i) => <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg" />)}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
