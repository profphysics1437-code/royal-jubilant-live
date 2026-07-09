'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';

export default function AgentAIAssistant({ agentId }: { agentId?: string }) {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
    { id: 'init', role: 'assistant', content: "Hello! I'm your AI assistant. I can help you manage listings, search leads, get analytics, and draft content. What would you like to do?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => `agent-${Date.now()}`);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, sessionId, portal: 'agent' }) });
      const data = await res.json();
      setMessages(m => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: data.message || 'Error processing request.' }]);
    } catch { setMessages(m => [...m, { id: `a-err`, role: 'assistant', content: 'Connection error. Please try again.' }]); }
    finally { setLoading(false); }
  };

  const suggestions = ['Show my recent leads', 'Draft a listing description for a 2BR Marina apartment', 'What are my performance stats?', 'Search leads by status: new'];

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2">
        <Sparkles size={18} /> AI Assistant
      </button>
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[520px] bg-slate-900/80 backdrop-blur-xl border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-500/20 to-slate-900/50 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-600" />
              <div>
                <div className="text-amber-100 font-semibold text-sm">AI Assistant</div>
                <div className="text-slate-400 text-xs">Agent Productivity Mode</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={`max-w-[85%] p-2.5 rounded-lg text-sm ${m.role === 'user' ? 'ml-auto bg-amber-600 text-white rounded-br-sm' : 'bg-white/10 text-amber-50 rounded-bl-sm border border-amber-500/20'}`}>{m.content}</div>
            ))}
            {loading && <div className="flex gap-1 p-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" /><span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.15s' }} /><span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.3s' }} /></div>}
          </div>
          {messages.length <= 1 && (
            <div className="px-3 pb-2 space-y-1">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); }} className="w-full text-left text-xs px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-100 hover:bg-amber-500/20 transition">
                  <Sparkles size={10} className="inline mr-2" />{s}
                </button>
              ))}
            </div>
          )}
          <div className="p-3 border-t border-amber-500/20 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask anything..." className="flex-1 bg-white/5 border border-amber-500/25 rounded-lg px-3 py-2 text-amber-50 text-sm outline-none focus:border-amber-500/60" disabled={loading} />
            <button onClick={send} disabled={loading || !input.trim()} className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center disabled:opacity-40"><Send size={15} /></button>
          </div>
        </div>
      )}
    </>
  );
}
