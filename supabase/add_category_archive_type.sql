-- Add archive_type to archive_categories so categories can be shared/filtered per archive
ALTER TABLE public.archive_categories ADD COLUMN IF NOT EXISTS archive_type TEXT DEFAULT 'school'
  CHECK (archive_type IN ('school', 'istanbul_rum', 'both'));

-- Tag existing School categories
UPDATE public.archive_categories SET archive_type = 'school' WHERE archive_type IS NULL;

-- Tag the Istanbul Rum categories we inserted earlier
UPDATE public.archive_categories SET archive_type = 'istanbul_rum'
WHERE id IN ('a1000000-0000-0000-0000-000000000001'::uuid, 'a1000000-0000-0000-0000-000000000002'::uuid);
