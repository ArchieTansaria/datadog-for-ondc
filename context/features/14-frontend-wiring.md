# Feature 14: Frontend Wiring

## Objective
Remove all hardcoded mock data from the Next.js dashboard views (`/dashboard`, `/dashboard/incidents`, `/dashboard/simulate`) and wire them securely to the newly established backend APIs and database.

## Architecture & Scope
1. **Dashboard Overview (`/dashboard`)**:
   - Refactor `page.tsx` to utilize React Server Components (RSC) or client-side fetching (SWR/React Query) to pull data from `/api/dashboard/metrics` and `/api/dashboard/timeline`.
   - Dynamically render the metric cards (Orders, SLA Breaches, Latency) and the SVG line chart.
2. **Incidents Queue (`/dashboard/incidents`)**:
   - Wire the left-hand incident list to `/api/incidents`.
   - Wire the right-hand incident detail pane to `/api/incidents/[id]`.
   - Add a button/action to call `POST /api/incidents/[id]/rca` and display the resulting Bedrock/Mock evidence dynamically.
3. **Simulator UI (`/dashboard/simulate`)**:
   - Replace the `setTimeout` fake terminal logger with a real API call to `POST /api/simulate`.
   - Implement frontend polling (`setInterval` or SWR polling) against `GET /api/simulate/[id]` to stream real backend simulation events into the terminal UI.

## Key Decisions
- **Polling over WebSockets**: Chosen for the Simulator terminal UI to dramatically simplify infrastructure during the hackathon phase. Server-Sent Events (SSE) or WebSockets can be adopted later if real-time streaming becomes a hard requirement.
- **Server Components**: Where applicable, Next.js App Router Server Components will be used for initial data fetching (e.g., the dashboard overview) to minimize client-side waterfalls.

## Validation & Observability
- **Manual End-to-End Verification**:
  1. Toggle an error in `/dashboard/simulate` and hit Run.
  2. Watch the polling logs confirm processing.
  3. Navigate to `/dashboard` to see metrics update.
  4. Navigate to `/dashboard/incidents` to view the newly detected incident and its RCA.
