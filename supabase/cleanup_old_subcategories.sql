-- Cleanup: Remove old 'Patrikane Belgeleri' and 'Cemaat Haritaları' subcategories
-- and consolidate into a single 'Belgeler' (Documents) subcategory.
-- Run this in Supabase SQL Editor.

-- 1. Update the existing 'Patrikane Belgeleri' subcategory to become 'Belgeler'
UPDATE public.archive_subcategories
SET name_tr = 'Belgeler',
    name_en = 'Documents',
    name_el = 'Έγγραφα'
WHERE id = 'b1000000-0000-0000-0000-000000000001'::uuid;

-- 2. Move any artifacts from 'Cemaat Haritaları' to the new 'Belgeler' subcategory
UPDATE public.artifacts
SET sub_category_id = 'b1000000-0000-0000-0000-000000000001'::uuid
WHERE sub_category_id = 'b1000000-0000-0000-0000-000000000002'::uuid;

-- 3. Delete the old 'Cemaat Haritaları' subcategory
DELETE FROM public.archive_subcategories
WHERE id = 'b1000000-0000-0000-0000-000000000002'::uuid;
