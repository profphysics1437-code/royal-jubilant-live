import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization — PrismaClient is only created when db is first accessed
// This prevents build-time errors when DATABASE_URL isn't available during build
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })
}

// Use Proxy to lazy-load PrismaClient only when methods are accessed
export const db = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    return Reflect.get(globalForPrisma.prisma, prop, receiver)
  },
})

// Keep reference for hot reload in dev
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = globalForPrisma.prisma
