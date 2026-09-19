# AI Agents Canonical Instructions

This repository is maintained collaboratively by human developers and AI coding agents.

## Core Mandates for ALL AI Agents

If you are an AI agent operating in this repository, you **MUST** strictly adhere to the following rules:

### 1. Mandatory Pre-Flight Checks
- **Read Core Documentation First**: Before proposing or executing any code, you MUST read this file (`context/AGENTS.md`), `context/ROADMAP.md`, `context/CONTRIBUTING.md`, and `docs/architecture.md`.
- **Inspect Current State**: ALWAYS inspect the `git status` and actively review the existing source code of the files you intend to touch before beginning your work.

### 2. Collaboration & Integrity
- **Do Not Overwrite/Revert**: NEVER arbitrarily overwrite, delete, or revert another agent's work. Always integrate your changes with the existing state unless explicitly asked to rewrite it by a human.
- **Strict Scope Constraint**: Only modify files that are strictly relevant to your assigned task. Avoid formatting changes in unrelated files.

### 3. Accuracy & Truthfulness
- **No Hallucinations**: NEVER hallucinate APIs, ONDC behavior, AWS services, or database structures. Rely ONLY on the provided schema and actual AWS SDK/ONDC specs. If unsure, stop and ask the human.
- **Respect the Architecture**: NEVER change the established architecture or technology stack (as documented in `docs/architecture.md`) without explicit human approval. Do not introduce new databases, libraries, or paradigms on a whim.

### 4. Post-Flight Requirements
- **Update the Roadmap**: After completing a feature or task, you MUST update the `context/ROADMAP.md` file to reflect the new status.
- **Validation**: You MUST run tests, typecheck, and linter before declaring a task finished. (e.g., `npm test`, `npm run build`, `npm run lint`). Ensure your changes do not break the build.
