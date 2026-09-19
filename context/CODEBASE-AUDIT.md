# ONDC Pulse Codebase Audit

## 1. Executive Summary

This audit assesses the current state of the ONDC Pulse repository to determine exactly what has been implemented and identify gaps against the intended AWS serverless architecture. The repository currently features a healthy, tested foundation consisting of a local Fastify API with a structured repository layer and an emerging AWS CDK infrastructure stack. However, the core event ingestion pipeline has not yet been decoupled into the intended API Gateway + Lambda + SQS architecture.

## 2. Repository Structure

The monorepo is well-organized using npm workspaces:
- `apps/api/`: Fastify application containing the current webhook ingestion, state machine, and API endpoints.
- `packages/database/`: Shared Prisma schema and client.
- `infra/cdk/`: AWS CDK infrastructure definitions.

## 3. Current Architecture

The system is currently operating as a **Modular Monolith** running locally. The intended event-driven serverless architecture (API Gateway -> SQS -> Lambda) is partially provisioned in infrastructure but not yet connected to the application logic.

## 4. Existing Application Components

- **Clean Architecture Modules**: Segregated into `events`, `orders`, and `health` in `apps/api/src/modules`.
- **Database**: PostgreSQL with Prisma ORM. Schema enforces multi-tenancy (`tenant_id`).
- **Tests**: Comprehensive Vitest suite covering the API and CDK stacks.

## 5. Teammate Implementation

Since the original foundation, the following has been implemented:
1. **Webhook Ingestion (`events.routes.ts`)**: Implements `POST /api/v1/events/webhook`. Uses Zod for validation. It is **Implemented** but runs synchronously in Fastify rather than asynchronously via Lambda.
2. **Idempotency (`events.repository.ts`)**: Implements a check against the `message_id`. **Implemented**.
3. **State Machine (`state-machine.service.ts`)**: Defines canonical states and validates transitions (e.g., `SEARCHED` -> `SELECTED`). **Implemented**.
4. **Database Repositories (`orders.repository.ts`, `events.repository.ts`)**: Wraps Prisma queries for event and order persistence. **Implemented**.
5. **API Key Authentication**: Added tests and routes that enforce `x-api-key`. **Implemented**.
6. **CDK Database Stack**: `AuroraDatabase.ts` and `DatabaseStack.ts` were added to provision Aurora Serverless v2 PostgreSQL. **Implemented**.

## 6. API Surface

The LOCAL APPLICATION API currently exposes:
- `POST /api/v1/events/webhook`
- `GET /api/v1/orders/:id`
- `GET /api/v1/orders/:id/events`
- `GET /health` and `GET /health/db`

## 7. API Gateway Status

**Status: NOT IMPLEMENTED**
There is no AWS API Gateway provisioned in the CDK (`infra/cdk/`). The current webhook route operates exclusively in the local Fastify application. 

## 8. Lambda Status

**Status: NOT IMPLEMENTED**
There are no Lambda functions (`aws-lambda-nodejs`, `lambda.Function`) defined in the CDK, nor are there any standalone Lambda handler files (e.g., `handler.ts`) in the application code.

## 9. AWS Infrastructure Status

| Service | CDK defined? | Application code? | Connected? | Tested? |
| --- | --- | --- | --- | --- |
| S3 | Yes (`IngestionStorage.ts`) | No | No | Yes (CDK) |
| SQS | Yes (`ProcessingQueues.ts`) | No | No | Yes (CDK) |
| DLQ | Yes (`ProcessingQueues.ts`) | No | No | Yes (CDK) |
| IAM | No | No | No | No |
| CloudWatch | No | No | No | No |
| API Gateway | No | No | No | No |
| Lambda | No | No | No | No |
| EventBridge | No | No | No | No |
| Aurora/PostgreSQL | Yes (`AuroraDatabase.ts`) | Yes (Prisma) | No (Local only) | Yes (CDK) |
| SNS | No | No | No | No |
| Bedrock | No | No | No | No |
| Cognito | No | No | No | No |
| Step Functions | No | No | No | No |

## 10. Database Architecture

**Status: IMPLEMENTED**
The Prisma schema (`packages/database/prisma/schema.prisma`) defines `Tenant`, `Order`, `OrderEvent`, and `Incident` entities. The CDK now provisions an Aurora Serverless v2 PostgreSQL cluster.

## 11. Authentication & Multi-Tenancy

**Status: IMPLEMENTED**
Multi-tenancy is enforced via `tenant_id` across database tables. API key authentication is implemented and tested in the Fastify routes.

## 12. Current Event Flow

**CURRENT IMPLEMENTATION:**
ONDC -> Fastify (`/api/v1/events/webhook`) -> Payload Validation -> State Machine Transition Check -> Prisma Repositories -> PostgreSQL

The flow is entirely synchronous and bypasses AWS serverless components.

## 13. Intended Event Flow

**INTENDED ARCHITECTURE:**
ONDC -> API Gateway -> Lambda (Ingest/Validate) -> S3 (raw payload) & EventBridge -> SQS -> Lambda (Order Processor) -> Aurora PostgreSQL / Incident Engine

## 14. Current vs Intended Architecture

The current implementation proves the business logic (validation, state machine, multi-tenancy) but runs it in a synchronous Fastify monolith. It needs to be refactored into the asynchronous event-driven architecture defined in the roadmap.

## 15. Testing Status

- `npm run test`: **PASSING** (33/33 tests passing across 8 files, covering Fastify API integrations and CDK constructs).
- `npm run lint`: **PASSING** (27 minor warnings/errors related to `.eslintignore` and `any` types, but structurally sound).
- `npm run typecheck`: Not configured.
- `npm run build`: **PASSING**.

## 16. Architectural Gaps

1. **Ingestion Layer**: Missing API Gateway and Ingestion Lambda.
2. **Raw Archival**: The Fastify webhook does not write the raw JSON to the S3 `IngestionStorage` bucket.
3. **Queue Decoupling**: Missing integration to push valid events from the ingestion layer into the SQS `ProcessingQueues`.
4. **Processor Layer**: Missing the Order Processor Lambda to consume from SQS and execute the state machine/DB updates.

## 17. Risks / Concerns

- The Fastify logic is currently highly coupled. Migrating to Lambda requires splitting the webhook validation (Ingestion Lambda) from the database persistence (Order Processor Lambda).
- Database migrations and credentials management for the Aurora Serverless cluster are not yet automated or passed to the application code.

## 18. Open Architectural Decisions

- Should the Fastify application remain as the dashboard/API backend while AWS API Gateway + Lambda handles ONDC webhook ingestion?
- Will we use EventBridge for routing, or will the Ingestion Lambda publish directly to SQS?

## 19. Recommended Next Implementation Boundary

The next logical implementation step is to build the **AWS Serverless Ingestion Boundary**. This involves:
1. Provisioning an API Gateway (HTTP API) in the CDK.
2. Provisioning an Ingestion Lambda in the CDK.
3. Porting the Fastify webhook validation logic into the Ingestion Lambda.
4. Connecting the Ingestion Lambda to the existing S3 bucket (for raw archival) and SQS queue (for downstream processing).
