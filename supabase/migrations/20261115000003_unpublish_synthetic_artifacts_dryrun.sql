-- ============================================================
-- ARCHIVE PROVENANCE PREFLIGHT DRY-RUN (ISS-03) — STRICTLY READ-ONLY
-- ============================================================
-- Purpose:
--   Read-only inspection query that lists the 3 Istanbul Rum Archive rows
--   seeded with synthetic placeholder illustrations (/images/artifacts/vintage-*.png).
--   Contains ZERO data mutations (no UPDATE / INSERT / DELETE).
--
--   The actual write mutation (`UPDATE public.artifacts SET status = 'draft' ...`)
--   is isolated outside `supabase/migrations/` at:
--   `supabase/manual_approvals/unpublish_synthetic_artifacts_apply.sql`
--   and must ONLY be executed after explicit owner approval (OPS-02).
-- ============================================================

SELECT
    id,
    title_tr,
    title_en,
    image_url,
    status
FROM public.artifacts
WHERE id IN (
    'c1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003'
)
ORDER BY id;
