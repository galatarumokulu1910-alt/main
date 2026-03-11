-- ============================================
-- Re-categorize past_events into 9 clean groups
-- ============================================

-- 1. Okuma (Reading) — Okuma, Kitap tanıtımı, Kitap tanıtımı + Konuşma
UPDATE past_events SET type_tr = 'Okuma', type_en = 'Reading', type_el = 'Ανάγνωση', sub_tag = NULL
WHERE type_tr IN ('Okuma', 'Kitap tanıtımı', 'Kitap tanıtımı, Konuşma')
   OR sub_tag IN ('Okuma', 'Kitap tanıtımı', 'Kitap tanıtımı, Konuşma');

-- 2. Konuşma (Talk) — Konuşma, Söyleşi, Konuşma + Söyleşi
UPDATE past_events SET type_tr = 'Konuşma', type_en = 'Talk', type_el = 'Ομιλία', sub_tag = NULL
WHERE type_tr IN ('Konuşma', 'Söyleşi', 'Konuşma, Söyleşi')
   OR sub_tag IN ('Konuşma', 'Söyleşi', 'Konuşma, Söyleşi');

-- 3. Sergi (Exhibition)
UPDATE past_events SET type_tr = 'Sergi', type_en = 'Exhibition', type_el = 'Έκθεση', sub_tag = NULL
WHERE type_tr = 'Sergi' OR sub_tag = 'Sergi';

-- 4. Buluşma (Gathering)
UPDATE past_events SET type_tr = 'Buluşma', type_en = 'Gathering', type_el = 'Συνάντηση', sub_tag = NULL
WHERE type_tr = 'Buluşma' OR sub_tag = 'Buluşma';

-- 5. Konser (Concert)
UPDATE past_events SET type_tr = 'Konser', type_en = 'Concert', type_el = 'Συναυλία', sub_tag = NULL
WHERE type_tr = 'Konser' OR sub_tag = 'Konser';

-- 6. Konferans (Conference) — includes misspelling "Konfrens"
UPDATE past_events SET type_tr = 'Konferans', type_en = 'Conference', type_el = 'Συνέδριο', sub_tag = NULL
WHERE type_tr IN ('Konferans', 'Konfrens')
   OR sub_tag IN ('Konferans', 'Konfrens');

-- 7. Film Gösterimi (Screening)
UPDATE past_events SET type_tr = 'Film Gösterimi', type_en = 'Screening', type_el = 'Προβολή', sub_tag = NULL
WHERE type_tr IN ('Film gösterimi', 'Film gösterimi, Konuşma')
   OR sub_tag IN ('Film gösterimi', 'Film gösterimi, Konuşma');

-- 8. Performans (Performance) — includes Tiyatro
UPDATE past_events SET type_tr = 'Performans', type_en = 'Performance', type_el = 'Παράσταση', sub_tag = NULL
WHERE type_tr IN ('Performans', 'Tiyatro')
   OR sub_tag IN ('Performans', 'Tiyatro');

-- 9. Etkinlik (Event) — catch-all: Etkinlik, Event, Event / Yemek, Gala, Atölye
UPDATE past_events SET type_tr = 'Etkinlik', type_en = 'Event', type_el = 'Εκδήλωση', sub_tag = NULL
WHERE type_tr IN ('Etkinlik', 'Event', 'Event / Yemek', 'Gala', 'Atölye')
   OR sub_tag IN ('Etkinlik', 'Event', 'Event / Yemek', 'Gala', 'Atölye');

-- 10. Catch any remaining records with sub_tag set — clear sub_tag
UPDATE past_events SET sub_tag = NULL WHERE sub_tag IS NOT NULL;

-- Verify results
SELECT type_tr, type_en, type_el, COUNT(*) as count
FROM past_events
GROUP BY type_tr, type_en, type_el
ORDER BY count DESC;
