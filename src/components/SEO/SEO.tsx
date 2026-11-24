import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import {
    DEFAULT_OG_IMAGE_URL,
    PRODUCTION_SITE_ORIGIN,
    STATIC_PAGE_SEO,
    type SupportedLocale,
} from '../../config/venueInfo';

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
    const locale = (lang || 'tr') as SupportedLocale;

    const getCleanPath = (pathname: string) => {
        const trimmed = pathname.replace(/\/+$/, '') || '/';
        const parts = trimmed.split('/').filter(Boolean);
        if (parts.length > 0 && ['en', 'el', 'tr'].includes(parts[0])) {
            return '/' + parts.slice(1).join('/') || '/';
        }
        return trimmed;
    };

    const currentRoutePath = location.pathname.replace(/\/+$/, '') || '/';
    const cleanPath = getCleanPath(currentRoutePath);
    const normalizedPath = cleanPath === '/' ? '' : cleanPath;
    const staticSpec = STATIC_PAGE_SEO[cleanPath];

    // Check if the current document was pre-rendered for this exact route path
    let prerenderTitle: string | null = null;
    let prerenderDescription: string | null = null;
    if (typeof document !== 'undefined') {
        const prerenderRouteEl = document.querySelector('meta[name="prerender-route"]');
        const prerenderRouteVal = prerenderRouteEl?.getAttribute('content');
        if (prerenderRouteVal === currentRoutePath) {
            prerenderTitle =
                document.querySelector('meta[name="prerender-title"]')?.getAttribute('content') || null;
            prerenderDescription =
                document.querySelector('meta[name="prerender-description"]')?.getAttribute('content') || null;
        }
    }

    const brandShort =
        locale === 'en'
            ? 'Galata Greek School'
            : locale === 'el'
              ? 'Σχολή Γαλατά'
              : 'Galata Rum Okulu';
    const suffix = ` | ${brandShort}`;

    let fullTitle: string;
    if (staticSpec) {
        fullTitle = staticSpec.title[locale];
    } else if (prerenderTitle) {
        fullTitle = prerenderTitle;
    } else {
        const rawPageTitle = overrideTitle || (titleKey ? t(titleKey) : '');
        const cleanedTitle = rawPageTitle
            .replace(
                /\s*\|\s*(Galata Rum Okulu.*|Galata Greek School.*|Αστική Σχολή Γαλατά.*|Ίδρυμα Ελληνικού Σχολείου.*|Ελληνική Σχολή Γαλατά.*|Σχολή Γαλατά.*)$/i,
                ''
            )
            .trim();

        if (!cleanedTitle) {
            fullTitle = STATIC_PAGE_SEO['/'].title[locale];
        } else if (`${cleanedTitle}${suffix}`.length <= 60) {
            fullTitle = `${cleanedTitle}${suffix}`;
            if (fullTitle.length < 30) {
                const pad =
                    locale === 'en'
                        ? ' — Exhibition & Archive'
                        : locale === 'el'
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
    }

    let description: string;
    if (staticSpec) {
        description = staticSpec.description[locale];
    } else if (prerenderDescription) {
        description = prerenderDescription;
    } else {
        const rawDescription =
            overrideDescription || (descriptionKey ? t(descriptionKey) : t('meta.defaultDescription'));
        description = (rawDescription || '').replace(/\s+/g, ' ').trim();
        if (description.length < 120) {
            const fallbackTail =
                locale === 'en'
                    ? ' Explore archival records, exhibitions, MICE event spaces, and cultural heritage at Galata Greek School in Karaköy, Istanbul.'
                    : locale === 'el'
                      ? ' Εξερευνήστε αρχειακά τεκμήρια, εκθέσεις, αίθουσες MICE και την πολιτιστική κληρονομιά στη Σχολή Γαλατά στην Κωνσταντινούπολη.'
                      : ' İstanbul Karaköy’deki tarihi Galata Rum Okulu Vakfı - Kültür Merkezi sergi, MICE etkinlik mekanı ve dijital arşiv koleksiyonu.';
            description = description
                ? `${description}${description.endsWith('.') ? '' : '.'}${fallbackTail}`
                : `${brandShort}.${fallbackTail}`;
        }
        if (description.length > 160) {
            description = `${description.slice(0, 157).replace(/\s+\S*$/, '').trim()}…`;
        }
    }

    const keywords = overrideKeywords || (keywordsKey ? t(keywordsKey) : '');

    const trUrl = `${url}${normalizedPath || '/'}`;
    const enUrl = `${url}/en${normalizedPath}`;
    const elUrl = `${url}/el${normalizedPath}`;
    const canonicalUrl = locale === 'en' ? enUrl : locale === 'el' ? elUrl : trUrl;

    // Rule 1 & Rule 3: Only admin (and 404) routes get route-level noindex in DOM.
    // Staging host protection is enforced via host-scoped HTTP header X-Robots-Tag: noindex, nofollow.
    const isAdminRoute = cleanPath === '/admin' || cleanPath.startsWith('/admin/');
    const effectiveNoIndex = noindex || isAdminRoute;
    const robotsContent = effectiveNoIndex ? 'noindex, nofollow' : 'index, follow';

    // Remove static prerendered JSON-LD once React Helmet mounts its live schema so rendered DOM has a single canonical block
    useEffect(() => {
        if (!aiSchema || typeof document === 'undefined') return;
        document.querySelectorAll('script[data-prerender-ld="true"]').forEach((el) => el.remove());
    }, [aiSchema, currentRoutePath]);

    return (
        <Helmet>
            <html lang={locale} />
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robotsContent} />

            {/* Canonical and Hreflang Tags (Only on indexable public routes) */}
            {!effectiveNoIndex && <link rel="canonical" href={canonicalUrl} />}
            {!effectiveNoIndex && <link rel="alternate" hrefLang="tr" href={trUrl} />}
            {!effectiveNoIndex && <link rel="alternate" hrefLang="en" href={enUrl} />}
            {!effectiveNoIndex && <link rel="alternate" hrefLang="el" href={elUrl} />}
            {!effectiveNoIndex && <link rel="alternate" hrefLang="x-default" href={trUrl} />}

            {/* Markdown alternate only for the root homepage */}
            {!effectiveNoIndex && currentRoutePath === '/' && (
                <link rel="alternate" type="text/markdown" href="/index.md" title="Markdown" />
            )}

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
