-- Manual-safe full baseline for Supabase SQL Editor.
-- Uses IF NOT EXISTS and idempotent FK blocks so it can be rerun after partial failures.
CREATE TABLE IF NOT EXISTS "accounting_periods" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"status" varchar(30) DEFAULT 'open' NOT NULL,
	"closed_at" timestamp,
	"closed_by_user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer,
	"actor_user_id" integer,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(100),
	"request_id" varchar(128),
	"correlation_id" varchar(128),
	"before" jsonb,
	"after" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bao_cao_thue" (
	"id" serial PRIMARY KEY NOT NULL,
	"ma_bao_cao" varchar(100) NOT NULL,
	"loai_thue" varchar(50) NOT NULL,
	"ky_bao_cao" varchar(20) NOT NULL,
	"ngay_bat_dau" date NOT NULL,
	"ngay_ket_thuc" date NOT NULL,
	"tong_doanh_thu" numeric(18, 2) DEFAULT '0',
	"tong_chi_phi" numeric(18, 2) DEFAULT '0',
	"so_tien_chiu_thue" numeric(18, 2) DEFAULT '0',
	"ty_le_thue" numeric(5, 2) DEFAULT '0',
	"so_tien_thue" numeric(18, 2) DEFAULT '0',
	"so_tien_da_tra" numeric(18, 2) DEFAULT '0',
	"trang_thai" varchar(30) DEFAULT 'ban_nhap',
	"ngay_nop" timestamp,
	"han_nop" date,
	"ngay_tra" timestamp,
	"ghi_chu" text,
	"metadata" jsonb,
	"nguoi_tao_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "bao_cao_thue_ma_bao_cao_unique" UNIQUE("ma_bao_cao")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_document_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"business_document_id" integer NOT NULL,
	"line_no" integer NOT NULL,
	"description" text,
	"quantity" numeric(18, 3) DEFAULT '1' NOT NULL,
	"unit_price" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"line_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"source_review_task_id" integer,
	"document_type" varchar(50) NOT NULL,
	"document_number" varchar(100),
	"document_date" date NOT NULL,
	"partner_name" varchar(255),
	"partner_tax_code" varchar(50),
	"currency" varchar(3) DEFAULT 'VND' NOT NULL,
	"subtotal_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"idempotency_key" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chart_of_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"account_type" varchar(50) NOT NULL,
	"parent_account_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chi_tiet_thue" (
	"id" serial PRIMARY KEY NOT NULL,
	"bao_cao_thue_id" integer NOT NULL,
	"danh_muc" varchar(100) NOT NULL,
	"mo_ta" text,
	"so_tien_tinh_thue" numeric(18, 2) NOT NULL,
	"ty_le_thue" numeric(5, 2) NOT NULL,
	"tien_thue" numeric(18, 2) NOT NULL,
	"hoa_don_ban_id" integer,
	"hoa_don_mua_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cong_no" (
	"id" serial PRIMARY KEY NOT NULL,
	"doi_tac_id" integer NOT NULL,
	"loai_cong_no" varchar(30) NOT NULL,
	"so_tien" numeric(18, 2) NOT NULL,
	"han_thanh_toan" date,
	"hoa_don_ban_id" integer,
	"hoa_don_mua_id" integer,
	"trang_thai" varchar(30) DEFAULT 'chua_thanh_toan',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"channel" varchar(50) NOT NULL,
	"external_conversation_id" varchar(255) NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doanh_nghiep" (
	"id" serial PRIMARY KEY NOT NULL,
	"ten_doanh_nghiep" varchar(255) DEFAULT 'CÆ¡ sá»Ÿ ÄiÃªu Kháº¯c Trang TrÃ­ VÄ©nh Tiáº¿n',
	"ma_so_thue" varchar(50) DEFAULT '042179006886',
	"dia_chi" text DEFAULT '1955, xÃ£ BÃ¬nh Minh, tá»‰nh Äá»“ng Nai'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"owner_user_id" integer,
	"source" varchar(50) DEFAULT 'web' NOT NULL,
	"object_key" text NOT NULL,
	"file_name" varchar(500),
	"mime_type" varchar(255) NOT NULL,
	"size_bytes" integer NOT NULL,
	"checksum_sha256" varchar(64) NOT NULL,
	"status" varchar(30) DEFAULT 'stored' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doi_tac" (
	"id" serial PRIMARY KEY NOT NULL,
	"ma_doi_tac" varchar(50) NOT NULL,
	"ten_doi_tac" varchar(255) NOT NULL,
	"loai_doi_tac" varchar(30) NOT NULL,
	"ma_so_thue" varchar(50),
	"dia_chi" text,
	"dien_thoai" varchar(20),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "doi_tac_ma_doi_tac_unique" UNIQUE("ma_doi_tac")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "don_chi_phi" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_book_id" integer NOT NULL,
	"hoa_don_mua_id" integer,
	"so_chung_tu" varchar(100),
	"ngay_ghi_nhan" date NOT NULL,
	"mo_ta" text,
	"phan_loai" varchar(100),
	"so_tien" numeric(18, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "don_doanh_thu" (
	"id" serial PRIMARY KEY NOT NULL,
	"revenue_book_id" integer NOT NULL,
	"hoa_don_ban_id" integer,
	"so_chung_tu" varchar(100) NOT NULL,
	"ngay_ghi_nhan" date NOT NULL,
	"mo_ta" text,
	"phan_loai" varchar(100),
	"so_tien" numeric(18, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "extraction_fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"extraction_result_id" integer NOT NULL,
	"field_path" varchar(255) NOT NULL,
	"value" jsonb,
	"confidence" numeric(5, 4),
	"evidence" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "extraction_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"extraction_run_id" integer NOT NULL,
	"schema_version" varchar(100) NOT NULL,
	"result" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"overall_confidence" numeric(5, 4),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "extraction_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"submission_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'queued' NOT NULL,
	"pipeline_version" varchar(100) NOT NULL,
	"model_name" varchar(255),
	"prompt_version" varchar(100),
	"started_at" timestamp,
	"finished_at" timestamp,
	"error_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "giao_dich_thanh_toan" (
	"id" serial PRIMARY KEY NOT NULL,
	"ma_giao_dich" varchar(100) NOT NULL,
	"loai_giao_dich" varchar(30) NOT NULL,
	"doi_tac_id" integer,
	"hoa_don_ban_id" integer,
	"hoa_don_mua_id" integer,
	"cong_no_id" integer,
	"so_tien" numeric(18, 2) NOT NULL,
	"phuong_thuc" varchar(50) DEFAULT 'tien_mat',
	"ngay_giao_dich" date NOT NULL,
	"ten_ngan_hang" varchar(255),
	"so_tai_khoan" varchar(50),
	"ma_tham_chieu" varchar(255),
	"ghi_chu" text,
	"nguoi_tao_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "giao_dich_thanh_toan_ma_giao_dich_unique" UNIQUE("ma_giao_dich")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hoa_don_ban" (
	"id" serial PRIMARY KEY NOT NULL,
	"ma_hoa_don" varchar(100) NOT NULL,
	"doi_tac_id" integer NOT NULL,
	"hop_dong_id" integer,
	"ngay_hoa_don" date NOT NULL,
	"tong_tien" numeric(18, 2) DEFAULT '0',
	"trang_thai" varchar(30) DEFAULT 'chua_thu',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "hoa_don_ban_ma_hoa_don_unique" UNIQUE("ma_hoa_don")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hoa_don_ban_chi_tiet" (
	"id" serial PRIMARY KEY NOT NULL,
	"hoa_don_ban_id" integer NOT NULL,
	"ten_hang_hoa" varchar(255) NOT NULL,
	"mo_ta" text,
	"so_luong" numeric(18, 3) NOT NULL,
	"don_vi" varchar(50),
	"don_gia" numeric(18, 2) NOT NULL,
	"ty_le_thue" numeric(5, 2) DEFAULT '10',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hoa_don_mua" (
	"id" serial PRIMARY KEY NOT NULL,
	"ma_hoa_don" varchar(100) NOT NULL,
	"doi_tac_id" integer NOT NULL,
	"ngay_hoa_don" date NOT NULL,
	"tong_tien" numeric(18, 2) DEFAULT '0',
	"trang_thai" varchar(30) DEFAULT 'chua_tra',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "hoa_don_mua_ma_hoa_don_unique" UNIQUE("ma_hoa_don")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hoa_don_mua_chi_tiet" (
	"id" serial PRIMARY KEY NOT NULL,
	"hoa_don_mua_id" integer NOT NULL,
	"ten_hang_hoa" varchar(255) NOT NULL,
	"mo_ta" text,
	"so_luong" numeric(18, 3) NOT NULL,
	"don_vi" varchar(50),
	"don_gia" numeric(18, 2) NOT NULL,
	"ty_le_thue" numeric(5, 2) DEFAULT '10',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hop_dong" (
	"id" serial PRIMARY KEY NOT NULL,
	"ma_hop_dong" varchar(100),
	"doi_tac_id" integer,
	"tong_gia_tri" numeric(18, 2),
	"ngay_bat_dau" date,
	"ngay_ket_thuc" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "hop_dong_ma_hop_dong_unique" UNIQUE("ma_hop_dong")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inbound_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	"channel" varchar(50) NOT NULL,
	"external_message_id" varchar(255),
	"telegram_update_id" varchar(100),
	"sender_user_id" integer,
	"message_type" varchar(50) DEFAULT 'text' NOT NULL,
	"body_text" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer,
	"provider" varchar(100) NOT NULL,
	"workflow_key" varchar(150) NOT NULL,
	"status" varchar(30) DEFAULT 'queued' NOT NULL,
	"request_payload" jsonb DEFAULT '{}'::jsonb,
	"response_payload" jsonb DEFAULT '{}'::jsonb,
	"idempotency_key" varchar(255),
	"started_at" timestamp,
	"finished_at" timestamp,
	"last_error" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"accounting_period_id" integer NOT NULL,
	"source_document_id" integer,
	"entry_number" varchar(100) NOT NULL,
	"entry_date" date NOT NULL,
	"description" text,
	"status" varchar(30) DEFAULT 'posted' NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"idempotency_key" varchar(255),
	"posted_at" timestamp DEFAULT now(),
	"posted_by_user_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"journal_entry_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"line_no" integer NOT NULL,
	"description" text,
	"debit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"credit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"currency" varchar(3) DEFAULT 'VND' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outbound_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"conversation_id" integer,
	"channel" varchar(50) NOT NULL,
	"recipient_external_id" varchar(255) NOT NULL,
	"body_text" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"idempotency_key" varchar(255),
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outbox_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer,
	"event_type" varchar(150) NOT NULL,
	"aggregate_type" varchar(100) NOT NULL,
	"aggregate_id" varchar(100) NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"idempotency_key" varchar(255),
	"available_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"last_error" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_allocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"payment_id" integer NOT NULL,
	"business_document_id" integer NOT NULL,
	"allocated_amount" numeric(18, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"payment_number" varchar(100) NOT NULL,
	"payment_type" varchar(50) NOT NULL,
	"payment_date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'VND' NOT NULL,
	"method" varchar(50) DEFAULT 'cash' NOT NULL,
	"reference" varchar(255),
	"status" varchar(30) DEFAULT 'recorded' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"review_task_id" integer NOT NULL,
	"changed_by_user_id" integer,
	"field_path" varchar(255) NOT NULL,
	"proposed_value" jsonb,
	"confirmed_value" jsonb,
	"reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"submission_id" integer NOT NULL,
	"extraction_result_id" integer,
	"assigned_to_user_id" integer,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp,
	"locked_at" timestamp,
	"locked_by_user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "so_chi_phi" (
	"id" serial PRIMARY KEY NOT NULL,
	"doanh_nghiep_id" integer,
	"mau_so" varchar(100) DEFAULT 'S2c-HKD TT 152/2025/TT-BTC 31/12/2025',
	"ngay_bat_dau" date NOT NULL,
	"ngay_ket_thuc" date NOT NULL,
	"tong_tien" numeric(18, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "so_doanh_thu" (
	"id" serial PRIMARY KEY NOT NULL,
	"doanh_nghiep_id" integer,
	"mau_so" varchar(100) DEFAULT 'S1a-HKD TT 152/2025/TT-BTC 31/12/2025',
	"ngay_bat_dau" date NOT NULL,
	"ngay_ket_thuc" date NOT NULL,
	"tong_tien" numeric(18, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submission_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"submission_id" integer NOT NULL,
	"document_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submission_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"submission_id" integer NOT NULL,
	"inbound_message_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"created_by_user_id" integer,
	"conversation_id" integer,
	"status" varchar(50) DEFAULT 'received' NOT NULL,
	"title" varchar(255),
	"description" text,
	"idempotency_key" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "telegram_identities" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"user_id" integer,
	"telegram_user_id" varchar(100) NOT NULL,
	"username" varchar(255),
	"display_name" varchar(255),
	"status" varchar(30) DEFAULT 'linked' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"timezone" varchar(100) DEFAULT 'Asia/Ho_Chi_Minh' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_tenant_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenant_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"username" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "accounting_periods" ADD CONSTRAINT "accounting_periods_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "accounting_periods" ADD CONSTRAINT "accounting_periods_closed_by_user_id_users_id_fk" FOREIGN KEY ("closed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "bao_cao_thue" ADD CONSTRAINT "bao_cao_thue_nguoi_tao_id_users_id_fk" FOREIGN KEY ("nguoi_tao_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "business_document_lines" ADD CONSTRAINT "business_document_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "business_document_lines" ADD CONSTRAINT "business_document_lines_business_document_id_business_documents_id_fk" FOREIGN KEY ("business_document_id") REFERENCES "public"."business_documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_source_review_task_id_review_tasks_id_fk" FOREIGN KEY ("source_review_task_id") REFERENCES "public"."review_tasks"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "chi_tiet_thue" ADD CONSTRAINT "chi_tiet_thue_bao_cao_thue_id_bao_cao_thue_id_fk" FOREIGN KEY ("bao_cao_thue_id") REFERENCES "public"."bao_cao_thue"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "chi_tiet_thue" ADD CONSTRAINT "chi_tiet_thue_hoa_don_ban_id_hoa_don_ban_id_fk" FOREIGN KEY ("hoa_don_ban_id") REFERENCES "public"."hoa_don_ban"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "chi_tiet_thue" ADD CONSTRAINT "chi_tiet_thue_hoa_don_mua_id_hoa_don_mua_id_fk" FOREIGN KEY ("hoa_don_mua_id") REFERENCES "public"."hoa_don_mua"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "cong_no" ADD CONSTRAINT "cong_no_doi_tac_id_doi_tac_id_fk" FOREIGN KEY ("doi_tac_id") REFERENCES "public"."doi_tac"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "cong_no" ADD CONSTRAINT "cong_no_hoa_don_ban_id_hoa_don_ban_id_fk" FOREIGN KEY ("hoa_don_ban_id") REFERENCES "public"."hoa_don_ban"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "cong_no" ADD CONSTRAINT "cong_no_hoa_don_mua_id_hoa_don_mua_id_fk" FOREIGN KEY ("hoa_don_mua_id") REFERENCES "public"."hoa_don_mua"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "conversations" ADD CONSTRAINT "conversations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "don_chi_phi" ADD CONSTRAINT "don_chi_phi_expense_book_id_so_chi_phi_id_fk" FOREIGN KEY ("expense_book_id") REFERENCES "public"."so_chi_phi"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "don_chi_phi" ADD CONSTRAINT "don_chi_phi_hoa_don_mua_id_hoa_don_mua_id_fk" FOREIGN KEY ("hoa_don_mua_id") REFERENCES "public"."hoa_don_mua"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "don_doanh_thu" ADD CONSTRAINT "don_doanh_thu_revenue_book_id_so_doanh_thu_id_fk" FOREIGN KEY ("revenue_book_id") REFERENCES "public"."so_doanh_thu"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "don_doanh_thu" ADD CONSTRAINT "don_doanh_thu_hoa_don_ban_id_hoa_don_ban_id_fk" FOREIGN KEY ("hoa_don_ban_id") REFERENCES "public"."hoa_don_ban"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "extraction_fields" ADD CONSTRAINT "extraction_fields_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "extraction_fields" ADD CONSTRAINT "extraction_fields_extraction_result_id_extraction_results_id_fk" FOREIGN KEY ("extraction_result_id") REFERENCES "public"."extraction_results"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "extraction_results" ADD CONSTRAINT "extraction_results_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "extraction_results" ADD CONSTRAINT "extraction_results_extraction_run_id_extraction_runs_id_fk" FOREIGN KEY ("extraction_run_id") REFERENCES "public"."extraction_runs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "extraction_runs" ADD CONSTRAINT "extraction_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "extraction_runs" ADD CONSTRAINT "extraction_runs_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "giao_dich_thanh_toan" ADD CONSTRAINT "giao_dich_thanh_toan_doi_tac_id_doi_tac_id_fk" FOREIGN KEY ("doi_tac_id") REFERENCES "public"."doi_tac"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "giao_dich_thanh_toan" ADD CONSTRAINT "giao_dich_thanh_toan_hoa_don_ban_id_hoa_don_ban_id_fk" FOREIGN KEY ("hoa_don_ban_id") REFERENCES "public"."hoa_don_ban"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "giao_dich_thanh_toan" ADD CONSTRAINT "giao_dich_thanh_toan_hoa_don_mua_id_hoa_don_mua_id_fk" FOREIGN KEY ("hoa_don_mua_id") REFERENCES "public"."hoa_don_mua"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "giao_dich_thanh_toan" ADD CONSTRAINT "giao_dich_thanh_toan_cong_no_id_cong_no_id_fk" FOREIGN KEY ("cong_no_id") REFERENCES "public"."cong_no"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "giao_dich_thanh_toan" ADD CONSTRAINT "giao_dich_thanh_toan_nguoi_tao_id_users_id_fk" FOREIGN KEY ("nguoi_tao_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "hoa_don_ban" ADD CONSTRAINT "hoa_don_ban_doi_tac_id_doi_tac_id_fk" FOREIGN KEY ("doi_tac_id") REFERENCES "public"."doi_tac"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "hoa_don_ban" ADD CONSTRAINT "hoa_don_ban_hop_dong_id_hop_dong_id_fk" FOREIGN KEY ("hop_dong_id") REFERENCES "public"."hop_dong"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "hoa_don_ban_chi_tiet" ADD CONSTRAINT "hoa_don_ban_chi_tiet_hoa_don_ban_id_hoa_don_ban_id_fk" FOREIGN KEY ("hoa_don_ban_id") REFERENCES "public"."hoa_don_ban"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "hoa_don_mua" ADD CONSTRAINT "hoa_don_mua_doi_tac_id_doi_tac_id_fk" FOREIGN KEY ("doi_tac_id") REFERENCES "public"."doi_tac"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "hoa_don_mua_chi_tiet" ADD CONSTRAINT "hoa_don_mua_chi_tiet_hoa_don_mua_id_hoa_don_mua_id_fk" FOREIGN KEY ("hoa_don_mua_id") REFERENCES "public"."hoa_don_mua"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "hop_dong" ADD CONSTRAINT "hop_dong_doi_tac_id_doi_tac_id_fk" FOREIGN KEY ("doi_tac_id") REFERENCES "public"."doi_tac"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "inbound_messages" ADD CONSTRAINT "inbound_messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "integration_runs" ADD CONSTRAINT "integration_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_accounting_period_id_accounting_periods_id_fk" FOREIGN KEY ("accounting_period_id") REFERENCES "public"."accounting_periods"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_source_document_id_business_documents_id_fk" FOREIGN KEY ("source_document_id") REFERENCES "public"."business_documents"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_posted_by_user_id_users_id_fk" FOREIGN KEY ("posted_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "outbound_messages" ADD CONSTRAINT "outbound_messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "outbox_events" ADD CONSTRAINT "outbox_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_business_document_id_business_documents_id_fk" FOREIGN KEY ("business_document_id") REFERENCES "public"."business_documents"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_changes" ADD CONSTRAINT "review_changes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_changes" ADD CONSTRAINT "review_changes_review_task_id_review_tasks_id_fk" FOREIGN KEY ("review_task_id") REFERENCES "public"."review_tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_changes" ADD CONSTRAINT "review_changes_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_extraction_result_id_extraction_results_id_fk" FOREIGN KEY ("extraction_result_id") REFERENCES "public"."extraction_results"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_assigned_to_user_id_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_locked_by_user_id_users_id_fk" FOREIGN KEY ("locked_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "so_chi_phi" ADD CONSTRAINT "so_chi_phi_doanh_nghiep_id_doanh_nghiep_id_fk" FOREIGN KEY ("doanh_nghiep_id") REFERENCES "public"."doanh_nghiep"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "so_doanh_thu" ADD CONSTRAINT "so_doanh_thu_doanh_nghiep_id_doanh_nghiep_id_fk" FOREIGN KEY ("doanh_nghiep_id") REFERENCES "public"."doanh_nghiep"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submission_documents" ADD CONSTRAINT "submission_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submission_documents" ADD CONSTRAINT "submission_documents_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submission_documents" ADD CONSTRAINT "submission_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submission_messages" ADD CONSTRAINT "submission_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submission_messages" ADD CONSTRAINT "submission_messages_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submission_messages" ADD CONSTRAINT "submission_messages_inbound_message_id_inbound_messages_id_fk" FOREIGN KEY ("inbound_message_id") REFERENCES "public"."inbound_messages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submissions" ADD CONSTRAINT "submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submissions" ADD CONSTRAINT "submissions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "submissions" ADD CONSTRAINT "submissions_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "telegram_identities" ADD CONSTRAINT "telegram_identities_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "telegram_identities" ADD CONSTRAINT "telegram_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "user_tenant_memberships" ADD CONSTRAINT "user_tenant_memberships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "user_tenant_memberships" ADD CONSTRAINT "user_tenant_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_accounting_periods_tenant_range" ON "accounting_periods" USING btree ("tenant_id","period_start","period_end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_accounting_periods_status" ON "accounting_periods" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_events_entity" ON "audit_events" USING btree ("tenant_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_events_correlation" ON "audit_events" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bao_cao_thue_trang_thai" ON "bao_cao_thue" USING btree ("trang_thai");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bao_cao_thue_ngay" ON "bao_cao_thue" USING btree ("ngay_bat_dau","ngay_ket_thuc");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_business_document_lines_doc_line" ON "business_document_lines" USING btree ("business_document_id","line_no");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_business_documents_tenant_idempotency" ON "business_documents" USING btree ("tenant_id","idempotency_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_business_documents_duplicate" ON "business_documents" USING btree ("tenant_id","partner_tax_code","document_number","document_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_business_documents_status" ON "business_documents" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_chart_of_accounts_tenant_code" ON "chart_of_accounts" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chart_of_accounts_type" ON "chart_of_accounts" USING btree ("tenant_id","account_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chi_tiet_thue_bao_cao" ON "chi_tiet_thue" USING btree ("bao_cao_thue_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cong_no_doi_tac" ON "cong_no" USING btree ("doi_tac_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cong_no_trang_thai" ON "cong_no" USING btree ("trang_thai");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_conversations_tenant_channel_external" ON "conversations" USING btree ("tenant_id","channel","external_conversation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_conversations_status" ON "conversations" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_documents_object_key" ON "documents" USING btree ("object_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_documents_tenant_checksum" ON "documents" USING btree ("tenant_id","checksum_sha256");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_documents_status" ON "documents" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_don_chi_phi_ngay" ON "don_chi_phi" USING btree ("ngay_ghi_nhan");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_don_chi_phi_hoa_don" ON "don_chi_phi" USING btree ("hoa_don_mua_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_don_doanh_thu_ngay" ON "don_doanh_thu" USING btree ("ngay_ghi_nhan");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_don_doanh_thu_hoa_don" ON "don_doanh_thu" USING btree ("hoa_don_ban_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_extraction_fields_result_path" ON "extraction_fields" USING btree ("extraction_result_id","field_path");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_extraction_results_run" ON "extraction_results" USING btree ("extraction_run_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_extraction_runs_submission_pipeline" ON "extraction_runs" USING btree ("submission_id","pipeline_version");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_extraction_runs_status" ON "extraction_runs" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_giao_dich_thanh_toan_ngay" ON "giao_dich_thanh_toan" USING btree ("ngay_giao_dich");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_giao_dich_thanh_toan_doi_tac" ON "giao_dich_thanh_toan" USING btree ("doi_tac_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hoa_don_ban_doi_tac" ON "hoa_don_ban" USING btree ("doi_tac_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hoa_don_ban_ngay" ON "hoa_don_ban" USING btree ("ngay_hoa_don");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hoa_don_ban_chi_tiet" ON "hoa_don_ban_chi_tiet" USING btree ("hoa_don_ban_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hoa_don_mua_doi_tac" ON "hoa_don_mua" USING btree ("doi_tac_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hoa_don_mua_ngay" ON "hoa_don_mua" USING btree ("ngay_hoa_don");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hoa_don_mua_chi_tiet" ON "hoa_don_mua_chi_tiet" USING btree ("hoa_don_mua_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_inbound_messages_channel_update" ON "inbound_messages" USING btree ("channel","telegram_update_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_inbound_messages_conversation" ON "inbound_messages" USING btree ("conversation_id","received_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_integration_runs_idempotency" ON "integration_runs" USING btree ("tenant_id","provider","idempotency_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_integration_runs_status" ON "integration_runs" USING btree ("tenant_id","provider","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_journal_entries_tenant_number" ON "journal_entries" USING btree ("tenant_id","entry_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_journal_entries_source_version" ON "journal_entries" USING btree ("tenant_id","source_document_id","source_version");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_journal_entries_idempotency" ON "journal_entries" USING btree ("tenant_id","idempotency_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_journal_entries_period" ON "journal_entries" USING btree ("accounting_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_journal_lines_entry_line" ON "journal_lines" USING btree ("journal_entry_id","line_no");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_journal_lines_account" ON "journal_lines" USING btree ("tenant_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_outbound_messages_idempotency" ON "outbound_messages" USING btree ("tenant_id","idempotency_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_outbound_messages_status" ON "outbound_messages" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_outbox_events_idempotency" ON "outbox_events" USING btree ("tenant_id","idempotency_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_outbox_events_status" ON "outbox_events" USING btree ("status","available_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_outbox_events_aggregate" ON "outbox_events" USING btree ("aggregate_type","aggregate_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_payment_allocations_payment_document" ON "payment_allocations" USING btree ("payment_id","business_document_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_allocations_document" ON "payment_allocations" USING btree ("business_document_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_payments_tenant_number" ON "payments" USING btree ("tenant_id","payment_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payments_status" ON "payments" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_changes_task" ON "review_changes" USING btree ("review_task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_tasks_status" ON "review_tasks" USING btree ("tenant_id","status","priority");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_tasks_assignee" ON "review_tasks" USING btree ("assigned_to_user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_roles_tenant_code" ON "roles" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_submission_documents_submission_document" ON "submission_documents" USING btree ("submission_id","document_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_submission_documents_document" ON "submission_documents" USING btree ("document_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_submission_messages_message" ON "submission_messages" USING btree ("inbound_message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_submission_messages_submission" ON "submission_messages" USING btree ("submission_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_submissions_tenant_idempotency" ON "submissions" USING btree ("tenant_id","idempotency_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_submissions_status" ON "submissions" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_telegram_identities_tenant_user" ON "telegram_identities" USING btree ("tenant_id","telegram_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_telegram_identities_user" ON "telegram_identities" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_tenants_slug" ON "tenants" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tenants_status" ON "tenants" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ux_user_tenant_memberships_tenant_user" ON "user_tenant_memberships" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_tenant_memberships_user" ON "user_tenant_memberships" USING btree ("user_id");
