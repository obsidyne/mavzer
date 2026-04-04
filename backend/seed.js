import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@mavzer.com";
  const password = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password },
  });

  console.log(`Admin user created: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());