import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../app.js';
import { FastifyInstance } from 'fastify';
import { prisma } from '@ondc-pulse/database';
import crypto from 'crypto';

describe('Orders API & Auth Integration', () => {
  let app: FastifyInstance;
  
  // Test Fixtures
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tenantA: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tenantB: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderA: any;
  
  const API_KEY_A = `test-key-a-${crypto.randomUUID()}`;
  const API_KEY_B = `test-key-b-${crypto.randomUUID()}`;

  beforeAll(async () => {
    app = await buildApp();
    
    // Setup isolated test data
    tenantA = await prisma.tenant.create({
      data: { name: 'Test Tenant A', slug: `tenant-a-${crypto.randomUUID()}`, apiKey: API_KEY_A }
    });

    tenantB = await prisma.tenant.create({
      data: { name: 'Test Tenant B', slug: `tenant-b-${crypto.randomUUID()}`, apiKey: API_KEY_B }
    });

    orderA = await prisma.order.create({
      data: {
        tenantId: tenantA.id,
        transactionId: `tx-${crypto.randomUUID()}`,
        domain: 'nic2004:60232',
        environment: 'TEST',
        protocolVersion: '1.2.0',
        currentState: 'INIT'
      }
    });

    await prisma.orderEvent.create({
      data: {
        tenantId: tenantA.id,
        orderId: orderA.id,
        transactionId: orderA.transactionId,
        action: 'on_search',
        eventType: 'SEARCHED',
        eventTimestamp: new Date(),
        participantId: 'buyer-app',
        participantType: 'BUYER',
        domain: 'nic2004:60232',
        protocolVersion: '1.2.0',
        environment: 'TEST',
        idempotencyKey: `idem-${crypto.randomUUID()}`,
        rawPayload: { action: 'on_search' },
        processingStatus: 'PROCESSED',
        validationStatus: 'VALID'
      }
    });
  });

  afterAll(async () => {
    await app.close();
    
    // Teardown isolated test data
    if (orderA?.id) {
      await prisma.orderEvent.deleteMany({ where: { orderId: orderA.id } });
      await prisma.order.delete({ where: { id: orderA.id } });
    }
    
    const tenantIdsToDelete = [tenantA?.id, tenantB?.id].filter(Boolean);
    if (tenantIdsToDelete.length > 0) {
      await prisma.tenant.deleteMany({ where: { id: { in: tenantIdsToDelete } } });
    }
    
    await prisma.$disconnect();
  });

  describe('Authentication & Authorization', () => {
    it('should return 401 Unauthorized if x-api-key header is missing', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${orderA.id}`
      });
      expect(response.statusCode).toBe(401);
      expect(response.json().error).toBe('Unauthorized');
    });

    it('should return 401 Unauthorized if x-api-key is invalid', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${orderA.id}`,
        headers: { 'x-api-key': 'invalid-key-xyz' }
      });
      expect(response.statusCode).toBe(401);
      expect(response.json().error).toBe('Unauthorized');
    });
  });

  describe('GET /api/v1/orders/:id', () => {
    it('should return 400 Bad Request if ID is not a valid UUID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/not-a-uuid`,
        headers: { 'x-api-key': API_KEY_A }
      });
      expect(response.statusCode).toBe(400); // Zod validation fails
    });

    it('should return 404 Not Found if order does not exist', async () => {
      const fakeId = crypto.randomUUID();
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${fakeId}`,
        headers: { 'x-api-key': API_KEY_A }
      });
      expect(response.statusCode).toBe(404);
    });

    it('should enforce tenant isolation (404) if Tenant B queries Tenant A\'s order', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${orderA.id}`,
        headers: { 'x-api-key': API_KEY_B } // Using Tenant B's key!
      });
      expect(response.statusCode).toBe(404); // Should act like it doesn't exist
    });

    it('should return 200 OK and order details for valid request by owner', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${orderA.id}`,
        headers: { 'x-api-key': API_KEY_A }
      });
      expect(response.statusCode).toBe(200);
      
      const json = response.json();
      expect(json.data.id).toBe(orderA.id);
      expect(json.data.tenantId).toBe(tenantA.id);
      expect(json.data.currentState).toBe('INIT');
    });
  });

  describe('GET /api/v1/orders/:id/events', () => {
    it('should enforce tenant isolation for events', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${orderA.id}/events`,
        headers: { 'x-api-key': API_KEY_B } // Tenant B key
      });
      // Repository query uses tenantId, so it returns an empty array if not owned.
      expect(response.statusCode).toBe(200);
      expect(response.json().data).toHaveLength(0);
    });

    it('should return chronological events for valid request', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/orders/${orderA.id}/events`,
        headers: { 'x-api-key': API_KEY_A }
      });
      expect(response.statusCode).toBe(200);
      
      const json = response.json();
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data).toHaveLength(1);
      expect(json.data[0].eventType).toBe('SEARCHED');
      expect(json.data[0].rawPayload).toEqual({ action: 'on_search' });
    });
  });
});
