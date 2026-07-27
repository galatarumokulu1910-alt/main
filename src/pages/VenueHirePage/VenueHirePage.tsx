import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useI18n } from '../../i18n/I18nContext';
import SEO from '../../components/SEO/SEO';
import FloorPlan from '../../components/FloorPlan/FloorPlan';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './VenueHirePage.css';

export default function VenueHirePage() {
    const { lang, t } = useI18n();
    const l = lang || 'en';
    const [preloaderActive, setPreloaderActive] = useState(() => {
        return !sessionStorage.getItem('venue_preloader_seen');
    });

    const floorPlanReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.05, once: false });

    useEffect(() => {
        if (preloaderActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [preloaderActive]);

    useEffect(() => {
        if (!preloaderActive) return;
        const timer = setTimeout(() => {
            setPreloaderActive(false);
            sessionStorage.setItem('venue_preloader_seen', 'true');
        }, 3400);
        return () => clearTimeout(timer);
    }, [preloaderActive]);

    return (
        <div className="venue-hire-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            {/* ══════ PRELOADER ══════ */}
            <div className={`hp-preloader ${preloaderActive ? '' : 'hp-preloader--hidden'}`}>
                <div className="hp-preloader__decor" aria-hidden="true">
                    <svg className="hp-preloader__decor-blob hp-preloader__decor-blob--1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#e0f2fe" d="M45,-57C58,-48,68,-33,72,-16C76,1,74,19,66,33C58,47,43,58,26,64C9,70,-9,72,-26,67C-43,62,-58,50,-66,34C-74,18,-74,-2,-68,-20C-62,-38,-49,-54,-33,-62C-17,-70,2,-70,17,-70C32,-70,32,-66,45,-57Z" transform="translate(100 100)" />
                    </svg>
                    <svg className="hp-preloader__decor-blob hp-preloader__decor-blob--2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#fef3c7" d="M39,-48C51,-41,61,-28,65,-13C69,2,67,19,59,32C51,45,37,54,21,61C5,68,-13,73,-28,68C-43,63,-55,48,-61,31C-67,14,-67,-5,-61,-22C-55,-39,-43,-54,-28,-62C-13,-70,5,-71,21,-69C37,-67,27,-55,39,-48Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="hp-preloader__center">
                    <img src={galataLogo} alt="Galata Rum Okulu Logo" className="hp-preloader__logo" />
                    <h2 className="hp-preloader__title">Galata Rum Okulu</h2>
                    <h3 className="hp-preloader__subtitle-gold">{l === 'tr' ? 'Mekan Kiralama' : l === 'el' ? 'Ενοικίαση Χώρου' : 'Venue Hire'}</h3>
                </div>
            </div>
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
            <Breadcrumbs items={[{ label: { tr: 'Mekan Kiralama', en: 'Venue Hire', el: 'Ενοikίaση Χώρου' } }]} />

            <div className={`venue-hire-content ${preloaderActive ? 'venue-hire-content--loading' : 'venue-hire-content--loaded'}`}>
                {/* ── HEADER SECTION ── */}
                <section className="vh-header">
                    <div className="vh-header__inner">
                        <div className="vh-header__text">
                            <span className="vh-header__badge">{t('venue.badge')}</span>
                            <h1 className="vh-header__title">
                                {t('venue.title')}
                            </h1>
                            <p className="vh-header__description">
                                {t('venue.subtitle')}
                            </p>
                        </div>
                        <div className="vh-header__watermark-col">
                            <div className="vh-header__watermark" aria-hidden="true">
                                <span>1</span>
                                <span>8</span>
                                <span>8</span>
                                <span>5</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Floor Plan Section */}
                <div 
                    ref={floorPlanReveal.ref}
                    className={`floor-plan-wrapper-section ${floorPlanReveal.isVisible && !preloaderActive ? 'floor-plan-section--revealed' : 'floor-plan-section--hidden'}`}
                >
                    <FloorPlan hideHero={true} />
                </div>

                {/* ── VH Specs Section ── */}
                <section className="vh-specs-section">
                    <div className="vh-specs-grid">
                        <div className="vh-spec-card">
                            <h3 className="vh-spec-card__title">
                                {lang === 'tr' ? 'Tarihi Doku' : lang === 'el' ? 'Ιστορικό Πλαίσιο' : 'Heritage Atmosphere'}
                            </h3>
                            <p className="vh-spec-card__desc">
                                {lang === 'tr' 
                                    ? '19. yüzyıl neoklasik mimarisi, yüksek tavanları ve tarihi taş dokusuyla etkinliklerinize prestijli bir atmosfer katın.' 
                                    : lang === 'el'
                                    ? 'Διοργανώστε την εκδήλωσή σας σε έναν χώρο με νεοκλασική αρχιτεκτονική του 19ου αιώνα, ψηλά ταβάνια και πέτρινες καμάρες.'
                                    : 'Host your event in a prestigious setting featuring neoclassical architecture, high ceilings, and historic stone arches.'}
                            </p>
                        </div>
                        <div className="vh-spec-card">
                            <h3 className="vh-spec-card__title">
                                {lang === 'tr' ? 'Teknik Entegrasyon' : lang === 'el' ? 'Τεχνική Υποστήριξη' : 'Technical Integration'}
                            </h3>
                            <p className="vh-spec-card__desc">
                                {lang === 'tr'
                                    ? 'Sergiler, performanslar ve kurumsal galalar için tasarlanmış gelişmiş aydınlatma, iklimlendirme ve profesyonel akustik altyapı.'
                                    : lang === 'el'
                                    ? 'Προηγμένος φωτισμός, κλιματισμός και ακουστική μελέτη προσαρμοσμένα για εκθέσεις, παραστάσεις και εταιρικές εκδηλώσεις.'
                                    : 'Advanced lighting, climate control, and acoustic treatment tailored for exhibitions, performances, and corporate events.'}
                            </p>
                        </div>
                        <div className="vh-spec-card">
                            <h3 className="vh-spec-card__title">
                                {lang === 'tr' ? 'Toplumsal Katkı' : lang === 'el' ? 'Κοινωνική Προσφορά' : 'Community Support'}
                            </h3>
                            <p className="vh-spec-card__desc">
                                {lang === 'tr'
                                    ? 'Mekan kiralama gelirlerinin tamamı, tarihi İstanbul Rum Cemaati Arşivi\'nin korunması ve dijitalleştirilmesi projelerine aktarılır.'
                                    : lang === 'el'
                                    ? 'Όλα τα έσοδα από τις ενοικιάσεις διατίθενται απευθείας για τη συντήρηση και ψηφιοποίηση του Ιστορικού Αρχείου της Ρωμαίικης Κοινότητας.'
                                    : 'All venue rental proceeds directly fund the preservation and digitization of the historic Istanbul Greek Community Archive.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── VH Inquiry CTA Box ── */}
                <section className="vh-cta-section">
                    <div className="vh-cta-box">
                        <div className="vh-cta-box__content">
                            <h2 className="vh-cta-box__title">
                                {lang === 'tr' ? 'Etkinliğinizi Planlamaya Başlayın' : lang === 'el' ? 'Σχεδιάστε την Εκδήλωσή σας' : 'Begin Planning Your Event'}
                            </h2>
                            <p className="vh-cta-box__subtitle">
                                {lang === 'tr'
                                    ? 'Kiralama detayları, müsaitlik durumu ve özel talepleriniz için ekibimizle iletişime geçin.'
                                    : lang === 'el'
                                    ? 'Επικοινωνήστε με την ομάδα μας για λεπτομέρειες ενοικίασης, διαθεσιμότητα και ειδικά αιτήματα.'
                                    : 'Get in touch with our concierge team for rental specifications, rates, availability, and custom requests.'}
                            </p>
                        </div>
                        <Link to="/bize-ulasin" className="vh-cta-box__btn">
                            {lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνήστε' : 'Inquire Now'}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
