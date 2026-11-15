import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './VenueHirePage.css';

export default function VenueHirePage() {
    const { lang, localizePath, t } = useI18n();
    const l = lang || 'en';
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true });

            if (data) setVenues(data);
            setLoading(false);
        };
        fetchVenues();
    }, []);

    return (
        <div className="venue-hire-page">
            <SEO 
                titleKey="venue.pageTitle" 
                descriptionKey="venue.pageDesc" 
                keywordsKey="venue.pageKeywords"
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": ["EventVenue", "Place"],
                    "name": "Galata Rum Okulu Vakfı - Kültür Merkezi",
                    "alternateName": "Galata Greek School Foundation - Cultural Center",
                    "description": "A historic, 19th-century neoclassical venue available for exhibitions, cultural events, and corporate gatherings. Your event funds the preservation of the Greek community archive in Istanbul's Galata district.",
                    "url": "https://galatarumokulu.org.tr/mekan-kiralama",
                    "image": "https://galatarumokulu.org.tr/images/homepage/detail-3.webp",
                    "openingHours": "Mo-Sa 10:00-18:00",
                    "maximumAttendeeCapacity": 500,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49",
                        "addressLocality": "Istanbul",
                        "addressRegion": "Beyoğlu",
                        "postalCode": "34425",
                        "addressCountry": "TR"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": "41.0238",
                        "longitude": "28.9774"
                    },
                    "telephone": "+90 212 892 43 00",
                    "containsPlace": {
                        "@type": "Archive",
                        "name": "Istanbul Greek Community Archive",
                        "description": "Historical archive preserving documents, photographs, and educational records of the Greek community of Istanbul."
                    },
                    "sameAs": [
                        "https://www.instagram.com/galatarumokulu/",
                        "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu"
                    ]
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Mekan Kiralama', en: 'Venue Hire', el: 'Ενοικίαση Χώρου' } }]} />
            <FloorPlan />

            {/* CMS Venue Galleries */}
            <div className="venue-galleries">
                <h2 className="venue-galleries__title">
                    {lang === 'tr' ? 'Mekanlarımızdan Kareler' : lang === 'el' ? 'Στιγμιότυπα από τους Χώρους μας' : 'Glimpses of Our Venues'}
                </h2>

                {loading ? (
                    <div className="venue-galleries__loading">{lang === 'tr' ? 'Mekan özetleri yükleniyor…' : lang === 'el' ? 'Φόρτωση χώρων…' : 'Loading venue highlights…'}</div>
                ) : (
                    <div className="venue-galleries__grid">
                        {venues.map((venue) => (
                            <div key={venue.id} className="venue-galleries__card">
                                <img
                                    src={venue.image_url || '/placeholder.png'}
                                    alt={venue[`title_${l}`] || venue.title_en}
                                    className="venue-galleries__img"
                                    loading="lazy"
                                    width="480"
                                    height="270"
                                />
                                <h3 className="venue-galleries__card-title">{venue[`title_${l}`] || venue.title_en}</h3>
                                <p className="venue-galleries__card-desc">{venue[`description_${l}`] || venue.description_en}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Closing call — ties cultural gatherings to the foundation's archive mission */}
            <section className="venue-cta">
                <div className="venue-cta__inner">
                    <h2 className="venue-cta__title">
                        {lang === 'tr' ? 'Kültürel Mirasa Ortak Olun' : lang === 'el' ? 'Γίνετε Μέρος μιας Ζωντανής Κληρονομιάς' : 'Share in a Living Heritage'}
                    </h2>
                    <p className="venue-cta__text">
                        {lang === 'tr'
                            ? 'Burada gerçekleşen her sergi, kültür-sanat projesi ve buluşma, İstanbul Rum toplumu arşivinin korunmasını ve gelecek kuşaklara aktarılmasını destekler.'
                            : lang === 'el'
                                ? 'Κάθε έκθεση, πολιτιστικό έργο και συνάντηση που φιλοξενείται εδώ στηρίζει τη διατήρηση του αρχείου της ελληνικής κοινότητας της Κωνσταντινούπολης.'
                                : 'Every exhibition, cultural project, and gathering hosted here supports the preservation of the Istanbul Greek community archive for future generations.'}
                    </p>
                    <div className="venue-cta__actions">
                        <Link to={localizePath('/bize-ulasin')} className="venue-cta__btn">{t('hero.cta')}</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
