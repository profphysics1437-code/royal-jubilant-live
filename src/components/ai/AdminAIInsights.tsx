'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BarChart3, X } from 'lucide-react';

export default function AdminAIInsights() {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
    { id: 'init', role: 'assistant', content: "Welcome, Admin. I'm your AI business intelligence assistant. I can provide market analytics, lead pipeline reports, agent performance, and strategic insights. What would you like to analyze?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => `admin-${Date.now()}`);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, sessionId, portal: 'admin' }) });
      const data = await res.json();
      setMessages(m => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: data.message || 'Error.' }]);
    } catch { setMessages(m => [...m, { id: 'err', role: 'assistant', content: 'Connection error.' }]); }
    finally { setLoading(false); }
  };

  const suggestions = ['Give me market stats overview', 'Show total listings and average price', 'What are the latest market trends?', 'Search blog posts about Dubai Marina'];

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2">
        <BarChart3 size={18} /> AI Insights
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[560px] bg-slate-900/80 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-slate-900/50 border-b border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-purple-600" />
              <div><div className="text-indigo-100 font-semibold text-sm">AI Insights</div><div className="text-slate-400 text-xs">Business Intelligence</div></div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`max-w-[85%] p-2.5 rounded-lg text-sm ${m.role === 'user' ? 'ml-auto bg-indigo-600 text-white rounded-br-sm' : 'bg-white/10 text-indigo-50 rounded-bl-sm border border-indigo-500/20'}`}>{m.content}</div>
            ))}
            {loading && <div className="flex gap-1 p-2"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" /><span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }} /><span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.3s' }} /></div>}
          </div>
          {messages.length <= 1 && (
            <div className="px-3 pb-2 space-y-1">
              {suggestions.map(s => <button key={s} onClick={() => setInput(s)} className="w-full text-left text-xs px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-100 hover:bg-indigo-500/20 transition"><Sparkles size={10} className="inline mr-2" />{s}</button>)}
            </div>
          )}
          <div className="p-3 border-t border-indigo-500/20 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask for analytics..." className="flex-1 bg-white/5 border border-indigo-500/25 rounded-lg px-3 py-2 text-indigo-50 text-sm outline-none focus:border-indigo-500/60" disabled={loading} />
            <button onClick={send} disabled={loading || !input.trim()} className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center disabled:opacity-40"><Send size={15} /></button>
          </div>
        </div>
      )}
    </>
  );
}
