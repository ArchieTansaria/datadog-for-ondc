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

## Phase 2: Core State Engine & Ingestion (Future)
*Build the deterministic state machine and robust AWS-backed ingestion pipeline.*

- [ ] Define precise deterministic state machine rules.
- [ ] Setup AWS API Gateway and Lambda handlers for ONDC event webhooks.
- [ ] Implement robust DLQs (Dead Letter Queues) via SQS.
- [ ] Deploy Amazon Aurora Serverless for production PostgreSQL.

## Phase 3: Observability, Alerts & AI (Future)
*Enable intelligent evaluation, monitoring, and Dashboards.*

- [ ] Implement Incident tracking based on SLA breaches.
- [ ] Integrate Datadog tracing and advanced metrics.
- [ ] Configure AWS SNS / PagerDuty webhook destinations.
- [ ] Implement Amazon Bedrock GenAI for log summarization.
