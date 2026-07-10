'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Volume2 } from 'lucide-react';

type Phase = 'dormant' | 'charging' | 'opening' | 'emerging' | 'landing' | 'waving' | 'chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: number;
}

const WELCOME_MESSAGE = "Welcome to Royal Jubilant Real Estate LLC.\nI'm RJ AI.\nI can help you find the perfect property, compare investments, schedule viewings, and guide you throughout your real estate journey.\nHow can I assist you today?";

export default function AIChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('dormant');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
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
    if (muted) return;
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
  }, [muted]);

  const triggerIntro = useCallback(async () => {
    if (phase !== 'dormant') return;
    setPhase('charging'); playPop();
    setTimeout(() => setPhase('opening'), 700);
    setTimeout(() => setPhase('emerging'), 1400);
    setTimeout(() => setPhase('landing'), 2100);
    setTimeout(() => setPhase('waving'), 2800);
    setTimeout(() => {
      setPhase('chat');
      setMessages([{ id: 'intro', role: 'assistant', content: WELCOME_MESSAGE, ts: Date.now() }]);
      try { sessionStorage.setItem('rj-ai-introduced', '1'); } catch {}
    }, 3800);
  }, [phase, playPop]);

  const openChat = useCallback(() => {
    if (phase === 'chat') return;
    if (messages.length === 0) setMessages([{ id: 'intro', role: 'assistant', content: WELCOME_MESSAGE, ts: Date.now() }]);
    setPhase('chat');
  }, [phase, messages.length]);

  const closeChat = useCallback(() => { setPhase('dormant'); setInput(''); }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: msg, ts: Date.now() };
    setMessages(m => [...m, userMsg]); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, sessionId, portal: 'customer' }) });
      const data = await res.json();
      setMessages(m => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: data.message || data.error || "I apologize, please try again.", ts: Date.now() }]);
    } catch (e) {
      setMessages(m => [...m, { id: `a-err`, role: 'assistant', content: "I'm having trouble connecting right now.", ts: Date.now() }]);
    } finally { setLoading(false); }
  }, [input, loading, sessionId]);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* === CHAT PANEL === */}
      <AnimatePresence>
        {phase === 'chat' && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              position: 'absolute', bottom: 70, left: 0,
              width: 380, maxWidth: 'calc(100vw - 40px)',
              height: 580, maxHeight: 'calc(100vh - 120px)',
              background: 'rgba(30, 58, 138, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(30,58,138,0.3)',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(30,58,138,0.6))',
              borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {/* Small orb avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(30,58,138,0.95))',
                border: '1.5px solid rgba(212, 175, 55, 0.5)',
                boxShadow: '0 0 10px rgba(30,58,138,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <SmallRobot />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '0.5px' }}>RJ AI Assistant</div>
                <div style={{ color: '#D4AF37', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#28a745', boxShadow: '0 0 6px #28a745' }} />
                  Online · Your AI Real Estate Concierge
                </div>
              </div>
              <button onClick={() => setMuted(!muted)} style={{ background: 'transparent', border: 'none', color: muted ? '#6c757d' : '#D4AF37', cursor: 'pointer', padding: 6, borderRadius: 6 }} title={muted ? 'Unmute' : 'Mute'}>
                <Volume2 size={16} />
              </button>
              <button onClick={closeChat} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 6, borderRadius: 6 }} title="Close">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg, #D4AF37, #B8941E)' : 'rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 13.5, lineHeight: 1.5,
                  border: m.role === 'user' ? 'none' : '1px solid rgba(212,175,55,0.2)',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {m.content}
                  {m.id === 'intro' && <div style={{ fontSize: 10, color: 'rgba(212,175,55,0.7)', marginTop: 4, textAlign: 'right' }}>Just now</div>}
                </motion.div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '10px 14px' }}>
                  {[0,1,2].map(i => (
                    <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37' }} />
                  ))}
                </div>
              )}
              {messages.length <= 1 && !loading && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: 'rgba(212,175,55,0.6)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Quick Actions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {['Find Luxury Villas', 'Show Apartments', 'Investment Opportunities', 'Market Insights', 'Schedule a Viewing', 'Contact an Agent', 'Best Communities', 'Off-plan Projects'].map(qa => (
                      <button key={qa} onClick={() => sendMessage(qa)} style={{
                        padding: '9px 10px', fontSize: 11, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 8, color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.18)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.5)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.25)'; }}>
                        <Sparkles size={10} style={{ display: 'inline', marginRight: 4, color: '#D4AF37' }} />{qa}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', gap: 8, background: 'rgba(30,58,138,0.5)' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Type your message..." disabled={loading} style={{
                flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none',
              }} />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
                width: 40, height: 40, borderRadius: 8, background: input.trim() ? 'linear-gradient(135deg, #D4AF37, #B8941E)' : 'rgba(100,100,100,0.3)',
                border: 'none', color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: input.trim() ? '0 0 10px rgba(212,175,55,0.4)' : 'none',
              }}><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HOLOGRAPHIC ORB — Bottom-LEFT, navy blue, gold ring, white particles === */}
      {phase !== 'chat' && (
        <motion.button
          onClick={openChat}
          initial={{ scale: 0 }}
          animate={{
            scale: phase === 'dormant' ? 1 : phase === 'charging' ? [1, 1.15, 0.95] : 1,
            y: phase === 'dormant' ? [0, -5, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.6 },
            y: { duration: 3, repeat: phase === 'dormant' ? Infinity : 0, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open RJ AI Assistant"
          style={{
            position: 'relative',
            width: 50, height: 50,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), rgba(30,58,138,0.85) 50%, rgba(15,25,60,0.95))',
            border: '2px solid rgba(212, 175, 55, 0.7)',
            boxShadow: '0 0 20px rgba(30,58,138,0.6), 0 0 40px rgba(30,58,138,0.3), inset 0 2px 6px rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}
        >
          {/* Inner glow */}
          <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)', pointerEvents: 'none' }} />

          {/* Robot inside orb */}
          <SmallRobot size={28} />

          {/* Gold ring around orb (semi-transparent, glow) */}
          <div style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            boxShadow: '0 0 8px rgba(212,175,55,0.3)',
            pointerEvents: 'none',
          }} />

          {/* White glowing particles around orb (3-4 dots) */}
          {[
            { top: -4, left: 8 },
            { top: 12, right: -4 },
            { bottom: -2, left: 20 },
            { top: 4, left: -3 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              style={{
                position: 'absolute', width: 3, height: 3, borderRadius: '50%',
                background: '#fff', boxShadow: '0 0 4px #fff',
                ...pos,
              }}
            />
          ))}

          {/* Pulse ring when dormant */}
          {phase === 'dormant' && (
            <motion.div animate={{ scale: [1, 1.4], opacity: [0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(30,58,138,0.6)', pointerEvents: 'none' }} />
          )}

          {/* Charging particles */}
          {(phase === 'charging' || phase === 'opening' || phase === 'emerging') && (
            <>
              {[0, 1, 2, 3, 4].map(i => {
                const angle = (i * 72 * Math.PI) / 180;
                return (
                  <motion.div key={i} initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: Math.cos(angle) * 30, y: Math.sin(angle) * 30, opacity: [0, 1, 0] }} transition={{ duration: 0.8, delay: i * 0.08, repeat: Infinity }} style={{ position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 6px #D4AF37' }} />
                );
              })}
            </>
          )}
        </motion.button>
      )}

      {/* === INTRO SPEECH BUBBLE === */}
      <AnimatePresence>
        {phase === 'waving' && (
          <motion.div initial={{ opacity: 0, x: -20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -20, scale: 0.8 }} style={{
            position: 'absolute', bottom: 80, left: 60, width: 200, padding: '12px 16px',
            background: 'rgba(30, 58, 138, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: 12, color: '#fff', fontSize: 13,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(30,58,138,0.3)',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13, color: '#D4AF37' }}>👋 Hi, I'm RJ AI</div>
            <div style={{ color: '#ced4da', fontSize: 12, lineHeight: 1.4 }}>Your AI Real Estate Concierge. Tap me to chat!</div>
            <div style={{ position: 'absolute', bottom: -6, left: 24, width: 12, height: 12, background: 'rgba(30, 58, 138, 0.85)', borderLeft: '1px solid rgba(212, 175, 55, 0.4)', borderBottom: '1px solid rgba(212, 175, 55, 0.4)', transform: 'rotate(45deg)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Small robot icon (cartoonish, white eyes) — used in orb and header
function SmallRobot({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ position: 'relative', zIndex: 2 }}>
      {/* Antenna */}
      <line x1="16" y1="4" x2="16" y2="2" stroke="#D4AF37" strokeWidth="0.8" />
      <circle cx="16" cy="1.5" r="0.8" fill="#D4AF37" />
      {/* Head */}
      <rect x="8" y="5" width="16" height="12" rx="4" fill="#fff" stroke="#D4AF37" strokeWidth="0.6" />
      {/* Eyes (white dots) */}
      <circle cx="12" cy="10" r="1.5" fill="#fff" stroke="#1E3A8A" strokeWidth="0.5" />
      <circle cx="20" cy="10" r="1.5" fill="#fff" stroke="#1E3A8A" strokeWidth="0.5" />
      <circle cx="12" cy="10" r="0.6" fill="#1E3A8A" />
      <circle cx="20" cy="10" r="0.6" fill="#1E3A8A" />
      {/* Smile */}
      <path d="M12 13 Q16 15 20 13" stroke="#1E3A8A" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      {/* Body */}
      <rect x="10" y="17" width="12" height="9" rx="3" fill="#fff" stroke="#D4AF37" strokeWidth="0.6" />
      {/* Gold RJ emblem on chest */}
      <circle cx="16" cy="21" r="2" fill="#D4AF37" />
      <text x="16" y="22.5" textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="#1E3A8A">RJ</text>
    </svg>
  );
}
