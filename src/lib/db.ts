import { PrismaClient } from '@prisma/client'

// ULTRA-SAFE Prisma client — never crashes at build time
// Returns empty results if database is not available

function createSafeProxy(): any {
  return new Proxy({} as any, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        // Return an async function for any method call
        return (...args: any[]) => Promise.resolve([]);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

function createPrismaClient(): PrismaClient | null {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
    });
  } catch (e) {
    console.log('[db] Failed to create Prisma client:', e);
    return null;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Try to create Prisma client, fall back to safe proxy if it fails
let client: PrismaClient | any;

try {
  if (process.env.DATABASE_URL) {
    if (globalForPrisma.prisma) {
      client = globalForPrisma.prisma;
    } else {
      client = createPrismaClient();
      if (client && process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
      }
    }
  } else {
    client = createSafeProxy();
  }
} catch (e) {
  console.log('[db] Error during initialization, using safe proxy:', e);
  client = createSafeProxy();
}

if (!client) {
  client = createSafeProxy();
}

export const db = client;
