"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, TrendingUp, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MortgageModal() {
  const { mortgageOpen, setMortgageOpen } = useStore();
  const [price, setPrice] = useState(5000000);
  const [downPct, setDownPct] = useState(30);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.75);
  const [loading, setLoading] = useState(false);

  const down = (price * downPct) / 100;
  const loan = price - down;
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const monthly = monthlyRate > 0
    ? Math.round((loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)))
    : Math.round(loan / months);
  const totalPaid = monthly * months;
  const totalInterest = totalPaid - loan;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mortgage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Calculator enquiry",
          email: "calc@royaljubilant.ae",
          phone: "",
          propertyPrice: price,
          downPayment: down,
          loanTenor: years,
        }),
      });
      if (res.ok) {
        toast.success("Mortgage advisor will be in touch", {
          description: "We'll send you pre-qualification options within 24 hours.",
        });
        setMortgageOpen(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {mortgageOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMortgageOpen(false)}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-8"
          >
            {/* Header */}
            <div className="relative bg-royal-gradient-diagonal text-white p-6 lg:p-8">
              <button onClick={() => setMortgageOpen(false)} className="absolute top-4 right-4 size-10 rounded-full hover:bg-white/10 flex items-center justify-center">
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="size-11 rounded-xl bg-[#C9A961] flex items-center justify-center">
                  <Calculator className="size-5 text-[#0A1F44]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-medium">Mortgage Calculator</h2>
                  <p className="text-xs text-white/60">Plan your Dubai property purchase</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Inputs */}
              <div className="p-6 lg:p-8 space-y-6">
                <div>
                  <Label className="text-xs tracking-luxury uppercase text-[#A68A3F] mb-2 block">Property Price</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">AED</span>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                      className="h-12 font-serif text-lg text-[#0A1F44]"
                    />
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="100000000"
                    step="100000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full mt-2 accent-[#C9A961]"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>500K</span>
                    <span>100M</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F]">Down Payment</Label>
                    <span className="text-sm font-medium text-[#0A1F44]">{downPct}%</span>
                  </div>
                  <Slider
                    value={[downPct]}
                    onValueChange={(v) => setDownPct(v[0])}
                    min={20}
                    max={70}
                    step={5}
                    className="[&_[role=slider]]:bg-[#C9A961] [&_[role=slider]]:border-[#A68A3F]"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>20%</span>
                    <span>70%</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <strong className="text-[#0A1F44]">AED {down.toLocaleString()}</strong> · loan <strong className="text-[#0A1F44]">AED {loan.toLocaleString()}</strong>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F]">Loan Term</Label>
                    <span className="text-sm font-medium text-[#0A1F44]">{years} years</span>
                  </div>
                  <Slider
                    value={[years]}
                    onValueChange={(v) => setYears(v[0])}
                    min={5}
                    max={30}
                    step={1}
                    className="[&_[role=slider]]:bg-[#C9A961] [&_[role=slider]]:border-[#A68A3F]"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>5y</span>
                    <span>30y</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs tracking-luxury uppercase text-[#A68A3F]">Interest Rate</Label>
                    <span className="text-sm font-medium text-[#0A1F44]">{rate.toFixed(2)}%</span>
                  </div>
                  <Slider
                    value={[rate]}
                    onValueChange={(v) => setRate(v[0])}
                    min={2.5}
                    max={7.5}
                    step={0.05}
                    className="[&_[role=slider]]:bg-[#C9A961] [&_[role=slider]]:border-[#A68A3F]"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>2.50%</span>
                    <span>7.50%</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#F9FAFB] p-6 lg:p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="size-4 text-[#A68A3F]" />
                  <span className="text-xs tracking-luxury uppercase text-[#A68A3F] font-semibold">Your monthly payment</span>
                </div>

                <div className="text-center py-6 mb-5">
                  <div className="font-serif text-4xl lg:text-5xl font-semibold text-gradient-gold">
                    AED {monthly.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">per month for {years} years</div>
                </div>

                <div className="space-y-3 mb-5">
                  <Row label="Loan amount" value={`AED ${loan.toLocaleString()}`} />
                  <Row label="Down payment" value={`AED ${down.toLocaleString()}`} />
                  <Row label="Total interest" value={`AED ${Math.round(totalInterest).toLocaleString()}`} />
                  <Row label="Total repayable" value={`AED ${Math.round(totalPaid).toLocaleString()}`} bold />
                </div>

                <div className="mt-auto space-y-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white rounded-full"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : "Get Pre-Qualified in 24 hrs"}
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    indicative only · actual rate depends on lender assessment
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-2 ${bold ? "border-t border-border pt-3" : ""}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm ${bold ? "font-semibold text-[#0A1F44]" : "text-[#0A1F44]"}`}>{value}</span>
    </div>
  );
}
