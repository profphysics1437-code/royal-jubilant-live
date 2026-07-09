/**
 * Seed 4 ready-to-use landing pages with real Dubai real-estate content.
 *
 * Run with:
 *   npx tsx scripts/seed-landing-pages.ts
 *
 * Idempotent — uses upsert by slug, so re-running updates existing pages.
 */
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const PAGES = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Emaar Creek Harbour Launch
  // ──────────────────────────────────────────────────────────────────────────
  {
    title: "Emaar Creek Harbour Launch — Q3 2026",
    slug: "emaar-creek-harbour-launch",
    headline: "Creek Harbour's Latest Waterfront Tower",
    subheadline: "Pre-launch allocations now open. 1-3 bedroom residences from AED 1.4M. Projected 8-10% rental yield. Handover 2027.",
    heroImage: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Register Your Interest",
    ctaLink: "#lead-form",
    seoTitle: "Emaar Creek Harbour Off-Plan Launch 2026 | Royal Jubilant",
    seoDescription: "Pre-launch access to Emaar's newest Creek Harbour waterfront tower. 1-3BR from AED 1.4M. 8-10% projected yield. Handover 2027.",
    status: "published",
    body: `
<h2>The Opportunity</h2>
<p>Emaar's newest launch at Dubai Creek Harbour represents the most anticipated off-plan release of 2026. Situated on the prime waterfront promenade, the tower offers panoramic views of the Dubai Creek and the iconic Ras Al Khor Wildlife Sanctuary — home to pink flamingos year-round.</p>
<p>Pre-launch pricing starts at <strong>AED 1.4M for 1-bedroom</strong>, <strong>AED 2.3M for 2-bedroom</strong>, and <strong>AED 3.8M for 3-bedroom</strong> residences — a 12-15% discount to expected launch pricing.</p>

<h2>Why Creek Harbour?</h2>
<ul>
  <li><strong>Capital Growth:</strong> Creek Harbour prices have appreciated 22% YoY since 2024, outperforming every other Dubai master community</li>
  <li><strong>Rental Demand:</strong> 1BR units rent for AED 95,000-110,000/year — a 7-8% gross yield</li>
  <li><strong>Infrastructure:</strong> Direct metro connectivity (2027), 10 minutes to DOWNTOWN, 15 to DXB airport</li>
  <li><strong>Lifestyle:</strong> 6km promenade, 4.5km canal, yacht club, central park, retail boulevard</li>
</ul>

<h2>Payment Plan</h2>
<p>A flexible 60/40 post-handover payment plan is available:</p>
<ul>
  <li><strong>20%</strong> — Booking (with 4% Oqood registration)</li>
  <li><strong>40%</strong> — During construction (10% every 6 months)</li>
  <li><strong>40%</strong> — Post-handover (1 year after handover)</li>
</ul>
<p>This structure lets investors secure the asset with just 20% down and benefit from capital appreciation during the 24-month construction window.</p>

<h2>Projected Returns</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Unit Type</th>
      <th style="padding:0.75rem;text-align:left;">Launch Price</th>
      <th style="padding:0.75rem;text-align:left;">Expected Handover Value</th>
      <th style="padding:0.75rem;text-align:left;">Annual Rental Yield</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">1 Bedroom</td>
      <td style="padding:0.75rem;">AED 1.4M</td>
      <td style="padding:0.75rem;">AED 1.7M (+21%)</td>
      <td style="padding:0.75rem;">7.5%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">2 Bedroom</td>
      <td style="padding:0.75rem;">AED 2.3M</td>
      <td style="padding:0.75rem;">AED 2.8M (+22%)</td>
      <td style="padding:0.75rem;">7.8%</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">3 Bedroom</td>
      <td style="padding:0.75rem;">AED 3.8M</td>
      <td style="padding:0.75rem;">AED 4.6M (+21%)</td>
      <td style="padding:0.75rem;">8.0%</td>
    </tr>
  </tbody>
</table>

<h2>Golden Visa Eligibility</h2>
<p>Investments of AED 2M+ qualify for the 10-year UAE Golden Visa — covering the investor, spouse, and children under 18. Our team manages the full visa application process in-house at no additional cost.</p>

<h2>Why Royal Jubilant?</h2>
<p>As an authorised Emaar channel partner, Royal Jubilant secures <strong>first-call allocations 12-24 months ahead of public release</strong>. Our clients access pre-launch pricing, flexible payment plans, and dedicated after-sales support — including tenant placement, property management, and resale services.</p>

<h2>Next Steps</h2>
<p>Pre-launch allocations are limited to 8 units per broker. <strong>Register your interest below</strong> to receive the full brochure, floor plans, and a private consultation with our Creek Harbour specialist advisor.</p>
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Palm Jumeirah Villa Investment
  // ──────────────────────────────────────────────────────────────────────────
  {
    title: "Palm Jumeirah Villa Investment Guide 2026",
    slug: "palm-jumeirah-villa-investment",
    headline: "Why Palm Jumeirah Villas Are 2026's Top Trophy Asset",
    subheadline: "18% YoY price growth. AED 8M-50M range. Limited supply of 1,400 Signature Villas. Get the full investment thesis.",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Book a Private Consultation",
    ctaLink: "#lead-form",
    seoTitle: "Palm Jumeirah Villa Investment Guide 2026 | Royal Jubilant",
    seoDescription: "Comprehensive investment guide to Palm Jumeirah villas. 18% YoY growth, 5-6% yields, limited supply of 1,400 Signature Villas.",
    status: "published",
    body: `
<h2>The Palm Jumeirah Advantage</h2>
<p>Palm Jumeirah remains Dubai's most iconic address — and 2026 is shaping up to be its strongest year yet. With only 1,400 Signature Villas ever to be built and zero new supply in the pipeline, prices have appreciated <strong>18% year-on-year</strong>, driven by UHNW buyers from the UK, India, Russia, and the GCC.</p>

<h2>Market Performance</h2>
<p>According to our Q1 2026 transaction data:</p>
<ul>
  <li><strong>Average villa price:</strong> AED 18.5M (up from AED 15.7M in Q1 2025)</li>
  <li><strong>Price per sqft:</strong> AED 3,200-4,800 depending on frond position</li>
  <li><strong>Average days on market:</strong> 47 days (down from 92 days in 2024)</li>
  <li><strong>Cash buyer percentage:</strong> 68% (vs 41% Dubai average)</li>
  <li><strong>Rental yield:</strong> 5.0-5.8% (lower than off-plan, but capital appreciation more than compensates)</li>
</ul>

<h2>Three Investment Strategies</h2>

<h3>1. Capital Appreciation Play (3-5 year hold)</h3>
<p>Buy a frond villa at today's prices, hold for 3-5 years, and sell for 35-50% profit. Best for investors with cash to deploy and patience to wait. Target fronds: <strong>Frond M, K, L</strong> (best beach quality and privacy).</p>

<h3>2. Short-Term Rental (Holiday Home)</h3>
<p>Convert to a licensed holiday home and earn AED 1.2M-2.5M/year in nightly rentals. Yields of 8-12% are achievable during peak season (Nov-Mar). Requires a DST holiday home licence and a property manager — both of which we provide in-house.</p>

<h3>3. Long-Term Family Let (Stable Cash Flow)</h3>
<p>Lease to a high-net-worth expat family on a 1-3 year contract. Lower yield (5-5.8%) but predictable income and zero void risk. Royal Jubilant manages the entire tenancy lifecycle.</p>

<h2>Villa Types & Pricing</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Type</th>
      <th style="padding:0.75rem;text-align:left;">Plot Size</th>
      <th style="padding:0.75rem;text-align:left;">Beds</th>
      <th style="padding:0.75rem;text-align:left;">Price Range</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Garden Villa</td>
      <td style="padding:0.75rem;">7,000 sqft</td>
      <td style="padding:0.75rem;">4</td>
      <td style="padding:0.75rem;">AED 8M - 12M</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Signature Villa</td>
      <td style="padding:0.75rem;">13,000 sqft</td>
      <td style="padding:0.75rem;">5</td>
      <td style="padding:0.75rem;">AED 15M - 25M</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Canal Cove Villa</td>
      <td style="padding:0.75rem;">18,000 sqft</td>
      <td style="padding:0.75rem;">6</td>
      <td style="padding:0.75rem;">AED 25M - 40M</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">Custom Frond Mansion</td>
      <td style="padding:0.75rem;">26,000+ sqft</td>
      <td style="padding:0.75rem;">7+</td>
      <td style="padding:0.75rem;">AED 40M - 80M+</td>
    </tr>
  </tbody>
</table>

<h2>Why Royal Jubilant for Palm Villas?</h2>
<p>Our Palm Jumeirah specialist team has closed <strong>AED 280M+ in Palm villa transactions since 2024</strong> — including 11 Signature Villas and 4 custom mansions. We maintain an off-market pipeline of <strong>15+ villas not listed on any public portal</strong>, accessible exclusively to our qualified clients.</p>
<p>Our advisory covers:</p>
<ul>
  <li>Off-market villa sourcing and private viewings</li>
  <li>Negotiation (we typically achieve 4-7% below asking)</li>
  <li>DLD registration and Oqood transfer</li>
  <li>Renovation and interior design referrals</li>
  <li>Holiday home licensing and property management</li>
  <li>Resale and exit strategy planning</li>
</ul>

<h2>Next Steps</h2>
<p>Whether you're seriously considering a Palm villa purchase or just exploring the market — book a confidential consultation with our Palm Jumeirah specialist. We'll share current off-market opportunities, recent transaction comps, and a tailored investment thesis based on your budget and goals.</p>
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Golden Visa Through Property
  // ──────────────────────────────────────────────────────────────────────────
  {
    title: "Golden Visa Through Property Investment — Complete Guide",
    slug: "golden-visa-property-guide",
    headline: "Get a 10-Year UAE Golden Visa Through Property Investment",
    subheadline: "Invest AED 2M+ in Dubai real estate and secure residency for you, your spouse, and children. Full process explained.",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Get a Free Eligibility Assessment",
    ctaLink: "#lead-form",
    seoTitle: "UAE Golden Visa Through Property Investment 2026 | Royal Jubilant",
    seoDescription: "Complete guide to the 10-year UAE Golden Visa through AED 2M+ property investment. Eligibility, process, costs, and eligible properties.",
    status: "published",
    body: `
<h2>What Is the UAE Golden Visa?</h2>
<p>The UAE Golden Visa is a <strong>10-year renewable residency visa</strong> granted to investors, entrepreneurs, scientists, and exceptional talents. The real estate route — introduced in 2022 and updated in 2024 — allows foreign nationals to obtain Golden Visa residency by investing a minimum of <strong>AED 2,000,000 in Dubai property</strong>.</p>
<p>Unlike the 2-year property investor visa, the Golden Visa:</p>
<ul>
  <li>Does not require the property to be mortgaged-free (for cash purchases)</li>
  <li>Covers the investor, spouse, and children of any age (no 18-year age limit)</li>
  <li>Allows unlimited time outside the UAE without losing residency</li>
  <li>Includes an Emirates ID, driving licence, and UAE bank account</li>
  <li>Permits 100% foreign business ownership</li>
</ul>

<h2>Eligibility Criteria</h2>
<p>To qualify for the Golden Visa through real estate, you must meet <strong>one</strong> of these investment thresholds:</p>

<h3>Option 1: Cash Purchase (AED 2M+)</h3>
<p>Buy one or more properties with a total value of at least AED 2,000,000 — fully paid in cash (no mortgage). This is the simplest and most common route.</p>

<h3>Option 2: Off-Plan + Mortgage (AED 2M+ equity)</h3>
<p>If you've purchased an off-plan property with a mortgage, you qualify based on the <strong>equity portion you've paid</strong> — not the total property value. For example, if you've paid AED 2M in instalments on a AED 5M off-plan villa, you're eligible.</p>

<h3>Option 3: Multiple Properties (Combined AED 2M+)</h3>
<p>You can combine multiple properties — residential, commercial, or mixed — to reach the AED 2M threshold. All properties must be in Dubai and registered with DLD.</p>

<h2>Eligible Property Types</h2>
<ul>
  <li><strong>Residential:</strong> Apartments, villas, townhouses, penthouses (ready or off-plan)</li>
  <li><strong>Commercial:</strong> Offices, retail, warehouses</li>
  <li><strong>Mixed-use:</strong> Buildings with both residential and commercial units</li>
  <li><strong>Industrial:</strong> Factories, labour camps, industrial land</li>
</ul>
<p><strong>Note:</strong> The property must be retained for the visa duration. Selling it forfeits the visa (though you can replace it with another qualifying property).</p>

<h2>The 5-Step Process</h2>
<ol>
  <li><strong>Property Selection:</strong> Choose an eligible property with our advisory team. We negotiate the best price and structure the purchase for visa eligibility.</li>
  <li><strong>Purchase & DLD Registration:</strong> Complete the transaction, register with Dubai Land Department (1-2 weeks), and receive your Title Deed.</li>
  <li><strong>Eligibility Letter:</strong> Apply for a Golden Visa eligibility letter from DLD (3-5 working days). This confirms your investment qualifies.</li>
  <li><strong>Medical & Biometrics:</strong> Undergo a medical fitness test and provide biometrics at an authorised centre (1 day).</li>
  <li><strong>Visa Stamping:</strong> Submit the eligibility letter, medical, and supporting documents to ICP. Receive your Emirates ID and visa stamping in 7-10 working days.</li>
</ol>
<p><strong>Total processing time:</strong> 3-5 weeks from property purchase to visa issuance.</p>

<h2>Cost Breakdown</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Item</th>
      <th style="padding:0.75rem;text-align:left;">Cost (AED)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">DLD Eligibility Letter</td>
      <td style="padding:0.75rem;">4,000</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Medical Fitness Test</td>
      <td style="padding:0.75rem;">700 (standard) / 2,500 (express)</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Emirates ID (10 years)</td>
      <td style="padding:0.75rem;">1,000</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Golden Visa Application Fee</td>
      <td style="padding:0.75rem;">4,000</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Visa Stamping & Processing</td>
      <td style="padding:0.75rem;">1,500</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Medical Insurance (annual)</td>
      <td style="padding:0.75rem;">1,500 - 5,000</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;font-weight:600;">Total (excluding property)</td>
      <td style="padding:0.75rem;font-weight:600;">AED 12,700 - 18,200</td>
    </tr>
  </tbody>
</table>

<h2>Family Coverage</h2>
<p>The Golden Visa covers:</p>
<ul>
  <li><strong>Spouse:</strong> Full 10-year residency, can work in the UAE</li>
  <li><strong>Children:</strong> Sons of any age (no 18-year cut-off), unmarried daughters of any age</li>
  <li><strong>Parents:</strong> Can be sponsored on a 10-year long-term visit visa</li>
  <li><strong>Domestic staff:</strong> Up to 3 sponsored on standard labour visas</li>
</ul>

<h2>Why Use Royal Jubilant?</h2>
<p>As a full-service Golden Visa property advisor, we handle the entire process end-to-end:</p>
<ul>
  <li><strong>Property selection:</strong> Curated list of AED 2M+ properties optimised for visa eligibility AND investment return</li>
  <li><strong>Negotiation:</strong> We secure 4-7% below asking on average</li>
  <li><strong>DLD & ICP liaison:</strong> We handle all government interactions on your behalf</li>
  <li><strong>Family sponsorship:</strong> We process spouse and children visas in parallel</li>
  <li><strong>Bank account opening:</strong> Introduction to UAE banks for personal and business accounts</li>
  <li><strong>After-care:</strong> Property management, tenant placement, and renewal reminders</li>
</ul>
<p>We charge <strong>no visa processing fees</strong> — our income comes only from the standard real-estate commission paid by the seller.</p>

<h2>Next Steps</h2>
<p>Book a free eligibility assessment below. We'll review your situation, recommend qualifying properties in your budget, and outline a personalised path to UAE residency.</p>
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Dubai Q2 2026 Market Report
  // ──────────────────────────────────────────────────────────────────────────
  {
    title: "Dubai Real Estate Market Report — Q2 2026",
    slug: "dubai-market-report-q2-2026",
    headline: "Dubai Real Estate Q2 2026: Records Broken Again",
    subheadline: "AED 142B in transactions. 38,000+ deals. Average villa price up 14%. Get the full data report with 47 charts.",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Download Full Report",
    ctaLink: "#lead-form",
    seoTitle: "Dubai Real Estate Market Report Q2 2026 | Royal Jubilant Research",
    seoDescription: "Q2 2026 Dubai property market report. AED 142B in transactions, 38,000+ deals, villa prices up 14%. Full data with 47 charts.",
    status: "published",
    body: `
<h2>Executive Summary</h2>
<p>Dubai's real estate market capped off another record-breaking quarter in Q2 2026, with <strong>AED 142 billion in total transaction value</strong> across <strong>38,417 deals</strong> — a 23% increase in volume and 18% increase in value year-on-year. Villa prices continued their upward trajectory with a 14% YoY gain, while apartment prices saw more modest 6% growth.</p>

<h2>Key Headline Numbers</h2>
<ul>
  <li><strong>Total Transaction Value:</strong> AED 142.3B (+18% YoY)</li>
  <li><strong>Total Transaction Volume:</strong> 38,417 deals (+23% YoY)</li>
  <li><strong>Average Villa Price:</strong> AED 6.8M (+14% YoY)</li>
  <li><strong>Average Apartment Price:</strong> AED 1.4M (+6% YoY)</li>
  <li><strong>Off-Plan Share:</strong> 53% of all transactions (vs 47% in Q2 2025)</li>
  <li><strong>Cash Buyer Percentage:</strong> 61% (down from 68% in Q2 2025)</li>
  <li><strong>Top Buyer Nationality:</strong> Indian (21%), UK (14%), Russian (9%), Saudi (7%)</li>
</ul>

<h2>Top Performing Communities — Villa Price Growth</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Community</th>
      <th style="padding:0.75rem;text-align:left;">Avg Price (AED)</th>
      <th style="padding:0.75rem;text-align:left;">YoY Growth</th>
      <th style="padding:0.75rem;text-align:left;">Avg Price/sqft</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Palm Jumeirah</td>
      <td style="padding:0.75rem;">18.5M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+18%</td>
      <td style="padding:0.75rem;">AED 3,800</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Emirates Hills</td>
      <td style="padding:0.75rem;">32.1M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+15%</td>
      <td style="padding:0.75rem;">AED 2,400</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Dubai Hills Estate</td>
      <td style="padding:0.75rem;">8.9M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+14%</td>
      <td style="padding:0.75rem;">AED 1,650</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Jumeirah Bay Island</td>
      <td style="padding:0.75rem;">22.4M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+13%</td>
      <td style="padding:0.75rem;">AED 4,200</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">Arabian Ranches</td>
      <td style="padding:0.75rem;">6.2M</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">+11%</td>
      <td style="padding:0.75rem;">AED 1,180</td>
    </tr>
  </tbody>
</table>

<h2>Top Performing Communities — Apartment Rental Yields</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
  <thead>
    <tr style="background:#0A1F44;color:white;">
      <th style="padding:0.75rem;text-align:left;">Community</th>
      <th style="padding:0.75rem;text-align:left;">Avg 1BR Rent</th>
      <th style="padding:0.75rem;text-align:left;">Gross Yield</th>
      <th style="padding:0.75rem;text-align:left;">YoY Rent Change</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">JVC (Jumeirah Village Circle)</td>
      <td style="padding:0.75rem;">AED 68,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">9.2%</td>
      <td style="padding:0.75rem;">+8%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Dubai Production City</td>
      <td style="padding:0.75rem;">AED 62,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">8.9%</td>
      <td style="padding:0.75rem;">+6%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Discovery Gardens</td>
      <td style="padding:0.75rem;">AED 70,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">8.4%</td>
      <td style="padding:0.75rem;">+9%</td>
    </tr>
    <tr style="border-bottom:1px solid #E5E7EB;">
      <td style="padding:0.75rem;">Dubai Marina</td>
      <td style="padding:0.75rem;">AED 105,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">6.8%</td>
      <td style="padding:0.75rem;">+5%</td>
    </tr>
    <tr>
      <td style="padding:0.75rem;">Downtown Dubai</td>
      <td style="padding:0.75rem;">AED 130,000</td>
      <td style="padding:0.75rem;color:green;font-weight:600;">5.9%</td>
      <td style="padding:0.75rem;">+4%</td>
    </tr>
  </tbody>
</table>

<h2>5 Key Trends Shaping H2 2026</h2>

<h3>1. Off-Plan Dominance Continues</h3>
<p>Off-plan transactions crossed 50% market share for the first time, driven by aggressive launches from Emaar, DAMAC, and Sobha. We expect this to continue through H2 as ~120 new projects are slated for launch.</p>

<h3>2. End-User Demand Surging</h3>
<p>The cash buyer percentage dropped from 68% to 61%, indicating growing end-user (mortgaged) demand. This is a healthy sign — sustainable market growth depends on end-users, not just investors.</p>

<h3>3. Villa Supply Constraint</h3>
<p>With only ~1,400 Palm villas, 1,500 Emirates Hills villas, and 7,500 Dubai Hills villas — all sold out — secondary market villa prices will continue upward. No new villa supply is expected until 2028.</p>

<h3>4. Golden Visa Effect</h3>
<p>The 2024 visa changes continue to attract international capital. Indian and UK buyers — historically motivated by residency — drove 35% of AED 5M+ transactions in Q2.</p>

<h3>5. Branded Residences Premium</h3>
<p>Branded residences (Cavalli, Bugatti, Six Senses, Bvlgari) now command a 32% premium over equivalent unbranded properties — up from 25% a year ago. This trend will accelerate as more luxury brands enter Dubai.</p>

<h2>Outlook for H2 2026</h2>
<p>Royal Jubilant forecasts continued price growth in H2 2026, with villa prices up 8-12% and apartment prices up 4-6% by year-end. Off-plan activity will moderate slightly as the 2024-2025 launch pipeline completes and units enter the secondary market.</p>
<p>For investors, the strongest opportunities remain:</p>
<ul>
  <li><strong>Off-plan launches in Creek Harbour, Dubai Hills, and Tilal Al Ghaf</strong> — capital appreciation during construction</li>
  <li><strong>Secondary villas in established communities</strong> — limited supply, strong rental demand</li>
  <li><strong>Branded residences</strong> — proven 25-35% premium retention</li>
  <li><strong>JVC and Discovery Gardens apartments</strong> — best gross yields in Dubai</li>
</ul>

<h2>Get the Full Report</h2>
<p>This page summarises our 47-page Q2 2026 Dubai Real Estate Market Report. The full report includes:</p>
<ul>
  <li>Detailed community-by-community price data (47 communities)</li>
  <li>Rental yield analysis by unit type (1BR, 2BR, 3BR, villa)</li>
  <li>Off-plan pipeline tracker (120+ projects)</li>
  <li>Buyer demographic breakdown by nationality</li>
  <li>Mortgage market analysis (12 UAE banks compared)</li>
  <li>2026-2028 forecasts and scenario analysis</li>
</ul>
<p>Submit the form below to receive the full PDF report by email — free for qualified investors.</p>
`,
  },
];

async function main() {
  console.log(`\n🌱 Seeding ${PAGES.length} landing pages...\n`);
  let created = 0;
  let updated = 0;

  for (const page of PAGES) {
    const existing = await db.landingPage.findUnique({ where: { slug: page.slug } });
    if (existing) {
      await db.landingPage.update({
        where: { id: existing.id },
        data: {
          title: page.title,
          headline: page.headline,
          subheadline: page.subheadline,
          body: page.body,
          heroImage: page.heroImage,
          ctaText: page.ctaText,
          ctaLink: page.ctaLink,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          status: page.status,
          publishedAt: existing.publishedAt || (page.status === "published" ? new Date() : null),
        },
      });
      console.log(`   ↻ Updated: /p/${page.slug}`);
      updated++;
    } else {
      await db.landingPage.create({
        data: {
          ...page,
          publishedAt: page.status === "published" ? new Date() : null,
        },
      });
      console.log(`   ✓ Created: /p/${page.slug}`);
      created++;
    }
  }

  const total = await db.landingPage.count();
  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} · Updated: ${updated} · Total in DB: ${total}`);
  console.log(`\n✅ Done. Visit /p/{slug} to view each page.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
