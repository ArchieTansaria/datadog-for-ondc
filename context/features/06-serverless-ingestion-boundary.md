# Feature 06: Serverless Ingestion Boundary (Phase 3A)

## Objective
Implement a fully serverless, highly-available entry point for ONDC webhooks using API Gateway and Lambda. This ensures that the system can reliably receive and securely store raw webhook evidence before performing any downstream processing.

## Architecture & Scope

This feature introduces a boundary layer that operates independently of the application's relational database (Aurora). The boundary consists of:

1. **API Gateway (REST API)**: Exposes the `POST /webhook` endpoint.
2. **Usage Plan & API Key**: Serves as the native authorization mechanism, ensuring that unauthenticated traffic is dropped at the edge.
3. **Ingestion Lambda (`ingest.ts`)**: Validates the payload structure, archives it to S3, and publishes a canonical event to SQS.

The scope strictly **excludes** any connectivity to the Aurora database, EventBridge routing, or processing logic.

## Request Lifecycle

1. **Edge Authentication**: API Gateway receives the request. The `x-api-key` header is enforced via an API Stage Usage Plan.
2. **Payload Validation**: The Lambda synchronously validates the request body against the `webhookPayloadSchema` (extracted from Fastify to allow lightweight sharing). If invalid, it returns `400 Bad Request`.
3. **Raw Archiving (S3)**: The exact, unmodified JSON payload is written to the `RawEventsBucket` in S3. 
   - Path format: `raw/YYYY/MM/DD/<transaction_id>/<message_id>.json`
   - If S3 upload fails, the function returns `500 Internal Server Error` and does NOT publish to SQS.
4. **Queue Publishing (SQS)**: A canonical event (a flattened metadata object containing the S3 URI) is published to the `processingQueue`.
   - If SQS publish fails, the function returns `500 Internal Server Error`. The S3 object remains as an orphaned archive record (safe for debugging/retries).
5. **Response**: A `200 OK` is returned to the client acknowledging successful receipt.

## Key Decisions

- **API Key over Custom Authorizer**: To strictly adhere to the requirement that Phase 3A must not connect to Aurora, we utilize API Gateway's built-in API Key management instead of migrating the database-backed Fastify `x-api-key` validation to a Lambda Authorizer.
- **Shared Schema**: The Zod schema (`webhookPayloadSchema`) was extracted from the monolithic `events.routes.ts` file into a standalone `schema.ts`. This allows the CDK Lambda to import validation logic without dragging in Fastify and other web server dependencies.
- **No EventBridge**: Early placeholder code in CDK granted the Lambda `PutEvents` permission to an EventBus. This was removed, as the architectural decision routes traffic directly to SQS for downstream processing.

## Validation & Observability

- **Unit Tests**: The lambda handler is fully unit-tested with Vitest to ensure correct error handling, schema enforcement, and exact payload archiving.
- **CDK Assertions**: The infrastructure definitions strictly assert the presence of API Keys, SQS permissions, and the absence of EventBridge/VPC/Aurora permissions.
