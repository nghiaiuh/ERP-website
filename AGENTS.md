# ERP Chat Agent Instructions

## Identity Check

When responding after completing a task, always address the user as **Nghĩa IT**.

Example:

```md
Done, Nghĩa IT.
```

## Project Overview

This repository contains an **ERP Web Application** built with:

- `Nuxt 4`
- `Vue 3`
- `TypeScript`
- `Tailwind CSS`
- `Nuxt server API routes`
- `Drizzle ORM`
- `PostgreSQL`

Primary business scope currently visible in the repo:

- Accounting dashboard
- Invoice management
- Revenue and expense reports
- Debt tracking
- Tax module scaffolding
- Marketing pages
- Profile pages

This chat context is named **ERP chat**.

## Fast Startup

Before scanning broadly, read these files first:

1. `context.md`
2. `README.md`
3. `package.json`

Then inspect only the package or folder that owns the requested behavior.

## Repository Ownership

Use these boundaries:

- `app/`
  Frontend pages, layouts, components, composables, styling.
- `server/api/`
  API route handlers.
- `server/db/`
  Database schema and SQL bootstrap files.
- `server/utils/`
  Shared backend helpers such as Drizzle connection utilities.
- `server/middleware/`
  Authentication middleware.
- `shared/`
  Shared types and reusable cross-layer contracts.
- `drizzle/`
  Migration outputs and schema history.

Keep changes inside the folder that owns the behavior.

## Development Workflow

Before editing:

1. Read `context.md` unless the task is trivial.
2. Inspect the relevant files.
3. Confirm whether the change belongs to UI, API, database, or shared types.
4. Avoid broad rewrites unless they are clearly required.

While editing:

1. Prefer small, testable changes.
2. Keep client-side code out of server-only utilities.
3. Keep database access out of presentational Vue components when possible.
4. Reuse composables for shared UI behavior.
5. Prefer clear names over clever abstractions.
6. Update docs when architecture or workflow meaningfully changes.

Before handoff, run when feasible:

```bash
npm run build
npm run lint
```

If a command cannot be run, mention that clearly in the final response.

## Frontend Guidelines

The UI should feel like a professional ERP workspace:

- Clear navigation
- High information density without clutter
- Predictable table and filter behavior
- Readable forms
- Stable overlays and detail drawers
- Consistent naming between sidebar, tabs, and pages

Avoid:

- Demo-only placeholders presented as production behavior
- Hidden destructive actions
- Mixing API logic directly into purely visual components
- Inconsistent route naming across modules

## Backend Guidelines

API routes must:

- Validate request payloads
- Verify authentication before returning protected data
- Keep business logic reasonably isolated from transport concerns
- Avoid duplicating auth or token parsing logic across many handlers

Database rules:

- Use `server/db/schema.ts` as the source of schema intent
- Keep connection logic centralized in `server/utils/drizzle.ts`
- Reflect table or relation changes in documentation when useful

## AI / Automation Direction

Planned ERP AI features may include:

- ERP assistant chat
- Invoice and report summarization
- Workflow automation
- Approval reminders
- Data extraction from accounting documents

Recommended direction:

- Start with a **modular monolith**
- Keep AI orchestration inside the main Nuxt app first
- Introduce `n8n` as the workflow automation layer
- Use `Ollama` as the local LLM runtime behind internal AI endpoints
- Split into separate services only after usage, load, or team boundaries justify it

Suggested responsibility split:

- Nuxt app:
  UI, auth, ERP APIs, AI gateway endpoints, permissions, business rules.
- n8n:
  Scheduled jobs, approval flows, notifications, document ingestion, cross-system automation.
- Ollama:
  Local model serving for chat, summarization, extraction, and internal copilots.
- PostgreSQL:
  ERP source of truth, AI audit logs, workflow state.

## Security Checklist

- Do not expose database credentials or JWT secrets in client code
- Keep server-only environment variables on the server
- Validate authentication on protected ERP APIs
- Avoid logging sensitive business data unnecessarily
- Be careful with invoice, debt, tax, and user profile data

## Handoff Format

When finishing a coding task, respond with:

1. Summary of changes
2. Files changed
3. How to test manually
4. Commands run
5. Commands not run
6. Known risks or follow-up tasks

Always include the identity check marker:

```md
Done, Nghĩa IT.
```
