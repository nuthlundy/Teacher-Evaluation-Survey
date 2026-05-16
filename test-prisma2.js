const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });
async function main() {
  try {
    const campuses = await prisma.campus.findMany();
    console.log(campuses);
  } catch (e) {
    console.error(e);
  }
}
main();
