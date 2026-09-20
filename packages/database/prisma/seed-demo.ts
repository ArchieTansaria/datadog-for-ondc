import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting demo seed...');

  // 1. Ensure Tenant exists
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-tenant' },
    update: {},
    create: {
      name: 'Demo Corp',
      slug: 'demo-tenant',
      apiKey: 'demo-api-key-123',
    },
  });

  // 2. Ensure Participant exists
  const seller = await prisma.participant.upsert({
    where: {
      tenantId_participantId_environment_domain: {
        tenantId: tenant.id,
        participantId: 'bpp.demo.in',
        environment: 'PROD',
        domain: 'nic2004:52110',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      participantId: 'bpp.demo.in',
      participantType: 'SELLER',
      participantName: 'Demo BPP',
      environment: 'PROD',
      domain: 'nic2004:52110',
      protocolVersion: '1.2.0',
    },
  });

  // Base timestamps
  const now = new Date();
  const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  // Helper to create events
  const createEvent = (
    orderId: string,
    transactionId: string,
    action: string,
    eventType: string,
    timeOffsetMs: number,
    baseTime: Date,
    validationStatus: string = 'VALID',
    processingStatus: string = 'PROCESSED',
    errorCode?: string,
    errorMessage?: string
  ) => {
    const timestamp = new Date(baseTime.getTime() + timeOffsetMs);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      context: {
        domain: 'nic2004:52110',
        action: action,
        bap_id: 'bap.buyerapp.io',
        bpp_id: 'bpp.demo.in',
        transaction_id: transactionId,
        message_id: `msg-${Math.random().toString(36).substring(7)}`,
        timestamp: timestamp.toISOString(),
      },
      message: {
        order: {
          id: orderId,
          state: eventType,
        },
      },
    };

    if (errorCode) {
      payload.error = {
        type: 'CORE-ERROR',
        code: errorCode,
        message: errorMessage,
      };
    }

    return {
      tenantId: tenant.id,
      orderId,
      transactionId,
      action,
      eventType,
      eventTimestamp: timestamp,
      participantId: 'bpp.demo.in',
      participantType: 'SELLER',
      domain: 'nic2004:52110',
      protocolVersion: '1.2.0',
      environment: 'PROD',
      idempotencyKey: `idem-${transactionId}-${action}`,
      rawPayload: payload,
      processingStatus,
      validationStatus,
      errorCode,
      errorMessage,
    };
  };

  // ---------------------------------------------------------
  // Order A: Healthy
  // ---------------------------------------------------------
  const orderA = await prisma.order.upsert({
    where: {
      tenantId_environment_transactionId: {
        tenantId: tenant.id,
        environment: 'PROD',
        transactionId: 'txn-demo-healthy',
      },
    },
    update: { currentState: 'CONFIRMED', lastEventAt: new Date(fiveMinsAgo.getTime() + 7000) },
    create: {
      id: 'a0000000-0000-0000-0000-000000000001',
      tenantId: tenant.id,
      ondcOrderId: 'O-HEALTHY-01',
      transactionId: 'txn-demo-healthy',
      domain: 'nic2004:52110',
      environment: 'PROD',
      protocolVersion: '1.2.0',
      currentState: 'CONFIRMED',
      sellerId: seller.participantId,
      createdAt: fiveMinsAgo,
      lastEventAt: new Date(fiveMinsAgo.getTime() + 7000),
    },
  });

  await prisma.orderEvent.deleteMany({ where: { transactionId: 'txn-demo-healthy' } });
  await prisma.orderEvent.createMany({
    data: [
      createEvent(orderA.id, 'txn-demo-healthy', 'search', 'SEARCH', 0, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'on_search', 'SEARCHED', 200, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'select', 'SELECT', 1000, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'on_select', 'SELECTED', 1300, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'init', 'INIT', 3000, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'on_init', 'INITIALIZED', 3400, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'confirm', 'CONFIRM', 6000, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'on_confirm', 'CONFIRMED', 7000, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'status', 'STATUS', 10000, fiveMinsAgo),
      createEvent(orderA.id, 'txn-demo-healthy', 'on_status', 'COMPLETED', 10500, fiveMinsAgo),
    ],
  });

  // ---------------------------------------------------------
  // Order B: Protocol Violation
  // ---------------------------------------------------------
  const orderB = await prisma.order.upsert({
    where: {
      tenantId_environment_transactionId: {
        tenantId: tenant.id,
        environment: 'PROD',
        transactionId: 'txn-demo-invalid',
      },
    },
    update: { currentState: 'SEARCHED', lastEventAt: new Date(tenMinsAgo.getTime() + 300) },
    create: {
      id: 'b0000000-0000-0000-0000-000000000001',
      tenantId: tenant.id,
      ondcOrderId: 'O-INVALID-01',
      transactionId: 'txn-demo-invalid',
      domain: 'nic2004:52110',
      environment: 'PROD',
      protocolVersion: '1.2.0',
      currentState: 'SEARCHED',
      sellerId: seller.participantId,
      createdAt: tenMinsAgo,
      lastEventAt: new Date(tenMinsAgo.getTime() + 300),
    },
  });

  await prisma.orderEvent.deleteMany({ where: { transactionId: 'txn-demo-invalid' } });
  await prisma.incident.deleteMany({ where: { orderId: orderB.id } });

  const invalidEvent = createEvent(orderB.id, 'txn-demo-invalid', 'on_confirm', 'CONFIRMED', 300, tenMinsAgo, 'INVALID', 'FAILED', 'CORE-ERR-001', 'Invalid transition: on_confirm received but expected init');
  
  await prisma.orderEvent.createMany({
    data: [
      createEvent(orderB.id, 'txn-demo-invalid', 'search', 'SEARCH', 0, tenMinsAgo),
      createEvent(orderB.id, 'txn-demo-invalid', 'on_search', 'SEARCHED', 150, tenMinsAgo),
      invalidEvent,
    ],
  });

  const savedInvalidEvent = await prisma.orderEvent.findFirst({ where: { idempotencyKey: invalidEvent.idempotencyKey } });

  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      orderId: orderB.id,
      incidentType: 'INVALID_TRANSITION',
      severity: 'HIGH',
      status: 'OPEN',
      title: 'Invalid State Transition',
      description: 'Received on_confirm but order is in SEARCHED state.',
      detectedAt: new Date(tenMinsAgo.getTime() + 300),
      sourceEventId: savedInvalidEvent?.id,
      metadata: {
        rca: {
          generatedAt: new Date().toISOString(),
          evidence: {
            rootCause: 'The buyer app completely skipped the /select and /init phases and jumped directly to /on_confirm.',
            recommendation: 'Contact BAP administrator. Block further requests from this transaction sequence.'
          }
        }
      }
    },
  });

  // ---------------------------------------------------------
  // Order C: Active SLA breach
  // ---------------------------------------------------------
  const orderC = await prisma.order.upsert({
    where: {
      tenantId_environment_transactionId: {
        tenantId: tenant.id,
        environment: 'PROD',
        transactionId: 'txn-demo-breach',
      },
    },
    update: { currentState: 'INIT', lastEventAt: new Date(now.getTime() - 150000) },
    create: {
      id: 'c0000000-0000-0000-0000-000000000001',
      tenantId: tenant.id,
      ondcOrderId: 'O-BREACH-01',
      transactionId: 'txn-demo-breach',
      domain: 'nic2004:52110',
      environment: 'PROD',
      protocolVersion: '1.2.0',
      currentState: 'INIT',
      sellerId: seller.participantId,
      createdAt: new Date(now.getTime() - 160000),
      lastEventAt: new Date(now.getTime() - 150000),
    },
  });

  await prisma.orderEvent.deleteMany({ where: { transactionId: 'txn-demo-breach' } });
  await prisma.incident.deleteMany({ where: { orderId: orderC.id } });

  await prisma.orderEvent.createMany({
    data: [
      createEvent(orderC.id, 'txn-demo-breach', 'search', 'SEARCH', -160000, now),
      createEvent(orderC.id, 'txn-demo-breach', 'on_search', 'SEARCHED', -158000, now),
      createEvent(orderC.id, 'txn-demo-breach', 'select', 'SELECT', -155000, now),
      createEvent(orderC.id, 'txn-demo-breach', 'on_select', 'SELECTED', -153000, now),
      createEvent(orderC.id, 'txn-demo-breach', 'init', 'INIT', -150000, now),
    ],
  });

  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      orderId: orderC.id,
      incidentType: 'SLA_BREACH',
      severity: 'CRITICAL',
      status: 'OPEN',
      title: 'BPP Timeout on /init',
      description: 'Order stuck in INIT state for over 120 seconds.',
      detectedAt: new Date(now.getTime() - 30000),
      metadata: {
        rca: {
          generatedAt: new Date().toISOString(),
          evidence: {
            rootCause: 'Downstream provider delivery fleet unresponsive. Exceeded 120s max threshold on /on_init callback.',
            recommendation: 'Check shadowfax BPP adapter logs. Initiate automated fallback assignment.'
          }
        }
      }
    },
  });

  // ---------------------------------------------------------
  // Order D: Recovered SLA breach
  // ---------------------------------------------------------
  const orderD = await prisma.order.upsert({
    where: {
      tenantId_environment_transactionId: {
        tenantId: tenant.id,
        environment: 'PROD',
        transactionId: 'txn-demo-recovered',
      },
    },
    update: { currentState: 'CONFIRMED', lastEventAt: new Date(twoHoursAgo.getTime() + 150000) },
    create: {
      id: 'd0000000-0000-0000-0000-000000000001',
      tenantId: tenant.id,
      ondcOrderId: 'O-RECOV-01',
      transactionId: 'txn-demo-recovered',
      domain: 'nic2004:52110',
      environment: 'PROD',
      protocolVersion: '1.2.0',
      currentState: 'CONFIRMED',
      sellerId: seller.participantId,
      createdAt: twoHoursAgo,
      lastEventAt: new Date(twoHoursAgo.getTime() + 150000),
    },
  });

  await prisma.orderEvent.deleteMany({ where: { transactionId: 'txn-demo-recovered' } });
  await prisma.incident.deleteMany({ where: { orderId: orderD.id } });

  await prisma.orderEvent.createMany({
    data: [
      createEvent(orderD.id, 'txn-demo-recovered', 'search', 'SEARCH', 0, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'on_search', 'SEARCHED', 200, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'select', 'SELECT', 1000, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'on_select', 'SELECTED', 1300, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'init', 'INIT', 2000, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'on_init', 'INITIALIZED', 2500, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'confirm', 'CONFIRM', 3000, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'on_confirm', 'CONFIRMED', 150000, twoHoursAgo), // Huge delay
      createEvent(orderD.id, 'txn-demo-recovered', 'status', 'STATUS', 151000, twoHoursAgo),
      createEvent(orderD.id, 'txn-demo-recovered', 'on_status', 'COMPLETED', 151500, twoHoursAgo),
    ],
  });

  await prisma.incident.create({
    data: {
      tenantId: tenant.id,
      orderId: orderD.id,
      incidentType: 'SLA_BREACH',
      severity: 'CRITICAL',
      status: 'RESOLVED',
      title: 'BPP Timeout on /confirm',
      description: 'Order stuck in CONFIRM state for over 120 seconds.',
      detectedAt: new Date(twoHoursAgo.getTime() + 123000),
      resolvedAt: new Date(twoHoursAgo.getTime() + 150000),
      metadata: {
        rca: {
          generatedAt: new Date(twoHoursAgo.getTime() + 125000).toISOString(),
          evidence: {
            rootCause: 'BPP database lock caused significant delay processing the payment confirmation.',
            recommendation: 'Monitor BPP latency. No immediate action required as order eventually recovered.'
          }
        }
      }
    },
  });

  // ---------------------------------------------------------
  // Order E: Active/in-flight order
  // ---------------------------------------------------------
  const orderE = await prisma.order.upsert({
    where: {
      tenantId_environment_transactionId: {
        tenantId: tenant.id,
        environment: 'PROD',
        transactionId: 'txn-demo-inflight',
      },
    },
    update: { currentState: 'SELECT', lastEventAt: new Date(now.getTime() - 2000) },
    create: {
      id: 'e0000000-0000-0000-0000-000000000001',
      tenantId: tenant.id,
      ondcOrderId: 'O-INFLIGHT-01',
      transactionId: 'txn-demo-inflight',
      domain: 'nic2004:52110',
      environment: 'PROD',
      protocolVersion: '1.2.0',
      currentState: 'SELECT',
      sellerId: seller.participantId,
      createdAt: new Date(now.getTime() - 5000),
      lastEventAt: new Date(now.getTime() - 2000),
    },
  });

  await prisma.orderEvent.deleteMany({ where: { transactionId: 'txn-demo-inflight' } });
  await prisma.incident.deleteMany({ where: { orderId: orderE.id } });

  await prisma.orderEvent.createMany({
    data: [
      createEvent(orderE.id, 'txn-demo-inflight', 'search', 'SEARCH', -5000, now),
      createEvent(orderE.id, 'txn-demo-inflight', 'on_search', 'SEARCHED', -4800, now),
      createEvent(orderE.id, 'txn-demo-inflight', 'select', 'SELECT', -2000, now),
    ],
  });

  console.log('Demo seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
