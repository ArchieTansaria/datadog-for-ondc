# Contributing to ONDC Pulse

Welcome! This repository is heavily co-developed by human engineers and AI coding agents. Follow these guidelines to ensure smooth collaboration.

## Git Workflow
1. **Branching:** Use descriptive branch names (e.g., `feature/aws-ingestion`, `fix/db-schema-typo`). AI agents generally operate on the branch assigned to them or directly on `main` if doing rapid prototyping (as directed by the human).
2. **Commits:** Write clear, concise commit messages. AI agents should group related changes logically.
3. **Pull Requests:** When appropriate, open PRs for major architectural shifts so human peers can review. 

## Human-AI Collaboration Rules
- **For Humans**: Be extremely explicit in your prompts. Specify if you want the AI to explore, or if you want it to execute a highly defined task.
- **For AIs**: 
    - Read `context/AGENTS.md` before executing any task.
    - Never assume API endpoints or AWS structures without confirming the existing codebase.
    - If a task conflicts with existing code authored by another agent, ask the human for conflict resolution rather than unilaterally overwriting it.
    - Validate work constantly: run unit tests and type checks.
- **Documentation**: Both humans and AIs are responsible for keeping `context/ROADMAP.md` up to date.

## Code Quality Standards
- **TypeScript Strictness**: `strict: true` must remain enforced. Do not use `any` unless absolutely necessary and documented.
- **Linting & Formatting**: Ensure `npm run lint` passes before committing code. We use ESLint and Prettier.
- **Testing**: All critical business logic MUST have associated Vitest tests.
