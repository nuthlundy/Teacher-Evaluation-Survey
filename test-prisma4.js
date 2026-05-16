const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: 'postgresql://postgres.gwkhdhggljmtaebwtvtz:Dy016738637@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const campuses = await prisma.campus.findMany();
    console.log('Campuses:', campuses);
  } catch (e) {
    console.error(e);
  }
}
main();
