# Phase 1: ONDC State Machine Redesign

## Purpose
The original state machine (`StateMachineService`) was designed with a generic, overly-simplistic model (`SEARCHED` -> `SELECTED` -> `INITIALIZED` -> `CONFIRMED` -> `COMPLETED`) that didn't accommodate the nuances of ONDC domains. Phase 1 completely redesigns this system to provide strict, deterministic validation specifically for the ONDC Retail domain (`nic2004:52110`), properly isolating core action lifecycles from fulfillment state progressions.

## Architecture & Implementation
- **Deterministic Evaluation (`stateMachineService.evaluate`)**:
  - Replaces the generic `isValidTransition` and `deriveStateFromAction` methods.
  - Returns a strict `status` enum: `VALID`, `INVALID_TRANSITION`, `UNEXPECTED_EVENT`, or `UNSUPPORTED_FLOW`.
- **Explicit Domain Support**:
  - The service mathematically restricts validation to standard Retail flows (`nic2004:52110`, `ONDC:RET10`, `ONDC:RET11`, `ONDC:RET12`).
  - Unknown or logistics domains (e.g., `nic2004:60232`) are proactively flagged as `UNSUPPORTED_FLOW`.
- **Action State vs. Fulfillment State**:
  - **Action State**: Tracks the protocol sequence (`SEARCHED` -> `SELECTED` -> `INITIALIZED` -> `CONFIRMED` -> `IN_PROGRESS` -> `COMPLETED` -> `CANCELLED`).
  - **Fulfillment State**: Extracted from the `message.order.fulfillments[0].state.descriptor.code` property, tracking physical delivery progression (`Pending`, `Packed`, `Agent-assigned`, `Picked`, `Out-for-delivery`, `Delivered`).
  - The state machine ensures that fulfillment states must linearly progress; backtracking (e.g., jumping from `Picked` back to `Packed`) yields an `INVALID_TRANSITION`.
- **Idempotent Webhook Processing**:
  - Unrecognized or mathematically invalid events are accurately stamped with the corresponding validation status, but they are NOT dropped.
  - Events are still stored durably into the `OrderEvent` schema and archived to S3 to guarantee complete observability platforms.
  - Prisma idempotency correctly deduplicates identical payloads via `context.message_id`.

## Testing 
- **Unit Tests (`state-machine.service.test.ts`)**: Comprehensively assert the 11 key deterministic transition rules.
- **Integration Tests (`events.test.ts` & `processor.test.ts`)**: E2E validations are updated to supply appropriate retail configurations and verify accurate tracking database mutations without throwing unresolved foreign-key constraints.

## Integration
This newly rigorous service is tightly integrated into both local webhook routes (`events.routes.ts`) and the asynchronous SQS processor lambda (`processor.ts`), operating silently without requiring modifications to the underlying `EventBridge-free` infrastructure logic.
