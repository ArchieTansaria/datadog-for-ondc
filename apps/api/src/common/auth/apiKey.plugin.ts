import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { prisma } from '@ondc-pulse/database';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    tenantId?: string;
  }
}

export const apiKeyAuth: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      reply.status(401).send({ error: 'Unauthorized', message: 'Missing or invalid x-api-key header' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { apiKey },
      select: { id: true, status: true },
    });

    if (!tenant) {
      reply.status(401).send({ error: 'Unauthorized', message: 'Invalid API Key' });
      return;
    }

    if (tenant.status !== 'ACTIVE') {
      reply.status(403).send({ error: 'Forbidden', message: 'Tenant account is inactive' });
      return;
    }

    // Inject tenantId into request context for downstream handlers
    request.tenantId = tenant.id;
  });
});
