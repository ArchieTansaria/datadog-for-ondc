# @ondc-pulse/api

This is the primary Fastify backend API for the ONDC Pulse platform.

## Purpose
This folder handles all incoming HTTP requests for the platform. It serves the REST API endpoints and relies on `@ondc-pulse/database` for persistence.

## Key Files & Directories
- **`src/server.ts`**: The main entry point. Sets up Pino logging and boots the Fastify app on the configured port.
- **`src/app.ts`**: Contains the `buildApp()` function which creates the Fastify instance, registers the error handler, and mounts the module routes (`/health`, `/api/v1/orders`).
- **`src/common/errors/errorHandler.ts`**: Centralized Fastify error handler that translates standard errors and `ZodError` validation failures into standard HTTP JSON responses.
- **`src/modules/`**: Contains the domain-driven modular features. Each module should contain its own routes, validation schemas (Zod), tests, and (in future phases) services and repositories.

## Rules for AI Agents
- **Testing**: All endpoints must have integration tests. See `*.test.ts` files inside module folders. Run tests from root via `npm test` or inside this folder using `npm run test`.
- **Validation**: All incoming requests MUST be validated with `Zod` schemas. Do not trust raw request parameters or bodies.
- **Do not hallucinate APIs**: If you need to hit an endpoint, verify the exact route in `app.ts` and the specific module route files first.
