import prisma from './prisma';

let isConnected = false;

export default async function dbConnect() {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("DATABASE_URL not defined yet");
    }
    return null;
  }

  if (!isConnected) {
    try {
      await prisma.$connect();
      isConnected = true;
      console.log("pgsql connected");
    } catch (error) {
      console.error("PostgreSQL connection error:", error);
      throw error;
    }
  }

  return prisma;
}
