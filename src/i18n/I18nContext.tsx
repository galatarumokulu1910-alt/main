/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VENUE_INFO } from '../config/venueInfo';

export type Language = 'tr' | 'en' | 'el';

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
    localizePath: (to: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

/* ──────────────── Types ──────────────── */
type NestedStrings = {
    [key: string]: string | NestedStrings;
};

export type Translations = Record<Language, NestedStrings>;

/* ── Translation dictionaries ── */
const translations: Translations = {
    tr: {
        'home.title': 'Ana Sayfa',
        'history.title': 'Tarihçe',
        'nav.home': 'Ana Sayfa',
        'nav.history': 'Tarihçe',
        'nav.exhibitions': 'Sergiler',
        'nav.events': 'Etkinlikler',
        'nav.archive': 'Arşiv',
        'nav.venueHire': 'Mekan Kiralama',
        'nav.contact': 'Bize Ulaşın',
        'hero.badge': 'Estd. 1885',
        'hero.headline': 'ESTD. 1885: Etkinliğinizi Tarihte Düzenleyin',
        'hero.subtitle': 'Bir asırlık mirası modern vizyonlarla buluşturan, İstanbul\'un en ikonik neoklasik yapılarından biri.',
        'hero.cta': 'İletişime Geçin',
        'hero.explore': 'Arşivi Keşfedin',
        'archive.title': '100 Yıllık Ufuk',
        'archive.subtitle': 'Galata Rum yaşamının canlı dijital arşivi',
        'archive.collection': 'Arşiv Koleksiyonu',
        'venue.title': 'Asırlık Mimari, Zamansız Prestij',
        'venue.subtitle': 'Karaköy’ün kalbinde yükselen 1910 tarihli neoklasik yapımız; uluslararası sanat sergileri, bienaller, akademik konferanslar, dönem konserleri ve seçkin resepsiyonlar için benzersiz bir tarihsel derinlik ve prestij sunar.',
        'venue.floorPlans': 'Salonlar',
        'venue.badge': 'Tarihi Mekan & Salonlar',
        'venue.pageTitle': 'MICE, Lansman & Tarihi Mekan Kiralama',
        'venue.pageDesc': 'İstanbul Karaköy’de 1.060 m² tarihi mekan kiralama: MICE, marka lansmanı, gala, defile, konferans ve sergiler için 3 etkinlik katında 850 kişilik kapasite.',
        'venue.pageKeywords': 'mekan kiralama istanbul, tarihi mekan kiralama, MICE etkinlik mekanı istanbul, marka lansmanı mekanı, kurumsal davet ve gala mekanı, karaköy beyoğlu etkinlik alanı, defile ve moda çekimi mekanı, konferans ve sempozyum salonu, sergi ve bienal mekanı, neoklasik tarihi bina kiralama',
        'footer.newsletter': 'Bültenimize Abone Olun',
        'footer.emailPlaceholder': 'E-posta adresiniz',
        'footer.subscribe': 'Abone Ol',
        'footer.visitHours': 'Ziyaret Günleri',
        'footer.contact': 'Bize Ulaşın',
        'footer.location': 'Konum',
        'footer.weekdays': 'Ziyaret günleri: Salı–Cumartesi',
        'footer.weekends': 'Pazar ve Pazartesi kapalıdır',
        'footer.address': VENUE_INFO.contact.displayAddress.tr,
        'footer.phone': VENUE_INFO.contact.displayPhone,
        'footer.email': VENUE_INFO.contact.email,
        'footer.copyright': '\u00A9 2026 Galata Rum Okulu Vakfı - Kültür Merkezi. Tüm hakları saklıdır.',
        'footer.privacy': 'KVKK',
        'footer.cookies': 'Çerez Politikası',
        'footer.credits': 'Künye',
        'footer.exportCsv': 'CSV Dışa Aktar',
        'footer.exportXlsx': 'XLSX Dışa Aktar',
        'capacity.gala': 'Gala Yemeği',
        'capacity.theater': 'Tiyatro',
        'capacity.cocktail': 'Kokteyl',
        'capacity.configuration': 'Kurulum',
        'capacity.capacity': 'Kapasite',
        'features.title': 'Özellikler',
        'features.setupCapacities': 'Kurulum Kapasiteleri',
        'slider.manage': 'Slaytları Yönet',
        footer: {
            address: VENUE_INFO.contact.displayAddress.tr,
            emailInfo: 'Email:',
            phoneInfo: 'Tel:',
            workingHours: VENUE_INFO.school.scheduleSummary.tr,
        },
        meta: {
            defaultDescription: "İstanbul Galata'da 19. yüzyıldan kalma neoklasik simge yapı; çağdaş sanat sergileri, konferanslar, dijital arşiv ve seçkin kültürel etkinlikler merkezi."
        }
    },
    en: {
        'home.title': 'Home',
        'history.title': 'History',
        'nav.home': 'Home',
        'nav.history': 'History',
        'nav.exhibitions': 'Exhibitions',
        'nav.events': 'Events',
        'nav.archive': 'Archive',
        'nav.venueHire': 'Venue Hire',
        'nav.contact': 'Contact Us',
        'hero.badge': 'Estd. 1885',
        'hero.headline': 'ESTD. 1885: Host Your Event in History',
        'hero.subtitle': 'One of Istanbul\'s most iconic neoclassical landmarks, bridging a century of heritage with modern visions.',
        'hero.cta': 'Get in Touch',
        'hero.explore': 'Explore the Archive',
        'archive.title': 'The 100-Year Horizon',
        'archive.subtitle': 'A living digital archive of Galata Greek life',
        'archive.collection': 'Archive Collection',
        'venue.title': 'Centuries of Architecture, Timeless Prestige',
        'venue.subtitle': 'Rising in the heart of Karaköy since 1910, our neoclassical landmark offers unmatched historical depth and prestige for international art exhibitions, biennials, academic conferences, concerts, and exclusive receptions.',
        'venue.floorPlans': 'The Spaces',
        'venue.badge': 'Historic Venue & Spaces',
        'venue.pageTitle': 'MICE, Brand Launch & Venue Hire',
        'venue.pageDesc': '1,060 m² historic event venue hire in Karaköy, Istanbul: 3 neoclassical floors up to 850 guests for MICE conferences, brand launches, galas, and exhibitions.',
        'venue.pageKeywords': 'venue hire istanbul, MICE venue istanbul, historic event venue rental, brand launch venue istanbul, corporate gala dinner venue, fashion show space karakoy, conference and symposium hall, art exhibition and biennial venue, neoclassical landmark hire',
        'footer.newsletter': 'Subscribe to Our Newsletter',
        'footer.emailPlaceholder': 'Your email address',
        'footer.subscribe': 'Subscribe',
        'footer.visitHours': 'Visiting Days',
        'footer.contact': 'Contact',
        'footer.location': 'Location',
        'footer.weekdays': 'Visiting days: Tuesday–Saturday',
        'footer.weekends': 'Closed on Sunday and Monday',
        'footer.address': VENUE_INFO.contact.displayAddress.en,
        'footer.phone': VENUE_INFO.contact.displayPhone,
        'footer.email': VENUE_INFO.contact.email,
        'footer.copyright': '\u00A9 2026 Galata Greek School Foundation - Cultural Center. All rights reserved.',
        'footer.privacy': 'Privacy',
        'footer.cookies': 'Cookie Policy',
        'footer.credits': 'Credits',
        'footer.exportCsv': 'Export CSV',
        'footer.exportXlsx': 'Export XLSX',
        'capacity.gala': 'Gala Dinner',
        'capacity.theater': 'Theater',
        'capacity.cocktail': 'Cocktail',
        'capacity.configuration': 'Configuration',
        'capacity.capacity': 'Capacity',
        'features.title': 'Features',
        'features.setupCapacities': 'Setup Capacities',
        'slider.manage': 'Manage Slides',
        footer: {
            address: VENUE_INFO.contact.displayAddress.en,
            emailInfo: 'Email:',
            phoneInfo: 'Phone:',
            workingHours: VENUE_INFO.school.scheduleSummary.en,
        },
        meta: {
            defaultDescription: "A 19th-century neoclassical landmark in Galata, Istanbul — now a center for contemporary art exhibitions, conferences, digital archives, and cultural events."
        }
    },
    el: {
        'home.title': 'Αρχική Σελίδα',
        'history.title': 'Ιστορία',
        'nav.home': 'Αρχική Σελίδα',
        'nav.history': 'Ιστορία',
        'nav.exhibitions': 'Εκθέσεις',
        'nav.events': 'Εκδηλώσεις',
        'nav.archive': 'Αρχείο',
        'nav.venueHire': 'Ενοικίαση Χώρου',
        'nav.contact': 'Επικοινωνία',
        'hero.badge': 'Ιδρ. 1885',
        'hero.headline': 'ΙΔΡ. 1885: Διοργανώστε την Εκδήλωσή σας στην Ιστορία',
        'hero.subtitle': 'Ένα από τα πιο εμβληματικά νεοκλασικά κτίρια της Κωνσταντινούπολης.',
        'hero.cta': 'Επικοινωνήστε μαζί μας',
        'hero.explore': 'Εξερευνήστε το Αρχείο',
        'archive.title': 'Ο Ορίζοντας 100 Ετών',
        'archive.subtitle': 'Ένα ζωντανό ψηφιακό αρχείο της ελληνικής ζωής στον Γαλατά',
        'archive.collection': 'Συλλογή Αρχείου',
        'venue.title': 'Αιώνες Αρχιτεκτονικής, Διαχρονικό Κύρος',
        'venue.subtitle': 'Στην καρδιά του Καράκιοϊ από το 1910, το νεοκλασικό μας ορόσημο προσφέρει απαράμιλλο ιστορικό βάθος και κύρος για διεθνείς εκθέσεις τέχνης, μπιενάλε, συνέδρια, συναυλίες και εκλεκτές δεξιώσεις.',
        'venue.floorPlans': 'Οι Χώροι',
        'venue.badge': 'Ιστορικός Χώρος & Αίθουσες',
        'venue.pageTitle': 'Χώρος MICE, Εκδηλώσεων & Ενοικίαση',
        'venue.pageDesc': 'Ενοικίαση ιστορικού χώρου 1.060 m² στον Γαλατά: 3 νεοκλασικοί όροφοι έως 850 άτομα για συνέδρια MICE, εταιρικές παρουσιάσεις, δείπνα γκαλά και εκθέσεις.',
        'venue.pageKeywords': 'ενοικίαση χώρου κωνσταντινούπολη, ιστορικός χώρος εκδηλώσεων, χώρος MICE κωνσταντινούπολη, εταιρικές εκδηλώσεις γαλατάς, παρουσιάσεις επωνυμίας, δείπνο γκαλά, συνέδρια και εκθέσεις',
        'footer.newsletter': 'Εγγραφείτε στο Newsletter μας',
        'footer.emailPlaceholder': 'Η διεύθυνση email σας',
        'footer.subscribe': 'Εγγραφή',
        'footer.visitHours': 'Ημέρες Επισκέψεων',
        'footer.contact': 'Επικοινωνία',
        'footer.location': 'Τοποθεσία',
        'footer.weekdays': 'Ημέρες επίσκεψης: Τρίτη–Σάββατο',
        'footer.weekends': 'Κλειστά Κυριακή και Δευτέρα',
        'footer.address': VENUE_INFO.contact.displayAddress.el,
        'footer.phone': VENUE_INFO.contact.displayPhone,
        'footer.email': VENUE_INFO.contact.email,
        'footer.copyright': '\u00A9 2026 Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο. Με την επιφύλαξη παντός δικαιώματος.',
        'footer.privacy': 'PDPL (KVKK)',
        'footer.cookies': 'Πολιτική Cookies',
        'footer.credits': 'Αποτύπωμα',
        'footer.exportCsv': 'Εξαγωγή CSV',
        'footer.exportXlsx': 'Εξαγωγή XLSX',
        'capacity.gala': 'Δείπνο Γκαλά',
        'capacity.theater': 'Θέατρο',
        'capacity.cocktail': 'Κοκτέιλ',
        'capacity.configuration': 'Διαμόρφωση',
        'capacity.capacity': 'Χωρητικότητα',
        'features.title': 'Χαρακτηριστικά',
        'features.setupCapacities': 'Χωρητικότητες Διαμόρφωσης',
        'slider.manage': 'Διαχείριση Διαφανειών',
        footer: {
            address: VENUE_INFO.contact.displayAddress.el,
            emailInfo: 'Email:',
            phoneInfo: 'Τηλ:',
            workingHours: VENUE_INFO.school.scheduleSummary.el,
        },
        meta: {
            defaultDescription: "Ένα νεοκλασικό ορόσημο του 19ου αιώνα στον Γαλατά της Κωνσταντινούπολης — κέντρο σύγχρονης τέχνης, συνεδρίων, ψηφιακού αρχείου και πολιτισμού."
        }
    },
};

export function I18nProvider({ children }: { children: ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Helper to get lang from pathname
    const getLangFromPathname = useCallback((pathname: string): Language => {
        const parts = pathname.split('/');
        const firstPart = parts[1]; // e.g. 'en', 'el', 'arsiv'
        if (firstPart === 'en' || firstPart === 'el') {
            return firstPart;
        }
        return 'tr';
    }, []);

    // Initialize from URL pathname prefix
    const [lang, setLangState] = useState<Language>(() => {
        return getLangFromPathname(location.pathname);
    });

    // Keep lang state in sync with URL changes
    useEffect(() => {
        const urlLang = getLangFromPathname(location.pathname);
        if (urlLang !== lang) {
            setLangState(urlLang);
        }
    }, [location.pathname, lang, getLangFromPathname]);

    const setLang = useCallback((newLang: Language) => {
        const parts = location.pathname.split('/');
        const firstPart = parts[1];
        const hasPrefix = ['tr', 'en', 'el'].includes(firstPart);
        const baseParts = hasPrefix ? parts.slice(2) : parts.slice(1);
        const basePath = '/' + baseParts.join('/');
        
        let targetPath = '';
        if (newLang === 'tr') {
            targetPath = basePath;
        } else {
            targetPath = `/${newLang}${basePath === '/' ? '' : basePath}`;
        }
        
        const search = location.search;
        const hash = location.hash;
        
        setLangState(newLang);
        navigate(`${targetPath}${search}${hash}`);
    }, [location.pathname, location.search, location.hash, navigate]);

    const localizePath = useCallback((to: string): string => {
        if (!to) return to;
        if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) {
            return to;
        }
        
        const parts = to.split('/');
        const firstPart = parts[1];
        const hasPrefix = ['tr', 'en', 'el'].includes(firstPart);
        const baseParts = hasPrefix ? parts.slice(2) : parts.slice(1);
        const basePath = '/' + baseParts.join('/');
        
        if (lang === 'tr') {
            return basePath;
        }
        return `/${lang}${basePath === '/' ? '' : basePath}`;
    }, [lang]);

    const t = useCallback(
        (key: string): string => {
            const langDict = translations[lang];

            // 1. Try direct flat-key lookup first (e.g. 'nav.home' as a literal key)
            if (key in langDict) {
                const val = langDict[key];
                if (typeof val === 'string') return val;
            }

            // 2. Try nested traversal (e.g. 'footer.address' -> footer -> address)
            const keys = key.split('.');
            let current: NestedStrings | string | undefined = langDict;
            for (const k of keys) {
                if (current && typeof current === 'object' && k in current) {
                    current = current[k];
                } else {
                    current = undefined;
                    break;
                }
            }
            if (typeof current === 'string') return current;

            // 3. Fallback to English — same strategy
            const enDict = translations.en;
            if (key in enDict) {
                const val = enDict[key];
                if (typeof val === 'string') return val;
            }
            let fallback: NestedStrings | string | undefined = enDict;
            for (const k of keys) {
                if (fallback && typeof fallback === 'object' && k in fallback) {
                    fallback = fallback[k];
                } else {
                    return key; // ultimate fallback: return the key itself
                }
            }
            return typeof fallback === 'string' ? fallback : key;
        },
        [lang],
    );

    return (
        <I18nContext.Provider value={{ lang, setLang, t, localizePath }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}
