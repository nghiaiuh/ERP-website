# ERP Context

Fast-start context for agents working in this repository. Read this file, `README.md`, and `package.json` before scanning broadly.

## Product

ERP kế toán hỗ trợ hóa đơn mua/bán, thu chi, công nợ, thanh toán, thuế và báo cáo. Hướng phát triển bổ sung Telegram intake, lưu ảnh/PDF gốc, AI local qua Ollama và Human Review trước khi tạo chứng từ hoặc ghi sổ.

Core invariant:

```text
Evidence first -> AI assisted -> Human approved -> Posting controlled -> Ledger authoritative
```

## Current state

- One Nuxt 4 application owns Vue UI and Nitro/H3 API routes.
- PostgreSQL is accessed through Drizzle ORM.
- JWT + bcryptjs provide basic authentication.
- Existing schema includes users, business, partners, invoices, revenue/expense books, debts, payments, and tax tables.
- Invoice and debt APIs currently contain stubs.
- Report write routes access tables directly and currently act as business orchestration.
- Telegram, object storage, Redis/BullMQ, worker, Ollama, n8n, Human Review, audit/outbox, Posting Engine and General Ledger are not implemented yet.
- The current database does not enforce tenant isolation across business tables.

## Architecture decision

Use a **Modular Monolith + one Worker Application**. Do not split business modules into microservices at this stage.

Initial physical topology:

```text
Nuxt Web/BFF replicas
Worker replicas
PostgreSQL
Redis + BullMQ
S3-compatible Object Storage / MinIO
Ollama local
n8n as optional integration adapter
```

Persistence ownership:

- PostgreSQL: durable business state, review, audit and outbox.
- Object Storage: immutable original image/PDF and generated exports.
- General Ledger: authoritative accounting balances and movements.
- BullMQ/Redis: async attempts, retry, delayed jobs and cache; never final business state.
- Reporting: rebuildable read model, never a write path to source data.

## Mandatory boundaries

- Webhook flow is `verify -> deduplicate -> persist -> outbox -> respond`.
- AI/media/notification/export work runs asynchronously in Worker.
- AI only creates versioned proposals with confidence and evidence.
- Human Review is required before confirmed Business Document creation.
- Posting Engine is the only component allowed to write General Ledger.
- Posted journals are immutable; correction uses reversal or adjustment.
- n8n calls public application APIs/events only and never accesses ERP tables directly.
- Modules communicate through public application interfaces, not internal repositories or tables.
- Every business table is tenant-scoped; important writes are audited and idempotent.

## Target modules

```text
IAM
Messaging
Submissions
Documents
AI Intake and AI Gateway
Human Review
Master Data
Business Documents
Accounting Posting and General Ledger
Payment and Reconciliation
Reporting
Audit
Transactional Outbox
Integrations
```

Each module should evolve toward:

```text
module/
├── domain/
├── application/
├── infrastructure/
└── public.ts
```

Keep modules under `server/modules/` initially if that minimizes migration risk. Introduce `apps/web`, `apps/worker`, and `packages/*` when the Worker is added; do not perform a big-bang folder rewrite.

## Main business flow

```text
Telegram/Web
-> persist message and original evidence
-> Submission Inbox
-> Transactional Outbox
-> BullMQ Worker
-> AI Gateway / Ollama extraction
-> Human Review
-> confirmed Business Document
-> Posting Engine
-> General Ledger
-> rebuildable Reporting read model
```

## Delivery phases

0. Architecture baseline, tests, migration workflow, module sample.
1. Tenant, Telegram ingestion, document persistence.
2. Submission Inbox and grouping/state machine.
3. Transactional Outbox, Redis/BullMQ and Worker.
4. AI Gateway, Ollama and versioned extraction results.
5. Human Review on Web/Telegram with full correction audit.
6. Business Documents, Master Data, payments and reconciliation.
7. Posting Engine, accounting periods and immutable General Ledger.
8. Rebuildable Reporting read models and async export.
9. Reminder, n8n integrations, security, observability and production hardening.

Detailed architecture diagrams, module ownership, queue contracts, task IDs, tests and rollback strategy are maintained in `README.md`.

## Fast file map

- UI: `app/pages/`, `app/components/`, `app/composables/`.
- API transport: `server/api/`.
- Current schema: `server/db/schema.ts`.
- Current database connection: `server/utils/drizzle.ts`.
- Auth middleware: `server/middleware/auth.ts`.
- Shared contracts: `shared/`.
- Target module code: add incrementally under `server/modules/` until workspace extraction is justified.

## Agent rules

- Inspect actual code before claiming a module or feature exists.
- Preserve current API behavior behind feature flags during migration.
- Prefer additive migrations and backfills; do not drop legacy data in the same release.
- Keep controllers thin and business rules in application/domain layers.
- Add database unique constraints for idempotency, not code checks alone.
- Update this context whenever architecture, source-of-truth or phase status changes.
