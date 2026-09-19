# AWS EventBridge & Metrics Engine Setup

## Purpose
Establishes the internal event-driven architecture and the observability engine for ONDC Pulse. This infrastructure enables asynchronous processing of order state transitions, computing latency percentiles, tracking SLA breaches, and generating analytics without blocking or tightly coupling the core Order Processor.

## Architecture & Configuration
- **Internal EventBus (`OndcPulseInternalBus`)**: An Amazon EventBridge bus created in the `FoundationStack`. It acts as the decoupled bridge for all internal system events.
- **Node.js Lambda Function (`MetricsEngineLambda`)**: A Node.js 22.x serverless function that consumes metric events.
- **EventBridge Rules**: A pattern-matching rule routes events with `source: ['pulse.processor']` and `detail-type: ['OrderMetricsEvent']` directly to the Metrics Engine Lambda.
- **MetricsStack**: A dedicated CDK stack that cleanly encapsulates the metrics logic and references the internal event bus.

## CDK Testing (TDD)
Robust CDK unit tests (`MetricsStack.test.ts` and `FoundationStack.test.ts`) actively verify the wiring. The tests will fail the build pipeline if anyone attempts to:
- Remove the `OndcPulseInternalBus` from the foundation.
- Delete the Metrics Engine Lambda or change its runtime.
- Remove or misconfigure the EventBridge Rule that binds the Order Processor's events to the Metrics Engine.

## Future Evolution
Currently, the Lambda handler (`metrics.ts`) acts as a placeholder that validates event structures and logs SLA breaches. In the future, this will be expanded to write aggregated time-series data to **Amazon Timestream** or **Aurora PostgreSQL** to power the high-scale P95 latency charts and operations dashboards.
