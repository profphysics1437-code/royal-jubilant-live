"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, X, Shield, User as UserIcon, Crown, Search, Key } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  preferredLang: string | null;
  createdAt: string;
}

const roleStyles: Record<string, { badge: string; icon: any }> = {
  admin: { badge: "bg-[#C9A961]/15 text-[#A68A3F]", icon: Crown },
  agent: { badge: "bg-blue-100 text-blue-700", icon: Shield },
  customer: { badge: "bg-gray-100 text-gray-700", icon: UserIcon },
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<User> & { password?: string } | "new" | null>(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/users").then((r) => r.json()).then((d) => {
      setUsers(d.users || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (user: any) => {
    setSaving(true);
    try {
      if (user.id) {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed");
        }
        toast.success("User updated");
      } else {
        if (!user.password) {
          throw new Error("Password required for new users");
        }
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed");
        }
        toast.success("User created");
      }
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    toast.success("User deleted");
    load();
  };

  const filtered = users.filter((u) =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    agents: users.filter((u) => u.role === "agent").length,
    customers: users.filter((u) => u.role === "customer").length,
  };

  return (
    <div>
      <AdminPageHeader
        title="User & Roles"
        subtitle="Manage admin, agent, and customer accounts. Reset passwords, change roles, and onboard new team members."
        action={
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> New User
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Total Users</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{counts.total}</div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F]">Admins</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{counts.admins}</div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Agents</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{counts.agents}</div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Customers</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{counts.customers}</div>
        </AdminCard>
      </div>

      <AdminCard className="p-4 mb-4">
        <div className="flex items-center gap-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0"
          />
        </div>
      </AdminCard>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#C9A961]" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB] border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">User</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Role</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Phone</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Language</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Joined</th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((u) => {
                  const rs = roleStyles[u.role] || roleStyles.customer;
                  const RoleIcon = rs.icon;
                  return (
                    <tr key={u.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-royal-gradient-diagonal flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(u.name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-[#0A1F44]">{u.name || "—"}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${rs.badge}`}>
                          <RoleIcon className="size-3" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.phone || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.preferredLang || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditing({ ...u, password: "" })}
                            className="size-8 rounded-lg hover:bg-muted flex items-center justify-center"
                            title="Edit"
                          >
                            <Key className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.email)}
                            className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No users found
            </div>
          )}
        </div>
      )}

      {editing && (
        <UserEditor
          user={editing === "new" ? {} : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function UserEditor({ user, saving, onClose, onSave }: {
  user: any;
  saving: boolean;
  onClose: () => void;
  onSave: (u: any) => void;
}) {
  const [form, setForm] = useState<any>({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "customer",
    preferredLang: user.preferredLang || "en",
    password: user.password || "",
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl font-medium text-[#0A1F44]">
            {user.id ? "Edit User" : "New User"}
          </h2>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!!user.id}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Role</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <Label>Preferred Language</Label>
              <select
                value={form.preferredLang}
                onChange={(e) => setForm({ ...form, preferredLang: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="ur">Urdu</option>
                <option value="hi">Hindi</option>
                <option value="fa">Farsi</option>
              </select>
            </div>
          </div>
          <div>
            <Label>{user.id ? "Reset Password (leave blank to keep)" : "Password *"}</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={user.id ? "••••••••" : "Min 8 characters"}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-6 border-t border-border bg-[#F9FAFB]">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => onSave(form)}
            disabled={saving}
            className="bg-[#0A1F44] hover:bg-[#0A1F44]/90"
          >
            {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Save className="size-4 mr-1.5" />}
            {user.id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
