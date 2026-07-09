'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';

type Phase = 'dormant' | 'charging' | 'opening' | 'emerging' | 'landing' | 'waving' | 'chat';
interface Message { id: string; role: 'user' | 'assistant'; content: string; ts: number; }

export default function AIChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('dormant');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `sess-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const popSoundRef = useRef<AudioContext | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const introduced = typeof window !== 'undefined' && sessionStorage.getItem('rj-ai-introduced');
    if (introduced) return;
    const timer = setTimeout(() => triggerIntro(), 6000);
    return () => clearTimeout(timer);
  }, [mounted]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const playPop = useCallback(() => {
    try {
      if (!popSoundRef.current) {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        popSoundRef.current = new Ctx();
      }
      const ctx = popSoundRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }, []);

  const triggerIntro = useCallback(async () => {
    if (phase !== 'dormant') return;
    setPhase('charging'); playPop();
    setTimeout(() => setPhase('opening'), 700);
    setTimeout(() => setPhase('emerging'), 1400);
    setTimeout(() => setPhase('landing'), 2100);
    setTimeout(() => setPhase('waving'), 2800);
    setTimeout(() => {
      setPhase('chat');
      setMessages([{ id: 'intro', role: 'assistant', content: "Hello! I'm RJ AI, your personal real estate concierge. ✨\n\nI can help you find properties in Dubai, estimate valuations, schedule viewings, or answer any questions about the Dubai real estate market.\n\nHow may I assist you today?", ts: Date.now() }]);
      try { sessionStorage.setItem('rj-ai-introduced', '1'); } catch {}
    }, 3800);
  }, [phase, playPop]);

  const openChat = useCallback(() => {
    if (phase === 'chat') return;
    if (messages.length === 0) setMessages([{ id: 'intro', role: 'assistant', content: "Hello! I'm RJ AI, your real estate concierge. How can I help you today?", ts: Date.now() }]);
    setPhase('chat');
  }, [phase, messages.length]);

  const closeChat = useCallback(() => { setPhase('dormant'); setInput(''); }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text, ts: Date.now() };
    setMessages(m => [...m, userMsg]); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, sessionId, portal: 'customer' }) });
      const data = await res.json();
      setMessages(m => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: data.message || data.error || "I apologize, please try again.", ts: Date.now() }]);
    } catch (e) {
      setMessages(m => [...m, { id: `a-err`, role: 'assistant', content: "I'm having trouble connecting right now.", ts: Date.now() }]);
    } finally { setLoading(false); }
  }, [input, loading, sessionId]);

  const quickActions = ['Show me 2BR apartments in Dubai Marina for rent', 'Estimate my property value', 'I want to be contacted by an agent'];
  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <AnimatePresence>
        {phase === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.85, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{ position: 'absolute', bottom: 90, right: 0, width: 380, maxWidth: 'calc(100vw - 32px)', height: 540, maxHeight: 'calc(100vh - 140px)', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(191, 160, 106, 0.4)', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(191,160,106,0.15), inset 0 1px 0 rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 2px, rgba(191,160,106,0.025) 3px, transparent 4px)', zIndex: 1 }} />
            {[{ top: 8, left: 8, borderTop: '1px solid #BFA06A', borderLeft: '1px solid #BFA06A' }, { top: 8, right: 8, borderTop: '1px solid #BFA06A', borderRight: '1px solid #BFA06A' }, { bottom: 8, left: 8, borderBottom: '1px solid #BFA06A', borderLeft: '1px solid #BFA06A' }, { bottom: 8, right: 8, borderBottom: '1px solid #BFA06A', borderRight: '1px solid #BFA06A' }].map((s, i) => <div key={i} style={{ position: 'absolute', width: 18, height: 18, ...s, zIndex: 2 }} />)}
            <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, rgba(191,160,106,0.18), rgba(15,23,42,0.5))', borderBottom: '1px solid rgba(191,160,106,0.25)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 3, position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #F5E6CC, #BFA06A)', boxShadow: '0 0 12px rgba(191,160,106,0.6)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#F5E6CC', fontWeight: 700, fontSize: 14, letterSpacing: '0.5px' }}>RJ AI Concierge</div>
                <div style={{ color: '#94a3b8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />Online · Royal Jubilant
                </div>
              </div>
              <button onClick={closeChat} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 2, position: 'relative' }}>
              {messages.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? 'linear-gradient(135deg, #BFA06A, #8B6F3F)' : 'rgba(255,255,255,0.08)', color: m.role === 'user' ? '#1F1A14' : '#E8E0D0', fontSize: 13.5, lineHeight: 1.5, border: m.role === 'user' ? 'none' : '1px solid rgba(191,160,106,0.2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.content}</motion.div>
              ))}
              {loading && <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '10px 14px' }}>{[0,1,2].map(i => <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#BFA06A' }} />)}</div>}
              {messages.length <= 1 && !loading && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {quickActions.map(qa => (
                    <button key={qa} onClick={() => { setInput(qa); setTimeout(() => sendMessage(), 50); }} style={{ padding: '8px 12px', fontSize: 12, background: 'rgba(191,160,106,0.1)', border: '1px solid rgba(191,160,106,0.3)', borderRadius: 10, color: '#E8E0D0', cursor: 'pointer', textAlign: 'left' }}>
                      <Sparkles size={11} style={{ display: 'inline', marginRight: 6, color: '#BFA06A' }} />{qa}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(191,160,106,0.2)', display: 'flex', gap: 8, background: 'rgba(15,23,42,0.5)', zIndex: 3, position: 'relative' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask about properties..." disabled={loading} style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(191,160,106,0.25)', borderRadius: 10, color: '#E8E0D0', fontSize: 13, outline: 'none' }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() ? 'linear-gradient(135deg, #BFA06A, #8B6F3F)' : 'rgba(100,100,100,0.3)', border: 'none', color: '#1F1A14', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== 'chat' && (
        <motion.button
          onClick={openChat}
          initial={{ scale: 0 }}
          animate={{ scale: phase === 'dormant' ? 1 : phase === 'charging' ? [1, 1.15, 0.95] : 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open RJ AI Concierge"
          style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 30% 25%, rgba(245,230,204,0.95), rgba(191,160,106,0.8) 50%, rgba(31,26,20,0.9))', border: '1.5px solid rgba(191,160,106,0.6)', boxShadow: '0 0 30px rgba(191,160,106,0.45), inset 0 2px 8px rgba(255,255,255,0.25), inset 0 -2px 8px rgba(0,0,0,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          <div style={{ position: 'absolute', top: 4, left: 12, width: 28, height: 14, background: 'radial-gradient(ellipse, rgba(255,255,255,0.7), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <MiniRobot animate={phase === 'waving' || phase === 'landing'} />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '1px solid transparent', borderTopColor: '#BFA06A', borderRightColor: 'rgba(191,160,106,0.4)', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -3, left: '50%', width: 6, height: 6, borderRadius: '50%', background: '#F5E6CC', boxShadow: '0 0 8px #BFA06A', transform: 'translateX(-50%)' }} />
          </motion.div>
          {phase === 'dormant' && (
            <motion.div animate={{ scale: [1, 1.4], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #BFA06A', pointerEvents: 'none' }} />
          )}
          {(phase === 'charging' || phase === 'opening' || phase === 'emerging') && (
            <>
              {[0,1,2,3,4,5].map(i => {
                const angle = (i * 60 * Math.PI) / 180;
                return <motion.div key={i} initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: Math.cos(angle) * 35, y: Math.sin(angle) * 35, opacity: [0,1,0] }} transition={{ duration: 0.8, delay: i * 0.06, repeat: Infinity }} style={{ position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: '#F5E6CC', boxShadow: '0 0 6px #BFA06A' }} />;
              })}
            </>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {phase === 'waving' && (
          <motion.div initial={{ opacity: 0, x: 20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.8 }} style={{ position: 'absolute', bottom: 80, right: 0, width: 200, padding: '12px 16px', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(191, 160, 106, 0.4)', borderRadius: 14, color: '#F5E6CC', fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(191,160,106,0.2)' }}>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>👋 Hi, I'm RJ AI</div>
            <div style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.4 }}>Your personal real estate concierge. Tap me to chat!</div>
            <div style={{ position: 'absolute', bottom: -6, right: 22, width: 12, height: 12, background: 'rgba(15, 23, 42, 0.75)', borderRight: '1px solid rgba(191, 160, 106, 0.4)', borderBottom: '1px solid rgba(191, 160, 106, 0.4)', transform: 'rotate(45deg)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniRobot({ animate }: { animate: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ position: 'relative', zIndex: 2 }}>
      <ellipse cx="16" cy="13" rx="8" ry="7.5" fill="#E8E0D0" stroke="#BFA06A" strokeWidth="0.8" />
      <rect x="10" y="9" width="12" height="6" rx="2" fill="#0F172A" opacity="0.85" />
      <motion.g animate={animate ? { cy: [13, 12, 13] } : {}} transition={{ duration: 0.8, repeat: Infinity }}>
        <circle cx="13" cy="12" r="1.2" fill="#BFA06A">{animate && <animate attributeName="r" values="1.2;0.5;1.2" dur="0.8s" repeatCount="indefinite" />}</circle>
        <circle cx="19" cy="12" r="1.2" fill="#BFA06A">{animate && <animate attributeName="r" values="1.2;0.5;1.2" dur="0.8s" repeatCount="indefinite" />}</circle>
      </motion.g>
      <path d="M13 15 Q16 16.5 19 15" stroke="#BFA06A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <line x1="16" y1="5.5" x2="16" y2="3" stroke="#BFA06A" strokeWidth="0.8" />
      <circle cx="16" cy="2.5" r="1" fill="#F5E6CC"><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" /></circle>
      <ellipse cx="16" cy="22" rx="6" ry="4" fill="#E8E0D0" stroke="#BFA06A" strokeWidth="0.6" opacity="0.85" />
      <path d="M14 19 L16 20 L18 19 L18 21 L16 20 L14 21 Z" fill="#BFA06A" />
      {animate && (
        <motion.g animate={{ rotate: [0, 25, -10, 25, 0] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: '22px 20px' }}>
          <line x1="22" y1="20" x2="26" y2="14" stroke="#BFA06A" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="26.5" cy="13.5" r="1.4" fill="#E8E0D0" stroke="#BFA06A" strokeWidth="0.6" />
        </motion.g>
      )}
    </svg>
  );
}
