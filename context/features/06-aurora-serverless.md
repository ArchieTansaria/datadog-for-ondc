# Aurora Serverless v2 Database Setup

## Purpose
Establishes the production-grade PostgreSQL infrastructure on AWS. This ensures that our ONDC webhook ingestion engine has a highly available, scalable, and secure backend database to persist events without exposing them to the public internet.

## Architecture & Configuration
- **AWS CDK**: Infrastructure is defined using the AWS Cloud Development Kit (CDK).
- **Network Isolation**: The database is deployed within a dedicated Amazon VPC, spanning at least two Availability Zones. It is placed in strictly isolated subnets (`PRIVATE_ISOLATED`), meaning there is no route to the internet (no IGW, no NAT Gateway).
- **Aurora Serverless v2**: 
  - Engine: PostgreSQL 15 (highly compatible with Prisma).
  - Capacity: Explicitly bounded between 0.5 and 2 ACUs (Aurora Capacity Units) to optimize for the hackathon environment while proving elastic scaling capability.
- **Enterprise Security**:
  - **Storage**: Data at rest is encrypted (`storageEncrypted: true`).
  - **Credentials**: Master database credentials are NOT hardcoded. They are dynamically generated and rotated via AWS Secrets Manager.
  - **Network Access**: The associated Security Group strictly forbids public inbound traffic (`0.0.0.0/0`) on port 5432. Access will only be granted to authorized application/Lambda security groups.

## CDK Testing (TDD)
Robust CDK unit tests (`DatabaseStack.test.ts`) actively verify these constraints. The tests will fail the build pipeline if anyone attempts to:
- Open port 5432 to the internet.
- Disable storage encryption.
- Stop using Secrets Manager for credentials.
- Bypass Serverless v2 configuration.

## Future Evolution (Phase 3+)
When deploying the Webhook Ingestion Lambda, its security group will be granted explicit ingress to this database's security group. If connection limits become an issue at high scale, an Amazon RDS Proxy can be layered between Lambda and Aurora.
