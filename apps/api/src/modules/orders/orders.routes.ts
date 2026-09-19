import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ordersRepository } from './orders.repository.js';
import { eventsRepository } from '../events/events.repository.js';

const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const orderRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const tenantId = request.tenantId!;
    
    const order = await ordersRepository.findById(id, tenantId);

    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }

    return reply.send({ data: order });
  });

  fastify.get('/:id/events', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const tenantId = request.tenantId!;
    
    const events = await eventsRepository.findByOrderId(id, tenantId);

    return reply.send({ data: events });
  });
};
