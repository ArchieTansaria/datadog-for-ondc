# Feature 11: Incidents & RCA Abstraction

## Objective
Implement a robust Incidents API to serve the Incident & Anomaly Queue on the dashboard, along with an abstracted Root Cause Analysis (RCA) provider pattern to explain failures deterministically.

## Architecture & Scope
1. **Incidents Collection (`/api/incidents`)**:
   - A `GET` endpoint supporting filtering and pagination.
   - Example: `?status=OPEN&severity=SEV-1&page=1&pageSize=25`.
   - Queries the `Incident` table in Aurora via Prisma.

2. **Incident Details (`/api/incidents/[id]`)**:
   - A `GET` endpoint returning a comprehensive incident graph: the `Incident` record, its metadata, the affected `Order`, the triggering `OrderEvent`, relevant SLA rules, and any existing RCA.
   - Does *not* generate RCA as a side-effect of a GET request.

3. **RCA Generation (`/api/incidents/[id]/rca`)**:
   - A `POST` endpoint to explicitly trigger RCA generation for a specific incident.
   - **RCAProvider Interface**: An abstracted interface (`RCAProvider`) for explaining incidents.
     - `MockRCAProvider`: A deterministic mock returning structured evidence (e.g., identifying a `/confirm` SLA breach).
     - `BedrockRCAProvider`: (Future) Implementation utilizing Amazon Bedrock for generative explanations.

## Key Decisions
- **Separation of Concerns**: Keeping RCA generation (a potentially slow, costly operation) completely separate from data retrieval (GET requests).
- **Clean Abstraction**: The `RCAProvider` ensures the frontend can present an AI explainer without tightly coupling the backend to AWS Bedrock during initial development/testing.

## Validation & Observability
- **Unit Testing**: Tests validating incident mapping, filtering logic, and the `MockRCAProvider` outputs.
- **API Testing**: Validating the `GET /api/incidents` and `POST /api/incidents/[id]/rca` flows.
