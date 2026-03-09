-- ============================================================
-- Phase 2: Add detailed columns to venue_events table
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE public.venue_events
    ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS area TEXT,
    ADD COLUMN IF NOT EXISTS features_tr TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS features_en TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS features_el TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS gala_capacity INTEGER,
    ADD COLUMN IF NOT EXISTS theater_capacity INTEGER,
    ADD COLUMN IF NOT EXISTS cocktail_capacity INTEGER,
    ADD COLUMN IF NOT EXISTS thumbnail_images TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS floor_plan_svg_url TEXT,
    ADD COLUMN IF NOT EXISTS svg_path TEXT,
    ADD COLUMN IF NOT EXISTS label_x INTEGER DEFAULT 250,
    ADD COLUMN IF NOT EXISTS label_y INTEGER DEFAULT 200,
    ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- ============================================================
-- Seed the 3 existing venue floors with their full data
-- (update by title since IDs are unknown)
-- ============================================================

-- Level 1: Grand Hall
UPDATE public.venue_events SET
    level = 1,
    area = '227 + 100 m²',
    features_tr = ARRAY['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü', 'Asma Kat: 60 + 22 m²'],
    features_en = ARRAY['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled', 'Mezzanine: 60 + 22 m²'],
    features_el = ARRAY['Ακουστική Επεξεργασία', 'Ολοκληρωμένο Σύστημα Φωτισμού', 'Κλιματισμός', 'Ημιώροφος: 60 + 22 m²'],
    gala_capacity = 400,
    theater_capacity = 600,
    cocktail_capacity = 800,
    svg_path = 'M 60 80 L 440 80 L 440 320 L 60 320 Z',
    label_x = 250,
    label_y = 200,
    order_index = 1
WHERE title_en ILIKE '%Grand Hall%' OR title_tr ILIKE '%Büyük Salon%';

-- Level 2: Exhibition Hall
UPDATE public.venue_events SET
    level = 2,
    area = '275 m²',
    features_tr = ARRAY['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü'],
    features_en = ARRAY['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled'],
    features_el = ARRAY['Ακουστική Επεξεργασία', 'Ολοκληρωμένο Σύστημα Φωτισμού', 'Κλιματισμός'],
    gala_capacity = 300,
    theater_capacity = 450,
    cocktail_capacity = 600,
    svg_path = 'M 60 80 L 300 80 L 300 180 L 440 180 L 440 380 L 60 380 Z',
    label_x = 250,
    label_y = 240,
    order_index = 2
WHERE title_en ILIKE '%Exhibition%Level 2%' OR title_tr ILIKE '%Kat 2%' OR (title_en ILIKE '%Exhibition%' AND level IS NULL AND order_index = 0);

-- Level 3: Exhibition Hall (largest)
UPDATE public.venue_events SET
    level = 3,
    area = '458 m²',
    features_tr = ARRAY['Akustik Düzenleme', 'Entegre Aydınlatma Sistemi', 'İklim Kontrollü'],
    features_en = ARRAY['Acoustic Treatment', 'Integrated Lighting Rig', 'Climate Controlled'],
    features_el = ARRAY['Ακουστική Επεξεργασία', 'Ολοκληρωμένο Σύστημα Φωτισμού', 'Κλιματισμός'],
    gala_capacity = 300,
    theater_capacity = 450,
    cocktail_capacity = 600,
    svg_path = 'M 120 100 L 380 100 L 380 220 L 440 220 L 440 340 L 120 340 L 120 220 L 60 220 L 60 160 L 120 160 Z',
    label_x = 250,
    label_y = 230,
    order_index = 3
WHERE title_tr ILIKE '%Dernek Odası%' OR title_tr ILIKE '%Çatı Terası%';

-- Also seed Dernek Odası and Çatı Terası if they didn't match above
-- (they were seeded without level info, update them properly)
UPDATE public.venue_events SET level = 2, order_index = 2
WHERE title_tr = 'Dernek Odası' AND level IS NULL;

UPDATE public.venue_events SET level = 3, order_index = 3
WHERE title_tr = 'Çatı Terası' AND level IS NULL;

-- Verify
SELECT id, title_en, title_tr, level, area, gala_capacity, order_index, status FROM public.venue_events ORDER BY order_index;
