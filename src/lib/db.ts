import { PrismaClient } from '@prisma/client'

// ONLY use inert proxy during build phase (when Next.js collects page data)
// At runtime, ALWAYS use real Prisma client

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

function createInertProxy(): any {
  const handler: ProxyHandler<any> = {
    get(target, prop, receiver) {
      if (prop === '$connect' || prop === '$disconnect') {
        return () => Promise.resolve();
      }
      if (typeof prop === 'string') {
        return (...args: any[]) => Promise.resolve([]);
      }
      return Reflect.get(target, prop, receiver);
    },
  };
  return new Proxy({} as any, handler);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!isBuildPhase && !globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  });
}

export const db = isBuildPhase ? createInertProxy() : (globalForPrisma.prisma ?? createInertProxy());
