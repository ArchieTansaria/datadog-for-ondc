# Health Module

This module exposes liveness and readiness checks for the API Server.

## Key Files & Functions
- **`health.routes.ts`**: 
  - `GET /`: Returns a basic `200 OK` status and timestamp to verify the Fastify process is running.
  - `GET /db`: Attempts a simple `SELECT 1` query via Prisma. Returns `200 OK` if connected, or `503 Service Unavailable` if the database connection fails.
- **`health.test.ts`**: Verifies that both health check endpoints return the correct statuses under normal conditions.

## Rules for AI Agents
- Use these endpoints to verify server startup and database connectivity during troubleshooting.
- Do not add complex business logic here.
