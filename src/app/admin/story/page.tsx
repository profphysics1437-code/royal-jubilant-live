"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Calendar, Star } from 'lucide-react';

interface StoryEvent {
  id?: string; title: string; description: string; eventDate: string; location?: string;
  category: string; images: string[]; videoUrl?: string; highlighted: boolean; order: number; published: boolean;
}

const emptyEvent: StoryEvent = {
  title: '', description: '', eventDate: new Date().toISOString().slice(0, 10),
  location: '', category: 'milestone', images: [], videoUrl: '', highlighted: false, order: 0, published: true,
};

export default function StoryAdminPage() {
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StoryEvent | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/story');
      const d = await res.json();
      setEvents((d.events || []).map((e: any) => ({ ...e, images: typeof e.images === 'string' ? JSON.parse(e.images) : e.images, eventDate: new Date(e.eventDate).toISOString().slice(0, 10) })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const isEdit = !!editing.id;
    const res = await fetch(`/api/admin/story${isEdit ? `/${editing.id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing),
    });
    if (res.ok) { setEditing(null); setImageUrlInput(''); load(); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/admin/story/${id}`, { method: 'DELETE' });
    load();
  };

  const addImage = () => {
    if (!imageUrlInput.trim() || !editing) return;
    setEditing({ ...editing, images: [...editing.images, imageUrlInput.trim()] });
    setImageUrlInput('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Story & Events</h1>
          <p className="text-slate-500 text-sm">Manage events showcased on the Our Story page</p>
        </div>
        <button onClick={() => setEditing({ ...emptyEvent })} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
          <Plus size={18} /> New Event
        </button>
      </div>

      {loading ? <div className="text-center py-20 text-slate-400">Loading...</div> : events.length === 0 ? (
        <div className="text-center py-20"><Calendar size={48} className="mx-auto mb-3 text-slate-300" /><p className="text-slate-500">No events yet. Click &ldquo;New Event&rdquo; to add your first story moment.</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map(e => (
            <div key={e.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {e.images[0] && <img src={e.images[0]} alt={e.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider text-amber-600">{e.category}</span>
                      {e.highlighted && <Star size={12} className="text-amber-500 fill-amber-500" />}
                      {!e.published && <span className="text-xs text-red-500">Draft</span>}
                    </div>
                    <h3 className="font-serif text-lg text-slate-900">{e.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{new Date(e.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}{e.location ? ' · ' + e.location : ''}</p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{e.description}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => setEditing(e)} className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit size={16} /></button>
                    <button onClick={() => del(e.id!)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{editing.id ? 'Edit Event' : 'New Event'}</h2>
                <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Meeting with DIMAC CEO" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={4} className="w-full border rounded-lg px-3 py-2" placeholder="Describe the event..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Date</label>
                    <input type="date" value={editing.eventDate} onChange={e => setEditing({ ...editing, eventDate: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                      <option value="milestone">Milestone</option>
                      <option value="award">Award</option>
                      <option value="meeting">Meeting</option>
                      <option value="celebration">Celebration</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Dubai, UAE" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Images (URLs)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addImage()} className="flex-1 border rounded-lg px-3 py-2" placeholder="https://..." />
                    <button onClick={addImage} className="px-3 py-2 bg-slate-900 text-white rounded-lg"><Plus size={16} /></button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {editing.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                        <button onClick={() => setEditing({ ...editing, images: editing.images.filter((_, idx) => idx !== i) })} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100">×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
                  <input value={editing.videoUrl || ''} onChange={e => setEditing({ ...editing, videoUrl: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="https://youtube.com/..." />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Order</label>
                    <input type="number" value={editing.order} onChange={e => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <label className="flex items-end gap-2 pb-2">
                    <input type="checkbox" checked={editing.highlighted} onChange={e => setEditing({ ...editing, highlighted: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Highlighted</span>
                  </label>
                  <label className="flex items-end gap-2 pb-2">
                    <input type="checkbox" checked={editing.published} onChange={e => setEditing({ ...editing, published: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Published</span>
                  </label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={save} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"><Save size={16} /> Save Event</button>
                  <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
