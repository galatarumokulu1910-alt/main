import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './EventDetailPage.css';

export default function EventDetailPage() {
    const { slug } = useParams();
    const { lang } = useI18n();
    const l = lang || 'en';

    const [eventData, setEventData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading Event Details...</div>;
    if (!eventData) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Event not found.</div>;

    const title = eventData[`title_${l}`] || eventData.title_en;
    const desc = eventData.description_tr || eventData[`description_${l}`] || eventData.description_en || '';
    const category = eventData[`type_${l}`] || eventData.type_en || '';
    const eventDate = eventData.event_date ? new Date(eventData.event_date).toLocaleDateString('tr-TR') : '';

    // Split description into paragraphs
    const descParagraphs = desc ? desc.split(/\n\n|\n/).filter((p: string) => p.trim()) : [];

    return (
        <div className="event-detail-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={title}
                overrideDescription={desc ? desc.substring(0, 160) : (l === 'tr' ? 'Galata Rum Okulu etkinlik detayları' : 'Galata Greek School event details')}
                overrideKeywords={`${title}, ${category}, galata rum okulu, etkinlik, istanbul kültür`}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": title,
                    "description": desc ? desc.substring(0, 300) : '',
                    "startDate": eventData.event_date || '',
                    "image": eventData.cover_image_url || '',
                    "location": {
                        "@type": "Place",
                        "name": "Galata Rum Okulu",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Kemeraltı Cd. No:25",
                            "addressLocality": "Beyoğlu",
                            "addressRegion": "Istanbul",
                            "addressCountry": "TR"
                        }
                    },
                    "organizer": {
                        "@type": "Organization",
                        "name": "Galata Rum Okulu"
                    }
                }}
            />
            <Breadcrumbs items={[
                { label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' }, to: '/gecmis-etkinlikler' },
                { label: { tr: title, en: title, el: title } }
            ]} />
            <main className="ed-main">

                {/* ══════ HEADER CONTENT ══════ */}
                <section className="ed-header">
                    <div className="ed-header__text">
                        <span className="ed-header__badge">{category}</span>
                        <h1 className="ed-header__title">{title}</h1>
                        <p className="ed-header__date">{eventDate}</p>
                    </div>
                </section>

                {/* ══════ HERO IMAGE ══════ */}
                <section className="ed-hero">
                    <img src={eventData.cover_image_url || '/placeholder.png'} alt={title} className="ed-hero__img" />
                </section>

                {/* ══════ GALLERY IMAGES ══════ */}
                {eventData.gallery_urls && eventData.gallery_urls.length > 0 && (
                    <section className="ed-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '0 5% 4rem' }}>
                        {eventData.gallery_urls.map((url: string, index: number) => (
                            <img key={index} src={url} alt={`${title} Gallery ${index + 1}`} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' }} />
                        ))}
                    </section>
                )}

                {/* ══════ BODY ══════ */}
                <section className="ed-body">
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

                    {/* Information Sidebar */}
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
                </section>
            </main>
        </div>
    );
}
