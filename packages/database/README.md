# @ondc-pulse/database

This package encapsulates the Prisma ORM, database schema, and migration logic for the ONDC Pulse Platform.

## Purpose
This folder acts as the single source of truth for all database interactions. Agents should read the `prisma/schema.prisma` file to understand the entities and relationships. 

## Key Files & Functions
- **`prisma/schema.prisma`**: Defines all database models (`Tenant`, `User`, `Participant`, `Order`, `OrderEvent`, `Incident`, `SLARule`, `AuditEvent`). Uses PostgreSQL.
- **`prisma/seed.ts`**: Contains the logic to seed the database with synthetic B2B ONDC order scenarios. 
- **`src/client.ts`**: Exports the initialized `PrismaClient` instance. This is the client imported by the API app to query the database.
- **`src/index.ts`**: The main entry point that exports the Prisma client.

## Rules for AI Agents
- **Do not hallucinate schema fields.** Always verify against `prisma/schema.prisma` before querying.
- To run migrations, use `npm run db:migrate -w @ondc-pulse/database`.
- If you modify the schema, you MUST run a new migration and generate the client before running tests.
