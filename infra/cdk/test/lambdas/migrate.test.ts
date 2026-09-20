import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handler } from '../../src/lambdas/migrate';

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn(() => ({ send: mockSend })),
  GetSecretValueCommand: vi.fn((input) => ({ input })),
}));

// Mock child_process and fs to prevent actual execution during tests
vi.mock('child_process', () => ({
  execSync: vi.fn(() => 'Migration successful'),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
}));

vi.mock('../../../../packages/database/prisma/smoke-test-seed', () => ({
  seedDatabase: vi.fn(() => Promise.resolve()),
}));

describe('Migration Lambda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_SECRET_ARN = 'arn:aws:secretsmanager:test';
    delete process.env.DATABASE_URL;
  });

  it('fetches secret and runs prisma migrate deploy', async () => {
    mockSend.mockResolvedValue({
      SecretString: JSON.stringify({
        username: 'dbuser',
        password: 'dbpassword!',
        host: 'localhost',
        port: 5432,
        dbname: 'ondc_pulse',
      }),
    });

    const result = await handler({});
    
    expect(result.success).toBe(true);
    expect(process.env.DATABASE_URL).toBe('postgresql://dbuser:dbpassword!@localhost:5432/ondc_pulse?schema=public');
    
    const { execSync } = await import('child_process');
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('migrate deploy --schema'),
      expect.any(Object)
    );
  });

  it('runs seed script when action is seed', async () => {
    mockSend.mockResolvedValue({
      SecretString: JSON.stringify({
        username: 'dbuser',
        password: 'dbpassword!',
        host: 'localhost',
        port: 5432,
        dbname: 'ondc_pulse',
      }),
    });

    const result = await handler({ action: 'seed' });
    
    expect(result.success).toBe(true);
    expect(process.env.DATABASE_URL).toBe('postgresql://dbuser:dbpassword!@localhost:5432/ondc_pulse?schema=public');
    
    const { seedDatabase } = await import('../../../../packages/database/prisma/smoke-test-seed');
    expect(seedDatabase).toHaveBeenCalled();
  });

  it('throws error if secret is missing required fields', async () => {
    mockSend.mockResolvedValue({
      SecretString: JSON.stringify({
        username: 'dbuser',
        // missing password
      }),
    });

    await expect(handler({})).rejects.toThrow('Database secret is missing required fields');
  });
});
