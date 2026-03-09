-- ============================================================
-- GALATA CMS — SEED MISSING DATA
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ──────────────────────────────────────────────────────
-- 1. HISTORY TIMELINE (8 events)
-- ──────────────────────────────────────────────────────
INSERT INTO public.history_timeline
    (year, title_tr, title_en, title_el, description_tr, description_en, description_el, status, order_index)
VALUES
    ('1885', 'Kuruluş', 'Foundation', 'Ίδρυση',
     'Galata Rum Okulu kuruldu.',
     'Galata Greek School was founded.',
     'Ιδρύθηκε το Ελληνικό Σχολείο Γαλατά.',
     'published', 1),

    ('1910', 'Resmi Açılış', 'Official Opening', 'Επίσημα Εγκαίνια',
     '2 Haziran 1910 Çarşamba günü saat 11:00''de resmi açılış gerçekleştirildi. Mimarlar: Patroklos Kambanakis ve Stavros Hristidis.',
     'The official opening took place on Wednesday, June 2, 1910, at 11:00 AM. Architects: Patroklos Kambanakis and Stavros Hristidis.',
     'Τα επίσημα εγκαίνια πραγματοποιήθηκαν την Τετάρτη 2 Ιουνίου 1910, στις 11:00 π.μ.',
     'published', 2),

    ('1958', 'Cephe Düzenlemesi', 'Facade Arrangement', 'Διαμόρφωση Πρόσοψης',
     'Ana cadde genişletilmesi sırasında binanın cephe kot seviyesi düzenlendi.',
     'The facade elevation of the building was arranged during the expansion of the main street.',
     'Το επίπεδο υψόμετρου της πρόσοψης του κτιρίου ρυθμίστηκε κατά τη διαπλάτυνση του κεντρικού δρόμου.',
     'published', 3),

    ('1988', 'Eğitim Faaliyetlerinin Askıya Alınması', 'Suspension of Educational Activities', 'Αναστολή Εκπαιδευτικών Δραστηριοτήτων',
     'Demografik değişimler nedeniyle eğitim faaliyetleri askıya alındı.',
     'Educational activities were suspended due to demographic changes.',
     'Οι εκπαιδευτικές δραστηριότητες ανεστάλησαν λόγω δημογραφικών αλλαγών.',
     'published', 4),

    ('2000', 'Anaokulu Dönemi', 'Kindergarten Era', 'Εποχή Νηπιαγωγείου',
     '2000-2007 yılları arasında bina anaokulu olarak hizmet verdi.',
     'The building served as a kindergarten between 2000 and 2007.',
     'Το κτίριο λειτούργησε ως νηπιαγωγείο μεταξύ 2000 και 2007.',
     'published', 5),

    ('2012', 'İade', 'Return', 'Επιστροφή',
     'Bina İstanbul Rum Cemaati''ne iade edildi.',
     'The building was returned to the Istanbul Greek Community.',
     'Το κτίριο επιστράφηκε στην Ελληνική Κοινότητα της Κωνσταντινούπολης.',
     'published', 6),

    ('2015', 'Okul İşlevinin Sona Ermesi', 'End of School Function', 'Τέλος Σχολικής Λειτουργίας',
     'Bina resmi olarak okul işlevi görmeyi bıraktı.',
     'The building officially ceased to function as a school.',
     'Το κτίριο έπαψε επίσημα να λειτουργεί ως σχολείο.',
     'published', 7),

    ('2019', 'Restorasyon Başlangıcı', 'Start of Restoration', 'Έναρξη Ανακαίνισης',
     'Kültür ve eğitim merkezi olarak dönüştürmek için büyük restorasyon projesi başlatıldı. Murat Tabanlıoğlu (Tabanlıoğlu Mimarlık) öncülüğünde gerçekleştirildi.',
     'A major restoration project was initiated to transform it into a cultural and educational center. Led by Murat Tabanlıoğlu (Tabanlıoğlu Architects).',
     'Ξεκίνησε ένα μεγάλο έργο ανακαίνισης για τη μετατροπή του σε πολιτιστικό και εκπαιδευτικό κέντρο.',
     'published', 8)
ON CONFLICT DO NOTHING;


-- ──────────────────────────────────────────────────────
-- 2. VENUE — Missing floors (Level 2 & Level 3)
-- ──────────────────────────────────────────────────────
INSERT INTO public.venue_events
    (title_tr, title_en, title_el, description_tr, description_en, description_el, status)
VALUES
    (
        'Dernek Odası',
        'Association Room',
        'Αίθουσα Συλλόγου',
        'İkinci kattaki bu alan küçük toplantılar, çalışma grupları ve özel etkinlikler için uygundur. Modern altyapısıyla kurumsal kiralamaya hazırdır.',
        'Located on the second floor, this space is ideal for small meetings, working groups, and private events. Ready for corporate rentals with modern infrastructure.',
        'Βρίσκεται στον δεύτερο όροφο, αυτός ο χώρος είναι ιδανικός για μικρές συναντήσεις, ομάδες εργασίας και ιδιωτικές εκδηλώσεις.',
        'published'
    ),
    (
        'Çatı Terası',
        'Rooftop Terrace',
        'Ταράτσα',
        'Galata kulesinin eşsiz manzarasına sahip açık teras alanı. Özel etkinlikler, kokteyl partileri ve küçük çaplı açık hava gösterileri için idealdir.',
        'Open terrace with a unique view of the Galata Tower. Ideal for private events, cocktail parties, and small outdoor performances.',
        'Ανοιχτή ταράτσα με μοναδική θέα στον Πύργο του Γαλατά. Ιδανική για ιδιωτικές εκδηλώσεις και κοκτέιλ πάρτι.',
        'published'
    )
ON CONFLICT DO NOTHING;


-- ──────────────────────────────────────────────────────
-- 3. PAGE CONTENT — Static text blocks
-- ──────────────────────────────────────────────────────
INSERT INTO public.page_content
    (page_key, section_key, content_tr, content_en, content_el)
VALUES
    -- Homepage hero
    ('home', 'hero_headline',
     'Modern Geçmiş',
     'The Modern Past',
     'Το Σύγχρονο Παρελθόν'),

    ('home', 'hero_subtitle',
     'Tarihi yeniden tanıyın. Galata''nın kalbinde 19. yüzyıldan kalma bir simge yapı, şimdi çağdaş sanat ve kültür evi.',
     'Rediscover history. A 19th-century landmark in the heart of Galata, now a home for contemporary art and culture.',
     'Ανακαλύψτε ξανά την ιστορία. Ένα ορόσημο του 19ου αιώνα στην καρδιά του Γαλατά.'),

    -- History page hero
    ('history', 'hero_title',
     '120 Yıllık Tarih',
     '120 Years of History',
     '120 Χρόνια Ιστορίας'),

    ('history', 'hero_subtitle',
     'Galata''nın kalbinde neoklasik tarih, akademik mükemmellik ve kültürel dönüşümün 120 yılı.',
     '120 years of neoclassical history, academic excellence, and cultural transformation in the heart of Galata.',
     '120 χρόνια νεοκλασικής ιστορίας, ακαδημαϊκής αριστείας και πολιτιστικής μεταμόρφωσης.'),

    -- Archive page
    ('archive', 'hero_title',
     'Arşiv Koleksiyonu',
     'Archive Collection',
     'Αρχειακή Συλλογή'),

    ('archive', 'hero_subtitle',
     'Galata Rum Okulu''nun tarihi belgelerini, fotoğraflarını ve eserlerini keşfedin.',
     'Explore historical documents, photographs and artifacts of the Galata Greek School.',
     'Εξερευνήστε ιστορικά έγγραφα, φωτογραφίες και τεκμήρια του Ελληνικού Σχολείου Γαλατά.'),

    -- Venue hire page
    ('venue', 'hero_title',
     'Mekan Kiralama',
     'Venue Hire',
     'Ενοικίαση Χώρου'),

    ('venue', 'hero_subtitle',
     'Tarihi bir mekanda etkinliğinizi gerçekleştirin. Benzersiz atmosfer, modern altyapı.',
     'Host your event in a historic venue. Unique atmosphere, modern infrastructure.',
     'Διοργανώστε την εκδήλωσή σας σε έναν ιστορικό χώρο. Μοναδική ατμόσφαιρα, σύγχρονη υποδομή.')

ON CONFLICT (page_key, section_key) DO UPDATE
    SET content_tr = EXCLUDED.content_tr,
        content_en = EXCLUDED.content_en,
        content_el = EXCLUDED.content_el;


-- ──────────────────────────────────────────────────────
-- Verify results
-- ──────────────────────────────────────────────────────
SELECT 'history_timeline' AS table_name, COUNT(*) AS row_count FROM public.history_timeline
UNION ALL
SELECT 'venue_events', COUNT(*) FROM public.venue_events
UNION ALL
SELECT 'page_content', COUNT(*) FROM public.page_content;
