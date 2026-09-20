import { SQSEvent, SQSBatchResponse } from 'aws-lambda';
import { z } from 'zod';
import { stateMachineService } from '../../../../apps/api/src/modules/events/state-machine.service';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({});

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
  fulfillmentState: z.string().optional(),
  rawPayloadUri: z.string().optional(),
});

const slaCheckSchema = z.object({
  type: z.literal('SLA_CHECK'),
  orderId: z.string(),
  expectedState: z.string(),
  expectedFulfillmentState: z.string().optional(),
  ruleId: z.string(),
  thresholdDate: z.string(),
});

let isDbConfigured = false;
export const resetDbConfigForTesting = () => { isDbConfigured = false; };
const secretsClient = new SecretsManagerClient({});

const configureDatabase = async () => {
  if (isDbConfigured) return;
  const secretArn = process.env.DATABASE_SECRET_ARN;
  if (!secretArn) throw new Error('DATABASE_SECRET_ARN environment variable is missing');
  const response = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretArn }));
  if (!response.SecretString) throw new Error('Secret string is empty');
  const secret = JSON.parse(response.SecretString);
  const { username, password, host, port, dbname } = secret;
  if (!username || !password || !host || !port) throw new Error('Database secret is missing required fields');
  const databaseName = dbname && dbname !== 'postgres' ? dbname : 'ondc_pulse';
  const encodedUser = encodeURIComponent(username);
  const encodedPass = encodeURIComponent(password);
  process.env.DATABASE_URL = `postgresql://${encodedUser}:${encodedPass}@${host}:${port}/${databaseName}?schema=public`;
  isDbConfigured = true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processSlaCheck(slaCheck: z.infer<typeof slaCheckSchema>, prisma: any) {
  const order = await prisma.order.findUnique({ where: { id: slaCheck.orderId } });
  if (!order) return;

  const orderFulfillmentState = (order.metadata as any)?.fulfillmentState;
  const stateMatches = order.currentState === slaCheck.expectedState;
  const fulfillmentMatches = !slaCheck.expectedFulfillmentState || orderFulfillmentState === slaCheck.expectedFulfillmentState;

  if (stateMatches && fulfillmentMatches) {
    if (new Date().getTime() >= new Date(slaCheck.thresholdDate).getTime()) {
      const existingIncident = await prisma.incident.findFirst({
        where: {
          orderId: order.id,
          incidentType: 'SLA_BREACH',
          status: { in: ['OPEN', 'ACKNOWLEDGED'] }
        }
      });
      // Further filter by ruleId manually since metadata filtering in Prisma JSON can be tricky depending on version
      const isSameRule = existingIncident?.metadata && (existingIncident.metadata as any).ruleId === slaCheck.ruleId;
      
      if (!existingIncident || !isSameRule) {
        const rule = await prisma.sLARule.findUnique({ where: { id: slaCheck.ruleId } });
        if (rule) {
          await prisma.incident.create({
            data: {
              tenantId: order.tenantId,
              orderId: order.id,
              incidentType: 'SLA_BREACH',
              severity: rule.severity,
              status: 'OPEN',
              title: `SLA Breach: ${rule.name}`,
              description: `Order stuck in ${order.currentState} beyond threshold.`,
              detectedAt: new Date(),
              metadata: {
                ruleId: rule.id,
                ruleName: rule.name,
                fromState: rule.fromState,
                toState: rule.toState,
                thresholdMs: rule.thresholdMs,
                lastEventAt: order.lastEventAt.toISOString()
              }
            }
          });
          console.log(`SLA Breach Incident created for order ${order.id}`);
        }
      }
    } else {
      console.log(`SLA check premature for order ${order.id} (threshold updated)`);
    }
  } else {
    console.log(`SLA check stale for order ${order.id} - progressed to ${order.currentState} / ${orderFulfillmentState}`);
  }
}

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures = [];
  try {
    await configureDatabase();
  } catch (error) {
    console.error('Failed to configure database:', error);
    return { batchItemFailures: event.Records.map(r => ({ itemIdentifier: r.messageId })) };
  }
  const { prisma, Prisma } = await import('@ondc-pulse/database');

  for (const record of event.Records) {
    try {
      const rawBody = JSON.parse(record.body);
      if (rawBody.type === 'SLA_CHECK') {
        const slaCheck = slaCheckSchema.parse(rawBody);
        await processSlaCheck(slaCheck, prisma);
        continue;
      }

      const canonicalEvent = canonicalEventSchema.parse(rawBody);
      const participant = await prisma.participant.findFirst({
        where: { participantId: canonicalEvent.participantId, domain: canonicalEvent.domain }
      });
      if (!participant) throw new Error(`Participant not found for ID: ${canonicalEvent.participantId}`);
      const tenantId = participant.tenantId;

      const orderId = await prisma.$transaction(async (tx: any) => {
        const existingOrder = await tx.order.findUnique({
          where: { tenantId_environment_transactionId: { tenantId, environment: 'PROD', transactionId: canonicalEvent.transactionId } }
        });
        const existingMetadata = (existingOrder?.metadata as Record<string, any>) || {};
        const evalResult = stateMachineService.evaluate({
          domain: canonicalEvent.domain,
          action: canonicalEvent.action,
          currentState: existingOrder?.currentState,
          currentFulfillmentState: existingMetadata.fulfillmentState as string | undefined,
          incomingFulfillmentState: canonicalEvent.fulfillmentState
        });
        const validationStatus = evalResult.status;
        let currentOrderId = canonicalEvent.orderId || existingOrder?.id;
        const newState = (validationStatus === 'VALID' && evalResult.nextState) ? evalResult.nextState : (existingOrder?.currentState || 'CREATED');

        if (!existingOrder) {
          const newOrder = await tx.order.create({
            data: {
              tenantId,
              transactionId: canonicalEvent.transactionId,
              ondcOrderId: canonicalEvent.orderId,
              domain: canonicalEvent.domain,
              environment: 'PROD',
              protocolVersion: '1.2.0',
              currentState: newState,
              buyerId: canonicalEvent.participantRole === 'BUYER' ? canonicalEvent.participantId : null,
              sellerId: canonicalEvent.participantRole === 'SELLER' ? canonicalEvent.participantId : null,
              lastEventAt: new Date(canonicalEvent.timestamp),
              metadata: (validationStatus === 'VALID' && evalResult.nextFulfillmentState) ? { fulfillmentState: evalResult.nextFulfillmentState } : {}
            }
          });
          currentOrderId = newOrder.id;
        } else if (validationStatus === 'VALID' && evalResult.nextState) {
          const updatedMetadata = { ...existingMetadata };
          if (evalResult.nextFulfillmentState) updatedMetadata.fulfillmentState = evalResult.nextFulfillmentState;
          await tx.order.update({
            where: { id: existingOrder.id },
            data: {
              currentState: evalResult.nextState,
              lastEventAt: new Date(canonicalEvent.timestamp),
              metadata: Object.keys(updatedMetadata).length > 0 ? updatedMetadata : undefined
            }
          });
        }

        await tx.orderEvent.create({
          data: {
            tenantId,
            orderId: currentOrderId || '00000000-0000-0000-0000-000000000000',
            eventId: canonicalEvent.messageId,
            transactionId: canonicalEvent.transactionId,
            action: canonicalEvent.action,
            eventType: evalResult.nextState || existingOrder?.currentState || 'UNKNOWN',
            eventTimestamp: new Date(canonicalEvent.timestamp),
            participantId: canonicalEvent.participantId,
            participantType: canonicalEvent.participantRole,
            domain: canonicalEvent.domain,
            protocolVersion: '1.2.0',
            environment: 'PROD',
            idempotencyKey: canonicalEvent.messageId,
            rawPayload: rawBody,
            rawPayloadRef: canonicalEvent.rawPayloadUri,
            processingStatus: 'PROCESSED',
            validationStatus: validationStatus
          }
        });

        // SLA Check Scheduling
        if (validationStatus === 'VALID' && process.env.PROCESSING_QUEUE_URL) {
          const newFulfillmentState = evalResult.nextFulfillmentState || existingMetadata?.fulfillmentState;
          
          // Only pull rules that either match the expected state precisely, or if the rule specifies fulfillment, match that too.
          // Note: for a true DB implementation, this would look at rule.fromFulfillmentState. We simulate by fetching by fromState.
          const activeRules = await tx.sLARule.findMany({
            where: { tenantId, enabled: true, fromState: newState }
          });
          
          for (const rule of activeRules) {
            if (rule.thresholdMs > 900000) {
              console.error(`SLA rule ${rule.name} exceeds SQS max delay of 15 minutes. Ignoring.`);
              continue;
            }
            
            // Allow rules to specify fulfillment state in metadata
            const ruleFulfillmentState = (rule.metadata as any)?.fromFulfillmentState;
            if (ruleFulfillmentState && ruleFulfillmentState !== newFulfillmentState) {
              continue;
            }

            const slaCheck = {
              type: 'SLA_CHECK',
              orderId: currentOrderId,
              expectedState: newState,
              expectedFulfillmentState: ruleFulfillmentState,
              ruleId: rule.id,
              thresholdDate: new Date(new Date(canonicalEvent.timestamp).getTime() + rule.thresholdMs).toISOString()
            };
            await sqsClient.send(new SendMessageCommand({
              QueueUrl: process.env.PROCESSING_QUEUE_URL,
              MessageBody: JSON.stringify(slaCheck),
              DelaySeconds: Math.floor(rule.thresholdMs / 1000)
            }));
          }
        }
        return currentOrderId;
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.log(`Duplicate event safely ignored for messageId: ${record.messageId}`);
        continue;
      }
      console.error(`Failed to process record ${record.messageId}:`, error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }
  return { batchItemFailures };
};
