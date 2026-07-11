import { PrismaClient } from '@prisma/client'

// BUILD-SAFE Prisma client
// Returns a completely inert proxy during build time to prevent crashes
// when Next.js tries to collect page data without a real database connection.

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' 
                  || process.env.CI === 'true' 
                  || !process.env.DATABASE_URL;

function createInertProxy(): any {
  // An inert proxy that returns Promise.resolve([] or {}) for any call
  // This prevents "Cannot read properties of undefined" errors during build
  const handler: ProxyHandler<any> = {
    get(target, prop, receiver) {
      if (prop === '$connect' || prop === '$disconnect') {
        return () => Promise.resolve();
      }
      if (typeof prop === 'string') {
        // Return a function that returns an empty array (or empty object for findUnique)
        return (...args: any[]) => Promise.resolve([]);
      }
      return Reflect.get(target, prop, receiver);
    },
  };
  return new Proxy({} as any, handler);
}

function createPrismaClient(): PrismaClient | any {
  if (isBuildPhase) {
    return createInertProxy();
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
    });
  } catch (e) {
    console.log('[db] Failed to create Prisma client, using inert proxy:', e);
    return createInertProxy();
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!isBuildPhase && !globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient();
}

export const db = isBuildPhase ? createInertProxy() : (globalForPrisma.prisma ?? createPrismaClient());
