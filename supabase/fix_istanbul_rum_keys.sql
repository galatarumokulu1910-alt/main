-- Fix Istanbul Rum categories: set missing type_key
UPDATE public.archive_categories SET type_key = 'istanbul_rum_documents'
WHERE id = 'a1000000-0000-0000-0000-000000000001'::uuid;

UPDATE public.archive_categories SET type_key = 'istanbul_rum_objects'
WHERE id = 'a1000000-0000-0000-0000-000000000002'::uuid;

-- Fix Istanbul Rum subcategories: set missing key_name
UPDATE public.archive_subcategories SET key_name = 'ir_belgeler'
WHERE id = 'b1000000-0000-0000-0000-000000000001'::uuid;

UPDATE public.archive_subcategories SET key_name = 'ir_cemaat_foto'
WHERE id = 'b1000000-0000-0000-0000-000000000003'::uuid;

UPDATE public.archive_subcategories SET key_name = 'ir_tarihi_obje'
WHERE id = 'b1000000-0000-0000-0000-000000000004'::uuid;

-- Verify
SELECT id, type_key, archive_type, name_en FROM public.archive_categories ORDER BY type_key;
SELECT id, key_name, category_id, name_en FROM public.archive_subcategories ORDER BY key_name;

NOTIFY pgrst, 'reload schema';
