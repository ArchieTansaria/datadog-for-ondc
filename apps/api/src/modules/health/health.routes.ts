import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '@ondc-pulse/database';

export const healthRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  fastify.get('/db', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({ status: 'database_connected', timestamp: new Date().toISOString() });
    } catch (error) {
      request.log.error('Database connection failed in /health/db');
      return reply.status(503).send({ status: 'database_disconnected', error: String(error) });
    }
  });
};
