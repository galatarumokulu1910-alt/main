/**
 * ============================================================================
 * GALATA RUM OKULU — SINGLE TYPED VENUE & DOMAIN CONFIGURATION SOURCE
 * ============================================================================
 * Owner-Confirmed Facts (2026-11-15):
 * 1. Primary Production Domain: https://galatarumokulu.org (NO .tr suffix)
 * 2. Galata Rum Okulu (Cultural Center / Public Visits):
 *    - CLOSED: Sunday, Monday
 *    - OPEN: Tuesday, Wednesday, Thursday, Friday, Saturday
 *    - Clock times: UNVERIFIED (PENDING_OWNER) — never assert 10:00–18:00 or 11:00–18:00.
 * 3. Simone Restaurant (Separate Rooftop Hospitality Operation):
 *    - OPEN: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (All 7 days)
 *    - Schedule is independent of the school's public visiting schedule.
 *    - Clock times & separate street access/contact: UNVERIFIED (PENDING_OWNER).
 * 4. Physical Street Number & Telephone:
 *    - PENDING_OWNER confirmation between legacy reference (No:25 / +90 212 244 86 36)
 *      and staging draft (No:49 / +90 212 892 43 00).
 * ============================================================================
 */

export type SupportedLocale = 'tr' | 'en' | 'el';

export type DayOfWeek =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

export type VerificationStatus = 'OWNER_CONFIRMED' | 'PENDING_OWNER';

export interface ClockHoursSpec {
    status: VerificationStatus;
    opens: string | null;
    closes: string | null;
    fallbackNotice: Record<SupportedLocale, string>;
}

export interface VenueScheduleRecord {
    id: 'school' | 'simoneRestaurant';
    name: Record<SupportedLocale, string>;
    roleDescription: Record<SupportedLocale, string>;
    openDays: readonly DayOfWeek[];
    closedDays: readonly DayOfWeek[];
    weekdayPolicyStatus: 'OWNER_CONFIRMED';
    clockHours: ClockHoursSpec;
    scheduleSummary: Record<SupportedLocale, string>;
    scheduleShort: Record<SupportedLocale, string>;
    closedDaysNotice: Record<SupportedLocale, string>;
    independenceNotice: Record<SupportedLocale, string>;
}

export interface ContactCandidatesRecord {
    status: VerificationStatus;
    neighborhood: string;
    streetName: Record<SupportedLocale, string>;
    streetAddress: Record<SupportedLocale, string>;
    districtAndCity: Record<SupportedLocale, string>;
    fullAddress: Record<SupportedLocale, string>;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    countryCode: 'TR';
    addressCountry: 'TR';
    /**
     * Street number is PENDING_OWNER between legacy ('No: 25') and staging ('No: 49').
     * Displayed with neutral district-level address until owner signs off on the exact door number.
     */
    streetNumberCandidates: {
        legacyOfficialSite: 'No: 25';
        stagingDraft: 'No: 49';
    };
    phoneCandidates: {
        legacyOfficialSite: '+90 212 244 86 36';
        stagingDraft: '+90 212 892 43 00';
    };
    displayAddress: Record<SupportedLocale, string>;
    schemaStreetAddress: string;
    displayPhone: string;
    telephoneDisplay: string;
    telHref: string;
    telephoneHref: string;
    email: string;
    mailtoHref: string;
    emailHref: string;
    mapsUrl: string;
    geo: {
        latitude: string;
        longitude: string;
    };
}

/**
 * OWNER-CONFIRMED PRIMARY CANONICAL ORIGIN
 * Never use https://galatarumokulu.org.tr or staging URLs in canonicals/sitemaps.
 */
export const PRODUCTION_SITE_ORIGIN = 'https://galatarumokulu.org' as const;

export const DEFAULT_OG_IMAGE_PATH = '/og-image.jpg' as const;
export const DEFAULT_OG_IMAGE_URL = `${PRODUCTION_SITE_ORIGIN}${DEFAULT_OG_IMAGE_PATH}` as const;

export const ALL_DAYS_OF_WEEK: readonly DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
] as const;

export const VENUE_INFO: {
    readonly canonicalOrigin: typeof PRODUCTION_SITE_ORIGIN;
    readonly domainStatus: 'OWNER_CONFIRMED';
    readonly institutionName: Record<SupportedLocale, string>;
    readonly school: VenueScheduleRecord;
    readonly simoneRestaurant: VenueScheduleRecord;
    readonly contact: ContactCandidatesRecord;
} = {
    canonicalOrigin: PRODUCTION_SITE_ORIGIN,
    domainStatus: 'OWNER_CONFIRMED',
    institutionName: {
        tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi',
        en: 'Galata Greek School Foundation - Cultural Center',
        el: 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
    },

    school: {
        id: 'school',
        name: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi',
            en: 'Galata Greek School Foundation - Cultural Center',
            el: 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
        },
        roleDescription: {
            tr: 'Tarihi okul binası, kültür merkezi, sergiler ve dijital arşiv alanları',
            en: 'Historical school building, cultural center, exhibitions, and digital archive spaces',
            el: 'Ιστορικό σχολικό κτίριο, πολιτιστικό κέντρο, εκθέσεις και χώροι ψηφιακού αρχείου',
        },
        openDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        closedDays: ['Sunday', 'Monday'],
        weekdayPolicyStatus: 'OWNER_CONFIRMED',
        clockHours: {
            status: 'PENDING_OWNER',
            opens: null,
            closes: null,
            fallbackNotice: {
                tr: 'Günlük açılış ve kapanış saatleri güncel sergi/etkinlik programına göre duyurulmaktadır.',
                en: 'Daily opening and closing times are announced according to the active exhibition and event program.',
                el: 'Οι ημερήσιες ώρες λειτουργίας ανακοινώνονται σύμφωνα με το τρέχον πρόγραμμα εκθέσεων και εκδηλώσεων.',
            },
        },
        scheduleSummary: {
            tr: 'Ziyaret günleri: Salı–Cumartesi. Pazar ve Pazartesi kapalıdır.',
            en: 'Visiting days: Tuesday–Saturday. Closed on Sunday and Monday.',
            el: 'Ημέρες επίσκεψης: Τρίτη–Σάββατο. Κλειστά Κυριακή και Δευτέρα.',
        },
        scheduleShort: {
            tr: 'Salı – Cumartesi açık · Pazar ve Pazartesi kapalı',
            en: 'Open Tuesday – Saturday · Closed Sunday & Monday',
            el: 'Ανοιχτά Τρίτη – Σάββατο · Κλειστά Κυριακή & Δευτέρα',
        },
        closedDaysNotice: {
            tr: 'Galata Rum Okulu sergi ve kültür merkezi alanları Pazar ve Pazartesi günleri ziyarete kapalıdır.',
            en: 'Galata Greek School exhibition and cultural center spaces are closed to visitors on Sunday and Monday.',
            el: 'Οι εκθεσιακοί και πολιτιστικοί χώροι της Ελληνικής Σχολής Γαλατά είναι κλειστοί για το κοινό την Κυριακή και τη Δευτέρα.',
        },
        independenceNotice: {
            tr: 'Kültür merkezi ziyaret günleri Salı–Cumartesi’dir; Pazar ve Pazartesi günleri kapalıdır.',
            en: 'Cultural center visiting days are Tuesday–Saturday; closed on Sunday and Monday.',
            el: 'Οι ημέρες επίσκεψης του πολιτιστικού κέντρου είναι Τρίτη–Σάββατο· κλειστά Κυριακή και Δευτέρα.',
        },
    },

    simoneRestaurant: {
        id: 'simoneRestaurant',
        name: {
            tr: 'Simone Restoran (Teras Katı)',
            en: 'Simone Restaurant (Rooftop Terrace)',
            el: 'Εστιατόριο Simone (Ταράτσα)',
        },
        roleDescription: {
            tr: 'Teras katında bağımsız ağırlama ve gastronomi işletmesi',
            en: 'Independent rooftop hospitality and dining venue',
            el: 'Ανεξάρτητος χώρος εστίασης και φιλοξενίας στην ταράτσα',
        },
        openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        closedDays: [],
        weekdayPolicyStatus: 'OWNER_CONFIRMED',
        clockHours: {
            status: 'PENDING_OWNER',
            opens: null,
            closes: null,
            fallbackNotice: {
                tr: 'Simone Restoran rezervasyon ve servis saatleri işletmenin kendi programına tabidir.',
                en: 'Simone Restaurant reservation and service hours follow the restaurant’s own schedule.',
                el: 'Οι ώρες λειτουργίας και κρατήσεων του Εστιατορίου Simone καθορίζονται ανεξάρτητα από το εστιατόριο.',
            },
        },
        scheduleSummary: {
            tr: 'Simone Restoran haftanın her günü (Pazar ve Pazartesi dahil) açıktır; çalışma düzeni okulun sergi ve ziyaret günlerinden bağımsızdır.',
            en: 'Simone Restaurant is open every day of the week (including Sunday and Monday), operating independently of the school’s public visiting schedule.',
            el: 'Το Εστιατόριο Simone είναι ανοιχτό κάθε μέρα της εβδομάδας (συμπεριλαμβανομένων Κυριακής και Δευτέρας), ανεξάρτητα από το ωράριο επισκέψεων της Σχολής.',
        },
        scheduleShort: {
            tr: 'Simone Restoran (Teras): Haftanın her günü açıktır',
            en: 'Simone Restaurant (Rooftop): Open every day of the week',
            el: 'Εστιατόριο Simone (Ταράτσα): Ανοιχτό κάθε μέρα της εβδομάδας',
        },
        closedDaysNotice: {
            tr: 'Restoranın açık olduğu Pazar ve Pazartesi günlerinde okulun sergi, arşiv ve kültür merkezi salonları genel ziyarete kapalıdır.',
            en: 'On Sunday and Monday when the restaurant is open, the school’s exhibition halls, archive rooms, and cultural center remain closed to general visitors.',
            el: 'Την Κυριακή και τη Δευτέρα που το εστιατόριο λειτουργεί, οι αίθουσες εκθέσεων και το αρχείο της Σχολής παραμένουν κλειστά για το κοινό.',
        },
        independenceNotice: {
            tr: 'Restoranın açık olduğu Pazar ve Pazartesi günlerinde okulun sergi, arşiv ve kültür merkezi salonları genel ziyarete kapalıdır.',
            en: 'On Sunday and Monday when the restaurant is open, the school’s exhibition halls, archive rooms, and cultural center remain closed to general visitors.',
            el: 'Την Κυριακή και τη Δευτέρα που το εστιατόριο λειτουργεί, οι αίθουσες εκθέσεων και το αρχείο της Σχολής παραμένουν κλειστά για το κοινό.',
        },
    },

    contact: {
        status: 'PENDING_OWNER',
        neighborhood: 'Kemankeş Karamustafa Paşa Mh.',
        streetName: {
            tr: 'Kemeraltı Cd.',
            en: 'Kemeraltı St.',
            el: 'Οδός Kemeraltı',
        },
        streetAddress: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Cd.',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı St.',
            el: 'Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı',
        },
        districtAndCity: {
            tr: '34425 Karaköy, Beyoğlu / İstanbul',
            en: '34425 Karaköy, Beyoğlu / Istanbul',
            el: '34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
        fullAddress: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Cd., 34425 Karaköy, Beyoğlu / İstanbul',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı St., 34425 Karaköy, Beyoğlu / Istanbul',
            el: 'Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı, 34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
        addressLocality: 'İstanbul',
        addressRegion: 'Beyoğlu',
        postalCode: '34425',
        countryCode: 'TR',
        addressCountry: 'TR',
        streetNumberCandidates: {
            legacyOfficialSite: 'No: 25',
            stagingDraft: 'No: 49',
        },
        phoneCandidates: {
            legacyOfficialSite: '+90 212 244 86 36',
            stagingDraft: '+90 212 892 43 00',
        },
        displayAddress: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Cd., 34425 Karaköy, Beyoğlu / İstanbul',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı St., 34425 Karaköy, Beyoğlu / Istanbul',
            el: 'Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı, 34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
        schemaStreetAddress: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Cd., Karaköy',
        displayPhone: '+90 (212) 892 43 00',
        telephoneDisplay: '0 (212) 892 43 00',
        telHref: 'tel:+902128924300',
        telephoneHref: 'tel:+902128924300',
        email: 'info@galatarumokulu.org',
        mailtoHref: 'mailto:info@galatarumokulu.org',
        emailHref: 'mailto:info@galatarumokulu.org',
        mapsUrl: 'https://maps.app.goo.gl/PjFPYqEuqGoSXb178',
        geo: {
            latitude: '41.0238',
            longitude: '28.9774',
        },
    },
};

/**
 * Returns deterministic open/closed status for a given day of the week for both venues.
 * Used by UI components and automated regression tests (Sunday, Monday, Tuesday, Saturday).
 */
export function getVenueDayStatus(day: DayOfWeek, lang: SupportedLocale = 'tr'): {
    day: DayOfWeek;
    schoolOpen: boolean;
    simoneOpen: boolean;
    schoolStatusText: string;
    simoneStatusText: string;
    combinedPolicyNote: string;
} {
    const schoolOpen = VENUE_INFO.school.openDays.includes(day);
    const simoneOpen = VENUE_INFO.simoneRestaurant.openDays.includes(day);

    const schoolStatusText = schoolOpen
        ? lang === 'tr'
            ? 'Galata Rum Okulu: Ziyarete Açık (Salı–Cumartesi)'
            : lang === 'el'
                ? 'Ελληνική Σχολή Γαλατά: Ανοιχτά (Τρίτη–Σάββατο)'
                : 'Galata Greek School: Open to Visitors (Tuesday–Saturday)'
        : lang === 'tr'
            ? 'Galata Rum Okulu: Kapalı (Pazar ve Pazartesi kapalıdır)'
            : lang === 'el'
                ? 'Ελληνική Σχολή Γαλατά: Κλειστά (Κυριακή και Δευτέρα κλειστά)'
                : 'Galata Greek School: Closed (Closed on Sunday and Monday)';

    const simoneStatusText = lang === 'tr'
        ? 'Simone Restoran (Teras): Açık (Haftanın her günü açıktır)'
        : lang === 'el'
            ? 'Εστιατόριο Simone (Ταράτσα): Ανοιχτά (Κάθε μέρα της εβδομάδας)'
            : 'Simone Restaurant (Rooftop): Open (Open every day of the week)';

    const combinedPolicyNote = !schoolOpen && simoneOpen
        ? VENUE_INFO.simoneRestaurant.closedDaysNotice[lang]
        : VENUE_INFO.school.scheduleSummary[lang];

    return {
        day,
        schoolOpen,
        simoneOpen,
        schoolStatusText,
        simoneStatusText,
        combinedPolicyNote,
    };
}

/**
 * Builds verified JSON-LD entities for the Cultural Center and Simone Restaurant.
 * Crucial Rule: Do NOT include openingHours or openingHoursSpecification with fabricated
 * clock times while clockHours.status === 'PENDING_OWNER'.
 */
export function buildInstitutionalJsonLd(pagePath = '') {
    const cleanUrl = `${PRODUCTION_SITE_ORIGIN}${pagePath}`;
    const schoolHoursConfirmed =
        VENUE_INFO.school.clockHours.status === 'OWNER_CONFIRMED' &&
        VENUE_INFO.school.clockHours.opens &&
        VENUE_INFO.school.clockHours.closes;

    const placeEntity: Record<string, unknown> = {
        '@type': ['LandmarksOrHistoricalBuildings', 'CivicStructure', 'Place'],
        '@id': `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
        url: PRODUCTION_SITE_ORIGIN,
        name: VENUE_INFO.school.name.tr,
        alternateName: [VENUE_INFO.school.name.en, VENUE_INFO.school.name.el],
        description:
            'Historic 1910 neoclassical Greek school building in Karaköy, Istanbul, serving as a cultural center, exhibition venue, and digital archive. Public visiting days: Tuesday through Saturday (closed Sunday and Monday).',
        address: {
            '@type': 'PostalAddress',
            streetAddress: VENUE_INFO.contact.schemaStreetAddress,
            addressLocality: 'Istanbul',
            addressRegion: 'Beyoğlu',
            postalCode: VENUE_INFO.contact.postalCode,
            addressCountry: VENUE_INFO.contact.countryCode,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: VENUE_INFO.contact.geo.latitude,
            longitude: VENUE_INFO.contact.geo.longitude,
        },
        sameAs: [
            'https://www.instagram.com/galatarumokulukulturmerkezi/',
            'https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu',
        ],
    };

    if (schoolHoursConfirmed) {
        placeEntity.openingHoursSpecification = [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: VENUE_INFO.school.openDays,
                opens: VENUE_INFO.school.clockHours.opens,
                closes: VENUE_INFO.school.clockHours.closes,
            },
        ];
    }

    const simoneEntity: Record<string, unknown> = {
        '@type': 'Restaurant',
        '@id': `${PRODUCTION_SITE_ORIGIN}/#simone-restaurant`,
        name: 'Simone Restaurant',
        description:
            'Independent rooftop restaurant located on the terrace level of the historic Galata building. Open seven days a week (Monday through Sunday), operating on its own schedule independent of the school’s public exhibition visiting days.',
        address: {
            '@type': 'PostalAddress',
            streetAddress: VENUE_INFO.contact.schemaStreetAddress,
            addressLocality: 'Istanbul',
            addressRegion: 'Beyoğlu',
            postalCode: VENUE_INFO.contact.postalCode,
            addressCountry: VENUE_INFO.contact.countryCode,
        },
    };

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${PRODUCTION_SITE_ORIGIN}/#organization`,
                url: cleanUrl,
                name: VENUE_INFO.school.name.tr,
                alternateName: VENUE_INFO.school.name.en,
                email: VENUE_INFO.contact.email,
                address: placeEntity.address,
                sameAs: placeEntity.sameAs,
            },
            placeEntity,
            simoneEntity,
        ],
    };
}
