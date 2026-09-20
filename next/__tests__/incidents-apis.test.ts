import { describe, it, expect, vi } from 'vitest';
import { GET as getIncidents } from '../app/api/incidents/route';
import { GET as getIncidentDetail } from '../app/api/incidents/[id]/route';
import { POST as postRca } from '../app/api/incidents/[id]/rca/route';

// Mock the prisma client
vi.mock('../lib/db', () => ({
  prisma: {
    incident: {
      findMany: vi.fn().mockResolvedValue([{ id: 'inc-1', status: 'OPEN' }]),
      count: vi.fn().mockResolvedValue(1),
      findUnique: vi.fn().mockResolvedValue({ id: 'inc-1', status: 'OPEN', order: {} }),
      update: vi.fn().mockImplementation((args) => Promise.resolve({ ...args.data }))
    }
  }
}));

describe('Incidents APIs', () => {
  it('GET /api/incidents should support pagination', async () => {
    // Construct a mock NextRequest
    const req = new Request('http://localhost/api/incidents?page=1&pageSize=10');
    // @ts-ignore
    req.nextUrl = new URL('http://localhost/api/incidents?page=1&pageSize=10');

    const response = await getIncidents(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.data.length).toBe(1);
    expect(data.pagination.total).toBe(1);
  });

  it('GET /api/incidents/[id] should return incident details', async () => {
    const req = new Request('http://localhost/api/incidents/inc-1');
    const response = await getIncidentDetail(req as any, { params: { id: 'inc-1' } });
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.id).toBe('inc-1');
  });

  it('POST /api/incidents/[id]/rca should generate RCA and update metadata', async () => {
    const req = new Request('http://localhost/api/incidents/inc-1/rca', { method: 'POST' });
    const response = await postRca(req as any, { params: { id: 'inc-1' } });
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.metadata.rca).toBeDefined();
    expect(data.metadata.rca.provider).toBe('mock');
    expect(data.metadata.rca.evidence.confidence).toBe(99.9);
  });
});
