# ERP Web Application

Ứng dụng ERP kế toán xây dựng bằng Nuxt 4, hỗ trợ nhập liệu từ Web và Telegram, xử lý chứng từ bằng AI local, bắt buộc người dùng xác nhận trước khi ghi sổ.

> Architecture decision: **Modular Monolith + Worker**, không tách microservices ở giai đoạn hiện tại.

## 1. Mục tiêu sản phẩm

Phạm vi nghiệp vụ:

- Quản lý hóa đơn mua, hóa đơn bán, thu, chi, thanh toán và công nợ.
- Lưu ghi chú nghiệp vụ, ảnh và PDF chứng từ gốc.
- Ghi sổ kế toán và tổng hợp doanh thu, chi phí, công nợ, thuế.
- Nhập dữ liệu qua Web App hoặc Telegram.
- Dùng Ollama local để OCR/vision, phân loại và trích xuất dữ liệu có cấu trúc.
- Dùng n8n cho tích hợp ngoại vi, không dùng làm nơi chứa nghiệp vụ kế toán lõi.
- Duy trì Human-in-the-loop trước khi tạo chứng từ chính thức hoặc ghi General Ledger.

Các bất biến hệ thống:

```text
Evidence first -> AI assisted -> Human approved -> Posting controlled -> Ledger authoritative
```

## 2. Công nghệ

| Thành phần | Hiện tại | Mục tiêu |
| --- | --- | --- |
| Web/BFF | Nuxt 4, Vue 3, Nitro/H3 | Giữ nguyên, tổ chức theo module |
| Ngôn ngữ | TypeScript | TypeScript strict dần theo phase |
| UI | Tailwind CSS 4 | Giữ nguyên design system ERP |
| Database | PostgreSQL, Drizzle ORM | PostgreSQL là business source of truth |
| Async jobs | Chưa có | Redis + BullMQ + Worker app |
| File | Chưa có | S3-compatible Object Storage/MinIO |
| AI | Chưa có | AI Gateway -> Ollama local |
| Automation | Chưa có | n8n, chỉ là integration adapter |
| Auth | JWT + bcryptjs | Tenant isolation + RBAC/ABAC |
| Observability | Console log | Structured logs, metrics, tracing, alerting |

## 3. Đánh giá kiến trúc hiện tại

Hệ thống hiện là một Nuxt monolith nhỏ: Vue pages gọi trực tiếp Nitro API; API route truy cập Drizzle/PostgreSQL; schema tập trung trong một file. Cấu trúc này phù hợp để phát triển nhanh nhưng chưa đủ ràng buộc dữ liệu cho ERP kế toán nhiều tenant.

Điểm đang có:

- Nuxt cung cấp cùng lúc Web UI và BFF, deployment đơn giản.
- PostgreSQL và Drizzle đã được thiết lập tập trung tại `server/utils/drizzle.ts`.
- Schema đã có user, đối tác, hóa đơn mua/bán, sổ doanh thu/chi phí, công nợ, thanh toán và thuế.
- Middleware đã bảo vệ các `/api/*`, trừ route auth.
- API báo cáo đã có validation cơ bản.

Khoảng cách quan trọng:

| Mức | Hiện trạng và bằng chứng | Hướng xử lý |
| --- | --- | --- |
| Critical | Chưa có `tenant_id` trên các bảng nghiệp vụ (`server/db/schema.ts:8-290`) | Thêm tenant context, FK và index; mọi repository bắt buộc lọc tenant |
| Critical | Report POST vừa tạo doanh nghiệp vừa ghi dòng sổ trực tiếp (`server/api/reports/revenue/index.post.ts:19-101`, `expense/index.post.ts:19-101`) | Đưa ghi nhận tài chính qua Business Document và Posting Engine |
| Critical | Chưa có Journal Entry/Journal Line và kiểm tra Debit = Credit | Xây General Ledger append-only, posting idempotent |
| High | Route hiện chứa query và orchestration nghiệp vụ | Tách controller, application use case, domain và repository |
| High | Hóa đơn và công nợ đang trả stub (`server/api/invoices/index.get.ts`, `server/api/debts/index.get.ts`) | Triển khai dần trên module mới, giữ response contract tạm thời |
| High | Chưa có audit, idempotency, outbox, queue, worker | Thêm theo phase trước khi nối AI và Telegram production |
| High | Chưa có object storage; file evidence chưa được quản lý | Lưu binary trong object storage, metadata/ownership/checksum trong PostgreSQL |
| High | User chưa gắn tenant, role hay permission (`server/db/schema.ts:8-15`) | Bổ sung IAM, RBAC và policy phê duyệt |
| Medium | Auth có hai DB provider và log identifier đăng nhập (`server/api/auth/login.post.ts:28-61`) | Chốt một source of truth, loại log PII, chuẩn hóa auth service |
| Medium | API users có thể liệt kê user toàn hệ thống (`server/api/users/index.get.ts:4-30`) | Yêu cầu permission và tenant scope |
| Medium | README và source có chuỗi tiếng Việt lỗi encoding | Chuẩn hóa UTF-8 khi chạm vào từng file |

Không phát hiện implementation cho Telegram, upload, OCR/AI, review, Redis/BullMQ hoặc worker trong codebase hiện tại. Vì vậy, các khối dưới đây là **target architecture**, không phải mô tả tính năng đã tồn tại.

## 4. Target architecture

### 4.1 Sơ đồ tổng thể

```mermaid
flowchart LR
    subgraph CHANNELS["Channels"]
        WEB["Nuxt Web UI"]
        TG["Telegram User"]
        EXT["External Systems"]
    end

    subgraph APP["Nuxt Application — Modular Monolith"]
        ACCESS["Channel & Access<br/>BFF · Telegram Adapter<br/>IAM · Messaging"]

        INTAKE["AI Intake & Human Review<br/>Submission · Documents<br/>Extraction · Confirm/Edit/Reject"]

        ACCOUNTING["Accounting Core<br/>Master Data · Business Documents<br/>Payments · Period Control<br/>Posting Engine · General Ledger"]

        INSIGHT["Reporting & Governance<br/>Reports · Audit Trail"]

        PLATFORM["Platform Services<br/>Transactional Outbox<br/>AI Gateway · Integrations"]
    end

    subgraph WORKER["Worker Application"]
        PROCESSORS["Async Processors<br/>Media · AI Extraction<br/>Notifications · Reports · Integrations"]
    end

    subgraph INFRA["Infrastructure"]
        PG[("PostgreSQL<br/>Business Source of Truth")]
        QUEUE[("Redis + BullMQ<br/>Queue & Retry State")]
        STORAGE[("S3 / MinIO<br/>Images · PDFs · Exports")]
        AI["Ollama + OCR/Vision"]
        N8N["n8n"]
        TAPI["Telegram Bot API"]
    end

    WEB --> ACCESS
    TG <--> TAPI
    TAPI --> ACCESS

    ACCESS --> INTAKE
    ACCESS --> ACCOUNTING
    ACCESS --> INSIGHT

    INTAKE -- "Confirmed data" --> ACCOUNTING
    ACCOUNTING --> INSIGHT

    INTAKE --> PLATFORM
    ACCOUNTING --> PLATFORM

    PLATFORM --> QUEUE
    QUEUE --> PROCESSORS

    PROCESSORS --> AI
    PROCESSORS --> STORAGE
    PROCESSORS --> TAPI
    PROCESSORS --> N8N

    N8N --> EXT

    ACCESS --> PG
    INTAKE --> PG
    ACCOUNTING --> PG
    INSIGHT --> PG
    PLATFORM --> PG
```

### 4.2 Luồng Telegram đến Ledger

```mermaid
sequenceDiagram
    autonumber
    actor User as Telegram User
    participant TG as Telegram Adapter
    participant DB as PostgreSQL
    participant OS as Object Storage
    participant OP as Outbox Publisher
    participant Q as BullMQ
    participant W as Worker
    participant AI as AI Gateway/Ollama
    participant R as Human Review
    participant P as Posting Engine
    participant GL as General Ledger

    User->>TG: Text, image or PDF
    TG->>TG: Verify secret and deduplicate update_id
    TG->>OS: Store original evidence
    TG->>DB: Transaction: message + document metadata + submission + outbox
    TG-->>User: Accepted for processing
    OP->>DB: Claim unpublished outbox event
    OP->>Q: Enqueue idempotent job
    W->>OS: Read original evidence
    W->>AI: Extract structured fields
    AI-->>W: Values + confidence + evidence + versions
    W->>DB: Save extraction result and review task
    R->>DB: Confirm, correct or reject
    R->>DB: Create confirmed Business Document
    P->>DB: Validate permission, period, duplicate and rules
    P->>GL: Atomic balanced journal entry
    GL->>DB: Update/rebuild reporting read model
```

Webhook chỉ thực hiện `verify -> deduplicate -> persist -> outbox -> respond`. OCR, Ollama, gửi notification và export không chạy trong request webhook.

### 4.3 Kiến trúc triển khai và scale

```mermaid
flowchart TB
    LB[Reverse Proxy / Load Balancer]
    W1[Nuxt Web Replica 1]
    W2[Nuxt Web Replica N]
    K1[Worker Replica - general]
    K2[Worker Replica - AI/media]
    PG[(PostgreSQL Primary)]
    RR[(Optional Read Replica)]
    REDIS[(Redis)]
    OBJ[(S3/MinIO)]
    OLLAMA[Ollama GPU/CPU Node]
    N8N[n8n + PostgreSQL]

    LB --> W1
    LB --> W2
    W1 --> PG
    W2 --> PG
    W1 --> REDIS
    W2 --> REDIS
    REDIS --> K1
    REDIS --> K2
    K1 --> PG
    K2 --> PG
    K2 --> OBJ
    K2 --> OLLAMA
    W1 -. report read .-> RR
    W2 -. report read .-> RR
    PG -. replication .-> RR
    W1 --> N8N
```

Nguyên tắc scale và persistence:

- Web replica stateless; session/cache nếu cần nằm trong Redis, business state nằm trong PostgreSQL.
- Worker scale độc lập theo queue; AI/media có concurrency riêng để bảo vệ Ollama và tài nguyên máy.
- PostgreSQL dùng backup PITR, migration có version và connection pool; read replica chỉ thêm khi đo được tải report.
- Redis có persistence phù hợp nhưng vẫn được xem là hạ tầng retry/cache, không chứa số liệu kế toán cuối cùng.
- Object Storage bật versioning/lifecycle; file gốc immutable, metadata và checksum nằm trong PostgreSQL.
- Ollama có thể down mà không mất submission; BullMQ retry hoặc đưa job vào dead-letter/manual recovery.
- n8n dùng database riêng và chỉ gọi public application API/event; không đọc/ghi trực tiếp bảng ERP.

## 5. Module boundaries

Mỗi module mục tiêu có `domain/`, `application/`, `infrastructure/` và `public.ts`. Module khác chỉ import từ `public.ts`; không dùng repository, schema nội bộ hoặc update bảng của module khác.

| Module | Trách nhiệm và bảng sở hữu | Public application API | Phụ thuộc được phép | Cấm / source of truth |
| --- | --- | --- | --- | --- |
| IAM | tenants, users, roles, permissions, telegram_identities | authenticate, authorize, resolveTenant | Audit | Không lộ auth model; PostgreSQL |
| Messaging | conversations, inbound_messages, outbound_messages | receiveMessage, queueOutbound, updateDelivery | IAM, Documents, Outbox | Không gọi AI/ledger; PostgreSQL |
| Submissions | submissions, submission_messages, submission_documents | create, append, complete, transition | Messaging, Documents, Outbox | Không tạo invoice/ledger; PostgreSQL |
| Documents | documents | register, authorizeDownload, signedUrl | IAM, Storage | Không public object key; object + PostgreSQL metadata |
| AI Intake | extraction_runs, extraction_results, extraction_fields | requestExtraction, saveResult, rerun | Submissions, Documents, AI Gateway, Review | Không ghi Business Document; extraction tables |
| Review | review_tasks, review_changes | assign, confirm, correct, reject | AI Intake, Business Documents, Audit | Không ghi ledger; PostgreSQL |
| Master Data | partners, accounts, tax_rules, categories, projects | searchCandidate, validateReference | IAM | AI chỉ search/suggest; PostgreSQL |
| Business Documents | business_documents, invoice_lines, notes | createFromReview, confirm, cancel, reverse | Review, Master Data, Outbox | Posted document không sửa phá lịch sử; PostgreSQL |
| Accounting | journal_entries, journal_lines, accounting_periods | validatePosting, post, reverse | Business Documents, Master Data, Audit | Cổng duy nhất ghi journal; General Ledger |
| Reconciliation | payments, payment_allocations | recordPayment, allocate, refund, reconcile | Business Documents, Accounting | Không chỉ lưu remaining_amount; PostgreSQL + Ledger |
| Reporting | views/materialized views/summary tables | queryDashboard, rebuild, export | Accounting, Reconciliation | Read-only, không ghi ngược; derived data |
| Audit | audit_events | appendAudit, queryAudit | IAM | Append-only; PostgreSQL |
| Outbox | outbox_events | appendEvent, claim, markPublished | PostgreSQL, Queue adapter | Không thay business state; PostgreSQL |
| Integrations | integration_runs | trigger, receiveCallback, syncStatus | Public APIs, Outbox | n8n không truy cập DB lõi; PostgreSQL |

Target repository layout (sẽ tạo dần, không di chuyển big-bang):

```text
apps/
├── web/                         # Nuxt UI + Nitro BFF
└── worker/                      # BullMQ processors
packages/
├── modules/
│   ├── iam/
│   ├── messaging/
│   ├── submissions/
│   ├── documents/
│   ├── ai-intake/
│   ├── review/
│   ├── master-data/
│   ├── business-documents/
│   ├── accounting/
│   ├── reconciliation/
│   ├── reporting/
│   ├── audit/
│   └── outbox/
├── database/
├── queue/
├── storage/
├── ai/
├── telegram/
└── shared/
```

Trong giai đoạn đầu, các module có thể nằm dưới `server/modules/` để giảm chi phí chuyển workspace; chỉ tách `apps/`/`packages/` khi worker đầu tiên được đưa vào vận hành.

## 6. Data model MVP

```mermaid
erDiagram
    TENANTS ||--o{ USERS : contains
    USERS ||--o| TELEGRAM_IDENTITIES : links
    TENANTS ||--o{ CONVERSATIONS : owns
    CONVERSATIONS ||--o{ INBOUND_MESSAGES : receives
    CONVERSATIONS ||--o{ OUTBOUND_MESSAGES : sends
    INBOUND_MESSAGES ||--o{ SUBMISSION_MESSAGES : grouped_by
    SUBMISSIONS ||--o{ SUBMISSION_MESSAGES : contains
    SUBMISSIONS ||--o{ SUBMISSION_DOCUMENTS : attaches
    DOCUMENTS ||--o{ SUBMISSION_DOCUMENTS : referenced_by
    SUBMISSIONS ||--o{ EXTRACTION_RUNS : processed_by
    EXTRACTION_RUNS ||--o| EXTRACTION_RESULTS : produces
    EXTRACTION_RESULTS ||--o{ REVIEW_TASKS : reviewed_in
    REVIEW_TASKS ||--o| BUSINESS_DOCUMENTS : confirms
    BUSINESS_DOCUMENTS ||--o{ INVOICE_LINES : contains
    BUSINESS_DOCUMENTS ||--o{ PAYMENT_ALLOCATIONS : settled_by
    PAYMENTS ||--o{ PAYMENT_ALLOCATIONS : allocates
    BUSINESS_DOCUMENTS ||--o{ JOURNAL_ENTRIES : source_of
    ACCOUNTING_PERIODS ||--o{ JOURNAL_ENTRIES : controls
    JOURNAL_ENTRIES ||--|{ JOURNAL_LINES : contains
    TENANTS ||--o{ AUDIT_EVENTS : audits
    TENANTS ||--o{ OUTBOX_EVENTS : publishes
```

Quy tắc dữ liệu bắt buộc:

- Mọi bảng business có `tenant_id`; unique key nghiệp vụ phải chứa `tenant_id` khi phù hợp.
- Telegram dùng unique `(channel, telegram_update_id)` và callback query cũng có unique key.
- Document lưu `object_key`, MIME đã kiểm tra, size, checksum, owner và lifecycle; binary không nằm trong PostgreSQL.
- Extraction Result tách khỏi Business Document và lưu model, prompt, schema version, confidence/evidence theo field.
- Journal Entry đã post là immutable; sửa sai bằng reversal/adjustment.
- `journal_lines` có debit hoặc credit và transaction posting phải kiểm tra tổng debit bằng tổng credit.
- Payment allocation lưu lịch sử phân bổ để hỗ trợ partial payment, nhiều invoice và refund.
- `audit_events` append-only; application log không thay thế audit nghiệp vụ.

### Source of truth

| Dữ liệu | Source of truth |
| --- | --- |
| Message, delivery status, submission, review | PostgreSQL |
| Ảnh/PDF gốc | Object Storage; ownership/checksum ở PostgreSQL |
| AI proposal | extraction_runs/results |
| Dữ liệu đã xác nhận | business_documents |
| Số dư và phát sinh kế toán | General Ledger |
| Dashboard/report | Read model có thể rebuild |
| Retry/attempt async | BullMQ/Redis |
| Business state cuối cùng | PostgreSQL |
| Audit nghiệp vụ | audit_events append-only |

## 7. State machines

```mermaid
stateDiagram-v2
    [*] --> RECEIVED
    RECEIVED --> STORED
    STORED --> QUEUED
    QUEUED --> PROCESSING
    PROCESSING --> NEEDS_REVIEW
    PROCESSING --> EXTRACTION_FAILED
    EXTRACTION_FAILED --> QUEUED: retryable
    NEEDS_REVIEW --> NEEDS_CORRECTION
    NEEDS_CORRECTION --> NEEDS_REVIEW
    NEEDS_REVIEW --> REJECTED
    NEEDS_REVIEW --> CONFIRMED
    CONFIRMED --> RECORDED: non-financial note
    CONFIRMED --> POSTING: financial document
    POSTING --> POSTED
    POSTING --> POSTING_FAILED
    POSTING_FAILED --> NEEDS_REVIEW
```

| Aggregate | Trạng thái hợp lệ |
| --- | --- |
| Extraction | QUEUED -> RUNNING -> SUCCEEDED / RETRYING / FAILED / CANCELLED |
| Review | PENDING -> IN_REVIEW -> NEEDS_CORRECTION -> CONFIRMED / REJECTED / EXPIRED |
| Business Document | DRAFT -> CONFIRMED -> POSTING -> POSTED -> REVERSED; hoặc CANCELLED trước posting |
| Posting | REQUESTED -> VALIDATING -> POSTED / FAILED; retry giữ cùng idempotency key |
| Outbound Telegram | PENDING -> QUEUED -> SENDING -> SENT / RETRYING / FAILED / CANCELLED |

AI không có transition trực tiếp đến `CONFIRMED`, `POSTING` hoặc `POSTED`.

## 8. Queue và idempotency

| Job | Payload tối thiểu | Idempotency key | Retry | Timeout / final state |
| --- | --- | --- | --- | --- |
| `outbox.publish` | eventId | `outbox:{eventId}` | DB/Redis transient; 10 lần exponential + jitter | 30s; outbox PUBLISHED hoặc còn PENDING |
| `media.process` | tenantId, documentId, submissionId | `media:{documentId}:{pipelineVersion}` | storage/network; 5 lần exponential | 2m; document READY/FAILED |
| `ai.extract` | tenantId, submissionId, runId, pipelineVersion | `extract:{submissionId}:{pipelineVersion}` | timeout/model unavailable; 3 lần exponential | 5m; extraction SUCCEEDED/FAILED |
| `telegram.send` | outboundMessageId | `telegram-send:{outboundMessageId}` | 429/5xx/network; 8 lần theo retry-after | 30s; SENT/FAILED |
| `report.export` | tenantId, exportId, filters | `report:{exportId}` | DB/storage transient; 3 lần | 10m; READY/FAILED |

Terminal errors gồm payload/schema sai, permission/tenant sai, file bị cấm, entity không tồn tại hoặc accounting rule không hợp lệ. Worker phải throw lỗi retryable, chỉ đánh dấu business failure ở final attempt và luôn truyền `request_id`, `correlation_id`, `job_id`, `tenant_id`, `submission_id` khi có.

Transactional Outbox đảm bảo không mất job giữa PostgreSQL và Redis:

```text
BEGIN
  INSERT business state
  INSERT audit event
  INSERT outbox event
COMMIT
```

Publisher claim event theo batch, enqueue idempotent rồi mark published. Duplicate publish được chấp nhận; consumer phải idempotent và unique constraint là lớp bảo vệ cuối.

## 9. Security và observability

Required for MVP:

- Tenant context từ authenticated identity, không nhận `tenant_id` đáng tin trực tiếp từ client.
- RBAC cho reviewer/accountant/manager; ABAC cho hạn mức và kỳ kế toán.
- Telegram secret verification, mapping Telegram identity với user/tenant và chống duplicate update.
- Validate request schema, MIME, magic bytes, size/page limit và ownership trước signed URL.
- Ollama không có database credential; AI chỉ dùng Authorized Domain Tools có schema và tenant check.
- Secret đặt ở server secret manager/env; không log token, password, file hoặc dữ liệu tài chính nhạy cảm.
- Audit cho review, correction, posting, reversal, permission change và tool execution.

Recommended before production:

- Structured JSON logs, correlation ID xuyên suốt HTTP/outbox/job/AI/posting.
- Metrics: queue depth, outbox lag, dead jobs, AI latency/error, correction rate, Telegram failure, posting failure.
- Dashboard dead-letter/manual recovery, health/readiness checks, alerts và backup restore drill.
- PostgreSQL PITR, Object Storage versioning, TLS, least-privilege database roles và dependency scanning.

Optional for future scale:

- PostgreSQL read replica cho report, partition audit/message lớn, archival policy.
- Dedicated worker pools và Ollama nodes theo model/tải.
- Chỉ tách document/AI service khi có bằng chứng về tải, ownership team hoặc release cadence độc lập.

## 10. Vai trò của Ollama và n8n

Ollama chỉ được gọi qua AI Gateway. Gateway sở hữu model routing, prompt registry/version, structured output, schema validation, timeout, fallback, tool allowlist, privacy filter và tracing. AI không sinh/chạy SQL, không tạo master data không phê duyệt và không ghi Business Document hay Ledger.

n8n dùng cho email, Google Sheets, CRM, Slack, external webhook và workflow phụ trợ. n8n không nằm trên đường chính Telegram intake -> AI -> Review -> Posting, không làm source of truth và không truy cập trực tiếp bảng nội bộ. Mọi callback phải authenticated, idempotent và đi qua public application API.

## 11. Kế hoạch phát triển theo phase

Mỗi task dưới đây đủ nhỏ để triển khai và review độc lập. Thứ tự task trong một phase là thứ tự khuyến nghị.

### Phase 0 - Architecture baseline và safety net

Scope: tạo nền kỹ thuật trước khi thêm integration.

- [ ] `P0-01` Chốt ADR Modular Monolith + Worker, module import rules và naming convention.
- [ ] `P0-02` Bổ sung test runner, unit/integration test config và database test fixture.
- [ ] `P0-03` Chuẩn hóa error response, request validation và correlation ID.
- [ ] `P0-04` Tách route báo cáo đầu tiên thành controller -> use case -> repository làm mẫu.
- [ ] `P0-05` Thêm migration workflow; không dùng schema push trực tiếp trong production.
- [ ] `P0-06` Chuẩn hóa UTF-8 và CI chạy build, lint/typecheck, test.

Tests: smoke auth/API, repository integration và contract test. Rollback: route cũ nằm sau feature flag cho đến khi parity.

### Phase 1 - Tenant, Telegram ingestion và persistence

Scope: persist message/evidence trước xử lý; chưa gọi AI.

- [ ] `P1-01` Tạo tenants, memberships, roles và thêm tenant_id vào data mới.
- [ ] `P1-02` Tạo telegram_identities, conversations, inbound_messages, outbound_messages.
- [ ] `P1-03` Tạo Telegram webhook adapter với secret verification và payload validation.
- [ ] `P1-04` Thêm unique constraint cho update_id/callback_query_id và test duplicate webhook.
- [ ] `P1-05` Tạo storage adapter S3/MinIO, documents metadata, checksum và ownership.
- [ ] `P1-06` Download file Telegram an toàn; persist message + document metadata trong transaction.
- [ ] `P1-07` Thêm audit event cho link identity, inbound message và file access.

Compatibility: API cũ tiếp tục hoạt động; tenant mặc định chỉ dùng cho migration dev. Rollback: tắt webhook, giữ dữ liệu đã persist, không drop table.

### Phase 2 - Submission Inbox

Scope: gom nhiều message/file thành một đơn vị intake rõ ràng.

- [ ] `P2-01` Tạo submissions, submission_messages, submission_documents và state transition guard.
- [ ] `P2-02` Implement grouping theo reply-to và explicit “Hoàn tất gửi”.
- [ ] `P2-03` Thêm conversation state; time window chỉ là fallback có cấu hình.
- [ ] `P2-04` Xây Web Inbox list/detail và quyền xem theo tenant.
- [ ] `P2-05` Thêm append-message, complete, reject API và audit trail.
- [ ] `P2-06` Test concurrent messages, late message, duplicate và cross-tenant access.

Rollback: tắt auto-grouping, cho phép tạo submission thủ công từ message đã lưu.

### Phase 3 - Transactional Outbox, BullMQ và Worker

Scope: async foundation bền vững; chưa phụ thuộc AI.

- [ ] `P3-01` Tạo outbox_events và API append event trong cùng transaction nghiệp vụ.
- [ ] `P3-02` Cài Redis/BullMQ adapter, queue naming và job envelope versioned.
- [ ] `P3-03` Tạo worker app, graceful shutdown, health check và structured logging.
- [ ] `P3-04` Implement outbox publisher với claim/lock, retry và duplicate-safe publish.
- [ ] `P3-05` Implement dead-letter/manual replay có permission và audit.
- [ ] `P3-06` Tạo `telegram.send` processor và lưu delivery state.
- [ ] `P3-07` Test Redis outage, worker crash, duplicate delivery và outbox recovery.

Rollback: dừng worker/publisher; event vẫn PENDING trong PostgreSQL và có thể replay.

### Phase 4 - AI Gateway và extraction

Scope: xử lý media/AI bất đồng bộ, chỉ tạo proposal.

- [ ] `P4-01` Tạo AI Gateway interface và Ollama adapter với timeout/health check.
- [ ] `P4-02` Tạo prompt registry, pipeline/model/prompt/schema version.
- [ ] `P4-03` Định nghĩa JSON schema extraction và validator fail-closed.
- [ ] `P4-04` Tạo extraction_runs/results/fields, confidence và evidence.
- [ ] `P4-05` Implement `media.process` cho image/PDF normalization.
- [ ] `P4-06` Implement `ai.extract`, retry policy và terminal error classification.
- [ ] `P4-07` Thêm Authorized Domain Tools read-only cho supplier/tax/account candidates.
- [ ] `P4-08` Test malformed output, Ollama outage, rerun và duplicate extraction.

Rollback: disable extraction consumer; submission/evidence vẫn STORED và queue lại sau.

### Phase 5 - Human Review

Scope: mọi AI proposal phải được người có quyền xác nhận.

- [ ] `P5-01` Tạo review_tasks/review_changes và state machine.
- [ ] `P5-02` Xây Review Queue API có assignment/locking để tránh hai reviewer ghi đè.
- [ ] `P5-03` Xây Web Review UI đối chiếu ảnh/PDF, value, confidence và evidence.
- [ ] `P5-04` Lưu riêng proposed, confirmed, corrected value và correction reason.
- [ ] `P5-05` Thêm Telegram quick confirm/reject và signed deep link có expiry.
- [ ] `P5-06` Thêm policy reviewer/accountant/manager và chống self-approval khi cần.
- [ ] `P5-07` Test concurrent review, expired link, audit correction và tenant isolation.

Rollback: disable Telegram quick actions; review vẫn thực hiện trên Web, không mất proposal.

### Phase 6 - Business Documents và reconciliation

Scope: biến dữ liệu đã xác nhận thành chứng từ nghiệp vụ, chưa thay Ledger cũ nếu chưa sẵn sàng.

- [ ] `P6-01` Tạo business_documents, invoice_lines và note với lifecycle guard.
- [ ] `P6-02` Implement createFromReview idempotent; Note không tài chính dừng ở RECORDED.
- [ ] `P6-03` Tạo master data APIs cho partner, tax rule, account, category, project.
- [ ] `P6-04` Tạo payments và payment_allocations hỗ trợ partial/multi-invoice/unapplied.
- [ ] `P6-05` Thêm duplicate invoice detection theo tenant/supplier/number/date/amount/checksum.
- [ ] `P6-06` Chuyển invoice/debt stub sang read model từ module mới sau feature flag.
- [ ] `P6-07` Test duplicate document, allocation, refund, cancellation và history integrity.

Rollback: feature flag đọc API cũ; chứng từ mới giữ nguyên, không reverse bằng delete.

### Phase 7 - Posting Engine và General Ledger

Scope: tạo nguồn số liệu kế toán authoritative.

- [ ] `P7-01` Tạo chart_of_accounts, accounting_periods, journal_entries, journal_lines.
- [ ] `P7-02` Xây posting rule cho purchase invoice/expense/payment/receipt đầu tiên.
- [ ] `P7-03` Validate permission, confirmed state, open period, account/tax/currency và evidence.
- [ ] `P7-04` Atomic posting với unique source document/version và Debit = Credit.
- [ ] `P7-05` Implement reversal/adjustment; cấm update/delete journal posted trong application flow.
- [ ] `P7-06` Thêm period closing/locking policy.
- [ ] `P7-07` Audit toàn bộ posting/reversal và correlation từ submission đến journal.
- [ ] `P7-08` Test balanced posting, double-post, closed period, retry và concurrent posting.

Rollback: dừng posting mới; journal đã post không xóa, dùng reversal theo nghiệp vụ.

### Phase 8 - Reporting read models và export

Scope: report chỉ đọc và có thể rebuild từ Ledger/Business Documents.

- [ ] `P8-01` Định nghĩa report contracts và mapping từ Ledger.
- [ ] `P8-02` Tạo SQL view/materialized view cho revenue, expense, AR/AP, tax và cash.
- [ ] `P8-03` Chuyển dashboard/API report sang read model mới bằng feature flag.
- [ ] `P8-04` Implement read-model rebuild và reconciliation với Ledger totals.
- [ ] `P8-05` Implement `report.export`, lưu file export trong Object Storage.
- [ ] `P8-06` Thêm index, pagination và đo query plan trước khi cân nhắc read replica.
- [ ] `P8-07` Test rebuild, historical consistency, tenant scope và export retry.

Rollback: chuyển read feature flag về query cũ; read model có thể drop/rebuild, không ảnh hưởng Ledger.

### Phase 9 - Production hardening, reminder và n8n

Scope: vận hành an toàn và mở rộng tích hợp.

- [ ] `P9-01` Daily reminder scheduler tạo outbound message + outbox, không gọi Telegram trực tiếp.
- [ ] `P9-02` Thêm timezone, working days, DND và idempotency theo user/local date.
- [ ] `P9-03` Tạo n8n adapter với signed webhook, allowlist workflow và status sync.
- [ ] `P9-04` Hoàn thiện RBAC/ABAC matrix, rate limit, secret rotation và least privilege.
- [ ] `P9-05` Dashboard metrics/trace/alerts cho outbox, queue, AI, Telegram và posting.
- [ ] `P9-06` Backup/PITR, restore drill, object lifecycle và disaster recovery runbook.
- [ ] `P9-07` Load test Web/Worker/Ollama; cấu hình concurrency và autoscaling thresholds.
- [ ] `P9-08` Security review, dependency scan, penetration test và production readiness review.

Rollback: từng integration/reminder có feature flag; core ERP và Ledger tiếp tục độc lập.

## 12. Testing strategy và Definition of Done

Test pyramid:

- Unit: domain transition, grouping, permission, duplicate detection, accounting rules.
- Integration: repositories, unique constraints, transactions, tenant isolation, object ownership.
- Worker: retry, timeout, idempotency, dead-letter và outbox recovery.
- Contract: Telegram payload, queue envelope, Ollama structured output và n8n callbacks.
- E2E: Telegram -> evidence -> extraction -> review -> Business Document -> Posting -> Report.

Một phase chỉ hoàn tất khi:

- Migration forward chạy được và rollback/data recovery đã được mô tả.
- Build, lint/typecheck và test liên quan pass trong CI.
- API/queue contract có version và validation.
- Tenant isolation, permission, audit và idempotency được test cho đường ghi dữ liệu.
- Không có log chứa secret hoặc nội dung chứng từ nhạy cảm.
- Tài liệu và `context.md` phản ánh đúng quyết định mới.

## 13. Chạy dự án hiện tại

Yêu cầu: Node.js 18+, npm và PostgreSQL.

```bash
npm install
npm run dev
```

Biến môi trường hiện tại:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/erp"
JWT_SECRET="replace-with-a-strong-secret"
```

Các script đang có trong `package.json`:

```bash
npm run dev
npm run build
npm run generate
npm run preview
npm run lint
npm run typecheck
npm run test
npm run ci
npm run db:generate
npm run db:migrate
```

## 14. Sprint 0 implementation status

Implemented baseline tasks:

- `ERP-001`: Added ESLint, Nuxt typecheck and Vitest scripts.
- `ERP-002`: Added a PostgreSQL integration-test fixture gated by `TEST_DATABASE_URL`.
- `ERP-003`: Added Drizzle migration scripts `db:generate` and `db:migrate`.
- `ERP-004`: Added shared API error contract; Revenue validation errors now return HTTP 400 instead of being masked as HTTP 500.
- `ERP-005`: Added request ID middleware and `x-request-id` response propagation.
- `ERP-006`: Added shared body, route param and pagination query validators.
- `ERP-007`: Added Revenue API characterization test for validation contract.
- `ERP-008`: Added GitHub Actions quality gate for install, lint, typecheck, test and build.
- `ERP-009`: Added Supabase connectivity helper, test and `GET /api/auth/supabase-connect`.

Notes:

- `npm run test` does not require a live PostgreSQL database by default.
- PostgreSQL integration tests run only when `TEST_DATABASE_URL` is configured.
- Supabase connect can be checked with `GET /api/auth/supabase-connect`; it returns `503` when Supabase env vars are missing or the connection fails.
- If `nuxt prepare`, `typecheck` or `build` fails with `EPERM` inside `.nuxt`, stop any running Nuxt/Node watcher and rerun `npm run postinstall`.

## 15. Supabase manual-safe baseline

The Supabase-ready manual-safe baseline is generated in:

```bash
drizzle/0000_shiny_human_cannonball.sql
```

It can be pasted into Supabase SQL Editor for a fresh or partially-created development database. It uses `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS` and idempotent foreign-key blocks so rerunning after a partial failure is safer.

It creates the legacy ERP tables plus the modular foundation tables for:

- IAM and tenants: `tenants`, `user_tenant_memberships`, `roles`, `telegram_identities`
- Messaging and intake: `conversations`, `inbound_messages`, `outbound_messages`, `submissions`, `submission_messages`, `submission_documents`
- Evidence and AI: `documents`, `extraction_runs`, `extraction_results`, `extraction_fields`
- Human review: `review_tasks`, `review_changes`
- Accounting core: `business_documents`, `business_document_lines`, `chart_of_accounts`, `accounting_periods`, `journal_entries`, `journal_lines`, `payments`, `payment_allocations`
- Platform: `audit_events`, `outbox_events`, `integration_runs`

For normal CLI migration, set `DATABASE_URL` to the Supabase PostgreSQL connection string and run:

```bash
npm run db:migrate
```

If you already started manually and hit a missing-table error, rerun the manual-safe SQL file above; it will create missing tables such as `public.users` before applying the foreign keys.

Queue, storage, Ollama, n8n, migration và test scripts sẽ được thêm ở các phase tương ứng; README không coi các thành phần đó là đã triển khai.
