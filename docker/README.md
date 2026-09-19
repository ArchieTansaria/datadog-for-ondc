# Docker Infrastructure

This folder contains the local development infrastructure definitions.

## Key Files
- **`docker-compose.yml`**: Defines the local `ondc_pulse_db` container running PostgreSQL 14. 
  - **Port**: Bound to `5433` on the host to avoid colliding with any native Postgres running on port `5432`.
  - **User/Password**: `postgres` / `postgres`.
  - **Database**: Default `postgres` database is used to avoid permissions issues across initialization cycles.
  - **Healthcheck**: Uses `pg_isready` to ensure dependent processes wait for the database to boot.

## Rules for AI Agents
- **Do not modify the port binding** unless specifically requested. Changing it will break Prisma configurations that rely on `.env` pointing to `5433`.
- When stopping containers, use `docker compose down -v` if you need to wipe the volumes entirely.
