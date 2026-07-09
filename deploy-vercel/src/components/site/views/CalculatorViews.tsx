"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, TrendingUp, Home, ArrowRight, Info } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Rental Yield Calculator ─────────────────────────────────────────
export function RentalYieldCalculator() {
  const { setActiveView } = useStore();
  const [propertyPrice, setPropertyPrice] = useState("2000000");
  const [annualRent, setAnnualRent] = useState("120000");
  const [serviceCharges, setServiceCharges] = useState("12000");

  const { grossYield, netYield, annualProfit } = useMemo(() => {
    const price = Number(propertyPrice) || 0;
    const rent = Number(annualRent) || 0;
    const charges = Number(serviceCharges) || 0;
    const gross = price > 0 ? (rent / price) * 100 : 0;
    const net = price > 0 ? ((rent - charges) / price) * 100 : 0;
    const profit = rent - charges;
    return { grossYield: gross, netYield: net, annualProfit: profit };
  }, [propertyPrice, annualRent, serviceCharges]);

  const getRating = (yield_: number) => {
    if (yield_ >= 8) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (yield_ >= 6) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (yield_ >= 4) return { label: "Average", color: "text-amber-600", bg: "bg-amber-100" };
    return { label: "Below Average", color: "text-red-600", bg: "bg-red-100" };
  };

  const rating = getRating(netYield);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-royal-gradient-diagonal text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <button onClick={() => setActiveView("home")} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#A68A3F] mb-5">
            <ArrowLeft className="size-3.5" /> Back to Home
          </button>
          <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mb-3">Investment Tools</div>
          <h1 className="h1 text-white">Rental Yield Calculator</h1>
          <p className="mt-4 body-lg text-white/70 max-w-2xl">
            Whether you're considering a property investment or already have a portfolio, keeping an accurate estimation of your potential returns is essential. Calculate your rental yield below.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input form */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm">
            <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-5 flex items-center gap-2">
              <Calculator className="size-5 text-[#A68A3F]" /> Property Details
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Property Price (AED) *</Label>
                <Input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. 2,000,000" />
              </div>
              <div>
                <Label>Annual Rental Income (AED) *</Label>
                <Input type="number" value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. 120,000" />
              </div>
              <div>
                <Label>Annual Service Charges (AED)</Label>
                <Input type="number" value={serviceCharges} onChange={(e) => setServiceCharges(e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. 12,000" />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6e] rounded-2xl p-6 text-white shadow-lg">
            <h2 className="font-serif text-lg font-medium mb-5 flex items-center gap-2">
              <TrendingUp className="size-5 text-[#C9A961]" /> Your Results
            </h2>

            {/* Net ROI — main result */}
            <div className="text-center py-6 mb-4 bg-white/5 rounded-xl">
              <div className="text-[10px] tracking-luxury uppercase text-[#C9A961] mb-2">Net Rental Yield (ROI)</div>
              <div className="font-serif text-5xl font-bold text-white">{netYield.toFixed(2)}%</div>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${rating.bg} ${rating.color}`}>
                {rating.label}
              </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-sm text-white/70">Gross Rental Yield</span>
                <span className="font-serif text-lg font-semibold">{grossYield.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-sm text-white/70">Annual Rent Income</span>
                <span className="font-semibold">AED {Number(annualRent || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-sm text-white/70">Service Charges</span>
                <span className="font-semibold text-red-300">- AED {Number(serviceCharges || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[#C9A961] font-medium">Net Annual Profit</span>
                <span className="font-serif text-xl font-bold text-[#C9A961]">AED {annualProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-border/60">
          <h3 className="font-serif text-lg font-medium text-[#0A1F44] mb-3 flex items-center gap-2">
            <Info className="size-4 text-[#A68A3F]" /> What is a good ROI?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Return on Investment (ROI) is influenced by various factors including budget, property type, and location. A desirable ROI in Dubai can be from 6 to 12% and will vary across different areas. To optimise your investment strategy, speak to one of our Royal Jubilant experts.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-red-50">
              <div className="text-xs font-medium text-red-600">Below 4%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Below Average</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-amber-50">
              <div className="text-xs font-medium text-amber-600">4 - 6%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Average</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50">
              <div className="text-xs font-medium text-blue-600">6 - 8%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Good</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50">
              <div className="text-xs font-medium text-green-600">8%+</div>
              <div className="text-[10px] text-muted-foreground mt-1">Excellent</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 bg-royal-gradient-diagonal rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-xl font-medium mb-2">Want to maximize your returns?</h3>
          <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">Our team of experts are here to help you find the ideal property to match your budget and investment goals.</p>
          <Button onClick={() => setActiveView("buy")} className="bg-[#C9A961] hover:bg-[#D4AF37] text-[#0A1F44] rounded-full font-semibold">
            Browse Investment Properties <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          *Please note that net ROI is an average estimate and may vary depending on property type, location, and applicable service charges.
        </p>
      </div>
    </div>
  );
}

// ─── Buy vs Rent Calculator ──────────────────────────────────────────
export function BuyVsRentCalculator() {
  const { setActiveView } = useStore();
  const [annualRent, setAnnualRent] = useState("90000");
  const [propertyPrice, setPropertyPrice] = useState("1500000");
  const [mortgageYears, setMortgageYears] = useState("25");
  const [priceGrowth, setPriceGrowth] = useState("5");
  const [rentGrowth, setRentGrowth] = useState("3");
  const [downPaymentPct, setDownPaymentPct] = useState("25");

  const results = useMemo(() => {
    const rent = Number(annualRent) || 0;
    const price = Number(propertyPrice) || 0;
    const years = Number(mortgageYears) || 25;
    const pGrowth = (Number(priceGrowth) || 0) / 100;
    const rGrowth = (Number(rentGrowth) || 0) / 100;
    const dpPct = (Number(downPaymentPct) || 25) / 100;

    const downPayment = price * dpPct;
    const loanAmount = price - downPayment;
    const annualRate = 0.0475; // 4.75% mortgage rate
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const monthlyMortgage = monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : loanAmount / months;
    const annualMortgage = monthlyMortgage * 12;

    // Calculate over the mortgage period
    let totalRentCost = 0;
    let totalBuyCost = 0;
    let propertyValue = price;
    let currentRent = rent;

    for (let y = 0; y < years; y++) {
      totalRentCost += currentRent;
      totalBuyCost += annualMortgage + price * 0.002; // 0.2% maintenance
      propertyValue *= (1 + pGrowth);
      currentRent *= (1 + rGrowth);
    }

    // Net buy cost = total costs - property value at end + down payment
    const netBuyCost = totalBuyCost + downPayment - propertyValue;
    const netRentCost = totalRentCost;
    const buyMonthly = annualMortgage / 12;
    const rentMonthly = rent / 12;
    const difference = netRentCost - netBuyCost;
    const buyingCheaper = netBuyCost < netRentCost;

    return {
      downPayment,
      loanAmount,
      monthlyMortgage,
      annualMortgage,
      totalRentCost,
      totalBuyCost,
      netBuyCost,
      netRentCost,
      propertyValue,
      buyMonthly,
      rentMonthly,
      difference: Math.abs(difference),
      buyingCheaper,
      years,
    };
  }, [annualRent, propertyPrice, mortgageYears, priceGrowth, rentGrowth, downPaymentPct]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-royal-gradient-diagonal text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <button onClick={() => setActiveView("home")} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#A68A3F] mb-5">
            <ArrowLeft className="size-3.5" /> Back to Home
          </button>
          <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mb-3">Investment Tools</div>
          <h1 className="h1 text-white">Buy vs Rent Calculator</h1>
          <p className="mt-4 body-lg text-white/70 max-w-2xl">
            If you're thinking about buying a property instead of continuing to rent, use our buy-to-rent calculator to help you determine which option is more beneficial for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input form */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm">
            <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-5 flex items-center gap-2">
              <Calculator className="size-5 text-[#A68A3F]" /> Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Annual Rent (AED) *</Label>
                <Input type="number" value={annualRent} onChange={(e) => setAnnualRent(e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. 90,000" />
              </div>
              <div>
                <Label>Property Price (AED) *</Label>
                <Input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. 1,500,000" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Down Payment (%)</Label>
                  <Input type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(e.target.value)} className="bg-[#F9FAFB]" placeholder="25" />
                </div>
                <div>
                  <Label>Mortgage Period (years)</Label>
                  <Input type="number" value={mortgageYears} onChange={(e) => setMortgageYears(e.target.value)} className="bg-[#F9FAFB]" placeholder="25" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Annual Price Growth (%)</Label>
                  <Input type="number" value={priceGrowth} onChange={(e) => setPriceGrowth(e.target.value)} className="bg-[#F9FAFB]" placeholder="5" />
                </div>
                <div>
                  <Label>Annual Rent Growth (%)</Label>
                  <Input type="number" value={rentGrowth} onChange={(e) => setRentGrowth(e.target.value)} className="bg-[#F9FAFB]" placeholder="3" />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main verdict */}
            <div className={`rounded-2xl p-6 text-white shadow-lg ${results.buyingCheaper ? "bg-gradient-to-br from-green-600 to-green-700" : "bg-gradient-to-br from-amber-600 to-orange-700"}`}>
              <div className="text-center">
                <div className="text-[10px] tracking-luxury uppercase text-white/70 mb-2">Verdict over {results.years} years</div>
                <div className="font-serif text-3xl font-bold mb-2">
                  {results.buyingCheaper ? "Buying is cheaper" : "Renting is cheaper"}
                </div>
                <div className="text-sm text-white/80">
                  by AED {results.difference.toLocaleString(undefined, { maximumFractionDigits: 0 })} over {results.years} years
                </div>
              </div>
            </div>

            {/* Monthly comparison */}
            <div className="bg-white rounded-2xl p-5 border border-border/60 shadow-sm">
              <h3 className="font-serif text-base font-medium text-[#0A1F44] mb-4">Monthly Cost Comparison</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 rounded-xl bg-[#0A1F44]/5">
                  <Home className="size-5 mx-auto text-[#0A1F44] mb-2" />
                  <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Buy Monthly</div>
                  <div className="font-serif text-xl font-bold text-[#0A1F44]">AED {results.buyMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#C9A961]/10">
                  <TrendingUp className="size-5 mx-auto text-[#A68A3F] mb-2" />
                  <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Rent Monthly</div>
                  <div className="font-serif text-xl font-bold text-[#0A1F44]">AED {results.rentMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="bg-white rounded-2xl p-5 border border-border/60 shadow-sm">
              <h3 className="font-serif text-base font-medium text-[#0A1F44] mb-4">Cost Breakdown over {results.years} years</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Down Payment</span>
                  <span className="font-semibold text-[#0A1F44]">AED {results.downPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Loan Amount</span>
                  <span className="font-semibold text-[#0A1F44]">AED {results.loanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Total Rent Cost</span>
                  <span className="font-semibold text-red-500">AED {results.totalRentCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Total Buy Cost</span>
                  <span className="font-semibold text-red-500">AED {results.totalBuyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Property Value at end</span>
                  <span className="font-semibold text-green-600">+ AED {results.propertyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[#A68A3F] font-medium">Net Buy Cost (after sale)</span>
                  <span className="font-serif text-lg font-bold text-[#0A1F44]">AED {results.netBuyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-royal-gradient-diagonal rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-xl font-medium mb-2">Still deciding?</h3>
          <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">Our property experts will connect you with our trusted mortgage partners to help you find the best mortgage rate for your home purchase.</p>
          <Button onClick={() => setActiveView("contact")} className="bg-[#C9A961] hover:bg-[#D4AF37] text-[#0A1F44] rounded-full font-semibold">
            Speak to a Specialist <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          *Calculator uses an estimated mortgage rate of 4.75% and 0.2% annual maintenance. Actual rates may vary. This tool is for guidance only.
        </p>
      </div>
    </div>
  );
}
