# Royal Jubilant Real Estate LLC

Luxury Dubai real estate platform built on Next.js 16, TypeScript, Prisma + SQLite, and NextAuth.

## ✨ Features

### AI Concierge (RJ AI)
- Holographic orb (navy blue with gold ring) — bottom-left corner
- 5-step cinematic intro: charging → opening → emerging → landing → waving → chat
- White humanoid robot with blue glowing eyes + gold "RJ" emblem
- 8 quick action buttons (Find Luxury Villas, Show Apartments, etc.)
- Web Audio API pop sound + auto-intro after 6 seconds
- GLM-4.6 via z-ai-web-dev-sdk (no API key needed)

### Pages
- **Homepage** with premium 4-section search bar (RENT/Community/Property Type/SEARCH)
- **Story & Events** page (timeline + slider + modal viewer)
- **AI Powered Real Estate** page (7 sections + 5-step animation flow)
- **Why Choose Us** with MD portrait
- Property listings (Buy, Rent, Commercial, Off-Plan)
- Communities, Developers, Agents, Blog, FAQs
- Careers, Contact

### Admin Portal (`/admin/login`)
- Full CMS: Properties, Agents, Communities, Developers, Blog, Testimonials, FAQs
- **Story & Events** CMS (CRUD with image management)
- **AI Robot Control** (orb size, glow, sound, intro delay, transparency)
- Site Settings (11 categories including Careers + AI Powered Page)
- Admin AI Insights panel (indigo, business intelligence)

### Agent Portal (`/agent/login`)
- Dashboard with stats, recent leads, recent listings
- Agent AI Assistant panel (amber, productivity mode)
- Pending listings alert

## 🚀 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New Project** → Import this repo
3. Add Environment Variables:
   - `DATABASE_URL` = `file:./db/custom.db`
   - `NEXTAUTH_SECRET` = `CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=`
   - `NEXTAUTH_URL` = `https://your-project.vercel.app`
   - `NODE_ENV` = `production`
4. Click **Deploy** → live in 2 minutes

## 🔐 Default Login

- **Admin:** `admin@royaljubilant.com` / `admin123`
- **Agent:** Use any agent email from database

## 🎨 Design System

- **Primary Gold:** `#C9A961`
- **Secondary Gold:** `#A68A3F`
- **Primary Navy:** `#0A1F44`
- **Typography:** Playfair Display (serif) + Inter (sans-serif)
- **Components:** shadcn/ui + Tailwind CSS 4
- **Icons:** lucide-react
- **Animations:** Framer Motion

## 📦 Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS 4
- Prisma ORM + SQLite
- NextAuth v4 (credentials provider)
- Zustand (client state)
- Framer Motion (animations)
- z-ai-web-dev-sdk (GLM-4.6 AI)

## 📞 Contact

- **Phone:** +971 4 123 4567
- **Email:** info@royaljubilant.com
- **Website:** https://www.royaljubilant.com
- **RERA License:** #28839

## 📄 License

© 2026 Royal Jubilant Real Estate LLC. All rights reserved.
