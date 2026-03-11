-- ============================================================
-- DROP admin_users table (SECURITY REMEDIATION)
-- ============================================================
-- The admin_users table stored plaintext passwords and had a
-- public SELECT RLS policy. Admin authentication has been
-- migrated to Supabase Auth (signInWithPassword).
--
-- Run this AFTER confirming the admin user has been created
-- in Supabase Auth (Dashboard → Authentication → Users).
-- ============================================================

-- 1. Remove the overly permissive RLS policy
DROP POLICY IF EXISTS "Allow public read access to admin_users" ON public.admin_users;

-- 2. Drop the table entirely
DROP TABLE IF EXISTS public.admin_users;

-- 3. Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
