"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Save, X } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", type: "residential" });

  const load = () => { setLoading(true); fetch("/api/admin/categories").then((r) => r.json()).then((d) => { setItems(d.categories || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.name) return;
    await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    toast.success("Category added"); setForm({ name: "", type: "residential" }); setAdding(false); load();
  };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/categories/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>;

  return (
    <div>
      <AdminPageHeader title="Property Categories" subtitle="Manage property types (Apartment, Villa, Office, etc.)" action={<Button onClick={() => setAdding(true)} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Category</Button>} />
      {adding && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-4 flex items-end gap-3">
          <div className="flex-1"><Label className="text-[10px] uppercase text-[#A68A3F] mb-1.5 block">Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#F9FAFB]" placeholder="e.g. Apartment" /></div>
          <div className="w-48"><Label className="text-[10px] uppercase text-[#A68A3F] mb-1.5 block">Type</Label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm"><option value="residential">Residential</option><option value="commercial">Commercial</option></select></div>
          <Button onClick={handleAdd} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full"><Save className="size-4" /></Button>
          <Button onClick={() => setAdding(false)} variant="outline" className="rounded-full"><X className="size-4" /></Button>
        </div>
      )}
      <AdminTable headers={["Name", "Type", "Status", "Actions"]}>
        {items.length === 0 ? <EmptyRow colSpan={4} label="No categories yet." /> : items.map((item) => (
          <tr key={item.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3 font-medium text-[#0A1F44]">{item.name}</td>
            <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full capitalize bg-[#F9FAFB]">{item.type}</span></td>
            <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${item.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{item.published ? "Published" : "Hidden"}</span></td>
            <td className="px-4 py-3"><button onClick={() => handleDelete(item.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
