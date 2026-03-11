-- ============================================================
-- FIX: Enable full CRUD for anon role on archive tables
--
-- PROBLEM: The admin panel uses the anon key (not authenticated).
-- archive_categories and archive_subcategories only have
-- SELECT policies for anon, so INSERT/UPDATE/DELETE fail silently.
--
-- SOLUTION: Add full CRUD policies for anon on these tables.
-- The admin panel handles its own auth via localStorage.
--
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop any old conflicting policies first
DROP POLICY IF EXISTS "TEMP_MIGRATION_archive_categories" ON public.archive_categories;
DROP POLICY IF EXISTS "TEMP_MIGRATION_archive_subcategories" ON public.archive_subcategories;
DROP POLICY IF EXISTS "Anon full access archive_categories" ON public.archive_categories;
DROP POLICY IF EXISTS "Anon full access archive_subcategories" ON public.archive_subcategories;

-- Create permanent anon CRUD policies
CREATE POLICY "Anon full access archive_categories"
    ON public.archive_categories
    FOR ALL TO anon
    USING (true) WITH CHECK (true);

CREATE POLICY "Anon full access archive_subcategories"
    ON public.archive_subcategories
    FOR ALL TO anon
    USING (true) WITH CHECK (true);

-- Verify policies exist
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('archive_categories', 'archive_subcategories')
ORDER BY tablename, policyname;
