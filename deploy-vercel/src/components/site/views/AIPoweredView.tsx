'use client';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, TrendingUp, Bot, MessageSquare, Calendar, BarChart3, Search, Shield } from 'lucide-react';

export function AIPoweredView() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-amber-300 text-sm uppercase tracking-wider">Powered by RJ AI</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">AI-Powered<br />Real Estate</h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">Royal Jubilant integrates cutting-edge artificial intelligence into every step of your property journey — from intelligent property matching to predictive market analytics and 24/7 AI concierge support.</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold rounded-lg hover:scale-105 transition">Try RJ AI Now</button>
              <button onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition">Explore Features</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="relative w-72 h-72 mx-auto">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/30" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute inset-8 rounded-full border border-indigo-400/30" />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-slate-900 flex items-center justify-center shadow-2xl"><Bot size={80} className="text-white" /></div>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-slate-900 mb-3">Why AI for Real Estate?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Dubai's real estate market moves fast. AI helps you stay ahead with data-driven insights and instant responses.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'Predictive Analytics', desc: 'AI analyzes millions of data points to predict property values, market trends, and investment opportunities with 90%+ accuracy.' },
              { icon: Zap, title: 'Instant Responses', desc: 'No more waiting for business hours. RJ AI answers questions, schedules viewings, and captures leads 24/7 in seconds.' },
              { icon: Brain, title: 'Smart Matching', desc: 'AI learns your preferences and matches you with properties you\'ll love — saving hours of manual searching.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4"><f.icon className="text-white" size={24} /></div>
                <h3 className="text-xl font-serif text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-6"><MessageSquare size={14} className="text-amber-300" /><span className="text-amber-300 text-sm uppercase tracking-wider">Meet Your Concierge</span></div>
            <h2 className="text-4xl font-serif mb-4">RJ AI Concierge</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">Your personal AI assistant available 24/7. Ask anything about Dubai real estate — property searches, valuations, market insights, scheduling viewings — RJ AI handles it all.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[{ num: '24/7', label: 'Always Available' }, { num: '<2s', label: 'Response Time' }, { num: '6+', label: 'AI Capabilities' }, { num: '∞', label: 'Questions Answered' }].map((s, i) => (
                <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-amber-400">{s.num}</div>
                  <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="capabilities" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-slate-900 mb-3">AI Capabilities</h2>
            <p className="text-slate-600">Everything RJ AI can do for you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'Smart Property Search', desc: 'Natural language search: "2BR apartment in Marina under 2M AED" — RJ AI finds matches instantly.' },
              { icon: BarChart3, title: 'Property Valuation', desc: 'AI-powered valuations based on comparable sales, market trends, and property specifics.' },
              { icon: Calendar, title: 'Schedule Viewings', desc: 'Book property viewings with agents directly through the AI concierge — no back-and-forth.' },
              { icon: TrendingUp, title: 'Market Insights', desc: 'Real-time Dubai market analytics: price trends, hot communities, ROI projections.' },
              { icon: Shield, title: 'Investment Analysis', desc: 'AI evaluates investment potential: rental yield, capital appreciation, risk assessment.' },
              { icon: MessageSquare, title: 'Lead Capture', desc: 'AI qualifies leads, captures contact info, and routes to the right agent instantly.' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-lg hover:border-amber-200 transition">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3"><c.icon className="text-amber-600" size={20} /></div>
                <h3 className="font-serif text-lg text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-4">Experience the Future of Real Estate</h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">Try RJ AI today. Ask a question, search for a property, or schedule a viewing — all powered by artificial intelligence.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-white text-amber-700 font-semibold rounded-lg hover:scale-105 transition shadow-xl">Start Chatting with RJ AI →</button>
        </div>
      </section>
    </div>
  );
}
