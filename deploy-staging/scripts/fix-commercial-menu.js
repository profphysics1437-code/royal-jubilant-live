// Make "Commercial" a single leaf menu item (no submenu) — points directly to the commercial view
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  console.log("🔧 Updating Commercial menu item to be a single leaf (no submenu)...\n");

  // Find the top-level Commercial menu item
  const commercial = await db.menuItem.findFirst({
    where: { label: "Commercial", menu: "main", parentId: null },
  });
  if (!commercial) {
    console.log("✗ Commercial menu item not found!");
    return;
  }
  console.log(`Found Commercial menu item (id=${commercial.id}, current view=${commercial.view})`);

  // Update it to be a leaf item pointing to "commercial" view
  await db.menuItem.update({
    where: { id: commercial.id },
    data: { view: "commercial", icon: null },
  });
  console.log("✓ Updated Commercial → view=commercial, icon=null");

  // Delete the 2 children (Commercial Property for Rent / Sale)
  const deleted = await db.menuItem.deleteMany({
    where: { parentId: commercial.id },
  });
  console.log(`✓ Deleted ${deleted.count} sub-menu item(s) under Commercial`);

  // Also clear icons on all other top-level main menu items for a cleaner look
  console.log("\n🎨 Clearing icons from all top-level main menu items...");
  const cleared = await db.menuItem.updateMany({
    where: { menu: "main", parentId: null },
    data: { icon: null },
  });
  console.log(`✓ Cleared icons on ${cleared.count} top-level menu item(s)`);

  // Verify final state
  console.log("\n--- Final menu structure ---");
  const final = await db.menuItem.findMany({
    where: { menu: "main", parentId: null, visible: true },
    orderBy: { order: "asc" },
    include: { children: true },
  });
  for (const item of final) {
    console.log(`TOP: ${item.label} | view=${item.view} | icon=${item.icon} | children=${item.children.length}`);
    for (const c of item.children) {
      console.log(`   sub: ${c.label} | view=${c.view}`);
    }
  }

  await db.$disconnect();
})().catch(e => { console.error("ERROR:", e); process.exit(1); });
