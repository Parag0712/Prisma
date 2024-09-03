import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // for log of query
  log: ["query"],
});

export default prisma;
