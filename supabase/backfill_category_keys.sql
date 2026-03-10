-- ============================================================
-- Backfill all missing type_key, key_name, and archive_type values
-- for archive_categories and archive_subcategories.
-- Run this ONCE in Supabase SQL Editor.
-- ============================================================

-- === 1. ARCHIVE CATEGORIES ===
-- Backfill type_key and archive_type for Istanbul Rum categories
-- These were seeded before the type_key and archive_type columns existed.

UPDATE public.archive_categories
SET type_key = 'istanbul_rum_documents', archive_type = 'istanbul_rum'
WHERE id = 'a1000000-0000-0000-0000-000000000001'::uuid
  AND (type_key IS NULL OR archive_type IS NULL OR archive_type != 'istanbul_rum');

UPDATE public.archive_categories
SET type_key = 'istanbul_rum_objects', archive_type = 'istanbul_rum'
WHERE id = 'a1000000-0000-0000-0000-000000000002'::uuid
  AND (type_key IS NULL OR archive_type IS NULL OR archive_type != 'istanbul_rum');

-- Backfill type_key for any School categories that may have NULL type_key.
-- These are identified by their name_en values from the KI schema.
-- The type_key values match the keys used in ArchiveCollectionPage.tsx.

UPDATE public.archive_categories
SET type_key = 'documents'
WHERE name_en = 'Belgeler & Kişiler' OR name_en = 'Documents & People'
  AND type_key IS NULL;

UPDATE public.archive_categories
SET type_key = 'objects'
WHERE name_en = 'Objeler & Mekanlar' OR name_en = 'Objects & Spaces'
  AND type_key IS NULL;

-- Ensure all school categories have archive_type = 'school' if still NULL
UPDATE public.archive_categories
SET archive_type = 'school'
WHERE archive_type IS NULL;

-- === 2. ARCHIVE SUBCATEGORIES ===
-- Backfill key_name for Istanbul Rum subcategories.
-- These were seeded without key_name values.

UPDATE public.archive_subcategories
SET key_name = 'ir_belgeler'
WHERE id = 'b1000000-0000-0000-0000-000000000001'::uuid
  AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'ir_cemaat_foto'
WHERE id = 'b1000000-0000-0000-0000-000000000003'::uuid
  AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'ir_tarihi_obje'
WHERE id = 'b1000000-0000-0000-0000-000000000004'::uuid
  AND key_name IS NULL;

-- Backfill key_name for any School subcategories that may have NULL key_name.
-- These are mapped from the categorization schema in the KI:
--   books, portraits, documents (letters/official records), kayit (student records)
--   atletik, bina, egitim, obje, kisisel, ogrenci

UPDATE public.archive_subcategories
SET key_name = 'books'
WHERE name_en = 'Manuscripts' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'portraits'
WHERE name_en = 'Photographs' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'documents'
WHERE name_en = 'Letters' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'documents'
WHERE name_en = 'Official Records' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'kayit'
WHERE name_en = 'Student Records' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'atletik'
WHERE name_en = 'Athletic Trophies' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'bina'
WHERE (name_en = 'Building & Signs' OR name_en = 'Building \u0026 Signs') AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'egitim'
WHERE name_en = 'Educational Tools' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'obje'
WHERE name_en = 'Old Objects' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'kisisel'
WHERE name_en = 'Personal Items' AND key_name IS NULL;

UPDATE public.archive_subcategories
SET key_name = 'ogrenci'
WHERE name_en = 'Student Works' AND key_name IS NULL;

-- === 3. VERIFY ===
-- Run these SELECT queries to confirm all data is correct:
-- SELECT id, type_key, archive_type, name_en FROM public.archive_categories ORDER BY type_key;
-- SELECT id, key_name, category_id, name_en FROM public.archive_subcategories ORDER BY key_name;

-- Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
