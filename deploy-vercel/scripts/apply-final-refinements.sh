#!/bin/bash
set -e
cd /home/z/my-project

echo "=== 9. PropertyCard (Dubizzle-style with Marketed By) ==="
python3 << 'PYEOF'
with open('src/components/site/PropertyCard.tsx', 'r') as f:
    content = f.read()

old_body = '''      {/* Body */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="h3 text-[#0A1F44] line-clamp-1 group-hover:text-[#A68A3F] transition-colors">
              {property.title}
            </h3>
            <p className="body-sm flex items-center gap-1 text-[#6B7280] mt-1.5">
              <MapPin className="size-3 text-[#9CA3AF]" />
              <span className="truncate">{property.community}{property.subCommunity ? ` · ${property.subCommunity}` : ""}</span>
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="price-text text-xl text-[#0A1F44]">
            {formatPrice(property.price, property.rentFrequency)}
          </span>
          {property.pricePerSqft && (
            <span className="caption text-[#9CA3AF]">
              AED {property.pricePerSqft.toLocaleString()}/sqft
            </span>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#E5E7EB] text-[#0A1F44]">
          {property.bedrooms > 0 && (
            <Spec icon={<BedDouble className="size-3.5" />} value={property.bedrooms} label="Beds" />
          )}
          {property.bathrooms > 0 && (
            <Spec icon={<Bath className="size-3.5" />} value={property.bathrooms} label="Baths" />
          )}
          <Spec icon={<Maximize className="size-3.5" />} value={property.area.toLocaleString()} label="sqft" />
          {property.parking > 0 && (
            <Spec icon={<Car className="size-3.5" />} value={property.parking} label="Park" />
          )}
        </div>

        {/* Agent section — photo + name + direct contact buttons */}
        {agent && (
          <div className="pt-3 border-t border-[#E5E7EB]">
            {/* Agent photo + name (click to view full profile) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openAgent(agent.id);
              }}
              className="w-full flex items-center gap-2.5 group/agent hover:opacity-80 transition-opacity text-left mb-2.5"
            >
              <img src={agent.photo} alt={agent.name} className="size-9 rounded-full object-cover ring-1 ring-[#E5E7EB]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#0A1F44] truncate">{agent.name}</p>
                <p className="text-[10px] text-[#6B7280] truncate">{agent.title}</p>
              </div>
            </button>
            {/* Direct contact buttons — client can call/WhatsApp/email instantly */}
            <div className="flex items-center gap-1.5">
              {agent.phone && (
                <a
                  href={`tel:${agent.phone.replace(/\\s/g, "")}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white text-[10px] font-medium transition-colors"
                  title={`Call ${agent.name}`}
                >
                  <Phone className="size-3" /> Call
                </a>
              )}
              {agent.whatsapp && (
                <a
                  href={`https://wa.me/${agent.whatsapp.replace(/\\D/g, "")}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-medium transition-colors"
                  title={`WhatsApp ${agent.name}`}
                >
                  <MessageCircle className="size-3" /> WhatsApp
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="size-7 flex items-center justify-center rounded-lg bg-[#C9A961]/15 hover:bg-[#C9A961]/25 text-[#A68A3F] transition-colors"
                  title={`Email ${agent.name}`}
                >
                  <Mail className="size-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}'''

new_body = '''      {/* Body — Dubizzle style: price prominent, inline specs, Marketed By footer */}
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
                <a href={`tel:${agent.phone.replace(/\\s/g, "")}`} onClick={(e) => e.stopPropagation()} className="size-7 flex items-center justify-center rounded-md bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white transition-colors" title={`Call ${agent.name}`}><Phone className="size-3" /></a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp.replace(/\\D/g, "")}`} target="_blank" onClick={(e) => e.stopPropagation()} className="size-7 flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors" title={`WhatsApp ${agent.name}`}><MessageCircle className="size-3" /></a>
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
}'''

if old_body in content:
    content = content.replace(old_body, new_body)
    with open('src/components/site/PropertyCard.tsx', 'w') as f:
        f.write(content)
    print("  ✓ PropertyCard updated (Dubizzle-style with Marketed By)")
else:
    print("  ! PropertyCard pattern not found")
PYEOF

echo "=== 10. PropertyDetailModal (gallery thumbnails below + lightbox) ==="
python3 << 'PYEOF'
with open('src/components/site/modals/PropertyDetailModal.tsx', 'r') as f:
    content = f.read()

# Add Maximize2 to imports
content = content.replace('  Maximize,\n  Car,', '  Maximize,\n  Maximize2,\n  Car,')

# Add lightboxOpen state
content = content.replace(
    'const [activeImg, setActiveImg] = useState(0);\n  const [showShare, setShowShare] = useState(false);',
    'const [activeImg, setActiveImg] = useState(0);\n  const [lightboxOpen, setLightboxOpen] = useState(false);\n  const [showShare, setShowShare] = useState(false);'
)

# Replace gallery section
old_gallery = '''              {/* Gallery */}
              <div className="relative aspect-[16/10] lg:aspect-[16/8] bg-muted overflow-hidden">
                <img
                  src={property.images[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {property.images.length > 1 && (
                  <>
                    <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 size-11 rounded-full glass flex items-center justify-center hover:bg-white/95 transition-colors">
                      <ChevronLeft className="size-5" />
                    </button>
                    <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 size-11 rounded-full glass flex items-center justify-center hover:bg-white/95 transition-colors">
                      <ChevronRight className="size-5" />
                    </button>

                    {/* Thumbnails */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {property.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImg(i)}
                          className={`size-14 rounded-md overflow-hidden border-2 transition-all ${
                            i === activeImg ? "border-[#C9A961] scale-110" : "border-white/60"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <Badge className="bg-[#C9A961] text-[#0A1F44] hover:bg-[#A68A3F] font-medium w-fit">
                    {property.status === "sale" ? "For Sale" : property.status === "rent" ? "For Rent" : property.status === "off-plan" ? "Off-Plan" : "Commercial"}
                  </Badge>
                  {property.isLuxury && (
                    <Badge className="bg-[#0A1F44] text-white backdrop-blur-sm w-fit">Luxury Collection</Badge>
                  )}
                </div>
              </div>'''

new_gallery = '''              {/* Gallery — main image + thumbnails below */}
              <div className="bg-muted">
                <div className="relative aspect-[16/10] lg:aspect-[16/8] overflow-hidden cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
                  <img src={property.images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
                  {property.images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 size-11 rounded-full glass flex items-center justify-center hover:bg-white/95 transition-colors"><ChevronLeft className="size-5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 size-11 rounded-full glass flex items-center justify-center hover:bg-white/95 transition-colors"><ChevronRight className="size-5" /></button>
                    </>
                  )}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <Badge className="bg-[#C9A961] text-[#0A1F44] hover:bg-[#A68A3F] font-medium w-fit">
                      {property.status === "sale" ? "For Sale" : property.status === "rent" ? "For Rent" : property.status === "off-plan" ? "Off-Plan" : "Commercial"}
                    </Badge>
                    {property.isLuxury && <Badge className="bg-[#0A1F44] text-white backdrop-blur-sm w-fit">Luxury Collection</Badge>}
                  </div>
                  <div className="absolute bottom-4 right-4 glass px-2.5 py-1 rounded-md text-xs text-white flex items-center gap-1"><Maximize2 className="size-3" /> Click to zoom</div>
                </div>
                {property.images.length > 1 && (
                  <div className="flex items-center gap-2 p-3 overflow-x-auto bg-[#0A1F44]/5">
                    {property.images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#C9A961] scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lightbox */}
              {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
                  <button className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20" onClick={() => setLightboxOpen(false)}><X className="size-5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronLeft className="size-6" /></button>
                  <img src={property.images[activeImg]} alt={property.title} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronRight className="size-6" /></button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">{activeImg + 1} / {property.images.length}</div>
                </div>
              )}'''

if old_gallery in content:
    content = content.replace(old_gallery, new_gallery)
    with open('src/components/site/modals/PropertyDetailModal.tsx', 'w') as f:
        f.write(content)
    print("  ✓ PropertyDetailModal updated (gallery + lightbox)")
else:
    print("  ! PropertyDetailModal gallery pattern not found")
PYEOF

echo "=== 11. AboutView MD portrait ==="
python3 << 'PYEOF'
with open('src/components/site/views/MiscViews.tsx', 'r') as f:
    content = f.read()

old_about = '''      <div className="container mx-auto px-4 lg:px-6 py-16 max-w-5xl">
        <div className="prose prose-lg max-w-none">'''

new_about = '''      <div className="container mx-auto px-4 lg:px-6 py-16 max-w-5xl">
        {/* MD Portrait Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 mb-16 items-center">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-[#C9A961]/20 to-transparent rounded-2xl" />
              <img
                src="/team/muhammad-javed-zafar.webp"
                alt="Muhammad Javed Zafar — Managing Director"
                className="relative w-full aspect-[3/4] object-cover rounded-2xl shadow-xl border border-[#C9A961]/30"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'; }}
              />
              <div className="absolute -bottom-4 -right-4 bg-[#0A1F44] text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="text-[9px] uppercase tracking-wider text-[#C9A961]">Managing Director</div>
                <div className="text-sm font-serif">M. Javed Zafar</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] mb-3">A Message from our MD</div>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#0A1F44] mb-6 leading-tight">
              "Real estate is not about properties.<br />It's about people."
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              When I founded Royal Jubilant, I wanted to build something different — a brokerage where every client feels like our only client. In a market as dynamic as Dubai, that means combining deep local knowledge with genuine, personal care.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Our team of RERA-certified advisors doesn't just close transactions. We build relationships that span years and multiple moves — guiding first-time buyers, growing families, and seasoned investors with the same level of attention and integrity.
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border/60">
              <div>
                <div className="font-serif text-lg text-[#0A1F44]">Muhammad Javed Zafar</div>
                <div className="text-xs text-muted-foreground">Founder & Managing Director · Royal Jubilant Real Estate LLC</div>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">'''

if old_about in content:
    content = content.replace(old_about, new_about)
    with open('src/components/site/views/MiscViews.tsx', 'w') as f:
        f.write(content)
    print("  ✓ AboutView updated (MD portrait)")
else:
    print("  ! AboutView pattern not found")
PYEOF

echo "=== 12. page.tsx — wire views + AIChatWidget ==="
python3 << 'PYEOF'
with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    'import { RentalYieldCalculator, BuyVsRentCalculator } from "@/components/site/views/CalculatorViews";',
    'import { RentalYieldCalculator, BuyVsRentCalculator } from "@/components/site/views/CalculatorViews";\nimport { StoryView } from "@/components/site/views/StoryView";\nimport { AIPoweredView } from "@/components/site/views/AIPoweredView";\nimport AIChatWidget from "@/components/ai/AIChatWidget";'
)

# Reorder homepage sections (LatestProperties before Agents)
content = content.replace(
    '''            <Hero />
            <ExploreProperty />
            <Agents />
            <VideoSection />
            <LatestProperties />
            <Testimonials />
            <InvestmentCTA />
            <Newsletter />''',
    '''            <Hero />
            <ExploreProperty />
            <VideoSection />
            <LatestProperties />
            <Agents />
            <Testimonials />
            <InvestmentCTA />
            <Newsletter />'''
)

# Add view switches
content = content.replace(
    '        {activeView === "advice" && <AdviceView />}\n      </main>',
    '        {activeView === "advice" && <AdviceView />}\n        {activeView === "story" && <StoryView />}\n        {activeView === "ai-powered" && <AIPoweredView />}\n      </main>'
)

# Add AIChatWidget
content = content.replace(
    '      <DashboardModal />\n    </div>\n  );\n}',
    '      <DashboardModal />\n\n      {/* RJ AI Concierge Widget */}\n      <AIChatWidget />\n    </div>\n  );\n}'
)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
print("  ✓ page.tsx updated (views wired + AIChatWidget)")
PYEOF

echo "=== 13. Admin sidebar — add Story & AI Robot Control ==="
python3 << 'PYEOF'
with open('src/app/admin/layout.tsx', 'r') as f:
    content = f.read()
content = content.replace(
    '''  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/videos", label: "Advisor Videos", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },''',
    '''  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/videos", label: "Advisor Videos", icon: Newspaper },
  { href: "/admin/story", label: "Story & Events", icon: Calendar, badge: "NEW" },
  { href: "/admin/ai-robot", label: "AI Robot Control", icon: ShieldCheck, badge: "AI" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },'''
)
with open('src/app/admin/layout.tsx', 'w') as f:
    f.write(content)
print("  ✓ Admin sidebar updated")
PYEOF

echo "=== 14. Admin + Agent AI panels ==="
python3 << 'PYEOF'
# Admin page
with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()
if 'AdminAIInsights' not in content:
    content = content.replace(
        'import { AdminPageHeader, AdminStat, AdminCard, AdminTable, StatusBadge, EmptyRow } from "@/components/admin/AdminUI";',
        'import { AdminPageHeader, AdminStat, AdminCard, AdminTable, StatusBadge, EmptyRow } from "@/components/admin/AdminUI";\nimport AdminAIInsights from "@/components/ai/AdminAIInsights";'
    )
    content = content.replace(
        '''          </AdminCard>
        </div>
      </div>
    </div>
  );
}''',
        '''          </AdminCard>
        </div>
      </div>

      <AdminAIInsights />
    </div>
  );
}'''
    )
    with open('src/app/admin/page.tsx', 'w') as f:
        f.write(content)
    print("  ✓ Admin AI Insights panel added")
else:
    print("  ! Admin AI Insights already present")

# Agent page
with open('src/app/agent/page.tsx', 'r') as f:
    content = f.read()
if 'AgentAIAssistant' not in content:
    content = content.replace(
        'import { formatPrice } from "@/lib/data";',
        'import { formatPrice } from "@/lib/data";\nimport AgentAIAssistant from "@/components/ai/AgentAIAssistant";'
    )
    content = content.replace(
        '''          </div>
        </AdminCard>
      )}
    </div>
  );
}''',
        '''          </div>
        </AdminCard>
      )}

      <AgentAIAssistant />
    </div>
  );
}'''
    )
    with open('src/app/agent/page.tsx', 'w') as f:
        f.write(content)
    print("  ✓ Agent AI Assistant panel added")
else:
    print("  ! Agent AI Assistant already present")
PYEOF

echo "=== DONE ==="
