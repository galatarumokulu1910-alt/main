import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './EventDetailPage.css';

export default function EventDetailPage() {
    const { eventId } = useParams();
    const { lang } = useI18n();
    const l = lang || 'en';

    const [eventData, setEventData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            const { data } = await supabase
                .from('past_events')
                .select('*')
                .eq('id', eventId)
                .single();

            if (data) setEventData(data);
            setLoading(false);
        };
        fetchEvent();
    }, [eventId]);

    if (loading) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading Event Details...</div>;
    if (!eventData) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Event not found.</div>;

    const title = eventData[`title_${l}`] || eventData.title_en;
    const desc = eventData[`description_${l}`] || eventData.description_en;
    const category = eventData[`type_${l}`] || eventData.type_en || '';
    const eventDate = eventData.event_date ? new Date(eventData.event_date).toLocaleDateString('tr-TR') : '';

    return (
        <div className="event-detail-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <Breadcrumbs items={[
                { label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' }, to: '/past-events' },
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
                        <p className="ed-body__text">
                            {desc}
                        </p>
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

