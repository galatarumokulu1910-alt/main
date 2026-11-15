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

const STATIC_PAGES = [
    {
        basePath: '/',
        changefreq: 'weekly',
        priority: '1.0',
        title: {
            tr: `${INSTITUTION_NAME.tr} | Tarihçe, Mekan Kiralama & Etkinlikler`,
            en: `${INSTITUTION_NAME.en} | History, Venue Hire & Events`,
            el: `${INSTITUTION_NAME.el} | Ιστορία, Ενοικίαση Χώρου & Εκδηλώσεις`,
        },
        h1: {
            tr: 'The Modern Past — Galata Rum Okulu Vakfı - Kültür Merkezi',
            en: 'The Modern Past — Galata Greek School Foundation - Cultural Center',
            el: 'The Modern Past — Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
        },
        description: {
            tr: 'İstanbul Galata’da 19. yüzyıldan kalma neoklasik simge yapı; çağdaş sanat sergileri, konferanslar, dijital arşiv ve seçkin kültürel etkinlikler merkezi.',
            en: 'A 19th-century neoclassical landmark in Galata, Istanbul — now a center for contemporary art exhibitions, conferences, digital archives, and cultural gatherings.',
            el: 'Ένα νεοκλασικό ορόσημο του 19ου αιώνα στον Γαλατά της Κωνσταντινούπολης — κέντρο σύγχρονης τέχνης, συνεδρίων, ψηφιακού αρχείου και πολιτισμού.',
        },
    },
    {
        basePath: '/tarihce',
        changefreq: 'monthly',
        priority: '0.8',
        title: {
            tr: `Tarihçe | ${INSTITUTION_NAME.tr}`,
            en: `History | ${INSTITUTION_NAME.en}`,
            el: `Ιστορία | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: '120 Yıllık Tarih',
            en: '120 Years of History',
            el: '120 Χρόνια Ιστορίας',
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
            tr: `Arşiv | ${INSTITUTION_NAME.tr}`,
            en: `Archive | ${INSTITUTION_NAME.en}`,
            el: `Αρχείο | ${INSTITUTION_NAME.el}`,
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
            tr: `Arşiv Koleksiyonu | ${INSTITUTION_NAME.tr}`,
            en: `Archive Collection | ${INSTITUTION_NAME.en}`,
            el: `Συλλογή Αρχείου | ${INSTITUTION_NAME.el}`,
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
            tr: `İstanbul Rumları Koleksiyonu | ${INSTITUTION_NAME.tr}`,
            en: `Istanbul Greeks Collection | ${INSTITUTION_NAME.en}`,
            el: `Συλλογή Ελλήνων Κωνσταντινούπολης | ${INSTITUTION_NAME.el}`,
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
        changefreq: 'monthly',
        priority: '0.9',
        title: {
            tr: `Tarihi Etkinlik Mekanı & Salon Kiralama | ${INSTITUTION_NAME.tr}`,
            en: `Historic Event Venue & Hall Rental in Galata | ${INSTITUTION_NAME.en}`,
            el: `Ιστορικός Χώρος Εκδηλώσεων & Ενοικίαση Αιθουσών | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'Tarihi Mekan & Salonlar',
            en: 'Historic Venue & Halls',
            el: 'Ιστορικός Χώρος & Αίθουσες',
        },
        description: {
            tr: 'İstanbul Galata’da 1.060 m² tarihi etkinlik mekanı: 1., 2. ve 3. katlarda uluslararası sergiler, konferanslar, konserler ve seçkin resepsiyonlar için salon kiralama.',
            en: '1,060 m² historic event venue in Galata, Istanbul: rental halls across Levels 1, 2, and 3 for international exhibitions, conferences, concerts, and receptions.',
            el: 'Ιστορικός χώρος εκδηλώσεων 1.060 m² στον Γαλατά: αίθουσες στους Ορόφους 1, 2 και 3 για διεθνείς εκθέσεις, συνέδρια, συναυλίες και δεξιώσεις.',
        },
    },
    {
        basePath: '/gecmis-etkinlikler',
        changefreq: 'weekly',
        priority: '0.8',
        title: {
            tr: `Geçmiş Etkinlikler | ${INSTITUTION_NAME.tr}`,
            en: `Past Events | ${INSTITUTION_NAME.en}`,
            el: `Παρελθούσες Εκδηλώσεις | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'Geçmiş Etkinlikler',
            en: 'Past Events',
            el: 'Παρελθούσες Εκδηλώσεις',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi geçmiş etkinlikler arşivi: İstanbul Bienali, çağdaş sanat sergileri, sempozyumlar ve konserler.',
            en: 'Past events archive of Galata Greek School Foundation - Cultural Center: Istanbul Biennial, contemporary art exhibitions, symposia, and concerts.',
            el: 'Αρχείο παρελθουσών εκδηλώσεων του Ιδρύματος Ελληνικού Σχολείου Γαλατά: Μπιενάλε Κωνσταντινούπολης, εκθέσεις, συμπόσια και συναυλίες.',
        },
    },
    {
        basePath: '/bize-ulasin',
        changefreq: 'monthly',
        priority: '0.8',
        title: {
            tr: `Bize Ulaşın | ${INSTITUTION_NAME.tr}`,
            en: `Contact Us | ${INSTITUTION_NAME.en}`,
            el: `Επικοινωνία | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'Bize Ulaşın',
            en: 'Contact Us',
            el: 'Επικοινωνία',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi iletişim ve mekan talebi formu. Ziyaret günleri: Salı–Cumartesi açık, Pazar ve Pazartesi kapalıdır.',
            en: 'Contact and venue inquiry form for the Galata Greek School Foundation - Cultural Center. Open Tuesday–Saturday; closed Sunday and Monday.',
            el: 'Φόρμα επικοινωνίας και αιτήματος χώρου για το Ίδρυμα Ελληνικού Σχολείου Γαλατά. Ανοιχτά Τρίτη–Σάββατο, κλειστά Κυριακή & Δευτέρα.',
        },
    },
    {
        basePath: '/ammf',
        changefreq: 'monthly',
        priority: '0.7',
        title: {
            tr: `AMMF Vakfı | ${INSTITUTION_NAME.tr}`,
            en: `AMMF Foundation | ${INSTITUTION_NAME.en}`,
            el: `Ίδρυμα AMMF | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF)',
            en: 'Athanasios and Marina Martinou Foundation (AMMF)',
            el: 'Ίδρυμα Αθανάσιος και Μαρίνα Μαρτίνου (AMMF)',
        },
        description: {
            tr: 'Athanasios ve Marina Martinou Vakfı (AMMF) ile Galata Rum Okulu Vakfı - Kültür Merkezi ortaklığı ve tarihi restorasyon projesi.',
            en: 'Partnership between the Athanasios and Marina Martinou Foundation (AMMF) and the Galata Greek School Foundation - Cultural Center.',
            el: 'Συνεργασία μεταξύ του Ιδρύματος Αθανάσιος και Μαρίνα Μαρτίνου (AMMF) και του Ιδρύματος Ελληνικού Σχολείου Γαλατά.',
        },
    },
    {
        basePath: '/kvkk',
        changefreq: 'yearly',
        priority: '0.4',
        title: {
            tr: `KVKK Aydınlatma Metni | ${INSTITUTION_NAME.tr}`,
            en: `PDPL (KVKK) Disclosure Text | ${INSTITUTION_NAME.en}`,
            el: `Ενημερωτικό Κείμενο Προστασίας Δεδομένων (KVKK) | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'KVKK Aydınlatma Metni',
            en: 'PDPL (KVKK) Disclosure Text',
            el: 'Ενημερωτικό Κείμενο Προστασίας Δεδομένων (KVKK)',
        },
        description: {
            tr: '6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında Galata Rum Okulu Vakfı - Kültür Merkezi aydınlatma ve bilgilendirme metni.',
            en: 'Information and disclosure notice by the Galata Greek School Foundation - Cultural Center under Personal Data Protection Law No. 6698.',
            el: 'Ενημέρωση από το Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο σύμφωνα με τον Νόμο 6698 περί Προστασίας Δεδομένων.',
        },
    },
    {
        basePath: '/gizlilik-politikasi',
        changefreq: 'yearly',
        priority: '0.4',
        title: {
            tr: `Gizlilik Politikası | ${INSTITUTION_NAME.tr}`,
            en: `Privacy Policy | ${INSTITUTION_NAME.en}`,
            el: `Πολιτική Απορρήτου | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'Gizlilik Politikası',
            en: 'Privacy Policy',
            el: 'Πολιτική Απορρήτου',
        },
        description: {
            tr: 'Ziyaretçi bilgilerinizin güvenliği, kurumsal iletişim gizliliği ve dijital arşiv koleksiyonlarımızın kullanım ilkeleri.',
            en: 'Our principles governing visitor data security, institutional inquiry confidentiality, and digital archive usage.',
            el: 'Οι αρχές μας σχετικά με την ασφάλεια των δεδομένων επισκεπτών, την εμπιστευτικότητα επικοινωνίας και τη χρήση του ψηφιακού αρχείου.',
        },
    },
    {
        basePath: '/cerez-politikasi',
        changefreq: 'yearly',
        priority: '0.4',
        title: {
            tr: `Çerez Politikası | ${INSTITUTION_NAME.tr}`,
            en: `Cookie Policy | ${INSTITUTION_NAME.en}`,
            el: `Πολιτική Cookies | ${INSTITUTION_NAME.el}`,
        },
        h1: {
            tr: 'Çerez Politikası',
            en: 'Cookie Policy',
            el: 'Πολιτική Cookies',
        },
        description: {
            tr: 'Web sitemizde kullanılan zorunlu, işlevsel ve analitik çerezler ile tercih yönetimi hakkında bilgilendirme metni.',
            en: 'Information regarding essential, functional, and analytical cookies used on our website and how to manage your preferences.',
            el: 'Πληροφορίες σχετικά με τα απαραίτητα, λειτουργικά και αναλυτικά cookies που χρησιμοποιούνται στον ιστότοπό μας.',
        },
    },
];

const UNVERIFIED_SYNTHETIC_ARTIFACT_IDS = [
    'c1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003',
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

function buildInstitutionalSchema(canonicalUrl) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${PRODUCTION_SITE_ORIGIN}/#organization`,
                url: PRODUCTION_SITE_ORIGIN,
                name: INSTITUTION_NAME.tr,
                alternateName: [INSTITUTION_NAME.en, INSTITUTION_NAME.el],
                email: 'info@galatarumokulu.org',
                telephone: '+90 212 892 43 00',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Kemankeş Karamustafa Paşa, Kemeraltı Cd.',
                    addressLocality: 'İstanbul',
                    addressRegion: 'Beyoğlu',
                    postalCode: '34425',
                    addressCountry: 'TR',
                },
                sameAs: [
                    'https://www.instagram.com/galatarumokulu/',
                    'https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu',
                ],
            },
            {
                '@type': ['LandmarksOrHistoricalBuildings', 'CulturalCenter', 'Place'],
                '@id': `${PRODUCTION_SITE_ORIGIN}/#place`,
                url: canonicalUrl,
                name: INSTITUTION_NAME.tr,
                alternateName: [INSTITUTION_NAME.en, INSTITUTION_NAME.el],
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Kemankeş Karamustafa Paşa, Kemeraltı Cd.',
                    addressLocality: 'İstanbul',
                    addressRegion: 'Beyoğlu',
                    postalCode: '34425',
                    addressCountry: 'TR',
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '41.0238',
                    longitude: '28.9774',
                },
            },
        ],
    };
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
        `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
        `<link rel="alternate" hreflang="tr" href="${escapeHtml(trUrl)}" />`,
        `<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />`,
        `<link rel="alternate" hreflang="el" href="${escapeHtml(elUrl)}" />`,
        `<link rel="alternate" hreflang="x-default" href="${escapeHtml(trUrl)}" />`,
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

    const ssrFallback = `<div id="root"><main data-prerender-shell="true" style="max-width:960px;margin:0 auto;padding:96px 24px;"><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p></main></div>`;
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

    const baseTemplate = fs.readFileSync(indexHtmlPath, 'utf8');
    const adminHtml = buildRouteHtml(baseTemplate, {
        lang: 'tr',
        title: `Galata CMS — Yönetici Paneli | ${INSTITUTION_NAME.tr}`,
        description: 'Galata Rum Okulu Yönetim Paneli',
        h1: 'Galata CMS — Yönetici Paneli',
        canonicalPath: '/admin',
        trPath: '/admin',
        enPath: '/en/admin',
        elPath: '/el/admin',
        noindex: true,
        schema: null,
    });
    fs.writeFileSync(appHtmlPath, adminHtml, 'utf8');
    console.log('Generated dist/app.html (with noindex, nofollow for /admin)');

    const snapshotPath = path.join(__dirname, 'src', 'data', 'seoRouteSnapshot.json');
    const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    const events = snapshot.events || [];
    const artifacts = snapshot.artifacts || [];

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

    // 1. Static Pages (12 x 3 = 36 routes)
    for (const page of STATIC_PAGES) {
        const trPath = localizeRoute(page.basePath, 'tr');
        const enPath = localizeRoute(page.basePath, 'en');
        const elPath = localizeRoute(page.basePath, 'el');

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(page.basePath, lang);
            const html = buildRouteHtml(baseTemplate, {
                lang,
                title: page.title[lang],
                description: page.description[lang],
                h1: page.h1[lang],
                canonicalPath: routePath,
                trPath,
                enPath,
                elPath,
                schema: buildInstitutionalSchema(`${PRODUCTION_SITE_ORIGIN}${routePath}`),
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

    // 2. Dynamic Event Pages (82 x 3 = 246 stabilized slug routes + 5 x 3 UUID alias routes)
    for (const evt of events) {
        const slug = evt.slug;
        const basePath = `/gecmis-etkinlikler/${slug}`;
        const trPath = localizeRoute(basePath, 'tr');
        const enPath = localizeRoute(basePath, 'en');
        const elPath = localizeRoute(basePath, 'el');

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(basePath, lang);
            const rawTitle = (lang === 'tr' ? evt.title_tr : lang === 'el' ? evt.title_el : evt.title_en) || evt.title_tr;
            const fullTitle = `${rawTitle} | ${INSTITUTION_NAME[lang]}`;
            const desc =
                lang === 'tr'
                    ? `${rawTitle} — ${INSTITUTION_NAME.tr} geçmiş etkinlik arşivi.`
                    : lang === 'el'
                      ? `${rawTitle} — Αρχείο εκδηλώσεων του ${INSTITUTION_NAME.el}.`
                      : `${rawTitle} — Past event hosted at ${INSTITUTION_NAME.en}.`;

            const eventSchema = {
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: rawTitle,
                description: desc,
                url: `${PRODUCTION_SITE_ORIGIN}${routePath}`,
                startDate: evt.event_date || '',
                image: evt.cover_image_url || DEFAULT_OG_IMAGE,
                location: {
                    '@type': 'Place',
                    name: INSTITUTION_NAME[lang],
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: 'Kemankeş Karamustafa Paşa, Kemeraltı Cd.',
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
                ogImage: evt.cover_image_url || DEFAULT_OG_IMAGE,
                schema: eventSchema,
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
    for (const art of artifacts) {
        const basePath = `/arsiv/eser/${art.id}`;
        const trPath = localizeRoute(basePath, 'tr');
        const enPath = localizeRoute(basePath, 'en');
        const elPath = localizeRoute(basePath, 'el');

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(basePath, lang);
            const rawTitle = (lang === 'tr' ? art.title_tr : lang === 'el' ? art.title_el : art.title_en) || art.title_tr;
            const fullTitle = `${rawTitle} | ${INSTITUTION_NAME[lang]}`;
            const rawDesc = (lang === 'tr' ? art.description_tr : lang === 'el' ? art.description_el : art.description_en) || '';
            const desc =
                rawDesc ||
                (lang === 'tr'
                    ? `${rawTitle} — ${INSTITUTION_NAME.tr} dijital arşiv eseri.`
                    : lang === 'el'
                      ? `${rawTitle} — Ψηφιακό αρχειακό τεκμήριο του ${INSTITUTION_NAME.el}.`
                      : `${rawTitle} — Digital archive artifact of ${INSTITUTION_NAME.en}.`);

            const artifactSchema = {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: rawTitle,
                description: desc,
                url: `${PRODUCTION_SITE_ORIGIN}${routePath}`,
                isAccessibleForFree: true,
                isPartOf: {
                    '@type': 'ArchiveOrganization',
                    name: `${INSTITUTION_NAME[lang]} Arşivi`,
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
            });

            writeRouteFile(distDir, routePath, html);
            writtenCount++;
            addSitemapEntry(`${PRODUCTION_SITE_ORIGIN}${routePath}`, trPath, enPath, elPath, 'monthly', '0.6');
        }
    }

    // 4. Unverified Synthetic Artifact Routes (3 x 3 = 9 routes, pre-rendered with noindex, excluded from sitemap)
    for (const synId of UNVERIFIED_SYNTHETIC_ARTIFACT_IDS) {
        const basePath = `/arsiv/eser/${synId}`;
        const trPath = localizeRoute(basePath, 'tr');
        const enPath = localizeRoute(basePath, 'en');
        const elPath = localizeRoute(basePath, 'el');

        for (const lang of ['tr', 'en', 'el']) {
            const routePath = localizeRoute(basePath, lang);
            const title =
                lang === 'tr'
                    ? `Arşiv Kaydı Doğrulama Aşamasında | ${INSTITUTION_NAME.tr}`
                    : lang === 'el'
                      ? `Αρχειακή Καταχώριση Υπό Επαλήθευση | ${INSTITUTION_NAME.el}`
                      : `Archival Record Under Verification | ${INSTITUTION_NAME.en}`;
            const desc =
                lang === 'tr'
                    ? 'Bu arşiv kaydının orijinal dijital tıpkıbasımı ve envanter doğrulaması devam etmektedir.'
                    : lang === 'el'
                      ? 'Το πρωτότυπο ψηφιακό αντίγραφο και η αρχειακή τεκμηρίωση αυτής της καταχώρισης βρίσκονται υπό επαλήθευση.'
                      : 'The original digital facsimile and provenance documentation for this archival entry are currently undergoing verification.';

            const html = buildRouteHtml(baseTemplate, {
                lang,
                title,
                description: desc,
                h1: title,
                canonicalPath: routePath,
                trPath,
                enPath,
                elPath,
                noindex: true,
                schema: null,
            });
            writeRouteFile(distDir, routePath, html);
        }
    }

    // 5. Write dist/404.html with noindex, nofollow
    const notFoundHtml = buildRouteHtml(baseTemplate, {
        lang: 'tr',
        title: `404 — Sayfa Bulunamadı | Page Not Found | ${INSTITUTION_NAME.tr}`,
        description: 'Aradığınız sayfa bulunamadı veya taşınmış olabilir. / The page you are looking for could not be found.',
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
    const lastmod = '2026-11-15';
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

    console.log(
        `Static SEO pre-render complete: ${writtenCount} indexable route HTML files, dist/404.html, and ${sitemapEntries.length} deduplicated URLs in sitemap.xml.`
    );
}

run();
