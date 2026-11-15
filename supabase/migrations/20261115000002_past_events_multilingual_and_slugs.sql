-- ============================================================
-- PAST EVENTS — MULTILINGUAL DESCRIPTIONS & STABILIZED SLUGS (ISS-08)
-- 1. Adds description_en and description_el columns so approved
--    translations can be stored natively in Supabase.
-- 2. Populates deterministic human-readable slugs for the 5
--    events that previously had empty/null slugs, plus curated
--    trilingual descriptions for the 13 curated exhibitions/events.
-- ============================================================

ALTER TABLE public.past_events
    ADD COLUMN IF NOT EXISTS description_en text,
    ADD COLUMN IF NOT EXISTS description_el text;

-- 1. Populate deterministic slugs and curated trilingual descriptions for the 5 records with empty/null slug
UPDATE public.past_events
SET
    slug = 'cagri-sarayin-eksilen-zaman-adli-sergisi',
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Çağdaş sanatçı Çağrı Saray’ın Galata Rum Okulu’nda gerçekleşen “Eksilen Zaman” başlıklı kişisel sergisi; kentsel bellek, mekânsal dönüşüm ve zamanın aşındırdığı kişisel-toplumsal izleri çizim, video ve mekâna özgü yerleştirmeler aracılığıyla izleyiciye sundu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Hosted at the Galata Greek School, contemporary artist Çağrı Saray’s solo exhibition “Diminishing Time” explored urban memory, spatial transformation, and the traces eroded by time through drawings, video works, and site-specific installations.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η ατομική έκθεση του σύγχρονου καλλιτέχνη Çağrı Saray «Μειούμενος Χρόνος» στη Σχολή Γαλατά διερεύνησε την αστική μνήμη, τον χωρικό μετασχηματισμό και τα ίχνη του χρόνου μέσα από σχέδια, βίντεο και εγκαταστάσεις.')
WHERE id = 'd46eb8b7-1e2b-40db-b156-2aa1780f69b3';

UPDATE public.past_events
SET
    slug = 'ceren-oykutun-konstantiniye-ve-ayasofya-defterleri-adli-sergisi',
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Sanatçı Ceren Oykut’un Galata Rum Okulu’nda düzenlenen “Konstantiniye ve Ayasofya Defterleri” sergisi, İstanbul’un tarihsel katmanlarını, gündelik kent yaşamını ve mimari hafızasını incelikli desen ve defter çalışmaları üzerinden görünür kıldı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Presented at the Galata Greek School, artist Ceren Oykut’s exhibition “Sketchbooks of Constantinople and Hagia Sophia” illuminated Istanbul’s historical layers, everyday urban life, and architectural memory through intricate drawings and sketchbooks.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η έκθεση της καλλιτέχνιδας Ceren Oykut «Τετράδια Κωνσταντινουπόλεως και Αγίας Σοφίας» στη Σχολή Γαλατά ανέδειξε τα ιστορικά στρώματα και την αρχιτεκτονική μνήμη της πόλης μέσα από λεπτομερή σχέδια.')
WHERE id = 'f9c5d523-452d-4876-9a4c-e69626593e33';

UPDATE public.past_events
SET
    slug = '2-istanbul-tasarim-bienali-gelecek-artik-eskisi-gibi-degil',
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'İstanbul Kültür Sanat Vakfı (İKSV) tarafından Zoë Ryan küratörlüğünde düzenlenen 2. İstanbul Tasarım Bienali, “Gelecek Artık Eskisi Gibi Değil” başlığı altında ana sergi mekânı olarak Galata Rum Okulu’nda gerçekleşti. Bienal boyunca tarihi okul binasının tüm katları, manifestolar ve tasarım projeleriyle uluslararası bir düşünce laboratuvarına dönüştü.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Organized by the Istanbul Foundation for Culture and Arts (İKSV) and curated by Zoë Ryan, the 2nd Istanbul Design Biennial took place at the Galata Greek School as its primary venue under the theme “The Future Is Not What It Used To Be.”'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Διοργανωμένη από το Ίδρυμα Πολιτισμού και Τεχνών της Κωνσταντινούπολης (İKSV) σε επιμέλεια της Zoë Ryan, η 2η Μπιενάλε Σχεδιασμού της Κωνσταντινούπολης φιλοξενήθηκε στη Σχολή Γαλατά με θέμα «Το Μέλλον Δεν Είναι Πια Όπως Παλιά».')
WHERE id = '3fca592d-f02a-4d04-bbae-6cef46ec430b';

UPDATE public.past_events
SET
    slug = 'galata-rum-okulunda-duzenlenen-ikona-yapim-atolyesi',
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Galata Rum Okulu’nun eğitim ve kültürel miras programları kapsamında gerçekleştirilen İkona Yapım Atölyesi’nde, geleneksel Bizans ikona resim teknikleri, ahşap hazırlığı, doğal pigmentler ve altın varak uygulamaları uygulamalı olarak katılımcılarla paylaşıldı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Held as part of the cultural heritage and educational programs at the Galata Greek School, the Icon Making Workshop introduced participants to traditional Byzantine iconography techniques, wooden panel preparation, natural pigments, and gold leaf application.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο των εκπαιδευτικών και πολιτιστικών προγραμμάτων της Σχολής Γαλατά, το Εργαστήριο Αγιογραφίας παρουσίασε τις παραδοκικές βυζαντινές τεχνικές αγιογραφίας, την προετοιμασία ξύλου, τις φυσικές χρωστικές και το φύλλο χρυσού.')
WHERE id = '35031159-3d9a-43c2-8d26-5b5a2585f712';

UPDATE public.past_events
SET
    slug = '206-odali-sessizlik-buyukada-rum-yetimhanesi-uzerine-etudler-sergisi',
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Avrupa’nın en büyük, dünyanın ise ikinci en büyük ahşap yapısı olan Büyükada Rum Yetimhanesi’nin mimari, tarihsel ve insani hafızasına odaklanan “206 Odalı Sessizlik: Büyükada Rum Yetimhanesi Üzerine Etüdler” sergisi, Galata Rum Okulu’nda arşiv belgeleri, fotoğraflar ve mimari araştırmalar eşliğinde izleyiciyle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Focusing on the architectural, historical, and human memory of the Prinkipo Greek Orphanage — Europe’s largest wooden building — the exhibition “206 Rooms of Silence: Studies on the Prinkipo Greek Orphanage” brought together archival documents, photographs, and architectural research at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Εστιάζοντας στην αρχιτεκτονική και ιστορική μνήμη του Ελληνικού Ορφανοτροφείου της Πριγκήπου — του μεγαλύτερου ξύλινου κτιρίου της Ευρώπης — η έκθεση «Σιωπή 206 Δωματίων» παρουσίασε αρχειακά τεκμήρια, φωτογραφίες και αρχιτεκτονικές μελέτες στη Σχολή Γαλατά.')
WHERE id = '2e9caf22-1aa9-452e-b057-061634e1e159';

-- 2. Populate curated trilingual descriptions for the remaining 8 curated exhibitions/events
UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), E'Sanat kuramcısı, yazar ve küratör Ali Artun ile heykeltıraş ve kavramsal sanatçı Ahmet Yiğider’i bir araya getiren “TÖZ” sergisi, 17 Ocak – 8 Şubat 2026 tarihleri arasında Galata Rum Okulu Vakfı - Kültür Merkezi’nde sanatseverlerle buluştu.\n\nSergi, mimarlığı gündelik yaşamın faydacı pratiklerinden, yapıların salt işlevselliğinden ve rasyonalist kurgulardan soyutlayarak; onu kadim, şiirsel, büyüsel ve sembolik bir dil olarak ele alır. Ali Artun’un kavramsal çerçevesinde “TÖZ”, çevremizi kuşatan sıradan yapılaşmanın ötesine geçerek formun, geometrinin, sayının ve sembolün imgesel dünyasına odaklanan bir mimarlık ve düşünce sergisi niteliği taşır.\n\nAhmet Yiğider’in Galata Rum Okulu’nun tarihi neoklasik atmosferiyle diyalog kuran heykel ve mekânsal yerleştirmeleri, insanlığın kadim hafızasındaki izleri, tözü ve gizemi görünür kılar. Sergi, izleyiciyi mekân, form ve varoluş arasındaki derin ilişki üzerine kozmik ve şiirsel bir tefekkür alanına davet eder.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), E'Bringing together art theorist, author, and curator Ali Artun with sculptor and conceptual artist Ahmet Yiğider, the exhibition “TÖZ” (Substance) welcomed visitors at the Galata Greek School Foundation - Cultural Center between January 17 and February 8, 2026.\n\nAbstracting architecture from utilitarian daily practices, functionalist constraints, and rationalist construction, the exhibition approaches architecture as an ancient, poetic, and symbolic language. Within Ali Artun’s curatorial framework, “TÖZ” transcends ordinary built environments to explore the imaginative realm of form, geometry, number, and symbol.\n\nIn dialogue with the historic neoclassical atmosphere of the Galata Greek School, Ahmet Yiğider’s sculptures and spatial installations render visible the traces, substance, and mystery embedded in humanity’s ancient memory — inviting viewers into a space of contemplation on space, form, and existence.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), E'Συνενώνοντας τον θεωρητικό της τέχνης, συγγραφέα και επιμελητή Ali Artun με τον γλύπτη και εννοιολογικό καλλιτέχνη Ahmet Yiğider, η έκθεση «TÖZ» (Ουσία) φιλοξενήθηκε στο Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο από τις 17 Ιανουαρίου έως τις 8 Φεβρουαρίου 2026.\n\nΑποδεσμεύοντας την αρχιτεκτονική από τη χρησιμοθηρική καθημερινότητα και τον ορθολογισμό, η έκθεση την προσεγγίζει ως μια αρχέγονη, ποιητική και συμβολική γλώσσα που εστιάζει στον φαντασιακό κόσμο της μορφής, της γεωμετρίας, του αριθμού και του συμβόλου.\n\nΣε διάλογο με την ιστορική νεοκλασική ατμόσφαιρα της Σχολής Γαλατά, τα γλυπτά και οι χωρικές εγκαταστάσεις του Ahmet Yiğider αναδεικνύουν τα ίχνη και την ουσία της αρχαίας μνήμης, προσκαλώντας τον επισκέπτη σε έναν χώρο στοχασμού γύρω από τον χώρο, τη μορφή και την ύπαρξη.')
WHERE id = '41dea564-3256-4bf8-88c7-b7cba4f784d3';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Sesler Hazinesi Orkestra ve Solistleri tarafından Galata Rum Okulu’nun tarihi ana salonunda gerçekleştirilen “Samatya” Dönem Konseri, İstanbul’un çok kültürlü müzik mirasını ve Samatya’nın tarihsel ezgilerini dinleyicilerle buluşturdu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Performed by the Treasury of Voices Orchestra and Soloists in the historic Grand Hall of the Galata Greek School, the “Samatya” Period Concert brought Istanbul’s multicultural musical heritage and historical melodies to the audience.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η συναυλία εποχής «Samatya» από την Ορχήστρα και τους Σολίστ «Θησαυρός Φωνών» στην ιστορική αίθουσα της Σχολής Γαλατά ανέδειξε την πολυπολιτισμική μουσική κληρονομιά της Κωνσταντινούπολης.')
WHERE id = 'ea2aa434-164a-4b0d-82a8-662393a1cb78';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Yunan müziğinin sevilen sesi Violete Ikari, Neapoleos & Stavropoleos Kutsal Metropolitliği Kadın Korosu eşliğinde “Galata’da İnce Bir Yağmur…” başlıklı özel konserde Galata Rum Okulu sahnesinde dinleyicilerle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Acclaimed Greek vocalist Violete Ikari, accompanied by the Women’s Choir of the Holy Metropolis of Neapoli and Stavroupoli, performed the special concert “A Fine Rain in Galata…” at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Η καταξιωμένη ερμηνεύτρια Βιολέτα Ίκαρη, συνοδευόμενη από τη Γυναικεία Χορωδία της Ιεράς Μητροπόλεως Νεαπόλεως και Σταυρουπόλεως, παρουσίασε μια ξεχωριστή συναυλία στη Σχολή Γαλατά.')
WHERE id = '7393d6fb-db07-4685-af62-10cc035a0ca2';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Uluslararası fotoğraf ve görsel sanatlar festivali 212 Photography Istanbul kapsamında Galata Rum Okulu, çağdaş fotoğraf sanatının öncü isimlerinden Viviane Sassen başta olmak üzere uluslararası sanatçıların seçkilerine ev sahipliği yaptı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'As part of the international 212 Photography Istanbul festival, the Galata Greek School hosted curated exhibitions featuring leading contemporary photographers including Viviane Sassen.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο του διεθνούς φεστιβάλ 212 Photography Istanbul, η Σχολή Γαλατά φιλοξένησε επιμελημένες εκθέσεις σύγχρονης φωτογραφίας με έργα της Viviane Sassen και διεθνών καλλιτεχνών.')
WHERE id = 'f9d2422d-d955-4d80-8828-94eaf2ef2ad9';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), '212 Photography Istanbul festivali kapsamında Galata Rum Okulu’nun sergi salonlarında düzenlenen seçkide, Ebru Yıldız’ın müzik ve sahne dünyasını belgeleyen çarpıcı fotoğraf çalışmaları sanatseverlerle buluştu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Hosted across the exhibition halls of the Galata Greek School during the 212 Photography Istanbul festival, this showcase presented striking photographic works by Ebru Yıldız.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Στο πλαίσιο του φεστιβάλ 212 Photography Istanbul, οι εκθεσιακοί χώροι της Σχολής Γαλατά φιλοξένησαν φωτογραφικά έργα της Ebru Yıldız.')
WHERE id = 'bb82fa65-e8ec-45ec-8117-d5bb949923bc';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Mimar Murat Tabanlıoğlu öncülüğünde düzenlenen “Port City Talks: Living by the Water” sergi kapanışı ve söyleşi programı, liman kentlerinin mimari, kültürel ve kentsel dönüşümünü Galata Rum Okulu’nda tartışmaya açtı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Led by architect Murat Tabanlıoğlu, the closing symposium of “Port City Talks: Living by the Water” explored the architectural, cultural, and urban evolution of port cities at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Υπό την καθοδήγηση του αρχιτέκτονα Murat Tabanlıoğlu, το συμπόσιο λήξης της έκθεσης «Port City Talks: Living by the Water» εξέτασε την αρχιτεκτονική και πολιτιστική εξέλιξη των πόλεων-λιμανιών.')
WHERE id = 'c258c4a7-8c4d-47e7-88cb-919e116b4135';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'İstanbul doğumlu büyük muganni ve Patrikhane Başmugannisi (Arhondon Protopsaltis) Üstad Thrasivoulos Stanitsas (1910–1987) anısına düzenlenen bu özel dinî musiki konseri, Bizans ve İstanbul Rum musiki geleneğinin seçkin eserlerini Galata Rum Okulu’nun tarihi atmosferinde dinleyicilerle buluşturdu.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Held in memory of the Istanbul-born Archon Protopsaltis of the Ecumenical Patriarchate, Master Thrasivoulos Stanitsas (1910–1987), this sacred music concert presented distinguished works of the Byzantine and Constantinopolitan musical tradition at the Galata Greek School.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Αφιερωμένη στη μνήμη του Κωνσταντινουπολίτη Άρχοντος Πρωτοψάλτου της Μεγάλης του Χριστού Εκκλησίας Θρασύβουλου Στανίτσα (1910–1987), αυτή η συναυλία εκκλησιαστικής μουσικής παρουσίασε εκλεκτά έργα της βυζαντινής και πολίτικης ψαλτικής παράδοσης στη Σχολή Γαλατά.')
WHERE id = 'be2395b4-6335-4d04-9766-26981adc4945';

UPDATE public.past_events
SET
    description_tr = COALESCE(NULLIF(btrim(description_tr), ''), 'Tarihçi, diplomat ve yazar Büyükelçi Aleksis Aleksandris’in katılımıyla Galata Rum Okulu’nda düzenlenen bu özel konferans ve söyleşide, İstanbul Rum toplumunun yakın dönem eğitim, kültür ve diplomasi tarihi kapsamlı biçimde ele alındı.'),
    description_en = COALESCE(NULLIF(btrim(description_en), ''), 'Featuring historian, diplomat, and author Ambassador Alexis Alexandris, this special lecture and discussion at the Galata Greek School examined the modern educational, cultural, and diplomatic history of the Greek community of Istanbul.'),
    description_el = COALESCE(NULLIF(btrim(description_el), ''), 'Με τη συμμετοχή του ιστορικού, διπλωμάτη και συγγραφέα Πρέσβη Αλέξη Αλεξανδρή, αυτή η ειδική διάλεξη στη Σχολή Γαλατά εξέτασε τη σύγχρονη εκπαιδευτική, πολιτιστική και διπλωματική ιστορία της ελληνικής κοινότητας της Κωνσταντινούπολης.')
WHERE id = 'd011faf7-00d9-444f-b537-7deb4689ea8e';

CREATE UNIQUE INDEX IF NOT EXISTS past_events_slug_unique_nonempty_idx
    ON public.past_events (slug)
    WHERE slug IS NOT NULL AND btrim(slug) <> '';
