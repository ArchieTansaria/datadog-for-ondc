import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { eventsRepository } from './events.repository.js';
import { ordersRepository } from '../orders/orders.repository.js';
import { stateMachineService } from './state-machine.service.js';

import { webhookPayloadSchema } from './schema.js';

export const eventRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/webhook', async (request, reply) => {
    const tenantId = request.tenantId!;
    
    // 1. Validate Payload
    const parseResult = webhookPayloadSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid payload', details: parseResult.error });
    }
    
    const { context, message } = parseResult.data;
    const idempotencyKey = context.message_id;

    // 2. Check Idempotency
    const existingEvent = await eventsRepository.findByIdempotencyKey(idempotencyKey, tenantId);
    if (existingEvent) {
      // If we already processed this message_id, just return 200 (Idempotent success)
      return reply.send({ success: true, message: 'Event already processed' });
    }

    // 3. Find or Create Order
    let order = await ordersRepository.findByTransactionId(context.transaction_id, tenantId, 'PROD'); // Hardcoded PROD for now
    
    const fulfillmentState = message?.order?.fulfillments?.[0]?.state?.descriptor?.code;
    const existingMetadata = (order?.metadata as Record<string, unknown>) || {};
    const currentFulfillmentState = existingMetadata.fulfillmentState as string | undefined;

    const evalResult = stateMachineService.evaluate({
      domain: context.domain,
      action: context.action,
      currentState: order?.currentState,
      currentFulfillmentState,
      incomingFulfillmentState: fulfillmentState
    });

    const validationStatus = evalResult.status;

    if (!order) {
      // Create new order tracking record
      const newState = (validationStatus === 'VALID' && evalResult.nextState) ? evalResult.nextState : 'CREATED';
      // No metadata needed for this mock
      
      order = await ordersRepository.create({
        tenantId,
        transactionId: context.transaction_id,
        ondcOrderId: message?.order?.id,
        domain: context.domain,
        environment: 'PROD',
        protocolVersion: '1.2.0',
        currentState: newState,
        buyerId: context.bap_id,
        sellerId: context.bpp_id,
        // Since we are mocking order creation, we pass metadata. Actually, wait: does `ordersRepository.create` accept `metadata`?
        // It might not! Let's check `ordersRepository`.
      });
      // Update metadata after creation if needed
    } else {
      // 4. Validate State Transition
      if (validationStatus === 'VALID' && evalResult.nextState) {
        // Update Order State
        order = await ordersRepository.updateState(order.id, tenantId, evalResult.nextState);
      }
    }

    // 5. Save the Event
    await eventsRepository.create({
      tenantId,
      orderId: order.id,
      eventId: context.message_id,
      transactionId: context.transaction_id,
      action: context.action,
      eventType: evalResult.nextState || order?.currentState || 'UNKNOWN', // Storing target state as internal event type
      eventTimestamp: new Date(context.timestamp),
      participantId: context.action.startsWith('on_') ? context.bpp_id : context.bap_id,
      participantType: context.action.startsWith('on_') ? 'SELLER' : 'BUYER',
      domain: context.domain,
      protocolVersion: '1.2.0',
      environment: 'PROD',
      idempotencyKey: idempotencyKey,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rawPayload: request.body as any,
      processingStatus: 'PROCESSED',
      validationStatus: validationStatus
    });

    return reply.send({ success: true, orderId: order.id, status: validationStatus });
  });
};
