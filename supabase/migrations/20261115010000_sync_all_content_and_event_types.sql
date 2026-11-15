-- ============================================================
-- Galata Rum Okulu Vakfı - Kültür Merkezi
-- Comprehensive Database Sync (15 Kasım 2026 — Phase 3 Hardened)
-- 1. Enriched event_types (8 categories based on 82 past events)
-- 2. Backfill missing past_events descriptions & stabilized slugs
-- 3. Refine page_content (non-commercial, prestigious cultural tone)
-- 4. Hardened RLS on test_cases (restricted to `public.is_admin()`)
-- 5. Verified Postgres performance indexes
-- ============================================================

-- 1. EVENT TYPES (8 Canonical Categories from 82 Past Events)
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

-- 2. BACKFILL MISSING PAST_EVENTS DESCRIPTIONS & STABILIZED SLUGS (VERIFIED AGAINST ARCHIVAL RECORDS)
UPDATE public.past_events
SET description_tr = E'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.\n\nSergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.\n\nAhmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.',
    description_en = E'Bringing together art theorist, author, and curator Ali Artun with sculptor and conceptual artist Ahmet Yiğider, the exhibition “TÖZ (Essence)” took place at the Galata Greek School Foundation - Cultural Center from January 17 to February 8, 2026.\n\nAbstracting architecture from utilitarian daily practices and purely rationalist constructions, the exhibition approaches architectural form as an ancient, poetic, and symbolic language. Through sculptures and site-specific spatial installations in dialogue with the historic neoclassical halls of the Galata Greek School, “TÖZ” invites visitors into a contemplative reflection on space, geometry, memory, and existence.',
    description_el = E'Συνενώνοντας τον θεωρητικό της τέχνης, συγγραφέα και επιμελητή Ali Artun με τον γλύπτη και εννοιολογικό καλλιτέχνη Ahmet Yiğider, η έκθεση «TÖZ (Ουσία)» παρουσιάστηκε στο Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο από τις 17 Ιανουαρίου έως τις 8 Φεβρουαρίου 2026.\n\nΑφαιρώντας την αρχιτεκτονική από τις χρησιμοθηρικές πρακτικές της καθημερινότητας, η έκθεση την προσεγγίζει ως μια αρχέγονη, ποιητική και συμβολική γλώσσα σε διάλογο με τους ιστορικούς νεοκλασικούς χώρους της Σχολής Γαλατά.',
    sub_tag = COALESCE(sub_tag, 'Sanat Sergisi')
WHERE slug = 'toz-sergisi';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Performed by the Sesler Hazinesi Orchestra and Soloists in the historic main hall of the Galata Greek School, the “Samatya” Period Concert celebrated Istanbul’s multicultural musical heritage and the historical melodies of Samatya.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Ερμηνευμένη από την Ορχήστρα και τους Σολίστ Sesler Hazinesi στην ιστορική κεντρική αίθουσα της Σχολής Γαλατά, η Συναυλία Εποχής «Samatya» ανέδειξε την πολυπολιτισμική μουσική κληρονομιά της Κωνσταντινούπολης.')
WHERE slug = 'samatya-donem-konseri-sesler-hazinesi-orkestra-ve-solistleri';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Acclaimed Greek vocalist Violeta Ikari, accompanied by the Women’s Choir of the Holy Metropolis of Neapoli and Stavroupoli, performed the special concert “Fine Rain in Galata…” at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η αγαπημένη ερμηνεύτρια Βιολέτα Ίκαρη, συνοδευόμενη από τη Γυναικεία Χορωδία της Ιεράς Μητροπόλεως Νεαπόλεως και Σταυρουπόλεως, παρουσίασε την ειδική συναυλία «Στο Γαλατά ψιλή βροχή…» στη Σχολή Γαλατά.')
WHERE slug = 'violete-ikari-konseri-galatada-ince-bir-yagmur-neapoleos-stavropoleos-kutsal-metropolitligi-kadin-ko';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'As a primary venue for the international photography and visual arts festival 212 Photography Istanbul, the Galata Greek School hosted curated exhibitions featuring pioneering contemporary photographer Viviane Sassen and international visual artists.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο του διεθνούς φεστιβάλ φωτογραφίας 212 Photography Istanbul, το Ελληνικό Σχολείο Γαλατά φιλοξένησε εκθέσεις με έργα της πρωτοπόρου φωτογράφου Viviane Sassen και διεθνών καλλιτεχνών.')
WHERE slug = '212-photography-istanbul-festivali-viviane-sassen-afisi';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Presented in the exhibition halls of the Galata Greek School during the 212 Photography Istanbul festival, this showcase featured Ebru Yıldız’s striking photographic works documenting contemporary music and performance culture.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στους εκθεσιακούς χώρους της Σχολής Γαλατά στο πλαίσιο του 212 Photography Istanbul παρουσιάστηκαν τα φωτογραφικά έργα της Ebru Yıldız.')
WHERE slug = '212-photography-istanbul-festivali-ebru-yildiz-afisi';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Led by architect Murat Tabanlıoğlu, the closing symposium of “Port City Talks: Living by the Water” explored the architectural, cultural, and urban evolution of port cities at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Υπό την καθοδήγηση του αρχιτέκτονα Murat Tabanlıoğlu, το συμπόσιο λήξης της έκθεσης «Port City Talks: Living by the Water» εξέτασε την αρχιτεκτονική και πολιτιστική εξέλιξη των πόλεων-λιμανιών.')
WHERE slug = 'murat-tabanlioglu-liderliginde-port-city-talks-living-by-the-water-sergi-kapanisi';

-- Authentic backfill for the 5 records that had null/empty slugs
UPDATE public.past_events
SET slug = COALESCE(NULLIF(btrim(slug), ''), 'cagri-sarayin-eksilen-zaman-adli-sergisi'),
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Çağdaş sanatçı Çağrı Saray’ın Galata Rum Okulu’nda gerçekleşen “Eksilen Zaman” başlıklı kişisel sergisi; kentsel bellek, mekânsal dönüşüm ve zamanın aşındırdığı kişisel-toplumsal izleri çizim, video ve mekâna özgü yerleştirmeler aracılığıyla izleyiciye sundu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Hosted at the Galata Greek School, contemporary artist Çağrı Saray’s solo exhibition “Diminishing Time” explored urban memory, spatial transformation, and the traces eroded by time through drawings, video works, and site-specific installations.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η ατομική έκθεση του σύγχρονου καλλιτέχνη Çağrı Saray «Μειούμενος Χρόνος» στη Σχολή Γαλατά διερεύνησε την αστική μνήμη, τον χωρικό μετασχηματισμό και τα ίχνη του χρόνου μέσα από σχέδια, βίντεο και εγκαταστάσεις.')
WHERE id = 'd46eb8b7-1e2b-40db-b156-2aa1780f69b3';

UPDATE public.past_events
SET slug = COALESCE(NULLIF(btrim(slug), ''), 'ceren-oykutun-konstantiniye-ve-ayasofya-defterleri-adli-sergisi'),
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Sanatçı Ceren Oykut’un Galata Rum Okulu’nda düzenlenen “Konstantiniye ve Ayasofya Defterleri” sergisi, İstanbul’un tarihsel katmanlarını, gündelik kent yaşamını ve mimari hafızasını incelikli desen ve defter çalışmaları üzerinden görünür kıldı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Presented at the Galata Greek School, artist Ceren Oykut’s exhibition “Sketchbooks of Constantinople and Hagia Sophia” illuminated Istanbul’s historical layers, everyday urban life, and architectural memory through intricate drawings and sketchbooks.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η έκθεση της καλλιτέχνιδας Ceren Oykut «Τετράδια Κωνσταντινουπόλεως και Αγίας Σοφίας» στη Σχολή Γαλατά ανέδειξε τα ιστορικά στρώματα και την αρχιτεκτονική μνήμη της πόλης μέσα από λεπτομερή σχέδια.')
WHERE id = 'f9c5d523-452d-4876-9a4c-e69626593e33';

UPDATE public.past_events
SET slug = COALESCE(NULLIF(btrim(slug), ''), '2-istanbul-tasarim-bienali-gelecek-artik-eskisi-gibi-degil'),
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'İstanbul Kültür Sanat Vakfı (İKSV) tarafından Zoë Ryan küratörlüğünde düzenlenen 2. İstanbul Tasarım Bienali, “Gelecek Artık Eskisi Gibi Değil” başlığı altında ana sergi mekânı olarak Galata Rum Okulu’nda gerçekleşti. Bienal boyunca tarihi okul binasının tüm katları, manifestolar ve tasarım projeleriyle uluslararası bir düşünce laboratuvarına dönüştü.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Organized by the Istanbul Foundation for Culture and Arts (İKSV) and curated by Zoë Ryan, the 2nd Istanbul Design Biennial took place at the Galata Greek School as its primary venue under the theme “The Future Is Not What It Used To Be.”'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Διοργανωμένη από το Ίδρυμα Πολιτισμού και Τεχνών της Κωνσταντινούπολης (İKSV) σε επιμέλεια της Zoë Ryan, η 2η Μπιενάλε Σχεδιασμού της Κωνσταντινούπολης φιλοξενήθηκε στη Σχολή Γαλατά με θέμα «Το Μέλλον Δεν Είναι Πια Όπως Παλιά».')
WHERE id = '3fca592d-f02a-4d04-bbae-6cef46ec430b';

UPDATE public.past_events
SET slug = COALESCE(NULLIF(btrim(slug), ''), 'galata-rum-okulunda-duzenlenen-ikona-yapim-atolyesi'),
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Galata Rum Okulu’nun eğitim ve kültürel miras programları kapsamında gerçekleştirilen İkona Yapım Atölyesi’nde, geleneksel Bizans ikona resim teknikleri, ahşap hazırlığı, doğal pigmentler ve altın varak uygulamaları uygulamalı olarak katılımcılarla paylaşıldı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Held as part of the cultural heritage and educational programs at the Galata Greek School, the Icon Making Workshop introduced participants to traditional Byzantine iconography techniques, wooden panel preparation, natural pigments, and gold leaf application.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο των εκπαιδευτικών και πολιτιστικών προγραμμάτων της Σχολής Γαλατά, το Εργαστήριο Αγιογραφίας παρουσίασε τις παραδοσιακές βυζαντινές τεχνικές αγιογραφίας, την προετοιμασία ξύλου, τις φυσικές χρωστικές και το φύλλο χρυσού.')
WHERE id = '35031159-3d9a-43c2-8d26-5b5a2585f712';

UPDATE public.past_events
SET slug = COALESCE(NULLIF(btrim(slug), ''), '206-odali-sessizlik-buyukada-rum-yetimhanesi-uzerine-etudler-sergisi'),
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Avrupa’nın en büyük, dünyanın ise ikinci en büyük ahşap yapısı olan Büyükada Rum Yetimhanesi’nin mimari, tarihsel ve insani hafızasına odaklanan “206 Odalı Sessizlik: Büyükada Rum Yetimhanesi Üzerine Etüdler” sergisi, Galata Rum Okulu’nda arşiv belgeleri, fotoğraflar ve mimari araştırmalar eşliğinde izleyiciyle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Focusing on the architectural, historical, and human memory of the Prinkipo Greek Orphanage — Europe’s largest wooden building — the exhibition “206 Rooms of Silence: Studies on the Prinkipo Greek Orphanage” brought together archival documents, photographs, and architectural research at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Εστιάζοντας στην αρχιτεκτονική και ιστορική μνήμη του Ελληνικού Ορφανοτροφείου της Πριγκήπου — του μεγαλύτερου ξύλινου κτιρίου της Ευρώπης — η έκθεση «Σιωπή 206 Δωματίων» παρουσίασε αρχειακά τεκμήρια, φωτογραφίες και αρχιτεκτονικές μελέτες στη Σχολή Γαλατά.')
WHERE id = '2e9caf22-1aa9-452e-b057-061634e1e159';

-- 3. UPDATE PAGE_CONTENT ROWS
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

-- 4. TEST CASES TABLE (QA & Admin Dashboard Stats — Restricted to `public.is_admin()`)
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
ALTER TABLE public.test_cases FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.test_cases FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Authenticated users can manage test_cases" ON public.test_cases;
DROP POLICY IF EXISTS "Admins can manage test_cases" ON public.test_cases;
CREATE POLICY "Admins can manage test_cases"
    ON public.test_cases
    FOR ALL
    TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_cases TO authenticated;

-- 5. POSTGRES PERFORMANCE INDEXES (supabase-postgres-best-practices)
CREATE INDEX IF NOT EXISTS idx_past_events_slug ON public.past_events (slug);
CREATE INDEX IF NOT EXISTS idx_past_events_status_date ON public.past_events (status, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_artifacts_status_type ON public.artifacts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON public.page_content (page_key, section_key);
CREATE INDEX IF NOT EXISTS idx_venue_events_status_order ON public.venue_events (status, created_at DESC);

NOTIFY pgrst, 'reload schema';
