-- ============================================================
-- Seed page_content for History Page and Homepage
-- Run in Supabase Dashboard → SQL Editor
-- Structure: page_key, section_key, content_tr, content_en, content_el
-- ============================================================

-- ─── HISTORY PAGE ───────────────────────────────────────────

INSERT INTO public.page_content (page_key, section_key, content_tr, content_en, content_el) VALUES

-- Hero section
('history', 'hero_title1',
 '120 Yıllık',
 '120 Years of',
 '120 Χρόνια'),

('history', 'hero_title2',
 'Tarih',
 'History',
 'Ιστορίας'),

('history', 'hero_subtitle',
 'Galata''nın kalbinde neoklasik tarih, akademik mükemmellik ve kültürel dönüşümün 120 yılı.',
 '120 years of neoclassical history, academic excellence, and cultural transformation in the heart of Galata.',
 '120 χρόνια νεοκλασικής ιστορίας, ακαδημαϊκής αριστείας και πολιτιστικής μεταμόρφωσης στην καρδιά του Γαλατά.'),

-- Tarihce section
('history', 'tarihce_p1',
 'Galata Rum Okulu, Osmanlı İmparatorluğu''nun modernleşme sürecinde Rum topluluğunun gerçekleştirdiği eğitim kurumları içindeki önemli bir yere sahip yapılardan biridir. Okul, Rum çocukların modern eğitim ve öğretimine katkı sağlayabilmek amacıyla dönemin hayırseverlerinden Eleni Zarifi''nin destekleriyle, Galata Rum Cemaati tarafından bağışlanan arazi üzerinde inşa edilmiştir.',
 'The Galata Greek School is one of the important structures among the educational institutions realized by the Greek community during the modernization process of the Ottoman Empire. The school was built on land donated by the Galata Greek Community, with the support of Eleni Zarifi, a philanthropist of the time, in order to contribute to the modern education and teaching of Greek children.',
 'Το Ελληνικό Σχολείο Γαλατά είναι ένα από τα σημαντικά κτίρια μεταξύ των εκπαιδευτικών ιδρυμάτων που υλοποιήθηκαν από την ελληνική κοινότητα κατά τη διαδικασία εκσυγχρονισμού της Οθωμανικής Αυτοκρατορίας.'),

('history', 'tarihce_p2',
 'Okulun mimarları Patroklos Kambanakis ve Stavros Hristidis''tir; Perikli Fotiadis danışmanlık mimarlık hizmeti vermiştir. Okulun açılışı 2 Haziran 1910 Çarşamba günü saat 11:00''de gerçekleştirilmiştir.',
 'The architects of the school are Patroklos Kambanakis and Stavros Hristidis; Perikli Fotiadis provided consulting architectural services. The opening of the school took place on Wednesday, June 2, 1910, at 11:00 AM.',
 'Αρχιτέκτονες του σχολείου είναι ο Πάτροκλος Καμπανάκης και ο Σταύρος Χρηστίδης· ο Περικλής Φωτιάδης παρείχε συμβουλευτικές αρχιτεκτονικές υπηρεσίες.'),

-- Middle block
('history', 'middle_title',
 'Dönemin neoklasik-eklektik mimari üslubuyla inşa edilen okul, İstanbul''un tarihi ticaret ve finans merkezi Galata''da, Kemeraltı ve Bereketzade mahallelerinin kesişiminde bulunmaktadır.',
 'Built in the neoclassical-eclectic architectural style of the period, the school is located in Galata, the historical trade and financial center of Istanbul, at the intersection of the Kemeraltı and Bereketzade neighborhoods.',
 'Χτισμένο στο νεοκλασικό-εκλεκτικιστικό αρχιτεκτονικό στυλ της περιόδου, το σχολείο βρίσκεται στον Γαλατά.'),

('history', 'middle_subtitle',
 'Geçmişte çocuk sesleriyle yankılanan, ancak uzun yıllar sessizliğe gömülen okul binası 2012 yılında sahiplerine iade edilmiştir.',
 'The school building, which resonated with the voices of children in the past but remained silent for many years, was returned to its owners in 2012.',
 'Το κτίριο του σχολείου, που στο παρελθόν αντηχούσε από τις φωνές των παιδιών αλλά παρέμεινε σιωπηλό για πολλά χρόνια, επιστράφηκε στους ιδιοκτήτες του το 2012.'),

-- Restoration section
('history', 'restoration_p1',
 'Restorasyon projesinin uygulaması Ekümenik Patrik Hazretleri I. Bartholomeos''un himayelerinde başlatılmıştır. Sayın Marina ve Athanasios Martinos''un cömert ve zarif sponsorlukları sayesinde tamamlanmıştır. Restorasyon Murat Tabanlıoğlu (Tabanlıoğlu Mimarlık) öncülüğünde gerçekleştirilmiştir.',
 'The implementation of the restoration project was initiated under the auspices of His All-Holiness Ecumenical Patriarch Bartholomew I. It was completed thanks to the generous and elegant sponsorships of Marina and Athanasios Martinos. The restoration was carried out under the leadership of Murat Tabanlıoğlu (Tabanlıoğlu Architects).',
 'Η υλοποίηση του έργου ανακαίνισης ξεκίνησε υπό την αιγίδα της Αυτού Θειοτάτης Παναγιότητος του Οικουμενικού Πατριάρχου κ.κ. Βαρθολομαίου Α''.'),

('history', 'restoration_p2',
 'Galata Rum Okulu, yeni kurumsal adıyla "Okul" hem geçmişten gelen hafızasını, köklü geçmişini koruyarak, Rum kimliği ve kültürel mirasının bir kurumu olmayı, hem de geleceğe yönelik bir perspektif yaratmak üzere tüm İstanbulluları kucaklayan bir sanat ve eğitim alanı olmayı hedeflemektedir.',
 'The Galata Greek School, with its new institutional name "The School," aims to be both an institution of Greek identity and cultural heritage by preserving its memory and deep-rooted past, and an art and education space that embraces all Istanbulites to create a perspective for the future.',
 'Το Ελληνικό Σχολείο Γαλατά, με τη νέα θεσμική του ονομασία «Το Σχολείο», στοχεύει να αποτελέσει τόσο έναν θεσμό ελληνικής ταυτότητας και πολιτιστικής κληρονομιάς.')

ON CONFLICT (page_key, section_key) DO UPDATE
    SET content_tr = EXCLUDED.content_tr,
        content_en = EXCLUDED.content_en,
        content_el = EXCLUDED.content_el;

-- ─── HOMEPAGE ────────────────────────────────────────────────

INSERT INTO public.page_content (page_key, section_key, content_tr, content_en, content_el) VALUES

('home', 'hero_subtitle',
 'Tarihi yeniden tanıyın. Galata''nın kalbinde 19. yüzyıldan kalma bir simge yapı, şimdi çağdaş sanat ve kültür evi.',
 'Rediscover history. A 19th-century landmark in the heart of Galata, now a home for contemporary art and culture.',
 'Ανακαλύψτε ξανά την ιστορία. Ένα ορόσημο του 19ου αιώνα στην καρδιά του Γαλατά, τώρα σπίτι σύγχρονης τέχνης και πολιτισμού.'),

('home', 'cta_primary',
 'Etkinliğinizi Tarihte Düzenleyin',
 'Host Your Event in History',
 'Διοργανώστε την Εκδήλωσή σας στην Ιστορία'),

('home', 'cta_secondary',
 'Hikayemizi Keşfedin',
 'Discover Our Story',
 'Ανακαλύψτε την Ιστορία μας'),

('home', 'history_p1',
 'Galata Rum Okulu, Osmanlı İmparatorluğu''nun modernleşme sürecinde Rum topluluğunun gerçekleştirdiği eğitim kurumları içindeki en önemli yerlerden biridir. Okul, Eleni Zarifi''nin destekleriyle, Galata Rum Cemaati tarafından bağışlanan arazi üzerinde inşa edilmiştir.',
 'The Galata Greek School is one of the most important educational institutions established by the Greek community during the modernization process of the Ottoman Empire. The school was built on land donated by the Galata Greek Community, with the support of Eleni Zarifi.',
 'Το Ελληνικό Σχολείο Γαλατά είναι ένα από τα σημαντικότερα εκπαιδευτικά ιδρύματα που ιδρύθηκαν από την ελληνική κοινότητα κατά τη διαδικασία εκσυγχρονισμού της Οθωμανικής Αυτοκρατορίας.'),

('home', 'history_p2',
 '2 Haziran 1910 tarihinde açılan okul, mimar Patroklos Kambanakis ve Stavros Hristidis tarafından, danışmanlık mimarı Perikli Fotiadis katkısıyla dönemin neoklasik-eklektik üslubuyla inşa edilmiştir.',
 'Opened on June 2, 1910, the school was built by architects Patroklos Kambanakis and Stavros Hristidis, with the contribution of consulting architect Perikli Fotiadis, in the neoclassical-eclectic style of the era.',
 'Το σχολείο άνοιξε στις 2 Ιουνίου 1910 και χτίστηκε από τους αρχιτέκτονες Πάτροκλο Καμπανάκη και Σταύρο Χρηστίδη, με τη συμβολή του συμβούλου αρχιτέκτονα Περικλή Φωτιάδη, στο νεοκλασικό-εκλεκτικιστικό στυλ της εποχής.')

ON CONFLICT (page_key, section_key) DO UPDATE
    SET content_tr = EXCLUDED.content_tr,
        content_en = EXCLUDED.content_en,
        content_el = EXCLUDED.content_el;

-- ─── PAST EVENTS PAGE HEADER ─────────────────────────────────

INSERT INTO public.page_content (page_key, section_key, content_tr, content_en, content_el) VALUES

('past_events', 'hero_description',
 'Galata Rum Okulu, her biri kendine özgü hikayesiyle birleşen prestijli moda defilelerinden, çağdaş sanat sergilerine ve seçkin kurumsal galalara ev sahipliği yapmaktadır. Neoklasik mimarimiz, modern vizyonlarla burada buluşuyor.',
 'The Galata Greek School hosts prestigious fashion shows, contemporary art exhibitions, and exclusive corporate galas, each merging with its unique story. Our neoclassical architecture meets modern visions here.',
 'Το Ελληνικό Σχολείο Γαλατά φιλοξενεί γόνιμες εκδηλώσεις, σεμινάρια και πολιτιστικές εκδηλώσεις. Η νεοκλασική μας αρχιτεκτονική συναντά τα σύγχρονα οράματα εδώ.')

ON CONFLICT (page_key, section_key) DO UPDATE
    SET content_tr = EXCLUDED.content_tr,
        content_en = EXCLUDED.content_en,
        content_el = EXCLUDED.content_el;

-- Verify
SELECT page_key, section_key FROM public.page_content ORDER BY page_key, section_key;
