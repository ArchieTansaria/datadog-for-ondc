# Orders Module

This module handles querying and manipulating ONDC Order lifecycles and Order Events.

## Key Files & Functions
- **`orders.routes.ts`**: Contains the Fastify routes for orders. 
  - `GET /:id`: Retrieves a single order by its UUID and includes basic tenant details. Validates the UUID parameter via Zod.
  - `GET /:id/events`: Retrieves the chronological state machine events (OrderEvents) for a specific order.
- **`orders.test.ts`**: Integration tests using Fastify's `.inject()` method. Tests verify that the routes successfully fetch data matching the database seed state.

## Rules for AI Agents
- Currently, logic is in-lined inside `orders.routes.ts` as part of Phase 1 to get off the ground quickly. 
- In future phases, you should abstract database logic out of the route handler into an `orders.repository.ts` and `orders.service.ts` to adhere to clean architecture principles.
