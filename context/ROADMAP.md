# ONDC Pulse Roadmap

This document outlines the current tasks, ownership, and phases of the ONDC Pulse Platform project. 
All AI agents must update this document upon the completion of assigned tasks.

## Phase 1: Foundation (Current Status: In Progress)
*Establish the initial repository, local infrastructure, and foundational data structures.*

- [x] **Initialize Monorepo** (Owner: AI / Human)
- [x] **PostgreSQL Schema & Prisma** (Owner: AI / Human)
- [x] **Database Seeding** (Owner: AI / Human)
- [x] **Core API Setup (Fastify, Zod)** (Owner: AI / Human)
- [x] **Test Setup (Vitest) & CI prep** (Owner: AI / Human)
- [ ] **Data Dog initial Research** (Owner: Unassigned) - *Status: Pending*

## Phase 2: Core State Engine & Ingestion (Current Status: In Progress)
*Build the deterministic state machine and robust local ingestion pipeline, paving the way for AWS.*

- [x] **API Key Authentication Middleware** (Owner: AI)
- [x] **Clean Architecture (Repositories)** (Owner: AI)
- [x] **Deterministic State Machine Engine** (Owner: AI)
- [ ] **Webhook Ingestion Handler (`POST /api/v1/events/webhook`)** (Owner: AI)
- [x] Establish AWS CDK Foundation (S3, IAM) (Owner: AI)
- [x] Implement robust DLQs (Dead Letter Queues) via SQS (Owner: AI)
- [ ] Setup AWS API Gateway and Lambda handlers for ONDC event webhooks.
- [ ] Deploy Amazon Aurora Serverless for production PostgreSQL.

## Phase 3: Observability, Alerts & AI (Future)
*Enable intelligent evaluation, monitoring, and Dashboards.*

- [ ] Implement Incident tracking based on SLA breaches.
- [ ] Integrate Datadog tracing and advanced metrics.
- [ ] Configure AWS SNS / PagerDuty webhook destinations.
- [ ] Implement Amazon Bedrock GenAI for log summarization.
