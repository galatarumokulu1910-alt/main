/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'tr' | 'en' | 'el';

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
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
        'nav.exhibitions': 'Sergiler',
        'nav.events': 'Etkinlikler',
        'nav.archive': 'Arşiv',
        'nav.venueHire': 'Mekan Kiralama',
        'nav.contact': 'Bize Ulaşın',
        'hero.badge': 'Estd. 1885',
        'hero.headline': 'ESTD. 1885: Etkinliğinizi Tarihte Düzenleyin',
        'hero.subtitle': 'Bir asırlık mirası modern vizyonlarla buluşturan, İstanbul\'un en ikonik neoklasik yapılarından biri.',
        'hero.cta': 'Etkinliğinizi Planlayın',
        'hero.explore': 'Arşivi Keşfedin',
        'archive.title': '100 Yıllık Ufuk',
        'archive.subtitle': 'Galata Rum yaşamının canlı dijital arşivi',
        'archive.collection': 'Arşiv Koleksiyonu',
        'venue.title': 'Boş Tuval',
        'venue.subtitle': 'İstanbul\'un en ikonik neoklasik yapılarından birini, bir sonraki vizyonunuzun sahnesine dönüştürün.',
        'venue.floorPlans': 'Altın Aksanlı Kat Planları',
        'venue.badge': 'Mekan Kiralama',
        'venue.pageTitle': 'Galata Rum Okulu - Mekan Kiralama | Davet ve Etkinlik Alanı',
        'venue.pageDesc': 'İstanbul Karaköy\'de tarihi Galata Rum İlkokulu binasında davet, sergi, lansman ve kurumsal etkinlikleriniz için kiralık mekan.',
        'venue.pageKeywords': 'mekan kiralama, istanbul kiralık tarihi mekan, karaköy etkinlik alanı, kurumsal toplantı mekanı, sergi salonu kiralama, moda çekimi, gala yemeği, tarihi bina kiralama',
        'footer.newsletter': 'Bültenimize Abone Olun',
        'footer.emailPlaceholder': 'E-posta adresiniz',
        'footer.subscribe': 'Abone Ol',
        'footer.visitHours': 'Ziyaret Saatleri',
        'footer.contact': 'İletişim',
        'footer.location': 'Konum',
        'footer.weekdays': 'Hafta içi: 09:00 - 18:00',
        'footer.weekends': 'Hafta sonu: 10:00 - 16:00',
        'footer.copyright': '\u00A9 2026 Galata Rum Okulu. Tüm hakları saklıdır.',
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
            address: 'Kemankeş Mah. Galata Mahkemesi Sok.\nNo:20 Beyoğlu / İstanbul',
            emailInfo: 'Email:',
            phoneInfo: 'Tel:',
            workingHours: 'Pzt-Cmt: 10:00 - 18:00\nSalı günleri kapalıdır.',
        },
        meta: {
            defaultDescription: "Galata Rum İlkokulu Vakfı'na hoş geldiniz. Geçmişi onurlandırarak, sergiler, arşiv etkinlikleri ve kültürel mirasın korunmasıyla geleceği şekillendiriyoruz."
        }
    },
    en: {
        'home.title': 'Home',
        'history.title': 'History',
        'nav.home': 'Home',
        'nav.exhibitions': 'Exhibitions',
        'nav.events': 'Events',
        'nav.archive': 'Archive',
        'nav.venueHire': 'Venue Hire',
        'nav.contact': 'Contact Us',
        'hero.badge': 'Estd. 1885',
        'hero.headline': 'ESTD. 1885: Host Your Event in History',
        'hero.subtitle': 'One of Istanbul\'s most iconic neoclassical landmarks, bridging a century of heritage with modern visions.',
        'hero.cta': 'Plan Your Event',
        'hero.explore': 'Explore the Archive',
        'archive.title': 'The 100-Year Horizon',
        'archive.subtitle': 'A living digital archive of Galata Greek life',
        'archive.collection': 'Archive Collection',
        'venue.title': 'Blank Canvas',
        'venue.subtitle': 'Transform one of Istanbul\'s most iconic neoclassical structures into the stage for your next vision.',
        'venue.floorPlans': 'Gold-Accented Floor Plans',
        'venue.badge': 'Venue Hire',
        'venue.pageTitle': 'Galata Greek School - Venue Hire | Event Space',
        'venue.pageDesc': 'Historic 19th-century neoclassical venue in Istanbul Karaköy for exhibitions, corporate events, weddings, and cultural gatherings.',
        'venue.pageKeywords': 'venue hire istanbul, historic venue rental, karakoy event space, corporate meeting venue, exhibition hall booking, neoclassical building hire',
        'footer.newsletter': 'Subscribe to Our Newsletter',
        'footer.emailPlaceholder': 'Your email address',
        'footer.subscribe': 'Subscribe',
        'footer.visitHours': 'Visiting Hours',
        'footer.contact': 'Contact',
        'footer.location': 'Location',
        'footer.weekdays': 'Weekdays: 09:00 - 18:00',
        'footer.weekends': 'Weekends: 10:00 - 16:00',
        'footer.copyright': '\u00A9 2026 Galata Rum Okulu. All rights reserved.',
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
            address: 'Kemankeş Mah. Galata Mahkemesi Sok.\nNo:20 Beyoğlu / Istanbul',
            emailInfo: 'Email:',
            phoneInfo: 'Phone:',
            workingHours: 'Mon-Sat: 10:00 - 18:00\nClosed on Tuesdays.',
        },
        meta: {
            defaultDescription: "Welcome to the Galata Greek Primary School Foundation. Honoring the past, shaping the future through exhibitions, archive events, and cultural preservation."
        }
    },
    el: {
        'home.title': 'Αρχική Σελίδα',
        'history.title': 'Ιστορία',
        'nav.home': 'Αρχική Σελίδα',
        'nav.exhibitions': 'Εκθέσεις',
        'nav.events': 'Εκδηλώσεις',
        'nav.archive': 'Αρχείο',
        'nav.venueHire': 'Ενοικίαση Χώρου',
        'nav.contact': 'Επικοινωνία',
        'hero.badge': 'Ιδρ. 1885',
        'hero.headline': 'ΙΔΡ. 1885: Διοργανώστε την Εκδήλωσή σας στην Ιστορία',
        'hero.subtitle': 'Ένα από τα πιο εμβληματικά νεοκλασικά κτίρια της Κωνσταντινούπολης.',
        'hero.cta': 'Σχεδιάστε την Εκδήλωσή σας',
        'hero.explore': 'Εξερευνήστε το Αρχείο',
        'archive.title': 'Ο Ορίζοντας 100 Ετών',
        'archive.subtitle': 'Ένα ζωντανό ψηφιακό αρχείο της ελληνικής ζωής στον Γαλατά',
        'archive.collection': 'Συλλογή Αρχείου',
        'venue.title': 'Λευκός Καμβάς',
        'venue.subtitle': 'Μετατρέψτε ένα από τα πιο εμβληματικά νεοκλασικά κτίρια της Κωνσταντινούπολης στη σκηνή για το επόμενο όραμά σας.',
        'venue.floorPlans': 'Κατόψεις με Χρυσές Λεπτομέρειες',
        'venue.badge': 'Ενοικίαση Χώρου',
        'venue.pageTitle': 'Ελληνικό Σχολείο Γαλατά - Ενοικίαση Χώρου | Χώρος Εκδηλώσεων',
        'venue.pageDesc': 'Ιστορικός νεοκλασικός χώρος του 19ου αιώνα στο Καράκιοϊ της Κωνσταντινούπολης.',
        'venue.pageKeywords': 'ενοικίαση χώρου, ιστορικός χώρος ενοικίασης, χώρος εκδηλώσεων, εταιρικός χώρος συναντήσεων, ενοικίαση νεοκλασικού',
        'footer.newsletter': 'Εγγραφείτε στο Newsletter μας',
        'footer.emailPlaceholder': 'Η διεύθυνση email σας',
        'footer.subscribe': 'Εγγραφή',
        'footer.visitHours': 'Ώρες Επισκέψεων',
        'footer.contact': 'Επικοινωνία',
        'footer.location': 'Τοποθεσία',
        'footer.weekdays': 'Καθημερινές: 09:00 - 18:00',
        'footer.weekends': 'Σαββατοκύριακα: 10:00 - 16:00',
        'footer.copyright': '\u00A9 2026 Ελληνικό Σχολείο Γαλατά. Με την επιφύλαξη παντός δικαιώματος.',
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
    },
};

export function I18nProvider({ children }: { children: ReactNode }) {
    // Initialize from URL parameter, fallback to 'tr'
    const [lang, setLangState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const urlLang = params.get('lang') as Language;
            if (urlLang && ['tr', 'en', 'el'].includes(urlLang)) {
                return urlLang;
            }
        }
        return 'tr';
    });

    const setLang = useCallback((newLang: Language) => {
        setLangState(newLang);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', newLang);
            window.history.pushState({}, '', url);
        }
    }, []);

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
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}
