-- ============================================================
-- ARCHIVE PROVENANCE REMEDIATION (ISS-03) — APPROVAL-GATED WRITE SCRIPT (OPS-02)
-- ============================================================
-- WARNING:
--   Execute ONLY after explicit owner approval of OPS-02 and after running
--   the read-only preflight inspection in:
--   `supabase/migrations/20261115000003_unpublish_synthetic_artifacts_dryrun.sql`
--
-- Effect:
--   Sets `status = 'draft'` on the 3 Istanbul Rum Archive records seeded with
--   synthetic placeholder illustrations (`c1000000-0000-0000-0000-000000000001..003`)
--   until authentic archival scans are uploaded by the Foundation.
-- ============================================================

UPDATE public.artifacts
SET status = 'draft'
WHERE id IN (
    'c1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003'
)
AND status <> 'draft';

-- ============================================================
-- ROLLBACK SQL (run ONLY if genuine archival scans have been uploaded):
-- ============================================================
-- UPDATE public.artifacts
-- SET status = 'published'
-- WHERE id IN (
--     'c1000000-0000-0000-0000-000000000001',
--     'c1000000-0000-0000-0000-000000000002',
--     'c1000000-0000-0000-0000-000000000003'
-- );
