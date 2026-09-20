# Feature 13: Simulator API

## Objective
Create a backend API that executes deterministic fault injection scenarios by publishing synthetic canonical events directly into the existing AWS processing pipeline, exercising the true capabilities of the observability engine.

## Architecture & Scope
1. **Simulator Endpoint (`POST /api/simulate`)**:
   - Accepts fault injection toggles from the frontend (e.g., `dropAssignment=true`, `delayConfirm=true`, `duplicateConfirm=true`).
   - Creates a new `Simulation` context/identifier.
2. **Synthetic Event Generation**:
   - Generates a sequence of valid canonical ONDC events (`/search`, `/on_search`, `/init`, `/confirm`, etc.) with synthetic `transactionId` and `orderId`.
   - Pushes these events directly into the existing SQS `processingQueue` (or directly calls the processor logic for local testing).
3. **Fault Injection Execution**:
   - If `dropAssignment` is true, the simulator intentionally skips generating the `/on_status` event.
   - If `delayConfirm` is true, the simulator waits (or schedules) a severely delayed `/on_confirm`.
   - **Crucial Constraint**: The simulator *never* inserts an `Incident` record directly. It relies entirely on the SLA Detection Engine (Feature 12) to detect the injected faults.
4. **Simulator Polling Endpoint (`GET /api/simulate/[id]`)**:
   - Returns business-level progression events (e.g., "Generated transaction", "/on_confirm intentionally delayed", "SLA breached") to the frontend for visualization.

## Key Decisions
- **Architectural Integrity**: By pushing events into the real SQS queue, the simulator proves that the downstream `Processor Lambda`, state machine validation, and `SLA Engine` all function correctly end-to-end.
- **Abstracting HTTP Webhooks**: To reduce complexity for this phase, the simulator bypasses the API Gateway `/webhook` HTTP layer and drops synthetic payloads directly into SQS.

## Validation & Observability
- **Unit Testing**: Validating synthetic payload generation and fault toggle logic.
- **Integration Testing**: The ultimate end-to-end test: `POST /api/simulate` -> SQS -> Processor -> SLA Engine -> Incident Created -> `GET /api/incidents/[id]`.
