-- =============================================================
-- Hackathon Starter — Demo Seed Data
-- =============================================================
-- Run this once to set up the demo_items table used by the
-- home page to demonstrate the Supabase connection.
--
-- Option A: Supabase Dashboard → SQL Editor → paste & run
-- Option B: supabase db seed  (if using Supabase CLI)
--
-- Once you have your own schema, delete this file or replace
-- it with your own migration/seed files.
-- =============================================================

-- Create demo table
create table if not exists public.demo_items (
  id         bigserial    primary key,
  title      text         not null,
  created_at timestamptz  not null default now()
);

-- Enable Row Level Security (always enable RLS on every table)
alter table public.demo_items enable row level security;

-- Allow anyone to read demo items (public read-only)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'demo_items'
      and policyname = 'Anyone can read demo items'
  ) then
    create policy "Anyone can read demo items"
      on public.demo_items
      for select
      using (true);
  end if;
end $$;

-- Seed data — replace with your own content
insert into public.demo_items (title)
values
  ('Welcome to your hackathon starter!'),
  ('Connected to Supabase ✓'),
  ('Replace this table with your own schema.')
on conflict do nothing;
