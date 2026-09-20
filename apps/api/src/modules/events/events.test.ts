import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../app.js';
import { FastifyInstance } from 'fastify';
import { prisma, Tenant } from '@ondc-pulse/database';
import crypto from 'crypto';

describe('Events API Integration - Webhook Ingestion', () => {
  let app: FastifyInstance;
  let tenantA: Tenant;
  const API_KEY = `test-key-${crypto.randomUUID()}`;
  const TX_ID = `tx-${crypto.randomUUID()}`;
  const messageIdSearch = `msg-search-${crypto.randomUUID()}`;
  const messageIdInit = `msg-init-${crypto.randomUUID()}`;
  let orderId: string;

  beforeAll(async () => {
    app = await buildApp();
    
    tenantA = await prisma.tenant.create({
      data: { name: 'Test Tenant', slug: `tenant-${crypto.randomUUID()}`, apiKey: API_KEY }
    });
  });

  afterAll(async () => {
    await app.close();
    
    // Teardown
    if (tenantA?.id) {
      await prisma.orderEvent.deleteMany({ where: { tenantId: tenantA.id } });
    }
    if (orderId) {
      await prisma.order.delete({ where: { id: orderId } });
    }
    if (tenantA?.id) {
      await prisma.tenant.delete({ where: { id: tenantA.id } });
    }
    
    await prisma.$disconnect();
  });

  it('should return 401 Unauthorized if x-api-key is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/events/webhook',
      payload: {}
    });
    expect(response.statusCode).toBe(401);
  });

  it('should return 400 Bad Request for invalid payload schema', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/events/webhook',
      headers: { 'x-api-key': API_KEY },
      payload: { context: { invalid: true } } // missing required fields
    });
    expect(response.statusCode).toBe(400);
  });

  it('should successfully ingest an on_search event and create a new order', async () => {
    const payload = {
      context: {
        domain: 'nic2004:60232',
        action: 'on_search',
        bap_id: 'buyer.com',
        bpp_id: 'seller.com',
        transaction_id: TX_ID,
        message_id: messageIdSearch,
        timestamp: new Date().toISOString(),
      },
      message: {
        catalog: {} // Mock catalog data
      }
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/events/webhook',
      headers: { 'x-api-key': API_KEY },
      payload
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.success).toBe(true);
    expect(json.status).toBe('VALID');
    expect(json.orderId).toBeDefined();
    
    orderId = json.orderId; // Save for cleanup and subsequent tests
    
    // Verify DB state
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    expect(order?.currentState).toBe('SEARCHED');
  });

  it('should return idempotent success if the same message_id is sent twice', async () => {
    const payload = {
      context: {
        domain: 'nic2004:60232',
        action: 'on_search',
        bap_id: 'buyer.com',
        bpp_id: 'seller.com',
        transaction_id: TX_ID,
        message_id: messageIdSearch, // Re-using the same message_id!
        timestamp: new Date().toISOString(),
      }
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/events/webhook',
      headers: { 'x-api-key': API_KEY },
      payload
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().message).toBe('Event already processed');
  });

  it('should successfully ingest an on_init event and transition the order state', async () => {
    // Note: Mathematically, SEARCHED -> INIT is an invalid skip (should go through SELECTED). 
    // This tests if our state machine correctly flags the transition as INVALID, but STILL saves the event.
    
    const payload = {
      context: {
        domain: 'nic2004:60232',
        action: 'on_init',
        bap_id: 'buyer.com',
        bpp_id: 'seller.com',
        transaction_id: TX_ID,
        message_id: messageIdInit,
        timestamp: new Date().toISOString(),
      },
      message: {
        order: {
          id: 'ONDC-ORDER-123'
        }
      }
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/events/webhook',
      headers: { 'x-api-key': API_KEY },
      payload
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    
    // The state machine should flag it as INVALID_TRANSITION because we skipped SELECTED!
    expect(json.status).toBe('INVALID_TRANSITION');
    
    // Verify the event was still saved (we don't drop data in observability platforms)
    const event = await prisma.orderEvent.findUnique({
      where: { idempotencyKey: messageIdInit }
    });
    expect(event).toBeDefined();
    expect(event?.validationStatus).toBe('INVALID_TRANSITION');
  });
});
