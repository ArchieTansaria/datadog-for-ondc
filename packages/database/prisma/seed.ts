import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  });

  // 2. Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@acmecorp.com',
      name: 'Admin User',
      cognitoSub: 'sub-admin-123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'operator@acmecorp.com',
      name: 'Operator User',
      cognitoSub: 'sub-operator-456',
    },
  });

  // 3. Create Memberships
  await prisma.tenantMembership.createMany({
    data: [
      { tenantId: tenant.id, userId: user1.id, role: 'ADMIN' },
      { tenantId: tenant.id, userId: user2.id, role: 'OPERATIONS' },
    ],
  });

  // 4. Create Participants
  const seller = await prisma.participant.create({
    data: {
      tenantId: tenant.id,
      participantId: 'acme-seller-app',
      participantType: 'SELLER',
      participantName: 'Acme Seller App',
      environment: 'PREPROD',
      domain: 'nic2004:60232',
      protocolVersion: '1.2.0',
    },
  });

  // 5. Create SLA Rules
  await prisma.sLARule.create({
    data: {
      tenantId: tenant.id,
      name: 'Confirm to Logistics Assignment SLA',
      fromState: 'CONFIRMED',
      toState: 'ASSIGNED',
      thresholdMs: 120000, // 2 minutes
      severity: 'HIGH',
    },
  });

  // 6. Create Order and Events
  const order = await prisma.order.create({
    data: {
      tenantId: tenant.id,
      ondcOrderId: 'O12345',
      transactionId: 'TX-98765',
      domain: 'nic2004:60232',
      environment: 'PREPROD',
      protocolVersion: '1.2.0',
      currentState: 'CONFIRMED',
      sellerId: seller.participantId,
    },
  });

  await prisma.orderEvent.createMany({
    data: [
      {
        tenantId: tenant.id,
        orderId: order.id,
        eventId: 'EVT-001',
        transactionId: 'TX-98765',
        action: 'on_search',
        eventType: 'SEARCHED',
        eventTimestamp: new Date(Date.now() - 300000), // 5 mins ago
        participantId: seller.participantId,
        participantType: 'SELLER',
        domain: 'nic2004:60232',
        protocolVersion: '1.2.0',
        environment: 'PREPROD',
        idempotencyKey: 'idem-search-1',
        rawPayload: { context: { action: 'on_search' }, message: {} },
        processingStatus: 'PROCESSED',
        validationStatus: 'VALID',
      },
      {
        tenantId: tenant.id,
        orderId: order.id,
        eventId: 'EVT-002',
        transactionId: 'TX-98765',
        action: 'on_confirm',
        eventType: 'CONFIRMED',
        eventTimestamp: new Date(Date.now() - 200000), // 3 mins 20s ago
        participantId: seller.participantId,
        participantType: 'SELLER',
        domain: 'nic2004:60232',
        protocolVersion: '1.2.0',
        environment: 'PREPROD',
        idempotencyKey: 'idem-confirm-1',
        rawPayload: { context: { action: 'on_confirm' }, message: {} },
        processingStatus: 'PROCESSED',
        validationStatus: 'VALID',
      },
    ],
  });

  // 7. Create an Incident (e.g. SLA Breach since 3m20s > 2m)
  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      orderId: order.id,
      incidentType: 'SLA_BREACH',
      severity: 'HIGH',
      title: 'Logistics assignment delayed',
      description: 'Order confirmed but logistics not assigned within 2 minutes',
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
