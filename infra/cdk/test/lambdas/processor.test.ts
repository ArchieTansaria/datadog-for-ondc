import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handler, resetDbConfigForTesting } from '../../src/lambdas/processor';
import { SQSEvent } from 'aws-lambda';

const { mockPrismaTransaction, mockParticipantFindFirst, mockSend } = vi.hoisted(() => ({
  mockPrismaTransaction: vi.fn(),
  mockParticipantFindFirst: vi.fn(),
  mockSend: vi.fn(),
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
      rawPayloadUri: 's3://bucket/key.json',
    }),
  };

  it('valid message: configures database and processes successfully', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    mockPrismaTransaction.mockResolvedValue([{}, {}]);

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
});
