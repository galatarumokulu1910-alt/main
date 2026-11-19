/**
 * ============================================================================
 * GALATA RUM OKULU — SINGLE TYPED VENUE & DOMAIN CONFIGURATION SOURCE
 * ============================================================================
 * Owner-Confirmed Authoritative Decisions (2026-11-15 — FINAL):
 * 1. Primary Production Domain: https://galatarumokulu.org (NO .tr suffix)
 * 2. Galata Rum Okulu (Cultural Center / Public Visits):
 *    - OPEN: Tuesday, Wednesday, Thursday, Friday, Saturday
 *    - CLOSED: Sunday, Monday
 *    - Clock times: UNVERIFIED (PENDING_OWNER) — publish NO numerical hours.
 *      Display only approved open days plus contact-for-hours copy.
 * 3. Simone Restaurant (Independent Rooftop Hospitality Operation):
 *    - OPEN: Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (17:00–00:00)
 *    - CLOSED: Monday
 *    - Independent from school visitor access; Sunday restaurant opening
 *      never implies school exhibitions or archive are open.
 *    - Clock times: OWNER_CONFIRMED — 17:00 to 00:00 (17.00–00.00).
 * 4. Official School Street/Entrance Number & Telephone (OWNER_CONFIRMED):
 *    - Street Address: Kemeraltı Caddesi No:25 (Kemankeş Karamustafa Paşa Mh.,
 *      Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / İstanbul)
 *    - Official School Telephone: +90 212 244 86 36 (tel:+902122448636)
 *    - Scope Rule: Address and telephone refer exclusively to Galata Rum Okulu
 *      (school/cultural center) and are never assigned to Simone Restaurant as
 *      the restaurant's own phone or dedicated entrance.
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
export type ClockHoursPolicyStatus = VerificationStatus | 'OMITTED_BY_OWNER_POLICY';

export interface ClockHoursSpec {
    status: ClockHoursPolicyStatus;
    opens: string | null;
    closes: string | null;
    fallbackNotice: Record<SupportedLocale, string>;
}

export interface VenueScheduleRecord {
    id: 'school' | 'simoneRestaurant';
    name: Record<SupportedLocale, string>;
    websiteUrl?: string;
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

export interface SchoolContactRecord {
    status: 'OWNER_CONFIRMED';
    addressVerificationStatus: 'OWNER_CONFIRMED';
    phoneVerificationStatus: 'OWNER_CONFIRMED';
    streetNumber: 'No:25';
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
    displayAddress: Record<SupportedLocale, string>;
    schemaStreetAddress: string;
    displayPhone: '+90 212 244 86 36';
    telephoneDisplay: '+90 212 244 86 36';
    telHref: 'tel:+902122448636';
    telephoneHref: 'tel:+902122448636';
    email: string;
    mailtoHref: string;
    emailHref: string;
    mapsUrl: string;
    instagramUrl: string;
    geo: {
        latitude: string;
        longitude: string;
    };
}

/**
 * OWNER-CONFIRMED PRIMARY CANONICAL ORIGIN
 * Never use country-code TLD variants or staging URLs in canonicals/sitemaps.
 */
export const PRODUCTION_SITE_ORIGIN = 'https://galatarumokulu.org' as const;
export const AMMF_WEBSITE_URL = 'https://www.iamm.gr/en/' as const;

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
    readonly contact: SchoolContactRecord;
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
                tr: 'Ziyaret saatleri için lütfen bizimle iletişime geçin.',
                en: 'Please contact us for visiting hours.',
                el: 'Για τις ώρες επίσκεψης, παρακαλούμε επικοινωνήστε μαζί μας.',
            },
        },
        scheduleSummary: {
            tr: 'Salı–Cumartesi ziyarete açıktır; Pazar ve Pazartesi kapalıdır. Ziyaret saatleri için lütfen bizimle iletişime geçin.',
            en: 'Open to visitors Tuesday–Saturday; closed on Sunday and Monday. Please contact us for visiting hours.',
            el: 'Ανοιχτά για το κοινό Τρίτη–Σάββατο· κλειστά Κυριακή και Δευτέρα. Για τις ώρες επίσκεψης, παρακαλούμε επικοινωνήστε μαζί μας.',
        },
        scheduleShort: {
            tr: 'Salı – Cumartesi ziyarete açıktır · Pazar ve Pazartesi kapalıdır',
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
            tr: 'Simone Restaurant (Teras Katı)',
            en: 'Simone Restaurant (Rooftop Terrace)',
            el: 'Simone Restaurant (Ταράτσα)',
        },
        websiteUrl: 'https://www.simoneistanbul.com/',
        roleDescription: {
            tr: 'Teras katında bağımsız ağırlama ve gastronomi işletmesi',
            en: 'Independent rooftop hospitality and dining venue',
            el: 'Ανεξάρτητος χώρος εστίασης και φιλοξενίας στην ταράτσα',
        },
        openDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        closedDays: ['Monday'],
        weekdayPolicyStatus: 'OWNER_CONFIRMED',
        clockHours: {
            status: 'OWNER_CONFIRMED',
            opens: '17:00',
            closes: '00:00',
            fallbackNotice: {
                tr: 'Simone Restaurant, okulun sergi ve arşiv ziyaret düzeninden bağımsız olarak Salı–Pazar 17.00–00.00 saatleri arasında hizmet vermektedir.',
                en: 'Simone Restaurant operates independently of the school’s exhibition and archive visiting schedule, open Tuesday–Sunday from 17:00 to 00:00.',
                el: 'Το Simone Restaurant λειτουργεί ανεξάρτητα από το πρόγραμμα επισκέψεων της Σχολής, Τρίτη–Κυριακή 17:00–00:00.',
            },
        },
        scheduleSummary: {
            tr: 'Pazartesi hariç her gün (Salı–Pazar) 17.00–00.00 saatleri arasında açıktır; okulun sergi ve ziyaret saatlerinden bağımsızdır.',
            en: 'Open Tuesday–Sunday from 17:00 to 00:00 (closed on Monday), independent of the school’s exhibition and visiting schedule.',
            el: 'Ανοιχτό Τρίτη–Κυριακή 17:00–00:00 (Δευτέρα κλειστά), ανεξάρτητα από το ωράριο εκθέσεων και επισκέψεων της Σχολής.',
        },
        scheduleShort: {
            tr: 'Simone Restaurant (Teras): Salı–Pazar 17.00–00.00 · Pazartesi kapalıdır',
            en: 'Simone Restaurant (Rooftop): Tuesday–Sunday 17:00–00:00 · Closed Monday',
            el: 'Simone Restaurant (Ταράτσα): Τρίτη–Κυριακή 17:00–00:00 · Δευτέρα κλειστά',
        },
        closedDaysNotice: {
            tr: 'Restoranın açık olduğu Pazar günleri (17.00–00.00) okulun sergi, arşiv ve kültür merkezi salonları genel ziyarete kapalıdır; Pazartesi günü ise hem kültür merkezi hem de restoran kapalıdır.',
            en: 'On Sundays when the restaurant is open (17:00–00:00), the school’s exhibition halls, archive rooms, and cultural center remain closed to general visitors; on Mondays both the cultural center and the restaurant are closed.',
            el: 'Την Κυριακή που το εστιατόριο λειτουργεί (17:00–00:00), οι αίθουσες εκθέσεων και το αρχείο της Σχολής παραμένουν κλειστά για το κοινό· τη Δευτέρα τόσο το πολιτιστικό κέντρο όσο και το εστιατόριο είναι κλειστά.',
        },
        independenceNotice: {
            tr: 'Restoranın açık olduğu Pazar günleri (17.00–00.00) okulun sergi, arşiv ve kültür merkezi salonları genel ziyarete kapalıdır; Pazartesi günü ise hem kültür merkezi hem de restoran kapalıdır.',
            en: 'On Sundays when the restaurant is open (17:00–00:00), the school’s exhibition halls, archive rooms, and cultural center remain closed to general visitors; on Mondays both the cultural center and the restaurant are closed.',
            el: 'Την Κυριακή που το εστιατόριο λειτουργεί (17:00–00:00), οι αίθουσες εκθέσεων και το αρχείο της Σχολής παραμένουν κλειστά για το κοινό· τη Δευτέρα τόσο το πολιτιστικό κέντρο όσο και το εστιατόριο είναι κλειστά.',
        },
    },

    contact: {
        status: 'OWNER_CONFIRMED',
        addressVerificationStatus: 'OWNER_CONFIRMED',
        phoneVerificationStatus: 'OWNER_CONFIRMED',
        streetNumber: 'No:25',
        neighborhood: 'Kemankeş Karamustafa Paşa Mh.',
        streetName: {
            tr: 'Kemeraltı Caddesi No:25',
            en: 'Kemeraltı Caddesi No:25',
            el: 'Οδός Kemeraltı No:25',
        },
        streetAddress: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25',
            el: 'Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı No:25',
        },
        districtAndCity: {
            tr: '34425 Karaköy, Beyoğlu / İstanbul',
            en: '34425 Karaköy, Beyoğlu / Istanbul',
            el: '34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
        fullAddress: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / İstanbul',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / Istanbul',
            el: 'Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı No:25, 34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
        addressLocality: 'İstanbul',
        addressRegion: 'Beyoğlu',
        postalCode: '34425',
        countryCode: 'TR',
        addressCountry: 'TR',
        displayAddress: {
            tr: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / İstanbul',
            en: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, 34425 Karaköy, Beyoğlu / Istanbul',
            el: 'Kemankeş Karamustafa Paşa Mh., Οδός Kemeraltı No:25, 34425 Καράκιοϊ, Μπέγιογλου / Κωνσταντινούπολη',
        },
        schemaStreetAddress: 'Kemankeş Karamustafa Paşa Mh., Kemeraltı Caddesi No:25, Karaköy',
        displayPhone: '+90 212 244 86 36',
        telephoneDisplay: '+90 212 244 86 36',
        telHref: 'tel:+902122448636',
        telephoneHref: 'tel:+902122448636',
        email: 'info@galatarumokulu.org',
        mailtoHref: 'mailto:info@galatarumokulu.org',
        emailHref: 'mailto:info@galatarumokulu.org',
        mapsUrl: 'https://maps.app.goo.gl/PjFPYqEuqGoSXb178',
        instagramUrl: 'https://www.instagram.com/galatarumokulukulturmerkezi/',
        geo: {
            latitude: '41.0258954',
            longitude: '28.9781318',
        },
    },
};

/**
 * Normalizes legacy same-host WordPress image URLs (`https://galatarumokulu.org/img/...`)
 * to relative static paths (`/img/...`) served directly from the Vercel static bundle (`public/img/...`).
 * Ensures zero hotlink dependency on the retiring WordPress server across local, preview, and production.
 */
export function normalizeLegacyMediaUrl(rawUrl: string | null | undefined): string {
    if (!rawUrl) return '';
    const trimmed = rawUrl.trim();
    if (/^https?:\/\/(www\.)?galatarumokulu\.org\/img\//i.test(trimmed)) {
        return trimmed.replace(/^https?:\/\/(www\.)?galatarumokulu\.org/i, '');
    }
    if (/^https?:\/\/tvloakrlqazcadokliaf\.supabase\.co\/storage\/v1\/object\/public\/media\//i.test(trimmed)) {
        return trimmed.replace(
            /^https?:\/\/tvloakrlqazcadokliaf\.supabase\.co\/storage\/v1\/object\/public\/media\//i,
            '/supabase-media/'
        );
    }
    return trimmed;
}

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

    const simoneStatusText = simoneOpen
        ? lang === 'tr'
            ? 'Simone Restaurant (Teras): Açık (Salı–Pazar 17.00–00.00)'
            : lang === 'el'
                ? 'Simone Restaurant (Ταράτσα): Ανοιχτά (Τρίτη–Κυριακή 17:00–00:00)'
                : 'Simone Restaurant (Rooftop): Open (Tuesday–Sunday 17:00–00:00)'
        : lang === 'tr'
            ? 'Simone Restaurant (Teras): Kapalı (Pazartesi kapalıdır)'
            : lang === 'el'
                ? 'Simone Restaurant (Ταράτσα): Κλειστά (Δευτέρα κλειστά)'
                : 'Simone Restaurant (Rooftop): Closed (Closed on Monday)';

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
 * Crucial Rules:
 * - School address (Kemeraltı Caddesi No:25) and telephone (+90 212 244 86 36) belong strictly
 *   to the Galata Rum Okulu cultural center / organization and are never assigned to Simone Restaurant.
 * - Do NOT include openingHours or openingHoursSpecification with fabricated clock times while
 *   school clockHours.status === 'PENDING_OWNER'.
 * - Simone Restaurant clock times are intentionally OMITTED_BY_OWNER_POLICY; never output
 *   openingHours, openingHoursSpecification, or round-the-clock hours on Simone Restaurant.
 */
export function buildInstitutionalJsonLd(pagePath = '') {
    const cleanUrl = `${PRODUCTION_SITE_ORIGIN}${pagePath}`;
    const schoolHoursConfirmed =
        VENUE_INFO.school.clockHours.status === 'OWNER_CONFIRMED' &&
        Boolean(VENUE_INFO.school.clockHours.opens) &&
        Boolean(VENUE_INFO.school.clockHours.closes);

    const schoolPostalAddress = {
        '@type': 'PostalAddress',
        streetAddress: VENUE_INFO.contact.schemaStreetAddress,
        addressLocality: VENUE_INFO.contact.addressLocality,
        addressRegion: VENUE_INFO.contact.addressRegion,
        postalCode: VENUE_INFO.contact.postalCode,
        addressCountry: VENUE_INFO.contact.countryCode,
    };

    const archiveEntity: Record<string, unknown> = {
        '@type': 'Archive',
        '@id': `${PRODUCTION_SITE_ORIGIN}/#archive`,
        name: 'Galata Rum Okulu & İstanbul Rum Cemaati Dijital Arşivi',
        alternateName: 'Istanbul Greek Community Archive',
        url: `${PRODUCTION_SITE_ORIGIN}/arsiv`,
        description:
            'Historical archive preserving documents, photographs, diplomas, and educational records of the Galata Greek School and the Greek community of Istanbul.',
    };

    const placeEntity: Record<string, unknown> = {
        '@type': ['Place', 'LandmarksOrHistoricalBuildings', 'CivicStructure', 'EventVenue'],
        '@id': `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
        url: PRODUCTION_SITE_ORIGIN,
        name: VENUE_INFO.school.name.tr,
        alternateName: [VENUE_INFO.school.name.en, VENUE_INFO.school.name.el],
        description:
            'Historic 1910 neoclassical Greek school building in Karaköy, Istanbul, serving as a cultural center, exhibition venue, and digital archive. Public visiting days: Tuesday through Saturday (closed Sunday and Monday). Please contact the cultural center for visiting hours.',
        maximumAttendeeCapacity: 850,
        telephone: VENUE_INFO.contact.displayPhone,
        email: VENUE_INFO.contact.email,
        address: schoolPostalAddress,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: VENUE_INFO.contact.geo.latitude,
            longitude: VENUE_INFO.contact.geo.longitude,
        },
        containsPlace: archiveEntity,
        sameAs: [
            VENUE_INFO.contact.instagramUrl,
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
        url: VENUE_INFO.simoneRestaurant.websiteUrl,
        sameAs: [VENUE_INFO.simoneRestaurant.websiteUrl],
        description:
            'Independent rooftop restaurant located on the terrace level of the historic Galata building. Open Tuesday through Sunday from 17:00 to 00:00 (closed on Monday), operating independently of the school’s public exhibition and archive visiting schedule.',
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: VENUE_INFO.simoneRestaurant.openDays,
                opens: VENUE_INFO.simoneRestaurant.clockHours.opens,
                closes: VENUE_INFO.simoneRestaurant.clockHours.closes,
            },
        ],
        containedInPlace: {
            '@id': `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: VENUE_INFO.contact.addressLocality,
            addressRegion: VENUE_INFO.contact.addressRegion,
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
                alternateName: [VENUE_INFO.school.name.en, VENUE_INFO.school.name.el],
                telephone: VENUE_INFO.contact.displayPhone,
                email: VENUE_INFO.contact.email,
                address: schoolPostalAddress,
                sameAs: placeEntity.sameAs,
            },
            placeEntity,
            simoneEntity,
        ],
    };
}

export interface StaticPageSeoSpec {
    title: Record<SupportedLocale, string>;
    h1: Record<SupportedLocale, string>;
    description: Record<SupportedLocale, string>;
}

/**
 * Single authoritative locale-aware SEO metadata map shared by prerender.mjs and SEO.tsx.
 * Guarantees 0 drift between static HTML and client-hydrated DOM across all core routes.
 */
export const STATIC_PAGE_SEO: Record<string, StaticPageSeoSpec> = {
    '/': {
        title: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi',
            en: 'Galata Greek School Foundation - Cultural Center',
            el: 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο',
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
    '/tarihce': {
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
    '/arsiv': {
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
    '/arsiv/koleksiyon': {
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
    '/arsiv/istanbul-rum': {
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
    '/mekan-kiralama': {
        title: {
            tr: 'MICE, Lansman & Tarihi Mekan Kiralama | Galata Rum Okulu',
            en: 'MICE, Brand Launch & Heritage Venue Hire | Galata Greek School',
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
    '/gecmis-etkinlikler': {
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
    '/bize-ulasin': {
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
    '/ammf': {
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
    '/kvkk': {
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
    '/gizlilik-politikasi': {
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
    '/cerez-politikasi': {
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
    '/admin': {
        title: {
            tr: 'Galata CMS — Yönetici Paneli | Galata Rum Okulu',
            en: 'Galata CMS — Admin Portal | Galata Greek School',
            el: 'Galata CMS — Πύλη Διαχείρισης | Σχολή Γαλατά',
        },
        h1: {
            tr: 'Galata CMS — Yönetici Paneli',
            en: 'Galata CMS — Admin Portal',
            el: 'Galata CMS — Πύλη Διαχείρισης',
        },
        description: {
            tr: 'Galata Rum Okulu Vakfı - Kültür Merkezi kurumsal içerik, sergi ve dijital arşiv yönetim paneli giriş ekranı.',
            en: 'Galata Greek School Foundation - Cultural Center institutional content, exhibition, and digital archive management portal.',
            el: 'Πύλη διαχείρισης περιεχομένου, εκθέσεων και ψηφιακού αρχείου του Ιδρύματος Ελληνικού Σχολείου Γαλατά.',
        },
    },
};
