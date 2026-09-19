# Clean Architecture Refactoring

## Purpose
Abstracts the database interaction logic away from the Fastify HTTP route handlers into dedicated **Repository** classes. This is a crucial foundation for Phase 2, enabling the upcoming Webhook Ingestion Engine to execute database operations (like querying orders or saving events) without relying on HTTP contexts.

## Architecture
- **Layered Design**: HTTP Handlers (Routes) -> Repositories -> Database (Prisma).
- **Tenant Isolation**: Every repository method explicitly requires a `tenantId` parameter, enforcing strict multi-tenant isolation at the data access layer.

## Implementation Details
- **`orders.repository.ts`**: Encapsulates `prisma.order` calls. Added methods for querying by `id` and `transactionId`, as well as creating new orders and updating an order's `currentState`.
- **`events.repository.ts`**: Encapsulates `prisma.orderEvent` calls. Added methods for fetching chronological events for an order, checking for duplicate events via `idempotencyKey`, and creating new raw events.
- **`orders.routes.ts`**: Refactored to strip out raw Prisma calls, replacing them with `ordersRepository` and `eventsRepository` method invocations.

## Testing
- The existing integration tests (`orders.test.ts`) executed flawlessly post-refactoring, validating that the API contract and data access remain entirely unbroken.
