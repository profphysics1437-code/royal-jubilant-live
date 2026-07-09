"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Loader2, Send, Home, Building2, Phone, Mail, User as UserIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ValuationModal() {
  const { valuationOpen, setValuationOpen } = useStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [consultationType, setConsultationType] = useState<"rent" | "buy">("rent");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          whatsapp: payload.phone,
          source: `consultation_${consultationType}`,
          intent: consultationType === "rent" ? "Looking to rent" : "Looking to buy",
          message: `Consultation Type: ${consultationType === "rent" ? "Rental" : "Buyer"}\nBudget: ${payload.budget || "Not specified"}\nPreferred Areas: ${payload.areas || "Any"}\nTimeline: ${payload.timeline || "Flexible"}\nNotes: ${payload.notes || "None"}`,
          budget: payload.budget ? Number(String(payload.budget).replace(/[^0-9]/g, "")) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      toast.success("Consultation request received", {
        description: `A senior advisor will contact you within 2 hours to discuss your ${consultationType === "rent" ? "rental" : "purchase"} needs.`,
      });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {valuationOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setValuationOpen(false)}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-4"
          >
            <div className="relative bg-royal-gradient-diagonal text-white p-5 lg:p-6">
              <button onClick={() => setValuationOpen(false)} className="absolute top-4 right-4 size-10 rounded-full hover:bg-white/10 flex items-center justify-center">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-11 rounded-xl bg-[#C9A961] flex items-center justify-center">
                  <Calendar className="size-5 text-[#0A1F44]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-medium">Book a Consultation</h2>
                  <p className="text-xs text-white/60">Free · No obligation · Senior advisor · 2-hour response</p>
                </div>
              </div>
            </div>

            <div className="p-5 lg:p-6">
              {done ? (
                <div className="text-center py-10">
                  <div className="size-14 rounded-full bg-[#C9A961]/15 flex items-center justify-center mx-auto mb-4">
                    <Send className="size-6 text-[#A68A3F]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#0A1F44] mb-2">Consultation request received!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you. A senior Royal Jubilant advisor will contact you within 2 hours to discuss your {consultationType === "rent" ? "rental" : "purchase"} requirements.
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDone(false);
                      setValuationOpen(false);
                    }}
                    className="mt-4 text-[#A68A3F]"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Consultation Type Toggle — RENT or BUY */}
                  <div>
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-3 block">I want to *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setConsultationType("rent")}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          consultationType === "rent"
                            ? "border-[#C9A961] bg-[#C9A961]/10 shadow-sm"
                            : "border-border bg-[#F9FAFB] hover:border-[#C9A961]/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Home className={`size-5 ${consultationType === "rent" ? "text-[#A68A3F]" : "text-muted-foreground"}`} />
                          <span className="font-medium text-[#0A1F44] text-sm">Rent a Property</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Annual & short-term leases across Dubai</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationType("buy")}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          consultationType === "buy"
                            ? "border-[#C9A961] bg-[#C9A961]/10 shadow-sm"
                            : "border-border bg-[#F9FAFB] hover:border-[#C9A961]/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className={`size-5 ${consultationType === "buy" ? "text-[#A68A3F]" : "text-muted-foreground"}`} />
                          <span className="font-medium text-[#0A1F44] text-sm">Buy a Property</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Ready & off-plan purchases, investment advice</p>
                      </button>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">
                      {consultationType === "rent" ? "Annual Rent Budget (AED)" : "Purchase Budget (AED)"}
                    </Label>
                    <Input
                      name="budget"
                      placeholder={consultationType === "rent" ? "e.g. 80,000 - 150,000" : "e.g. 1,000,000 - 3,000,000"}
                      className="h-10 bg-[#F9FAFB]"
                    />
                  </div>

                  {/* Preferred Areas */}
                  <div>
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">Preferred Areas / Communities</Label>
                    <Input
                      name="areas"
                      placeholder="e.g. Dubai Marina, JBR, Downtown, Palm Jumeirah"
                      className="h-10 bg-[#F9FAFB]"
                    />
                  </div>

                  {/* Timeline */}
                  <div>
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">When do you need it?</Label>
                    <select
                      name="timeline"
                      className="w-full h-10 rounded-md border border-input bg-[#F9FAFB] px-3 text-sm"
                    >
                      <option value="">Select timeline...</option>
                      <option value="urgent">Urgent (within 1 week)</option>
                      <option value="2-4w">2-4 weeks</option>
                      <option value="1-3m">1-3 months</option>
                      <option value="3-6m">3-6 months</option>
                      <option value="exploring">Just exploring options</option>
                    </select>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">Full Name *</Label>
                      <Input name="name" required className="h-10 bg-[#F9FAFB]" placeholder="Your name" />
                    </div>
                    <div>
                      <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">Phone / WhatsApp *</Label>
                      <Input name="phone" required className="h-10 bg-[#F9FAFB]" placeholder="+971 50 123 4567" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">Email *</Label>
                    <Input name="email" type="email" required className="h-10 bg-[#F9FAFB]" placeholder="your@email.com" />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">Anything specific you're looking for?</Label>
                    <Textarea
                      name="notes"
                      rows={3}
                      placeholder={consultationType === "rent" ? "e.g. 2BR furnished, sea view, pet-friendly, near metro..." : "e.g. 3BR villa, ready to move, good ROI, specific developer..."}
                      className="bg-[#F9FAFB] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white rounded-full h-12"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <>Book My {consultationType === "rent" ? "Rental" : "Buyer"} Consultation <Send className="size-3.5 ml-1.5" /></>}
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    Free consultation · No obligation · A senior RERA-certified advisor will call you within 2 hours
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
