import prisma from "./src/config/prisma";

async function main() {
  const membership = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId: "cmskvm0c90000ppsknvdwgs777",
        communityId: "cmsmnb4310001ppe8ibu1x1x5",
      },
    },
  });

  console.log(membership);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
