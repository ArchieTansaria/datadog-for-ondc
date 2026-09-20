import { PrismaClient } from '@prisma/client';

export async function seedDatabase() {
  const prisma = new PrismaClient();
  console.log('Seeding Smoke Test Data...');

  try {
    // 0. Debug: Fetch applied migrations
    const migrations = await prisma.$queryRaw`SELECT * FROM _prisma_migrations`;
    console.log('Applied Migrations:', migrations);

    // 1. Check if the smoke test tenant already exists
    let tenant = await prisma.tenant.findUnique({
      where: { slug: 'smoke-test-tenant' },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: 'Smoke Test Tenant',
          slug: 'smoke-test-tenant',
          apiKey: 'smoke-test-api-key', // Note: this is different from API Gateway key
        },
      });
      console.log(`✅ Created Tenant: ${tenant.id}`);
    } else {
      console.log(`✅ Found existing Tenant: ${tenant.id}`);
    }

    // 2. Upsert the smoke-test-seller.com participant
    const participant = await prisma.participant.upsert({
      where: {
        tenantId_participantId_environment_domain: {
          tenantId: tenant.id,
          participantId: 'smoke-test-seller.com',
          environment: 'PROD',
          domain: 'nic2004:52110',
        }
      },
      update: {},
      create: {
        tenantId: tenant.id,
        participantId: 'smoke-test-seller.com',
        participantType: 'SELLER',
        participantName: 'Smoke Test Seller App',
        environment: 'PROD',
        domain: 'nic2004:52110',
        protocolVersion: '1.2.0',
      },
    });

    console.log(`✅ Upserted Participant: ${participant.participantId} -> Tenant: ${tenant.id}`);
    console.log('\nDatabase is now seeded for the smoke test!');
  } finally {
    await prisma.$disconnect();
  }
}

// For direct execution via tsx
if (typeof require !== 'undefined' && require.main === module) {
  seedDatabase().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
