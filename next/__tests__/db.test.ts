import { describe, it, expect } from 'vitest';
import { prisma } from '../lib/db';

describe('Next.js Database Connectivity', () => {
  it('should be able to execute a simple query against the database', async () => {
    // 1 is a safe query to ensure connectivity without affecting data
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    expect(result).toEqual([{ result: 1 }]);
  });
});
