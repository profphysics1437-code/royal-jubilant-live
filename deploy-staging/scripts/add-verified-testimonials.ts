// Add 3 more "Verified Client" testimonials to fill 6-card grid
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const newTestimonials = [
  {
    name: 'Aisha Al Marri',
    role: 'Verified Client',
    location: 'Dubai Marina',
    service: 'Tenant',
    rating: 5,
    quote: 'Found my dream 2BR apartment in Dubai Marina within 48 hours. The team understood exactly what I wanted and negotiated a great rate. Truly five-star service.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    published: true,
  },
  {
    name: 'James Patterson',
    role: 'Verified Client',
    location: 'Business Bay',
    service: 'Buyer',
    rating: 5,
    quote: 'As an expat buying my first property in Dubai, I was nervous. Royal Jubilant made the entire process seamless — from viewings to NOC to handover. Highly recommend.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    published: true,
  },
  {
    name: 'Sana Khan',
    role: 'Verified Client',
    location: 'JVC',
    service: 'Investor',
    rating: 5,
    quote: 'I invested in an off-plan project in JVC based on their advice. The ROI has exceeded expectations. Their market knowledge is genuinely unmatched in Dubai.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    published: true,
  },
];

async function main() {
  console.log('Adding verified client testimonials...');
  for (const t of newTestimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
      console.log('  ✓ Added:', t.name);
    } else {
      console.log('  - Already exists:', t.name);
    }
  }
  const total = await prisma.testimonial.count();
  console.log('Total testimonials now:', total);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
