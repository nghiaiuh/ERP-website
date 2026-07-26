# Supabase Security Runbook

`ERP_postgres.sql` is the secure bootstrap for a **new Supabase project**. It
uses Supabase Auth as the only credential store and creates `public.users` as
an application profile keyed by `auth.users.id`.

## What Changes

- Passwords, password hashes, reset tokens and MFA recovery data live only in
  Supabase-managed `auth.users`.
- `public.users` contains only `id`, display metadata and timestamps.
- Every ERP record is scoped by `tenant_id`; identifiers that used to be global
  are unique inside a tenant.
- Row Level Security denies anonymous access and grants authenticated users
  access only to active tenant memberships.
- Admin and membership changes must go through server-side use cases using the
  service-role key. Never place `SUPABASE_SERVICE_ROLE_KEY` in Nuxt public
  runtime config or browser code.

## New Supabase Project

1. In Supabase Dashboard, configure Auth email confirmation and the allowed
   application redirect URLs before opening registration.
2. Open SQL Editor and run `server/db/ERP_postgres.sql` once.
3. Create the first account through the ERP registration endpoint or Supabase
   Auth. The `on_auth_user_created` trigger creates its safe profile row.
4. In a protected server-side admin operation, create a tenant and an active
   `user_tenant_memberships` row with role `owner` for that Auth user UUID.
5. Set `DB_PROVIDER=supabase`, `SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` locally.
   The service-role key is server-only.

## Existing Database Migration

Do **not** run the fresh bootstrap over the legacy schema: the old
`public.users.id` is an integer and contains a password hash incompatible with
Supabase Auth. Use this safe sequence instead.

1. Back up roles, schema and data before changing the old project.
2. Create the new Supabase project and run `ERP_postgres.sql`.
3. Create or invite each old user through Supabase Auth. Require a password
   reset; bcrypt hashes from the legacy table must not be copied into a public
   table or handled by ERP code.
4. Build an explicit old integer user ID to new Auth UUID mapping, then migrate
   business data per tenant. Verify row counts and financial totals.
5. Enable the new ERP deployment only after tenant membership, RLS and login
   tests pass. Keep the old database read-only until reconciliation is signed
   off.

## Post-Deployment Checks

Run these in Supabase SQL Editor after bootstrap:

```sql
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'users'
order by ordinal_position;

select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('users', 'tenants', 'doi_tac', 'hoa_don_ban', 'bao_cao_thue');
```

The `users` result must not contain `password` or `email`; the RLS result must
be `true` for every listed table. Test a request with the anon key and confirm
it cannot select ERP data.
