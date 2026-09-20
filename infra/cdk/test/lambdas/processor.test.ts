import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handler, resetDbConfigForTesting } from '../../src/lambdas/processor';
import { SQSEvent } from 'aws-lambda';

const { mockPrismaTransaction, mockParticipantFindFirst, mockSend, mockSqsSend } = vi.hoisted(() => ({
  mockPrismaTransaction: vi.fn(),
  mockParticipantFindFirst: vi.fn(),
  mockSend: vi.fn(),
  mockSqsSend: vi.fn(),
}));

vi.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn(() => ({ send: mockSqsSend })),
  SendMessageCommand: vi.fn((input) => ({ input })),
}));

vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn(() => ({ send: mockSend })),
  GetSecretValueCommand: vi.fn((input) => ({ input })),
}));

vi.mock('@ondc-pulse/database', () => {
  return {
    prisma: {
      $transaction: mockPrismaTransaction,
      participant: {
        findFirst: mockParticipantFindFirst,
      },
      order: {
        findUnique: vi.fn(),
      },
      incident: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      sLARule: {
        findUnique: vi.fn(),
      },
    },
    Prisma: {
      PrismaClientKnownRequestError: class extends Error {
        code: string;
        clientVersion: string;
        constructor(message: string, options: { code: string; clientVersion: string }) {
          super(message);
          this.code = options.code;
          this.clientVersion = options.clientVersion;
        }
      },
    },
  };
});

describe('Processor Lambda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetDbConfigForTesting();
    process.env.DATABASE_SECRET_ARN = 'arn:aws:secretsmanager:test';
    delete process.env.DATABASE_URL;
    mockSend.mockResolvedValue({
      SecretString: JSON.stringify({
        username: 'dbuser',
        password: 'dbpassword',
        host: 'dbhost',
        port: 5432,
        dbname: 'ondc_pulse',
      }),
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createEvent = (records: any[]): SQSEvent => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Records: records as any,
  });

  const validRecord = {
    messageId: 'sqs-msg-123',
    body: JSON.stringify({
      eventId: 'msg-123',
      transactionId: 'txn-123',
      messageId: 'msg-123',
      orderId: 'order-123',
      action: 'on_search',
      eventType: 'on_search',
      timestamp: '2023-01-01T00:00:00.000Z',
      participantId: 'bpp.com',
      participantRole: 'SELLER',
      domain: 'nic2004:52110',
      bapId: 'bap.com',
      bapUri: 'https://bap.com',
      bppId: 'bpp.com',
      bppUri: 'https://bpp.com',
      version: '1.2.0',
      coreVersion: '1.0.0',
      city: 'std:080',
      country: 'IND',
      rawPayloadUri: 's3://bucket/key.json',
    }),
  };

  it('valid message: configures database and processes successfully', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockPrismaTransaction.mockImplementation(async (cb: any) => {
      const tx = {
        order: { findUnique: vi.fn(), create: vi.fn().mockResolvedValue({ id: 'order-mock' }), update: vi.fn() },
        orderEvent: { create: vi.fn() },
        sLARule: { findMany: vi.fn().mockResolvedValue([{ id: 'rule-1', name: 'Rule 1', thresholdMs: 60000, fromState: 'SEARCHED' }]) }
      };
      return cb(tx);
    });
    process.env.PROCESSING_QUEUE_URL = 'https://sqs.url';

    const result = await handler(createEvent([validRecord]));

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(process.env.DATABASE_URL).toBe('postgresql://dbuser:dbpassword@dbhost:5432/ondc_pulse?schema=public');

    expect(mockParticipantFindFirst).toHaveBeenCalledWith({
      where: {
        participantId: 'bpp.com',
        domain: 'nic2004:52110',
      },
    });

    expect(mockPrismaTransaction).toHaveBeenCalled();
    expect(mockSqsSend).toHaveBeenCalled();
    expect(result).toEqual({ batchItemFailures: [] });
  });

  it('no SLA rule means no check is scheduled', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockPrismaTransaction.mockImplementation(async (cb: any) => {
      const tx = {
        order: { findUnique: vi.fn(), create: vi.fn().mockResolvedValue({ id: 'order-mock' }), update: vi.fn() },
        orderEvent: { create: vi.fn() },
        sLARule: { findMany: vi.fn().mockResolvedValue([]) } // NO RULES
      };
      return cb(tx);
    });
    mockSqsSend.mockClear();

    const result = await handler(createEvent([validRecord]));
    expect(mockSqsSend).not.toHaveBeenCalled();
    expect(result).toEqual({ batchItemFailures: [] });
  });

  it('missing DATABASE_SECRET_ARN: throws error, fails batch, and Prisma is NOT initialized', async () => {
    delete process.env.DATABASE_SECRET_ARN;
    const result = await handler(createEvent([validRecord]));
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: 'sqs-msg-123' }] });
    expect(mockParticipantFindFirst).not.toHaveBeenCalled();
    expect(mockPrismaTransaction).not.toHaveBeenCalled();
  });

  it('Secrets Manager retrieval failure: throws error, fails batch, and Prisma is NOT initialized', async () => {
    mockSend.mockRejectedValue(new Error('Network error'));
    const result = await handler(createEvent([validRecord]));
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: 'sqs-msg-123' }] });
    expect(mockParticipantFindFirst).not.toHaveBeenCalled();
    expect(mockPrismaTransaction).not.toHaveBeenCalled();
  });

  it('malformed/missing secret fields: throws error, fails batch, and Prisma is NOT initialized', async () => {
    mockSend.mockResolvedValue({
      SecretString: JSON.stringify({
        username: 'dbuser',
        // missing password
      }),
    });
    const result = await handler(createEvent([validRecord]));
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: 'sqs-msg-123' }] });
    expect(mockParticipantFindFirst).not.toHaveBeenCalled();
    expect(mockPrismaTransaction).not.toHaveBeenCalled();
  });

  it('cached/warm invocation: reuses configuration without calling Secrets Manager again', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    mockPrismaTransaction.mockResolvedValue([{}, {}]);

    // First invocation
    await handler(createEvent([validRecord]));
    expect(mockSend).toHaveBeenCalledTimes(1);

    // Second invocation
    await handler(createEvent([validRecord]));
    expect(mockSend).toHaveBeenCalledTimes(1); // Should not increase
  });

  it('participant not found: throws error (becomes DLQ)', async () => {
    mockParticipantFindFirst.mockResolvedValue(null);

    const result = await handler(createEvent([validRecord]));

    // Returns messageId in batchItemFailures because it throws an unhandled error inside the map/try-catch
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: 'sqs-msg-123' }] });
  });

  it('P2002 duplicate event: ignored, treated as success', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    const { Prisma } = await import('@ondc-pulse/database');
    const p2002Error = new Prisma.PrismaClientKnownRequestError('Duplicate', { code: 'P2002', clientVersion: '5.0.0' });
    mockPrismaTransaction.mockRejectedValue(p2002Error);

    const result = await handler(createEvent([validRecord]));

    // Should NOT be in batchItemFailures, effectively acknowledging the duplicate to SQS
    expect(result).toEqual({ batchItemFailures: [] });
  });

  it('malformed canonical event: throws error (becomes DLQ)', async () => {
    const malformedRecord = {
      messageId: 'sqs-msg-bad',
      body: JSON.stringify({
        // missing eventId, transactionId, etc.
        action: 'on_search',
      }),
    };

    const result = await handler(createEvent([malformedRecord]));

    // Should fail and be retried by SQS until DLQ
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: 'sqs-msg-bad' }] });
  });

  it('transient DB error: returns message in batchItemFailures', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    mockPrismaTransaction.mockRejectedValue(new Error('Connection timeout'));

    const result = await handler(createEvent([validRecord]));

    // Should be in batchItemFailures to trigger SQS retry
    expect(result).toEqual({ batchItemFailures: [{ itemIdentifier: 'sqs-msg-123' }] });
  });

  describe('SLA Checks', () => {
    const slaCheckRecord = {
      messageId: 'sqs-sla-1',
      body: JSON.stringify({
        type: 'SLA_CHECK',
        orderId: 'order-123',
        expectedState: 'SEARCHED',
        ruleId: 'rule-123',
        thresholdDate: new Date(Date.now() - 1000).toISOString(),
      }),
    };

    it('stale SLA check is safely discarded after the order progresses', async () => {
      const { prisma } = await import('@ondc-pulse/database');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.order.findUnique).mockResolvedValue({ id: 'order-123', currentState: 'INITIALIZED' } as any);
      
      const result = await handler(createEvent([slaCheckRecord]));
      expect(result).toEqual({ batchItemFailures: [] });
      expect(prisma.incident.create).not.toHaveBeenCalled();
    });

    it('SLA breach creates an Incident', async () => {
      const { prisma } = await import('@ondc-pulse/database');
      vi.mocked(prisma.order.findUnique).mockResolvedValue({ 
        id: 'order-123', 
        tenantId: 'tenant-123',
        currentState: 'SEARCHED',
        lastEventAt: new Date(Date.now() - 5000)
      } as any);
      vi.mocked(prisma.incident.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.sLARule.findUnique).mockResolvedValue({
        id: 'rule-123',
        name: 'Search to Init',
        severity: 'HIGH',
        thresholdMs: 1000,
        fromState: 'SEARCHED',
        toState: 'INITIALIZED'
      } as any);

      const result = await handler(createEvent([slaCheckRecord]));
      expect(result).toEqual({ batchItemFailures: [] });
      expect(prisma.incident.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ incidentType: 'SLA_BREACH' })
      }));
    });

    it('Repeated/duplicate SLA checks do not create duplicate incidents', async () => {
      const { prisma } = await import('@ondc-pulse/database');
      vi.mocked(prisma.order.findUnique).mockResolvedValue({ 
        id: 'order-123', currentState: 'SEARCHED', lastEventAt: new Date(Date.now() - 5000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.incident.findFirst).mockResolvedValue({
        id: 'inc-1',
        metadata: { ruleId: 'rule-123' }
      } as any);

      const result = await handler(createEvent([slaCheckRecord]));
      expect(result).toEqual({ batchItemFailures: [] });
      expect(prisma.incident.create).not.toHaveBeenCalled();
    });
  });

  describe('Fulfillment SLA Checks', () => {
    it('fulfillment-state SLA works where applicable', async () => {
      const { prisma } = await import('@ondc-pulse/database');
      vi.mocked(prisma.order.findUnique).mockResolvedValue({ 
        id: 'order-123', 
        currentState: 'IN_PROGRESS', 
        lastEventAt: new Date(Date.now() - 5000),
        metadata: { fulfillmentState: 'Packed' }
      } as any);
      vi.mocked(prisma.incident.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.sLARule.findUnique).mockResolvedValue({
        id: 'rule-123', name: 'Packed to Picked', severity: 'HIGH', thresholdMs: 1000, 
        fromState: 'IN_PROGRESS', toState: 'IN_PROGRESS', metadata: { fromFulfillmentState: 'Packed' }
      } as any);

      const slaCheckRecord = {
        messageId: 'sqs-sla-2',
        body: JSON.stringify({
          type: 'SLA_CHECK',
          orderId: 'order-123',
          expectedState: 'IN_PROGRESS',
          expectedFulfillmentState: 'Packed',
          ruleId: 'rule-123',
          thresholdDate: new Date(Date.now() - 1000).toISOString(),
        }),
      };

      const result = await handler(createEvent([slaCheckRecord]));
      expect(result).toEqual({ batchItemFailures: [] });
      expect(prisma.incident.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ incidentType: 'SLA_BREACH', title: 'SLA Breach: Packed to Picked' })
      }));
    });
  });
});
