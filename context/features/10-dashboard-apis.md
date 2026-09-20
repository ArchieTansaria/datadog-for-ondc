# Feature 10: Dashboard APIs (Read Layer)

## Objective
Replace the hardcoded dashboard components in the Next.js frontend with dynamic data by implementing semantic API routes that query the persistent Aurora database.

## Architecture & Scope
This feature introduces Next.js API Routes (or Server Actions) to serve the main dashboard view:

1. **Metrics API (`/api/dashboard/metrics`)**:
   - Computes real-time aggregate metrics.
   - **Total Monitored Orders**: `COUNT(Order)` created in the last 24h.
   - **SLA Breaches**: `COUNT(Incident WHERE incident_type='SLA_BREACH' AND detected_at > NOW() - 24h)`.
   - **Active Exceptions**: `COUNT(Incident WHERE status='OPEN' AND severity IN ('SEV-1', 'SEV-2'))`.

2. **Timeline API (`/api/dashboard/timeline`)**:
   - Calculates the latency distribution of ONDC protocol steps.
   - **Latency Definition**: Time difference between corresponding event pairs (e.g., `/init` to `/on_init`, `/confirm` to `/on_status`).
   - **Aggregation**: Grouped into 5-minute time buckets over the last 24 hours, returning P50 and P95 latency values.

## Key Decisions
- **Strict Metric Definitions**: Hardcoding explicit SQL/Prisma semantics to avoid metric drift and ensure the dashboard accurately reflects system invariants.
- **Time Window**: Fixed to a rolling 24-hour window for the hackathon MVP to ensure performant aggregations without complex materialized views.

## Validation & Observability
- **Unit Testing**: Tests validating the exact Prisma queries for metrics and latency calculations.
- **API Testing**: `GET /api/dashboard/metrics` and `GET /api/dashboard/timeline` endpoints will be tested for correct JSON serialization and performance.
