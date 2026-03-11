-- Add "Konferans" event type and re-categorize past events
-- Run this in the Supabase SQL Editor

-- 1. Insert the new "Konferans" event type
INSERT INTO event_types (key, label_tr, label_en, label_el, order_index) VALUES
('konferans', 'Konferans', 'Conference', 'Συνέδριο', 6)
ON CONFLICT (key) DO NOTHING;

-- 2. Re-categorize past_events that were originally "Konferans"
--    In the previous migration, all "Konferans" events were mapped to "Kurumsal Seminer".
--    We identify them by title patterns containing conference-related keywords.
UPDATE past_events
SET type_tr = 'Konferans',
    type_en = 'Conference',
    type_el = 'Συνέδριο'
WHERE type_tr = 'Kurumsal Seminer'
  AND (
    lower(title_tr) LIKE '%konferans%'
    OR lower(title_tr) LIKE '%kongresi%'
    OR lower(title_tr) LIKE '%sempozyum%'
    OR lower(title_tr) LIKE '%panel%'
    OR lower(title_tr) LIKE '%toplantı%'
    OR lower(title_tr) LIKE '%sunum%'
    OR lower(title_en) LIKE '%conference%'
    OR lower(title_en) LIKE '%congress%'
    OR lower(title_en) LIKE '%symposium%'
  );

-- 3. Verify the new distribution
SELECT type_tr, COUNT(*) as event_count
FROM past_events
GROUP BY type_tr
ORDER BY event_count DESC;
