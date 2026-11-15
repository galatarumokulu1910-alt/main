import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { DEFAULT_OG_IMAGE_URL, PRODUCTION_SITE_ORIGIN } from '../../config/venueInfo';

interface SEOProps {
    titleKey?: string;
    descriptionKey?: string;
    overrideTitle?: string;
    overrideDescription?: string;
    keywordsKey?: string;
    overrideKeywords?: string;
    aiSchema?: Record<string, any>;
    image?: string;
    url?: string;
    noindex?: boolean;
}

export default function SEO({
    titleKey,
    descriptionKey,
    overrideTitle,
    overrideDescription,
    keywordsKey,
    overrideKeywords,
    aiSchema,
    image = DEFAULT_OG_IMAGE_URL,
    url = PRODUCTION_SITE_ORIGIN,
    noindex = false,
}: SEOProps) {
    const { t, lang } = useI18n();
    const location = useLocation();

    const rawPageTitle = overrideTitle || (titleKey ? t(titleKey) : '');
    const brandShort =
        lang === 'en'
            ? 'Galata Greek School'
            : lang === 'el'
              ? 'Σχολή Γαλατά'
              : 'Galata Rum Okulu';
    const suffix = ` | ${brandShort}`;
    const cleanedTitle = rawPageTitle
        .replace(
            /\s*\|\s*(Galata Rum Okulu.*|Galata Greek School.*|Ίδρυμα Ελληνικού Σχολείου.*|Ελληνική Σχολή Γαλατά.*|Σχολή Γαλατά.*)$/i,
            ''
        )
        .trim();

    let fullTitle: string;
    if (!cleanedTitle) {
        fullTitle =
            lang === 'en'
                ? 'Galata Greek School | Cultural Center & Digital Archive'
                : lang === 'el'
                  ? 'Ελληνική Σχολή Γαλατά | Πολιτιστικό Κέντρο & Αρχείο'
                  : 'Galata Rum Okulu Vakfı | Kültür Merkezi & Dijital Arşiv';
    } else if (`${cleanedTitle}${suffix}`.length <= 60) {
        fullTitle = `${cleanedTitle}${suffix}`;
        if (fullTitle.length < 30) {
            const pad =
                lang === 'en'
                    ? ' — Exhibition & Archive'
                    : lang === 'el'
                      ? ' — Έκθεση & Αρχείο'
                      : ' — Sergi & Dijital Arşiv';
            const padded = `${cleanedTitle}${pad}${suffix}`;
            fullTitle = padded.length <= 60 ? padded : fullTitle;
        }
    } else {
        const maxBase = 60 - suffix.length - 1;
        const truncated =
            cleanedTitle.slice(0, maxBase).replace(/\s+\S*$/, '').trim() ||
            cleanedTitle.slice(0, maxBase).trim();
        fullTitle = `${truncated}…${suffix}`;
    }

    const rawDescription =
        overrideDescription || (descriptionKey ? t(descriptionKey) : t('meta.defaultDescription'));
    let description = (rawDescription || '').replace(/\s+/g, ' ').trim();
    if (description.length < 120) {
        const fallbackTail =
            lang === 'en'
                ? ' Explore archival records, exhibitions, MICE event spaces, and cultural heritage at Galata Greek School in Karaköy, Istanbul.'
                : lang === 'el'
                  ? ' Εξερευνήστε αρχειακά τεκμήρια, εκθέσεις, αίθουσες MICE και την πολιτιστική κληρονομιά στη Σχολή Γαλατά στην Κωνσταντινούπολη.'
                  : ' İstanbul Karaköy’deki tarihi Galata Rum Okulu Vakfı - Kültür Merkezi sergi, MICE etkinlik mekanı ve dijital arşiv koleksiyonu.';
        description = description
            ? `${description}${description.endsWith('.') ? '' : '.'}${fallbackTail}`
            : `${cleanedTitle || brandShort}.${fallbackTail}`;
    }
    if (description.length > 160) {
        description = `${description.slice(0, 157).replace(/\s+\S*$/, '').trim()}…`;
    }
    const keywords = overrideKeywords || (keywordsKey ? t(keywordsKey) : '');

    const getCleanPath = (pathname: string) => {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 0 && ['en', 'el', 'tr'].includes(parts[0])) {
            return '/' + parts.slice(1).join('/');
        }
        return pathname || '/';
    };

    const cleanPath = getCleanPath(location.pathname);
    const normalizedPath = cleanPath === '/' ? '' : cleanPath;
    const trUrl = `${url}${normalizedPath || '/'}`;
    const enUrl = `${url}/en${normalizedPath}`;
    const elUrl = `${url}/el${normalizedPath}`;
    const canonicalUrl = lang === 'en' ? enUrl : lang === 'el' ? elUrl : trUrl;

    const isStagingHost =
        typeof window !== 'undefined' &&
        (window.location.hostname.endsWith('.vercel.app') || window.location.hostname.includes('staging'));
    const shouldNoIndex = noindex || isStagingHost;

    return (
        <Helmet>
            <html lang={lang} />
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {shouldNoIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Canonical and Hreflang Tags */}
            {!noindex && <link rel="canonical" href={canonicalUrl} />}
            {!noindex && <link rel="alternate" hrefLang="tr" href={trUrl} />}
            {!noindex && <link rel="alternate" hrefLang="en" href={enUrl} />}
            {!noindex && <link rel="alternate" hrefLang="el" href={elUrl} />}
            {!noindex && <link rel="alternate" hrefLang="x-default" href={trUrl} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* AI SEO Schema (JSON-LD) */}
            {aiSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(aiSchema) }}
                />
            )}
        </Helmet>
    );
}
