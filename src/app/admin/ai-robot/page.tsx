'use client';
import { useState, useEffect } from 'react';
import { Save, Bot, Volume2, Eye, Clock, MessageSquare, Sparkles } from 'lucide-react';

export default function AIRobotControlPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch('/api/admin/ai-robot').then(r => r.json()).then(d => setSettings(d.settings)); }, []);

  const update = (key: string, value: any) => { setSettings({ ...settings, [key]: value }); setSaved(false); };

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/ai-robot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center"><Bot className="text-white" size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Robot Control</h1>
          <p className="text-slate-500 text-sm">Configure the RJ AI Concierge widget on your website</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-slate-900 flex items-center gap-2"><Sparkles size={16} className="text-amber-500" /> AI Concierge Enabled</label>
              <p className="text-sm text-slate-500 mt-1">Show or hide the AI widget on your website</p>
            </div>
            <button onClick={() => update('enabled', !settings.enabled)} className={`relative w-12 h-6 rounded-full transition ${settings.enabled ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${settings.enabled ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="font-medium text-slate-900 flex items-center gap-2"><Clock size={16} className="text-amber-500" /> Auto Introduction</label>
              <p className="text-sm text-slate-500 mt-1">Robot automatically introduces itself to visitors</p>
            </div>
            <button onClick={() => update('autoIntro', !settings.autoIntro)} className={`relative w-12 h-6 rounded-full transition ${settings.autoIntro ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${settings.autoIntro ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          {settings.autoIntro && (
            <div className="mt-3">
              <label className="block text-sm text-slate-600 mb-1">Delay before intro (seconds)</label>
              <input type="number" min={1} max={60} value={settings.introDelay} onChange={e => update('introDelay', parseInt(e.target.value) || 6)} className="w-24 border rounded-lg px-3 py-2" />
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-slate-900 flex items-center gap-2"><Volume2 size={16} className="text-amber-500" /> Pop Sound Effect</label>
              <p className="text-sm text-slate-500 mt-1">Play a sound when robot activates to attract attention</p>
            </div>
            <button onClick={() => update('soundEnabled', !settings.soundEnabled)} className={`relative w-12 h-6 rounded-full transition ${settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${settings.soundEnabled ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <label className="font-medium text-slate-900 flex items-center gap-2 mb-3"><Eye size={16} className="text-amber-500" /> Orb Size</label>
          <p className="text-sm text-slate-500 mb-3">Size of the holographic orb in pixels</p>
          <input type="range" min={40} max={120} value={settings.orbSize} onChange={e => update('orbSize', parseInt(e.target.value))} className="w-full" />
          <div className="text-center text-2xl font-bold text-amber-600 mt-2">{settings.orbSize}px</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-slate-900 flex items-center gap-2"><Sparkles size={16} className="text-amber-500" /> Orb Glow Effect</label>
              <p className="text-sm text-slate-500 mt-1">Glowing aura around the orb</p>
            </div>
            <button onClick={() => update('orbGlow', !settings.orbGlow)} className={`relative w-12 h-6 rounded-full transition ${settings.orbGlow ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${settings.orbGlow ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <label className="font-medium text-slate-900 flex items-center gap-2 mb-3"><Eye size={16} className="text-amber-500" /> Chat Panel Transparency</label>
          <p className="text-sm text-slate-500 mb-3">Higher = more transparent (sci-fi glass effect)</p>
          <input type="range" min={30} max={90} value={settings.chatTransparency} onChange={e => update('chatTransparency', parseInt(e.target.value))} className="w-full" />
          <div className="text-center text-2xl font-bold text-amber-600 mt-2">{settings.chatTransparency}%</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <label className="font-medium text-slate-900 flex items-center gap-2 mb-2"><MessageSquare size={16} className="text-amber-500" /> Welcome Message</label>
          <p className="text-sm text-slate-500 mb-3">First message visitors see when chat opens</p>
          <textarea value={settings.welcomeMessage} onChange={e => update('welcomeMessage', e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <label className="font-medium text-slate-900 flex items-center gap-2 mb-2"><Sparkles size={16} className="text-amber-500" /> Quick Action Buttons</label>
          <p className="text-sm text-slate-500 mb-3">One action per line — shown as clickable suggestions</p>
          <textarea value={settings.quickActions} onChange={e => update('quickActions', e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 font-mono text-sm" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-emerald-600 text-sm font-medium">✓ Saved successfully</span>}
        </div>
      </div>
    </div>
  );
}
