"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  HardHat,
  FileText,
  Star,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Phone,
  Mail,
  Calculator,
  Tag,
  Newspaper,
  ChevronRight,
  ExternalLink,
  Calendar,
  BarChart3,
  Database,
  FileCode,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero Section", icon: LayoutDashboard, badge: "CMS" },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/communities", label: "Communities", icon: MapPin },
  { href: "/admin/developers", label: "Developers", icon: HardHat },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/categories", label: "Categories", icon: Building2 },
  { href: "/admin/amenities", label: "Amenities", icon: Star },
  { href: "/admin/leads", label: "Leads", icon: Phone, badge: "CRM" },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/valuations", label: "Valuations", icon: Tag },
  { href: "/admin/mortgages", label: "Mortgages", icon: Calculator },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/videos", label: "Advisor Videos", icon: Newspaper },
  { href: "/admin/story", label: "Story & Events", icon: Calendar, badge: "NEW" },
  { href: "/admin/ai-robot", label: "AI Robot Control", icon: ShieldCheck, badge: "AI" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/awards", label: "Awards", icon: Trophy },
  { href: "/admin/faqs", label: "FAQs", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: FileText },
  { href: "/admin/popups", label: "Popup Manager", icon: FileText },
  { href: "/admin/seo", label: "SEO", icon: FileText },
  { href: "/admin/menu", label: "Menu Builder", icon: FileText },
  { href: "/admin/pages", label: "Landing Pages", icon: FileCode, badge: "P3" },
  { href: "/admin/email-templates", label: "Email Templates", icon: Mail, badge: "P3" },
  { href: "/admin/users", label: "Users & Roles", icon: ShieldCheck, badge: "P3" },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, badge: "P3" },
  { href: "/admin/backup", label: "Backup & Export", icon: Database, badge: "P3" },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: FileText },
  { href: "/admin/profile", label: "My Profile", icon: UserIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login page renders without sidebar shell
  const isLogin = pathname === "/admin/login";

  // Redirect to login if unauthenticated, or to agent portal if agent — in useEffect
  useEffect(() => {
    if (status === "unauthenticated" && !isLogin) {
      window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`;
    }
    // Security: if an agent tries to access /admin, redirect them to /agent
    if (session && (session.user as any)?.role === "agent" && !isLogin) {
      window.location.href = "/agent";
    }
  }, [status, isLogin, pathname, session]);

  if (isLogin) return <>{children}</>;

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="size-12 border-4 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{status === "unauthenticated" ? "Redirecting to login…" : "Loading admin…"}</p>
        </div>
      </div>
    );
  }

  // Security: if logged in but not an admin, show redirect screen
  if (session && (session.user as any)?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="size-12 border-4 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Redirecting to agent portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-border flex items-center justify-between p-4">
        <button onClick={() => setSidebarOpen(true)} className="size-9 rounded-lg hover:bg-muted flex items-center justify-center">
          <Menu className="size-5" />
        </button>
        <div className="font-serif text-base font-medium">Admin</div>
        <Link href="/" className="size-9 rounded-lg hover:bg-muted flex items-center justify-center">
          <ExternalLink className="size-4" />
        </Link>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-royal-gradient-vertical text-white z-50 lg:hidden overflow-y-auto"
            >
              <SidebarContent
                pathname={pathname}
                session={session}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-royal-gradient-vertical text-white flex-col z-30">
        <SidebarContent pathname={pathname} session={session} />
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-border h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search admin..."
              className="bg-transparent border-0 outline-none text-sm flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="size-9 rounded-full hover:bg-muted flex items-center justify-center relative">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-[#C9A961]" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              {(session!.user as any)?.avatarUrl ? (
                <img src={(session!.user as any).avatarUrl} alt={session!.user?.name || "Profile"} className="size-8 rounded-full object-cover" />
              ) : (
                <div className="size-8 rounded-full bg-royal-gradient-diagonal flex items-center justify-center text-white text-xs font-bold">
                  {(session!.user?.name || "A").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-xs">
                <div className="font-medium text-[#0A1F44]">{session!.user?.name}</div>
                <div className="text-muted-foreground">{(session!.user as any)?.role}</div>
              </div>
            </div>
            <Link href="/" target="_blank" className="size-9 rounded-full hover:bg-muted flex items-center justify-center" title="View website">
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, session, onClose }: { pathname: string; session: any; onClose?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5 group" onClick={onClose}>
          <img src="/logo.png" alt="Royal Jubilant" className="size-10 object-contain" />
          <div>
            <div className="font-serif text-base font-semibold leading-none">Royal Jubilant</div>
            <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mt-1">Admin Portal</div>
          </div>
        </Link>
      </div>

      {/* Back to Website button — prominent */}
      <div className="px-3 pt-3">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-[#C9A961] hover:bg-[#D4AF37] text-[#0A1F44] font-semibold text-sm transition-colors group"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="size-4" />
            Back to Website
          </span>
          <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/8"
                }`}
              >
                <Icon className="size-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C9A961] text-[#0A1F44] font-bold tracking-wide">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="size-3.5" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 mb-2">
          {(session.user as any)?.avatarUrl ? (
            <img src={(session.user as any).avatarUrl} alt={session.user?.name || "Profile"} className="size-9 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="size-9 rounded-full bg-royal-gradient-diagonal flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {(session.user?.name || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{session.user?.name}</div>
            <div className="text-xs text-white/60 truncate">{session.user?.email}</div>
          </div>
          <Link href="/admin/profile" className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center flex-shrink-0" title="Edit Profile">
            <UserIcon className="size-3.5 text-white/70" />
          </Link>
        </div>
        <Link
          href="/api/auth/signout?callbackUrl=/admin/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
        >
          <LogOut className="size-4" /> Sign out
        </Link>
      </div>
    </>
  );
}
