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

    const siteTitle =
        lang === 'en'
            ? 'Galata Greek School Foundation - Cultural Center'
            : lang === 'el'
                ? 'Ίδρυμα Ελληνικού Σχολείου Γαλατά - Πολιτιστικό Κέντρο'
                : 'Galata Rum Okulu Vakfı - Kültür Merkezi';
    const pageTitle = overrideTitle || (titleKey ? t(titleKey) : '');
    const fullTitle = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

    const description = overrideDescription || (descriptionKey ? t(descriptionKey) : t('meta.defaultDescription'));
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
