import { describe, it, expect, vi, beforeEach } from 'vitest';

// We must mock DB before importing handler
vi.mock('@ondc-pulse/database', () => {
  return {
    prisma: {
      sLARule: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'rule-1',
            tenantId: 'tenant-1',
            name: 'Confirm to Status',
            fromState: 'CONFIRMED',
            toState: 'COMPLETED',
            thresholdMs: 120000,
            severity: 'CRITICAL',
            enabled: true
          }
        ])
      },
      order: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'order-1',
            tenantId: 'tenant-1',
            currentState: 'CONFIRMED',
            lastEventAt: new Date(Date.now() - 150000) // 150s ago (> 120s threshold)
          }
        ])
      },
      incident: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: 'inc-1' })
      }
    }
  };
});

// Mock Secrets Manager
vi.mock('@aws-sdk/client-secrets-manager', () => {
  return {
    SecretsManagerClient: vi.fn().mockImplementation(() => ({
      send: vi.fn().mockResolvedValue({
        SecretString: JSON.stringify({
          username: 'user', password: 'password', host: 'localhost', port: 5432, dbname: 'test'
        })
      })
    })),
    GetSecretValueCommand: vi.fn()
  };
});

import { handler, resetDbConfigForTesting } from '../src/lambdas/sla-engine';
import { prisma } from '@ondc-pulse/database';

describe('SLA Engine Lambda', () => {
  beforeEach(() => {
    process.env.DATABASE_SECRET_ARN = 'arn:aws:secretsmanager:region:account:secret:test';
    resetDbConfigForTesting();
    vi.clearAllMocks();
  });

  it('should detect stuck orders and create SLA breach incidents', async () => {
    await handler({});
    
    expect(prisma.sLARule.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.order.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.incident.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.incident.create).toHaveBeenCalledTimes(1);
    
    const createCall = vi.mocked(prisma.incident.create).mock.calls[0][0];
    expect(createCall.data.incidentType).toBe('SLA_BREACH');
    expect(createCall.data.severity).toBe('CRITICAL');
    expect(createCall.data.orderId).toBe('order-1');
  });
});
