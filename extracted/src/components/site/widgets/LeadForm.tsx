"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  source: string; // property_form | viewing | whatsapp | callback | mortgage | contact | newsletter | valuation
  propertyRef?: string;
  agentId?: string;
  community?: string;
  contextLabel?: string;
  compact?: boolean;
}

export function LeadForm({ source, propertyRef, agentId, community, contextLabel, compact }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source, propertyRef, agentId, community }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      toast.success("Request received", {
        description: "A senior advisor will contact you within 2 hours.",
      });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="size-14 rounded-full bg-[#C9A961]/15 flex items-center justify-center mx-auto mb-4">
          <Send className="size-6 text-[#A68A3F]" />
        </div>
        <h4 className="font-serif text-lg text-[#0A1F44] mb-2">Request received</h4>
        <p className="text-sm text-muted-foreground">
          Thank you. One of our senior advisors will be in touch within 2 hours.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDone(false)}
          className="mt-3 text-xs text-[#A68A3F]"
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-3 ${compact ? "" : ""}`}>
      {contextLabel && (
        <div className="text-xs text-[#A68A3F] tracking-luxury uppercase font-medium pb-2 border-b border-border/40">
          {contextLabel}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Input
          name="name"
          placeholder="Full name *"
          required
          className="h-10 bg-[#F9FAFB] border-border/60 text-sm"
        />
        <Input
          name="phone"
          placeholder="Phone *"
          required
          className="h-10 bg-[#F9FAFB] border-border/60 text-sm"
        />
      </div>
      <Input
        name="email"
        type="email"
        placeholder="Email address"
        className="h-10 bg-[#F9FAFB] border-border/60 text-sm"
      />
      <Textarea
        name="message"
        placeholder="Tell us about your requirements — preferred viewing times, budget range, anything we should know."
        rows={compact ? 2 : 3}
        className="bg-[#F9FAFB] border-border/60 text-sm resize-none"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white rounded-full h-10 text-sm"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <>Submit Request <Send className="size-3.5 ml-1.5" /></>}
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">
        By submitting, you agree to our Privacy Policy. We respond within 2 hours.
      </p>
    </form>
  );
}
