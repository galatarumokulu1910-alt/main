-- ============================================================
-- GALATA CMS — DELETE ALL SEEDED/MOCKED PAST EVENTS
-- Run this in Supabase Dashboard → SQL Editor
--
-- This deletes the 6 mock events that were inserted by
-- seed_past_events.sql (identified by their fake Google image URLs).
-- Your own manually-inserted events will NOT be affected.
-- ============================================================

DELETE FROM public.past_events
WHERE cover_image_url LIKE 'https://lh3.googleusercontent.com/aida-public/%';

-- Verify: should only show your real events now
SELECT id, title_tr, event_date, status
FROM public.past_events
ORDER BY event_date DESC;
