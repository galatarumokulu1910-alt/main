import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './VenueHirePage.css';

export default function VenueHirePage() {
    const { lang } = useI18n();
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
        <div className="venue-hire-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <SEO 
                titleKey="venue.pageTitle" 
                descriptionKey="venue.pageDesc" 
                keywordsKey="venue.pageKeywords"
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": ["EventVenue", "Place"],
                    "name": "Galata Greek School — Heritage Exhibition Venue Galata",
                    "alternateName": "Galata Rum Okulu Etkinlik Alanı",
                    "description": "A historic, 19th-century neoclassical venue available for exhibitions, cultural events, and corporate gatherings. Your event funds the preservation of the Greek community archive in Istanbul's Galata district.",
                    "url": "https://galatarumokulu.org.tr/mekan-kiralama",
                    "image": "https://galatarumokulu.org.tr/images/homepage/detail-3.webp",
                    "openingHours": "Mo-Sa 10:00-18:00",
                    "maximumAttendeeCapacity": 500,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Kemankeş Mah. Galata Mahkemesi Sok. No:20",
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
                    "telephone": "+90 212 244 55 55",
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
            <div className="venue-galleries" style={{ padding: '4rem 5%', maxWidth: '1440px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-brass-gold)' }}>
                    {lang === 'tr' ? 'Mekanlarımızdan Kareler' : lang === 'el' ? 'Στιγμιότυπα από τους Χώρους μας' : 'Glimpses of Our Venues'}
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading venue highlights...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {venues.map((venue) => (
                            <div key={venue.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <img
                                    src={venue.image_url || '/placeholder.png'}
                                    alt={venue[`title_${l}`] || venue.title_en}
                                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{venue[`title_${l}`] || venue.title_en}</h3>
                                <p style={{ color: 'var(--color-inscription)', lineHeight: 1.6 }}>{venue[`description_${l}`] || venue.description_en}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
