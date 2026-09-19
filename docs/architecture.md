# Architecture Documentation

This document describes the foundational architecture for the ONDC Pulse Platform.

## Project Structure (Monorepo)
The repository leverages npm workspaces and is split into:
- **`apps/api/`**: The core Fastify API server exposing ingest endpoints and dashboards APIs.
- **`packages/database/`**: Shared Prisma schema, clients, and database connection pools.

## Technology Stack
- **API Framework:** Fastify (high-performance Node.js framework)
- **Database:** PostgreSQL (relational integrity, scaling)
- **ORM:** Prisma (type-safe queries, migration management)
- **Language:** strict TypeScript
- **Testing:** Vitest
- **Logging:** Pino + Pino Pretty

## Design Patterns
1. **Modular Monolith**: Code is logically isolated in `apps/api/src/modules/`. Each module will contain its route, schema, repository, and services (Phase 1 currently in-lines logic for speed, but directories are prepared).
2. **Tenant First Boundaries**: All database tables and repositories strictly enforce `tenant_id` boundaries.
3. **API Validation**: Zod is used to validate all incoming inputs dynamically within Fastify schema.

## Future (Phase 2)
The next phase of the project will focus on distributed ingestion by deploying the system onto AWS utilizing:
- **Amazon API Gateway + AWS Lambda** for ingestion.
- **Amazon EventBridge + SQS** for resilient asynchronous processing.
- **Amazon Aurora PostgreSQL** for database clustering.
- **Amazon Bedrock** for GenAI intelligence over incident data.
