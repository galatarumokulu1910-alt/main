-- ============================================================
-- FIX: Allow deleting categories that have artifacts
--
-- PROBLEM: artifacts.category_id FK blocks category deletion.
-- SOLUTION: Change FK to SET NULL — artifacts stay but lose
--           their category link (can be reassigned later).
--
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- Fix artifacts.category_id FK
ALTER TABLE public.artifacts
    DROP CONSTRAINT IF EXISTS artifacts_category_id_fkey;

ALTER TABLE public.artifacts
    ADD CONSTRAINT artifacts_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES public.archive_categories(id)
    ON DELETE SET NULL;

-- Fix artifacts.sub_category_id FK
ALTER TABLE public.artifacts
    DROP CONSTRAINT IF EXISTS artifacts_sub_category_id_fkey;

ALTER TABLE public.artifacts
    ADD CONSTRAINT artifacts_sub_category_id_fkey
    FOREIGN KEY (sub_category_id)
    REFERENCES public.archive_subcategories(id)
    ON DELETE SET NULL;

-- Verify
SELECT conname, confdeltype
FROM pg_constraint
WHERE conrelid = 'public.artifacts'::regclass
  AND contype = 'f';
