"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AgentLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A1F44]"><div className="size-8 border-4 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin" /></div>}>
      <AgentLoginInner />
    </Suspense>
  );
}

function AgentLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/agent";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in as admin, sign them out so they can log in as agent
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      signOut({ redirect: false });
    }
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // If there's an existing session, sign out first to clear it
    if (session) {
      await signOut({ redirect: false });
      await new Promise((r) => setTimeout(r, 300));
    }

    const res = await signIn("credentials", {
      email,
      password,
      portal: "agent",
      redirect: false,
    });
    if (res?.error) {
      setError("Access denied. Agent credentials required.");
      setLoading(false);
    } else if (res?.ok) {
      // Verify the session has agent role before redirecting
      const sessionRes = await fetch("/api/auth/session").then((r) => r.json());
      if (sessionRes?.user?.role === "agent") {
        router.push(callbackUrl);
        router.refresh();
      } else {
        // Still has admin session — sign out and show error
        await signOut({ redirect: false });
        setError("Access denied. Agent credentials required. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-royal-gradient-diagonal flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-royal-gradient-diagonal text-white p-8 text-center">
            <div className="size-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <UserIcon className="size-8 text-[#A68A3F]" />
            </div>
            <h1 className="font-serif text-2xl font-medium">Agent Portal</h1>
            <p className="text-white/70 text-sm mt-1">Royal Jubilant Real Estate</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {status === "authenticated" && session?.user?.role === "admin" && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p>You're currently logged in as <strong>Admin</strong>.</p>
                  <p className="text-xs mt-1">Signing you out so you can log in as an agent...</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-[#F9FAFB]"
                  placeholder="your.name@royaljubilant.ae"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-[#F9FAFB]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-royal-gradient-diagonal hover:opacity-90 text-white rounded-full font-medium"
            >
              {loading ? "Signing in..." : (<>Sign In <ArrowRight className="size-4 ml-2" /></>)}
            </Button>

            <div className="text-center pt-2 border-t border-border/60">
              <p className="text-xs text-muted-foreground">Agent portal — for Royal Jubilant team members only.</p>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-white/60 hover:text-white transition-colors">← Back to website</a>
          <span className="text-white/40 mx-2">·</span>
          <a href="/admin/login" className="text-xs text-white/60 hover:text-white transition-colors">Admin login</a>
        </div>
      </motion.div>
    </div>
  );
}
