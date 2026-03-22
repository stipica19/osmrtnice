/* eslint-disable @typescript-eslint/no-require-imports */
const { hash } = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL || null;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME i ADMIN_PASSWORD moraju biti postavljeni.");
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      email,
      role: "admin",
    },
    create: {
      username,
      passwordHash,
      email,
      role: "admin",
    },
  });

  console.log(`Admin user '${username}' je kreiran/azuriran.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
