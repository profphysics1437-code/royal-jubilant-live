import { PrismaClient } from '@prisma/client'

// Safe Prisma client — returns a no-op proxy if DATABASE_URL is not available
// This prevents build-time crashes when Vercel collects page data

function createSafeProxy(): any {
  return new Proxy({} as any, {
    get(target, prop, receiver) {
      // Return a function for any method call that returns null/empty
      if (typeof prop === 'string') {
        return (...args: any[]) => Promise.resolve([]);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  });
}

// Only create real Prisma client if DATABASE_URL is set
const hasDb = !!process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (hasDb && !globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma = createPrismaClient();
  } catch (e) {
    console.log('[db] Failed to create Prisma client:', e);
  }
}

// Export either real client or safe proxy
export const db = globalForPrisma.prisma ?? (hasDb ? createPrismaClient() : createSafeProxy());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = globalForPrisma.prisma ?? (hasDb ? db as PrismaClient : undefined);
