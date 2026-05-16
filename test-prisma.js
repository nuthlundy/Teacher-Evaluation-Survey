const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});
async function main() {
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    const campuses = await prisma.campus.findMany();
    console.log('Campuses:', campuses);
  } catch (e) {
    console.error('Error connecting:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
