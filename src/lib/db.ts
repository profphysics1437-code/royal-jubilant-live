import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Vercel Fix: Ensure DATABASE_URL points to the correct absolute path
// Vercel's serverless functions run from /var/task, so relative paths break
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'file:./db/custom.db') {
  // Try multiple possible paths where the DB file might be
  const possiblePaths = [
    path.join(process.cwd(), 'db', 'custom.db'),
    path.join('/var/task', 'db', 'custom.db'),
    path.join('/var/task', 'db', 'custom.db'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      process.env.DATABASE_URL = `file:${p}`;
      break;
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
    })
  } catch (e) {
    console.error('[db] Failed to create Prisma client:', e)
  }
}

export const db = globalForPrisma.prisma ?? ({} as PrismaClient)
