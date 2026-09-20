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

    // 3. Upsert the buyer-app.com participant (needed for buyer-side actions: select, init, confirm)
    const buyer = await prisma.participant.upsert({
      where: {
        tenantId_participantId_environment_domain: {
          tenantId: tenant.id,
          participantId: 'buyer-app.com',
          environment: 'PROD',
          domain: 'nic2004:52110',
        }
      },
      update: {},
      create: {
        tenantId: tenant.id,
        participantId: 'buyer-app.com',
        participantType: 'BUYER',
        participantName: 'Smoke Test Buyer App',
        environment: 'PROD',
        domain: 'nic2004:52110',
        protocolVersion: '1.2.0',
      },
    });

    console.log(`✅ Upserted Participant: ${buyer.participantId} -> Tenant: ${tenant.id}`);

    // 4. Ensure one SLA rule exists: SEARCHED → SELECTED, 30s threshold
    const existingRule = await prisma.sLARule.findFirst({
      where: { tenantId: tenant.id, fromState: 'SEARCHED', toState: 'SELECTED' },
    });

    if (!existingRule) {
      const rule = await prisma.sLARule.create({
        data: {
          tenantId: tenant.id,
          name: 'Search to Select SLA',
          fromState: 'SEARCHED',
          toState: 'SELECTED',
          thresholdMs: 30000, // 30 seconds
          severity: 'HIGH',
          enabled: true,
        },
      });
      console.log(`✅ Created SLA Rule: ${rule.name} (${rule.id})`);
    } else {
      console.log(`✅ Found existing SLA Rule: ${existingRule.name} (${existingRule.id})`);
    }

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
