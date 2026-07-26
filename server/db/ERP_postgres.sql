-- ERP secure Supabase bootstrap (fresh database only)
--
-- Authentication source of truth: auth.users (managed by Supabase Auth).
-- public.users is a non-secret application profile. It never stores email,
-- passwords, password hashes, refresh tokens, or MFA recovery material.
--
-- Do not run this against the legacy database in place. Follow the migration
-- plan in README.md to create Supabase Auth accounts and backfill data safely.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Identity, tenant isolation and authorization
-- ---------------------------------------------------------------------------

create table if not exists public.tenants (
  id serial primary key,
  name varchar(255) not null,
  slug varchar(100) not null unique,
  status varchar(30) not null default 'active'
    check (status in ('active', 'suspended', 'archived')),
  timezone varchar(100) not null default 'Asia/Ho_Chi_Minh',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(100),
  display_name varchar(255),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_username_format check (username is null or username ~ '^[A-Za-z0-9_.-]{3,100}$')
);

create unique index if not exists ux_users_username_ci
  on public.users (lower(username)) where username is not null;

create table if not exists public.user_tenant_memberships (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role varchar(30) not null default 'member'
    check (role in ('owner', 'admin', 'accountant', 'reviewer', 'member', 'viewer')),
  status varchar(30) not null default 'active'
    check (status in ('active', 'invited', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists idx_memberships_user_active
  on public.user_tenant_memberships (user_id, status);

-- This trigger copies only safe display metadata into the ERP profile.
-- Supabase Auth owns all credential material and its auth.users schema.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username, display_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'username'), '')
  )
  on conflict (id) do update
  set username = coalesce(excluded.username, public.users.username),
      display_name = coalesce(excluded.display_name, public.users.display_name),
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Security-definer helper avoids RLS recursion when a policy checks membership.
create or replace function public.is_tenant_member(target_tenant_id integer)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_tenant_memberships membership
    where membership.tenant_id = target_tenant_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
  );
$$;

create or replace function public.can_manage_tenant(target_tenant_id integer)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_tenant_memberships membership
    where membership.tenant_id = target_tenant_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and membership.role in ('owner', 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- Legacy ERP domain, now tenant scoped and with tenant-safe foreign keys.
-- ---------------------------------------------------------------------------

create table if not exists public.doanh_nghiep (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ten_doanh_nghiep varchar(255) not null,
  ma_so_thue varchar(50),
  dia_chi text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique nulls not distinct (tenant_id, ma_so_thue)
);

create table if not exists public.doi_tac (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ma_doi_tac varchar(50) not null,
  ten_doi_tac varchar(255) not null,
  loai_doi_tac varchar(30) not null check (loai_doi_tac in ('khach_hang', 'nha_cung_cap', 'ca_hai')),
  ma_so_thue varchar(50),
  dia_chi text,
  dien_thoai varchar(20),
  email varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, ma_doi_tac)
);

create table if not exists public.hop_dong (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ma_hop_dong varchar(100),
  doi_tac_id integer,
  tong_gia_tri numeric(18, 2) check (tong_gia_tri >= 0),
  ngay_bat_dau date,
  ngay_ket_thuc date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique nulls not distinct (tenant_id, ma_hop_dong),
  foreign key (tenant_id, doi_tac_id) references public.doi_tac(tenant_id, id),
  check (ngay_ket_thuc is null or ngay_bat_dau is null or ngay_ket_thuc >= ngay_bat_dau)
);

create table if not exists public.hoa_don_ban (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ma_hoa_don varchar(100) not null,
  doi_tac_id integer not null,
  hop_dong_id integer,
  ngay_hoa_don date not null,
  tong_tien numeric(18, 2) not null default 0 check (tong_tien >= 0),
  trang_thai varchar(30) not null default 'chua_thu'
    check (trang_thai in ('chua_thu', 'da_thu', 'mot_phan', 'huy')),
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, ma_hoa_don),
  foreign key (tenant_id, doi_tac_id) references public.doi_tac(tenant_id, id),
  foreign key (tenant_id, hop_dong_id) references public.hop_dong(tenant_id, id)
);

create table if not exists public.hoa_don_mua (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ma_hoa_don varchar(100) not null,
  doi_tac_id integer not null,
  ngay_hoa_don date not null,
  tong_tien numeric(18, 2) not null default 0 check (tong_tien >= 0),
  trang_thai varchar(30) not null default 'chua_tra'
    check (trang_thai in ('chua_tra', 'da_tra', 'mot_phan', 'huy')),
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, ma_hoa_don),
  foreign key (tenant_id, doi_tac_id) references public.doi_tac(tenant_id, id)
);

create table if not exists public.hoa_don_ban_chi_tiet (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  hoa_don_ban_id integer not null,
  ten_hang_hoa varchar(255) not null,
  mo_ta text,
  so_luong numeric(18, 3) not null check (so_luong > 0),
  don_vi varchar(50),
  don_gia numeric(18, 2) not null check (don_gia >= 0),
  ty_le_thue numeric(5, 2) not null default 10 check (ty_le_thue between 0 and 100),
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, hoa_don_ban_id) references public.hoa_don_ban(tenant_id, id) on delete cascade
);

create table if not exists public.hoa_don_mua_chi_tiet (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  hoa_don_mua_id integer not null,
  ten_hang_hoa varchar(255) not null,
  mo_ta text,
  so_luong numeric(18, 3) not null check (so_luong > 0),
  don_vi varchar(50),
  don_gia numeric(18, 2) not null check (don_gia >= 0),
  ty_le_thue numeric(5, 2) not null default 10 check (ty_le_thue between 0 and 100),
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, hoa_don_mua_id) references public.hoa_don_mua(tenant_id, id) on delete cascade
);

create table if not exists public.so_doanh_thu (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  doanh_nghiep_id integer not null,
  mau_so varchar(100) not null default 'S1a-HKD TT 152/2025/TT-BTC',
  ngay_bat_dau date not null,
  ngay_ket_thuc date not null,
  tong_tien numeric(18, 2) not null default 0 check (tong_tien >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, doanh_nghiep_id) references public.doanh_nghiep(tenant_id, id),
  check (ngay_ket_thuc >= ngay_bat_dau)
);

create table if not exists public.so_chi_phi (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  doanh_nghiep_id integer not null,
  mau_so varchar(100) not null default 'S2c-HKD TT 152/2025/TT-BTC',
  ngay_bat_dau date not null,
  ngay_ket_thuc date not null,
  tong_tien numeric(18, 2) not null default 0 check (tong_tien >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, doanh_nghiep_id) references public.doanh_nghiep(tenant_id, id),
  check (ngay_ket_thuc >= ngay_bat_dau)
);

create table if not exists public.don_doanh_thu (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  revenue_book_id integer not null,
  hoa_don_ban_id integer,
  so_chung_tu varchar(100) not null,
  ngay_ghi_nhan date not null,
  mo_ta text,
  phan_loai varchar(100),
  so_tien numeric(18, 2) not null default 0 check (so_tien >= 0),
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, so_chung_tu),
  foreign key (tenant_id, revenue_book_id) references public.so_doanh_thu(tenant_id, id) on delete cascade,
  foreign key (tenant_id, hoa_don_ban_id) references public.hoa_don_ban(tenant_id, id) on delete set null
);

create table if not exists public.don_chi_phi (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  expense_book_id integer not null,
  hoa_don_mua_id integer,
  so_chung_tu varchar(100),
  ngay_ghi_nhan date not null,
  mo_ta text,
  phan_loai varchar(100),
  so_tien numeric(18, 2) not null default 0 check (so_tien >= 0),
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique nulls not distinct (tenant_id, so_chung_tu),
  foreign key (tenant_id, expense_book_id) references public.so_chi_phi(tenant_id, id) on delete cascade,
  foreign key (tenant_id, hoa_don_mua_id) references public.hoa_don_mua(tenant_id, id) on delete set null
);

create table if not exists public.cong_no (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  doi_tac_id integer not null,
  loai_cong_no varchar(30) not null check (loai_cong_no in ('phai_thu', 'phai_tra')),
  so_tien numeric(18, 2) not null check (so_tien > 0),
  han_thanh_toan date,
  hoa_don_ban_id integer,
  hoa_don_mua_id integer,
  trang_thai varchar(30) not null default 'chua_thanh_toan'
    check (trang_thai in ('chua_thanh_toan', 'mot_phan', 'da_thanh_toan')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, doi_tac_id) references public.doi_tac(tenant_id, id),
  foreign key (tenant_id, hoa_don_ban_id) references public.hoa_don_ban(tenant_id, id),
  foreign key (tenant_id, hoa_don_mua_id) references public.hoa_don_mua(tenant_id, id),
  check ((hoa_don_ban_id is not null) <> (hoa_don_mua_id is not null))
);

create table if not exists public.giao_dich_thanh_toan (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ma_giao_dich varchar(100) not null,
  loai_giao_dich varchar(30) not null check (loai_giao_dich in ('thu', 'chi')),
  doi_tac_id integer,
  hoa_don_ban_id integer,
  hoa_don_mua_id integer,
  cong_no_id integer,
  so_tien numeric(18, 2) not null check (so_tien > 0),
  phuong_thuc varchar(50) not null default 'tien_mat'
    check (phuong_thuc in ('tien_mat', 'chuyen_khoan', 'the', 'khac')),
  ngay_giao_dich date not null,
  ten_ngan_hang varchar(255),
  so_tai_khoan varchar(50),
  ma_tham_chieu varchar(255),
  ghi_chu text,
  nguoi_tao_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, ma_giao_dich),
  foreign key (tenant_id, doi_tac_id) references public.doi_tac(tenant_id, id),
  foreign key (tenant_id, hoa_don_ban_id) references public.hoa_don_ban(tenant_id, id),
  foreign key (tenant_id, hoa_don_mua_id) references public.hoa_don_mua(tenant_id, id),
  foreign key (tenant_id, cong_no_id) references public.cong_no(tenant_id, id)
);

create table if not exists public.bao_cao_thue (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  ma_bao_cao varchar(100) not null,
  loai_thue varchar(50) not null check (loai_thue in ('VAT', 'TNCN', 'TNDN', 'khac')),
  ky_bao_cao varchar(20) not null check (ky_bao_cao in ('thang', 'quy', 'nam')),
  ngay_bat_dau date not null,
  ngay_ket_thuc date not null,
  tong_doanh_thu numeric(18, 2) not null default 0,
  tong_chi_phi numeric(18, 2) not null default 0,
  so_tien_chiu_thue numeric(18, 2) not null default 0,
  ty_le_thue numeric(5, 2) not null default 0 check (ty_le_thue between 0 and 100),
  so_tien_thue numeric(18, 2) not null default 0,
  so_tien_da_tra numeric(18, 2) not null default 0 check (so_tien_da_tra >= 0),
  trang_thai varchar(30) not null default 'ban_nhap'
    check (trang_thai in ('ban_nhap', 'da_nop', 'da_tra', 'mot_phan')),
  ngay_nop timestamptz,
  han_nop date,
  ngay_tra timestamptz,
  ghi_chu text,
  metadata jsonb not null default '{}'::jsonb,
  nguoi_tao_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, ma_bao_cao),
  check (ngay_ket_thuc >= ngay_bat_dau),
  check (so_tien_da_tra <= so_tien_thue)
);

create table if not exists public.chi_tiet_thue (
  id serial primary key,
  tenant_id integer not null references public.tenants(id) on delete cascade,
  bao_cao_thue_id integer not null,
  danh_muc varchar(100) not null,
  mo_ta text,
  so_tien_tinh_thue numeric(18, 2) not null check (so_tien_tinh_thue >= 0),
  ty_le_thue numeric(5, 2) not null check (ty_le_thue between 0 and 100),
  tien_thue numeric(18, 2) not null check (tien_thue >= 0),
  hoa_don_ban_id integer,
  hoa_don_mua_id integer,
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, bao_cao_thue_id) references public.bao_cao_thue(tenant_id, id) on delete cascade,
  foreign key (tenant_id, hoa_don_ban_id) references public.hoa_don_ban(tenant_id, id),
  foreign key (tenant_id, hoa_don_mua_id) references public.hoa_don_mua(tenant_id, id),
  check (hoa_don_ban_id is null or hoa_don_mua_id is null)
);

create table if not exists public.audit_events (
  id bigserial primary key,
  tenant_id integer not null references public.tenants(id) on delete restrict,
  actor_user_id uuid references public.users(id) on delete set null,
  action varchar(100) not null,
  entity_type varchar(100) not null,
  entity_id varchar(100),
  request_id varchar(128),
  correlation_id varchar(128),
  before jsonb,
  after jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Integrity: totals are derived from detail rows, never client supplied.
-- ---------------------------------------------------------------------------

create or replace function public.refresh_invoice_total()
returns trigger language plpgsql set search_path = public as $$
declare
  invoice_tenant_id integer := coalesce(new.tenant_id, old.tenant_id);
  sale_invoice_id integer := coalesce(new.hoa_don_ban_id, old.hoa_don_ban_id);
  purchase_invoice_id integer := coalesce(new.hoa_don_mua_id, old.hoa_don_mua_id);
begin
  if tg_table_name = 'hoa_don_ban_chi_tiet' then
    update public.hoa_don_ban invoice
    set tong_tien = coalesce((
      select sum(line.so_luong * line.don_gia * (1 + line.ty_le_thue / 100))
      from public.hoa_don_ban_chi_tiet line
      where line.tenant_id = invoice_tenant_id and line.hoa_don_ban_id = sale_invoice_id
    ), 0)
    where invoice.tenant_id = invoice_tenant_id and invoice.id = sale_invoice_id;
  else
    update public.hoa_don_mua invoice
    set tong_tien = coalesce((
      select sum(line.so_luong * line.don_gia * (1 + line.ty_le_thue / 100))
      from public.hoa_don_mua_chi_tiet line
      where line.tenant_id = invoice_tenant_id and line.hoa_don_mua_id = purchase_invoice_id
    ), 0)
    where invoice.tenant_id = invoice_tenant_id and invoice.id = purchase_invoice_id;
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trigger_refresh_sale_invoice_total on public.hoa_don_ban_chi_tiet;
create trigger trigger_refresh_sale_invoice_total
after insert or update or delete on public.hoa_don_ban_chi_tiet
for each row execute procedure public.refresh_invoice_total();

drop trigger if exists trigger_refresh_purchase_invoice_total on public.hoa_don_mua_chi_tiet;
create trigger trigger_refresh_purchase_invoice_total
after insert or update or delete on public.hoa_don_mua_chi_tiet
for each row execute procedure public.refresh_invoice_total();

-- ---------------------------------------------------------------------------
-- Indexes, RLS and grants
-- ---------------------------------------------------------------------------

create index if not exists idx_doi_tac_tenant_name on public.doi_tac (tenant_id, ten_doi_tac);
create index if not exists idx_hoa_don_ban_tenant_date on public.hoa_don_ban (tenant_id, ngay_hoa_don desc);
create index if not exists idx_hoa_don_mua_tenant_date on public.hoa_don_mua (tenant_id, ngay_hoa_don desc);
create index if not exists idx_cong_no_tenant_status on public.cong_no (tenant_id, trang_thai);
create index if not exists idx_giao_dich_tenant_date on public.giao_dich_thanh_toan (tenant_id, ngay_giao_dich desc);
create index if not exists idx_bao_cao_thue_tenant_period on public.bao_cao_thue (tenant_id, ngay_bat_dau, ngay_ket_thuc);
create index if not exists idx_audit_events_tenant_entity on public.audit_events (tenant_id, entity_type, entity_id, created_at desc);

-- No browser request has access until it is authenticated and has a membership.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
revoke all on function public.is_tenant_member(integer) from public;
revoke all on function public.can_manage_tenant(integer) from public;
grant execute on function public.is_tenant_member(integer), public.can_manage_tenant(integer) to authenticated;

alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.user_tenant_memberships enable row level security;
alter table public.doanh_nghiep enable row level security;
alter table public.doi_tac enable row level security;
alter table public.hop_dong enable row level security;
alter table public.hoa_don_ban enable row level security;
alter table public.hoa_don_mua enable row level security;
alter table public.hoa_don_ban_chi_tiet enable row level security;
alter table public.hoa_don_mua_chi_tiet enable row level security;
alter table public.so_doanh_thu enable row level security;
alter table public.so_chi_phi enable row level security;
alter table public.don_doanh_thu enable row level security;
alter table public.don_chi_phi enable row level security;
alter table public.cong_no enable row level security;
alter table public.giao_dich_thanh_toan enable row level security;
alter table public.bao_cao_thue enable row level security;
alter table public.chi_tiet_thue enable row level security;
alter table public.audit_events enable row level security;

create policy tenant_select on public.tenants for select to authenticated using (public.is_tenant_member(id));
create policy profile_select_own on public.users for select to authenticated using (id = auth.uid());
create policy profile_update_own on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy membership_select_own on public.user_tenant_memberships for select to authenticated using (user_id = auth.uid());

-- Application tables share the same tenant gate. Changes to membership, roles,
-- audit events and tenant settings are made by audited server-side use cases
-- using SUPABASE_SERVICE_ROLE_KEY, never by a browser client.
create policy doanh_nghiep_tenant_access on public.doanh_nghiep for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy doi_tac_tenant_access on public.doi_tac for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy hop_dong_tenant_access on public.hop_dong for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy hoa_don_ban_tenant_access on public.hoa_don_ban for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy hoa_don_mua_tenant_access on public.hoa_don_mua for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy hoa_don_ban_chi_tiet_tenant_access on public.hoa_don_ban_chi_tiet for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy hoa_don_mua_chi_tiet_tenant_access on public.hoa_don_mua_chi_tiet for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy so_doanh_thu_tenant_access on public.so_doanh_thu for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy so_chi_phi_tenant_access on public.so_chi_phi for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy don_doanh_thu_tenant_access on public.don_doanh_thu for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy don_chi_phi_tenant_access on public.don_chi_phi for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy cong_no_tenant_access on public.cong_no for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy giao_dich_tenant_access on public.giao_dich_thanh_toan for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy bao_cao_thue_tenant_access on public.bao_cao_thue for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy chi_tiet_thue_tenant_access on public.chi_tiet_thue for all to authenticated using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));
create policy audit_events_tenant_read on public.audit_events for select to authenticated using (public.can_manage_tenant(tenant_id));

-- Views inherit RLS from the caller on PostgreSQL 15+ / current Supabase.
create or replace view public.v_hoa_don_ban_chi_tiet with (security_invoker = true) as
select line.*, line.so_luong * line.don_gia as thanh_tien,
       line.so_luong * line.don_gia * line.ty_le_thue / 100 as tien_thue,
       line.so_luong * line.don_gia * (1 + line.ty_le_thue / 100) as tong_tien
from public.hoa_don_ban_chi_tiet line;

create or replace view public.v_cong_no_full with (security_invoker = true) as
select debt.*,
       coalesce((select sum(payment.so_tien) from public.giao_dich_thanh_toan payment
                 where payment.tenant_id = debt.tenant_id and payment.cong_no_id = debt.id), 0) as so_tien_da_tra,
       debt.so_tien - coalesce((select sum(payment.so_tien) from public.giao_dich_thanh_toan payment
                                where payment.tenant_id = debt.tenant_id and payment.cong_no_id = debt.id), 0) as so_tien_con_lai
from public.cong_no debt;

drop trigger if exists trigger_tenants_updated_at on public.tenants;
create trigger trigger_tenants_updated_at before update on public.tenants for each row execute procedure public.set_updated_at();
drop trigger if exists trigger_users_updated_at on public.users;
create trigger trigger_users_updated_at before update on public.users for each row execute procedure public.set_updated_at();

commit;
