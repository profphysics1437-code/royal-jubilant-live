'use client';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, MousePointerClick, Zap } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { WireframeRobot } from '@/components/ai/WireframeRobot';

export function AIPoweredView() {
  const { get } = useSiteSettings();

  const heroTitle = get("aipage.heroTitle", "Find Your Perfect Property with AI");
  const heroSubtitle = get("aipage.heroSubtitle", "Smart recommendations. Real-time insights. Find properties that match your lifestyle.");
  const ctaTitle = get("aipage.ctaTitle", "Experience the Future of Real Estate");
  const ctaText = get("aipage.ctaText", "Try RJ AI today. Ask a question, search for a property, or schedule a viewing — all powered by artificial intelligence.");

  return (
    <div className="min-h-screen bg-[#0A1F44] relative overflow-hidden">
      {/* === GLOBAL SCI-FI BACKGROUND === */}
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(74,144,226,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,144,226,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      {/* Floating particles */}
      {[
        { top: '10%', left: '15%', size: 3 },
        { top: '25%', left: '80%', size: 2 },
        { top: '50%', left: '5%', size: 4 },
        { top: '70%', left: '90%', size: 2 },
        { top: '85%', left: '20%', size: 3 },
        { top: '40%', left: '95%', size: 2 },
        { top: '15%', left: '50%', size: 2 },
        { top: '60%', left: '70%', size: 3 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#4a90e2]"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, boxShadow: `0 0 ${p.size * 3}px #4a90e2` }}
          animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -20, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4a90e2] rounded-full filter blur-[150px] opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A961] rounded-full filter blur-[150px] opacity-10" />

      {/* === HERO SECTION — Full screen with large robot === */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A961]/20 backdrop-blur-md rounded-full border border-[#C9A961]/30 mb-6">
              <Sparkles size={14} className="text-[#C9A961]" />
              <span className="text-[#C9A961] text-sm uppercase tracking-wider font-semibold">AI POWERED REAL ESTATE</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">{heroTitle}</h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">{heroSubtitle}</p>
            <div className="flex gap-2 mb-8">
              {['For Sale', 'For Rent', 'New Projects'].map((tab, i) => (
                <button key={tab} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${i === 0 ? 'bg-[#C9A961] text-[#0A1F44]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{tab}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#C9A961] hover:bg-[#A68A3F] text-[#0A1F44] font-semibold rounded-lg hover:scale-105 transition">Try RJ AI Now</button>
              <button onClick={() => document.getElementById('animation-flow')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 border border-[#4a90e2]/30 text-white rounded-lg hover:bg-[#4a90e2]/10 transition">See How It Works</button>
            </div>
          </motion.div>

          {/* Right: Full-size robot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing platform/ring */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 w-64 h-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(74,144,226,0.4) 0%, rgba(74,144,226,0.1) 50%, transparent 70%)',
              }}
            />
            {/* Orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-10 w-56 h-56 rounded-full border border-[#4a90e2]/30"
              style={{ borderRightColor: 'rgba(74,144,226,0.6)', borderTopColor: 'rgba(74,144,226,0.3)' }}
            />
            {/* Robot — large size */}
            <div className="relative z-10" style={{ marginBottom: '-20px' }}>
              <WireframeRobot size={280} animate={true} />
            </div>
          </motion.div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#4a90e2]/40" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#4a90e2]/40" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#4a90e2]/40" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#4a90e2]/40" />
      </section>

      {/* === 5-STEP ANIMATION FLOW === */}
      <section id="animation-flow" className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[#C9A961] text-sm uppercase tracking-[0.3em] font-semibold mb-3">AI Assistant Animation Flow</div>
            <h2 className="text-4xl font-serif text-white">How RJ AI Comes to Life</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: 1, title: 'Orb Idle', desc: 'Floating holographic orb with soft glow and orbiting particles', icon: Sparkles, color: '#C9A961' },
              { step: 2, title: 'Hover State', desc: 'Glow intensifies and tooltip appears: "Hi, I\'m RJ AI"', icon: MousePointerClick, color: '#4a90e2' },
              { step: 3, title: 'Click Transition', desc: 'Orb transforms into AI Robot with smooth morph animation', icon: Zap, color: '#C9A961' },
              { step: 4, title: 'Robot Idle', desc: 'AI robot greets the user with a friendly wave', icon: Sparkles, color: '#4a90e2' },
              { step: 5, title: 'Chat Panel Opens', desc: 'Smooth panel slides in with premium animations', icon: MessageSquare, color: '#C9A961' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0A1F44]/80 backdrop-blur-md rounded-2xl p-6 border border-[#4a90e2]/20 text-center"
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${s.color}20`, border: `2px solid ${s.color}40` }}>
                  <s.icon size={24} style={{ color: s.color }} />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: s.color }}>Step {s.step}</div>
                <h3 className="font-serif text-lg text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === DESIGN FEATURES === */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-white mb-3">Design Features</h2>
            <p className="text-slate-400">Premium design elements that make RJ AI special</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Premium 3D AI Robot', 'Holographic Orb', 'Smooth Animations', 'Luxury Gold & Navy Theme',
              'Glassmorphism UI', 'Real-time AI Chat', 'Quick Action Buttons', 'Mobile Responsive',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-[#0A1F44]/60 backdrop-blur-md border border-[#4a90e2]/20 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-[#C9A961]" />
                </div>
                <span className="text-sm font-medium text-white">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === COLOR PALETTE === */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-white mb-8">Color Palette</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { color: '#0A1F44', name: 'Primary Navy' },
              { color: '#1a3a5c', name: 'Medium Navy' },
              { color: '#4a90e2', name: 'Electric Blue' },
              { color: '#C9A961', name: 'Primary Gold' },
              { color: '#A68A3F', name: 'Secondary Gold' },
              { color: '#ffffff', name: 'White' },
            ].map((c) => (
              <div key={c.color} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border-4 border-white/10 shadow-md" style={{ background: c.color, boxShadow: `0 0 20px ${c.color}40` }} />
                <span className="text-xs text-slate-400 font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CAPABILITIES === */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-white mb-3">AI Capabilities</h2>
            <p className="text-slate-400">Everything RJ AI can do for you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Find Luxury Villas', desc: 'Discover premium villas in Palm Jumeirah, Emirates Hills, and Dubai Hills' },
              { title: 'Show Apartments', desc: 'Browse apartments in Dubai Marina, Downtown, JVC, and Business Bay' },
              { title: 'Investment Opportunities', desc: 'AI-analyzed ROI predictions and high-yield property recommendations' },
              { title: 'Market Insights', desc: 'Real-time Dubai market analytics: price trends, hot communities, ROI projections' },
              { title: 'Schedule a Viewing', desc: 'Book property viewings with agents directly through AI' },
              { title: 'Contact an Agent', desc: 'Get connected with the right RERA-certified advisor instantly' },
              { title: 'Best Communities', desc: 'Explore Dubai\'s top neighborhoods with lifestyle matching' },
              { title: 'Off-plan Projects', desc: 'Access exclusive off-plan launches from leading developers' },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-[#0A1F44]/60 backdrop-blur-md border border-[#4a90e2]/20 hover:border-[#C9A961]/40 transition"
              >
                <h3 className="font-serif text-lg text-white mb-2">{c.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif mb-4 text-white">{ctaTitle}</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">{ctaText}</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[#C9A961] text-[#0A1F44] font-semibold rounded-lg hover:scale-105 transition shadow-xl">
            Start Chatting with RJ AI →
          </button>
        </div>
      </section>
    </div>
  );
}
