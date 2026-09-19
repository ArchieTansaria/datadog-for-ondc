# Fastify API Key Authentication

## Purpose
Secures the Fastify HTTP backend using an API Key strategy. Since ONDC Pulse is an infrastructure observability and logging platform intended for B2B server-to-server communication (webhook ingestion), API Keys provide a reliable, tenant-specific authorization mechanism without the overhead of rotating JWTs.

## Architecture
- **Schema**: The `Tenant` model in PostgreSQL is the central identity. Each tenant is assigned a unique `api_key`.
- **Middleware**: A custom Fastify plugin (`apiKey.plugin.ts`) intercepts incoming requests, validates the `x-api-key` header against the database, and injects the resolved `tenantId` into the `FastifyRequest` context.

## Implementation Details
- **Database (`schema.prisma`)**: Added the `api_key` field to the `Tenant` model with a `@unique` constraint.
- **Fastify Plugin (`apiKey.plugin.ts`)**: 
  - Extracts `x-api-key`.
  - Rejects if missing or invalid (`401 Unauthorized`).
  - Rejects if the Tenant status is not `ACTIVE` (`403 Forbidden`).
  - Attaches `request.tenantId` for downstream route handlers.
- **App Registration (`app.ts`)**: The authentication hook is attached to the `/api/v1` prefix. All domain routes (like `/orders` and soon `/events`) are automatically protected.

## Security
- API Keys map 1:1 to a specific Tenant, strictly isolating data access across organizations.
- Requests lacking headers fail immediately with standard JSON error responses.

## Future Work
- Currently, API Keys are stored in plaintext. In a future iteration for higher security, API Keys should be hashed (e.g., using `bcrypt` or `argon2`) in the database, with only the hashes stored. 
- Implement an administrative endpoint for Tenants to rotate or revoke their API Keys.
