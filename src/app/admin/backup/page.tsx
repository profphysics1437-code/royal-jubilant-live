export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, FileJson, FileText, Database, RefreshCw, HardDrive } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Entity {
  key: string;
  label: string;
  count: number;
}

export default function BackupPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/backup")
      .then((r) => r.json())
      .then((d) => { setEntities(d.entities || []); setLoading(false); })
      .catch(() => { toast.error("Failed to load"); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const downloadCSV = (key: string) => {
    window.location.href = `/api/admin/backup?entity=${key}&format=csv`;
    toast.success(`Downloading ${key}.csv`);
  };

  const downloadJSON = (key: string) => {
    window.location.href = `/api/admin/backup?entity=${key}&format=json`;
    toast.success(`Downloading ${key}.json`);
  };

  const fullBackup = async () => {
    setBackingUp(true);
    window.location.href = `/api/admin/backup?all=1`;
    toast.success("Generating full backup...");
    setTimeout(() => setBackingUp(false), 3000);
  };

  const totalRecords = entities.reduce((sum, e) => sum + e.count, 0);

  return (
    <div>
      <AdminPageHeader
        title="Backup & Export"
        subtitle="Export any data table as CSV or JSON. Generate a full database backup for safekeeping or migration to another environment."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`size-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button onClick={fullBackup} disabled={backingUp} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
              {backingUp ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Database className="size-4 mr-1.5" />}
              Full Backup (JSON)
            </Button>
          </div>
        }
      />

      {/* Top summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <AdminCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-royal-gradient-diagonal flex items-center justify-center text-white">
              <HardDrive className="size-5" />
            </div>
            <div>
              <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44]">{entities.length}</div>
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Data Tables</div>
            </div>
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-[#C9A961]/15 flex items-center justify-center text-[#A68A3F]">
              <Database className="size-5" />
            </div>
            <div>
              <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44]">{totalRecords.toLocaleString()}</div>
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Total Records</div>
            </div>
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
              <FileJson className="size-5" />
            </div>
            <div>
              <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44]">JSON</div>
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Backup Format</div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Full backup callout */}
      <div className="bg-royal-gradient-diagonal rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-serif text-xl font-medium mb-1">Complete Database Backup</h2>
            <p className="text-sm text-white/80 max-w-xl">
              Download every table as a single JSON file. Suitable for disaster recovery, environment migration, or versioned snapshots.
            </p>
          </div>
          <Button
            onClick={fullBackup}
            disabled={backingUp}
            className="bg-[#C9A961] hover:bg-[#C9A961]/90 text-[#0A1F44] font-semibold"
          >
            {backingUp ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Download className="size-4 mr-1.5" />}
            Generate Backup
          </Button>
        </div>
      </div>

      {/* Entity table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#C9A961]" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB] border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Entity</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Records</th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {entities.map((e) => (
                  <tr key={e.key} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0A1F44]">{e.label}</div>
                      <code className="text-[10px] text-muted-foreground">{e.key}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span className="size-1.5 rounded-full bg-[#C9A961]" />
                        {e.count.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => downloadCSV(e.key)}
                          disabled={e.count === 0}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-[#C9A961]/15 text-[#A68A3F] disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Export as CSV"
                        >
                          <FileText className="size-3.5" /> CSV
                        </button>
                        <button
                          onClick={() => downloadJSON(e.key)}
                          disabled={e.count === 0}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-[#0A1F44]/10 text-[#0A1F44] disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Export as JSON"
                        >
                          <FileJson className="size-3.5" /> JSON
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center">
        All exports are logged in the Activity Logs. CSV uses UTF-8 encoding. JSON backups include all 25+ tables with metadata.
      </p>
    </div>
  );
}
