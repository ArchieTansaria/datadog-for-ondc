import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../app.js';
import { FastifyInstance } from 'fastify';
import { prisma } from '@ondc-pulse/database';

describe('Health Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /health should return status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.status).toBe('ok');
    expect(json.timestamp).toBeDefined();
  });

  it('GET /health/db should return database connected', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health/db'
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.status).toBe('database_connected');
  });
});
