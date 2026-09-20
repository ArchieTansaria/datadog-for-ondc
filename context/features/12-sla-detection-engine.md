# Feature 12: SLA Detection Engine (New AWS Lambda)

## Objective
Implement a deterministic SLA (Service Level Agreement) Detection Engine that actively monitors the system state and automatically generates `Incident` records when orders violate expected timeout thresholds. This proves the system's ability to autonomously detect failures injected by the simulator (or real-world network drops).

## Architecture & Scope
1. **SLA Engine Lambda (`sla-engine.ts`)**:
   - A new serverless Lambda function within the AWS CDK infrastructure (`infra/cdk/src/lambdas/sla-engine.ts`).
   - Triggered periodically via an Amazon EventBridge Cron rule (e.g., every 1 minute).
2. **Detection Logic**:
   - Sweeps the `Order` table for active orders where the time elapsed since `lastEventAt` exceeds the threshold defined in the corresponding `SLARule` for that `currentState`.
   - E.g., If an order is stuck in `CONFIRMED` for > 120 seconds waiting for an `/on_status` assignment, it flags a violation.
3. **Incident Generation**:
   - When a violation is detected, the engine autonomously creates an `Incident` record in the database with severity `SEV-1` or `SEV-2` and marks it as an `SLA_BREACH`.

## Key Decisions
- **Decoupled Architecture**: The SLA Engine runs out-of-band via EventBridge rather than trying to use in-band SQS delay queues. This is much easier to observe, scale, and debug for ONDC lifecycle timeouts which can span minutes or hours.
- **Proof of Detection**: Crucially, this ensures the Simulator does *not* need to mock incidents directly. The simulator only drops packets, and this SLA engine catches the resulting silence.

## Validation & Observability
- **Unit Testing**: Tests validating the time-delta calculations and correct `Incident` record mapping based on the `SLARule`.
- **Integration Testing**: Running the lambda against a seeded database with expired orders to ensure incidents are correctly created.
