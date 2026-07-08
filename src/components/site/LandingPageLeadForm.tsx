"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";

interface Props {
  /** The landing page slug — used to tag the lead source as "landing-page:{slug}" */
  slug: string;
  /** Optional headline override (defaults to "Request More Information") */
  headline?: string;
  /** Optional subtext */
  subtext?: string;
  /** Pre-fill community field (e.g., page is about Dubai Hills) */
  defaultCommunity?: string;
}

/**
 * Embedded lead capture form for landing pages.
 * Posts to /api/leads with source = "landing-page:{slug}" so the admin
 * Leads CRM can filter by which landing page generated each lead.
 */
export function LandingPageLeadForm({
  slug,
  headline = "Request More Information",
  subtext = "Fill in your details and a senior advisor will contact you within 24 hours.",
  defaultCommunity = "",
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setErrorMsg("Name and email are required.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          source: `landing-page:${slug}`,
          intent: "landing-page-enquiry",
          message: form.message || null,
          community: defaultCommunity || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit");
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#0A1F44] to-[#1E3A6F] p-8 lg:p-10 text-center text-white">
        <CheckCircle2 className="size-14 mx-auto text-[#C9A961] mb-4" />
        <h3 className="font-serif text-2xl font-medium mb-2">Thank You!</h3>
        <p className="text-white/80 max-w-md mx-auto">
          Your enquiry has been received. A senior Royal Jubilant advisor will contact you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-[#C9A961] hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0A1F44] to-[#1E3A6F] p-6 lg:p-10 text-white">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A961]/20 text-[#C9A961] text-[10px] tracking-luxury uppercase font-medium mb-3">
          <Send className="size-3" /> Enquiry Form
        </div>
        <h3 className="font-serif text-2xl lg:text-3xl font-medium mb-2">{headline}</h3>
        <p className="text-sm text-white/70 max-w-md mx-auto">{subtext}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="text-[10px] tracking-luxury uppercase text-[#C9A961] font-medium mb-1.5 block">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:bg-white/15 transition-all"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-luxury uppercase text-[#C9A961] font-medium mb-1.5 block">
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:bg-white/15 transition-all"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-luxury uppercase text-[#C9A961] font-medium mb-1.5 block">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:bg-white/15 transition-all"
            placeholder="+971 50 123 4567"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-luxury uppercase text-[#C9A961] font-medium mb-1.5 block">
            Message (optional)
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#C9A961]/50 focus:bg-white/15 transition-all resize-none"
            placeholder="I'm interested in this opportunity. Please share more details."
          />
        </div>

        {status === "error" && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full h-12 rounded-full bg-[#C9A961] hover:bg-[#D4B875] text-[#0A1F44] font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {status === "submitting" ? (
            <><Loader2 className="size-4 animate-spin" /> Submitting...</>
          ) : (
            <>Submit Enquiry <Send className="size-4" /></>
          )}
        </button>

        <p className="text-[10px] text-white/40 text-center pt-2">
          By submitting, you agree to be contacted by Royal Jubilant Real Estate LLC. We never share your data.
        </p>
      </form>
    </div>
  );
}
