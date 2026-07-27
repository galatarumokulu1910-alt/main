import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './EventDetailPage.css';

export default function EventDetailPage() {
    const { slug } = useParams();
    const { lang } = useI18n();
    const l = lang || 'en';

    const [eventData, setEventData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [preloaderActive, setPreloaderActive] = useState(() => {
        return !sessionStorage.getItem('event_detail_preloader_seen');
    });

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
            sessionStorage.setItem('event_detail_preloader_seen', 'true');
        }, 3400);
        return () => clearTimeout(timer);
    }, [preloaderActive]);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) return;

            // Try slug first, then fall back to id (for backward compatibility)
            let result = await supabase
                .from('past_events')
                .select('*')
                .eq('slug', slug)
                .single();

            if (!result.data) {
                // Fallback: try as UUID id
                result = await supabase
                    .from('past_events')
                    .select('*')
                    .eq('id', slug)
                    .single();
            }

            if (result.data) setEventData(result.data);
            setLoading(false);
        };
        fetchEvent();
    }, [slug]);

    const title = eventData ? decodeHtmlEntities(eventData[`title_${l}`] || eventData.title_en) : '';
    const desc = eventData ? decodeHtmlEntities(eventData[`description_${l}`] || eventData.description_en || eventData.description_tr || '') : '';
    const category = eventData ? decodeHtmlEntities(eventData[`type_${l}`] || eventData.type_en || '') : '';
    const eventDate = eventData && eventData.event_date ? new Date(eventData.event_date).toLocaleDateString('tr-TR') : '';

    // Split description into paragraphs
    const descParagraphs = desc ? desc.split(/\n\n|\n/).filter((p: string) => p.trim()) : [];

    return (
        <div className="event-detail-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={title}
                overrideDescription={desc ? desc.substring(0, 160) : (l === 'tr' ? 'Galata Rum Okulu etkinlik detayları' : l === 'el' ? 'Λεπτομέρειες εκδήλωσης της Ελληνικής Σχολής Γαλατά' : 'Galata Greek School event details')}
                overrideKeywords={l === 'tr' ? `${title}, ${category}, galata rum okulu, etkinlik, istanbul kültür` : l === 'el' ? `${title}, ${category}, ελληνική σχολή γαλατά, εκδήλωση, Κωνσταντινούπολη πολιτισμός` : `${title}, ${category}, galata greek school, event, istanbul culture`}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": title,
                    "description": desc ? desc.substring(0, 300) : '',
                    "startDate": (eventData && eventData.event_date) || '',
                    "image": (eventData && eventData.cover_image_url) || '',
                    "location": {
                        "@type": "Place",
                        "name": "Galata Rum Okulu",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49",
                            "addressLocality": "Istanbul",
                            "addressRegion": "Beyoğlu",
                            "postalCode": "34425",
                            "addressCountry": "TR"
                        }
                    },
                    "organizer": {
                        "@type": "Organization",
                        "name": "Galata Rum Okulu"
                    }
                }}
            />
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
                    <h3 className="hp-preloader__subtitle-gold">{l === 'tr' ? 'Etkinlik Detayı' : l === 'el' ? 'Λεπτομέρειες Εκδήλωσης' : 'Event Detail'}</h3>
                </div>
            </div>
            <main className={`ed-main ${preloaderActive ? 'ed-main--loading' : 'ed-main--loaded'}`}>
                <Breadcrumbs items={[
                    { label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' }, to: '/gecmis-etkinlikler' },
                    { label: { tr: title, en: title, el: title } }
                ]} />
                {loading ? (
                    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                        {lang === 'tr' ? 'Yükleniyor…' : lang === 'el' ? 'Φόρτωση…' : 'Loading…'}
                    </div>
                ) : !eventData ? (
                    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                        {lang === 'tr' ? 'Etkinlik bulunamadı.' : lang === 'el' ? 'Η εκδήλωση δεν βρέθηκε.' : 'Event not found.'}
                    </div>
                ) : (
                    <>
                {/* ══════ MAIN GRID SECTION ══════ */}
                <section className="ed-main-grid">
                    {/* Left Column: Image & Details */}
                    <div className="ed-left-col">
                        <div className="ed-hero">
                            <img src={eventData.cover_image_url || '/placeholder.png'} alt={title} className="ed-hero__img" />
                        </div>

                        {/* Information Sidebar under image */}
                        <aside className="ed-sidebar">
                            <div className="ed-sidebar__card">
                                <h4 className="ed-sidebar__title">
                                    {lang === 'tr' ? 'Detaylar' : lang === 'el' ? 'Leptomereies' : 'Details'}
                                </h4>
                                <ul className="ed-sidebar__list">
                                    <li className="ed-sidebar__item">
                                        <span className="ed-sidebar__label">Tarih:</span>
                                        <span>{eventDate}</span>
                                    </li>
                                    <li className="ed-sidebar__item">
                                        <span className="ed-sidebar__label">Mekan:</span>
                                        <span>Galata Rum Okulu</span>
                                    </li>
                                    <li className="ed-sidebar__item">
                                        <span className="ed-sidebar__label">Kategori:</span>
                                        <span>{category}</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </div>

                    {/* Right Column: Description */}
                    <div className="ed-right-col">
                        {/* ══════ HEADER CONTENT ══════ */}
                        <section className="ed-header">
                            <div className="ed-header__text">
                                <span className="ed-header__badge">{category}</span>
                                <h1 className="ed-header__title">{title}</h1>
                                <p className="ed-header__date">{eventDate}</p>
                            </div>
                        </section>

                        <div className="ed-body__content">
                            {descParagraphs.length > 0 ? (
                                descParagraphs.map((paragraph: string, index: number) => (
                                    <p key={index} className="ed-body__text">
                                        {paragraph.trim()}
                                    </p>
                                ))
                            ) : (
                                <p className="ed-body__text ed-body__text--empty">
                                    {lang === 'tr' ? 'Bu etkinlik için henüz açıklama eklenmemiştir.' :
                                        lang === 'el' ? 'Δεν υπάρχει ακόμη περιγραφή.' :
                                            'No description available for this event yet.'}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ══════ GALLERY IMAGES ══════ */}
                {eventData.gallery_urls && eventData.gallery_urls.length > 0 && (
                    <section className="ed-gallery">
                        {eventData.gallery_urls.map((url: string, index: number) => (
                            <div key={index} className="ed-gallery__item">
                                <img src={url} alt={`${title} Gallery ${index + 1}`} className="ed-gallery__img" />
                            </div>
                        ))}
                    </section>
                )}
                </>
                )}
            </main>
        </div>
    );
}
