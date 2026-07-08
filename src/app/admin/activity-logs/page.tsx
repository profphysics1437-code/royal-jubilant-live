"use client";
import { useEffect, useState } from "react";
import { Loader2, Clock, User, FileText } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activity-logs").then((r) => r.json()).then((d) => { setLogs(d.logs || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>;

  return (
    <div>
      <AdminPageHeader title="Activity Logs" subtitle="Track all admin and agent actions across the platform." />
      <AdminTable headers={["User", "Role", "Action", "Entity", "Details", "Time"]}>
        {logs.length === 0 ? <EmptyRow colSpan={6} label="No activity logged yet." /> : logs.map((log) => (
          <tr key={log.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="size-7 rounded-full bg-[#0A1F44] flex items-center justify-center text-white text-[10px] font-bold">{log.userName?.charAt(0) || "U"}</div><span className="text-sm font-medium text-[#0A1F44]">{log.userName}</span></div></td>
            <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9FAFB] capitalize">{log.userRole}</span></td>
            <td className="px-4 py-3 text-xs font-medium text-[#0A1F44]">{log.action}</td>
            <td className="px-4 py-3 text-xs text-[#6B7280]">{log.entity}</td>
            <td className="px-4 py-3 text-xs text-[#9CA3AF] max-w-xs truncate">{log.details || "—"}</td>
            <td className="px-4 py-3 text-xs text-[#9CA3AF]">{new Date(log.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
