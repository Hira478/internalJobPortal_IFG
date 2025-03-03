import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetSequences() {
  try {
    // Get all table names in the current schema
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

    for (const { tablename } of tables) {
      // Get the sequence name for this table
      const result = await prisma.$queryRaw<{ seq: string }[]>`
        SELECT pg_get_serial_sequence(${tablename}, 'id') as seq
      `;
      const sequenceName = result[0]?.seq;

      if (sequenceName) {
        // Reset the sequence
        await prisma.$executeRaw`
          SELECT setval(${sequenceName}::regclass, COALESCE((SELECT MAX(id) FROM ${tablename}), 0) + 1, false)
        `;
        console.log(`Reset sequence for table: ${tablename}`);
      } else {
        console.log(`No sequence found for table: ${tablename}`);
      }
    }

    console.log("All sequences have been reset successfully.");
  } catch (error) {
    console.error("Error resetting sequences:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences();
