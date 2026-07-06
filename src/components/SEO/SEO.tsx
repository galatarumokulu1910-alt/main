import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';

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
}

export default function SEO({
    titleKey,
    descriptionKey,
    overrideTitle,
    overrideDescription,
    keywordsKey,
    overrideKeywords,
    aiSchema,
    image = 'https://galatarumokulu.org.tr/og-image.jpg',
    url = 'https://galatarumokulu.org.tr'
}: SEOProps) {
    const { t, lang } = useI18n();
    const location = useLocation();

    const siteTitle = 'Galata Rum Okulu';
    const pageTitle = overrideTitle || (titleKey ? t(titleKey) : '');
    const fullTitle = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

    const description = overrideDescription || (descriptionKey ? t(descriptionKey) : t('meta.defaultDescription'));
    const keywords = overrideKeywords || (keywordsKey ? t(keywordsKey) : '');

    const getCleanPath = (pathname: string) => {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 0 && ['en', 'el'].includes(parts[0])) {
            return '/' + parts.slice(1).join('/');
        }
        return pathname;
    };

    const cleanPath = getCleanPath(location.pathname);
    const trUrl = `${url}${cleanPath === '/' ? '' : cleanPath}`;
    const enUrl = `${url}/en${cleanPath === '/' ? '' : cleanPath}`;
    const elUrl = `${url}/el${cleanPath === '/' ? '' : cleanPath}`;
    const canonicalUrl = lang === 'en' ? enUrl : lang === 'el' ? elUrl : trUrl;

    return (
        <Helmet>
            <html lang={lang} />
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Canonical and Hreflang Tags */}
            <link rel="canonical" href={canonicalUrl} />
            <link rel="alternate" hrefLang="tr" href={trUrl} />
            <link rel="alternate" hrefLang="en" href={enUrl} />
            <link rel="alternate" hrefLang="el" href={elUrl} />
            <link rel="alternate" hrefLang="x-default" href={trUrl} />
            
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
