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
