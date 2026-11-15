-- ============================================================
-- ARCHIVE PROVENANCE REMEDIATION (ISS-03) — REVERSIBLE MIGRATION
-- Sets status = 'draft' for the 3 Istanbul Rum Archive entries
-- that were seeded with AI-generated placeholder illustrations
-- (/images/artifacts/vintage-school-register.png and vintage-greek-book.png)
-- until authentic archival scans are uploaded by the Foundation.
-- ============================================================

-- Preflight dry-run query (run before applying):
-- SELECT id, title_tr, image_url, status FROM public.artifacts
-- WHERE id IN (
--   'c1000000-0000-0000-0000-000000000001',
--   'c1000000-0000-0000-0000-000000000002',
--   'c1000000-0000-0000-0000-000000000003'
-- );

UPDATE public.artifacts
SET status = 'draft'
WHERE id IN (
    'c1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003'
);

-- Rollback instruction (only after genuine archival scans are set in image_url):
-- UPDATE public.artifacts
-- SET status = 'published'
-- WHERE id IN (
--     'c1000000-0000-0000-0000-000000000001',
--     'c1000000-0000-0000-0000-000000000002',
--     'c1000000-0000-0000-0000-000000000003'
-- );
