# Webhook Ingestion Handler

## Purpose
The Webhook Ingestion Handler (`POST /api/v1/events/webhook`) is the primary entry point for ONDC Pulse. It receives raw ONDC protocol payloads from participant networks, authenticates them, validates their state transitions, and durably stores them for observability.

## Architecture & Flow
1. **Authentication**: Handled automatically by the `apiKey.plugin.ts`. If the `x-api-key` is missing or invalid, the request is immediately rejected (`401 Unauthorized`).
2. **Payload Validation**: The raw JSON body is validated against a Zod schema (`webhookPayloadSchema`) to ensure standard ONDC fields (`domain`, `action`, `message_id`, `transaction_id`) are present.
3. **Idempotency Check**: The `message_id` is used as an idempotency key. If an event with this key already exists in the database for this tenant, the handler returns an immediate HTTP 200 (Idempotent Success) to prevent duplicate processing.
4. **State Machine Validation**: The `StateMachineService` evaluates the incoming `action` against the current state of the order. If the transition skips steps (e.g., `SEARCHED` -> `INITIALIZED`), the validation status is flagged as `INVALID_TRANSITION`.
5. **Persistence**:
   - If the order does not exist, it is created.
   - If the order exists and the transition is valid, the order's `currentState` is updated.
   - The raw event payload is ALWAYS appended to the `OrderEvent` table, regardless of validation status, ensuring a complete, immutable audit log for debugging.

## Testing
Comprehensive integration tests in `events.test.ts` dynamically spin up isolated tenants, inject HTTP payloads, and verify all core logic:
- Authentication rejections (401).
- Schema validation rejections (400).
- Successful Event Ingestion and Order Creation.
- Idempotent deduplication.
- State Machine Rejections (flags `INVALID_TRANSITION` but still persists data).

## Future Migration (AWS)
In future phases, this specific HTTP handler can be replaced by an AWS API Gateway -> SQS -> Lambda pipeline. Because the business logic is cleanly separated into Repositories and the State Machine Service, the core Node.js code remains entirely reusable within an AWS Lambda context.
