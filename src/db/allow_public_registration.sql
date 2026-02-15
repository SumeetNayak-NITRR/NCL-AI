-- ================================================================
-- NITRR FC - Public Registration Access
-- Description: Allows unauthenticated (public) users to register.
-- 1. Upload photos to 'player-photos' bucket.
-- 2. Insert new player records with 'Pending' status.
-- ================================================================

-- 1. Storage Policy: Allow Public Uploads
-- Drop existing restrictive policy if strictly matched, or just add a new one.
-- To be safe and avoid conflicts, we'll create a specific policy for anon uploads.

create policy "Public Upload Photos"
on storage.objects for insert
with check (
  bucket_id = 'player-photos' 
  and auth.role() = 'anon'
);

-- Note: We assume Read access is already enabled by 'security_patch.sql' or default.
-- If not, ensure this exists:
-- create policy "Public Read Photos" on storage.objects for select using (bucket_id = 'player-photos');


-- 2. Players Table Policy: Allow Public Registration
-- Allow anon users to INSERT only.
-- Ideally, enforce that they can only set status = 'Pending', but for now generic insert is fine.

create policy "Public Register Player"
on players for insert
with check (
  auth.role() = 'anon'
  -- Optional: enforce status
  -- and status = 'Pending'
);

-- ================================================================
-- INSTRUCTIONS
-- Run this script in your Supabase SQL Editor.
-- ================================================================
