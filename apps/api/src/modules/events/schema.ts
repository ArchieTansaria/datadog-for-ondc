import { z } from 'zod';

// The expected shape of an incoming ONDC Webhook Payload
export const webhookPayloadSchema = z.object({
  context: z.object({
    domain: z.string(),
    action: z.string(),
    bap_id: z.string(),
    bpp_id: z.string(),
    transaction_id: z.string(),
    message_id: z.string(), // used as idempotency key
    timestamp: z.string(),
  }),
  message: z.object({
    order: z.object({
      id: z.string().optional(),
    }).optional()
  }).optional()
});
