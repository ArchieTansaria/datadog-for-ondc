import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../app.js';
import { FastifyInstance } from 'fastify';
import { prisma } from '@ondc-pulse/database';

describe('Orders Routes', () => {
  let app: FastifyInstance;
  let seededOrderId: string;

  beforeAll(async () => {
    app = await buildApp();
    
    // Find the order seeded by the db:seed script
    const order = await prisma.order.findFirst({
      where: { ondcOrderId: 'O12345' }
    });

    if (!order) throw new Error("Seed order not found");
    seededOrderId = order.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /api/v1/orders/:id should return 401 without API key', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${seededOrderId}`
    });

    expect(response.statusCode).toBe(401);
  });

  it('GET /api/v1/orders/:id should return order details', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${seededOrderId}`,
      headers: { 'x-api-key': 'test-api-key-123' }
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.data.id).toBe(seededOrderId);
    expect(json.data.ondcOrderId).toBe('O12345');
    expect(json.data.tenant).toBeDefined();
  });

  it('GET /api/v1/orders/:id/events should return chronological events', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/orders/${seededOrderId}/events`,
      headers: { 'x-api-key': 'test-api-key-123' }
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.data).toBeInstanceOf(Array);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.data[0].eventType).toBe('SEARCHED');
    if (json.data.length > 1) {
      expect(json.data[1].eventType).toBe('CONFIRMED');
    }
  });
});
