export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star, Save, Loader2, Check, Clock, Eye, EyeOff } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatPrice } from "@/lib/data";
import { PhotoUploader } from "@/components/admin/PhotoUploader";

interface Property {
  id: string;
  reference: string;
  title: string;
  status: string;
  type: string;
  price: number;
  community: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  isLuxury: boolean;
  published: boolean;
  createdAt: string;
  amenities: string;
  features: string;
  images: string;
  description: string;
  pricePerSqft?: number;
  rentFrequency?: string;
  subCommunity?: string;
  developer?: string;
  furnished: boolean;
  completionStatus?: string;
  handoverYear?: number;
  parking: number;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  isLatest: boolean;
}

export default function AdminProperties() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Property | "new" | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "published">("all");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/properties").then((r) => r.json()).then((d) => {
      setItems(d.properties || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Property deleted"); load(); }
    else toast.error("Failed to delete");
  };

  // Approve (publish) a property — one-click, no modal needed
  const handleApprove = async (id: string, title: string) => {
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: true }),
    });
    if (res.ok) {
      toast.success("Property approved & published", { description: title });
      load();
    } else {
      toast.error("Failed to approve property");
    }
  };

  // Unpublish a property (send back to pending)
  const handleUnpublish = async (id: string, title: string) => {
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: false }),
    });
    if (res.ok) {
      toast.success("Property unpublished", { description: title });
      load();
    } else {
      toast.error("Failed to unpublish");
    }
  };

  // Derived counts
  const pendingCount = items.filter((p) => !p.published).length;
  const publishedCount = items.filter((p) => p.published).length;

  const filtered = items.filter((p) => {
    if (filter === "pending") return !p.published;
    if (filter === "published") return p.published;
    return true;
  });

  return (
    <div>
      <AdminPageHeader
        title="Properties"
        subtitle="Add, edit, approve or remove property listings. Agent submissions appear here as pending until approved."
        action={
          <Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full">
            <Plus className="size-4 mr-1.5" /> Add Property
          </Button>
        }
      />

      {/* Pending-approval banner */}
      {pendingCount > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="size-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="size-4 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-amber-900 text-sm">
              {pendingCount} propert{pendingCount === 1 ? "y" : "ies"} pending approval
            </div>
            <div className="text-xs text-amber-700">
              Agent-submitted listings are hidden from the public site until you approve them.
            </div>
          </div>
          {filter !== "pending" && (
            <button
              onClick={() => setFilter("pending")}
              className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Review now →
            </button>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { id: "all", label: "All", count: items.length },
          { id: "pending", label: "Pending Approval", count: pendingCount },
          { id: "published", label: "Published", count: publishedCount },
        ] as const).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
              filter === f.id
                ? "bg-[#0A1F44] text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.id ? "bg-white/20" : "bg-muted"}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-[#A68A3F]" />
        </div>
      ) : (
        <AdminTable headers={["Ref", "Title", "Listing", "Price", "Community", "Beds", "Featured", "Approval", "Actions"]}>
          {filtered.length === 0 ? (
            <EmptyRow colSpan={9} label={filter === "pending" ? "No pending properties. All caught up!" : filter === "published" ? "No published properties yet." : "No properties yet. Click 'Add Property' to create your first listing."} />
          ) : (
            filtered.map((p) => (
              <tr key={p.id} className={`hover:bg-[#F9FAFB]/50 ${!p.published ? "bg-amber-50/30" : ""}`}>
                <td className="px-4 py-3"><span className="text-xs font-mono text-[#A68A3F]">{p.reference}</span></td>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#0A1F44] line-clamp-1 max-w-[220px]">{p.title}</div>
                </td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-[#F9FAFB] capitalize">{p.status}</span></td>
                <td className="px-4 py-3 font-medium text-[#0A1F44]">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{p.community}</td>
                <td className="px-4 py-3 text-center">{p.bedrooms}</td>
                <td className="px-4 py-3">{p.featured && <Star className="size-4 fill-[#C9A961] text-[#A68A3F]" />}</td>
                <td className="px-4 py-3">
                  {p.published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      <Eye className="size-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                      <Clock className="size-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {/* Approve / Unpublish button — one click */}
                    {!p.published ? (
                      <button
                        onClick={() => handleApprove(p.id, p.title)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                        title="Approve & publish"
                      >
                        <Check className="size-3.5" /> Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnpublish(p.id, p.title)}
                        className="size-8 rounded-lg hover:bg-amber-50 flex items-center justify-center text-amber-600"
                        title="Unpublish (send back to pending)"
                      >
                        <EyeOff className="size-3.5" />
                      </button>
                    )}
                    <button onClick={() => setEditing(p)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center" title="Edit"><Pencil className="size-3.5 text-[#A68A3F]" /></button>
                    <button onClick={() => handleDelete(p.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center" title="Delete"><Trash2 className="size-3.5 text-red-600" /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </AdminTable>
      )}

      {editing && (
        <PropertyForm property={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function PropertyForm({ property, onClose, onSaved }: { property: Property | null; onClose: () => void; onSaved: () => void }) {
  // Sanitize nullable DB fields → empty strings so <Input value={...}> never gets null
  const sanitize = (obj: any) => {
    const out: any = {};
    for (const k of Object.keys(obj || {})) {
      out[k] = obj[k] === null || obj[k] === undefined ? "" : obj[k];
    }
    return out;
  };
  // Parse the images JSON string from DB into an array for the PhotoUploader
  const parseImages = (imgField: string | undefined): string[] => {
    if (!imgField) return [];
    try {
      const parsed = JSON.parse(imgField);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const [form, setForm] = useState<any>(() => {
    if (property) {
      const s = sanitize({ ...property });
      s.images = parseImages(property.images);
      return s;
    }
    return {
    reference: `RJ-${Date.now().toString().slice(-6)}`,
    title: "", status: "sale", type: "Apartment", price: "", pricePerSqft: "",
    rentFrequency: "", bedrooms: 1, bathrooms: 1, area: "", parking: 1,
    community: "", subCommunity: "", developer: "", furnished: false,
    completionStatus: "Ready", handoverYear: "", description: "",
    locationLat: "", locationLng: "", locationAddress: "",
    featured: false, isLatest: true, isLuxury: false, published: true,
    images: [] as string[],
  };
  });
  const [amenitiesText, setAmenitiesText] = useState<string>(
    property?.amenities ? (() => { try { return JSON.parse(property.amenities).join("\n"); } catch { return ""; } })() : ""
  );
  const [featuresText, setFeaturesText] = useState<string>(
    property?.features ? (() => { try { return JSON.parse(property.features).join("\n"); } catch { return ""; } })() : ""
  );
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      amenities: amenitiesText.split("\n").map((s) => s.trim()).filter(Boolean),
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      // images is already an array on form (managed by PhotoUploader)
      images: form.images || [],
    };
    try {
      const url = property ? `/api/admin/properties/${property.id}` : "/api/admin/properties";
      const method = property ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(property ? "Property updated" : "Property created");
      onSaved();
    } catch {
      toast.error("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-serif text-xl font-medium">{property ? "Edit Property" : "Add New Property"}</h2>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reference *"><Input value={form.reference} onChange={(e) => set("reference", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Status *">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-border text-sm">
                <option value="sale">For Sale</option><option value="rent">For Rent</option><option value="commercial">Commercial</option><option value="off-plan">Off-Plan</option>
              </select>
            </Field>
          </div>
          <Field label="Title *"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. Signature Villa with Private Beach — Frond M" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Type *">
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-border text-sm">
                {["Apartment", "Villa", "Penthouse", "Townhouse", "Studio", "Mansion", "Duplex", "Compound", "Private Room", "Bed Space", "Office", "Retail", "Warehouse", "Labor Camp", "Shop", "Factory"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Price (AED) *"><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Price / sqft"><Input type="number" value={form.pricePerSqft} onChange={(e) => set("pricePerSqft", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Bedrooms"><Input type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Bathrooms"><Input type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Area (sqft)"><Input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Parking"><Input type="number" value={form.parking} onChange={(e) => set("parking", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Community *"><Input value={form.community} onChange={(e) => set("community", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Sub-community"><Input value={form.subCommunity} onChange={(e) => set("subCommunity", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Developer"><Input value={form.developer} onChange={(e) => set("developer", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Completion Status">
              <select value={form.completionStatus} onChange={(e) => set("completionStatus", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-border text-sm">
                <option value="Ready">Ready</option><option value="Off-Plan">Off-Plan</option><option value="Under Construction">Under Construction</option>
              </select>
            </Field>
            <Field label="Handover Year"><Input type="number" value={form.handoverYear} onChange={(e) => set("handoverYear", e.target.value)} className="bg-[#F9FAFB]" placeholder="2026" /></Field>
            <Field label="Rent Frequency">
              <select value={form.rentFrequency || ""} onChange={(e) => set("rentFrequency", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-border text-sm">
                <option value="">N/A</option><option value="year">Per Year</option><option value="month">Per Month</option>
              </select>
            </Field>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="bg-[#F9FAFB] resize-none" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amenities (one per line)"><Textarea value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} rows={5} className="bg-[#F9FAFB] resize-none text-xs" placeholder={"Pool\nGym\nConcierge"} /></Field>
            <Field label="Features (one per line)"><Textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={5} className="bg-[#F9FAFB] resize-none text-xs" placeholder={"Private beach\nSmart home"} /></Field>
          </div>
          <Field label="Property Photos">
            <PhotoUploader
              value={form.images || []}
              onChange={(urls) => set("images", urls)}
              folder="properties"
              min={1}
              max={50}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location Address"><Input value={form.locationAddress} onChange={(e) => set("locationAddress", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Latitude"><Input value={form.locationLat} onChange={(e) => set("locationLat", e.target.value)} className="bg-[#F9FAFB]" /></Field>
              <Field label="Longitude"><Input value={form.locationLng} onChange={(e) => set("locationLng", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
            <Toggle label="Furnished" checked={form.furnished} onChange={(v) => set("furnished", v)} />
            <Toggle label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
            <Toggle label="Luxury Collection" checked={form.isLuxury} onChange={(v) => set("isLuxury", v)} />
            <Toggle label="Latest" checked={form.isLatest} onChange={(v) => set("isLatest", v)} />
            <Toggle label="Published" checked={form.published} onChange={(v) => set("published", v)} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="bg-royal-gradient-diagonal text-white rounded-full flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> {property ? "Save Changes" : "Create Property"}</>}
            </Button>
            <Button onClick={onClose} variant="outline" className="rounded-full">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium mb-1.5 block">{label}</Label>{children}</div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[#C9A961]" /><span className="text-sm text-[#0A1F44]">{label}</span></label>;
}
