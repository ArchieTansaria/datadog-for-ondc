import { describe, it, expect, vi } from 'vitest';
import { POST as postSimulate } from '../app/api/simulate/route';
import { GET as getSimulateStatus } from '../app/api/simulate/[id]/route';

// Mock SQS Client
vi.mock('@aws-sdk/client-sqs', () => {
  return {
    SQSClient: vi.fn().mockImplementation(() => ({
      send: vi.fn().mockResolvedValue({})
    })),
    SendMessageCommand: vi.fn()
  };
});

// Mock Prisma
vi.mock('../lib/db', () => ({
  prisma: {
    orderEvent: {
      findMany: vi.fn().mockResolvedValue([
        { action: 'search', eventTimestamp: new Date() },
        { action: 'on_search', eventTimestamp: new Date() }
      ])
    },
    order: {
      findUnique: vi.fn().mockResolvedValue({ id: 'order-1' }),
      findFirst: vi.fn().mockResolvedValue({ id: 'order-1' })
    },
    incident: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'inc-1', title: 'SLA Breach: Confirm to Status', severity: 'CRITICAL', detectedAt: new Date() }
      ])
    }
  }
}));

describe('Simulator API', () => {
  it('POST /api/simulate should generate events and return a transactionId', async () => {
    const req = new Request('http://localhost/api/simulate', {
      method: 'POST',
      body: JSON.stringify({ dropAssignment: true })
    });
    const response = await postSimulate(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.transactionId).toBeDefined();
    expect(data.eventsScheduled).toBeGreaterThan(0);
  });

  it('GET /api/simulate/[id] should return polled business logs', async () => {
    const req = new Request('http://localhost/api/simulate/txn-1');
    const response = await getSimulateStatus(req as any, { params: { id: 'txn-1' } });
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.logs.length).toBe(3); // 2 events + 1 incident
    expect(data.status).toBe('FAILED'); // Since there is an incident
  });
});
