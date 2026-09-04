import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const deletedOrders = await prisma.order.deleteMany({});
  const deletedLeads = await prisma.lead.deleteMany({});
  console.log(`Cleared: ${deletedLeads.count} leads, ${deletedOrders.count} orders from database.`);
}

main()
  .catch((e) => {
    console.error("Failed to clear database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
