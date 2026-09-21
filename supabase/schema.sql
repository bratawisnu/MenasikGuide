-- =============================================================
-- Manasik Pintar - Skema Database Supabase (Postgres)
-- Jalankan sekali di: Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- 1. Tabel Users
create table if not exists public.users (
  id                text primary key,
  name              text not null,
  email             text not null unique,
  password          text not null,             -- bcrypt hash
  role              text not null default 'jamaah'
                      check (role in ('super_admin', 'admin', 'jamaah')),
  status            text not null default 'pending'
                      check (status in ('approved', 'pending', 'suspended', 'rejected')),
  phone             text,
  kloter_or_agency  text,
  created_at        timestamptz not null default now(),
  last_login        timestamptz,
  suspend_reason    text,
  notes             text
);

create index if not exists idx_users_email  on public.users (lower(email));
create index if not exists idx_users_status on public.users (status);

-- 2. Tabel Audit Logs
create table if not exists public.user_audit_logs (
  id                text primary key,
  action            text not null,
  target_user_id    text,
  target_user_name  text,
  performed_by      text,
  details           text,
  timestamp         timestamptz not null default now()
);

create index if not exists idx_audit_timestamp on public.user_audit_logs (timestamp desc);

-- 3. Tabel Visitor Stats (baris tunggal, id = 1)
create table if not exists public.visitor_stats (
  id                  int primary key default 1,
  total_visits        int not null default 0,
  unique_visitor_ids  jsonb not null default '[]'::jsonb,
  today_date          text,
  today_visits        int not null default 0,
  last_updated        timestamptz not null default now(),
  constraint visitor_stats_singleton check (id = 1)
);

-- Baris awal statistik
insert into public.visitor_stats (id, total_visits, unique_visitor_ids, today_date, today_visits)
values (1, 0, '[]'::jsonb, to_char(now(), 'YYYY-MM-DD'), 0)
on conflict (id) do nothing;

-- =============================================================
-- Catatan RLS:
-- Semua akses dilakukan dari server Express memakai service_role key,
-- yang mem-bypass Row Level Security. Tabel tidak diekspos ke client
-- (anon key) mana pun, jadi tidak perlu policy publik. Biarkan RLS default.
-- =============================================================
