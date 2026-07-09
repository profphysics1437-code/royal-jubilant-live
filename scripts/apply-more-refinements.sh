#!/bin/bash
# Apply remaining UI refinements
set -e
cd /home/z/my-project

echo "=== 4. Testimonials (9:16 portrait, 6-per-row) ==="
# Find and replace the testimonials grid section in Stats.tsx
python3 << 'PYEOF'
import re
with open('src/components/site/sections/Stats.tsx', 'r') as f:
    content = f.read()

old_grid = '''        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-7 border border-border/60 lift-on-hover relative"
            >
              <Quote className="absolute top-6 right-6 size-12 text-[#A68A3F]/15" />

              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} className={`size-4 ${n <= t.rating ? "fill-[#C9A961] text-[#A68A3F]" : "text-muted-foreground/30"}`} />
                ))}
              </div>

              <p className="text-base lg:text-lg text-[#0A1F44] leading-relaxed font-serif italic mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4 pt-5 border-t border-border/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="size-12 rounded-full object-cover border-2 border-[#C9A961]/30"
                />
                <div className="flex-1">
                  <div className="font-medium text-[#0A1F44]">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.role} · {t.location}
                  </div>
                </div>
                <span className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium text-right max-w-[120px]">
                  {t.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>'''

new_grid = '''        {/* 9:16 portrait cards — 6 per row on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mt-12">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col bg-white rounded-xl overflow-hidden border border-border/60 shadow-sm hover:shadow-xl transition-shadow"
              style={{ aspectRatio: '9 / 16' }}
            >
              <div className="bg-[#0A1F44] text-white p-3 flex flex-col items-center text-center">
                <img src={t.avatar} alt={t.name} className="size-12 rounded-full object-cover border-2 border-[#C9A961]/50 mb-2" />
                <div className="text-[13px] font-semibold leading-tight">{t.name}</div>
                <div className="text-[10px] text-[#C9A961] mt-0.5 uppercase tracking-wider">{t.role}</div>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} className={`size-2.5 ${n <= t.rating ? "fill-[#C9A961] text-[#A68A3F]" : "text-white/20"}`} />
                  ))}
                </div>
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between bg-white">
                <Quote className="size-5 text-[#A68A3F]/20 mb-1" />
                <p className="text-[13px] text-[#0A1F44] leading-snug font-serif italic flex-1">"{t.quote}"</p>
                <div className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/40">{t.location} · {t.service}</div>
              </div>
            </motion.div>
          ))}
        </div>'''

if old_grid in content:
    content = content.replace(old_grid, new_grid)
    # Also update Google review URL
    content = content.replace('https://www.google.com/search?q=Royal+Jubilant+Real+Estate+L.L.C+Reviews', 'https://g.page/r/CWwdHxw2Au2NEBM/review')
    with open('src/components/site/sections/Stats.tsx', 'w') as f:
        f.write(content)
    print("  ✓ Testimonials rebuilt (9:16 portrait, 6-per-row)")
else:
    print("  ! Testimonials pattern not found — may already be updated")
PYEOF

echo "=== 5. Footer RERA 28839 + DLD QR ==="
python3 << 'PYEOF'
with open('src/components/site/Footer.tsx', 'r') as f:
    content = f.read()
# Add RERA 28839
content = content.replace(
    '<div className="text-sm font-medium">RERA Certified</div>',
    '<div className="text-sm font-medium">RERA Certified · License #28839</div>'
)
# Add DLD QR before "Back to top" button
old_btn = '''          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs tracking-luxury uppercase text-white/60 hover:text-[#C9A961] transition-colors"
          >
            Back to top <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>'''
new_btn = '''          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white p-1.5 rounded-lg">
                <img src="/dld-qr.png" alt="DLD QR Code" className="w-16 h-16 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <span className="text-[9px] text-white/50 uppercase tracking-wider">Scan DLD</span>
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xs tracking-luxury uppercase text-white/60 hover:text-[#C9A961] transition-colors"
            >
              Back to top <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>'''
if old_btn in content:
    content = content.replace(old_btn, new_btn)
    with open('src/components/site/Footer.tsx', 'w') as f:
        f.write(content)
    print("  ✓ Footer updated (RERA 28839 + DLD QR)")
else:
    print("  ! Footer pattern not found — may already be updated")
PYEOF

# Generate DLD QR code
python3 -c "
import qrcode
qr = qrcode.QRCode(version=1, box_size=10, border=2, error_correction=qrcode.constants.ERROR_CORRECT_L)
qr.add_data('https://www.royaljubilant.com')
qr.make(fit=True)
img = qr.make_image(fill_color='black', back_color='white')
img.save('public/dld-qr.png')
print('  ✓ DLD QR code generated')
" 2>&1

echo "=== 6. Navbar — remove icons, remove Commercial submenu ==="
python3 << 'PYEOF'
with open('src/components/site/Navbar.tsx', 'r') as f:
    content = f.read()

# Remove icon: "X" from all menu items
import re
content = re.sub(r'\n    icon: "[^"]+",', '', content)

# Replace Commercial submenu with single link
old_commercial = '''  {
    label: "Commercial",
    view: null,
    url: "",
    children: [
      { label: "Commercial Property for Rent", desc: "Offices, retail & warehouses for lease", view: "commercial-rent", url: "" },
      { label: "Commercial Property for Sale", desc: "Buy offices, buildings & industrial units", view: "commercial-sale", url: "" },
    ],
  },'''
new_commercial = '''  {
    label: "Commercial",
    view: "commercial",
    url: "",
    children: [],
  },'''
if old_commercial in content:
    content = content.replace(old_commercial, new_commercial)

# Update Our Story link
content = content.replace(
    '{ label: "Our Story", desc: "Our story, leadership & ethos", view: "about", url: "" }',
    '{ label: "Our Story", desc: "Our story, leadership & ethos", view: "story", url: "" }'
)
# Add AI Powered Real Estate to More submenu
content = content.replace(
    '{ label: "Communities", desc: "Browse Dubai neighbourhoods", view: "communities", url: "" }',
    '{ label: "AI Powered Real Estate", desc: "Meet RJ AI — your 24/7 concierge", view: "ai-powered", url: "" },\n      { label: "Communities", desc: "Browse Dubai neighbourhoods", view: "communities", url: "" }'
)

# Remove icon rendering from desktop nav
content = content.replace('const IconComp = resolveIcon(item.icon);\n                ', '')
content = content.replace('{IconComp && <IconComp className="size-3.5" />}\n                      ', '')

with open('src/components/site/Navbar.tsx', 'w') as f:
    f.write(content)
print("  ✓ Navbar updated (no icons, no Commercial submenu, Our Story + AI Powered links)")
PYEOF

echo "=== 7. Commercial view heading ==="
sed -i 's|title: "Commercial Real Estate"|title: "Commercial Properties"|' src/components/site/views/PropertyListView.tsx
echo "  ✓ Commercial heading fixed"

echo "=== 8. ExploreProperty — Rooms for Rent ==="
python3 << 'PYEOF'
with open('src/components/site/sections/ExploreProperty.tsx', 'r') as f:
    content = f.read()
content = content.replace(
    '''    title: "Property Management",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    view: "contact",
    countKey: null,''',
    '''    title: "Rooms for Rent",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    view: "rent-rooms",
    countKey: "rentRooms" as const,'''
)
with open('src/components/site/sections/ExploreProperty.tsx', 'w') as f:
    f.write(content)
print("  ✓ ExploreProperty updated (Rooms for Rent)")
PYEOF

echo "=== DONE ==="
