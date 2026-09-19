# AWS CDK Foundation

## Purpose
Establishes the foundational AWS infrastructure as code (IaC) using AWS CDK for the ONDC Pulse Platform. This phase provisions the required storage and messaging resources to support the upcoming ingestion pipeline.

## Requirements
- Setup AWS CDK v2 with TypeScript under `infra/cdk/`.
- Provide an S3 raw-event archive bucket with secure defaults (SSL enforced, public access blocked, S3-managed encryption).
- Provide an SQS Processing Queue with an associated Dead Letter Queue (DLQ).
- Follow least-privilege IAM principles.
- Do not provision unneeded services or AWS resources (e.g. Aurora, SNS) until required.

## Architecture
The infrastructure is organized into reusable constructs:
- **`IngestionStorage`**: Encapsulates the configuration of the Amazon S3 bucket used for archiving raw ONDC payloads.
- **`ProcessingQueues`**: Encapsulates the configuration of Amazon SQS main processing queue and DLQ.

These constructs are composed into a single `FoundationStack`. This avoids premature fragmentation of stacks while keeping the codebase modular.

## Data Flow
*(Not applicable yet, as no integration points exist, but the expected future flow is: API Gateway -> Lambda -> S3 & SQS)*

## Implementation
- Added `infra/*` to npm workspaces.
- Initialized CDK v2 app in `infra/cdk`.
- Created `lib/constructs/IngestionStorage.ts` for the secure S3 bucket.
- Created `lib/constructs/ProcessingQueues.ts` for the SQS queue and DLQ.
- Created `lib/stacks/FoundationStack.ts` to instantiate these constructs.

## API / Interfaces
- S3 Bucket (raw-event archive)
- SQS Main Queue
- SQS Dead Letter Queue (DLQ)

## AWS Resources
- `AWS::S3::Bucket` (Raw Events Bucket)
- `AWS::S3::BucketPolicy` (Enforce SSL)
- `AWS::SQS::Queue` (Main Processing Queue)
- `AWS::SQS::Queue` (Dead Letter Queue)

## Database Changes
None.

## Failure Modes
- If an event processing fails in the future Lambda handler, SQS will automatically redrive it up to 3 times before moving the message to the DLQ.

## Security
- S3 bucket explicitly blocks all public access and enforces SSL transit.
- S3 bucket is encrypted using S3-managed keys (`AES256`).
- No credentials or explicit IAM wide-permissions (`*`) are hardcoded or provisioned.

## Testing
Implemented TDD tests utilizing `aws-cdk-lib/assertions`:
- `IngestionStorage.test.ts`: Verifies public access blocking, versioning, encryption, and SSL enforcement.
- `ProcessingQueues.test.ts`: Verifies that a main queue and a DLQ are created and correctly linked via `RedrivePolicy`.
Tests passed successfully.

## Operational Considerations
- The S3 removal policy defaults to `RETAIN` but can be configured as `DESTROY` (with `autoDeleteObjects: true`) via construct properties for development stacks.

## Limitations
- No events are actively published to the SQS queue or S3 bucket yet.
- CloudWatch logging and metrics are implicitly managed by the AWS constructs (e.g., S3 and SQS default metrics), but no custom metrics or dashboards are provisioned.

## Future Work
- Implement the API Gateway and Ingestion Lambda to parse ONDC callbacks, store raw payloads in S3, and publish to EventBridge/SQS.
- Implement the Order Processor Lambda to consume from the SQS processing queue and update the database.
- Determine whether SQS FIFO queues are necessary based on event ordering requirements.
