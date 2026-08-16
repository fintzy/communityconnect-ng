import prisma from "./src/config/prisma";

async function main() {
  const user = await prisma.user.update({
    where: {
      id: "cmsnarhf80000pp8443kiiq4b",
    },
    data: {
      role: "SUPER_ADMIN",
    },
  });

  console.log({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });