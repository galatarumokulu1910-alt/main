-- Run this to fix the missing columns from the initial schema deployment

ALTER TABLE public.archive_categories ADD COLUMN type_key VARCHAR(50) UNIQUE;
ALTER TABLE public.archive_categories ADD COLUMN order_index INTEGER DEFAULT 0;

ALTER TABLE public.archive_subcategories ADD COLUMN key_name VARCHAR(50) UNIQUE;
ALTER TABLE public.archive_subcategories ADD COLUMN order_index INTEGER DEFAULT 0;

-- Refresh the PostgREST schema cache so the API immediately recognizes the new columns
NOTIFY pgrst, 'reload schema';
