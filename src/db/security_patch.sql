-- ================================================================
-- NITRR FC - Security Patch (RLS & Policies)
-- Description: Enables Row Level Security on all tables and storage.
-- Only authenticated users (via Supabase Auth) can modify data.
-- ================================================================

-- 1. Enable RLS on Tables
alter table players enable row level security;
alter table teams enable row level security;

-- 2. Create Policies for Players Table
-- Allow public read access (Anyone can view players)
create policy "Public Read Players"
on players for select
using (true);

-- Allow authenticated users (Admins) to Insert/Update/Delete
create policy "Admin Modify Players"
on players for all
using (auth.role() = 'authenticated');

-- 3. Create Policies for Teams Table
-- Allow public read access
create policy "Public Read Teams"
on teams for select
using (true);

-- Allow authenticated users to Modify
create policy "Admin Modify Teams"
on teams for all
using (auth.role() = 'authenticated');

-- 4. Harden Storage Policies (player-photos bucket)
-- Drop existing insecure policies if any (best effort)
drop policy if exists "Anyone can upload" on storage.objects;
drop policy if exists "Anyone can update" on storage.objects;
drop policy if exists "Public Access" on storage.objects;

-- Re-create stricter policies
-- Public Read Access
create policy "Public Read Photos"
on storage.objects for select
using ( bucket_id = 'player-photos' );

-- Authenticated Upload/Update/Delete Access
create policy "Admin Modify Photos"
on storage.objects for insert
with check ( bucket_id = 'player-photos' and auth.role() = 'authenticated' );

create policy "Admin Update Photos"
on storage.objects for update
using ( bucket_id = 'player-photos' and auth.role() = 'authenticated' );

create policy "Admin Delete Photos"
on storage.objects for delete
using ( bucket_id = 'player-photos' and auth.role() = 'authenticated' );
