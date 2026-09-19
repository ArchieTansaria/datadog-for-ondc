import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handler } from '../../src/lambdas/processor';
import { SQSEvent } from 'aws-lambda';

const { mockPrismaTransaction, mockParticipantFindFirst } = vi.hoisted(() => ({
  mockPrismaTransaction: vi.fn(),
  mockParticipantFindFirst: vi.fn(),
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

  it('valid message: returns empty batchItemFailures', async () => {
    mockParticipantFindFirst.mockResolvedValue({ tenantId: 'tenant-123' });
    mockPrismaTransaction.mockResolvedValue([{}, {}]);

    const result = await handler(createEvent([validRecord]));

    expect(mockParticipantFindFirst).toHaveBeenCalledWith({
      where: {
        participantId: 'bpp.com',
        domain: 'nic2004:52110',
      },
    });

    expect(mockPrismaTransaction).toHaveBeenCalled();
    expect(result).toEqual({ batchItemFailures: [] });
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
