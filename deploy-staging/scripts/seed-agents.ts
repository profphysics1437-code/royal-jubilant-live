/**
 * Royal Jubilant — Agent User accounts + sample data.
 * Creates 8 login-able User accounts (role=agent), one per Agent record.
 * Links existing properties to their respective agent User.
 * Seeds sample commissions and CRM notes.
 *
 * Run with: bun run scripts/seed-agents.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Fixed passwords per agent (so we can print them deterministically)
const agentCredentials: { email: string; password: string }[] = [
  { email: "muhammad.javed.zafar@royaljubilant.ae", password: "javed2026" },
  { email: "maria.raza@royaljubilant.ae", password: "maria2026" },
  { email: "muhammad.naeem.zafar@royaljubilant.ae", password: "naeem2026" },
  { email: "naqash.haider@royaljubilant.ae", password: "naqash2026" },
  { email: "muhammad.saleem.khan@royaljubilant.ae", password: "saleem2026" },
  { email: "zeerak.hussain@royaljubilant.ae", password: "zeerak2026" },
  { email: "ahmad.raza@royaljubilant.ae", password: "ahmad2026" },
  { email: "muhammad.nazim@royaljubilant.ae", password: "nazim2026" },
];

async function main() {
  console.log("🌱 Creating agent User accounts...\n");

  const agents = await db.agent.findMany();

  // Map: agent email → user. We'll use this to link properties.
  const agentUserMap: { agentId: string; userId: string; email: string; name: string; password: string }[] = [];

  for (const cred of agentCredentials) {
    const agent = agents.find((a) => a.email === cred.email);
    if (!agent) {
      console.log(`⚠️  No Agent record found for ${cred.email} — skipping.`);
      continue;
    }
    const passwordHash = await bcrypt.hash(cred.password, 10);
    const user = await db.user.upsert({
      where: { email: cred.email },
      update: { role: "agent", name: agent.name, phone: agent.phone, passwordHash },
      create: {
        email: cred.email,
        name: agent.name,
        phone: agent.phone,
        role: "agent",
        passwordHash,
      },
    });
    agentUserMap.push({ agentId: agent.id, userId: user.id, email: cred.email, name: agent.name, password: cred.password });
    console.log(`✓ ${agent.name} → ${cred.email} / ${cred.password}`);
  }

  // Link existing properties to agent User accounts.
  // Mapping from in-memory data (property.id → agentId) — we'll distribute properties
  // across agents based on the agentId reference in the data file.
  const propertyAgentRefs: { ref: string; agentEmail: string }[] = [
    { ref: "RJ-PLM-001", agentEmail: "muhammad.javed.zafar@royaljubilant.ae" },
    { ref: "RJ-DWN-002", agentEmail: "ahmad.raza@royaljubilant.ae" },
    { ref: "RJ-MAR-003", agentEmail: "ahmad.raza@royaljubilant.ae" },
    { ref: "RJ-HIL-004", agentEmail: "muhammad.nazim@royaljubilant.ae" },
    { ref: "RJ-CRK-005", agentEmail: "muhammad.saleem.khan@royaljubilant.ae" },
    { ref: "RJ-PLM-006", agentEmail: "muhammad.javed.zafar@royaljubilant.ae" },
    { ref: "RJ-BUS-007", agentEmail: "muhammad.saleem.khan@royaljubilant.ae" },
    { ref: "RJ-MAR-008", agentEmail: "naqash.haider@royaljubilant.ae" },
    { ref: "RJ-BUS-009", agentEmail: "naqash.haider@royaljubilant.ae" },
    { ref: "RJ-HIL-010", agentEmail: "muhammad.nazim@royaljubilant.ae" },
    { ref: "RJ-DWN-011", agentEmail: "muhammad.javed.zafar@royaljubilant.ae" },
    { ref: "RJ-PLM-012", agentEmail: "zeerak.hussain@royaljubilant.ae" },
  ];

  let linkedCount = 0;
  for (const link of propertyAgentRefs) {
    const user = agentUserMap.find((m) => m.email === link.agentEmail);
    if (!user) continue;
    const property = await db.property.findFirst({ where: { reference: link.ref } });
    if (!property) continue;
    await db.property.update({ where: { id: property.id }, data: { agentId: user.userId } });
    linkedCount++;
  }
  console.log(`\n✓ Linked ${linkedCount} properties to agent User accounts`);

  // Seed sample commissions for Muhammad Javed Zafar (the managing director)
  const javed = agentUserMap.find((m) => m.email === "muhammad.javed.zafar@royaljubilant.ae");
  if (javed) {
    const existingCommissions = await db.commission.count({ where: { agentId: javed.userId } });
    if (existingCommissions === 0) {
      await db.commission.createMany({
        data: [
          { agentId: javed.userId, propertyRef: "RJ-PLM-001", dealValue: 28500000, commissionPct: 2.0, commissionAmt: 570000, status: "paid", paidAt: new Date("2026-04-15") },
          { agentId: javed.userId, propertyRef: "RJ-PLM-006", dealValue: 46800000, commissionPct: 1.5, commissionAmt: 702000, status: "invoiced" },
          { agentId: javed.userId, propertyRef: "RJ-DWN-011", dealValue: 1650000, commissionPct: 2.0, commissionAmt: 33000, status: "pending" },
        ],
      });
      console.log("✓ Seeded 3 commission records for Muhammad Javed Zafar");
    }
  }

  // Seed sample CRM notes
  const existingNotes = await db.crmNote.count();
  if (existingNotes === 0 && javed) {
    // Find a sample lead to attach notes to (or create without lead)
    const sampleLead = await db.lead.findFirst();
    await db.crmNote.createMany({
      data: [
        { agentId: javed.userId, leadId: sampleLead?.id || null, note: "Initial call — client is relocating from London, looking for 5-bed villa in Palm Jumeirah with budget AED 25-30M." },
        { agentId: javed.userId, leadId: sampleLead?.id || null, note: "Sent shortlist of 3 Signature Villas on Frond M, K, L. Awaiting feedback." },
        { agentId: javed.userId, leadId: sampleLead?.id || null, note: "Booked viewing for Saturday 2pm. Wife joining. Will bring title deed docs." },
      ],
    });
    console.log("✓ Seeded 3 CRM notes");
  }

  console.log("\n🎉 Agent accounts ready!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  AGENT PORTAL LOGIN");
  console.log("  URL: http://localhost:3000/agent/login");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  agentUserMap.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.name}`);
    console.log(`     Email:    ${m.email}`);
    console.log(`     Password: ${m.password}\n`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
