# Feature 16: ONDC SQS-based SLA Detection (Phase 2)

## Objective
Implement deterministic SLA (Service Level Agreement) Detection for ONDC Pulse using an SQS-based delayed processing mechanism. This replaces the legacy EventBridge Cron approach with a simpler, event-driven model that adheres strictly to the ONDC Retail state machine built in Phase 1, automatically generating `Incident` records when orders violate expected timeout thresholds.

## Architecture & Scope
1. **SQS Delay Mechanism (`ProcessorLambda`)**:
   - The existing `ProcessorLambda` triggers SLA checks by pushing `SLA_CHECK` payloads back into its own `processingQueue` using standard SQS `DelaySeconds` (up to 15 minutes).
   - This eliminates the need for external cron jobs (EventBridge), state machines (Step Functions), or specialized time-series databases.
2. **Detection Logic**:
   - When processing a valid ONDC state transition (e.g., `SEARCHED` or `INITIALIZED`), the engine queries the `SLARule` table.
   - If an active SLA rule applies for the current protocol state and fulfillment state, the lambda calculates a deadline from the ONDC payload's business `timestamp`.
   - The delay is applied, and an SQS message is enqueued to wake up the processor at the deadline.
3. **Breach Generation & Idempotency**:
   - Upon consuming an `SLA_CHECK` message, the processor re-fetches the `Order` from the database.
   - If the order has successfully progressed past the monitored state, the check is discarded as stale.
   - If the order remains in the monitored state beyond the threshold, a new `Incident` (`SLA_BREACH`) is raised.
   - To prevent duplicate incidents from SQS retries, the engine checks for existing active incidents for the same rule and order combination before creating a new one.

## Key Decisions
- **Event-Driven Architecture**: Moving from an out-of-band Cron to an in-band SQS delay reduces infrastructure complexity and aligns the SLA lifecycle tightly with order progression.
- **Strict ONDC Timestamping**: SLA deadlines are calculated strictly against the business timestamp provided in the canonical ONDC payload, rather than AWS system ingestion times, to ensure fidelity to the ONDC network timeline.
- **Simplistic Scope**: For the demo purposes, this architecture leverages the standard 15-minute SQS delay window rather than implementing Step Functions or DynamoDB TTL for longer-running SLA timeouts.

## Validation & Observability
- **Unit Testing**: Comprehensive test coverage added to `processor.test.ts` to validate stale discard logic, breach creation, fulfillment-state matching, and duplicate `SLA_CHECK` message idempotency.
- **End-to-End Validation**: Vertical slice integration verified to handle standard webhook ingestion, parsing, database persistence, and delayed SQS evaluations successfully.
