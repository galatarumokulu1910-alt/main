import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { ARCHIVE_PUBLIC_ENABLED, PRODUCTION_SITE_ORIGIN, VENUE_INFO } from '../../config/venueInfo';
import SEO from '../../components/SEO/SEO';
import { supabase } from '../../services/supabaseClient';
import { useCmsContent } from '../../hooks/useCmsContent';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './HistoryPage.css';

type Lang = 'tr' | 'en' | 'el';

export default function HistoryPage() {
    const { lang, localizePath } = useI18n();
    const l = (lang as Lang) || 'en';
    const cms = useCmsContent('history');

    const [timeline, setTimeline] = useState<any[]>([]);
    const [timelineLoading, setTimelineLoading] = useState(true);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const fetchTimeline = async () => {
            const { data } = await supabase
                .from('history_timeline')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true })
                .order('year', { ascending: true });

            if (data && data.length > 0) {
                const sorted = [...data].sort((a, b) => {
                    const ordDiff = (Number(a.order_index) || 0) - (Number(b.order_index) || 0);
                    if (ordDiff !== 0) return ordDiff;
                    return (parseInt(String(a.year), 10) || 0) - (parseInt(String(b.year), 10) || 0);
                });
                setTimeline(sorted);
            }
            setTimelineLoading(false);
        };
        fetchTimeline();
    }, []);

    const CURATED_TIMELINE_EL: Record<string, { title: string; desc: string }> = {
        'Kuruluş': {
            title: 'Ίδρυση',
            desc: 'Ιδρύεται η Αστική Σχολή Γαλατά.',
        },
        'Yeni Bina': {
            title: 'Νέο Διδακτήριο',
            desc: 'Η Σχολή μεταφέρεται σε νέο διδακτήριο, που ξεχωρίζει για τη νεοκλασική του αρχιτεκτονική και συγκαταλέγεται στα πλέον σύγχρονα εκπαιδευτήρια της εποχής.',
        },
        'Resmi Açılış': {
            title: 'Επίσημα Εγκαίνια',
            desc: 'Τελούνται τα επίσημα εγκαίνια του νέου διδακτηρίου την Τετάρτη 2 Ιουνίου 1910 και ώρα 11:00 π.μ., σε σχέδια των αρχιτεκτόνων Πατρόκλου Καμπανάκη και Σταύρου Χρηστίδη.',
        },
        'Cumhuriyet Dönemi': {
            title: 'Περίοδος της Τουρκικής Δημοκρατίας',
            desc: 'Με την ίδρυση της Τουρκικής Δημοκρατίας, η λειτουργία της Σχολής προσαρμόζεται στο νέο εκπαιδευτικό πλαίσιο.',
        },
        'Anaokulu Açılışı': {
            title: 'Ίδρυση Νηπιαγωγείου',
            desc: 'Ιδρύεται το σύγχρονο Νηπιαγωγείο της Σχολής με δωρεά του Ανδρέα Ηλιάδη.',
        },
        '6-7 Eylül Olayları': {
            title: 'Γεγονότα της 6–7 Σεπτεμβρίου (Σεπτεμβριανά)',
            desc: 'Κατά τα γεγονότα της 6–7 Σεπτεμβρίου 1955, το διδακτήριο υφίσταται σοβαρές ζημιές, οι οποίες αποκαθίστανται από την Κοινότητα.',
        },
        'Cephe Düzenlemesi': {
            title: 'Διαμόρφωση Πρόσοψης',
            desc: 'Η στάθμη της εισόδου και της πρόσοψης του κτιρίου αναδιαμορφώνεται λόγω της διαπλάτυνσης της λεωφόρου Kemeraltı.',
        },
        'Eğitimin Durması': {
            title: 'Συρρίκνωση Μαθητικής Δύναμης',
            desc: 'Λόγω της δημογραφικής συρρίκνωσης της ομογένειας, η εκπαιδευτική δραστηριότητα στη Σχολή περιορίζεται.',
        },
        'Eğitim Faaliyetlerinin Askıya Alınması': {
            title: 'Αναστολή Εκπαιδευτικής Λειτουργίας',
            desc: 'Αναστέλλεται η λειτουργία του Δημοτικού Σχολείου λόγω των δημογραφικών μεταβολών της ομογένειας.',
        },
        'Yalnız Anaokulu Dönemi ile yeniden açılış': {
            title: 'Επαναλειτουργία ως Νηπιαγωγείο',
            desc: 'Το διδακτήριο επαναλειτουργεί αποκλειστικά ως Νηπιαγωγείο την περίοδο 2000–2007.',
        },
        'Restorasyon Projesi': {
            title: 'Μελέτη Αποκατάστασης',
            desc: 'Εκπονείται ολοκληρωμένη μελέτη αποκατάστασης για τη διαφύλαξη της ιστορικής φυσιογνωμίας του κτιρίου.',
        },
        'İade': {
            title: 'Απόδοση του Κτιρίου',
            desc: 'Το ιστορικό κτίριο της Σχολής αποδίδεται εκ νέου στην Ελληνορθόδοξη Κοινότητα της Κωνσταντινούπολης.',
        },
        'Okul İşlevinin Sona Ermesi': {
            title: 'Οριστική Παύση Σχολικής Λειτουργίας',
            desc: 'Ολοκληρώνεται οριστικά ο κύκλος της εκπαιδευτικής λειτουργίας του κτιρίου ως σχολείου.',
        },
        'Kültür Merkezi': {
            title: 'Πολιτιστικό Κέντρο',
            desc: 'Η Σχολή Γαλατά ανοίγει τις πύλες της ως χώρος πολιτισμού, φιλοξενώντας εκθέσεις σύγχρονης τέχνης, μπιενάλε, συναυλίες και συμπόσια.',
        },
        'Restorasyon Başlangıcı': {
            title: 'Έναρξη Έργων Αποκατάστασης',
            desc: 'Ξεκινούν οι εργασίες της εκτεταμένης αρχιτεκτονικής αποκατάστασης του κτιρίου υπό τη διεύθυνση του αρχιτέκτονα Murat Tabanlıoğlu (Tabanlıoğlu Architects).',
        },
        'AMMF İşbirliği & Yeniden Açılış': {
            title: 'Χορηγία ΑΜΜΦ & Επαναλειτουργία',
            desc: 'Μετά την ολοκλήρωση της αποκατάστασης με την ευγενική χορηγία του Ιδρύματος Αθανάσιος και Μαρίνα Μαρτίνου (ΑΜΜΦ), η Αστική Σχολή Γαλατά επαναλειτουργεί ως σύγχρονο Πολιτιστικό Κέντρο.',
        },
    };

    const getTimelineTitle = (item: any) => {
        if (l === 'tr') return item.title_tr || item.title_en || item.year;
        if (l === 'el') {
            const curated = item.title_tr ? CURATED_TIMELINE_EL[item.title_tr] : undefined;
            if (curated) return curated.title;
            return (item.title_el || item.title_en || item.year || '')
                .replace(/Έναρξη Ανακαίνισης/g, 'Έναρξη Αποκατάστασης');
        }
        return item.title_en || item.year;
    };

    const getTimelineDesc = (item: any) => {
        if (l === 'tr') return item.description_tr || item.description_en || '';
        if (l === 'el') {
            const curated = item.title_tr ? CURATED_TIMELINE_EL[item.title_tr] : undefined;
            if (curated) return curated.desc;
            return (item.description_el || item.description_en || '')
                .replace(/έργο ανακαίνισης/g, 'έργο αποκατάστασης')
                .replace(/Το επίπεδο υψόμετρου της πρόσοψης του κτιρίου ρυθμίστηκε/g, 'Η στάθμη της πρόσοψης του κτιρίου διαμορφώθηκε');
        }
        return item.description_en || '';
    };

    const content = {
        hero: {
            title1: { tr: cms.get('hero_title1', l, '140 Yıllık'), en: cms.get('hero_title1', 'en', '140 Years of'), el: cms.get('hero_title1', 'el', '140 Χρόνια') },
            title2: { tr: cms.get('hero_title2', l, 'Tarih'), en: cms.get('hero_title2', 'en', 'History'), el: cms.get('hero_title2', 'el', 'Ιστορίας') },
            subtitle: {
                tr: cms.get('hero_subtitle', 'tr', 'Galata\'nın kalbinde neoklasik tarih, akademik mükemmellik ve kültürel dönüşümün 140 yılı.'),
                en: cms.get('hero_subtitle', 'en', '140 years of neoclassical history, academic excellence, and cultural transformation in the heart of Galata.'),
                el: cms.get('hero_subtitle', 'el', '140 χρόνια νεοκλασικής αρχιτεκτονικής, εκπαιδευτικής παράδοσης και πολιτιστικής δημιουργίας στην καρδιά του Γαλατά.')
            },
            badgeText: { tr: 'Kuruluş Yılı', en: 'Year of Foundation', el: 'Έτος Ίδρυσης' }
        },
        tarihce: {
            title: { tr: 'Tarihçe', en: 'History', el: 'Ιστορία' },
            p1: {
                tr: cms.get('tarihce_p1', 'tr', 'Galata Rum Okulu, Osmanlı İmparatorluğu\'nun modernleşme sürecinde önemli bir yapıdır.'),
                en: cms.get('tarihce_p1', 'en', 'The Galata Greek School is one of the important educational institutions of the Greek community.'),
                el: cms.get('tarihce_p1', 'el', 'Η Αστική Σχολή Γαλατά συγκαταλέγεται στα σημαντικότερα εκπαιδευτικά καθιδρύματα της ομογένειας.')
            },
            p2: {
                tr: cms.get('tarihce_p2', 'tr', 'Okulun mimarları Patroklos Kambanakis ve Stavros Hristidis\'tir.'),
                en: cms.get('tarihce_p2', 'en', 'The architects of the school are Patroklos Kambanakis and Stavros Hristidis.'),
                el: cms.get('tarihce_p2', 'el', 'Αρχιτέκτονες της Σχολής υπήρξαν ο Πάτροκλος Καμπανάκης και ο Σταύρος Χρηστίδης.')
            }
        },
        timelineTitle: { tr: 'Kronoloji', en: 'Timeline', el: 'Χρονολόγιο' },
        middleBlock: {
            title: {
                tr: cms.get('middle_title', 'tr', 'Dönemin neoklasik-eklektik mimari üslubuyla inşa edilen okul, Galata\'da bulunmaktadır.'),
                en: cms.get('middle_title', 'en', 'Built in the neoclassical-eclectic architectural style of the period, the school is located in Galata.'),
                el: cms.get('middle_title', 'el', 'Κτισμένη στον νεοκλασικό-εκλεκτικιστικό αρχιτεκτονικό ρυθμό της εποχής, η Σχολή δεσπόζει στον Γαλατά.')
            },
            subtitle: {
                tr: cms.get('middle_subtitle', 'tr', 'Okul binası 2012 yılında İstanbul Rum Cemaati\'ne iade edilmiştir.'),
                en: cms.get('middle_subtitle', 'en', 'The school building was returned to its owners in 2012.'),
                el: cms.get('middle_subtitle', 'el', 'Το ιστορικό διδακτήριο αποδόθηκε εκ νέου στην Ελληνορθόδοξη Κοινότητα της Κωνσταντινούπολης το 2012.')
            }
        },
        restoration: {
            title: { tr: 'Restorasyon', en: 'Restoration', el: 'Αποκατάσταση' },
            p1: {
                tr: cms.get('restoration_p1', 'tr', 'Restorasyon projesinin uygulaması Patrik Hazretlerinin himayelerinde başlatılmıştır.'),
                en: cms.get('restoration_p1', 'en', 'The restoration project was initiated under the auspices of Ecumenical Patriarch Bartholomew I.'),
                el: cms.get('restoration_p1', 'el', 'Η αποκατάσταση του κτιρίου πραγματοποιήθηκε υπό την αιγίδα της Α.Θ.Π. του Οικουμενικού Πατριάρχου κ.κ. Βαρθολομαίου.')
            },
            p2: {
                tr: cms.get('restoration_p2', 'tr', 'Galata Rum Okulu, tüm İstanbulluları kucaklayan bir sanat ve eğitim alanı olmayı hedeflemektedir.'),
                en: cms.get('restoration_p2', 'en', 'The Galata Greek School aims to be an art and education space that embraces all Istanbulites.'),
                el: cms.get('restoration_p2', 'el', 'Η Αστική Σχολή Γαλατά φιλοδοξεί να λειτουργήσει ως μια ανοιχτή εστία τέχνης και παιδείας στην Κωνσταντινούπολη.')
            },
            p3: {
                tr: 'Okulun fiziki yapısı, 1903 ve 1958 yıllarına ait iki dönemlik restitüsyon projesi temel alınarak; deprem yönetmeliğine uygun yapısal güçlendirme, yangın ve koruma önlemleri, çağdaş iklimlendirme altyapısı ve katlar arası engelsiz erişimi sağlayan çift yönlü asansör ile merdiven kovaları eklenerek yeniden tasarlanmıştır. Sokak kotundan erişilen sol taraftaki iki dükkan alanı birleştirilerek ana girişle bağlantılı akışkan bir giriş fuayesine dönüştürülmüş; Çok Amaçlı Büyük Salon’un iki yanındaki avlular ise açık hava fuaye alanları olarak yeniden kurgulanmıştır.',
                en: 'Based on two-period restitution projects from 1903 and 1958, the building’s physical structure was comprehensively redesigned with seismic reinforcement, fire and conservation systems, contemporary climate control, and dual accessible elevators and staircases. On the street level, two adjacent shop spaces to the left of the main entrance were unified into a fluid entrance foyer connected to the main hall, while the two courtyards flanking the Multipurpose Grand Hall were reconfigured as open-air foyer spaces.',
                el: 'Με βάση τις μελέτες αποκατάστασης δύο περιόδων (1903 και 1958), η φυσική δομή του κτιρίου επανασχεδιάστηκε με αντισεισμική ενίσχυση, συστήματα πυρασφάλειας και σύγχρονου κλιματισμού, καθώς και διπλούς ανελκυστήρες ΑμεΑ και κλιμακοστάσια για την απρόσκοπτη πρόσβαση μεταξύ των ορόφων. Στο επίπεδο του δρόμου, οι δύο χώροι καταστημάτων αριστερά της κύριας εισόδου ενοποιήθηκαν σε ένα ενιαίο φουαγιέ εισόδου, ενώ οι δύο εσωτερικές αυλές εκατέρωθεν της Μεγάλης Αίθουσας Πολλαπλών Χρήσεων διαμορφώθηκαν ως υπαίθριοι χώροι φουαγιέ.',
            },
            p4: {
                tr: 'Demir giriş kapısından itibaren tüm cephelerdeki taş işçiliği ile iç mekânlardaki cam ve ahşap doğramalar aslına uygun olarak yenilenmiştir. Güçlendirme çalışmaları sırasında geçici olarak sökülen özgün yer mozaikleri (çiniler), ahşap duvar panelleri ve tarihi kapılar özgün karakterleri korunarak yerine uygulanmış; restorasyon esnasında açığa çıkan tarihi taş avlu duvarları ve tuğla kemerler temizlenip korunarak mekânsal kurguya dahil edilmiştir. Çatı katında ise binanın mahya kotuna uyularak %20 eğimle tasarlanan çatı piyesi ve şeffaf yapı elemanları sayesinde yapının Kemeraltı Caddesi yönündeki tarihi silueti özenle korunmuştur.',
                en: 'From the historic iron entrance gates to the stonework facades, all glass and timber joinery was faithfully restored. Original patterned floor tiles, wooden wall panelling, and historic doors temporarily removed during structural reinforcement were meticulously conserved and reinstalled, while historic stone courtyard walls and brick-vaulted arches uncovered during the restoration were cleaned, preserved, and integrated into the architectural layout. At the roof level, a 20%-sloped roof structure aligned with the building’s original ridge height preserves the historic silhouette along Kemeraltı Avenue.',
                el: 'Από την ιστορική σιδερένια πύλη εισόδου έως τις λιθόκτιστες όψεις, όλα τα ξύλινα και υάλινα κουφώματα αποκαταστάθηκαν με πιστότητα. Τα αυθεντικά πλακίδια δαπέδου, οι ξύλινες επενδύσεις τοίχων και οι ιστορικές θύρες συντηρήθηκαν και επανατοποθετήθηκαν, ενώ οι ιστορικοί λίθινοι τοίχοι και οι πλίνθινες καμάρες που αποκαλύφθηκαν κατά τις εργασίες καθαρίστηκαν, διατηρήθηκαν και εντάχθηκαν στην αρχιτεκτονική σύνθεση. Στο δώμα, η διαμόρφωση της στέγης με κλίση 20% στο ύψος της αρχικής κορυφογραμμής διαφυλάσσει την ιστορική σιλουέτα του κτιρίου προς την οδό Kemeraltı.',
            },
            btn: { tr: 'Proje Detaylarını İncele', en: 'Explore Project Details', el: 'Εξερευνήστε τις Λεπτομέρειες του Έργου' }
        }
    };

    const architecturalGalleryItems = [
        {
            src: '/images/architecture/tabanlioglu-eski-ve-onceki-cephe-karsilastirma.jpg',
            title: {
                tr: '1905 Tarihi Cephe ve Restorasyon Öncesi Görünüm',
                en: '1905 Historical Facade & Pre-Restoration Comparison',
                el: 'Ιστορική Όψη του 1905 & Όψη Πριν την Αποκατάσταση',
            },
            desc: {
                tr: 'Kemeraltı Caddesi üzerindeki neoklasik ön cephenin 1905 arşiv fotoğrafı ile restorasyon öncesi durumu.',
                en: 'Archival 1905 photograph of the neoclassical facade on Kemeraltı Avenue alongside its pre-restoration state.',
                el: 'Αρχειακή φωτογραφία του 1905 της νεοκλασικής όψης στην οδό Kemeraltı δίπλα στην κατάσταση πριν την αποκατάσταση.',
            },
        },
        {
            src: '/images/architecture/tabanlioglu-restorasyon-yeni-cephe.jpg',
            title: {
                tr: 'Restorasyon Projesi Cephe Mimari Görünümü',
                en: 'Restored Neoclassical Facade Elevation',
                el: 'Αποκατεστημένη Νεοκλασική Όψη του Κτιρίου',
            },
            desc: {
                tr: 'Sokak kotundaki giriş fuayesi, yenilenen taş cephe işçiliği ve mahya kotuna uyumlu çatı piyesi.',
                en: 'Street-level entrance foyer, restored stonework, and the sloped roof structure aligned with the historic ridge line.',
                el: 'Το φουαγιέ εισόδου στο επίπεδο του δρόμου, η αποκατεστημένη λιθοδομή και η στέγη στο ύψος της ιστορικής κορυφογραμμής.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-01-buyuk-salon-tas-duvar.jpg',
            title: {
                tr: '1. Kat Çok Amaçlı Büyük Salon — Özgün Çini Zemin ve Taş Duvar',
                en: '1st Floor Multipurpose Grand Hall — Original Tile Floor & Stone Wall',
                el: '1ος Όροφος: Μεγάλη Αίθουσα — Αυθεντικό Δάπεδο & Λίθινος Τοίχος',
            },
            desc: {
                tr: 'Aslına sadık kalınarak korunan çini halı desenli zemin, ahşap-cam bölmeler ve sahne arkasındaki tarihi taş duvar.',
                en: 'Faithfully conserved patterned floor tiles, timber-and-glass partitions, and the illuminated historic stone wall behind the stage.',
                el: 'Το διατηρημένο πλακόστρωτο δάπεδο, τα ξύλινα υαλοστάσια και ο φωτισμένος ιστορικός λίθινος τοίχος πίσω από τη σκηνή.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-02-ust-balkon-buyuk-salon.jpg',
            title: {
                tr: '2. Kat Üst Galeri Balkonundan Büyük Salon Perspektifi',
                en: 'Grand Hall Perspective from the 2nd Floor Upper Gallery Balcony',
                el: 'Άποψη της Μεγάλης Αίθουσας από τον Εξώστη του 2ου Ορόφου',
            },
            desc: {
                tr: '6,26 metre tavan yüksekliğine sahip ana salonu çevreleyen U planlı galeri balkonu ve neoklasik friz işlemeleri.',
                en: 'The U-shaped mezzanine gallery balcony and neoclassical meander friezes framing the 6.26 m double-height hall.',
                el: 'Ο εξώστης σχήματος Π και οι νεοκλασικές ανάγλυφες ζωφόροι που πλαισιώνουν την αίθουσα ύψους 6,26 μέτρων.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-03-birinci-kat-fuaye-giris.jpg',
            title: {
                tr: '1. Kat Ana Fuaye ve Merdiven Sahanlığından Büyük Salon Girişi',
                en: '1st Floor Main Foyer & Marble Staircase Landing',
                el: 'Κεντρικό Φουαγιέ 1ου Ορόφου & Είσοδος Μεγάλης Αίθουσας',
            },
            desc: {
                tr: 'Özgün yer mozaikleri, iki yandaki mermer basamaklar ve Büyük Salon’a açılan tarihi ahşap-cam kapılar.',
                en: 'Original mosaic floor tiles, flanking marble steps, and restored timber-and-glass doors opening into the Grand Hall.',
                el: 'Τα αυθεντικά μωσαϊκά πλακίδια, οι μαρμάρινες βαθμίδες και οι ξύλινες υαλόθυρες της Μεγάλης Αίθουσας.',
            },
        },
        {
            src: '/images/architecture/tepta-tarihi-ana-merdiven-kovasi.jpg',
            title: {
                tr: 'Tarihi Ana Merdiven Kovası, Döküm Korkuluklar ve Ahşap Küpeşteler',
                en: 'Historic Grand Staircase, Cast-Iron Balustrades & Timber Handrails',
                el: 'Ιστορικό Κεντρικό Κλιμακοστάσιο & Ξύλινες Κουπαστές',
            },
            desc: {
                tr: 'Katlar arasındaki dikey mimari akışı sağlayan özgün terrazzo basamaklar, döküm demir korkuluklar ve ahşap küpeşteler.',
                en: 'Original terrazzo steps, historic balustrade ironwork, and sculpted timber handrails connecting the exhibition floors.',
                el: 'Οι αυθεντικές βαθμίδες, τα μεταλλικά κιγκλιδώματα και οι ξύλινες κουπαστές που συνδέουν τους εκθεσιακούς ορόφους.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-04-sergi-salonlari-enfilade.jpg',
            title: {
                tr: 'Üst Kat Sergi Salonları — Kapıdan Kapıya (Enfilade) Galeri Geçişi',
                en: 'Upper-Floor Exhibition Halls — Enfilade Gallery Perspective',
                el: 'Αίθουσες Εκθέσεων — Διαδοχική Προοπτική (Enfilade)',
            },
            desc: {
                tr: 'Özgün ahşap duvar lambrileri ve tarihi yer karoları korunarak çağdaş sergi altyapısıyla donatılan birbirine geçmeli salonlar.',
                en: 'Interconnected gallery halls combining preserved wooden wainscoting and historic floor tiles with contemporary exhibition lighting.',
                el: 'Διαδοχικές αίθουσες εκθέσεων με διατηρημένες ξύλινες επενδύσεις τοίχων, ιστορικά πλακίδια δαπέδου και σύγχρονο φωτισμό.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-05-sergi-salonlari-vitrinler.jpg',
            title: {
                tr: 'Sergi Salonları ve Müzecilik Vitrinleri',
                en: 'Exhibition Galleries & Museum Display Vitrines',
                el: 'Εκθεσιακοί Χώροι & Μουσειακές Προθήκες',
            },
            desc: {
                tr: '2. ve 3. katlardaki geniş merkez fuaye ve bağımsız sergi odalarının müze standartlarındaki sergileme düzeni.',
                en: 'Museum-grade exhibition layout across the central foyer and interconnected gallery rooms on the upper floors.',
                el: 'Μουσειακή εκθεσιακή διάταξη στο κεντρικό φουαγιέ και τις αίθουσες των επάνω ορόφων.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-06-tarihi-sinif-duvar-resmi.jpg',
            title: {
                tr: 'Korunan Tarihi Sınıf, Orijinal Ahşap Sıralar ve Duvar Resmi',
                en: 'Preserved Historic Classroom, Original Desks & Wall Mural',
                el: 'Διατηρημένη Ιστορική Σχολική Αίθουσα, Θρανία & Τοιχογραφία',
            },
            desc: {
                tr: 'Okulun eğitim hafızasını yaşatan orijinal ahşap öğrenci sıraları, askılıklar ve duvar boyunca uzanan panoramik peyzaj resmi.',
                en: 'Preserving the school’s educational memory with original wooden student desks, coat racks, and the panoramic landscape mural.',
                el: 'Τα αυθεντικά ξύλινα μαθητικά θρανία, οι κρεμάστρες και η πανοραμική τοιχογραφία που διατηρούν ζωντανή τη σχολική μνήμη.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-07-arsiv-kutuphane-salonu.jpg',
            title: {
                tr: 'Arşiv, Kütüphane ve Tarihi Okul Koleksiyonu Salonu',
                en: 'Archive, Library & Historical School Collection Hall',
                el: 'Αίθουσα Αρχείου, Βιβλιοθήκης & Ιστορικής Συλλογής της Σχολής',
            },
            desc: {
                tr: 'Tarihi ders kitapları, fen laboratuvarı materyalleri, kupalar ve arşiv belgelerinin korunduğu özgün ahşap dolaplı salon.',
                en: 'Original timber bookcases and display tables housing historical textbooks, science instruments, trophies, and archival documents.',
                el: 'Οι αυθεντικές ξύλινες βιβλιοθήκες και προθήκες όπου φυλάσσονται ιστορικά βιβλία, εποπτικά όργανα, κύπελλα και έγγραφα.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-08-anaokulu-fresk-koridor.jpg',
            title: {
                tr: 'Anaokulu (Νηπιαγωγείον Γαλατά) Kemerli Duvar Freski ve Sergi Koridoru',
                en: 'Kindergarten (Νηπιαγωγείον Γαλατά) Archway Mural & Corridor',
                el: 'Τοιχογραφία του Νηπιαγωγείου Γαλατά & Διάδρομος Προθηκών',
            },
            desc: {
                tr: 'Duvarında tarihi “Νηπιαγωγείον Γαλατά” amblemi ve yarım daire duvar resmi bulunan, cam vitrinli koridor alanı.',
                en: 'Corridor featuring the restored semicircular kindergarten mural, the historic “Νηπιαγωγείον Γαλατά” emblem, and display cases.',
                el: 'Ο διάδρομος με την αποκατεστημένη ημικυκλική τοιχογραφία, το έμβλημα «Νηπιαγωγείον Γαλατά» και τις γυάλινες προθήκες.',
            },
        },
        {
            src: '/images/architecture/mehmet-mutaf-09-tonozlu-tarihi-tas-mekan.jpg',
            title: {
                tr: 'Restorasyonda Açığa Çıkan Tarihi Tuğla Tonozlu ve Kemerli Taş Mekân',
                en: 'Historic Brick-Vaulted & Stone-Arched Chamber Uncovered in Restoration',
                el: 'Ιστορικός Πλίνθινος Θολωτός Χώρος που Αποκαλύφθηκε στην Αποκατάσταση',
            },
            desc: {
                tr: 'Restorasyon çalışmaları sırasında açığa çıkarılarak temizlenen, korunan ve mimari kurguya kazandırılan tarihi taş ve tuğla kemerli mekân.',
                en: 'Historic masonry walls and brick barrel vaults uncovered during restoration, cleaned, conserved, and integrated into the cultural center.',
                el: 'Οι ιστορικοί λίθινοι τοίχοι και οι πλίνθινες καμάρες που αποκαλύφθηκαν, συντηρήθηκαν και εντάχθηκαν στο πολιτιστικό κέντρο.',
            },
        },
    ];

    const historyFaqItems = [
        {
            q: {
                tr: 'Galata Rum Okulu ne zaman ve hangi mimarlar tarafından inşa edildi?',
                en: 'When and by which architects was the Galata Greek School built?',
                el: 'Πότε και από ποιους αρχιτέκτονες ανεγέρθηκε η Αστική Σχολή Γαλατά;',
            },
            a: {
                tr: 'Galata Rum cemaatinin eğitim çalışmaları 19. yüzyıla uzanmakta olup vakıf 1885 yılında kurumsallaşmıştır. Kemeraltı Caddesi üzerindeki bugünkü anıtsal neoklasik okul binası, hayırsever Eleni Zarifi’nin bağışlarıyla mimarlar Patroklos Kambanakis ve Stavros Hristidis tarafından tasarlanarak 1909–1910 yıllarında inşa edilmiştir. Bina 2012 yılında vakfa iade edilmiş ve kapsamlı restorasyonun ardından kültür-sanat merkezi olarak yeniden açılmıştır.',
                en: 'Rooted in 19th-century community education and institutionalized in 1885, the monumental neoclassical school building on Kemeraltı Caddesi was designed by architects Patroklos Kambanakis and Stavros Hristidis with the patronage of Eleni Zarifi and completed in 1909–1910. Following its restitution to the Foundation in 2012 and a comprehensive architectural restoration, it reopened as a cultural and exhibition center.',
                el: 'Με ρίζες στην κοινοτική παιδεία του 19ου αιώνα και θεσμική ίδρυση το 1885, το μνημειακό νεοκλασικό διδακτήριο της Αστικής Σχολής Γαλατά στην οδό Kemeraltı ανεγέρθηκε την περίοδο 1909–1910 σε σχέδια των αρχιτεκτόνων Πατρόκλου Καμπανάκη και Σταύρου Χρηστίδη, με δωρεά της ευεργέτιδας Ελένης Ζαρίφη. Μετά την απόδοσή του στην Κοινότητα το 2012 και την πλήρη αποκατάστασή του, επαναλειτουργεί ως Πολιτιστικό Κέντρο.',
            },
        },
        {
            q: {
                tr: 'Galata Rum Okulu bugün gezilebilir mi? Ziyaret günleri nelerdir?',
                en: 'Can the Galata Greek School be visited today? What are the visiting days?',
                el: 'Μπορεί κανείς να επισκεφθεί σήμερα την Αστική Σχολή Γαλατά; Ποιες είναι οι ημέρες επίσκεψης;',
            },
            a: {
                tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi, sergiler ve kültür-sanat etkinlikleri kapsamında Salı–Cumartesi günleri açıktır; Pazar ve Pazartesi günleri kapalıdır. Güncel sergi programı ve ziyaret saatleri için Bize Ulaşın sayfasından veya +90 212 244 86 36 numaralı telefondan bilgi alabilirsiniz.',
                en: 'The Galata Greek School Foundation - Cultural Center is open Tuesday through Saturday during exhibitions and cultural programs, and closed on Sundays and Mondays. For current exhibition schedules and visiting hours, please contact us via our Contact Us page or call +90 212 244 86 36.',
                el: 'Η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο είναι ανοιχτή για το κοινό από Τρίτη έως Σάββατο κατά τη διάρκεια εκθέσεων και πολιτιστικών εκδηλώσεων, ενώ παραμένει κλειστή Κυριακή και Δευτέρα. Για το ωράριο επίσκεψης μπορείτε να επικοινωνήσετε στο +90 212 244 86 36.',
            },
        },
        {
            q: {
                tr: 'Tarihi binada sergi, konferans veya kurumsal etkinlik düzenlenebilir mi?',
                en: 'Can the historic building be rented for exhibitions, MICE conferences, or corporate events?',
                el: 'Διατίθεται το ιστορικό κτίριο προς ενοικίαση για εκθέσεις, συνέδρια MICE ή εταιρικές εκδηλώσεις;',
            },
            a: {
                tr: 'Evet. 2. derece tescilli tarihi eser statüsündeki binamızın 1., 2. ve 3. katlarında toplam 1.060 m² net etkinlik alanı (850 kişiye kadar kapasite) uluslararası sergiler, konferanslar, marka lansmanları ve özel resepsiyonlar için kiralanabilmektedir.',
                en: 'Yes. Across Levels 1, 2, and 3, our 2nd-degree listed historic monument offers 1,060 m² of net event space (up to 850 guests) for international exhibitions, conferences, brand launches, and galas.',
                el: 'Ναι. Στους Ορόφους 1, 2 και 3 το διατηρητέο κτίριο προσφέρει 1.060 m² καθαρού χώρου (έως 850 άτομα) για εκθέσεις, συνέδρια, παρουσιάσεις και δεξιώσεις.',
            },
        },
    ];

    const pageUrl = `${PRODUCTION_SITE_ORIGIN}${localizePath('/tarihce')}`;

    return (
        <div className="history-page">
            <SEO 
                titleKey="history.title" 
                overrideDescription={l === 'tr' ? 'Galata Rum Okulu tarihçesi. 1836\'dan günümüze İstanbul Beyoğlu\'nda Rum cemaatinin eğitim mirası, mimari restorasyon ve kültürel korumanın hikayesi.' : l === 'el' ? 'Ιστορία της Αστικής Σχολής Γαλατά. Από το 1885 έως σήμερα — η ιστορία της εκπαιδευτικής κληρονομιάς της ομογένειας, της αρχιτεκτονικής αποκατάστασης και της πολιτιστικής διατήρησης στον Γαλατά της Κωνσταντινούπολης.' : 'History of the Galata Greek School. From 1836 to today — the story of Greek community education heritage, architectural restoration, and cultural preservation in Beyoğlu, Istanbul.'}
                overrideKeywords={l === 'tr' ? 'galata rum okulu tarihçe, 1836, osmanlı dönemi okul, beyoğlu, rum cemaati, eğitim mirası, mimari restorasyon, kültürel koruma' : l === 'el' ? 'Ιστορία Αστικής Σχολής Γαλατά, 1885, 1910, Μπέγιογλου, ομογένεια, εκπαιδευτική κληρονομιά, αρχιτεκτονική αποκατάσταση, πολιτιστική διατήρηση' : 'Galata Greek School history, 1836, Ottoman era school, Beyoğlu, Greek community, education heritage, architectural restoration, cultural preservation'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Article",
                            "headline": "Galata Rum Okulu Vakfı - Kültür Merkezi Tarihçesi",
                            "description": "The complete history of the Galata Greek School Foundation - Cultural Center, from its founding in 1885 to the present-day restoration efforts. A heritage exhibition venue preserving the Greek community archive in Istanbul.",
                            "url": pageUrl,
                            "datePublished": "1885-01-01",
                            "about": {
                                "@type": "EducationalOrganization",
                                "name": VENUE_INFO.institutionName[l],
                                "foundingDate": "1885",
                                "address": {
                                    "@type": "PostalAddress",
                                    "streetAddress": VENUE_INFO.contact.schemaStreetAddress,
                                    "addressLocality": VENUE_INFO.contact.addressLocality,
                                    "addressRegion": VENUE_INFO.contact.addressRegion,
                                    "postalCode": VENUE_INFO.contact.postalCode,
                                    "addressCountry": VENUE_INFO.contact.addressCountry
                                },
                                "location": {
                                    "@type": ["Place", "LandmarksOrHistoricalBuildings"],
                                    "name": VENUE_INFO.institutionName.en,
                                    "containsPlace": {
                                        "@type": "Archive",
                                        "name": "Istanbul Greek Community Archive"
                                    }
                                }
                            }
                        },
                        {
                            "@type": "FAQPage",
                            "@id": `${pageUrl}#faq`,
                            "mainEntity": historyFaqItems.map((item) => ({
                                "@type": "Question",
                                "name": item.q[l],
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.a[l]
                                }
                            }))
                        }
                    ]
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Tarihçe', en: 'History', el: 'Ιστορία' } }]} />

            {/* ══════ HERO SECTION ══════ */}
            <header className="hp-header-section">
                <div className="hp-header__bg-skew" />
                <div className="hp-header__inner max-w-7xl mx-auto px-6">
                    <div className="hp-header__grid">
                        <motion.div
                            className="hp-header__content"
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="hp-header__eyebrow">
                                {l === 'tr' ? 'Kurumsal Tarihçe — Est. 1885' : l === 'el' ? 'Ιστορία της Σχολής — Ιδρ. 1885' : 'Institutional History — Est. 1885'}
                            </span>
                            <h1 className="hp-header__title">
                                {content.hero.title1[l]} <span className="hp-header__title-italic">{content.hero.title2[l]}</span>
                            </h1>
                            <p className="hp-header__subtitle">
                                {content.hero.subtitle[l]}
                            </p>
                        </motion.div>
                        <motion.div
                            className="hp-header__image-wrapper"
                            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img
                                src="/images/homepage/hero-facade.jpg"
                                alt="Heritage Exhibition Venue Galata — Historical School Building Exterior"
                                className="hp-header__image"
                                loading="eager"
                                fetchPriority="high"
                                width="1920"
                                height="1080"
                            />
                            <div className="hp-header__badge hidden-mobile">
                                <span className="hp-header__badge-year">1885</span>
                                <span className="hp-header__badge-text">{content.hero.badgeText[l]}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <div>
                {/* ══════ TARIHCE (HISTORY) SECTION ══════ */}
                <section className="hp-tarihce">
                    <div className="hp-tarihce__inner max-w-7xl mx-auto px-6">
                        <motion.div
                            className="hp-tarihce__col-text"
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="greek-pattern-gold hp-tarihce__pattern" />
                            <h2 className="hp-tarihce__title">{content.tarihce.title[l]}</h2>
                            <div className="hp-tarihce__prose">
                                <p>{content.tarihce.p1[l]}</p>
                                <p>{content.tarihce.p2[l]}</p>
                            </div>

                            <div className="hp-tarihce__vintage-wrap group">
                                <img
                                    src="/images/homepage/eksiokul.webp"
                                    alt={l === 'tr' ? 'Galata Rum Okulu binasının eski bir fotoğrafı' : l === 'el' ? 'Παλιά φωτογραφία του κτιρίου της Σχολής Γαλατά' : 'An early photograph of the Galata Greek School building'}
                                    className="hp-tarihce__vintage-img"
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="600"
                                />
                                <div className="hp-tarihce__vintage-overlay" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="hp-tarihce__col-blue"
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="hp-tarihce__blue-box">
                                <span className="hp-tarihce__blue-watermark">1910</span>
                                <h3 className="hp-tarihce__blue-title">
                                    {content.middleBlock.title[l]}
                                </h3>
                                <p className="hp-tarihce__blue-subtitle">
                                    {content.middleBlock.subtitle[l]}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ══════ TIMELINE SECTION — fetched from Supabase ══════ */}
                <section className="hp-timeline">
                    <div className="hp-timeline__inner max-w-7xl mx-auto px-6">
                        <h2 className="hp-timeline__title">{content.timelineTitle[l]}</h2>
                        {timelineLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>{l === 'tr' ? 'Yükleniyor…' : l === 'el' ? 'Φόρτωση…' : 'Loading…'}</div>
                        ) : (
                            <div className="hp-timeline__track">
                                {timeline.map((event, index) => (
                                    <motion.div
                                        key={event.id || index}
                                        className="hp-timeline__item"
                                        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.25 }}
                                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className="hp-timeline__year">{event.year}</div>
                                        <div className="hp-timeline__dot" />
                                        <div className="hp-timeline__content">
                                            <h3 className="hp-timeline__event-title">{getTimelineTitle(event)}</h3>
                                            <p className="hp-timeline__event-desc">{getTimelineDesc(event)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════ MARQUEE SECTION ══════ */}
                <section className="hp-marquee bg-charcoal dark:bg-black">
                    <div className="hp-marquee__track">
                        <span className="hp-marquee__text" lang="tr">Bir Kültür Mirası</span>
                        <span className="hp-marquee__text hp-marquee__text--outline" lang="en">An Educational Landmark</span>
                        <span className="hp-marquee__text" lang="el">Ένα Πολιτιστικό Μνημείο</span>
                        <span className="hp-marquee__text" lang="tr" aria-hidden="true">Bir Kültür Mirası</span>
                        <span className="hp-marquee__text hp-marquee__text--outline" lang="en" aria-hidden="true">An Educational Landmark</span>
                        <span className="hp-marquee__text" lang="el" aria-hidden="true">Ένα Πολιτιστικό Μνημείο</span>
                    </div>
                </section>

                {/* ══════ RESTORASYON SECTION ══════ */}
                <section className="hp-restoration">
                    <div className="hp-restoration__inner max-w-7xl mx-auto px-6">
                        <motion.div
                            className="hp-restoration__image-col"
                            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img
                                src="/images/homepage/acilis1.webp"
                                alt={l === 'tr' ? 'Restorasyon sonrası açılış' : l === 'el' ? 'Τα εγκαίνια μετά την αποκατάσταση' : 'The reopening after restoration'}
                                className="hp-restoration__img"
                                loading="lazy"
                                decoding="async"
                                width="800"
                                height="600"
                            />
                            <div className="hp-restoration__watermark">2023</div>
                        </motion.div>

                        <motion.div
                            className="hp-restoration__text-col"
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="greek-pattern-gold hp-restoration__pattern" />
                            <h2 className="hp-restoration__title">{content.restoration.title[l]}</h2>
                            <div className="hp-restoration__prose">
                                <p>{content.restoration.p1[l]}</p>
                                <p>{content.restoration.p2[l]}</p>
                                <p>{content.restoration.p3[l]}</p>
                                <p>{content.restoration.p4[l]}</p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'center' }}>
                                <Link to={localizePath('/ammf')} className="hp-restoration__link">
                                    {content.restoration.btn[l]}
                                    <span className="hp-restoration__icon">&rarr;</span>
                                </Link>
                                {ARCHIVE_PUBLIC_ENABLED && (
                                    <Link to={localizePath('/arsiv')} className="hp-restoration__link">
                                        {l === 'tr' ? 'DİJİTAL ARŞİVİ KEŞFEDİN' : l === 'el' ? 'ΕΞΕΡΕΥΝΗΣΤΕ ΤΟ ΨΗΦΙΑΚΟ ΑΡΧΕΙΟ' : 'EXPLORE THE DIGITAL ARCHIVE'}
                                        <span className="hp-restoration__icon">&rarr;</span>
                                    </Link>
                                )}
                                <Link to={localizePath('/mekan-kiralama')} className="hp-restoration__link">
                                    {l === 'tr' ? 'TARİHİ BİNADA ETKİNLİK & MEKAN KİRALAMA' : l === 'el' ? 'ΕΝΟΙΚΙΑΣΗ ΙΣΤΟΡΙΚΟΥ ΧΩΡΟΥ & MICE' : 'HERITAGE VENUE HIRE & MICE EVENTS'}
                                    <span className="hp-restoration__icon">&rarr;</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ══════ ARCHITECTURAL RESTORATION & HERITAGE SPACES GALLERY ══════ */}
                <section
                    className="hp-arch-gallery"
                    style={{
                        padding: 'var(--space-16) var(--space-6)',
                        maxWidth: 'var(--max-width)',
                        margin: '0 auto',
                        borderTop: '1px solid rgba(28, 25, 23, 0.1)',
                    }}
                >
                    <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto var(--space-10)' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '0.75rem',
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: 'var(--color-terracotta, #8c3a2b)',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                            }}
                        >
                            {l === 'tr'
                                ? 'MİMARİ RESTORASYON & MEKÂNSAL MİRAS (TABANLIOĞLU MİMARLIK)'
                                : l === 'el'
                                  ? 'ΑΡΧΙΤΕΚΤΟΝΙΚΗ ΑΠΟΚΑΤΑΣΤΑΣΗ & ΧΩΡΙΚΗ ΚΛΗΡΟΝΟΜΙΑ (TABANLIOĞLU ARCHITECTS)'
                                  : 'ARCHITECTURAL RESTORATION & SPATIAL HERITAGE (TABANLIOĞLU ARCHITECTS)'}
                        </span>
                        <h2
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'var(--type-section-title)',
                                fontWeight: 400,
                                color: 'var(--color-ink)',
                                marginBottom: '0.75rem',
                            }}
                        >
                            {l === 'tr'
                                ? 'Restorasyon Sonrası Mekânlar ve Korunan Özgün Katmanlar'
                                : l === 'el'
                                  ? 'Οι Χώροι Μετά την Αποκατάσταση & τα Διατηρημένα Ιστορικά Στρώματα'
                                  : 'Restored Spaces & Conserved Historical Layers'}
                        </h2>
                        <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--color-inscription)', margin: 0 }}>
                            {l === 'tr'
                                ? '1903 ve 1958 restitüsyon projeleri ışığında aslına sadık kalınarak korunan çini zeminler, ahşap doğramalar, tarihi sınıflar, merdiven kovaları ve restorasyon sırasında gün yüzüne çıkarılan taş kemerli mekânlar.'
                                : l === 'el'
                                  ? 'Τα αυθεντικά πλακίδια δαπέδου, τα ξύλινα κουφώματα, οι ιστορικές αίθουσες διδασκαλίας, το κεντρικό κλιμακοστάσιο και οι πλίνθινοι θολωτοί χώροι που διατηρήθηκαν με βάση τις μελέτες αποκατάστασης του 1903 και του 1958.'
                                  : 'Original patterned floor tiles, timber joinery, historic classrooms, the grand staircase, and brick-vaulted stone chambers conserved in accordance with the 1903 and 1958 restitution studies.'}
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
                            gap: '1.75rem',
                        }}
                    >
                        {architecturalGalleryItems.map((item, idx) => (
                            <figure
                                key={idx}
                                style={{
                                    margin: 0,
                                    border: '1px solid rgba(28, 25, 23, 0.12)',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    background: 'var(--color-white)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: '#1c1917' }}>
                                    <img
                                        src={item.src}
                                        alt={item.title[l]}
                                        loading="lazy"
                                        decoding="async"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                                <figcaption style={{ padding: '1.25rem 1.35rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                    <h3
                                        style={{
                                            fontFamily: 'var(--font-serif)',
                                            fontSize: '1.0625rem',
                                            fontWeight: 600,
                                            color: 'var(--color-ink)',
                                            margin: 0,
                                            lineHeight: 1.35,
                                        }}
                                    >
                                        {item.title[l]}
                                    </h3>
                                    <p style={{ fontSize: '0.8875rem', lineHeight: 1.6, color: 'var(--color-inscription)', margin: 0 }}>
                                        {item.desc[l]}
                                    </p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>

                {/* ══════ HISTORY, ARCHITECTURE & VISITOR FAQ SECTION (Niyet 1 SEO) ══════ */}
                <section className="hp-faq" style={{ padding: 'var(--space-16) var(--space-6)', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--type-section-title)', fontWeight: 400, color: 'var(--color-ink)', marginBottom: 'var(--space-8)', textAlign: 'center' }}>
                        {l === 'tr'
                            ? 'Tarihçe, Mimari ve Ziyaret Hakkında Sıkça Sorulan Sorular'
                            : l === 'el'
                              ? 'Συχνές Ερωτήσεις για την Ιστορία, την Αρχιτεκτονική & την Επίσκεψη'
                              : 'Frequently Asked Questions — History, Architecture & Visiting'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
                        {historyFaqItems.map((item, idx) => (
                            <article key={idx} style={{ border: '1px solid rgba(28, 25, 23, 0.12)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'var(--color-white)' }}>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '0.65rem', lineHeight: 1.35 }}>
                                    {item.q[l]}
                                </h3>
                                <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-inscription)', margin: 0 }}>
                                    {item.a[l]}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
