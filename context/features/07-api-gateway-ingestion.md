# AWS API Gateway & Lambda Ingestion Setup

## Purpose
Establishes the front door for ONDC network webhooks. This infrastructure receives callbacks (like `/on_confirm`) from the ONDC network, processes them via a highly scalable serverless function, and routes them to both a durable archive (S3) and an event bus (EventBridge) for asynchronous downstream processing.

## Architecture & Configuration
- **API Gateway (REST API)**: Provides the public HTTPS endpoint `POST /webhook`. It acts as a highly available, scalable proxy that directly invokes the Ingestion Lambda.
- **Node.js Lambda Function (`IngestValidateLambda`)**: A lightweight Node.js 22.x function.
- **Permissions (IAM)**: 
  - Granted `s3:PutObject` access to securely write raw JSON payloads into the `Raw Events Archive` bucket for auditability.
  - Granted `events:PutEvents` access to publish normalized events into the default EventBridge bus.

## CDK Testing (TDD)
Robust CDK unit tests (`ApiStack.test.ts`) actively verify these constraints. The tests will fail the build pipeline if anyone attempts to:
- Accidentally remove the API Gateway POST method.
- Change the Lambda runtime to an unsupported version.
- Remove the strict IAM permissions required for the Lambda to talk to S3 and EventBridge.

## Future Evolution
Currently, a placeholder Lambda handler (`ingest.ts`) is used. In the near future, the complex validation and routing logic developed in our Fastify app (`webhook ingestion handler`) will be ported into this Lambda handler, or the Fastify app will be wrapped using a tool like `@fastify/aws-lambda`.
