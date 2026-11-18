import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION_SITE_ORIGIN = 'https://galatarumokulu.org';
const DEFAULT_OG_IMAGE = `${PRODUCTION_SITE_ORIGIN}/og-image.jpg`;

const INSTITUTION_NAME = {
    tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi',
    en: 'Galata Greek School Foundation - Cultural Center',
    el: 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
};

const BRAND_SHORT = {
    tr: 'Galata Rum Okulu',
    en: 'Galata Greek School',
    el: 'Σχολή Γαλατά',
};

const STATIC_PAGES = [
    {
        basePath: '/',
        changefreq: 'weekly',
        priority: '1.0',
        title: {
            tr: 'Galata Rum Okulu Vakfı | Kültür Merkezi & Dijital Arşiv',
            en: 'Galata Greek School | Cultural Center & Digital Archive',
            el: 'Ελληνική Σχολή Γαλατά | Πολιτιστικό Κέντρο & Αρχείο',
        },
        h1: {
            tr: 'The Modern Past — Galata Rum Okulu Vakfı - Kültür Merkezi',
            en: 'The Modern Past — Galata Greek School Foundation - Cultural Center',
            el: 'The Modern Past — Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
        },
        description: {
            tr: 'İstanbul Galata’da 19. yüzyıldan kalma neoklasik simge yapı; çağdaş sanat sergileri, konferanslar, dijital arşiv ve seçkin kültürel etkinlikler merkezi.',
            en: 'A 19th-century neoclassical landmark in Galata, Istanbul — now a center for contemporary art exhibitions, conferences, digital archives, and cultural events.',
            el: 'Ένα νεοκλασικό ορόσημο του 19ου αιώνα στον Γαλατά της Κωνσταντινούπολης — κέντρο σύγχρονης τέχνης, συνεδρίων, ψηφιακού αρχείου και πολιτισμού.',
        },
    },
    {
        basePath: '/tarihce',
        changefreq: 'monthly',
        priority: '0.8',
        title: {
            tr: '140 Yıllık Tarihçe & Miras | Galata Rum Okulu',
            en: '140 Years of History & Heritage | Galata Greek School',
            el: '140 Χρόνια Ιστορίας & Κληρονομιάς | Σχολή Γαλατά',
        },
        h1: {
            tr: '140 Yıllık Tarih',
            en: '140 Years of History',
            el: '140 Χρόνια Ιστορίας',
        },
        description: {
            tr: 'Galata Rum Okulu tarihçesi: 1885’ten 1910 açılışına ve 2012 iadesinden günümüze İstanbul Beyoğlu’nda Rum cemaatinin eğitim ve kültür mirası.',
            en: 'History of the Galata Greek School: from 1885 and its 1910 inauguration to its 2012 restitution and contemporary cultural restoration in Beyoğlu, Istanbul.',
            el: 'Ιστορία της Ελληνικής Σχολής Γαλατά: από το 1885 και τα εγκαίνια του 1910 έως την επιστροφή του 2012 και τη σύγχρονη αποκατάσταση.',
        },
    },
    {
        basePath: '/arsiv',
        changefreq: 'weekly',
        priority: '0.9',
        title: {
            tr: 'Dijital Arşiv & Bellek | Galata Rum Okulu',
            en: 'Digital Archive & Memory | Galata Greek School',
            el: 'Ψηφιακό Αρχείο & Μνήμη | Ελληνική Σχολή Γαλατά',
        },
        h1: {
            tr: 'Arşiv — Galata Rum Okulu & İstanbul Rum Cemaatleri',
            en: 'Archive — Galata Greek School & Istanbul Greek Communities',
            el: 'Αρχείο — Σχολή Γαλατά & Ρωμαίικες Κοινότητες της Πόλης',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi ve İstanbul Rum toplumuna ait tarihi belge, fotoğraf ve eserlerin açık erişimli dijital arşivi.',
            en: 'Open-access digital archive of historical documents, photographs, and artifacts belonging to the Galata Greek School and the Istanbul Greek community.',
            el: 'Ψηφιακό αρχείο ανοιχτής πρόσβασης ιστορικών εγγράφων, φωτογραφιών και τεκμηρίων της Σχολής Γαλατά και της ελληνικής κοινότητας της Κωνσταντινούπολης.',
        },
    },
    {
        basePath: '/arsiv/koleksiyon',
        changefreq: 'weekly',
        priority: '0.8',
        title: {
            tr: 'Okul Arşiv Koleksiyonu | Galata Rum Okulu',
            en: 'School Archive Collection | Galata Greek School',
            el: 'Συλλογή Αρχείου Σχολείου | Ελληνική Σχολή Γαλατά',
        },
        h1: {
            tr: 'Koleksiyon — Okul Arşivi',
            en: 'Collection — School Archive',
            el: 'Συλλογή — Αρχείο Σχολείου',
        },
        description: {
            tr: 'Galata Rum Okulu dijital arşiv koleksiyonu: tarihi belgeler, diplomalar, fotoğraflar, öğrenci kayıtları ve eğitim araçları.',
            en: 'Digital archive collection of Galata Greek School: historical documents, diplomas, photographs, student records, and educational tools.',
            el: 'Ψηφιακή συλλογή αρχείου της Ελληνικής Σχολής Γαλατά: ιστορικά έγγραφα, διπλώματα, φωτογραφίες, μαθητολόγια και εκπαιδευτικά αντικείμενα.',
        },
    },
    {
        basePath: '/arsiv/istanbul-rum',
        changefreq: 'weekly',
        priority: '0.8',
        title: {
            tr: 'İstanbul Rumları Koleksiyonu | Galata Rum Okulu',
            en: 'Istanbul Greeks Collection | Galata Greek School',
            el: 'Συλλογή Ελλήνων της Πόλης | Σχολή Γαλατά',
        },
        h1: {
            tr: 'İstanbul Rumları',
            en: 'Istanbul Greeks',
            el: 'Έλληνες Κωνσταντινούπολης',
        },
        description: {
            tr: 'İstanbul Rum toplumunun tarihine ışık tutan arşiv koleksiyonu: fotoğraflar, belgeler, haritalar ve kültürel miras objeleri.',
            en: 'Archive collection illuminating the history of the Istanbul Greek community: photographs, documents, maps, and cultural heritage objects.',
            el: 'Αρχειακή συλλογή που φωτίζει την ιστορία της ελληνικής κοινότητας της Κωνσταντινούπολης: φωτογραφίες, έγγραφα, χάρτες και αντικείμενα.',
        },
    },
    {
        basePath: '/mekan-kiralama',
        changefreq: 'weekly',
        priority: '0.9',
        title: {
            tr: 'MICE, Lansman & Tarihi Mekan Kiralama | Galata Rum Okulu',
            en: 'MICE, Brand Launch & Venue Hire | Galata Greek School',
            el: 'Χώρος MICE, Εκδηλώσεων & Ενοικίαση | Σχολή Γαλατά',
        },
        h1: {
            tr: 'Asırlık Mimari, Zamansız Prestij',
            en: 'Centuries of Architecture, Timeless Prestige',
            el: 'Αιώνες Αρχιτεκτονικής, Διαχρονικό Κύρος',
        },
        description: {
            tr: 'İstanbul Karaköy’de 1.060 m² tarihi mekan kiralama: MICE, marka lansmanı, gala, defile, konferans ve sergiler için 3 etkinlik katında 850 kişilik kapasite.',
            en: '1,060 m² historic event venue hire in Karaköy, Istanbul: 3 neoclassical floors up to 850 guests for MICE conferences, brand launches, galas, and exhibitions.',
            el: 'Ενοικίαση ιστορικού χώρου 1.060 m² στον Γαλατά: 3 νεοκλασικοί όροφοι έως 850 άτομα για συνέδρια MICE, εταιρικές παρουσιάσεις, δείπνα γκαλά και εκθέσεις.',
        },
    },
    {
        basePath: '/gecmis-etkinlikler',
        changefreq: 'weekly',
        priority: '0.8',
        title: {
            tr: 'Geçmiş Etkinlikler & Sergiler | Galata Rum Okulu',
            en: 'Past Events & Exhibitions | Galata Greek School',
            el: 'Παρελθούσες Εκδηλώσεις & Εκθέσεις | Σχολή Γαλατά',
        },
        h1: {
            tr: 'Geçmiş Etkinlikler',
            en: 'Past Events',
            el: 'Παρελθούσες Εκδηλώσεις',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi geçmiş etkinlikler arşivi: İstanbul Bienali, çağdaş sanat sergileri, kurumsal lansmanlar, sempozyumlar ve konserler.',
            en: 'Past events archive of the Galata Greek School Cultural Center: Istanbul Biennial, contemporary art exhibitions, brand showcases, symposia, and concerts.',
            el: 'Αρχείο παρελθουσών εκδηλώσεων του Ιδρύματος Ελληνικού Σχολείου Γαλατά: Μπιενάλε Κωνσταντινούπολης, εκθέσεις σύγχρονης τέχνης, συμπόσια και συναυλίες.',
        },
    },
    {
        basePath: '/bize-ulasin',
        changefreq: 'monthly',
        priority: '0.8',
        title: {
            tr: 'Bize Ulaşın & Ziyaret Günleri | Galata Rum Okulu',
            en: 'Contact Us & Visiting Days | Galata Greek School',
            el: 'Επικοινωνία & Ημέρες Επίσκεψης | Σχολή Γαλατά',
        },
        h1: {
            tr: 'Bize Ulaşın',
            en: 'Contact Us',
            el: 'Επικοινωνία',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi iletişim ve MICE mekan kiralama talep formu. Ziyaret günleri: Salı–Cumartesi açık, Pazar ve Pazartesi kapalıdır.',
            en: 'Contact and MICE venue hire inquiry form for the Galata Greek School Foundation - Cultural Center. Open Tuesday–Saturday; closed Sunday and Monday.',
            el: 'Φόρμα επικοινωνίας και αιτήματος ενοικίασης χώρου MICE για το Ίδρυμα Ελληνικού Σχολείου Γαλατά. Ανοιχτά Τρίτη–Σάββατο, κλειστά Κυριακή & Δευτέρα.',
        },
    },
    {
        basePath: '/ammf',
        changefreq: 'monthly',
        priority: '0.7',
        title: {
            tr: 'AMMF Vakfı & Restorasyon | Galata Rum Okulu',
            en: 'AMMF Foundation & Restoration | Galata Greek School',
            el: 'Ίδρυμα AMMF & Αποκατάσταση | Ελληνική Σχολή Γαλατά',
        },
        h1: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF)',
            en: 'Athanasios and Marina Martinou Foundation (AMMF)',
            el: 'Ίδρυμα Αθανάσιος και Μαρίνα Μαρτίνου (AMMF)',
        },
        description: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF) ile Galata Rum Okulu Vakfı - Kültür Merkezi ortaklığı ve 1910 neoklasik binanın tarihi restorasyon projesi.',
            en: 'Partnership between the Athanasios and Marina Martinou Foundation (AMMF) and Galata Greek School Foundation for architectural restoration in Istanbul.',
            el: 'Συνεργασία του Ιδρύματος Αθανάσιος και Μαρίνα Μαρτίνου (AMMF) με το Ίδρυμα Ελληνικού Σχολείου Γαλατά για την ιστορική αποκατάσταση του κτιρίου.',
        },
    },
    {
        basePath: '/kvkk',
        changefreq: 'yearly',
        priority: '0.4',
        title: {
            tr: 'KVKK Aydınlatma Metni | Galata Rum Okulu',
            en: 'PDPL (KVKK) Disclosure Text | Galata Greek School',
            el: 'Προστασία Δεδομένων (KVKK) | Ελληνική Σχολή Γαλατά',
        },
        h1: {
            tr: 'KVKK Aydınlatma Metni',
            en: 'PDPL (KVKK) Disclosure Text',
            el: 'Ενημερωτικό Κείμενο Προστασίας Δεδομένων (KVKK)',
        },
        description: {
            tr: '6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında Galata Rum Okulu Vakfı - Kültür Merkezi ziyaretçi ve başvuru aydınlatma ve bilgilendirme metni.',
            en: 'Official visitor and inquiry data protection disclosure notice by the Galata Greek School Foundation - Cultural Center under Turkish Law No. 6698 (KVKK).',
            el: 'Επίσημη ενημέρωση από το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο σύμφωνα με τον Νόμο 6698 περί Προστασίας Δεδομένων Προσωπικού Χαρακτήρα.',
        },
    },
    {
        basePath: '/gizlilik-politikasi',
        changefreq: 'yearly',
        priority: '0.4',
        title: {
            tr: 'Gizlilik Politikası & Güvenlik | Galata Rum Okulu',
            en: 'Privacy Policy & Data Security | Galata Greek School',
            el: 'Πολιτική Απορρήτου | Ελληνική Σχολή Γαλατά',
        },
        h1: {
            tr: 'Gizlilik Politikası',
            en: 'Privacy Policy',
            el: 'Πολιτική Απορρήτου',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi ziyaretçi bilgilerinizin güvenliği, kurumsal iletişim gizliliği ve dijital arşiv koleksiyonlarımızın kullanım ilkeleri.',
            en: 'Principles governing visitor data security, corporate venue inquiry confidentiality, and open-access digital archive usage at Galata Greek School Foundation.',
            el: 'Οι αρχές μας σχετικά με την ασφάλεια των δεδομένων επισκεπτών, την εμπιστευτικότητα επικοινωνίας και τη χρήση του ψηφιακού αρχείου της Σχολής Γαλατά.',
        },
    },
    {
        basePath: '/cerez-politikasi',
        changefreq: 'yearly',
        priority: '0.4',
        title: {
            tr: 'Çerez (Cookie) Politikası | Galata Rum Okulu',
            en: 'Cookie Policy & Preferences | Galata Greek School',
            el: 'Πολιτική Cookies | Ελληνική Σχολή Γαλατά',
        },
        h1: {
            tr: 'Çerez Politikası',
            en: 'Cookie Policy',
            el: 'Πολιτική Cookies',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi web sitesinde kullanılan zorunlu, işlevsel ve analitik çerezler ile ziyaretçi tercih yönetimi hakkında bilgilendirme.',
            en: 'Detailed information regarding essential, functional, and analytical cookies used on the Galata Greek School website and how to manage your preferences.',
            el: 'Αναλυτικές πληροφορίες σχετικά με τα απαραίτητα, λειτουργικά και αναλυτικά cookies που χρησιμοποιούνται στον επίσημο ιστότοπο της Ελληνικής Σχολής Γαλατά.',
        },
    },
];

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeXml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function localizeRoute(basePath, lang) {
    if (lang === 'tr') return basePath;
    if (basePath === '/') return `/${lang}`;
    return `/${lang}${basePath}`;
}

function normalizePrerenderMediaUrl(rawUrl) {
    if (!rawUrl) return DEFAULT_OG_IMAGE;
    const trimmed = String(rawUrl).trim();
    if (/^https?:\/\/tvloakrlqazcadokliaf\.supabase\.co\/storage\/v1\/object\/public\/media\//i.test(trimmed)) {
        return trimmed.replace(
            /^https?:\/\/tvloakrlqazcadokliaf\.supabase\.co\/storage\/v1\/object\/public\/media\//i,
            `${PRODUCTION_SITE_ORIGIN}/supabase-media/`
        );
    }
    if (trimmed.startsWith('/')) {
        return `${PRODUCTION_SITE_ORIGIN}${trimmed}`;
    }
    return trimmed;
}

/**
 * Ensures every <title> is strictly 30..60 chars (passes both OpenSEO 10..60 and Claude-SEO 30..60)
 * and 100% unique across the entire site.
 */
function ensureUniqueBoundedTitle(rawTitle, lang, disambiguator, usedTitles) {
    const suffix = ` | ${BRAND_SHORT[lang]}`;
    const base = String(rawTitle || '')
        .replace(/\s+/g, ' ')
        .trim();

    const padOptions =
        lang === 'tr'
            ? [' — Sergi & Dijital Arşiv', ' — Sergi & Arşiv', ' — Kültür Arşivi']
            : lang === 'el'
              ? [' — Έκθεση & Ψηφιακό Αρχείο', ' — Έκθεση & Αρχείο', ' — Αρχείο']
              : [' — Exhibition & Heritage Archive', ' — Exhibition & Archive', ' — Archive'];

    const buildCandidate = (tagStr) => {
        const tag = tagStr ? ` (${tagStr})` : '';
        const maxBase = 60 - suffix.length - tag.length;
        let workingBase = base;
        if (workingBase.length + tag.length + suffix.length < 30) {
            for (const pad of padOptions) {
                if (
                    workingBase.length + pad.length + tag.length + suffix.length >= 30 &&
                    workingBase.length + pad.length <= maxBase
                ) {
                    workingBase = `${workingBase}${pad}`;
                    break;
                }
            }
            if (workingBase.length + tag.length + suffix.length < 30) {
                const fallbackPad = padOptions[0];
                workingBase = `${workingBase}${fallbackPad}`;
            }
        }
        if (workingBase.length <= maxBase) {
            return `${workingBase}${tag}${suffix}`;
        }
        const cut = Math.max(12, maxBase - 1);
        const wordTrimmed = workingBase.slice(0, cut).replace(/\s+\S*$/, '').trim();
        const minBaseFor30 = Math.max(8, 30 - suffix.length - tag.length - 1);
        const truncated = wordTrimmed.length >= minBaseFor30 ? wordTrimmed : workingBase.slice(0, cut).trim();
        return `${truncated}…${tag}${suffix}`;
    };

    let candidate = buildCandidate('');
    if (usedTitles.has(candidate.toLowerCase())) {
        candidate = buildCandidate(disambiguator);
    }
    let counter = 2;
    while (usedTitles.has(candidate.toLowerCase())) {
        candidate = buildCandidate(`${disambiguator}-${counter}`);
        counter++;
    }
    usedTitles.add(candidate.toLowerCase());
    return candidate;
}

/**
 * Ensures every <meta name="description"> is strictly 120..160 chars (passes both OpenSEO 70..160
 * and Claude-SEO 120..160) and 100% unique across the entire site.
 */
function ensureUniqueBoundedDescription(rawDesc, rawTitle, lang, disambiguator, usedDescriptions) {
    const cleanRaw = String(rawDesc || '')
        .replace(/\s+/g, ' ')
        .trim();
    const cleanTitle = String(rawTitle || '')
        .replace(/\s+/g, ' ')
        .trim();

    const contextTail =
        lang === 'tr'
            ? `İstanbul Karaköy’deki tarihi ${INSTITUTION_NAME.tr} dijital arşivi, sergi ve kültürel miras koleksiyonu (${disambiguator}).`
            : lang === 'el'
              ? `Αρχειακό τεκμήριο, εκθέσεις και πολιτιστική κληρονομιά στο ${INSTITUTION_NAME.el} στην Κωνσταντινούπολη (${disambiguator}).`
              : `Archival record, exhibitions, and cultural heritage preserved at ${INSTITUTION_NAME.en} in Karaköy, Istanbul (${disambiguator}).`;

    let desc = cleanRaw;
    if (!desc) {
        desc = `${cleanTitle} — ${contextTail}`;
    } else if (desc.length < 124) {
        const sep = desc.endsWith('.') ? ' ' : '. ';
        desc = `${desc}${sep}${contextTail}`;
    }

    const clamp160 = (str, tagStr) => {
        const tag = tagStr ? ` [${tagStr}]` : '';
        const maxLen = 160 - tag.length;
        const minBase = Math.max(80, 120 - tag.length);
        if (str.length <= maxLen) {
            return `${str}${tag}`;
        }
        const cut = Math.max(minBase, maxLen - 1);
        const wordTrimmed = str.slice(0, cut).replace(/\s+\S*$/, '').trim();
        const truncated = wordTrimmed.length >= minBase ? wordTrimmed : str.slice(0, cut).trim();
        return `${truncated}…${tag}`;
    };

    let candidate = clamp160(desc, '');
    if (candidate.length < 120) {
        candidate = clamp160(`${candidate} ${contextTail}`, '');
    }
    if (usedDescriptions.has(candidate.toLowerCase())) {
        candidate = clamp160(desc, disambiguator);
    }
    let counter = 2;
    while (usedDescriptions.has(candidate.toLowerCase())) {
        candidate = clamp160(desc, `${disambiguator}-${counter}`);
        counter++;
    }
    usedDescriptions.add(candidate.toLowerCase());
    return candidate;
}

function buildInstitutionalSchema(canonicalUrl, basePath = '', lang = 'tr') {
    const schoolPostalAddress = {
        '@type': 'PostalAddress',
        streetAddress: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, Karaköy',
        addressLocality: 'İstanbul',
        addressRegion: 'Beyoğlu',
        postalCode: '34425',
        addressCountry: 'TR',
    };

    const archiveEntity = {
        '@type': 'Archive',
        '@id': `${PRODUCTION_SITE_ORIGIN}/#archive`,
        name: 'Galata Rum Okulu & İstanbul Rum Cemaati Dijital Arşivi',
        alternateName: 'Istanbul Greek Community Archive',
        url: `${PRODUCTION_SITE_ORIGIN}/arsiv`,
        description:
            'Historical archive preserving documents, photographs, diplomas, and educational records of the Galata Greek School and the Greek community of Istanbul.',
    };

    const graph = [
        {
            '@type': 'Organization',
            '@id': `${PRODUCTION_SITE_ORIGIN}/#organization`,
            url: PRODUCTION_SITE_ORIGIN,
            name: INSTITUTION_NAME.tr,
            alternateName: [INSTITUTION_NAME.en, INSTITUTION_NAME.el],
            email: 'info@galatarumokulu.org',
            telephone: '+90 212 244 86 36',
            address: schoolPostalAddress,
            sameAs: [
                'https://www.instagram.com/galatarumokulukulturmerkezi/',
                'https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu',
            ],
        },
        {
            '@type': ['Place', 'LandmarksOrHistoricalBuildings', 'CivicStructure', 'EventVenue'],
            '@id': `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
            url: canonicalUrl,
            name: INSTITUTION_NAME.tr,
            alternateName: [INSTITUTION_NAME.en, INSTITUTION_NAME.el],
            description:
                'Historic 1910 neoclassical Greek school building in Karaköy, Istanbul, offering 1,060 m² of MICE, brand launch, conference, gala, fashion show, and exhibition event spaces across 3 floors (up to 850 guests), alongside a cultural center and digital archive. Public visiting days: Tuesday through Saturday (closed Sunday and Monday). Please contact the cultural center for visiting hours.',
            maximumAttendeeCapacity: 850,
            floorSize: {
                '@type': 'QuantitativeValue',
                value: 1060,
                unitCode: 'MTK',
            },
            telephone: '+90 212 244 86 36',
            email: 'info@galatarumokulu.org',
            address: schoolPostalAddress,
            geo: {
                '@type': 'GeoCoordinates',
                latitude: '41.0238',
                longitude: '28.9774',
            },
            amenityFeature: [
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'Total Net Event Space (Levels 1–3 Buyout)',
                    value: '1,060 m² across 13 distinct halls, 3 foyers, and 2 open courtyards',
                },
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'Cocktail Reception Capacity',
                    value: '850 Guests (Buyout) / 450 (Level 3) / 350 (Level 1) / 250 (Level 2)',
                },
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'Theater & Conference Capacity',
                    value: '650 Guests (Buyout) / 320 (Level 3) / 250 (Level 1) / 140 (Level 2)',
                },
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'Seated Gala Dinner Capacity',
                    value: '450 Guests (Buyout) / 220 (Level 3) / 160 (Level 1) / 90 (Level 2)',
                },
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'AV & Three-Phase Power',
                    value: '3×63A (Levels 1 & 3) and 3×32A (Level 2) 3-Phase AV Panels',
                },
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'Connectivity & Broadcast',
                    value: 'Symmetric Fiber Wi-Fi 6 & Dedicated Live-Stream Ethernet Line',
                },
                {
                    '@type': 'LocationFeatureSpecification',
                    name: 'Heritage Protection Classification',
                    value: '2nd-Degree Registered Historic Monument (2. Derece Tarihi Eser) — Sensitive Non-Invasive Setup Required',
                },
            ],
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'MICE, Brand Launch & Cultural Venue Hire Formats',
                itemListElement: [
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'MICE Conferences, Congresses & Corporate Summits' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Global Brand Launches, Press Previews & PR Showcases' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Gala Dinners, Award Ceremonies & Diplomatic Receptions' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fashion Shows, Editorial Photo/Film Productions & Design Weeks' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'International Art Exhibitions, Biennials & Curatorial Programs' } },
                ],
            },
            containsPlace: archiveEntity,
            sameAs: [
                'https://www.instagram.com/galatarumokulukulturmerkezi/',
                'https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu',
            ],
        },
        {
            '@type': 'Restaurant',
            '@id': `${PRODUCTION_SITE_ORIGIN}/#simone-restaurant`,
            name: 'Simone Restaurant',
            url: 'https://www.simoneistanbul.com/',
            sameAs: ['https://www.simoneistanbul.com/'],
            description:
                'Independent rooftop restaurant located on the terrace level of the historic Galata building. Open Tuesday through Sunday from 17:00 to 00:00 (closed on Monday), operating independently of the school’s public exhibition and archive visiting schedule.',
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    opens: '17:00',
                    closes: '00:00',
                },
            ],
            containedInPlace: {
                '@id': `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
            },
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'İstanbul',
                addressRegion: 'Beyoğlu',
                postalCode: '34425',
                addressCountry: 'TR',
            },
        },
    ];

    if (basePath.startsWith('/arsiv')) {
        graph.push(archiveEntity);
    }

    if (basePath === '/mekan-kiralama') {
        const faqEntries =
            lang === 'tr'
                ? [
                      {
                          q: 'MICE ve marka etkinlikleri için toplam kiralanabilir alan ve maksimum kapasite nedir?',
                          a: 'Galata Rum Okulu, 1., 2. ve 3. etkinlik katlarında toplam 1.060 m² net (2.194 m² brüt) kiralanabilir alan sunar. Tüm etkinlik katlarının bütüncül kiralanmasında (Buyout) kokteyl düzeninde 850 kişi, tiyatro/konferans düzeninde 650 kişi, oturmalı gala düzeninde 450 kişi, sınıf düzeninde 300 kişi ve U-masa düzeninde 150 kişi ağırlanabilmektedir.',
                      },
                      {
                          q: 'Prodüksiyon, ses/ışık (AV), elektrik gücü ve 2. derece tarihi eser koruma kuralları nelerdir?',
                          a: 'Galata Rum Okulu, 2. derece tescilli tarihi eser statüsünde koruma altında bir yapıdır; bu nedenle etkinlik öncesi tüm hazırlık, yükleme, dekor, ses/ışık (AV) ve sahne kurulum süreçlerinde tarihi dokuya karşı azami hassasiyet gösterilmesi zorunludur. Duvar, tavan ve zemin yüzeylerine çivi, vida veya yapıştırıcı uygulanamaz; tüm kurulumlar ground-support sistemlerle gerçekleştirilir. 1. ve 3. katlarda 3×63A trifaze, 2. katta 3×32A trifaze AV enerji panoları, simetrik fiber Wi-Fi 6 ve çift yönlü engelli erişimli asansörler mevcuttur.',
                      },
                      {
                          q: 'Gala yemekleri ve kurumsal davetlerde catering hizmeti nasıl sağlanır?',
                          a: '1. katta profesyonel servis mutfağı (11,10 m²) ve iki açık hava fuaye avlusu (28 m² + 37 m²) yer almaktadır. Ayrıca binanın teras katında bağımsız olarak hizmet veren Simone Restaurant’tan (simoneistanbul.com) etkinlik ve lansmanlar için doğrudan catering hizmeti alınabilmektedir.',
                      },
                  ]
                : lang === 'el'
                  ? [
                        {
                            q: 'Ποιος είναι ο συνολικός διαθέσιμος χώρος και η μέγιστη χωρητικότητα για εκδηλώσεις MICE;',
                            a: 'Η Ελληνική Σχολή Γαλατά προσφέρει 1.060 m² καθαρού χώρου εκδηλώσεων στους Ορόφους 1, 2 και 3. Σε αποκλειστική χρήση (Buyout) φιλοξενεί έως 850 άτομα σε κοκτέιλ, 650 σε θεατρική διάταξη, 450 σε δείπνο γκαλά, 300 σε διάταξη τάξης και 150 σε διάταξη συνεδρίασης.',
                        },
                        {
                            q: 'Ποιες είναι οι τεχνικές προδιαγραφές ηλεκτρικής ισχύος, AV και προστασίας του διατηρητέου μνημείου Β΄ κατηγορίας;',
                            a: 'Η Ελληνική Σχολή Γαλατά είναι διατηρητέο ιστορικό μνημείο Β΄ κατηγορίας (2. derece tarihi eser) και απαιτείται μέγιστη προσοχή και ευαισθησία σε όλες τις προετοιμασίες και εγκαταστάσεις με αποκλειστική χρήση επιδαπέδιων συστημάτων (ground-support). Οι Όροφοι 1 και 3 διαθέτουν τριφασικούς πίνακες 3×63A και ο 2ος Όροφος 3×32A, συμμετρικό Fiber Wi-Fi 6 και διπλούς ανελκυστήρες ΑμεΑ.',
                        },
                    ]
                  : [
                        {
                            q: 'What is the total rentable event space and maximum capacity for MICE and brand events?',
                            a: 'Galata Greek School offers 1,060 m² of net rentable event space (2,194 m² gross) across Levels 1, 2, and 3. In a full 3-floor buyout, the venue accommodates up to 850 guests for cocktail receptions, 650 in theater/conference setup, 450 for seated gala dinners, 300 in classroom setup, and 150 in boardroom setup.',
                        },
                        {
                            q: 'What are the AV production, power supply, and 2nd-degree listed heritage building rules?',
                            a: 'Galata Greek School is a protected 2nd-degree registered historic monument (2. derece tarihi eser); all pre-event preparations, load-in/load-out logistics, and AV/staging setups must be executed with the utmost sensitivity using non-invasive ground-support systems. Levels 1 and 3 provide 3×63A three-phase power panels and Level 2 provides a 3×32A three-phase panel, complemented by symmetric Fiber Wi-Fi 6 and dual PRM elevators.',
                        },
                        {
                            q: 'How is catering handled for corporate galas, brand launches, and receptions?',
                            a: 'Level 1 includes a dedicated catering service kitchen (11.10 m²) and two open-air foyer courtyards (28 m² + 37 m²), with direct in-house catering available via rooftop Simone Restaurant (simoneistanbul.com).',
                        },
                    ];

        graph.push({
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}#faq`,
            mainEntity: faqEntries.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.a,
                },
            })),
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}

/**
 * Generates semantic, crawler-accessible prerendered HTML content (>= 165 words, valid H1->H2 hierarchy,
 * internal navigation links, Heritage SEO semantic proximity, and 0 fabricated clock hours).
 * Replaced automatically on client hydration by React root.
 */
function buildSemanticPrerenderMain({
    lang,
    h1,
    description,
    canonicalPath,
    trPath,
    enPath,
    elPath,
    extraBodyText = '',
    hubLinksHtml = '',
}) {
    const navItems = [
        { path: '/', label: { tr: 'Ana Sayfa', en: 'Home', el: 'Αρχική Σελίδα' } },
        { path: '/tarihce', label: { tr: 'Tarihçe', en: 'History', el: 'Ιστορία' } },
        { path: '/arsiv', label: { tr: 'Dijital Arşiv', en: 'Digital Archive', el: 'Ψηφιακό Αρχείο' } },
        { path: '/arsiv/koleksiyon', label: { tr: 'Okul Koleksiyonu', en: 'School Collection', el: 'Συλλογή Σχολείου' } },
        { path: '/arsiv/istanbul-rum', label: { tr: 'İstanbul Rumları Arşivi', en: 'Istanbul Greeks Archive', el: 'Αρχείο Ελλήνων Κωνσταντινούπολης' } },
        { path: '/mekan-kiralama', label: { tr: 'Mekan Kiralama', en: 'Historic Venue Hire', el: 'Ενοικίαση Χώρου' } },
        { path: '/gecmis-etkinlikler', label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' } },
        { path: '/ammf', label: { tr: 'AMMF Vakfı', en: 'AMMF Foundation', el: 'Ίδρυμα AMMF' } },
        { path: '/bize-ulasin', label: { tr: 'Bize Ulaşın', en: 'Contact Us', el: 'Επικοινωνία' } },
        { path: '/kvkk', label: { tr: 'KVKK', en: 'PDPL (KVKK)', el: 'KVKK' } },
        { path: '/gizlilik-politikasi', label: { tr: 'Gizlilik Politikası', en: 'Privacy Policy', el: 'Πολιτική Απορρήτου' } },
        { path: '/cerez-politikasi', label: { tr: 'Çerez Politikası', en: 'Cookie Policy', el: 'Πολιτική Cookies' } },
    ];

    const navLinks = navItems
        .map((item) => {
            const href = localizeRoute(item.path, lang);
            return `<li><a href="${escapeHtml(href)}">${escapeHtml(item.label[lang])}</a></li>`;
        })
        .join('');

    const langSwitchLinks = `
      <ul>
        <li><a href="${escapeHtml(trPath)}" hreflang="tr">Türkçe</a></li>
        <li><a href="${escapeHtml(enPath)}" hreflang="en">English</a></li>
        <li><a href="${escapeHtml(elPath)}" hreflang="el">Ελληνικά</a></li>
      </ul>`;

    const institutionalCopy =
        lang === 'tr'
            ? {
                  sec1Title: 'Tarihi Miras, Kültürel Koruma ve Dijital Bellek',
                  sec1Body:
                      '1885 yılında temelleri atılan ve 1910 yılında neoklasik mimarisiyle kapılarını açan Galata Rum Okulu Vakfı - Kültür Merkezi, İstanbul Beyoğlu ve Karaköy bölgesinde Rum toplumunun eğitim, tarih ve kültürel mirasını koruma vizyonuyla faaliyet göstermektedir. Athanasios ve Marina Martinou Vakfı (AMMF) işbirliğiyle gerçekleştirilen kapsamlı mimari restorasyon sonrasında yapı; çağdaş sanat sergileri, uluslararası bienaller, akademik sempozyumlar, klasik müzik konserleri ve açık erişimli dijital arşiv araştırmaları için yaşayan bir kültür merkezine dönüştürülmüştür. Okul koleksiyonu ve İstanbul Rumları arşivi, yüz yılı aşkın kurumsal hafızayı, tarihi fotoğrafları, diplomaları ve eğitim belgelerini araştırmacılarla buluşturur.',
                  sec2Title: 'Mekan Kiralama, Etkinlik Alanları ve Ziyaret Bilgileri',
                  sec2Body:
                      'Üç katta toplam 1.060 m² tarihi etkinlik alanına ve 850 kişiye varan ağırlama kapasitesine sahip anıtsal binamız, kurumsal davetler, sergiler ve konferanslar için seçkin bir atmosfer sunar. Galata Rum Okulu sergi ve kültür merkezi alanları Salı–Cumartesi günleri ziyarete açıktır; Pazar ve Pazartesi günleri kapalıdır. Ziyaret saatleri için lütfen bizimle iletişime geçin. Teras katında yer alan bağımsız Simone Restaurant ise okulun sergi ve arşiv ziyaret düzeninden bağımsız olarak Pazartesi hariç her gün (Salı–Pazar) 17.00–00.00 saatleri arasında açıktır. Resmi adresimiz: Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / İstanbul. Telefon: +90 212 244 86 36.',
                  navHeading: 'Kurumsal Bağlantılar ve Bölüm Rehberi',
              }
            : lang === 'el'
              ? {
                    sec1Title: 'Ιστορική Κληρονομιά, Πολιτιστική Διατήρηση και Ψηφιακό Αρχείο',
                    sec1Body:
                        'Με ρίζες από το 1885 και εγκαίνια το 1910 ως εμβληματικό νεοκλασικό κτίριο, το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο διαφυλάσσει την εκπαιδευτική ιστορία και την πολιτιστική κληρονομιά της ελληνικής κοινότητας της Κωνσταντινούπολης στον Γαλατά και το Καράκιοϊ. Μετά την ολοκληρωμένη αρχιτεκτονική αποκατάσταση σε συνεργασία με το Ίδρυμα Αθανάσιος και Μαρίνα Μαρτίνου (AMMF), το ιστορικό σχολικό κτίριο λειτουργεί ως ζωντανό κέντρο σύγχρονης τέχνης, διεθνών μπιενάλε, ακαδημαϊκών συνεδρίων, συναυλιών και ανοιχτού ψηφιακού αρχείου τεκμηρίων, διπλωμάτων και ιστορικών φωτογραφιών.',
                    sec2Title: 'Ενοικίαση Ιστορικού Χώρου Εκδηλώσεων και Ημέρες Επίσκεψης',
                    sec2Body:
                        'Το μνημειακό κτίριο διαθέτει 1.060 m² ιστορικών αιθουσών σε τρεις ορόφους με χωρητικότητα έως 850 επισκέπτες για εκθέσεις, συνέδρια και δεξιώσεις υψηλού κύρους. Οι εκθεσιακοί και πολιτιστικοί χώροι της Ελληνικής Σχολής Γαλατά είναι ανοιχτά για το κοινό Τρίτη–Σάββατο και κλειστά Κυριακή και Δευτέρα. Για τις ώρες επίσκεψης, παρακαλούμε επικοινωνήστε μαζί μας. Το ανεξάρτητο Simone Restaurant στην ταράτσα είναι ανοιχτό Τρίτη–Κυριακή 17:00–00:00 (Δευτέρα κλειστά), ανεξάρτητα από το ωράριο εκθέσεων της Σχολής. Διεύθυνση: Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı No:25, 34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη. Τηλέφωνο: +90 212 244 86 36.',
                    navHeading: 'Πλοήγηση Ιστοτόπου και Ενότητες Αρχείου',
                }
              : {
                    sec1Title: 'Historical Heritage, Cultural Preservation, and Digital Archive',
                    sec1Body:
                        'Tracing its origins to 1885 and inaugurated in 1910 as a monumental neoclassical landmark, the Galata Greek School Foundation - Cultural Center is dedicated to the history, educational heritage, and cultural preservation of the Greek community of Istanbul in Karaköy and Beyoğlu. Following a comprehensive architectural restoration supported by the Athanasios and Marina Martinou Foundation (AMMF), the historic school building serves as a vibrant cultural venue for international art exhibitions, the Istanbul Biennial, academic symposia, concerts, and an open-access digital archive of historical photographs, registers, and diplomas.',
                    sec2Title: 'Historic Event Venue Hire, Capacities, and Visiting Days',
                    sec2Body:
                        'Offering 1,060 m² of heritage event spaces across three floors with a maximum capacity of 850 guests, our neoclassical halls host distinguished exhibitions, conferences, and receptions. Galata Greek School cultural center and exhibition spaces are open to visitors Tuesday–Saturday and closed on Sunday and Monday; please contact us for visiting hours. Simone Restaurant on the rooftop terrace operates independently and is open Tuesday–Sunday from 17:00 to 00:00 (closed on Monday). Official address: Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / Istanbul. Telephone: +90 212 244 86 36.',
                    navHeading: 'Institutional Navigation and Archive Directory',
                };

    return `<div id="root"><main data-prerender-shell="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
      <article>
        <h1>${escapeHtml(h1)}</h1>
        <p>${escapeHtml(description)}</p>
        ${extraBodyText ? `<p>${escapeHtml(extraBodyText)}</p>` : ''}
        <section>
          <h2>${escapeHtml(institutionalCopy.sec1Title)}</h2>
          <p>${escapeHtml(institutionalCopy.sec1Body)} <a href="https://www.iamm.gr/en/" target="_blank" rel="noopener noreferrer">${lang === 'tr' ? 'Athanasios ve Marina Martinou Vakfı (AMMF)' : lang === 'el' ? 'Ίδρυμα Αθανάσιος και Μαρίνα Μαρτίνου (AMMF)' : 'Athanasios and Marina Martinou Foundation (AMMF)'}</a>.</p>
        </section>
        <section>
          <h2>${escapeHtml(institutionalCopy.sec2Title)}</h2>
          <p>${escapeHtml(institutionalCopy.sec2Body)} <a href="https://www.simoneistanbul.com/" target="_blank" rel="noopener noreferrer">Simone Restaurant</a> · <a href="tel:+902122448636">+90 212 244 86 36</a> · <a href="mailto:info@galatarumokulu.org">info@galatarumokulu.org</a>.</p>
        </section>
        <nav aria-label="${escapeHtml(institutionalCopy.navHeading)}">
          <h2>${escapeHtml(institutionalCopy.navHeading)}</h2>
          <ul>${navLinks}</ul>
          ${langSwitchLinks}
        </nav>
        ${hubLinksHtml}
      </article>
    </main></div>`;
}

function buildRouteHtml(templateHtml, meta) {
    const {
        lang,
        title,
        description,
        h1,
        canonicalPath,
        trPath,
        enPath,
        elPath,
        ogImage = DEFAULT_OG_IMAGE,
        noindex = false,
        schema = null,
        extraBodyText = '',
        hubLinksHtml = '',
    } = meta;

    const canonicalUrl = `${PRODUCTION_SITE_ORIGIN}${canonicalPath}`;
    const trUrl = `${PRODUCTION_SITE_ORIGIN}${trPath}`;
    const enUrl = `${PRODUCTION_SITE_ORIGIN}${enPath}`;
    const elUrl = `${PRODUCTION_SITE_ORIGIN}${elPath}`;
    const ogLocale = lang === 'tr' ? 'tr_TR' : lang === 'el' ? 'el_GR' : 'en_US';
    const robotsValue = noindex ? 'noindex, nofollow' : 'index, follow';

    const headInjection = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}" />`,
        `<meta name="robots" content="${robotsValue}" />`,
        `<meta name="prerender-route" content="${escapeHtml(canonicalPath)}" />`,
        `<meta name="prerender-title" content="${escapeHtml(title)}" />`,
        `<meta name="prerender-description" content="${escapeHtml(description)}" />`,
        !noindex ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />` : '',
        !noindex ? `<link rel="alternate" hreflang="tr" href="${escapeHtml(trUrl)}" />` : '',
        !noindex ? `<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />` : '',
        !noindex ? `<link rel="alternate" hreflang="el" href="${escapeHtml(elUrl)}" />` : '',
        !noindex ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(trUrl)}" />` : '',
        !noindex && canonicalPath === '/'
            ? `<link rel="alternate" type="text/markdown" href="/index.md" title="Markdown" />`
            : '',
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${escapeHtml(INSTITUTION_NAME[lang])}" />`,
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
        `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
        `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
        `<meta property="og:locale" content="${ogLocale}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
        `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
        schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : '',
    ]
        .filter(Boolean)
        .join('\n  ');

    let html = templateHtml.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`);
    html = html.replace(/<title>[\s\S]*?<\/title>/i, headInjection);

    const ssrFallback = buildSemanticPrerenderMain({
        lang,
        h1,
        description,
        canonicalPath,
        trPath,
        enPath,
        elPath,
        extraBodyText,
        hubLinksHtml,
    });
    html = html.replace('<div id="root"></div>', ssrFallback);

    return html;
}

function writeRouteFile(distDir, routePath, htmlContent) {
    const cleanRoute = routePath === '/' ? '' : routePath.replace(/^\/+/, '');
    const targetDir = cleanRoute ? path.join(distDir, cleanRoute) : distDir;
    fs.mkdirSync(targetDir, { recursive: true });
    const outPath = path.join(targetDir, 'index.html');
    fs.writeFileSync(outPath, htmlContent, 'utf8');
}

function run() {
    const distDir = path.join(__dirname, 'dist');
    const indexHtmlPath = path.join(distDir, 'index.html');
    const appHtmlPath = path.join(distDir, 'app.html');

    if (!fs.existsSync(indexHtmlPath)) {
        console.error('dist/index.html not found! Run vite build first.');
        process.exit(1);
    }

    // Read clean Vite-generated template by stripping any previously injected head tags or prerender shell
    let rawIndexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    // Reconstruct clean base template if index.html was already pre-rendered
    rawIndexHtml = rawIndexHtml
        .replace(
            /<title>[\s\S]*?<meta name="twitter:image"[^>]*>\s*(?:<script type="application\/ld\+json">[\s\S]*?<\/script>)?/i,
            '<title>Galata Rum Okulu Vakfı | Kültür Merkezi & Dijital Arşiv</title>'
        )
        .replace(/<div id="root">[\s\S]*?<\/main><\/div>/i, '<div id="root"></div>');

    const baseTemplate = rawIndexHtml;

    const adminSpecs = {
        tr: {
            path: '/admin',
            title: 'Galata CMS — Yönetici Paneli | Galata Rum Okulu',
            description:
                'Galata Rum Okulu Vakfı - Kültür Merkezi kurumsal içerik, sergi ve dijital arşiv yönetim paneli giriş ekranı.',
            h1: 'Galata CMS — Yönetici Paneli',
        },
        en: {
            path: '/en/admin',
            title: 'Galata CMS — Admin Portal | Galata Greek School',
            description:
                'Galata Greek School Foundation - Cultural Center institutional content, exhibition, and digital archive management portal.',
            h1: 'Galata CMS — Admin Portal',
        },
        el: {
            path: '/el/admin',
            title: 'Galata CMS — Πύλη Διαχείρισης | Σχολή Γαλατά',
            description:
                'Πύλη διαχείρισης περιεχομένου, εκθέσεων και ψηφιακού αρχείου του Ιδρύματος Ελληνικού Σχολείου Γαλατά.',
            h1: 'Galata CMS — Πύλη Διαχείρισης',
        },
    };
    for (const lang of ['tr', 'en', 'el']) {
        const spec = adminSpecs[lang];
        const html = buildRouteHtml(baseTemplate, {
            lang,
            title: spec.title,
            description: spec.description,
            h1: spec.h1,
            canonicalPath: spec.path,
            trPath: '/admin',
            enPath: '/en/admin',
            elPath: '/el/admin',
            noindex: true,
            schema: null,
        });
        if (lang === 'tr') {
            fs.writeFileSync(appHtmlPath, html, 'utf8');
        }
        writeRouteFile(distDir, spec.path, html);
    }
    console.log('Generated dist/app.html and localized /admin, /en/admin, /el/admin with noindex, nofollow');

    const snapshotPath = path.join(__dirname, 'src', 'data', 'seoRouteSnapshot.json');
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    const events = snapshot.events || [];
    const artifacts = snapshot.artifacts || [];

    const usedTitles = new Set();
    const usedDescriptions = new Set();

    const sitemapEntries = [];
    const seenLocs = new Set();
    let writtenCount = 0;

    const addSitemapEntry = (loc, trPath, enPath, elPath, changefreq, priority) => {
        if (seenLocs.has(loc)) return;
        seenLocs.add(loc);
        sitemapEntries.push({
            loc,
            trUrl: `${PRODUCTION_SITE_ORIGIN}${trPath}`,
            enUrl: `${PRODUCTION_SITE_ORIGIN}${enPath}`,
            elUrl: `${PRODUCTION_SITE_ORIGIN}${elPath}`,
            changefreq,
            priority,
        });
    };

    const chunkUlLists = (liItems, size = 40) => {
        const chunks = [];
        for (let i = 0; i < liItems.length; i += size) {
            chunks.push(`<ul>${liItems.slice(i, i + size).join('')}</ul>`);
        }
        return chunks.join('');
    };

    // Pre-build hub directory links for /gecmis-etkinlikler and /arsiv* so every dynamic route is linked in static HTML
    const buildEventHubLinks = (lang) => {
        const items = events.map((evt) => {
            const href = localizeRoute(`/gecmis-etkinlikler/${evt.slug}`, lang);
            const t = (lang === 'tr' ? evt.title_tr : lang === 'el' ? evt.title_el : evt.title_en) || evt.title_tr;
            return `<li><a href="${escapeHtml(href)}">${escapeHtml(t)}</a></li>`;
        });
        return `<section><h2>${lang === 'tr' ? 'Tüm Sergi ve Etkinlik Kayıtları' : lang === 'el' ? 'Όλες οι Εκθέσεις και Εκδηλώσεις' : 'All Exhibition and Event Records'}</h2>${chunkUlLists(items, 40)}</section>`;
    };

    const buildArtifactHubLinks = (lang) => {
        const items = artifacts.map((art) => {
            const href = localizeRoute(`/arsiv/eser/${art.id}`, lang);
            const t = (lang === 'tr' ? art.title_tr : lang === 'el' ? art.title_el : art.title_en) || art.title_tr;
            return `<li><a href="${escapeHtml(href)}">${escapeHtml(t)} (${escapeHtml(art.id.slice(0, 8))})</a></li>`;
        });
        return `<section><h2>${lang === 'tr' ? 'Dijital Arşiv Eser Dizini' : lang === 'el' ? 'Κατάλογος Ψηφιακών Τεκμηρίων' : 'Digital Archive Artifact Directory'}</h2>${chunkUlLists(items, 40)}</section>`;
    };

    const buildVenueMicePrerenderSection = (lang) => {
        if (lang === 'tr') {
            return `<section>
              <h2>MICE, Marka Lansmanı ve Kurumsal Etkinlik Çözümleri</h2>
              <p>İstanbul Karaköy Kemeraltı Caddesi No:25 adresinde yükselen 1910 tarihli anıtsal neoklasik Galata Rum Okulu Kültür Merkezi; MICE acenteleri, küresel markalar, ürün ve basın lansmanları, kurumsal zirveler, gala yemekleri, moda defileleri, uluslararası sanat sergileri ve bienaller için 3 etkinlik katında toplam 1.060 m² net (2.194 m² brüt) kiralanabilir alan sunar.</p>
              <h3>Kat Bazlı Kapasite ve Teknik Altyapı Karşılaştırma Tablosu</h3>
              <table>
                <thead>
                  <tr><th>Etkinlik Katı</th><th>Net Alan</th><th>Kokteyl</th><th>Tiyatro / Konferans</th><th>Gala Yemeği</th><th>Sınıf / U-Masa</th><th>Tavan &amp; Enerji</th></tr>
                </thead>
                <tbody>
                  <tr><td>Kat 1 — Çok Amaçlı Büyük Salon &amp; Fuaye</td><td>227 + 100 m²</td><td>350</td><td>250</td><td>160</td><td>120 / 60</td><td>6.26 m • 3×63A</td></tr>
                  <tr><td>Kat 2 — 3 Sergi/Seminer Salonu, Fuaye &amp; Balkon</td><td>275 m²</td><td>250</td><td>140</td><td>90</td><td>100 / 75</td><td>4.11 m • 3×32A</td></tr>
                  <tr><td>Kat 3 — 9 Sergi Salonu &amp; Merkez Fuaye</td><td>458 m²</td><td>450</td><td>320</td><td>220</td><td>180 / 80</td><td>3.97 m • 3×63A</td></tr>
                  <tr><td>Tüm Etkinlik Katları (Kat 1 + 2 + 3 Bütüncül Kullanım)</td><td>1.060 m²</td><td>850</td><td>650</td><td>450</td><td>300 / 150</td><td>3.97–6.26 m • 2×63A + 32A</td></tr>
                </tbody>
              </table>
              <h3>Ulaşım, Konum ve Lojistik Mesafeleri</h3>
              <p>Galataport İstanbul Kruvaziyer Limanı ve otoparkına 400 m (5 dk yürüyüş), Tophane T1 Tramvay İstasyonu’na 250 m (3 dk yürüyüş), Karaköy Vapur İskelesi ve Tarihi Tünel Füniküler hattına 500 m (6 dk yürüyüş) mesafededir. Keşif ve teklif için <a href="/bize-ulasin">Bize Ulaşın</a> sayfasından başvurabilirsiniz.</p>
            </section>`;
        }
        if (lang === 'el') {
            return `<section>
              <h2>Λύσεις για Συνέδρια MICE, Παρουσιάσεις Επωνυμίας &amp; Εταιρικές Εκδηλώσεις</h2>
              <p>Το μνημειακό νεοκλασικό κτίριο του 1910 στην οδό Kemeraltı No:25 στο Καράκιοϊ Κωνσταντινούπολης προσφέρει 1.060 m² καθαρού χώρου σε 3 ορόφους εκδηλώσεων με χωρητικότητα έως 850 επισκέπτες για γραφεία MICE, παρουσιάσεις επωνυμίας (brand launches), συνέδρια, δείπνα γκαλά, επιδείξεις μόδας και διεθνείς εκθέσεις.</p>
              <h3>Συγκριτικός Πίνακας Χωρητικότητας &amp; Τεχνικών Προδιαγραφών ανά Όροφο</h3>
              <table>
                <thead>
                  <tr><th>Όροφος Εκδηλώσεων</th><th>Καθαρό Εμβαδόν</th><th>Κοκτέιλ</th><th>Θέατρο / Συνέδριο</th><th>Δείπνο Γκαλά</th><th>Τάξη / Π</th><th>Ύψος &amp; Ισχύς</th></tr>
                </thead>
                <tbody>
                  <tr><td>1ος Όροφος — Μεγάλη Αίθουσα &amp; Φουαγιέ</td><td>227 + 100 m²</td><td>350</td><td>250</td><td>160</td><td>120 / 60</td><td>6.26 m • 3×63A</td></tr>
                  <tr><td>2ος Όροφος — 3 Αίθουσες, Φουαγιέ &amp; Εξώστης</td><td>275 m²</td><td>250</td><td>140</td><td>90</td><td>100 / 75</td><td>4.11 m • 3×32A</td></tr>
                  <tr><td>3ος Όροφος — 9 Αίθουσες Εκθέσεων &amp; Φουαγιέ</td><td>458 m²</td><td>450</td><td>320</td><td>220</td><td>180 / 80</td><td>3.97 m • 3×63A</td></tr>
                  <tr><td>Όλοι οι Όροφοι Εκδηλώσεων (1 + 2 + 3)</td><td>1.060 m²</td><td>850</td><td>650</td><td>450</td><td>300 / 150</td><td>3.97–6.26 m • 2×63A + 32A</td></tr>
                </tbody>
              </table>
              <h3>Πρόσβαση &amp; Τοποθεσία</h3>
              <p>Σε απόσταση 400 m από το Galataport, 250 m από τον σταθμό τραμ T1 Tophane και 500 m από την αποβάθρα Καράκιοϊ.</p>
            </section>`;
        }
        return `<section>
          <h2>MICE, Brand Launches &amp; Corporate Event Solutions in Istanbul</h2>
          <p>Located at Kemeraltı Caddesi No:25 in Karaköy, Istanbul, the 1910 neoclassical Galata Greek School Cultural Center offers 1,060 m² of net rentable space (2,194 m² gross) across 3 event floors with capacity for up to 850 guests — designed for MICE agencies, global brand launches, press previews, corporate summits, gala dinners, fashion shows, and international art exhibitions.</p>
          <h3>Floor-by-Floor Capacity &amp; Technical Specifications Matrix</h3>
          <table>
            <thead>
              <tr><th>Event Level &amp; Space</th><th>Net Area</th><th>Cocktail</th><th>Theater</th><th>Gala Dinner</th><th>Classroom / Boardroom</th><th>Ceiling &amp; Power</th></tr>
            </thead>
            <tbody>
              <tr><td>Level 1 — Grand Multipurpose Hall &amp; Foyer</td><td>227 + 100 m²</td><td>350</td><td>250</td><td>160</td><td>120 / 60</td><td>6.26 m • 3×63A</td></tr>
              <tr><td>Level 2 — 3 Breakout/Exhibition Halls &amp; Balcony</td><td>275 m²</td><td>250</td><td>140</td><td>90</td><td>100 / 75</td><td>4.11 m • 3×32A</td></tr>
              <tr><td>Level 3 — 9 Exhibition Galleries &amp; Central Foyer</td><td>458 m²</td><td>450</td><td>320</td><td>220</td><td>180 / 80</td><td>3.97 m • 3×63A</td></tr>
              <tr><td>All Event Floors Combined (Levels 1 + 2 + 3)</td><td>1,060 m²</td><td>850</td><td>650</td><td>450</td><td>300 / 150</td><td>3.97–6.26 m • 2×63A + 32A</td></tr>
            </tbody>
          </table>
          <h3>Transport &amp; Logistics Access</h3>
          <p>Situated 400 m (5-min walk) from Galataport Istanbul Cruise Terminal, 250 m (3-min walk) from Tophane T1 Tram Station, and 500 m (6-min walk) from Karaköy Ferry Terminal &amp; Tünel Funicular. Contact our team via <a href="/en/bize-ulasin">Contact Us</a> to schedule a site inspection or request a proposal.</p>
        </section>`;
    };

    // 1. Static Pages (12 x 3 = 36 routes)
    for (const page of STATIC_PAGES) {
        const trPath = localizeRoute(page.basePath, 'tr');
        const enPath = localizeRoute(page.basePath, 'en');
        const elPath = localizeRoute(page.basePath, 'el');

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(page.basePath, lang);
            const title = page.title[lang];
            const description = page.description[lang];
            usedTitles.add(title.toLowerCase());
            usedDescriptions.add(description.toLowerCase());

            let hubLinksHtml = '';
            if (page.basePath === '/gecmis-etkinlikler') {
                hubLinksHtml = buildEventHubLinks(lang);
            } else if (page.basePath.startsWith('/arsiv')) {
                hubLinksHtml = buildArtifactHubLinks(lang);
            } else if (page.basePath === '/mekan-kiralama') {
                hubLinksHtml = buildVenueMicePrerenderSection(lang);
            }

            const html = buildRouteHtml(baseTemplate, {
                lang,
                title,
                description,
                h1: page.h1[lang],
                canonicalPath: routePath,
                trPath,
                enPath,
                elPath,
                schema: buildInstitutionalSchema(`${PRODUCTION_SITE_ORIGIN}${routePath}`, page.basePath, lang),
                hubLinksHtml,
            });
            writeRouteFile(distDir, routePath, html);
            writtenCount++;
            addSitemapEntry(
                `${PRODUCTION_SITE_ORIGIN}${routePath}`,
                trPath,
                enPath,
                elPath,
                page.changefreq,
                page.priority
            );
        }
    }

    // 2. Dynamic Event Pages (100 x 3 = 300 stabilized slug routes + UUID alias routes)
    for (let i = 0; i < events.length; i++) {
        const evt = events[i];
        const slug = evt.slug;
        const basePath = `/gecmis-etkinlikler/${slug}`;
        const trPath = localizeRoute(basePath, 'tr');
        const enPath = localizeRoute(basePath, 'en');
        const elPath = localizeRoute(basePath, 'el');
        const yearStr = evt.event_date ? String(evt.event_date).slice(0, 4) : '';
        const shortDisambig = yearStr || slug.slice(0, 6);

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(basePath, lang);
            const rawTitle =
                (lang === 'tr' ? evt.title_tr : lang === 'el' ? evt.title_el : evt.title_en) || evt.title_tr;
            const fullTitle = ensureUniqueBoundedTitle(rawTitle, lang, shortDisambig, usedTitles);

            const rawEvtDesc =
                (lang === 'tr' ? evt.description_tr : lang === 'el' ? evt.description_el : evt.description_en) ||
                evt.description_tr ||
                '';
            const baseDescText =
                lang === 'tr'
                    ? `${rawTitle}${yearStr ? ` (${yearStr})` : ''} — ${INSTITUTION_NAME.tr} geçmiş sergi ve etkinlik arşivi kaydı.`
                    : lang === 'el'
                      ? `${rawTitle}${yearStr ? ` (${yearStr})` : ''} — Αρχείο εκθέσεων και εκδηλώσεων στο ${INSTITUTION_NAME.el}.`
                      : `${rawTitle}${yearStr ? ` (${yearStr})` : ''} — Past exhibition and cultural event hosted at ${INSTITUTION_NAME.en}.`;

            const desc = ensureUniqueBoundedDescription(
                baseDescText,
                rawTitle,
                lang,
                slug.slice(0, 8),
                usedDescriptions
            );

            const normalizedEventImage = normalizePrerenderMediaUrl(evt.cover_image_url);
            const eventSchema = {
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: rawTitle,
                description: desc,
                url: `${PRODUCTION_SITE_ORIGIN}${routePath}`,
                startDate: evt.event_date || '',
                image: normalizedEventImage,
                location: {
                    '@type': ['Place', 'EventVenue'],
                    name: INSTITUTION_NAME[lang],
                    maximumAttendeeCapacity: 850,
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, Karaköy',
                        addressLocality: 'İstanbul',
                        addressRegion: 'Beyoğlu',
                        postalCode: '34425',
                        addressCountry: 'TR',
                    },
                },
                organizer: {
                    '@type': 'Organization',
                    name: INSTITUTION_NAME[lang],
                    url: PRODUCTION_SITE_ORIGIN,
                },
            };

            const html = buildRouteHtml(baseTemplate, {
                lang,
                title: fullTitle,
                description: desc,
                h1: rawTitle,
                canonicalPath: routePath,
                trPath,
                enPath,
                elPath,
                ogImage: normalizedEventImage,
                schema: eventSchema,
                extraBodyText: rawEvtDesc ? `${rawEvtDesc.slice(0, 600)} (${slug})` : `Etkinlik kodu: ${slug}`,
            });

            writeRouteFile(distDir, routePath, html);
            writtenCount++;
            addSitemapEntry(`${PRODUCTION_SITE_ORIGIN}${routePath}`, trPath, enPath, elPath, 'monthly', '0.6');

            // If this event's UUID differs from its stabilized slug, also write the UUID alias route pointing canonical to the stabilized slug
            if (evt.id && evt.id !== slug) {
                const uuidRoutePath = localizeRoute(`/gecmis-etkinlikler/${evt.id}`, lang);
                writeRouteFile(distDir, uuidRoutePath, html);
            }
        }
    }

    // 3. Verified Artifact Detail Pages (72 x 3 = 216 routes)
    for (let i = 0; i < artifacts.length; i++) {
        const art = artifacts[i];
        const basePath = `/arsiv/eser/${art.id}`;
        const trPath = localizeRoute(basePath, 'tr');
        const enPath = localizeRoute(basePath, 'en');
        const elPath = localizeRoute(basePath, 'el');
        const shortCode = art.id.slice(0, 6).toUpperCase();

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(basePath, lang);
            const rawTitle =
                (lang === 'tr' ? art.title_tr : lang === 'el' ? art.title_el : art.title_en) || art.title_tr;
            const fullTitle = ensureUniqueBoundedTitle(rawTitle, lang, shortCode, usedTitles);
            const rawDesc =
                (lang === 'tr' ? art.description_tr : lang === 'el' ? art.description_el : art.description_en) || '';
            const desc = ensureUniqueBoundedDescription(rawDesc, rawTitle, lang, shortCode, usedDescriptions);

            const artifactSchema = {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: rawTitle,
                description: desc,
                identifier: art.id,
                url: `${PRODUCTION_SITE_ORIGIN}${routePath}`,
                isAccessibleForFree: true,
                isPartOf: {
                    '@type': ['Archive', 'ArchiveOrganization'],
                    name:
                        lang === 'tr'
                            ? `${INSTITUTION_NAME.tr} Arşivi`
                            : lang === 'el'
                              ? `Αρχείο ${INSTITUTION_NAME.el}`
                              : `${INSTITUTION_NAME.en} Archive`,
                    description:
                        'Historical archive preserving documents, photographs, and educational records of the Galata Greek School and the Greek community of Istanbul.',
                },
            };

            const html = buildRouteHtml(baseTemplate, {
                lang,
                title: fullTitle,
                description: desc,
                h1: rawTitle,
                canonicalPath: routePath,
                trPath,
                enPath,
                elPath,
                schema: artifactSchema,
                extraBodyText: `${rawDesc} — Koleksiyon Envanter No: ${art.id}.`,
            });

            writeRouteFile(distDir, routePath, html);
            writtenCount++;
            addSitemapEntry(`${PRODUCTION_SITE_ORIGIN}${routePath}`, trPath, enPath, elPath, 'monthly', '0.6');
        }
    }

    // 4. Write dist/404.html with noindex, nofollow
    const notFoundHtml = buildRouteHtml(baseTemplate, {
        lang: 'tr',
        title: '404 — Sayfa Bulunamadı | Galata Rum Okulu',
        description:
            'Aradığınız sayfa bulunamadı veya taşınmış olabilir. Galata Rum Okulu Vakfı - Kültür Merkezi ana sayfasına veya dijital arşive dönebilirsiniz.',
        h1: '404 — Sayfa Bulunamadı / Page Not Found / Η Σελίδα Δεν Βρέθηκε',
        canonicalPath: '/',
        trPath: '/',
        enPath: '/en',
        elPath: '/el',
        noindex: true,
        schema: null,
    });
    fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

    // 6. Write public/sitemap.xml & dist/sitemap.xml
    const lastmod = '2026-11-18';
    const xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ];

    for (const entry of sitemapEntries) {
        xmlLines.push('  <url>');
        xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
        xmlLines.push(`    <lastmod>${lastmod}</lastmod>`);
        xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
        xmlLines.push(`    <priority>${entry.priority}</priority>`);
        xmlLines.push(`    <xhtml:link rel="alternate" hreflang="tr" href="${escapeXml(entry.trUrl)}" />`);
        xmlLines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(entry.enUrl)}" />`);
        xmlLines.push(`    <xhtml:link rel="alternate" hreflang="el" href="${escapeXml(entry.elUrl)}" />`);
        xmlLines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.trUrl)}" />`);
        xmlLines.push('  </url>');
    }
    xmlLines.push('</urlset>');
    const sitemapXml = xmlLines.join('\n') + '\n';

    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapXml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

    for (const staticFile of ['robots.txt', 'llms.txt']) {
        const srcFile = path.join(__dirname, 'public', staticFile);
        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, path.join(distDir, staticFile));
        }
    }

    console.log(
        `Static SEO pre-render complete: ${writtenCount} indexable route HTML files, dist/404.html, and ${sitemapEntries.length} deduplicated URLs in sitemap.xml.`
    );
}

run();
