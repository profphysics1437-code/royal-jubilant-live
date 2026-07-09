"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, BedDouble, Bath, Maximize, Car, Eye, ShieldCheck, Phone, MessageCircle, Mail } from "lucide-react";
import { Property, formatPrice, getAgentById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface Props {
  property: Property;
  index?: number;
}

const statusLabels: Record<Property["status"], string> = {
  sale: "For Sale",
  rent: "For Rent",
  commercial: "Commercial",
  "off-plan": "Off-Plan",
};

export function PropertyCard({ property, index = 0 }: Props) {
  const openProperty = useStore((s) => s.openProperty);
  const openAgent = useStore((s) => s.openAgent);
  const toggleSaved = useStore((s) => s.toggleSavedProperty);
  const isSaved = useStore((s) => s.isSaved(property.id));
  // Use the agent info included from the API (DB properties), or fall back to mock data lookup
  const agent = (property as any).agent || getAgentById(property.agentId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] lift-on-hover cursor-pointer shadow-luxury"
      onClick={() => openProperty(property.id)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F5F7]">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover zoom-img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/50 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-[#C9A961] text-[#0A1F44] hover:bg-[#D4B875] font-medium tracking-wide shadow-sm">
            {statusLabels[property.status]}
          </Badge>
          {property.isLuxury && (
            <Badge className="bg-[#0A1F44]/90 text-white backdrop-blur-sm font-medium tracking-wide">
              Luxury Collection
            </Badge>
          )}
          {property.completionStatus === "Off-Plan" && (
            <Badge className="bg-white/95 text-[#0A1F44] font-medium backdrop-blur-sm border border-[#E5E7EB]">
              Off-Plan · {property.handoverYear}
            </Badge>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaved(property.id);
          }}
          aria-label="Save property"
          className="absolute top-3 right-3 size-10 rounded-full glass flex items-center justify-center hover:bg-white/95 transition-colors"
        >
          <Heart
            className={`size-4 transition-all ${
              isSaved ? "fill-[#C9A961] text-[#A68A3F]" : "text-[#0A1F44]"
            }`}
          />
        </button>

        {/* Reference + RERA permit */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-xs font-medium tracking-luxury uppercase glass-dark px-2.5 py-1 rounded-md">
            {property.reference}
          </span>
          {(property as any).reraNumber && (
            <span className="flex items-center gap-1 text-[10px] font-semibold glass-dark px-2 py-1 rounded-md text-[#C9A961]" title="RERA Permit Number">
              <ShieldCheck className="size-3" /> RERA {(property as any).reraNumber}
            </span>
          )}
        </div>
      </div>

      {/* Body — Dubizzle style: price prominent, inline specs, Marketed By footer */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-[#0A1F44] leading-none">
            {formatPrice(property.price, property.rentFrequency)}
          </span>
          {property.pricePerSqft && (
            <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">
              AED {property.pricePerSqft.toLocaleString()}/sqft
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-[#0A1F44] line-clamp-1 group-hover:text-[#A68A3F] transition-colors">
          {property.title}
        </h3>
        <p className="text-xs flex items-center gap-1 text-[#6B7280]">
          <MapPin className="size-3 text-[#9CA3AF] flex-shrink-0" />
          <span className="truncate">{property.community}{property.subCommunity ? ` · ${property.subCommunity}` : ""}</span>
        </p>
        <div className="flex items-center gap-3 pt-2 text-[#0A1F44] text-xs">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="size-3.5 text-[#9CA3AF]" />
              <span className="font-medium">{property.bedrooms}</span>
              <span className="text-[#9CA3AF]">Beds</span>
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="size-3.5 text-[#9CA3AF]" />
              <span className="font-medium">{property.bathrooms}</span>
              <span className="text-[#9CA3AF]">Baths</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="size-3.5 text-[#9CA3AF]" />
            <span className="font-medium">{property.area.toLocaleString()}</span>
            <span className="text-[#9CA3AF]">sqft</span>
          </span>
          {property.parking > 0 && (
            <span className="flex items-center gap-1">
              <Car className="size-3.5 text-[#9CA3AF]" />
              <span className="font-medium">{property.parking}</span>
            </span>
          )}
        </div>
        {agent && (
          <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); openAgent(agent.id); }}
              className="flex items-center gap-2 group/agent hover:opacity-80 transition-opacity text-left min-w-0"
            >
              <img src={agent.photo} alt={agent.name} className="size-7 rounded-full object-cover ring-1 ring-[#E5E7EB] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider leading-none">Marketed By</p>
                <p className="text-[11px] font-medium text-[#0A1F44] truncate leading-tight mt-0.5">{agent.name}</p>
              </div>
            </button>
            <div className="flex items-center gap-1 flex-shrink-0">
              {agent.phone && (
                <a href={`tel:${agent.phone.replace(/\s/g, "")}`} onClick={(e) => e.stopPropagation()} className="size-7 flex items-center justify-center rounded-md bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white transition-colors" title={`Call ${agent.name}`}><Phone className="size-3" /></a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`} target="_blank" onClick={(e) => e.stopPropagation()} className="size-7 flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors" title={`WhatsApp ${agent.name}`}><MessageCircle className="size-3" /></a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} onClick={(e) => e.stopPropagation()} className="size-7 flex items-center justify-center rounded-md bg-[#C9A961]/15 hover:bg-[#C9A961]/25 text-[#A68A3F] transition-colors" title={`Email ${agent.name}`}><Mail className="size-3" /></a>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function Spec({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#9CA3AF]">{icon}</span>
      <span className="text-xs font-semibold text-[#0A1F44] leading-none">{value}</span>
      <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{label}</span>
    </div>
  );
}
