-- ============================================================
-- FIX: Admin Panel sees ALL records (not just 'published')
--
-- PROBLEM: The admin uses the anon key. The public RLS
-- policy only allows SELECT WHERE status = 'published'.
-- So the admin only shows 2 events while the DB has 6.
--
-- SOLUTION: Add additional SELECT policies for anon that
-- allow reading ALL rows. The public-facing pages still
-- filter by status = 'published' in their query.
--
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop old restrictive public policies
DROP POLICY IF EXISTS "Published past events are viewable by everyone." ON public.past_events;
DROP POLICY IF EXISTS "Published venue events are viewable by everyone." ON public.venue_events;
DROP POLICY IF EXISTS "Published history are viewable by everyone." ON public.history_timeline;
DROP POLICY IF EXISTS "Published artifacts are viewable by everyone." ON public.artifacts;

-- Re-create with full SELECT access (the app code handles filtering by status)
CREATE POLICY "Anon can read all past_events" ON public.past_events
    FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read all venue_events" ON public.venue_events
    FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read all history_timeline" ON public.history_timeline
    FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read all artifacts" ON public.artifacts
    FOR SELECT TO anon USING (true);

-- Verify: now past_events should return all rows
SELECT id, title_tr, status, event_date FROM public.past_events ORDER BY event_date DESC;
