# Feature 08: Downstream Processing (Phase 3B)

## Objective
Implement a fully serverless, highly-available consumer for canonical events published by the Ingestion Boundary (Phase 3A). This processor is responsible for retrieving events from SQS, applying business state logic (via `StateMachineService`), and persisting updates natively into Aurora PostgreSQL using Prisma within an atomic transaction.

## Architecture & Scope

This feature integrates the event queue with the persistent datastore in a decoupled and idempotent manner:

1. **SQS Event Source Mapping**: The SQS `MainQueue` triggers the Processor Lambda via batches (up to 10 records).
2. **Processor Lambda (`processor.ts`)**: The core domain handler running in an isolated VPC subnet.
3. **Aurora PostgreSQL Integration**: Uses Prisma Client inside a `$transaction` to safely persist the canonical event and modify Order states.
4. **Secrets Manager VPC Endpoint**: Ensures the Lambda can retrieve DB credentials securely within its isolated subnet.

## Request Lifecycle

1. **SQS Batch Processing**: The SQS event source mapping invokes the Processor Lambda, passing an array of `SQSEvent.Record`.
2. **Tenant Resolution**: Since the Ingestion Lambda does not know the tenant context, the Processor Lambda looks up the Tenant based on the `participantId` embedded in the canonical event.
3. **State Machine Transition**: It leverages the existing `StateMachineService` (shared from the Fastify app) to determine the next valid domain state for the `Order`.
4. **Atomic Transaction**:
   - Updates (or creates) the `Order` tracking record with the new state.
   - Inserts a new `OrderEvent` capturing the historical log and idempotency key.
5. **Idempotency (Duplicate Handling)**: Standard SQS guarantees *at-least-once* delivery. We map ONDC's `context.message_id` as a `@unique` index on `OrderEvent.idempotency_key`. If Prisma throws `P2002`, the Lambda treats it as "duplicate safely ignored", discarding the failure so SQS can successfully delete it.
6. **Partial Batch Failures**: For malformed events or transient DB connection errors, the handler captures the error and returns `{ batchItemFailures: [{ itemIdentifier: record.messageId }] }`. This signals to SQS to retry only the failed records up to 5 times (based on DLQ `maxReceiveCount`).

## Key Decisions

- **Direct Subnet Injection (Private Isolated)**: The lambda is securely provisioned in `PRIVATE_ISOLATED` subnets of `DatabaseVpc`. It has absolutely no internet access.
- **Explicit Ingress via CfnSecurityGroupIngress**: To prevent CDK cyclic dependencies between `ApiStack` and `DatabaseStack`, we created an explicit `CfnSecurityGroupIngress` within `ApiStack` that grants the processor lambda SG port 5432 access into the Aurora SG.
- **Secrets Manager VPC Endpoint**: With no NAT Gateway (to save costs and improve security), Secrets Manager access requires a VPC Interface Endpoint. This was successfully added to the `DatabaseStack`.
- **Lambda Timeout & SQS Visibility**: Lambda timeout was configured to `5 seconds`, and SQS visibility timeout to `30 seconds` to strictly adhere to AWS recommendations (Visibility timeout >= 6 * Lambda timeout).

## Validation & Observability

- **Vitest Mocking (TDD)**: The business logic in `processor.ts` was comprehensively driven by unit tests using Vitest (`mockPrismaTransaction`), validating exact idempotency behavior (`P2002` bypass) and partial batch failures.
- **Dead-Letter Queues (DLQ)**: By increasing `maxReceiveCount` to 5 and properly returning batch item failures, we guarantee that poison pills gracefully end up in the DLQ instead of looping infinitely or being dropped.
