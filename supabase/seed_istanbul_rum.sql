-- Istanbul Rumları Archive: Add archive_type column and seed mock data
-- Run this in Supabase SQL Editor

-- 1. Add archive_type column to distinguish archive sections
ALTER TABLE public.artifacts ADD COLUMN IF NOT EXISTS archive_type TEXT DEFAULT 'school';

-- Update existing artifacts to be 'school' type
UPDATE public.artifacts SET archive_type = 'school' WHERE archive_type IS NULL;

-- 2. Add categories for Istanbul Rum archive
INSERT INTO public.archive_categories (id, name_tr, name_en, name_el)
VALUES
    ('a1000000-0000-0000-0000-000000000001'::uuid, 'Belgeler & Haritalar', 'Documents & Maps', 'Έγγραφα & Χάρτες'),
    ('a1000000-0000-0000-0000-000000000002'::uuid, 'Fotoğraflar & Objeler', 'Photographs & Objects', 'Φωτογραφίες & Αντικείμενα')
ON CONFLICT (id) DO NOTHING;

-- 3. Add subcategories for Istanbul Rum archive
INSERT INTO public.archive_subcategories (id, category_id, name_tr, name_en, name_el)
VALUES
    ('b1000000-0000-0000-0000-000000000001'::uuid, 'a1000000-0000-0000-0000-000000000001'::uuid, 'Patrikane Belgeleri', 'Patriarchate Documents', 'Έγγραφα Πατριαρχείου'),
    ('b1000000-0000-0000-0000-000000000002'::uuid, 'a1000000-0000-0000-0000-000000000001'::uuid, 'Cemaat Haritaları', 'Community Maps', 'Χάρτες Κοινοτήτων'),
    ('b1000000-0000-0000-0000-000000000003'::uuid, 'a1000000-0000-0000-0000-000000000002'::uuid, 'Cemaat Fotoğrafları', 'Community Photos', 'Φωτογραφίες Κοινότητας'),
    ('b1000000-0000-0000-0000-000000000004'::uuid, 'a1000000-0000-0000-0000-000000000002'::uuid, 'Tarihî Objeler', 'Historical Objects', 'Ιστορικά Αντικείμενα')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert 3 mock Istanbul Rum artifacts with trilingual content

-- Mock 1: Fener Rum Patrikhanesi Belgeleri
INSERT INTO public.artifacts (
    id, category_id, sub_category_id, image_url, archive_type,
    title_tr, title_en, title_el,
    description_tr, description_en, description_el,
    provenance_tr, provenance_en, provenance_el,
    status
) VALUES (
    'c1000000-0000-0000-0000-000000000001'::uuid,
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'b1000000-0000-0000-0000-000000000001'::uuid,
    '/images/artifacts/vintage-school-register.png',
    'istanbul_rum',
    'Fener Rum Patrikhanesi Resmî Yazışmaları',
    'Official Correspondence of the Ecumenical Patriarchate of Constantinople',
    'Επίσημη Αλληλογραφία του Οικουμενικού Πατριαρχείου Κωνσταντινουπόλεως',
    'Osmanlı döneminden kalma, Fener Rum Ortodoks Patrikhanesi''nin çeşitli kurumlar ve devlet makamlarıyla yaptığı resmî yazışmaları içeren belgeler. Bu koleksiyon, İstanbul Rum toplumunun idari ve dinî tarihine ışık tutmaktadır.',
    'A collection of official correspondence from the Ecumenical Patriarchate dating to the Ottoman era, documenting communications with various institutions and state authorities. This collection illuminates the administrative and religious history of the Istanbul Greek community.',
    'Συλλογή επίσημης αλληλογραφίας του Οικουμενικού Πατριαρχείου από την οθωμανική περίοδο, η οποία τεκμηριώνει τις επικοινωνίες με διάφορα ιδρύματα και κρατικές αρχές. Η συλλογή αυτή φωτίζει τη διοικητική και θρησκευτική ιστορία της ελληνικής κοινότητας της Κωνσταντινούπολης.',
    'Fener Rum Patrikhanesi Arşivi, 1850-1920',
    'Ecumenical Patriarchate Archive, 1850-1920',
    'Αρχείο Οικουμενικού Πατριαρχείου, 1850-1920',
    'published'
) ON CONFLICT (id) DO NOTHING;

-- Mock 2: Beyoğlu Rum Cemaati Fotoğrafları
INSERT INTO public.artifacts (
    id, category_id, sub_category_id, image_url, archive_type,
    title_tr, title_en, title_el,
    description_tr, description_en, description_el,
    provenance_tr, provenance_en, provenance_el,
    status
) VALUES (
    'c1000000-0000-0000-0000-000000000002'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'b1000000-0000-0000-0000-000000000003'::uuid,
    '/images/artifacts/vintage-greek-book.png',
    'istanbul_rum',
    'Beyoğlu Rum Cemaati Toplantı Fotoğrafları',
    'Photographs of the Beyoğlu Greek Community Gatherings',
    'Φωτογραφίες Συγκεντρώσεων της Ελληνικής Κοινότητας του Πέραν',
    '1930''lu yıllardan kalma, Beyoğlu''ndaki Rum cemaatinin düzenlediği sosyal ve kültürel etkinliklerin fotoğrafları. Dönemin yaşam tarzını, giyim kuşamını ve toplumsal ilişkilerini yansıtan değerli görsel belgeler.',
    'Photographs from the 1930s documenting social and cultural events organized by the Greek community in Beyoğlu. These valuable visual documents reflect the lifestyle, fashion, and social relations of the era.',
    'Φωτογραφίες από τη δεκαετία του 1930 που τεκμηριώνουν κοινωνικές και πολιτιστικές εκδηλώσεις που οργάνωσε η ελληνική κοινότητα του Πέραν. Πολύτιμα οπτικά τεκμήρια που αντανακλούν τον τρόπο ζωής, τη μόδα και τις κοινωνικές σχέσεις της εποχής.',
    'Beyoğlu Rum Cemaati Arşivi, 1930-1945',
    'Beyoğlu Greek Community Archive, 1930-1945',
    'Αρχείο Ελληνικής Κοινότητας Πέραν, 1930-1945',
    'published'
) ON CONFLICT (id) DO NOTHING;

-- Mock 3: İstanbul Rum Okulları Haritası
INSERT INTO public.artifacts (
    id, category_id, sub_category_id, image_url, archive_type,
    title_tr, title_en, title_el,
    description_tr, description_en, description_el,
    provenance_tr, provenance_en, provenance_el,
    status
) VALUES (
    'c1000000-0000-0000-0000-000000000003'::uuid,
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'b1000000-0000-0000-0000-000000000002'::uuid,
    '/images/artifacts/vintage-school-register.png',
    'istanbul_rum',
    'İstanbul Rum Okulları Haritası (1890)',
    'Map of Greek Schools in Istanbul (1890)',
    'Χάρτης Ελληνικών Σχολείων Κωνσταντινούπολης (1890)',
    '19. yüzyıl sonlarında İstanbul''daki tüm Rum okullarının konumlarını gösteren detaylı bir harita. Harita, okulların yanı sıra kiliseleri, hayır kurumlarını ve toplumsal mekanları da işaretlemektedir.',
    'A detailed map showing the locations of all Greek schools in Istanbul in the late 19th century. In addition to schools, the map also marks churches, charitable institutions, and community spaces.',
    'Λεπτομερής χάρτης που δείχνει τις θέσεις όλων των ελληνικών σχολείων στην Κωνσταντινούπολη στα τέλη του 19ου αιώνα. Εκτός από τα σχολεία, ο χάρτης σημειώνει επίσης εκκλησίες, φιλανθρωπικά ιδρύματα και κοινοτικούς χώρους.',
    'Özel Koleksiyon, İstanbul, 1890',
    'Private Collection, Istanbul, 1890',
    'Ιδιωτική Συλλογή, Κωνσταντινούπολη, 1890',
    'published'
) ON CONFLICT (id) DO NOTHING;
