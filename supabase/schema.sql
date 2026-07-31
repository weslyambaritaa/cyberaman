-- CyberAman — database schema
-- Run this once in your Supabase project's SQL Editor (or via `supabase db push`).
-- Safe to re-run: every statement is idempotent.

-- ============================================================
-- 1. profiles — one row per authenticated user
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable"
  on public.profiles for select
  using (true); -- needed so the leaderboard can show everyone's name + points

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. password_checks — only the score is stored, NEVER the password itself
-- ============================================================
create table if not exists public.password_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  score smallint not null check (score between 0 and 4),
  created_at timestamptz not null default now()
);

alter table public.password_checks enable row level security;

drop policy if exists "users manage their own password checks" on public.password_checks;
create policy "users manage their own password checks"
  on public.password_checks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 3. phishing_attempts — one row per quiz answer
-- ============================================================
create table if not exists public.phishing_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sample_id text not null,
  was_correct boolean not null,
  created_at timestamptz not null default now(),
  unique (user_id, sample_id) -- only the first answer per sample counts for scoring
);

alter table public.phishing_attempts enable row level security;

drop policy if exists "users manage their own phishing attempts" on public.phishing_attempts;
create policy "users manage their own phishing attempts"
  on public.phishing_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 4. footprint_results — one row per checklist submission
-- ============================================================
create table if not exists public.footprint_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  score smallint not null,
  total smallint not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.footprint_results enable row level security;

drop policy if exists "users manage their own footprint results" on public.footprint_results;
create policy "users manage their own footprint results"
  on public.footprint_results for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 5. learning_progress — which modules a user has completed
-- ============================================================
create table if not exists public.learning_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_slug)
);

alter table public.learning_progress enable row level security;

drop policy if exists "users manage their own learning progress" on public.learning_progress;
create policy "users manage their own learning progress"
  on public.learning_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 6. badges (static catalog) + user_badges (earned badges)
-- ============================================================
create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  points_threshold integer
);

alter table public.badges enable row level security;

drop policy if exists "badges are publicly readable" on public.badges;
create policy "badges are publicly readable"
  on public.badges for select
  using (true);

insert into public.badges (id, name, description, icon, points_threshold) values
  ('bronze', 'Pemula Aman', 'Mengumpulkan 20 poin literasi digital', 'Shield', 20),
  ('silver', 'Penjaga Data', 'Mengumpulkan 50 poin literasi digital', 'ShieldCheck', 50),
  ('gold', 'Master Keamanan Digital', 'Mengumpulkan 100 poin literasi digital', 'ShieldPlus', 100),
  ('phishing-pro', 'Anti Phishing', 'Menjawab benar semua soal simulasi phishing', 'Fish', null),
  ('footprint-checked', 'Detektif Jejak Digital', 'Menyelesaikan checklist jejak digital', 'Search', null),
  ('roleplay-resilient', 'Anti Manipulasi', 'Meraih skor 70+ pada simulasi roleplay penipu', 'ShieldAlert', null)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  points_threshold = excluded.points_threshold;

create table if not exists public.user_badges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.user_badges enable row level security;

drop policy if exists "user badges are publicly readable" on public.user_badges;
create policy "user badges are publicly readable"
  on public.user_badges for select
  using (true); -- shown on public profile / leaderboard

drop policy if exists "users cannot directly modify badges" on public.user_badges;
create policy "users cannot directly modify badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- 7. add_points — the single, atomic entry point for awarding points.
-- Called via supabase.rpc('add_points', { p_amount }) so that the
-- points update and threshold-badge award always stay in sync.
-- ============================================================
create or replace function public.add_points(p_amount integer)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_new_points integer;
  v_badge record;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  update public.profiles
  set points = points + p_amount
  where id = v_user_id
  returning points into v_new_points;

  for v_badge in
    select id from public.badges
    where points_threshold is not null and points_threshold <= v_new_points
  loop
    insert into public.user_badges (user_id, badge_id)
    values (v_user_id, v_badge.id)
    on conflict do nothing;
  end loop;
end;
$$;

-- ============================================================
-- 8. award_badge — for achievement badges not based on a point threshold
-- (e.g. finishing the phishing quiz with a perfect score).
-- ============================================================
create or replace function public.award_badge(p_badge_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  insert into public.user_badges (user_id, badge_id)
  values (v_user_id, p_badge_id)
  on conflict do nothing;
end;
$$;

-- ============================================================
-- 9. leaderboard view — top users by points
-- ============================================================
create or replace view public.leaderboard as
select id as user_id, username, points
from public.profiles
order by points desc, created_at asc
limit 50;

-- ============================================================
-- 10. metadata_checks — Metadata/EXIF checker usage log.
-- The photo itself is never uploaded anywhere (parsed entirely in-browser);
-- this only records that a check happened and whether GPS data was found,
-- so "first try" points can be awarded without ever storing user photos.
-- ============================================================
create table if not exists public.metadata_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  had_gps boolean not null,
  created_at timestamptz not null default now()
);

alter table public.metadata_checks enable row level security;

drop policy if exists "users manage their own metadata checks" on public.metadata_checks;
create policy "users manage their own metadata checks"
  on public.metadata_checks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 11. url_scans — URL Safety Scanner usage log.
-- Only the domain (not the full URL, which could contain query-string PII
-- from a real phishing link) and the resulting risk tier are stored.
-- ============================================================
create table if not exists public.url_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  domain text not null,
  risk_tier text not null check (risk_tier in ('aman', 'waspada', 'berisiko')),
  created_at timestamptz not null default now()
);

alter table public.url_scans enable row level security;

drop policy if exists "users manage their own url scans" on public.url_scans;
create policy "users manage their own url scans"
  on public.url_scans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 12. roleplay_sessions — AI Attacker Roleplay results.
-- Only the scenario and final score are stored — never the conversation
-- transcript itself (it's a live client<->Gemini exchange, not persisted).
-- ============================================================
create table if not exists public.roleplay_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  scenario text not null,
  score smallint not null check (score between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.roleplay_sessions enable row level security;

drop policy if exists "users manage their own roleplay sessions" on public.roleplay_sessions;
create policy "users manage their own roleplay sessions"
  on public.roleplay_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
