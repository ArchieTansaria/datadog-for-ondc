# Deterministic State Machine Engine

## Purpose
The ONDC protocol dictates a strict sequence of events for a transaction (e.g., `SEARCH` -> `SELECT` -> `INIT` -> `CONFIRM`). The `StateMachineService` is responsible for strictly enforcing these transitions, preventing invalid state skips, and categorizing incoming webhook actions into internal canonical states.

## Architecture
- **State Map**: A strictly typed `Record<OndcState, OndcState[]>` defines all mathematically possible forward transitions.
- **Terminal States**: States like `CANCELLED` and `COMPLETED` have no outward transitions. Attempting to transition out of a terminal state is treated as an invalid operation.

## Implementation Details
- **`state-machine.service.ts`**:
  - `isValidTransition(current, next)`: Validates if a transition is legal. Self-loops (e.g., `CONFIRMED` -> `CONFIRMED` for status updates) are permitted.
  - `deriveStateFromAction(action)`: A simplistic factory mapping raw ONDC actions (e.g. `on_confirm`) to the internal `ONDC_STATES` enum.
- **Testing**:
  - `state-machine.test.ts`: Contains isolated unit tests verifying every edge case, including forward transitions, cancellations, backward transition prevention, and state-skip prevention.

## Integration
This service will be injected into the `Webhook Ingestion Handler` (Step 4) to ensure that anytime an event is received, it mathematically adheres to the ONDC protocol lifecycle before it's persisted to the database.
