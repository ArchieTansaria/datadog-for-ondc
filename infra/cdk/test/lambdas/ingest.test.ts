import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import { handler } from '../../src/lambdas/ingest';
import { APIGatewayProxyEvent } from 'aws-lambda';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const { mockS3Send, mockSqsSend } = vi.hoisted(() => ({
  mockS3Send: vi.fn(),
  mockSqsSend: vi.fn(),
}));

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(() => ({ send: mockS3Send })),
  PutObjectCommand: vi.fn((input) => ({ input })),
}));

vi.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn(() => ({ send: mockSqsSend })),
  SendMessageCommand: vi.fn((input) => ({ input })),
}));

describe('Ingest Lambda', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, RAW_EVENTS_BUCKET: 'test-bucket', PROCESSING_QUEUE_URL: 'test-queue' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const createEvent = (body: unknown): APIGatewayProxyEvent => ({
    body: typeof body === 'string' ? body : JSON.stringify(body),
  } as APIGatewayProxyEvent);

  const validPayload = {
    context: {
      domain: 'nic2004:52110',
      action: 'on_search',
      bap_id: 'bap.com',
      bpp_id: 'bpp.com',
      transaction_id: 'txn-123',
      message_id: 'msg-123',
      timestamp: '2023-01-01T00:00:00.000Z',
    },
    message: { order: { id: 'order-123' } }
  };

  it('valid request: writes to S3 and SQS, returns 200', async () => {
    mockS3Send.mockResolvedValueOnce({});
    mockSqsSend.mockResolvedValueOnce({});

    const result = await handler(createEvent(validPayload));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.messageId).toBe('msg-123');

    // Verify exactly raw payload preservation
    expect(mockS3Send).toHaveBeenCalledTimes(1);
    const s3Call = mockS3Send.mock.calls[0][0] as PutObjectCommand;
    expect(s3Call.input.Bucket).toBe('test-bucket');
    expect(s3Call.input.Body).toBe(JSON.stringify(validPayload));
    expect(s3Call.input.Key).toMatch(/^raw\/\d{4}\/\d{2}\/\d{2}\/txn-123\/msg-123\.json$/);

    // Verify canonical event correctness
    expect(mockSqsSend).toHaveBeenCalledTimes(1);
    const sqsCall = mockSqsSend.mock.calls[0][0] as SendMessageCommand;
    expect(sqsCall.input.QueueUrl).toBe('test-queue');
    const canonical = JSON.parse(sqsCall.input.MessageBody!);
    
    expect(canonical.eventId).toBe('msg-123');
    expect(canonical.transactionId).toBe('txn-123');
    expect(canonical.messageId).toBe('msg-123');
    expect(canonical.orderId).toBe('order-123');
    expect(canonical.action).toBe('on_search');
    expect(canonical.eventType).toBe('on_search');
    expect(canonical.participantId).toBe('bpp.com');
    expect(canonical.participantRole).toBe('SELLER');
    expect(canonical.rawPayloadUri).toMatch(/^s3:\/\/test-bucket\/raw\//);
  });

  it('invalid request: returns 400, no S3, no SQS', async () => {
    const invalidPayload = { context: { action: 'on_search' } }; // missing required fields
    
    const result = await handler(createEvent(invalidPayload));
    expect(result.statusCode).toBe(400);

    expect(mockS3Send).not.toHaveBeenCalled();
    expect(mockSqsSend).not.toHaveBeenCalled();
  });

  it('missing transaction_id or message_id: returns 400', async () => {
    const missingTxn = { ...validPayload, context: { ...validPayload.context, transaction_id: undefined } };
    
    const result = await handler(createEvent(missingTxn));
    expect(result.statusCode).toBe(400);
    expect(mockS3Send).not.toHaveBeenCalled();
  });

  it('S3 failure: returns 500, no SQS', async () => {
    mockS3Send.mockRejectedValueOnce(new Error('S3 Error'));

    const result = await handler(createEvent(validPayload));
    
    expect(result.statusCode).toBe(500);
    expect(mockS3Send).toHaveBeenCalledTimes(1);
    expect(mockSqsSend).not.toHaveBeenCalled(); // Ensure SQS is not called
  });

  it('SQS failure: returns 500, but S3 succeeded', async () => {
    mockS3Send.mockResolvedValueOnce({});
    mockSqsSend.mockRejectedValueOnce(new Error('SQS Error'));

    const result = await handler(createEvent(validPayload));
    
    expect(result.statusCode).toBe(500);
    expect(mockS3Send).toHaveBeenCalledTimes(1); // S3 still succeeded
    expect(mockSqsSend).toHaveBeenCalledTimes(1);
  });
});
