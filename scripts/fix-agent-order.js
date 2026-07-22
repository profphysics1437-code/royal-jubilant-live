// Fix agent order on Hostinger — runs in postinstall
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

async function main() {
  const dbFile = path.join(__dirname, '..', 'db', 'custom.db');
  if (!fs.existsSync(dbFile)) {
    console.log('[fix-agents] DB file not found, skipping');
    return;
  }
  
  const prisma = new PrismaClient({ datasources: { db: { url: 'file:' + dbFile } } });
  
  try {
    const agents = await prisma.agent.findMany();
    console.log('[fix-agents] Found', agents.length, 'agents');
    
    // Correct order per user
    const orderMap = {
      'Muhammad Javed Zafar': 1,
      'Maria Raza': 2,
      'Muhammad Naeem Zafar': 3,
      'Ahmad Ali': 4,
      'Awais Ali': 5,
      'Naqash Haider': 6,
      'Muhammad Saleem Khan': 7,
      'Muhammad Nazim': 8,
    };
    
    for (const agent of agents) {
      const newOrder = orderMap[agent.name] || 99;
      if (agent.order !== newOrder) {
        await prisma.agent.update({ where: { id: agent.id }, data: { order: newOrder } });
        console.log('[fix-agents] Updated', agent.name, '→ order', newOrder);
      }
    }
    
    // Fix Awais Ali photo
    const awais = agents.find(a => a.name === 'Awais Ali');
    if (awais && awais.photo !== '/team/awais-ali.webp') {
      await prisma.agent.update({ where: { id: awais.id }, data: { photo: '/team/awais-ali.webp' } });
      console.log('[fix-agents] Updated Awais Ali photo');
    }
    
    console.log('[fix-agents] Done!');
  } catch (e) {
    console.log('[fix-agents] Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
