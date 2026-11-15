-- ============================================================
-- Galata Rum Okulu Vakfı - Kültür Merkezi
-- Comprehensive Database Sync (15 Kasım 2026)
-- 1. venue_inquiries table & RLS
-- 2. Enriched event_types (8 categories based on 82 past events)
-- 3. Backfill missing past_events descriptions ("TÖZ" Sergisi et al.)
-- 4. Refine page_content (non-commercial, prestigious cultural tone)
-- ============================================================

-- 1. VENUE INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.venue_inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
    full_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    company text,
    event_type text,
    guest_count text,
    preferred_levels text[] NOT NULL DEFAULT '{}',
    proposed_date date,
    alternative_dates text,
    tech_requirements text[] NOT NULL DEFAULT '{}',
    message text,
    locale text NOT NULL DEFAULT 'tr'
);

ALTER TABLE public.venue_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit venue inquiries" ON public.venue_inquiries;
CREATE POLICY "Public can submit venue inquiries"
    ON public.venue_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read venue inquiries" ON public.venue_inquiries;
CREATE POLICY "Admins can read venue inquiries"
    ON public.venue_inquiries
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can update venue inquiries" ON public.venue_inquiries;
CREATE POLICY "Admins can update venue inquiries"
    ON public.venue_inquiries
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. EVENT TYPES (8 Canonical Categories from 82 Past Events)
INSERT INTO public.event_types (key, label_tr, label_en, label_el, order_index)
VALUES
    ('sanat-sergisi',     'Sanat Sergisi & Bienal',                 'Art Exhibition & Biennial',              'Έκθεση Τέχνης & Μπιενάλε',                  1),
    ('konferans',         'Konferans & Sempozyum',                  'Conference & Symposium',                 'Συνέδριο & Συμπόσιο',                       2),
    ('soylesi-panel',     'Söyleşi, Panel & Kitap Tanıtımı',        'Talk, Panel & Book Launch',              'Ομιλία, Πάνελ & Παρουσίαση Βιβλίου',        3),
    ('performans-konser', 'Performans, Konser & Tiyatro',           'Performance, Concert & Theater',         'Παράσταση, Συναυλία & Θέατρο',              4),
    ('ozel-resepsiyon',   'Özel Resepsiyon & Lansman',              'Private Reception & Brand Launch',       'Ιδιωτική Δεξίωση & Παρουσίαση',             5),
    ('kurumsal-seminer',  'Kurumsal Seminer & Zirve',               'Corporate Seminar & Summit',             'Εταιρικό Σεμινάριο & Σύνοδος',              6),
    ('atolye-egitim',     'Atölye & Akademik Program',              'Workshop & Academic Program',            'Εργαστήριο & Ακαδημαϊκό Πρόγραμμα',         7),
    ('foto-film',         'Film Gösterimi & Çekim Prodüksiyonu',    'Film Screening & Photo/Film Production', 'Προβολή Ταινίας & Οπτικοακουστική Παραγωγή', 8)
ON CONFLICT (key) DO UPDATE SET
    label_tr    = EXCLUDED.label_tr,
    label_en    = EXCLUDED.label_en,
    label_el    = EXCLUDED.label_el,
    order_index = EXCLUDED.order_index;

-- 3. BACKFILL MISSING PAST_EVENTS DESCRIPTIONS & SLUGS (ALL 13 ROWS)
UPDATE public.past_events
SET description_tr = E'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.\n\nSergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.\n\nAhmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.',
    sub_tag = COALESCE(sub_tag, 'Sanat Sergisi')
WHERE slug = 'toz-sergisi';

UPDATE public.past_events
SET description_tr = 'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.'
WHERE slug = 'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET description_tr = 'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.'
WHERE slug = 'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET description_tr = 'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.'
WHERE slug = '212-photography-istanbul-festivali-viviane-sassen-afisi' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET description_tr = '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.'
WHERE slug = '212-photography-istanbul-festivali-ebru-yildiz-afisi' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET description_tr = 'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.'
WHERE slug = 'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET description_tr = '18. İstanbul Bienali’nin Zihni Han’dan yükselen ve Beyoğlu ile Karaköy arasındaki tarihi dokuyu birbirine bağlayan sergi rotasının en önemli duraklarından biri olan Galata Rum Okulu, dünyanın dört bir yanından çağdaş sanatçıların mekâna özgü yerleştirme, heykel ve video yapıtlarına ev sahipliği yaptı.'
WHERE slug = '18-istanbul-bienali-zihni-handan-yukselen-bir-sergi-rotasi' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET description_tr = 'Mimar Murat Tabanlıoğlu küratörlüğünde Galata Rum Okulu’nda düzenlenen “Port City Talks: Living by the Water” sergisi ve konuşma serisi, su kıyısındaki liman kentlerinin mimari hafızasını, dönüşümünü ve gelecek vizyonlarını uluslararası uzmanların katılımıyla ele aldı.'
WHERE slug = 'port-city-talks-living-by-the-water-murat-tabanlioglu' AND (description_tr IS NULL OR description_tr = '');

UPDATE public.past_events
SET slug = COALESCE(slug, 'sismanoglio-megaro-20-yil-etkinlikleri-kapsaminda-yorgos-seferis-fotograf-sergisi'),
    description_tr = 'Yunanistan İstanbul Başkonsolosluğu Sismanoglio Megaro’nun 20. yıl etkinlikleri kapsamında Galata Rum Okulu’nda açılan fotoğraf sergisi, Nobel ödüllü şair ve diplomat Yorgos Seferis’in Anadolu ve İstanbul izlenimlerini belgeleyen nadir kareleri bir araya getirdi.'
WHERE id = 'd46eb8b7-1e2b-40db-b156-2aa1780f69b3';

UPDATE public.past_events
SET slug = COALESCE(slug, '2024-yilinda-duzenlenen-etkinliklerden-seckiler'),
    description_tr = 'Galata Rum Okulu Vakfı - Kültür Merkezi’nin 2024 yılı boyunca ev sahipliği yaptığı uluslararası sergiler, akademik sempozyumlar, dönem konserleri ve kültürel buluşmalardan derlenen yıl sonu seçkisi.'
WHERE id = 'f9c5d523-452d-4876-9a4c-e69626593e33';

UPDATE public.past_events
SET slug = COALESCE(slug, 'ataturk-kitapligi-5-yasinda-sempozyumu'),
    description_tr = 'İstanbul Büyükşehir Belediyesi Atatürk Kitaplığı’nın kuruluş yıldönümü vesilesiyle Galata Rum Okulu’nda düzenlenen sempozyumda; arşivcilik, kütüphanecilik, kent belleği ve kültürel mirasın dijitalleşmesi konuları akademisyen ve araştırmacılar tarafından ele alındı.'
WHERE id = '3fca592d-f02a-4d04-bbae-6cef46ec430b';

UPDATE public.past_events
SET slug = COALESCE(slug, 'gelecegin-egitimi-zirvesi'),
    description_tr = 'Tarihi eğitim mirasıyla simgeleşen Galata Rum Okulu’nda gerçekleştirilen Geleceğin Eğitimi Zirvesi; çağdaş pedagoji yaklaşımlarını, eğitimde dijital dönüşümü ve kültür-sanat odaklı öğrenme modellerini eğitimciler ve düşünürlerle tartışmaya açtı.'
WHERE id = '35031159-3d9a-43c2-8d26-5b5a2585f712';

UPDATE public.past_events
SET slug = COALESCE(slug, 'cagdas-sanat-bulusmalari-2023'),
    description_tr = 'Galata Rum Okulu’nun çok katlı tarihi sergi salonlarında düzenlenen Çağdaş Sanat Buluşmaları 2023; disiplinlerarası üretim yapan sanatçıları, küratörleri ve sanat eleştirmenlerini güncel sanat pratikleri etrafında bir araya getirdi.'
WHERE id = '2e9caf22-1aa9-452e-b057-061634e1e159';

-- 4. UPDATE PAGE_CONTENT ROWS
UPDATE public.page_content
SET content_tr = 'Mekan Kiralama',
    content_en = 'Venue Hire',
    content_el = 'Ενοικίαση Χώρου'
WHERE section_key = 'cta_primary';

UPDATE public.page_content
SET content_tr = 'Galata Rum Okulu Vakfı - Kültür Merkezi; İstanbul Bienali ve 212 Photography Istanbul gibi uluslararası sanat buluşmalarından dönem konserlerine, mimarlık ve edebiyat sempozyumlarından seçkin lansman ve özel resepsiyonlara kadar pek çok prestijli etkinliğe ev sahipliği yapmaktadır.',
    content_en = 'The Galata Greek School Foundation - Cultural Center hosts a distinguished repertoire of events — from international art gatherings like the Istanbul Biennial and 212 Photography Istanbul to period concerts, architecture and literature symposia, and exclusive receptions.',
    content_el = 'Το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο φιλοξενεί ένα εκλεκτό ρεπερτόριο εκδηλώσεων — από διεθνείς καλλιτεχνικές διοργανώσεις όπως η Μπιενάλε της Κωνσταντινούπολης έως συναυλίες, συμπόσια αρχιτεκτονικής και λογοτεχνίας, και ιδιαίτερες δεξιώσεις.'
WHERE section_key = 'hero_description';

-- 5. TEST CASES TABLE (QA & Admin Dashboard Stats)
CREATE TABLE IF NOT EXISTS public.test_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    title text NOT NULL,
    description text,
    steps text,
    expected_result text,
    status text NOT NULL DEFAULT 'pending',
    is_plan boolean NOT NULL DEFAULT true,
    assigned_to text
);

ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage test_cases" ON public.test_cases;
CREATE POLICY "Authenticated users can manage test_cases"
    ON public.test_cases
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. POSTGRES PERFORMANCE INDEXES (supabase-postgres-best-practices)
CREATE INDEX IF NOT EXISTS idx_past_events_slug ON public.past_events (slug);
CREATE INDEX IF NOT EXISTS idx_past_events_status_date ON public.past_events (status, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_artifacts_status_type ON public.artifacts (status, archive_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON public.page_content (page_name, section_key);
CREATE INDEX IF NOT EXISTS idx_venue_events_status_order ON public.venue_events (status, order_index ASC);

NOTIFY pgrst, 'reload schema';
