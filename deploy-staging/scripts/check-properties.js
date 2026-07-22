const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
(async () => {
  const props = await db.property.findMany({ select: { id: true, reference: true, title: true, agentId: true, status: true, price: true, published: true }, take: 20 });
  console.log("Properties and their agentId:");
  props.forEach(p => console.log(`  ${p.reference} | ${p.status} | pub=${p.published} | agentId=${p.agentId}`));
  
  console.log("\n--- Distinct agentIds on properties ---");
  const distinct = await db.property.findMany({ select: { agentId: true }, distinct: ['agentId'] });
  distinct.forEach(d => console.log(`  ${d.agentId}`));
  
  console.log("\n--- Agent users (role=agent) ---");
  const users = await db.user.findMany({ where: { role: "agent" }, select: { id: true, email: true, name: true } });
  users.forEach(u => console.log(`  ${u.id} | ${u.email}`));
  
  await db.$disconnect();
})();
