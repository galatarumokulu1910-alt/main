import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { enrichVenueEventsWithMiceSpecs } from '../../services/dbSync';
import { PRODUCTION_SITE_ORIGIN, VENUE_INFO } from '../../config/venueInfo';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './VenueHirePage.css';

export default function VenueHirePage() {
    const { lang, localizePath, t } = useI18n();
    const l = lang || 'en';
    const [venues, setVenues] = useState<any[]>(() => enrichVenueEventsWithMiceSpecs(null));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenues = async () => {
            const { data } = await supabase
                .from('venue_events')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: true });

            setVenues(enrichVenueEventsWithMiceSpecs(data));
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
                    "name": VENUE_INFO.institutionName[l],
                    "alternateName": VENUE_INFO.institutionName.en,
                    "description": "A monumental 19th-century neoclassical landmark in Galata, Istanbul, offering 1,060 m² across 3 floors for international art exhibitions, biennials, academic conferences, classical concerts, and exclusive receptions.",
                    "url": `${PRODUCTION_SITE_ORIGIN}${localizePath('/mekan-kiralama')}`,
                    "image": `${PRODUCTION_SITE_ORIGIN}/images/homepage/detail-3.webp`,
                    "maximumAttendeeCapacity": 850,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": VENUE_INFO.contact.schemaStreetAddress,
                        "addressLocality": VENUE_INFO.contact.addressLocality,
                        "addressRegion": VENUE_INFO.contact.addressRegion,
                        "postalCode": VENUE_INFO.contact.postalCode,
                        "addressCountry": VENUE_INFO.contact.addressCountry
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": String(VENUE_INFO.contact.geo.latitude),
                        "longitude": String(VENUE_INFO.contact.geo.longitude)
                    },
                    "telephone": VENUE_INFO.contact.telephoneDisplay,
                    "containsPlace": {
                        "@type": "Archive",
                        "name": "Istanbul Greek Community Archive",
                        "description": "Historical archive preserving documents, photographs, and educational records of the Greek community of Istanbul."
                    },
                    "sameAs": [
                        "https://www.instagram.com/galatarumokulukulturmerkezi/",
                        "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu"
                    ]
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Mekan Kiralama', en: 'Venue Hire', el: 'Ενοικίαση Χώρου' } }]} />
            <FloorPlan initialVenues={venues} externalLoading={loading} />

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

            {/* Closing call — highlights the historic prestige and architectural character of the venue */}
            <section className="venue-cta">
                <div className="venue-cta__inner">
                    <h2 className="venue-cta__title">
                        {lang === 'tr' ? 'Tarihin Prestijiyle Buluşun' : lang === 'el' ? 'Όπου η Ιστορία Συναντά το Κύρος' : 'Where History Meets Prestige'}
                    </h2>
                    <p className="venue-cta__text">
                        {lang === 'tr'
                            ? '19. yüzyıldan günümüze uzanan anıtsal neoklasik mimarisi, yüksek tavanlı salonları ve zamansız atmosferiyle Galata Rum Okulu; uluslararası bienallerden çağdaş sanat sergilerine, prestijli konferanslardan seçkin davet ve lansmanlara kadar unutulmaz buluşmalara ev sahipliği yapar.'
                            : lang === 'el'
                                ? 'Με τη μνημειακή νεοκλασική αρχιτεκτονική του 19ου αιώνα, τις ψηλοτάβανες αίθουσες και τη διαχρονική του ατμόσφαιρα, η Σχολή Γαλατά φιλοξενεί αξέχαστες συναντήσεις — από διεθνείς μπιενάλε και εκθέσεις σύγχρονης τέχνης έως συνέδρια υψηλού κύρους και εκλεκτές δεξιώσεις.'
                                : 'With its monumental 19th-century neoclassical architecture, high-ceilinged halls, and timeless atmosphere, the Galata Greek School hosts unforgettable gatherings — from international biennials and contemporary art exhibitions to prestigious conferences and exclusive receptions.'}
                    </p>
                    <div className="venue-cta__actions">
                        <Link to={localizePath('/bize-ulasin')} className="venue-cta__btn">{t('hero.cta')}</Link>
                        <Link to={localizePath('/gecmis-etkinlikler')} className="venue-cta__phone">
                            {lang === 'tr' ? 'Geçmiş Etkinlikleri İnceleyin →' : lang === 'el' ? 'Δείτε Παρελθούσες Εκδηλώσεις →' : 'Explore Past Events →'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
