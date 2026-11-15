-- ============================================================
-- Galata Rum Okulu Vakfı - Kültür Merkezi
-- Comprehensive Database Sync & Security Hardening (15 Kasım 2026)
--
-- DÜZELTİLEN HATALAR:
-- 1. `page_content` tablosunda var olmayan `page_name` sütunu yerine
--    doğru sütun adı olan `(page_key, section_key)` kullanıldı.
-- 2. `event_types (key)` üzerinde `ON CONFLICT (key)` çalışmadan önce
--    `event_types_key_unique_idx` benzersiz indeksi garanti altına alındı.
-- 3. `admin_users`, `is_admin()`, form tabloları RLS sertleştirmeleri ve
--    sunucu tarafı rate-limit tetikleyicileri tek dosyada idempotent
--    olarak birleştirildi.
-- ============================================================

-- 0. ADMIN ALLOWLIST & HARDENED `public.is_admin()` HELPER
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       text NOT NULL UNIQUE,
    role        text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.admin_users FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "admin_users_read_self" ON public.admin_users;
CREATE POLICY "admin_users_read_self"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()) AND is_active = true);

GRANT SELECT ON public.admin_users TO authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT (
        EXISTS (
            SELECT 1
            FROM public.admin_users au
            WHERE au.user_id = (SELECT auth.uid())
              AND au.is_active = true
        )
        OR (
            COALESCE(
                ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
                OR COALESCE(((SELECT auth.jwt()) -> 'app_metadata' ->> 'is_admin')::boolean, false),
                false
            )
            AND NOT EXISTS (
                SELECT 1
                FROM public.admin_users au
                WHERE au.user_id = (SELECT auth.uid())
                  AND au.is_active = false
            )
        )
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "users_can_read_own_admin_record" ON public.admin_users;
CREATE POLICY "users_can_read_own_admin_record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "admins_can_manage_admin_users" ON public.admin_users;
CREATE POLICY "admins_can_manage_admin_users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;

-- 0.1 HARDEN RLS & RATE-LIMIT TRIGGERS ON FORM TABLES (venue_inquiries, archive_inquiries, newsletter_subscribers)
ALTER TABLE public.venue_inquiries
    ADD COLUMN IF NOT EXISTS consent_accepted boolean NOT NULL DEFAULT false;

ALTER TABLE public.venue_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_inquiries FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.venue_inquiries FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.venue_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.venue_inquiries TO authenticated;
GRANT ALL ON public.venue_inquiries TO service_role;

DROP POLICY IF EXISTS "Public can submit venue inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "Admins can read venue inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "Admins can update venue inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "anon_can_insert_valid_venue_inquiry" ON public.venue_inquiries;
DROP POLICY IF EXISTS "authenticated_can_read_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "authenticated_can_update_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "admins_can_read_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "admins_can_update_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "admins_can_delete_venue_inquiries" ON public.venue_inquiries;

CREATE POLICY "anon_can_insert_valid_venue_inquiry"
    ON public.venue_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        consent_accepted = true
        AND status = 'new'
        AND length(btrim(full_name)) >= 2
        AND length(btrim(email)) >= 5
        AND length(btrim(phone)) >= 6
    );

CREATE POLICY "admins_can_read_venue_inquiries"
    ON public.venue_inquiries
    FOR SELECT
    TO authenticated
    USING ((SELECT public.is_admin()));

CREATE POLICY "admins_can_update_venue_inquiries"
    ON public.venue_inquiries
    FOR UPDATE
    TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admins_can_delete_venue_inquiries"
    ON public.venue_inquiries
    FOR DELETE
    TO authenticated
    USING ((SELECT public.is_admin()));

CREATE OR REPLACE FUNCTION public.enforce_venue_inquiry_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_recent_email_count integer;
    v_daily_email_count integer;
    v_global_burst_count integer;
BEGIN
    NEW.email := lower(btrim(NEW.email));
    NEW.full_name := btrim(NEW.full_name);
    NEW.phone := btrim(NEW.phone);

    SELECT count(*)
      INTO v_recent_email_count
      FROM public.venue_inquiries
     WHERE lower(btrim(email)) = NEW.email
       AND created_at > (now() - interval '10 minutes');

    IF v_recent_email_count >= 1 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many venue inquiries from this email address. Please wait 10 minutes.'
            USING ERRCODE = 'P0001';
    END IF;

    SELECT count(*)
      INTO v_daily_email_count
      FROM public.venue_inquiries
     WHERE lower(btrim(email)) = NEW.email
       AND created_at > (now() - interval '24 hours');

    IF v_daily_email_count >= 5 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Daily inquiry limit reached for this email address.'
            USING ERRCODE = 'P0001';
    END IF;

    SELECT count(*)
      INTO v_global_burst_count
      FROM public.venue_inquiries
     WHERE created_at > (now() - interval '1 minute');

    IF v_global_burst_count >= 20 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Temporary high traffic. Please retry in a minute.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_venue_inquiries_rate_limit ON public.venue_inquiries;
CREATE TRIGGER trg_venue_inquiries_rate_limit
    BEFORE INSERT ON public.venue_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_venue_inquiry_rate_limit();

-- Harden archive_inquiries & newsletter_subscribers policies if tables exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archive_inquiries') THEN
        ALTER TABLE public.archive_inquiries ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.archive_inquiries FORCE ROW LEVEL SECURITY;
        REVOKE ALL ON public.archive_inquiries FROM PUBLIC, anon, authenticated;
        GRANT INSERT ON public.archive_inquiries TO anon, authenticated;
        GRANT SELECT, UPDATE, DELETE ON public.archive_inquiries TO authenticated;
        GRANT ALL ON public.archive_inquiries TO service_role;

        DROP POLICY IF EXISTS "authenticated_can_read_archive_inquiries" ON public.archive_inquiries;
        DROP POLICY IF EXISTS "authenticated_can_update_archive_inquiries" ON public.archive_inquiries;
        DROP POLICY IF EXISTS "admins_can_read_archive_inquiries" ON public.archive_inquiries;
        DROP POLICY IF EXISTS "admins_can_update_archive_inquiries" ON public.archive_inquiries;
        DROP POLICY IF EXISTS "admins_can_delete_archive_inquiries" ON public.archive_inquiries;

        CREATE POLICY "admins_can_read_archive_inquiries"
            ON public.archive_inquiries FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
        CREATE POLICY "admins_can_update_archive_inquiries"
            ON public.archive_inquiries FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
        CREATE POLICY "admins_can_delete_archive_inquiries"
            ON public.archive_inquiries FOR DELETE TO authenticated USING ((SELECT public.is_admin()));
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'newsletter_subscribers') THEN
        ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.newsletter_subscribers FORCE ROW LEVEL SECURITY;
        REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC, anon, authenticated;
        GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
        GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
        GRANT ALL ON public.newsletter_subscribers TO service_role;

        DROP POLICY IF EXISTS "authenticated_can_read_newsletter_subscribers" ON public.newsletter_subscribers;
        DROP POLICY IF EXISTS "authenticated_can_update_newsletter_subscribers" ON public.newsletter_subscribers;
        DROP POLICY IF EXISTS "admins_can_read_newsletter_subscribers" ON public.newsletter_subscribers;
        DROP POLICY IF EXISTS "admins_can_update_newsletter_subscribers" ON public.newsletter_subscribers;
        DROP POLICY IF EXISTS "admins_can_delete_newsletter_subscribers" ON public.newsletter_subscribers;

        CREATE POLICY "admins_can_read_newsletter_subscribers"
            ON public.newsletter_subscribers FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
        CREATE POLICY "admins_can_update_newsletter_subscribers"
            ON public.newsletter_subscribers FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
        CREATE POLICY "admins_can_delete_newsletter_subscribers"
            ON public.newsletter_subscribers FOR DELETE TO authenticated USING ((SELECT public.is_admin()));
    END IF;
END $$;

-- 1. EVENT TYPES (Ensure unique index on `key` before ON CONFLICT upsert)
CREATE UNIQUE INDEX IF NOT EXISTS event_types_key_unique_idx
    ON public.event_types (key);

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

-- 2. BACKFILL MISSING PAST_EVENTS DESCRIPTIONS (TR/EN/EL) & STABILIZED SLUGS (ALL 13 CURATED RECORDS)
ALTER TABLE public.past_events
    ADD COLUMN IF NOT EXISTS description_en text,
    ADD COLUMN IF NOT EXISTS description_el text;

UPDATE public.past_events
SET description_tr = E'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.\n\nSergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.\n\nAhmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.',
    description_en = E'Bringing together art theorist, author, and curator Ali Artun with sculptor and conceptual artist Ahmet Yiğider, the exhibition “TÖZ (Substance)” welcomed visitors at the Galata Greek School Foundation - Cultural Center between January 17 and February 8, 2026.\n\nAbstracting architecture from utilitarian daily practices, functionalist constraints, and rationalist construction, the exhibition approaches architecture as an ancient, poetic, and symbolic language. Within Ali Artun’s curatorial framework, “TÖZ” transcends ordinary built environments to explore the imaginative realm of form, geometry, number, and symbol.\n\nIn dialogue with the historic neoclassical atmosphere of the Galata Greek School, Ahmet Yiğider’s sculptures and spatial installations render visible the traces, substance, and mystery embedded in humanity’s ancient memory — inviting viewers into a space of contemplation on space, form, and existence.',
    description_el = E'Συνενώνοντας τον θεωρητικό της τέχνης, συγγραφέα και επιμελητή Ali Artun με τον γλύπτη και εννοιολογικό καλλιτέχνη Ahmet Yiğider, η έκθεση «TÖZ (Ουσία)» φιλοξενήθηκε στο Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο από τις 17 Ιανουαρίου έως τις 8 Φεβρουαρίου 2026.\n\nΑποδεσμεύοντας την αρχιτεκτονική από τη χρησιμοθηρική καθημερινότητα και τον ορθολογισμό, η έκθεση την προσεγγίζει ως μια αρχέγονη, ποιητική και συμβολική γλώσσα που εστιάζει στον φαντασιακό κόσμο της μορφής, της γεωμετρίας, του αριθμού και του συμβόλου.\n\nΣε διάλογο με την ιστορική νεοκλασική ατμόσφαιρα της Σχολής Γαλατά, τα γλυπτά και οι χωρικές εγκαταστάσεις του Ahmet Yiğider αναδεικνύουν τα ίχνη και την ουσία της αρχαίας μνήμης, προσκαλώντας τον επισκέπτη σε έναν χώρο στοχασμού γύρω από τον χώρο, τη μορφή και την ύπαρξη.',
    sub_tag = COALESCE(sub_tag, 'Sanat Sergisi')
WHERE id = '41dea564-3256-4bf8-88c7-b7cba4f784d3' OR slug = 'toz-sergisi';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Performed by the Treasury of Voices Orchestra and Soloists in the historic Grand Hall of the Galata Greek School, the “Samatya” Period Concert brought Istanbul’s multicultural musical heritage and historical melodies to the audience.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η συναυλία εποχής «Samatya» από την Ορχήστρα και τους Σολίστ «Θησαυρός Φωνών» στην ιστορική αίθουσα της Σχολής Γαλατά ανέδειξε την πολυπολιτισμική μουσική κληρονομιά της Κωνσταντινούπολης.')
WHERE id = 'ea2aa434-164a-4b0d-82a8-662393a1cb78';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Acclaimed Greek vocalist Violete Ikari, accompanied by the Women’s Choir of the Holy Metropolis of Neapoli and Stavroupoli, performed the special concert “A Fine Rain in Galata…” at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η καταξιωμένη ερμηνεύτρια Βιολέτα Ίκαρη, συνοδευόμενη από τη Γυναικεία Χορωδία της Ιεράς Μητροπόλεως Νεαπόλεως και Σταυρουπόλεως, παρουσίασε μια ξεχωριστή συναυλία στη Σχολή Γαλατά.')
WHERE id = '7393d6fb-db07-4685-af62-10cc035a0ca2';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'As part of the international 212 Photography Istanbul festival, the Galata Greek School hosted curated exhibitions featuring leading contemporary photographers including Viviane Sassen.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο του διεθνούς φεστιβάλ 212 Photography Istanbul, η Σχολή Γαλατά φιλοξένησε επιμελημένες εκθέσεις σύγχρονης φωτογραφίας με έργα της Viviane Sassen και διεθνών καλλιτεχνών.')
WHERE id = 'f9d2422d-d955-4d80-8828-94eaf2ef2ad9';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Hosted across the exhibition halls of the Galata Greek School during the 212 Photography Istanbul festival, this showcase presented striking photographic works by Ebru Yıldız.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο του φεστιβάλ 212 Photography Istanbul, οι εκθεσιακοί χώροι της Σχολής Γαλατά φιλοξένησαν φωτογραφικά έργα της Ebru Yıldız.')
WHERE id = 'bb82fa65-e8ec-45ec-8117-d5bb949923bc';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Led by architect Murat Tabanlıoğlu, the closing symposium of “Port City Talks: Living by the Water” explored the architectural, cultural, and urban evolution of port cities at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Υπό την καθοδήγηση του αρχιτέκτονα Murat Tabanlıoğlu, το συμπόσιο λήξης της έκθεσης «Port City Talks: Living by the Water» εξέτασε την αρχιτεκτονική και πολιτιστική εξέλιξη των πόλεων-λιμανιών.')
WHERE id = 'c258c4a7-8c4d-47e7-88cb-919e116b4135';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'İstanbul doğumlu büyük muganni ve Patrikhane Başmugannisi (Arhondon Protopsaltis) Üstad Thrasivoulos Stanitsas (1910–1987) anısına düzenlenen bu özel dinî musiki konseri, Bizans ve İstanbul Rum musiki geleneğinin seçkin eserlerini Galata Rum Okulu’nun tarihi atmosferinde dinleyicilerle buluşturdu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Held in memory of the Istanbul-born Archon Protopsaltis of the Ecumenical Patriarchate, Master Thrasivoulos Stanitsas (1910–1987), this sacred music concert presented distinguished works of the Byzantine and Constantinopolitan musical tradition at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Αφιερωμένη στη μνήμη του Κωνσταντινουπολίτη Άρχοντος Πρωτοψάλτου της Μεγάλης του Χριστού Εκκλησίας Θρασύβουλου Στανίτσα (1910–1987), αυτή η συναυλία εκκλησιαστικής μουσικής παρουσίασε εκλεκτά έργα της βυζαντινής και πολίτικης ψαλτικής παράδοσης στη Σχολή Γαλατά.')
WHERE id = 'be2395b4-6335-4d04-9766-26981adc4945';

UPDATE public.past_events
SET description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Tarihçi, diplomat ve yazar Büyükelçi Aleksis Aleksandris’in katılımıyla Galata Rum Okulu’nda düzenlenen bu özel konferans ve söyleşide, İstanbul Rum toplumunun yakın dönem eğitim, kültür ve diplomasi tarihi kapsamlı biçimde ele alındı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Featuring historian, diplomat, and author Ambassador Alexis Alexandris, this special lecture and discussion at the Galata Greek School examined the modern educational, cultural, and diplomatic history of the Greek community of Istanbul.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Με τη συμμετοχή του ιστορικού, διπλωμάτη και συγγραφέα Πρέσβη Αλέξη Αλεξανδρή, αυτή η ειδική διάλεξη στη Σχολή Γαλατά εξέτασε τη σύγχρονη εκπαιδευτική, πολιτιστική και διπλωματική ιστορία της ελληνικής κοινότητας της Κωνσταντινούπολης.')
WHERE id = 'd011faf7-00d9-444f-b537-7deb4689ea8e';

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

-- 5. POSTGRES PERFORMANCE INDEXES (Fixed `page_key` column name on `page_content`)
CREATE INDEX IF NOT EXISTS idx_past_events_slug ON public.past_events (slug);
CREATE INDEX IF NOT EXISTS idx_past_events_status_date ON public.past_events (status, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_artifacts_status_type ON public.artifacts (status, archive_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_content_page_key ON public.page_content (page_key, section_key);
CREATE INDEX IF NOT EXISTS idx_venue_events_status_order ON public.venue_events (status, order_index ASC);

-- 6. NORMALIZE LEGACY WORDPRESS MEDIA URLS (/img/...) & UPSERT 18 PRESERVED 2014-2018 EXHIBITIONS/EVENTS
UPDATE public.past_events
SET cover_image_url = regexp_replace(cover_image_url, '^https?://(www\.)?galatarumokulu\.org/img/', '/img/', 'i')
WHERE cover_image_url ~* '^https?://(www\.)?galatarumokulu\.org/img/';

UPDATE public.past_events
SET thumbnail_images = ARRAY(
    SELECT regexp_replace(elem, '^https?://(www\.)?galatarumokulu\.org/img/', '/img/', 'i')
    FROM unnest(thumbnail_images) AS elem
)
WHERE EXISTS (
    SELECT 1
    FROM unnest(thumbnail_images) AS elem
    WHERE elem ~* '^https?://(www\.)?galatarumokulu\.org/img/'
);

INSERT INTO public.past_events (
    id, slug, event_date, type_tr, type_en, type_el,
    title_tr, title_en, title_el,
    description_tr, description_en, description_el,
    cover_image_url, thumbnail_images, status
)
VALUES
    ('b2000000-0000-0000-0000-000000000001', 'reverberations-violence-across-time-and-space', '2015-03-26', 'Konferans & Sempozyum', 'Conference & Symposium', 'Συνέδριο & Συμπόσιο', 'Reverberations: Violence across Time and Space', 'Reverberations: Violence across Time and Space', 'Reverberations: Violence across Time and Space', '', E'This conference aims to generate new concepts for the study of violence and its aftermath. We invite innovative ethnographic studies that attend to the enduring distribution and reverberation of violence across space, time and other dimensions, both in and beyond the interiority and inter-subjectivity of the human being. Specifically we would like to ask what are the potentials and dangers of displacing the human from its central position within studies of violence? And, what can a post-humanist analysis of violence look like?\n\nMany studies on violence to date have assumed an anthropocentric framework inspired by humanist philosophies. Violence done to the human self and body (on an individual or massive scale) has thereby formed the primary concern and engendered conceptualizations drawing on tools of theories of ‘subjectivity.’ Concepts thus applied and theorized range from ‘trauma’ to ‘melancholia,’ ‘mourning,’ ‘nostalgia,’ ‘loss,’ and ‘suffering,’ unpacked via versions of ‘memory studies.’ On the other hand, by engaging the limits of language and representation and by following displacements and responses across and beyond bodies and technologies, studies on violence have also partaken in moves to deconstruct and complicate notions of the human. Scholars in this vein have begun to explore the reach of violence across time, space and materialities as ‘ruination,’ as well as its mystical supernatural apparitions via ‘haunting’.\n\nFoucault was arguably the first post-humanist philosopher to analyse violence in spaces, time, institutions, and regulations, beyond the wounds inflicted through torture upon the human body. This conference aims to build upon this post-humanist trajectory by taking on board, in the study of violence, other more recent challenges from affect theory and the new materialisms. In doing so, however, we do not aim to advocate any clear theoretical orientation or trajectory, but instead to create a space for the discussion of the strengths and weaknesses of different frameworks. A critical engagement with humanist legacies within studies of violence that focus singularly on human subjectivity might thus be matched by reflections on how recent post-humanist approaches, in ‘distributing subjectivity outside’\n\n(Latour) have, in reverse, failed to explore the body, inter-subjectivity, and gender.\n\nWe invite scholars into a space for critical discussion where we aim to generate new concepts, frameworks and modes of enquiry through historically and ethnographically specific cases on the longue durée, spatial expanse and material reverberations of violent pasts. Ethnographies in this vein could account for violence as it seeps into the environment, the atmosphere, air, nature, people’s relations with supernatural beings, with their objects, spaces, the built environment, technologies and other rationalities, as well as with each other. Such studies would attend to criss- crossing relations that involve violence (human body-environment- materiality-space-time) without singularly framing violence in the asymmetrical inter-subjective relation between perpetrator and victim. Instead they would study violence as it crosses substances, fields, institutions, and inter-subjective relations, how violence gets reconfigured, how it assumes other chemistries or appears in new moulds and shapes. The historical and the ethnographic will drive the analyses invited such that specific rather than abstract conceptualizations of violence are developed and discussed.\n\nOrganizing Committee: Yael Navaro-Yashin, Zerrin Ozlem Biner, Alice von Bieberstein, Seda Altug\n\nExhibition Curator: Emrah Gokdemir\n\nREMNANTS project, Department of Social Anthropology, University of Cambridge\n\nSponsored by: European Research Council (ERC) and the Department of Social Anthropology, University of Cambridge', '', '/img/2023/05/10930869_10206590416627890_8326187023047179041_n.jpg', ARRAY['/img/2023/05/10930869_10206590416627890_8326187023047179041_n.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000002', 'imge-ve-otesi', '2014-04-23', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'İmge ve Ötesi', 'İmge ve Ötesi', 'Εικόνα και το πέραν Αυτής', E'Galata Rum Okulu, 23 Nisan – 14 Haziran tarihleri arasında, Domenikos Theotokopoulos’un 400. ölüm yıldönümü dolayısı ile kendi bünyesinde düzenlediği ilk araştırma bazlı sergi olan ”İmge ve Ötesi: Domenikos Theotokopoulos” u İstanbullu sanatseverlere gururla sunar.\n\n”İmge ve Ötesi:Domenikos Theotokopoulos” sanat tarihinde çoğunlukla El Greco olarak bilinen Domenikos Theotocopoulos’un bilinmeyen ikonograf kimliğine odaklanarak, aynı zamanda esas olarak dinsel tasvir’in ötesinde bir anlama ve derin bir felsefeye sahip olan ikona ile görünmez yaratıcısı olan ikonografların dünyasına ışık tutmaktadır. İzleyiciyi fiziksel dünyadan tinsel alana taşıyan ikonalar, ”görünmeyeni” görünür kılan bir araç niteliğindedir. İkonograflar ise , bu imgelerin sessiz yaratıcıları olarak, görünmeyen, içsel olan bu alanı görmemizi sağlayan ve bu dünyayı yaratımları aracılığı ile ortaya çıkararkan sanatçılardır. Sanat tarihi boyunca geçmişten bugüne birçok sanatçıyı derinden etkilemiş olan Domenikos Theotokopoulos Girit doğumlu olup, yaşamının ilk dönemlerinde Venedikte sanatsal pratiğinin ilk adımı olan ikonografiye yoğunlaşmış ve Bizans ikona geleneğini benimseyerek ileriki dönemlerinde gerçekleştirdiği resimlerinde de bu görsel dilin ışığında pratiğini dönüştürmüştür.\n\nGörünmeyen olanın kapılarını aralayan Domenikos Theotokopoulos’un ikonograf kimliğini keşfederken, aynı zamanda içerisine bulunduğumuz coğrafyanın sosyo kültürel belleğinin de bir parçası olan ikona sanatının bilinmeyen yönlerine ışık tutan sergi’nin akademik danışmanlığını Işık Üni. öğretim üyesi Prof.Dr.Eva Aleksandru Şarlak ve küratörlüğünü Hera Büyüktaşçıyan gerçekleştirmektedir. Galata Rum Okulu bünyesinde gerçekleşen ve Hollanda Başkonsolosluğu’nun MATRA İnsan Hakları fonu ile desteklenen bu dokümanter serginin araştırması ve içeriği Adil Öztürk, Ruhiye Onurel (ROŞ), Kültürel Mirası Koruma Merkezi’nden Selen Erken ve Cansu Kuman tarafından gerçekleştirilmiştir.', '', E'Έκθεση με τίτλο «Εικόνα και το πέραν της εικόνας: Δομίνικος Θεοτοκόπουλος» που αφορά μια μελέτη στο έργο του μεγάλου ζωγράφου, έχει την τιμή να παρουσιάσει η Σχολή Γαλατά από τις 23 Απριλίου έως τις 15 Ιουνίου 2014 με αφορμή την ανακήρυξη του 2014 ως έτους «Δομήνικου Θεοτοκόπουλου» για τη συμπλήρωση 400 χρόνων από το θάνατο του μεγάλου Κρητικού ζωγράφου.\n\nΗ έκθεση «Εικόνα και το πέραν Αυτής: Δομίνικος Θεοτοκόπουλος» που περιλαμβάνει άγνωστες πτυχές του καλλιτεχνικού ιδιώματος του διάσημου ζωγράφου, γνωστού στο ευρύ κοινό με το όνομα Ελ Γκρέκο, επιχειρεί να αναδείξει μέσα από τις εικόνες που κατέχουν ένα βαθύ φιλοσοφικό νόημα και υπόσταση πέρα από τα όρια της απλής θρησκευτικής απεικόνισης, τον αθέατο δημιουργικό κόσμο της εικονογραφίας.\n\nΟι εικόνες έχοντας την ιδιότητα να κάνουν το αόρατο ορατό ανυψώνουν τον θεατή από τον πραγματικό στον πνευματικό κόσμο. Ιδιαίτερα στην εικονογραφία, ως αθόρυβοι δημιουργοί αυτών των εικόνων, οι καλλιτέχνες, μέσω της απεικόνισης αυτού του κόσμου μας επιτρέπουν να δούμε αυτή την αόρατη, βαθειά εσωτερική τους πλευρά.\n\nΓεννημένος στην Κρήτη και έχοντας ζήσει τα νεανικά του χρόνια στη Βενετία, ο Δομίνικος Θεοτοκόπουλος, λειτούργησε ως καταλύτης για τη σύγχρονη τέχνη από το παρελθόν μέχρι τις μέρες μας. Αφιερώνοντας την πρώιμη καλλιτεχνική του παραγωγή στην εικονογραφία και επηρεασμένος από τη βυζαντινή τεχνοτροπία μεταμόρφωσε, υπό το φως αυτής της εικαστικής γλώσσας, το ύφος στις εικόνες της επόμενης περιόδου επηρεάζοντας την εξέλιξη της ζωγραφικής του 19ου και 20ου αιώνα.\n\nΗ έκθεση επιχειρεί να σκιαγραφήσει την καλλιτεχνική ταυτότητα του Δομίνικου Θεοτοκόπουλου που καταπιάνεται με το υπερβατικό, ενώ ταυτόχρονα αναδεικνύει άγνωστες πτυχές της εικονογραφίας η οποία αποτελεί σημαντικό κομμάτι της κοινωνικό-πολιτιστικής κληρονομιάς της γεωγραφικής περιοχής μας.\n\nΗ έκθεση που διοργανώνει η Σχολή Γαλατά υλοποιείται με τη στήριξη του προγράμματος MATRA για τα ανθρώπινα δικαιώματα του Ολλανδικού Προξενείου. Την ευθύνη για την έρευνα και επιστημονική επιμέλεια της έκθεσης έχει η καθηγήτρια του Πανεπιστημίου Işık κ. Εύα Σαρλάκ και η επιμέλεια ανήκει στην Ήρα Büyüktaşçıyan . Επίσης, στο κομμάτι της έρευνας και περιεχομένου της έκθεσης συνεργάστηκαν η Adil Öztürk και η Ruhiye Onurel (ROŞ) καθώς και από το Κέντρο Προστασίας Πολιτιστικής Κληρονομιάς η Selen Erken και η Cansu Kuman.', '/img/2023/05/Imge-ve-Otesi-Domenikos-TheotokopoulosTR-732x1024.jpg', ARRAY['/img/2023/05/Imge-ve-Otesi-Domenikos-TheotokopoulosTR-732x1024.jpg', '/img/2023/05/Imge-ve-Otesi-Domenikos-Theotokopoulos-GR-732x1024.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000003', 'grape-juice', '2014-05-17', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Grape Juice', 'Grape Juice', 'Grape Juice', 'İtalyan Büyükelçiliği, İtalyan Kültür Merkezi ve AlbumArte işbirliği ile gerçekleşen ”Anteprima” misafir sanatçı programı kapsamında davet edilen Flavio Favelli’nin sergisi ”Grape Juice” 17 Mayıs – 14 Haziran 2014 tarihleri arasında Galata Rum Okulu/ büyük salon’da görülebilecek.', '', '', '/img/2023/05/10258735_630580773703537_7637006620451321955_o-1024x627.jpg', ARRAY['/img/2023/05/10258735_630580773703537_7637006620451321955_o-1024x627.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000004', 'tuzlu-su-dusunce-bicimleri-uzerine-bir-teori', '2015-09-05', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Tuzlu Su: Düşünce Biçimleri Üzerine Bir Teori', 'Saltwater: A Theory of Thought Forms', 'Tuzlu Su: Düşünce Biçimleri Üzerine Bir Teori', E'14. İstanbul Bienali için hazırlıklar tüm hızıyla devam ediyor. Carolyn Christov-Bakargiev tarafından TUZLU SU: Düşünce Biçimleri Üzerine Bir Teori başlığıyla bir dizi işbirliği içerisinde şekillenmeye devam eden 14. İstanbul Bienali, 5 Eylül – 1 Kasım 2015 tarihleri arasında şehre dalga dalga yayılacak.\n\nÜcretsiz olarak gezilebilecek 14. İstanbul Bienali, 30’un üzerinde noktada iki ay boyunca düşüncenin alabildiği sayısız farklı formun özel bir yelpazesiyle izleyicilere sunulacak. Bienalde, 60’ın üzerinde sanatçının yanı sıra aralarında denizbilimci, hikâye anlatıcısı, matematikçi ve nörobilimcilerin de bulunduğu diğer katılımcılar, kolektif ve zamansız bir ortak düşünme deneyinde buluşacaklar. Bienalde, düşüncenin alabileceği formlar matematikle, fenle, bitkilerle ve sanatla içiçe araştırılacak. Bienal kapsamında aynı zamanda paneller ve okuma günleri gibi etkinliklerin olduğu kamusal program ile film programı da düzenlenecek.\n\nAyrıntılı bilgi için: http://bienal.iksv.org/tr', E'The 14th Istanbul Biennial SALTWATER: A Theory of Thought Forms, drafted by Carolyn Christov-Bakargiev, will open to the public from 5 September to 1 November 2015 in over 30 venues on the European and Asian sides of the Bosphorus, from the Black Sea to the Sea of Marmara, from Beyoğlu to Büyükada, from Rumelifeneri to the old city and from Şişli to Kadıköy.\n\nFor detailed information: http://bienal.iksv.org/en', '', '/img/2023/05/11885683_918766864861668_6727408640920771183_o-1024x379.jpg', ARRAY['/img/2023/05/11885683_918766864861668_6727408640920771183_o-1024x379.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000005', 'gunler', '2017-04-08', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Günler', 'Days', 'Günler', E'Ahmet Doğu İpek’in İstanbul’daki ikinci kişisel sergisi “Günler”, Galata Rum Okulu’nda gerçekleşiyor. Binanın birinci ve ikinci katlarına yayılan sergi, İpek’in son 10 ayda ürettiği yapıtların yanı sıra 2015’e tarihlenen eserlerini de barındırıyor.\n\nSerginin birinci katında yer alan yerleştirme, Galata Rum Okulu’nun yerleşkesi olan binanın tarihsel, mimari ve işlevsel hafızasına odaklanıyor. Yaklaşık 140 m²’lik bir alana yayılan bu çalışma, mekanın zemin ve duvarlarının mimari bir müdahale ile yeniden şekillendirilmesinden oluşuyor. Simgesel bir mekan tasviri olan yerleştirme; eğim, kütle, ağırlık gibi somut verilerin yanı sıra hakikat, algı, inkar gibi olgulara da işaret ediyor.\n\nSerginin hem omurgasını oluşturan hem de ona ismini veren “Günler” serisi, 200’den fazla suluboya eserden meydana geliyor. 2016 Temmuz ayının sonlarında başlayan ve 2017 Mart ayına kadar devam eden bir süreçte her gün bir resmin eklenmesiyle büyüyen ve her bir resmin üretildiği günün hafızasını taşıdığı bu siyah soyut seriden yaklaşık 120 parça sergileniyor.\n\nBir anlamda “Günler”in evrildiği nokta olarak ortaya çıkan “Yıldızlar” adlı çalışma ise siyah bir kağıt yüzeye atılmış çentiklerden oluşuyor. Çocuksu bir arayışla ışığın izini süren ve performatif bir sürecin sonunda ortaya çıkan resim, sergide tam olarak “Günler”in bittiği yerde karşımıza çıkıyor.\n\nYine bu sergi için üretilen “Repair” serisi ise kendiliğinden oluşan doğal formların algoritmasını anlama ve bunları taklit etme çabası üzerine kurulu. Çatlamış ve dağılmaya yüz tutmuş kaya kütlelerini küçük bir müdahaleyle iyileştirmek, parçalarını bir arada tutmak, onları simgesel olarak tamir etmek ve işlevsel olarak hiçbir yararlılığı olmayan bir şeye anlam yüklemek gibi fikirler etrafında gezinen bu seriden üç parça sergide yer alıyor.\n\nBirçoğu izleyiciyle ilk kez buluşacak bu yapıtların yanı sıra, sanatçının önceki yıllarda ürettiği “Black Water Records”, “İkinci Hasat” ve “Construction Regime” serilerine ait daha önce sergilenmemiş işlerini, bir heykel yerleştirmesini de görmek mümkün olacak.\n\nSergi Tasarımı: Nevzat Sayın Afiş Tasarımı : Okay Karadayılar', E'Ahmet Doğu Ipek’s second solo show in Istanbul, “Days” takes place in Galata Greek School. Spread on the first and second floors of the venue, the exhibition includes works Ipek produced in the last 10 months, as well as works dated to 2015.\n\nThe installation on the first floor of the venue focuses on the historical, architectural and functional memory of the building of the Galata Greek School. Spreading over an area of approximately 140 m², this installation is based on reshaping the floor and walls with an architectural intervention. This work, which is a symbolic description of the space, points to facts like slope, mass, weight as well as phenomena such as truth, perception, denial.\n\nThe “Days” series, composed of more than 200 watercolor works, each symbolizing the memory of the day it was produced, not only constitutes the spine of the exhibition but also gives its name to it. Started in late July 2016 and continuing through March 2017, approximately 120 pieces of this black abstract series are included in the show.\n\n“Stars”, which emerged as the point where “Days” evolved, consists of notches thrown on a black paper surface. Result of a performative process, this painting with a childish quest for the light, meets the viewer at the edge of the installation carrying “Days”.\n\nThe “Repair” series produced for this exhibition is based on an effort to understand and imitate the algorithm of natural forms. There are three premiere exhibits that circumnavigate ideas such as repairing cracked and disintegrated rock masses with a small intervention, keeping their pieces together, symbolically repairing them, and making sense of something that is not functionally useful.\n\nIn addition to these works, many of which will be exhibited for the first time, unseen works from previous series “Black Water Records”, “Second Harvest” and “Construction Regime” and a sculptural installation can be seen in the show.\n\nExhibition Design: Nevzat Sayın Exhibition Poster Design: Okay Karadayılar', '', '/img/2023/05/17757323_1830470536978363_6364641190788308089_n.jpg', ARRAY['/img/2023/05/17757323_1830470536978363_6364641190788308089_n.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000006', 'bunlar-fabl-degil-cocuklar', '2017-03-04', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Bunlar Fabl Değil Çocuklar', 'These are not Fables, Children', 'Bunlar Fabl Değil Çocuklar', E'Galata Rum Okulu, 4 Mart- 1 Nisan 2017 tarihleri arasında Ekin Saçlıoğlu’nun 8. Kişisel sergisine ev sahipliği yapıyor.\n\nSaçlıoğlu’nun ‘Bunlar Fabl Değil Çocuklar’ adlı sergisi milyonlarca yıl dünyada yaşamış ancak günümüzde soyu tükenmiş ya da tükenmeye yüz tutmuş canlılara, nesli tükendi zannedilse de halen varoluş mücadelesi veren hayvan türlerine ve yaşayan fosil bitkiler gibi daha nicelerinin hikayelerine yer veriyor.\n\nDesenlerin, resimlerin, heykellerin, bitkilerin, yosunların ve çeşitli yerleştirmelerin yer aldığı sergide, Saçlıoğlu, Galata Rum Okulu’nun taşıdığı geçmişe referansla, çok sayıda çocuğun belleğinde yer etmiş bu mekânı, açık bir kitaba dönüştürüyor, bilinen ve bilinmeyen kayıpların peşine düşüyor, izleyiciyi yaşayan bir fablın içine girmeye davet ediyor.\n\nSanatçı, gerçek hikâyelerden yola çıktığı anlatılarında, tarihten günümüze doğa – insan ilişkisini, varoluş ve yok oluş kavramlarını nesli tükenmekte olan türler üzerinden konu edinmekte. İnsanoğlunun, kendisine karşı bir tehlike olarak gördüğü yabanıl hayatı, kontrol altına alma arzusu ile yok edici bir güç gösterisine dönüşen, öldürülmüş hayvanlarla fotoğraf çektirme merakı, Saçlıoğlu’nun resim ve desenlerine esin kaynağı oluyor. Soyu tükendiği sanılan Anadolu\n\nLeoparından, sayıca oldukça azalmış Anadolu Vaşağına, farklı zaman dilimlerinden gelen ancak benzer geçmişe sahip türler karşımıza çıkmakta.\n\nSoyunun tek örneği olarak 2012’de ölen ‘Yalnız George’ isimli kaplumbağanın birebir ölçülerde yapılmış kabuk replikası, sergide ‘yok olmaya’, ‘yuvayı terk etmeye’ dair bir metafor olarak düşünülebilir.\n\n1800 yıllık bir antik kabartmada betimlenen Anadolu leoparı, sanatçının bir heykelinin esin kaynağı olurken sergideki bir başka çalışma, dünyada sadece üç tane kalmış olan Beyaz Kuzey Gergedanını konu alıyor. Gergedanlar, portreleri ile birer insan gibi kişiselleşiyorlar.\n\n‘Bunlar Fabl Değil Çocuklar’ okulun sınıflarında artık yer almayan çocuklara ve izleyicilere bu görsel hikâyelerin birer fabl olmadığını söylese de, aslında bütün bu anlatıların metaforlar ve alegoriler üzerine kurulu olduğunun ve bazen, kimi gerçeklikleri anlatabilmek için alegori ve metaforlara başka zamanlardan daha çok ihtiyaç duyduğumuzun altını çizmekte.\n\nEvet bunlar fabl değiller, ancak hikayelerimiz de sadece hayvanlara ait değil…', E'From March 4 to April 1 2017, Galata Greek School will be hosting Ekin Saçlıoğlu’s 8th solo exhibition.\n\nSaçlıoğlu’s exhibition titled ‘These Are Not Fables, Children’ features currently extinct species that had inhabited the earth for millions of years, animals believed to have remained extinct but still struggling to exist and the stories of many others including living fossil plants.\n\nWith the exhibition featuring drawings, paintings, sculptures, plants, algae and various installations, Saçlıoğlu transforms the Galata Greek School into an open book that has a remarkable place in the memory of the children, by referencing its past, chasing both known and unknown losses, and inviting the viewer to enter a living fable.\n\nIn her narratives based on true stories, the artist addresses, through endangered species, the history of nature – human relationship up to the present and the concepts of existence and extinction.\n\nThe humans’ urge to take selfies with slaughtered animals, giving way to a destructive show of strength with the desire to control wildlife as a perceived threat inspires Saçlıoğlu’s paintings. Species coming from different time frames but sharing a similar past, ranging from the Anatolian Leopard long considered extinct to the Anatolian Lynx with a very limited population appear before us.\n\nThe 1/1 scale replica of the shell belonging to ‘Lonely George’, a tortoise that died in 2012 as the only example of his kind, can be taken as a metaphor about ‘disappearance’ and ‘leaving home’.\n\nWhile the Anatolian leopard depicted in an 1800-year-old ancient relief inspires one of the artist’s sculptures, another work in the exhibition refers to the Northern White Rhinoceros, of whom only three are left in the world. The rhinos’ portraits individualize them as human beings.\n\n‘These Are Not Fables, Children’ may tell to the absent students of the school and the viewers that these visual stories are not fables, but it also underlines the fact that all these narratives are based on certain metaphors and allegories we occasionally need more often than in other times to express certain realities.\n\nThese are not fables indeed, but the stories do not belong solely to animals either…', '', '/img/2023/05/16716140_1757819947576756_8688807825612590494_o-1024x723.jpg', ARRAY['/img/2023/05/16716140_1757819947576756_8688807825612590494_o-1024x723.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000007', 'utopia', '2017-05-26', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Utopia', 'Utopia', 'Utopia', E'“Algılanan ve gerçek” kavramının resim hali…\n\nGalata Rum Okulu, 26 Mayıs 2017’den itibaren Kirkor Sahakoğlu’nun “UTOPIA” projesine ev sahipliği yapacak. Sahakoğlu uzun yıllardır hazırlandığı bu sergide Adorno’nun “Hakikatin yalan, yalanın da hakikat gibi göründüğü bir dönemeçteyiz şimdi.” özdeyişinden yola çıkmış. Sanatçı, özellikle son elli yılda, sahicilikten uzak yaşamlarımızın bizleri adeta bir illüzyon sahnesine hapsettiğini, bu tutulmadan uyandıktan sonra ise bir daha asla eskiye geri dönemeyecek oluşumuzu anlatıyor. Kendisi bu distopiadan kaçıp, karşı kıyılarda bir ütopya arayışına girerek çözüme ulaşmaya çalışıyor. Bütün bunları yaparken öz yaşamından kesitlere gidiyor. Gerçek bir mekanın içerisinde bulunan birden fazla zaman ve uzamı vurgulayan Foucault’un “Heterotopya”sının bir ucu yaşamını şekillendiren buradaki sokaklara, diğer ucu ise karşı kıyılara uzanıyor. Yarattığı bu ütopyada başka bireyleri beslemeye, insanlarla paylaşmaya, denize, Zorba’ya, nedensiz güvenmeye, toleransla pişmanlık duymamaya, sevgiye, Yannis Ritsos’a, Azra Erhat’a, Heredot’a sıkça rastlıyor.\n\nİstanbul doğumlu olan Kirkor Sahakoğlu, Getronagan Lisesi’nin ardından Devlet Tatbiki Güzel Sanatlar Yüksek Okulu Reklam Grafiği Bölümü’nden mezun oldu. Daha sonra Milano’da Istituto Europeo Di Design’da master’ını tamamladı. Domus Academy’de bir süre eğitim aldı ve atölyelere katıldı. 1985 yılından itibaren Türkiye’nin önde gelen reklam ajanslarında sanat yönetmenliği ve yaratıcı yönetmenlik yaptı. Ardından kendi ajansını kurdu. Markalaşma sürecinde pek çok kuruma ve ürüne destek verdi. Reklamcılığı süresince çok sayıda Kristal Elma ödülü kazandı. 2010 yılından bu yana serbest çalışan, ajanslara ve kuruluşlara danışmanlık yapan Sahakoğlu, Marmara Üniversitesi Güzel Sanatlar Fakültesi Grafik Sanatlar Bölümü’nde de ders veriyor. Çeşitli üniversitelerde seminerler ve atölyeler düzenliyor. Kirkor Sahakoğlu 2014 yılında Tütün Deposu’nda “Dildilian Kardeşlerin objektifinden Bir Ermeni Ailesinin Yitik Geçmişine Tanıklıklar 1872-1923” adlı serginin küratörlüğünü üstlendi. Çeşitli sergilerde çalışmaları yer alan sanatçı, 2015 yılında Tütün Deposu’nda “EKSİK” isimli ilk kişisel sergisini açtı.', E'Illustrating the concept of “Perceived and Reality”\n\nGalata Rum Okulu is going to host Kirkor Sahakoglu’s “UTOPIA” exhibition opening on 26th of May 2017. Sahakoglu has been working on this exhibition for a long time and influenced by Adorno’s quote “It has come to the point that lies sound like truth, and truth like lies.”. The artist explains how our lives drifting away from reality confined us into an illusionary state especially in the last fifty years and indicates even though we wake up from this trance we will never be able to get back to it. He revisits fragments of his personal past when he sets out to find an utopia across the shore while trying to escape from this distopia. With references to Foucault’s “Heterotopia” which explains multiple times and dimensions coexisting simultaneously in one physical place, his work expands from the streets in İstanbul that gave direction to his life reaching across the shore. He comes across feeding others, sharing with people, the sea, Zorba, trusting without reason, tolerance without regret, love, Yiannis Ritsos, Azra Erhat, and Heredotus in the utopia he created.\n\nBorn in Istanbul, Kirkor Sahakoglu studied at the Getronagan High School, after which he graduated from the School of National Applied Fine Arts Advertising Graphics Department. Later he received his master’s degree at Istituto Europeo Di Design in Milan. He also studied at Domus Academy and participated in workshops. As of 1985, Sahakoglu worked as art director and creative director in prominent advertising agencies of Turkey, and later founded his own agency. He assisted numerous institutions and products in their branding processes. Recipient of innumerable Crystal Apple awards of the Association of Advertising Agencies, since 2010 Sahakoglu has been working freelance as a consultant for agencies and organizations, as well as teaching undergraduate and graduate students at Marmara University Faculty of Fine Arts. He also organizes seminars and workshops in various universities. Kirkor Sahakoglu curated “Bearing Witness to the Lost History of an Armenian Family Through the Lens of the Dildilian Brothers (1872-1923)” exhibition at Tütün Deposu in 2014. After collaborating in various exhibitions over the years, he opened his first solo exhibiton “Absent” at Tütün Deposu in 2015.', '', '/img/2023/05/18449553_1890389540986462_5832172735639054560_o-1024x602.jpg', ARRAY['/img/2023/05/18449553_1890389540986462_5832172735639054560_o-1024x602.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000008', 've-sadece-taslar-kaldi', '2017-05-26', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Ve Sadece Taşlar Kaldı', 'Ve Sadece Taşlar Kaldı', 'Ἒμειναν μόνο οἱ πέτρες.', E'“Ve Sadece Taşlar Kaldı” 20.yüzyıl Yunan şiirinin büyük ustalarından Yannis Ritsos’un Yiaros ve Leros adalarındaki sürgün dönemi ve sonrasında yaşadığı Samos’ta resmettiği taşlarından küçük bir seçkiyi Galata Rum Okulu’nun Açık Okul Kütüphanesi’nde izleyici ile buluşturuyor.\n\nKütüphanede sergilenen üç taş, şairin şiirsel anlatılarında yer alan kişisel ve politik yaşamından yola çıkarak değindiği toplumsal trajediler, sürgünler ve yokluk hissi ile olan mücadelesinin aksine, yaşamın özünü ve varoluşun köklerini hissetmeye davet ediyor. Ritsos, betimlemeleri ile, geçmişi şimdi ile bağlarken, insanlık tarihine tanıklık eden yeryüzünün değişmez ve zamanlar ötesi aktörleri olan taşların fısıldakılarına kulak vermemizi ister. Mürekkebinin izlediği her bir girinti bu sessiz nesnelere heykelsi bir nitelik vererek yeryüzünün soğukluğu yerine var oluşun yaşamsal ve sonsuz enerjisini aktarır. İnsanlık tarihini sonsuz bir döngü içerisinde dönen bir küre olarak tahayyül eden Ritsos’un taşları da yaşamsal mücadelenin ve var oluşun sonsuz döngüsünü yansıtırlar.\n\n26 Mayıs – 24 Haziran 2017 tarihleri arasında Galata Rum Okulu’nun dördüncü katında yer alan Açık Okul Kütüphanesinde izleyici ile buluşacak olan ‘’Ve Sadece Taşlar Kaldı’’ aynı zamandan bir seri okuma etkinliğine de ev sahipliği yapacak.\n\nSanatçının taşlarını göndererek sergiye verdiği destek ve katkıdan dolayı Galata Rum Okulu olarak kızı Eri Ritsos’a sonsuz teşekkürlerimizi sunarız.', '', E'Ένα μικρό δείγμα από τις πέτρες που ζωγράφισε κατά την περίοδο εξορίας του στην Γυάρο και στην Λέρο ένας από τους κορυφαίους Έλληνας ποιητές του 20ου αιώνα, ο Γιάννης Ρίτσος, πρόκειται να εκτεθεί στην Ανοικτή Βιβλιοθήκη της Αστικής Σχολής Γαλατά υπό τον τίτλο «Ἒμειναν μόνο οἱ πέτρες.»\n\nΟι τρεις πέτρες που εκτίθενται, σε αντιδιαστολή με την προσωπική και πολιτική τοποθέτηση του ποιητή σχετικά με τις κοινωνικές αδικίες, τις εξορίες και την φτώχια που διαπραγματεύονται τα ποιήματά του, καλούν τους επισκέπτες να αισθανθούν την ουσία της ζωής και τις ρίζες της ύπαρξης του ανθρώπου. Ο Ρίτσος με τις απεικονίσεις του συνδέει το παλιό με το καινούριο και καλεί το κοινό να αφουγκραστεί τον ψίθυρο της πέτρας, ενός υλικού που υπήρξε ο διαχρονικός και αναλλοίωτος μάρτυρας της ιστορίας του ανθρώπου πάνω στην γη. Η κάθε γραμμή που ακολουθεί το μελάνι του, προσδίδει σε αυτό το άψυχο υλικό μια ανάγλυφη πλαστικότητα μεταφέροντας την ατελείωτη ενέργεια της δημιουργίας και της ζωτικότητας. Οι πέτρες αυτές του Ρίτσου, οι οποίες παρουσιάζουν την ιστορία του ανθρώπου ως μία σφαίρα που στροβιλίζεται σε μια αέναη περιστροφή, αντανακλούν την ασταμάτητη περιστροφή του αγώνα της ζωής και της ύπαρξης.\n\nΤην έκθεση «Ἒμειναν μόνο οἱ πέτρες» που θα λάβει χώρα στην Ανοιχτή Βιβλιοθήκη του τετάρτου ορόφου της Αστικής Σχολής Γαλατά, μεταξύ 26 Μαΐου -24 Ιουνίου 2017, θα πλαισιώσουν ταυτόχρονα και αναγνώσεις ποιημάτων του καλλιτέχνη.\n\nΩς Αστική Σχολή Γαλατά θα θέλαμε να ευχαριστήσουμε θερμά την κόρη του ποιητή Έρη Ρίτσου για την υποστήριξη που παρείχε στην εν λόγω έκθεση παραχωρώντας αυτά τα έργων τέχνης του πατέρα της.', '/img/2023/05/18620950_1900772516614831_7813141603893525096_o-1024x723.jpg', ARRAY['/img/2023/05/18620950_1900772516614831_7813141603893525096_o-1024x723.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000009', 'kursuni-sular-nasil-cesur-olunur', '2018-01-20', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Kurşuni Sular: Nasıl Cesur Olunur', 'Leaden Waters: How to Be Brave', 'Kurşuni Sular: Nasıl Cesur Olunur', E'Son yıllarda, çalışmaları müzelerde, sanat galerilerinde ve dünyanın birçok yerinde sokak sanatı olarak duvarlarda sergilenmiş olan Alexopoulou’nun eserleri şimdi de Galata Rum Okulu’nun tarihi atmosferinde yankı bulacak. “Cesur olmak ne anlama gelir?” sorusunun kendine yönelik eleştirel bakışını merkeze alan bu serginin hatlarını kara mürekkep çizimleri, bir adet duvar resmi ve enstalasyon çalışmaları oluşturacaktır. Uyarıcılara doymuş bir dünyada davranışlarımızda nasıl bir yol seçebiliriz? Modern Yunan şairi Andreas Empirikos vakti zamanında “Ve bir hülya anahtarlarıyla açar uzanıp giden ve boyuna büyüyen alemleri, tıpkı fani ve sahte eylemler tarafından sarsılmamış bir yüzeye düşen bir taşın yaydığı dalgacıklar gibi” demiştir. Sergideki çalışmalar da, bu hayali yüzeyin ötesinde var olan bir varoluş biçimini keşfetmek için tahayyülün kendisini kullanır ve izleyeni de kurşuni sular üzerinde düşünceye dalmaya davet eder. Atina, Yunanistan’da doğan Olga Alexopoulou Oxford Üniversitesi Ruskin Güzel Sanatlar Fakültesi’nden mezun olmuştur. Şehrin büyüsüne kapıldıktan sonra, on yıldan uzun bir süredir İstanbul’da yaşamaktadır. Eserleri Çin Ningbo, Yunanistan Ulusal Tarih Müzesi ve Bouziani Müzesi gibi yerlerde sergilenmiştir. En son çalışmaları Fransa’da Uluslararası Fransa Duvar Resimleri Bienali’nde (Biennale Internationale d’ Art Mural) sergilenmiştir. 2015 yılında Yunanistan’daki gelmiş geçmiş en büyük duvar resmini tamamlamış ve 2017’de de Londra ve Paris’te çıkan yayınlarda dünyanın en iyi 50 kadın sokak sanatçısından biri olarak addedilmiştir.\n\nSponsorlar: Istanbul Concept', E'Galata Greek School is pleased to present the solo exhibition of Olga Alexopoulou titled “Leaden waters: how to be brave’’ from 20th January to 17th February 2018. In the last years, Alexopoulou whose works have appeared in museums, galleries and as street art on walls around the world will now resonate in the historic context of the Galata Greek School. Black ink drawings, a mural and several installations will make up an exhibition that is a self critical examination of the question: What does it mean to be brave? In a world saturated with stimuli, how can we choose a way to conduct ourselves? The modern Greek poet Andreas Empirikos once wrote: “And the reverie with its keys opens up the horizons, that stretch out and ceaselessly grow, like ripples of a stone that fell on to a surface undisturbed by acts perishable and spurious.” This work uses reverie to discover a way of being beyond the illusory surface and indulges the viewer into a meditation over leaden waters. Olga Alexopoulou, was born in Athens, Greece and is a graduate of the Ruskin School of Art of Oxford University. Over a decade ago, she moved to Istanbul after becoming enchanted by the city. Her works have been exhibited in museums like Ningbo in China, the National History Museum of Greece and the Bouziani Museum. More recently her work was featured in the Biennale Internationale d’ Art Mural of France. In 2015 she completed the largest mural ever painted in Greece, and in 2017 she was included in the 50 best women street artists in the world in publications in London and Paris.\n\nSponsors: Istanbul Concept', '', '/img/2023/05/kursuni-sular.jpg', ARRAY['/img/2023/05/kursuni-sular.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000010', 'imtidad', '2018-01-20', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'İmtidâd', 'İmtidâd', 'İmtidâd', E'Galata Rum Okulu, 20 Ocak – 17 Şubat 2018 tarihleri arasında bir proje ve okuma odası olarak yürüttüğü ve okulun 4.katında yer alan Açık Okul Kütüphanesin’de Lara Ögel’in ‘’İmtidâd ‘’ adlı sergisini ağırlamaktan mutluluk duyar. Geçmişin ve geleceğin harmanlanmış bulanık tonları arasında tanıdık bir an yakalamaya çalışır gibi sayfaları karıştırıyordu parmakları… öyle ki bu arayışı, önündeki bulanık diyarda uzadıkça uzadı … zamansızlık onu sarıp sarmaladı… …ta ki görünmeyen olan kendini görünür kılana kadar…\n\nİşlerinde mekan ve hafıza kavramlarına incelikli bir bakış açısı getiren Lara Ögel, Galata Rum Okulundaki sergisinde bu olgulara mekana özgü bir yerleştirme ile cevap veriyor. Arafta olan veya durmuş olan zaman dilimlerinin izinden giden Ögel, sergide Yahya Kemal’in kültür hayatımıza kazandırdığı ve öğrencisi olan Ahmet Hamdi Tanpınar’ın da ‘‘devam ederek değişmek, değişerek devam etmek’’ olarak tanımladığı bir kavram olan İmtidâd kelimesine odaklanmaktadır. Modernizmin getirdiği değişim ve dönüşüm süreci içerisinde kendi olarak kalabilmeyi de irdeleyen bu tanımı sanatçı, geçmişten bugüne, zamanın devinimiyle kendi kalma yolculuğunu yaşayan Galata Rum Okulu’nun belleğiyle harmanlıyor.\n\nÖgel, mekanın eski aktörleri olan çocukların bıraktığı izleri takip ederek, izleyiciyi bu keşif alanına davet ediyor.', E'Galata Greek School is pleased to present Lara Ögel’s exhibition titled ’İmtidâd ‘ at Open School Library initiated as a reading room and project space.\n\nThrough the blurred shades that blend the past and the future, her fingers were flipping the pages as if to find a familiar moment… such was the search that went on and on amongst the blurry realm ahead of her… timelessness embraced her… … until that which is unseen has revealed itself\n\nLara Ögel whose artworks introduce a refined perspective on space and memory, answers these concepts through a site-aware installation for her show at Galata Greek School. Following the traces left behind from states of uncertainty or suspension, Ögel focuses on the term İmtidâd; brought into our culture by Yahya Kemal and defined by his pupil Ahmet Hamdi Tanpınar as “to evolve as you go on and to go on as you evolve”. The artist harmonizes this definition, which also examines the state of staying true to one’s self in the course of evolution and progress that Modernism imposes, with the memory of Galata Greek School which is going through similar motions.\n\nÖgel is inviting the viewer to a site of exploration, following the clues left behind by the students that are amongst the past actors of the space.', '', '/img/2023/05/imtidad-856x1024.jpg', ARRAY['/img/2023/05/imtidad-856x1024.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000011', 'prosedurel-gerceklik', '2018-01-31', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Prosedürel Gerçeklik', 'Prosedürel Gerçeklik', 'Prosedürel Gerçeklik', E'Galata Rum Okulu , 31 Ocak – 17 Şubat 2018 tarihleri arasında Avusturya Liseliler Vakfı’nın düzenlediği, Ömer Pekin ‘in “ Prosedürel Gerçeklik ” adlı çağdaş sanat sergisini ağırlamaktan mutluluk duyar. Ömer Pekin, dijital ortamda geliştirilmiş mimari kompozisyınları sanatsal boyutta incelemek için kendi geliştirdiği yazılımlar aracılığıyla resimler yaratıyor. Yazılımları sanat ve mimari arasında görsel bir pratik tanımlayarak her seferinde birbirinden farklı formlar yaratmayı amaçlıyor. Bunu yaparken dijital kaynaklara geçici bir maddesellik vererek analog resim yapma teknikleriyle ilişkilerini inceliyor. “Prosedürel Gerçeklik” isimli enstalasyon insan boyutlarında, izleyicilerin etrafında gezinebildiği, neredeyse içine girerek deneyimleyebileceği özgün cam objelerden oluşuyor. Cam objelerin üzerine ikincil bir katman olarak yannsıtılan dijital resimler objelerin ruhu olarak işlev görüyor ve onllarla etkileşime geçiyor. Bu durumda izleyicinin bir resmin içine girmeyi deneyimleyebilmesi ve içine girdiği mekanın bir parçası olduğunu alışılmışın dışında algılayabilmesi amaçlanıyor. Bu proje hem materyal hem de mekan kavramını algı üzerinden yeniden tanımlarken, mimarlık ile sanatın birbirlerini ayıran sınırlarını zorluyor.\n\nÖmer Pekin 1991 İstanbul’da doğdu. Eğitimini Avusturya’daki Akademie der bildenen Künste Wien’de gerçekleştiren Pekin, yüksek lisansını SCI-Arc, Southern California Institute of Architecture’da tamamlamıştır. Ömer Pekin dijital ortamda geliştirilmiş mimari kompozisyonları sanatsal boyutta incelemek için kendi geliştirdiği yazılımlar aracılığıyla resimler yaratıyor. Yazılımları sanat ve mimari arasında görsel bir pratik tanımlayarak her seferinde birbirinden farklı formlar yaratmayı amaçlıyor. Bunu yaparken, Ömer dijital kaynaklara geçici bir maddesellik vererek analog resim yapma teknikleriyle ilişkilerini inceliyor. Amacı fiziksel nitelikle dijital sonucun arasındaki ilişkiyi sorgulayarak, her biri form ve kalıp açısından ayrı estetikleri olan farklı gerçeklikler yaratmaktır. Sanatçı İstanbul’da yaşıyor ve çalışıyor.', '', '', '/img/2023/05/prosedurel-gerceklik-724x1024.jpg', ARRAY['/img/2023/05/prosedurel-gerceklik-724x1024.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000012', 'ilk-raunt', '2018-03-06', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'İlk Raunt', 'İlk Raunt', 'İlk Raunt', E'Çarmıklı Koleksiyonu’ndan kapsamlı bir seçki sunan “İlk Raunt”, sanatseverlerle yaşanacak heyecanlı bir karşılaşmanın zilini çalıyor. Galata Rum Okulu’nda 6 Mart – 12 Mayıs tarihleri arasında izleyiciyle buluşacak olan sergi; pentürden enstalasyona, fotoğraftan videoya kadar farklı disiplinlerdeki çalışmalar üzerinden yerel çağdaş sanat pratiğinin son dönemine dair çok katmanlı bir okuma vadediyor.\n\nToplumsal duyarlılık alanlarından beslenen, yaratıcısının bireysel eğiliminin özgün ve özgürlüğü mertebesinde vücut bulmuş 100’e yakın yapıtın bir araya getirildiği “İlk Raunt”; koleksiyoncu ve koleksiyon kimliğinin ötesinde derinleşen bütünsel söylemini izleyiciyle paylaşıyor. Çeşitli medyumlardan işlerin ortaya konduğu seçki; yıllar boyu titizlikle örülmüş bir fikir ve arayış serüvenini gözler önüne seriyor. Koleksiyoncunun; doğrudan üzerine aldığı küratoryal sorumluluk ile kendi gözünden hikâyeleştirdiği bu serüven, her katta ve odada yepyeni diyalog ve açılımların sınırını zorluyor. Türkiye’de kavramsal sanatın mihenk taşı sayılabilecek isimler ile sanat piyasasının ışıklarından uzakta kalmış aykırı, yenilikçi ve derdini üretimine dökmüş genç yeteneklerin tek bir çatı altında toplandığı sergi, halen güncelliğini koruyan konulara dair keskin ve ortak bir eleştirel bakışın ürünü olarak öne çıkıyor.\n\nToplumsal travmalarımıza her gün bir yenisinin eklendiği bu yoğun gündemde; bireysel varoluş mücadelesi, cinsiyet ve kimlik politikaları, aile içi şiddet, erk iktidarı, kadın hakları, namus, geleneksel-çağdaş ikilemi gibi meselelerde sözünü sakınmayan 70’ten fazla sanatçının yapıtları, serginin baş rol oyuncuları olarak taçlandırılıyor.\n\n“İlk Raunt”, vicdani sorumluluk sınırlarını yeniden belirlemeye giden kapıları açabilmek adına; tüm cesaretiyle, birlikte ringe çıkan sanatçı ve koleksiyoncunun güç birliğine vurgu yapıyor. Sergi süresince; panel, tematik tur ve performans gibi etkinliklerle mekâna dinamizm katacak olan seçki; sanatseverleri, bu maça katılmaya davet ediyor.', '', '', '/img/2023/05/27797990_1991502271103134_8706882275638414505_o-1024x379.jpg', ARRAY['/img/2023/05/27797990_1991502271103134_8706882275638414505_o-1024x379.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000013', 'sinir', '2018-05-18', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Sınır', 'Border', 'Sınır', 'C24 galerinin düzenlediği, İrfan Önürmen’in kişisel sergisi ”SINIR ” 18 Mayıs – 30 Haziran Galata Rum Okulu’nun birinci ve ikinci katında görülebilir.', 'Irfan Önürmen’s solo show “ Border” can be seen at the 1st and 2nd floor of Galata Rum Okulu from May 18 – June 30, 2018.', '', '/img/2023/05/32469109_2418643908161020_1356044075836375040_n.jpg', ARRAY['/img/2023/05/32469109_2418643908161020_1356044075836375040_n.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000014', 'olume-ne-iyi-gelir', '2018-05-23', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Ölüme Ne İyi Gelir?', 'What Helps with Death?', 'Ölüme Ne İyi Gelir?', 'Karavil Contemporary tarafından düzenlenen Alp Sime & İhsan Oturmak’ın sergisi ”Ölüme ne iyi gelir?” 23 Mayıs – 23 Haziran 2018 tarhileri arasında Galata Rum Okulu’nun üçüncü katında görülebilir.', 'Alp Sime & İhsan Oturmak’s exhibition ”What Helps with Death?” can be seen at the third floor of Galata Rum Okulu from May 23 – June 23, 2018.', '', '/img/2023/05/olume-ne-iyi-gelir-852x1024.jpg', ARRAY['/img/2023/05/olume-ne-iyi-gelir-852x1024.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000015', 'koro', '2018-09-05', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'KORO', 'KORO', 'KORO', E'Galata Rum Okulu, 5 Eylül’den itibaren Gülçin Aksoy ’un “KORO” sergisine ev sahipliği yapıyor.\n\nSeyir korosu, sanatçılar korosu, ağaç korosu, havuç -tokmak- kadeh korosu, ağlama korosu, koroların korosu, koro şefleri korosu, kendi kendinin korosu, koristler korosu, korosal faaliyetler, korosu kadar konuşanlar, korosu olup derdi olanlar, korolara gelenler, koro tatlı koro- ballı koro, karlı koro, korodan koroya, korosuzlar… Korolar alemi…\n\nGülçin Aksoy , sıradan ve gündelik görünen mekan, nesne, durum ve olaylara kratolojik bir araştırma sahası olarak yaklaşıyor. İtaat-iktidar ilişkilerinin özneleri/mekanları/olguları nasıl ürettiğine, yarattığı hasar ve travmalara dolaysız ve yalın bir gözlem öneriyor. Sanatçı, otobiyografik çerçevede hemen yanı başındaki kişiler ve mekânlardan yola çıkarak dünün-bugünün kurumsal “norm”larını aile, cinsiyet, ahlak, toplumsal sınıf, devlet, resmi ideolojiye yönelik göstergeler aracılığıyla irdeliyor. “KORO” başlığındaki sergi ile Gülçin Aksoy, bireysel çevreden kamusal alana bellek hasarı/kaybı ve deformasyonuna, gündelik yaşamdan tarihe, kişisel ilişkilerden toplumsal uzlaşımlara, açık ya da örtük olan iktidar mekanizmalarını taktiksel ve ironik bir dille görselleştiriyor. Melodili ya da ritimli sözleri söyleyen topluluk olarak “koro” kimi zaman pasif ve direktifle harekete geçen kimi zaman gözleyen, yorumlayan, değerlendiren katılımcı refleksiyle tam da toplumsal yaşam dinamiklerinin bir metaforu haline geliyor. Gülçin Aksoy’a göre “insan kendi kendine sorduğu soruları, kendi içindeki yeni potansiyelleri ezmeye başladığında yine iktidar mekanizmalarının devreye girdiğinin bilinciyle, kullanılan malzeme ya da yöntemin ya da belli biçimsel yönelimlerin her defasında yıkıma uğratıldığı, daha deneysel ve aslında çok daha içsel bir temelde kuruluyor.”\n\n“KORO” , Derya Yücel ’in küratöryal işbirliğiyle videodan yerleştirmeye, dokuma/halıdan fotoğraf ve performansa Gülçin Aksoy ’un çeşitli mecralarda ürettiği son dönem çalışmalarından bir seçkiyi 5– 30 Eylül 2018 tarihleri arasında Galata Rum Okulu ’nda izleyici ile paylaşıyor.\n\n1990’ların başından itibaren aktif sanat üretimine devam eden Gülçin Aksoy, bireysel üretiminin yanında kollektif bir çok sanatsal eylem içersinde yer aldı. İlk kişisel sergisini 1991 yılında gerçekleştiren sanatçı, 1993 yılından itibaren Mimar Sinan Güzel Sanatlar Üniversitesi, Güzel Sanatlar Fakültesi, Resim Bölümü Öğretim üyesi olarak çalışmakta. ‘Halı Atölyesi’ni yürütmekte olan Gülçin Aksoy, sanatsal üretimini eğitimci kimliğinden ayırmadan, birlikte öğrenmek ve üretmek üzerine konumluyor. Öğrencileri ile birlikte gerçekleştirdiği son projesi ‘Öğrenme süreci’, (Learning Project) ise halen İtalya nın Boozen kentinde yer alan ‘Academiae Youth Art Bienale’de sergileniyor. 2014 yılında Depo’da gerçekleştirdiği kişisel sergisi ‘Duble Hikaye’ sanatçının yaşamına dair kurgusal düzenlemeler içerirken 2017 yılında Zilberman Galeri de ‘A’ ve Perşembe Pazarı’nda ‘Sevdiğim Aile Mezarlığı’ adlı eş zamanlı iki kişisel sergisi toplumsal iktidar yapılarını dolayımlı olarak mercek altına alıyordu. 2018 yılında DAAD sanatçı ve akademisyen bursu ile Berlin’de bulunan sanatçının katıldığı bazı etkinlikler arasında ‘Mobilising Memory,’ Viyana (2015), 4. Çanakkale Bienali (2014), ‘Trading Station’ Liverpool (2012), 1. Klohausen Bienali Münih (2012), ‘City Scale’ Münih- İstanbul (2010), ‘I. Istanbul Yaya sergileri (2002), ‘60 yıl 60 sanatçı’ (2002) gibi sergiler bulunmakta.', '', '', '/img/2023/05/koro-1024x683.jpg', ARRAY['/img/2023/05/koro-1024x683.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000016', 'cok-kalpli-varlik', '2018-09-05', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Çok Kalpli Varlık', 'Çok Kalpli Varlık', 'Çok Kalpli Varlık', E'Galata Rum Okulu 5 Eylül-30 Eylül tarihleri arasında Necla Rüzgar ‘ın “Çok Kalpli Varlık” larına ev sahipliği yapıyor. Sanatçı, “Çok Kalpli Varlık”ı, farklı tür ve özelliklere sahip canlıların, durumların ya da düşünme biçimlerinin iç içe geçmesi olarak tanımlıyor. Deniz Artun küratörlüğünde kurulan sergi, bu varlıkların, canavarların, çirkinliklerin ve kötülüklerin karşısına çıktığı masalsı bir mücadeleden sahneleri andırıyor.\n\nRüzgar’ın son dönemde üzerinde çalıştığı yılan saçlı kadın portrelerinin merkezde olduğu sergi, sanatçının bu eserlerde tercih ettiği mürekkebin akışkanlığının da yardımıyla, Medusaların başlarını birbirine doluyor. Öte yandan, kadınların saçlarının arasından daima görünen gözleri, efsanenin köklerinin de referansı ile, vicdanımızın katılığını yokluyor. Yeni dönem işler arasında, ayrıca, bakışı ile kesinlikle karşılaşamadığımız, yüzlerini bütünüyle örten kadınların yağlı boyaları da dikkat çekiyor. Necla Rüzgar aynı zamanda, uykuda kadınlarının gözlerini de, yanlarında uzanan ve bedenlerine karışan hayvanların gözleri ile birlikte kapatıp, Medusa bakışının karşısına yerleştiriyor.\n\n“Çok Kalpli Varlık”, yeni eserler arasında, Rüzgar’ın daha eski tarihli bilinen ve bilinmeyen pek çok eserini de yerleştiriyor. Böylece, tıpkı sergideki varlıklar gibi, eski ve yeni eserlerin de birbirlerine nasıl dolandıkları izleyicinin dikkatini çekiyor. Boyası henüz kurumuş bir eserin temeli, sanatçının çok erken yıllarında atılmış olabiliyor. Ya da belirli bir bağlamda izlemeye alışmış olduğumuz bir tanıdık eser, başkaca bir bağlama oturup bütünüyle yenilenebiliyor.', '', '', '/img/2023/05/cok-kalpli-varlik.jpg', ARRAY['/img/2023/05/cok-kalpli-varlik.jpg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000017', 'oldugu-gibi', '2018-09-05', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Olduğu Gibi', 'Olduğu Gibi', 'Olduğu Gibi', E'“Olduğu Gibi” yaşadığım yıllar boyunca, bulunduğum mekanların hafızasını toplayan bir külliyata benzeyen, her gün fark etmeden kaydettiğimiz anların ve imgelerin, başka mekanlar ve başka zamanlarda bulduğum karşılıklarını bir araya getirdiğim, yeni hikayeler ürettiğim bir seri.\n\nAni Çelik Arevyan’ın kişisel sergisi “Olduğu Gibi”, sanatçının yaklaşık otuz yıl boyunca dünyanın farklı bölgelerinde tarihsel, zamansal ve mekânsal boyutları gözetmeksizin çektiği fotoğrafların bazen ışık, bazen de formları arasında keşfettiği geçişleri, ikili bir düzenlemeyle Galata Rum Okulu’nda izleyiciyle buluşturuyor.\n\nİşlerini yaratma sürecini fotoğraf çekmekten çok fotoğraf yapmak olarak tanımlayan sanatçı bu seride her gün fark etmeden kaydettiği anları, imgeleri, biçimleri birbiriyle ilişkilendirerek ikili hikâyeler yaratıyor. Bu imajlar, spekülatif birer film sahnesi gibi göz önüne serildikçe, zihinde parıldayan görüntü yığınlarına benzeyen ucu açık bir film şeridini andırıyor. Serideki imaj bolluğu, sanatçının tıpkı evrende insanı da benzettiği piksel parçalarını çağrıştırıyor; her ikili imaj sanki kavramsal bir bütünün pikselleşmiş parçalarına dönüşüyor. Bu seri oluşurken 95,000’in üzerinde fotoğrafı kapsayan arşivine geri dönen Arevyan, fotoğrafların kurgulanmadığını, belli bir hikâyeyi takip etmediğini ancak zaman içerisinde zihninde birleştiğini vurguluyor; “Bu seride görüntüleri stüdyomda sahnelemek yerine, yaşamın sahnelediği görüntüleri fotoğrafladım. Oluşturduğum ikili imajlar, yaşadığım, gezip gördüğüm dünyadan seçtiğim kareler, hiçbir didaktik kaygı gözetmeksizin, anlamı bende saklı olan karşılaşmalardan oluştu. Bu karşılaşmalar bana iki imajı özgürce akort ederek yeni görsel deneyimler yaratabileceğim bir alan sundu. Seriye devam ederken ortaya çıkan düşünce alanı, fotoğrafik bilincim ve bir sanatçı olarak gelişimim hakkında bir geri bildirim döngüsü yarattı.”\n\nArevyan, fotoğrafla ilgili çalışmalarında zamanın izlerini takip ettiğini belirterek, bu seriyi kendi fotoğraf pratiği üzerine düşünürken keşfettiği arkeolojik bir araştırmaya benzetiyor. Sanatçı, fotoğrafları zihninin derinliklerinden birbirlerine doğru yönelterek izleyicinin de formların, ışıkların, mekânların arasındakileri keşfedebileceği yeni bir karşılaşma alanı yaratıyor.\n\nHaldun Dostoğlu’nun küratöryal desteği ve Nevzat Sayın’ın sergi mimarisiyle gerçekleşen, geniş bir arşivi hem görsel hem kavramsal ilişkileriyle ele alarak yorumlayan “Olduğu Gibi”, 5 -30 Eylül 2018 tarihleri arasında Galata Rum Okulu’nda izlenebilir.\n\nİşlerimi yaratma sürecini fotoğraf çekmekten çok fotoğraf yapmak diye tanımlıyorum. Fotoğrafı estetik düşünümün bir aracı olarak konumlandırarak izleyiciye, fiziksel gerçekliğe ve hayal gücüne dair kayıp referanslar arasında görsel algının dağılışı üzerine yeniden düşünme olanakları sunmak istiyorum. Fotoğraflarımı zamanın silindiği ancak değişimin tüm çeşitliğiyle gözler önünde olduğu ince bir çizgi üzerinde kurguluyorum.\n\nİstanbul’da yaşayan ve çalışan Ani Çelik Arevyan , fotoğraf çalışmalarına 1985 yılında başlamıştır. Galeri Nev İstanbul tarafından temsil edilen sanatçının kişisel sergilerinden bazıları; “Bu Dünyaya Ait İzler (2014)”, “Sokağa Çıktım (2010)” ve “Yaşam ve Ölüm Arasında (1998)” olup, “Göründüğü Gibi Değil” adlı serisi 2010 yılında İstanbul Modern Sanat Müzesi’nde gösterilmiş, bir diğer kişisel sergisi ise Viyana’da Mekan68’de gerçekleşmiştir. Katıldığı karma sergiler arasında “Kiralık, Satılık” Protocinema, İstanbul (2017), “İstanbul Modern- Bahreyn”, Bahreyn Ulusal Müzesi (2013), “Seni Seviyorum İstanbul/Dostlar”, Üç Horan Kilisesi Naregyan, İstanbul (2011), “2. Barış Kültürü için Uluslararası Forum”, Rodos (2000), “İstanbul Farklı Bakışlar”, Sipa Press Paris (1999) ve “Bodies in Motion”, Gallery Agora New York (1999) sayılabilir. 1990 yılında Kodak Profesyonel Avrupa Ödülleri Türkiye Birinciliği’ni kazanan Arevyan, Fransa’nın Arles kentinde Türkiye’yi temsil etmiştir. 2000 yılında Pamukbank Fotoğraf Ödülü’nü kazanan sanatçının eserlerinin yer aldığı kamusal koleksiyonlar arasında Biblioteque National de France ve İstanbul Modern Sanat Müzesi bulunmaktadır.', '', '', '/img/2023/05/as-is-oldugu-gibi-1024x760.jpeg', ARRAY['/img/2023/05/as-is-oldugu-gibi-1024x760.jpeg']::text[], 'published'),
    ('b2000000-0000-0000-0000-000000000018', 'ucup-gitti-kimin-aklina-gelirdi', '2018-11-20', 'Sanat Sergisi', 'Art Exhibition', 'Έκθεση Τέχνης', 'Uçup Gitti, Kimin Aklına Gelirdi', 'Uçup Gitti, Kimin Aklına Gelirdi', 'Uçup Gitti, Kimin Aklına Gelirdi', E'Galata Rum Okulu, 20 Kasım – 2 Aralık 2018 tarihleri arasında bir proje ve okuma odası olarak yürüttüğü ve okulun 4.katında yer alan Açık Okul Kütüphanesin’de Yeşim Ağaoğlu ‘nun “Uçup Gitti, Kimin Aklına Gelirdi” adlı sergisini ağırlamaktan mutluluk duyar.\n\nİspanyol anatçı Francisco Goya’nın 1799 tarihli ‘’Caprichos’’ ve 1810 – 20 tarihli ‘’Savaşın Felaketleri’’ başlıklı gravür serilerinden esinle yazmış olduğu 21 şiirini Galata Rum Okulu’nun kütüphane odasına taşıyor. Ağaoğlu, 2012 Nisan ayında Suna ve İnan Kıraç Vakfı Pera Müzesinde açılmış olan “Zamanın Tanığı”( Witness of His Time ) sergisinde yer alan Goya’nın eserleri ile kurduğu derin bağın yanı sıra usta sanatçının gravürlerine verdiği isimlerden yola çıkarak öyküsel bir anlatımla ürettiği şiirleri ile Goya’nın zaman dilimi ile kendi belleğini harmanlayarak yepyeni bir anlatı ile izleyici ile buluşuyor.\n\nSanatçının sözleri ile “Uçup Gitti, Kimin Aklına Gelirdi”\n\n‘’80’li yıllarda henüz genç bir üniversite öğrencisiyken büyük ressam ve dünyanın en önemli gravür ustalarından olan Goya’nın (1746-1828) resimlerinden hayli etkilenmiş bu etki ile ismini ‘’Goya‘’ koyduğum bir şiir yazmıştım. Rembrandt, Picasso, Dali, Matisse,vb. gibi ressamların resimlerinden esinlenerek yazmış olduğum başka şiirlerim de oldu.\n\nAncak, bu sergide göreceğiniz şiirler sözünü ettiğim şiirlerden oldukça farklı. Çünkü, bu 21 şiirin tamamını Goya’nın “Kapriçyolar” ( Caprichos- 1799 ) ve “Savaşın Felaketleri” serisindeki (The Disaster of War-1810-1820 ) gravürlerine vermiş olduğu isimleri kullanarak yazdım. Şöyle ki; 2012 Nisan ayında Suna ve İnan Kıraç Vakfı Pera Müzesinde açılmış olan “Zamanın Tanığı”( Witness of His Time ) sergisini gezerken Goya’nın eserlerinin yanısıra özellikle gravürlerine verdiği isimler beni oldukça etkiledi. İsimlerin gelişi güzel verilmiş eser isimlerinden öte, öyküsel, anlatımsal yanları cezbetti beni önce.\n\nBu isimleri kullanarak uzun bir şiir yazma fikri aklıma o zamandan düştü. Ancak, bu fikri kafamda demlendirdim ve nihayet 5 sene sonra uzun bir şiir yazmak yerine bu sergide göreceğiniz 21 şiir ortaya çıktı. Yazarken tek kuralım, gravürlerin isimlerini birer şiir dizesi olarak düşünüp kendimden sözcükler ya da başka dizeler eklememekti. 159 farklı eser ismini (şiir dizesini) dikkate alarak bu şiirleri yazdım. Zaman zaman farklı şiirlerde tekrar eden dizeler de oldu elbet. Bu proje ve Goya, benim için yalnızca bir başlangıç olacak diye düşünüyorum ve umuyorum. Çünkü, çağının tanığı, ama ne yazık ki dünyanın değişmeyen yazgısı nedeniyle de aynı zamanda çağdaşı olan büyük sanatçı Goya ile olan bağımın henüz tamamlanmadığına inanıyorum…’’ Y.A.\n\nİstanbul’da doğdu. İstanbul Üniversitesinde Arkeoloji ve Sanat Tarihi eğitiminin ardından yine aynı üniversitenin İletişim Fakültesin’de Radyo-TV-Sinema bölümünde yüksek lisans yaptı. Özellikle şiir ve çağdaş sanat alanında ürünler veren Yeşim Ağaoğlu, 1996 yılında UPSD derneğinin düzenlediği “Genç Etkinlik II” sergisinde gerçekleştirdiği “şiir enstalasyon” la sanat çalışmalarını göstermeye başladı. O günden bugüne dek ulusal ve uluslararası birçok kişisel ve karma sergiler, bienaller, sanat festivalleri ve çeşitli sanatçı konaklama programlarına burslu olarak katıldı. Yurtiçi ve yurtdışındaki birçok katalog ve sanat kitabında çalışmaları yer almaktadır. Galerilerin yanısıra, çeşitli müzelerde de işleri gösterildi. Sergi yaptığı ülkeler arasında Norveç, Almanya, Avusturya, İtalya, İspanya, Azerbaycan, Gürcistan, Özbekistan, Moskova, Saraybosna, Bulgaristan, Hindistan gibi farklı ülkeler yer almaktadır.\n\nSanatta teknik olarak yalınlıktan, içerik olarak ise zenginlikten yana olup, görsellik ve içeriği eşit olarak önemsiyor. İzleyiciyi de işin içine katan performatif ve katılımcı yerleştirmeler de yapıyor. Kimi zaman ise galerilerin ve sergi mekanlarının dışında, sokaklarda, kamusal alanlarda da çalışmalarını göstermeyi tercih ediyor. Enstalasyonun yanısıra ağırlıklı olarak fotoğraf, sanatçı kitapları ve video alanlarında da üretimlerde bulunuyor.\n\n18 yaşından itibaren çeşitli edebiyat dergilerinde yayımlanmaya başlayan şiirleri, kimi antolojilerde ve ansiklopedilerde yer almakta olup yurt içinde ve dışında yayımlanmış şiir kitapları da bulunmaktadır.\n\nBirçok ulusal ve uluslararası edebiyat ve şiir festivallerine katılan Y.Ağaoğlu’nun şiirleri, başta İngilizce, Almanca, İspanyolca ve Rusça olmak üzere birçok yabancı dile çevrilmiştir.', '', '', '/img/2023/05/ucup-gitti-kimin-aklina-gelirdi-717x1024.jpg', ARRAY['/img/2023/05/ucup-gitti-kimin-aklina-gelirdi-717x1024.jpg']::text[], 'published')
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    event_date = EXCLUDED.event_date,
    type_tr = EXCLUDED.type_tr,
    type_en = EXCLUDED.type_en,
    type_el = EXCLUDED.type_el,
    title_tr = EXCLUDED.title_tr,
    title_en = EXCLUDED.title_en,
    title_el = EXCLUDED.title_el,
    description_tr = EXCLUDED.description_tr,
    description_en = EXCLUDED.description_en,
    description_el = EXCLUDED.description_el,
    cover_image_url = EXCLUDED.cover_image_url,
    thumbnail_images = EXCLUDED.thumbnail_images,
    status = EXCLUDED.status;

NOTIFY pgrst, 'reload schema';
