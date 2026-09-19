import { SQSEvent, SQSBatchResponse } from 'aws-lambda';
import { prisma, Prisma } from '@ondc-pulse/database';
import { z } from 'zod';
// Use the state machine service from the API codebase
import { stateMachineService } from '../../../../apps/api/src/modules/events/state-machine.service';

const canonicalEventSchema = z.object({
  eventId: z.string(),
  transactionId: z.string(),
  messageId: z.string(),
  orderId: z.string().optional(),
  action: z.string(),
  eventType: z.string(),
  timestamp: z.string(),
  participantId: z.string(),
  participantRole: z.string(),
  domain: z.string(),
  rawPayloadUri: z.string().optional(),
});

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures = [];

  for (const record of event.Records) {
    try {
      // 1. Parse & Validate canonical event
      let canonicalEvent;
      try {
        const rawBody = JSON.parse(record.body);
        canonicalEvent = canonicalEventSchema.parse(rawBody);
      } catch (err) {
        console.error(`Malformed event structure for record ${record.messageId}:`, err);
        throw err; // Throwing will catch in outer try-catch and add to batchItemFailures
      }

      // 2. Find Tenant by Participant ID
      const participant = await prisma.participant.findFirst({
        where: { 
          participantId: canonicalEvent.participantId,
          domain: canonicalEvent.domain
        }
      });

      if (!participant) {
        throw new Error(`Participant not found for ID: ${canonicalEvent.participantId}`);
      }

      const tenantId = participant.tenantId;

      // 3. Derive State
      const targetState = stateMachineService.deriveStateFromAction(canonicalEvent.action);
      
      // We will perform a single Prisma transaction to ensure atomicity
      await prisma.$transaction(async (tx) => {
        
        // Find existing order for this transaction
        const existingOrder = await tx.order.findUnique({
          where: {
            tenantId_environment_transactionId: {
              tenantId,
              environment: 'PROD',
              transactionId: canonicalEvent.transactionId
            }
          }
        });

        let orderId = canonicalEvent.orderId || existingOrder?.id;
        let validationStatus = 'VALID';

        if (!existingOrder) {
          // Create new order tracking record
          const newOrder = await tx.order.create({
            data: {
              tenantId,
              transactionId: canonicalEvent.transactionId,
              ondcOrderId: canonicalEvent.orderId,
              domain: canonicalEvent.domain,
              environment: 'PROD',
              protocolVersion: '1.2.0',
              currentState: targetState,
              buyerId: canonicalEvent.participantRole === 'BUYER' ? canonicalEvent.participantId : null,
              sellerId: canonicalEvent.participantRole === 'SELLER' ? canonicalEvent.participantId : null,
            }
          });
          orderId = newOrder.id;
        } else {
          orderId = existingOrder.id;
          const isValid = stateMachineService.isValidTransition(existingOrder.currentState, targetState);
          if (isValid) {
            // Update Order State
            await tx.order.update({
              where: { id: existingOrder.id },
              data: {
                currentState: targetState,
                lastEventAt: new Date(canonicalEvent.timestamp)
              }
            });
          } else {
            validationStatus = 'INVALID_TRANSITION';
          }
        }

        // 4. Save the OrderEvent with idempotencyKey
        await tx.orderEvent.create({
          data: {
            tenantId,
            orderId: orderId,
            eventId: canonicalEvent.messageId,
            transactionId: canonicalEvent.transactionId,
            action: canonicalEvent.action,
            eventType: targetState,
            eventTimestamp: new Date(canonicalEvent.timestamp),
            participantId: canonicalEvent.participantId,
            participantType: canonicalEvent.participantRole,
            domain: canonicalEvent.domain,
            protocolVersion: '1.2.0',
            environment: 'PROD',
            idempotencyKey: canonicalEvent.messageId,
            rawPayload: JSON.parse(record.body), // Storing the canonical event as raw payload for now
            rawPayloadRef: canonicalEvent.rawPayloadUri,
            processingStatus: 'PROCESSED',
            validationStatus: validationStatus
          }
        });
      });

    } catch (error: unknown) {
      // Handle P2002 Unique Constraint Exception (Idempotency)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.log(`Duplicate event safely ignored for messageId: ${record.messageId}`);
        continue; // Success, don't add to batchItemFailures
      }

      console.error(`Failed to process record ${record.messageId}:`, error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
