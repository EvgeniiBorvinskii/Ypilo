const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const projects = await prisma.project.findMany({
      select: { id: true, title: true }
    });
    console.log(JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
