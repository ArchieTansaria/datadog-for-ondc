# Database Schema Documentation

This document describes the foundational schema for ONDC Pulse PostgreSQL database.

## Architecture Guidelines

- **Multi-Tenant Support:** Almost every table contains a `tenant_id` to strictly segment data by Tenant. This is the primary key for logical isolation.
- **Timestamp & Soft Deletes:** Standardized `created_at`, `updated_at`, and `deleted_at` are implemented across the models to track data lifecycles.
- **Idempotency:** Implemented via a `UNIQUE(idempotency_key, tenant_id, order_id)` constraint on the `OrderEvent` table to prevent duplicate ingestion.
- **Raw Payloads:** The `OrderEvent` table has a `raw_payload` (JSONB) column for full fidelity capture, ensuring that unstructured ONDC data can be evaluated asynchronously.
- **JSONB Extensibility:** Entities have a `metadata` or `context` JSONB column for custom flags and unstructured tags, which is essential for observability logging.

## Core Entities

### Tenant
A tenant represents an isolated ONDC network participant or organizational unit consuming Pulse services.

### Participant
Network participants (buyer/seller apps, gateways). Stores configurations, credentials, and statuses.

### Order
The central aggregate root for an order lifecycle across various domains and protocols.

### OrderEvent
Stores individual events and actions occurring on an order in a chronological manner. Important for reconstructing workflows.

### Incident
Records anomalies, SLA breaches, and validation failures on orders or API endpoints.

### SLARule
Custom rules assigned to participants or tenants, dictating required time-bound service level agreements.

### AuditEvent
System-level logging to capture configuration changes and access audits.

## Extensibility for Phase 2
- The `Order` state is currently a flexible string `currentState` intended to be replaced with a robust deterministic state machine engine.
- `OrderEvent.raw_payload` will be ingested asynchronously via AWS EventBridge or SQS.
- `Incident` will integrate directly with AWS SNS/PagerDuty integrations.

