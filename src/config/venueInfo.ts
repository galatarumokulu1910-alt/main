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
 *    - OPEN: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (All 7 days)
 *    - Independent from school visitor access; Sunday/Monday restaurant opening
 *      never implies school exhibitions or archive are open.
 *    - Clock times: OMITTED_BY_OWNER_POLICY — never display specific opening/closing
 *      times anywhere, and never represent daily opening as round-the-clock operation.
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
        roleDescription: {
            tr: 'Teras katında bağımsız ağırlama ve gastronomi işletmesi',
            en: 'Independent rooftop hospitality and dining venue',
            el: 'Ανεξάρτητος χώρος εστίασης και φιλοξενίας στην ταράτσα',
        },
        openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        closedDays: [],
        weekdayPolicyStatus: 'OWNER_CONFIRMED',
        clockHours: {
            status: 'OMITTED_BY_OWNER_POLICY',
            opens: null,
            closes: null,
            fallbackNotice: {
                tr: 'Simone Restaurant, okulun sergi ve arşiv ziyaret düzeninden bağımsız olarak hizmet vermektedir.',
                en: 'Simone Restaurant operates independently of the school’s exhibition and archive visiting schedule.',
                el: 'Το Simone Restaurant λειτουργεί ανεξάρτητα από το πρόγραμμα επισκέψεων των εκθέσεων και του αρχείου της Σχολής.',
            },
        },
        scheduleSummary: {
            tr: 'Simone Restaurant haftanın her günü açıktır; okulun sergi/ziyaret saatlerinden bağımsızdır.',
            en: 'Simone Restaurant is open every day of the week, independent of the school’s exhibition and visiting schedule.',
            el: 'Το Simone Restaurant είναι ανοιχτό κάθε μέρα της εβδομάδας, ανεξάρτητα από το ωράριο εκθέσεων και επισκέψεων της Σχολής.',
        },
        scheduleShort: {
            tr: 'Simone Restaurant (Teras): Haftanın her günü açıktır',
            en: 'Simone Restaurant (Rooftop): Open every day of the week',
            el: 'Simone Restaurant (Ταράτσα): Ανοιχτό κάθε μέρα της εβδομάδας',
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
            latitude: '41.0238',
            longitude: '28.9774',
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

    const simoneStatusText = lang === 'tr'
        ? 'Simone Restaurant (Teras): Açık (Haftanın her günü açıktır)'
        : lang === 'el'
            ? 'Simone Restaurant (Ταράτσα): Ανοιχτά (Κάθε μέρα της εβδομάδας)'
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

    const placeEntity: Record<string, unknown> = {
        '@type': ['LandmarksOrHistoricalBuildings', 'CivicStructure', 'Place'],
        '@id': `${PRODUCTION_SITE_ORIGIN}/#school-venue`,
        url: PRODUCTION_SITE_ORIGIN,
        name: VENUE_INFO.school.name.tr,
        alternateName: [VENUE_INFO.school.name.en, VENUE_INFO.school.name.el],
        description:
            'Historic 1910 neoclassical Greek school building in Karaköy, Istanbul, serving as a cultural center, exhibition venue, and digital archive. Public visiting days: Tuesday through Saturday (closed Sunday and Monday). Please contact the cultural center for visiting hours.',
        telephone: VENUE_INFO.contact.displayPhone,
        email: VENUE_INFO.contact.email,
        address: schoolPostalAddress,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: VENUE_INFO.contact.geo.latitude,
            longitude: VENUE_INFO.contact.geo.longitude,
        },
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
        description:
            'Independent rooftop restaurant located on the terrace level of the historic Galata building. Open seven days a week (Monday through Sunday), operating independently of the school’s public exhibition and archive visiting schedule.',
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
