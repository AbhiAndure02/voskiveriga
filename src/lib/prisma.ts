import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Test and log connection on startup in non-production
if (!globalForPrisma.prisma) {
  prisma.$connect()
    .then(() => {
      console.log('pgsql connected');
    })
    .catch((err) => {
      console.error('pgsql connection error:', err.message);
    });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
