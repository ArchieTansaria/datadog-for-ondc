import { describe, it, expect, vi } from 'vitest';
import { GET as getMetrics } from '../app/api/dashboard/metrics/route';
import { GET as getTimeline } from '../app/api/dashboard/timeline/route';

// Mock the prisma client
vi.mock('../lib/db', () => ({
  prisma: {
    order: {
      count: vi.fn().mockResolvedValue(150),
    },
    incident: {
      count: vi.fn().mockResolvedValue(5),
    },
    $queryRaw: vi.fn().mockResolvedValue([
      { time_bucket: new Date('2026-09-20T10:00:00Z'), p50: 150.5, p95: 310.2 }
    ])
  }
}));

describe('Dashboard APIs', () => {
  it('GET /api/dashboard/metrics should return aggregate metrics', async () => {
    const response = await getMetrics();
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(data.ordersCount).toBe(150);
    expect(data.slaBreachesCount).toBe(5);
    expect(data.activeExceptionsCount).toBe(5);
  });

  it('GET /api/dashboard/timeline should return p50 and p95 latencies', async () => {
    const response = await getTimeline();
    expect(response.status).toBe(200);
    const data = await response.json();
    
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].p50).toBe(150.5);
    expect(data[0].p95).toBe(310.2);
    expect(data[0].timestamp).toBe('2026-09-20T10:00:00.000Z');
  });
});
