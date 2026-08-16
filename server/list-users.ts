import prisma from "./src/config/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.table(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
