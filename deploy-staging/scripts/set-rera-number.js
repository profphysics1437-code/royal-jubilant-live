// Update the company RERA license number to 28839
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  console.log("🔧 Updating company RERA license number...");

  const existing = await db.siteSetting.findUnique({ where: { key: "company.rera" } });
  console.log(`Current value: ${existing?.value || "(none)"}`);

  // Update to the new RERA license number
  await db.siteSetting.upsert({
    where: { key: "company.rera" },
    update: { value: "RERA 28839", category: "contact" },
    create: { key: "company.rera", value: "RERA 28839", category: "contact" },
  });

  const updated = await db.siteSetting.findUnique({ where: { key: "company.rera" } });
  console.log(`✓ Updated company.rera to: ${updated?.value}`);

  await db.$disconnect();
})().catch(e => { console.error("ERROR:", e); process.exit(1); });
