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

    const currentUrl = `${url}${location.pathname}`;

    return (
        <Helmet>
            <html lang={lang} />
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Canonical and Hreflang Tags */}
            <link rel="canonical" href={lang === 'tr' ? currentUrl : `${currentUrl}?lang=${lang}`} />
            <link rel="alternate" hrefLang="tr" href={currentUrl} />
            <link rel="alternate" hrefLang="en" href={`${currentUrl}?lang=en`} />
            <link rel="alternate" hrefLang="el" href={`${currentUrl}?lang=el`} />
            <link rel="alternate" hrefLang="x-default" href={currentUrl} />
            
            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={lang === 'tr' ? currentUrl : `${currentUrl}?lang=${lang}`} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* AI SEO Schema (JSON-LD) */}
            {aiSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(aiSchema)}
                </script>
            )}
        </Helmet>
    );
}
