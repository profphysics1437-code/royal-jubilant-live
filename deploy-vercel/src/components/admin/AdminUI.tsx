"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl font-medium text-[#0A1F44]">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-border/60 ${className}`}>
      {children}
    </div>
  );
}

export function AdminStat({
  label,
  value,
  icon,
  trend,
  color = "royal",
  href,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  color?: "royal" | "gold" | "green" | "red";
  href?: string;
}) {
  const colors = {
    royal: "bg-royal-gradient-diagonal text-white",
    gold: "bg-[#C9A961]/15 text-[#A68A3F]",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };
  const card = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className={`size-11 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44]">{value}</div>
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-1.5">{label}</div>
    </>
  );
  const className = `bg-white rounded-2xl p-5 border border-border/60 ${href ? "cursor-pointer hover:border-[#C9A961] hover:shadow-lg hover:-translate-y-0.5 transition-all group" : ""}`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {card}
      </Link>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {card}
    </motion.div>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB] border-b border-border">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    viewing: "bg-purple-100 text-purple-700",
    negotiating: "bg-orange-100 text-orange-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full font-medium tracking-wide ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-10 text-muted-foreground text-sm">
        {label}
      </td>
    </tr>
  );
}
