import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const logs = await prisma.smokeLog.findMany({
      where: {
        reasons: { has: "WORK" as any }
      }
    });
    console.log("Found:", logs.length);
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
