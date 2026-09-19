import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '@ondc-pulse/database';
import { z } from 'zod';

const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const orderRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        tenant: { select: { name: true, slug: true } },
      }
    });

    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }

    return reply.send({ data: order });
  });

  fastify.get('/:id/events', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    
    const events = await prisma.orderEvent.findMany({
      where: { orderId: id },
      orderBy: { eventTimestamp: 'asc' }
    });

    return reply.send({ data: events });
  });
};
