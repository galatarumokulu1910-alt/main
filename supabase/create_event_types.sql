-- ============================================================
-- Create event_types table + seed 5 canonical types
-- + Migrate existing past_events to new type labels
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1) Create the event_types table
CREATE TABLE IF NOT EXISTS event_types (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key        text UNIQUE NOT NULL,
    label_tr   text NOT NULL,
    label_en   text NOT NULL,
    label_el   text NOT NULL DEFAULT '',
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 2) Insert the 5 canonical event types
INSERT INTO event_types (key, label_tr, label_en, label_el, order_index) VALUES
  ('sanat-sergisi',      'Sanat Sergisi',            'Art Exhibition',        'Έκθεση Τέχνης',              1),
  ('kurumsal-seminer',   'Kurumsal Seminer',         'Corporate Seminar',     'Εταιρικό Σεμινάριο',         2),
  ('ozel-resepsiyon',    'Özel Resepsiyon',          'Private Reception',     'Ιδιωτική Δεξίωση',           3),
  ('foto-film',          'Fotoğraf / Film Çekimi',   'Photo / Film Shoot',    'Φωτογράφιση / Γύρισμα',      4),
  ('performans-konser',  'Performans / Konser',      'Performance / Concert', 'Παράσταση / Συναυλία',       5);

-- 3) Enable RLS
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "event_types_public_read" ON event_types
    FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "event_types_auth_insert" ON event_types
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "event_types_auth_update" ON event_types
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "event_types_auth_delete" ON event_types
    FOR DELETE TO authenticated USING (true);

-- 4) Migrate existing past_events type values to new canonical labels
-- Sergi → Sanat Sergisi
UPDATE past_events
SET type_tr = 'Sanat Sergisi',
    type_en = 'Art Exhibition',
    type_el = 'Έκθεση Τέχνης'
WHERE type_tr = 'Sergi';

-- Konser → Performans / Konser
UPDATE past_events
SET type_tr = 'Performans / Konser',
    type_en = 'Performance / Concert',
    type_el = 'Παράσταση / Συναυλία'
WHERE type_tr = 'Konser';

-- Konferans → Kurumsal Seminer
UPDATE past_events
SET type_tr = 'Kurumsal Seminer',
    type_en = 'Corporate Seminar',
    type_el = 'Εταιρικό Σεμινάριο'
WHERE type_tr = 'Konferans';

-- Performans → Performans / Konser
UPDATE past_events
SET type_tr = 'Performans / Konser',
    type_en = 'Performance / Concert',
    type_el = 'Παράσταση / Συναυλία'
WHERE type_tr = 'Performans';

-- Etkinlik → Özel Resepsiyon (closest match for generic "Event")
UPDATE past_events
SET type_tr = 'Özel Resepsiyon',
    type_en = 'Private Reception',
    type_el = 'Ιδιωτική Δεξίωση'
WHERE type_tr = 'Etkinlik';
