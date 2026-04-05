-- ============================================================
-- perfectMood — Mood Tracker Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Create the mood_entries table
create table if not exists public.mood_entries (
  id          uuid          primary key default gen_random_uuid(),
  date        date          not null unique,
  mood        text          not null check (mood in ('happy', 'neutral', 'sad', 'angry', 'frustrated', 'overwhelmed')),
  note        text,
  created_at  timestamptz   not null default now()
);

-- Index for fast date lookups
create index if not exists mood_entries_date_idx on public.mood_entries (date desc);

-- ── Row Level Security ───────────────────────────────────────────────────
-- This is a single-family app. We disable RLS so the anon key can read/write.
-- If you want to add proper auth later, enable RLS and add policies.
alter table public.mood_entries disable row level security;

-- Grant access to the anon role (used by the browser client)
grant select, insert, update, delete on public.mood_entries to anon;
grant usage, select on all sequences in schema public to anon;
