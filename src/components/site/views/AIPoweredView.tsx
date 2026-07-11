'use client';
import { motion } from 'framer-motion';
import { Sparkles, Bot, MessageSquare, MousePointerClick, Zap } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { WireframeRobotLarge } from '@/components/ai/WireframeRobot';

export function AIPoweredView() {
  const { get } = useSiteSettings();

  // Read from SiteSettings — admin can edit in /admin/settings → AI Powered Page
  const heroTitle = get("aipage.heroTitle", "Find Your Perfect Property with AI");
  const heroSubtitle = get("aipage.heroSubtitle", "Smart recommendations. Real-time insights. Find properties that match your lifestyle.");
  const heroParagraph = get("aipage.heroParagraph", "Royal Jubilant integrates cutting-edge artificial intelligence into every step of your property journey — from intelligent property matching to predictive market analytics and 24/7 AI concierge support.");
  const ctaTitle = get("aipage.ctaTitle", "Experience the Future of Real Estate");
  const ctaText = get("aipage.ctaText", "Try RJ AI today. Ask a question, search for a property, or schedule a viewing — all powered by artificial intelligence.");

  return (
    <div className="min-h-screen bg-white">
      {/* HERO — Navy + Gold theme */}
      <section className="relative min-h-[80vh] bg-[#0A1F44] overflow-hidden flex items-center">
        {/* Gold glow accents */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#C9A961] rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C9A961] rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A961]/20 backdrop-blur-md rounded-full border border-[#C9A961]/30 mb-6">
              <Sparkles size={14} className="text-[#C9A961]" />
              <span className="text-[#C9A961] text-sm uppercase tracking-wider font-semibold">AI POWERED REAL ESTATE</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">{heroTitle}</h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">{heroSubtitle}</p>
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              {['For Sale', 'For Rent', 'New Projects'].map((tab, i) => (
                <button key={tab} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${i === 0 ? 'bg-[#C9A961] text-[#0A1F44]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{tab}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#C9A961] hover:bg-[#A68A3F] text-[#0A1F44] font-semibold rounded-lg hover:scale-105 transition">Try RJ AI Now</button>
              <button onClick={() => document.getElementById('animation-flow')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition">See How It Works</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="relative w-72 h-72 mx-auto">
              {/* Gold ring */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9A961]/30" />
              {/* Navy ring */}
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute inset-8 rounded-full border border-[#C9A961]/20" />
              {/* Gold orb with robot */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#C9A961] via-[#A68A3F] to-[#0A1F44] flex items-center justify-center shadow-2xl">
                <WireframeRobotLarge size={80} />
              </div>
              {/* Gold pulse */}
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#C9A961] rounded-full shadow-lg shadow-[#C9A961]/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5-STEP ANIMATION FLOW — Navy background */}
      <section id="animation-flow" className="py-20 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[#C9A961] text-sm uppercase tracking-[0.3em] font-semibold mb-3">AI Assistant Animation Flow</div>
            <h2 className="text-4xl font-serif text-[#0A1F44]">How RJ AI Comes to Life</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: 1, title: 'Orb Idle', desc: 'Floating holographic orb with soft glow and orbiting particles', icon: Sparkles, color: '#C9A961' },
              { step: 2, title: 'Hover State', desc: 'Glow intensifies and tooltip appears: "Hi, I\'m RJ AI"', icon: MousePointerClick, color: '#A68A3F' },
              { step: 3, title: 'Click Transition', desc: 'Orb transforms into AI Robot with smooth morph animation', icon: Zap, color: '#C9A961' },
              { step: 4, title: 'Robot Idle', desc: 'AI robot greets the user with a friendly wave', icon: Bot, color: '#A68A3F' },
              { step: 5, title: 'Chat Panel Opens', desc: 'Smooth panel slides in with premium animations', icon: MessageSquare, color: '#C9A961' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center"
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${s.color}20`, border: `2px solid ${s.color}40` }}>
                  <s.icon size={24} style={{ color: s.color }} />
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: s.color }}>Step {s.step}</div>
                <h3 className="font-serif text-lg text-[#0A1F44] mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#0A1F44] mb-3">Design Features</h2>
            <p className="text-slate-600">Premium design elements that make RJ AI special</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Premium 3D AI Robot',
              'Holographic Orb',
              'Smooth Animations',
              'Luxury Color Palette (Gold & Navy)',
              'Glassmorphism UI',
              'Real-time AI Chat',
              'Quick Action Buttons',
              'Mobile Responsive',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl bg-gradient-to-br from-[#F9FAFB] to-white border border-slate-200 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-[#C9A961]" />
                </div>
                <span className="text-sm font-medium text-[#0A1F44]">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COLOR PALETTE — Website theme */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-[#0A1F44] mb-8">Color Palette</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { color: '#0A1F44', name: 'Primary Navy' },
              { color: '#1a3a5c', name: 'Medium Navy' },
              { color: '#C9A961', name: 'Primary Gold' },
              { color: '#A68A3F', name: 'Secondary Gold' },
              { color: '#6c757d', name: 'Gray' },
              { color: '#000000', name: 'Black' },
              { color: '#ffffff', name: 'White' },
            ].map((c) => (
              <div key={c.color} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-md" style={{ background: c.color }} />
                <span className="text-xs text-slate-600 font-medium">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#0A1F44] mb-3">AI Capabilities</h2>
            <p className="text-slate-600">Everything RJ AI can do for you</p>
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
                className="p-6 rounded-xl bg-gradient-to-br from-[#F9FAFB] to-white border border-slate-200 hover:shadow-lg hover:border-[#C9A961]/30 transition"
              >
                <h3 className="font-serif text-lg text-[#0A1F44] mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Gold background */}
      <section className="py-20 bg-[#C9A961]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-4 text-[#0A1F44]">{ctaTitle}</h2>
          <p className="text-[#0A1F44]/80 text-lg mb-8 max-w-2xl mx-auto">{ctaText}</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[#0A1F44] text-white font-semibold rounded-lg hover:scale-105 transition shadow-xl">
            Start Chatting with RJ AI →
          </button>
        </div>
      </section>
    </div>
  );
}

// === Premium Robot for AI Powered page — matching AIChatWidget design ===
// White dome head, black visor, blue circle eyes, gold accents, blue chest LED
function PremiumRobotLarge() {
  return (
    <svg width="80" height="80" viewBox="0 0 50 50" fill="none">
      {/* Antenna with gold tip */}
      <line x1="25" y1="5" x2="25" y2="2" stroke="#D4AF37" strokeWidth="0.8" />
      <circle cx="25" cy="1.5" r="1" fill="#D4AF37">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* White rounded dome head */}
      <ellipse cx="25" cy="14" rx="11" ry="10" fill="#ffffff" stroke="#e0e0e0" strokeWidth="0.6" />

      {/* Black curved visor (glossy) */}
      <path d="M15 12 Q25 8 35 12 L35 16 Q25 19 15 16 Z" fill="#0A0F1E" />

      {/* Blue glowing circle eyes */}
      <circle cx="20" cy="13" r="1.8" fill="#4a90e2">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="13" r="1.8" fill="#4a90e2">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Gold ear accents */}
      <circle cx="14" cy="14" r="1.5" fill="#D4AF37" />
      <circle cx="36" cy="14" r="1.5" fill="#D4AF37" />

      {/* Neck */}
      <rect x="23" y="23" width="4" height="3" fill="#e0e0e0" />

      {/* White body */}
      <ellipse cx="25" cy="36" rx="11" ry="8" fill="#ffffff" stroke="#e0e0e0" strokeWidth="0.6" />

      {/* Gold chest panel with blue LED */}
      <circle cx="25" cy="34" r="4" fill="#D4AF37" stroke="#B8941E" strokeWidth="0.5" />
      <circle cx="25" cy="34" r="2" fill="#4a90e2">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Gold joint accents */}
      <circle cx="14" cy="32" r="1.2" fill="#D4AF37" />
      <circle cx="36" cy="32" r="1.2" fill="#D4AF37" />

      {/* Arms */}
      <line x1="36" y1="32" x2="40" y2="38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="32" x2="10" y2="38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Legs */}
      <line x1="20" y1="43" x2="19" y2="48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="43" x2="31" y2="48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      {/* Gold knee accents */}
      <circle cx="19.5" cy="45.5" r="0.8" fill="#D4AF37" />
      <circle cx="30.5" cy="45.5" r="0.8" fill="#D4AF37" />
      {/* Feet */}
      <ellipse cx="19" cy="49" rx="2" ry="1" fill="#ffffff" stroke="#e0e0e0" strokeWidth="0.4" />
      <ellipse cx="31" cy="49" rx="2" ry="1" fill="#ffffff" stroke="#e0e0e0" strokeWidth="0.4" />
    </svg>
  );
}
