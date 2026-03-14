import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import './PastEventsPage.css';

function formatEventDate(dateStr: string | null, lang: string): string {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        const locale = lang === 'tr' ? 'tr-TR' : lang === 'el' ? 'el-GR' : 'en-GB';
        return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

export default function PastEventsPage() {
    const { lang } = useI18n();
    const l = lang || 'en';

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState(10);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabase
                .from('past_events')
                .select('*')
                .order('event_date', { ascending: false });

            if (data) setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    // Extract unique sub_tags with counts for filter buttons
    const tagCounts: Record<string, number> = {};
    events.forEach(e => {
        const tag = e.sub_tag || e.type_tr || '';
        if (tag && tag.trim().length > 0) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
    });
    const subTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

    const filteredEvents = activeFilter
        ? events.filter(e => (e.sub_tag || e.type_tr || '') === activeFilter)
        : events;

    const visibleEvents = filteredEvents.slice(0, visibleCount);
    const hasMore = visibleCount < filteredEvents.length;

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [activeFilter]);

    // IntersectionObserver for auto-loading
    const loadMore = useCallback(() => {
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredEvents.length));
    }, [filteredEvents.length]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <div className="past-events-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
            <SEO 
                titleKey="nav.events" 
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu geçmiş etkinlikler arşivi: sergiler, moda gösterileri ve kurumsal toplantılar.' : 'Past events archive of Galata Greek School: exhibitions, fashion shows, and corporate gatherings.'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Past Events at Galata Greek School",
                    "description": "Browse prestigious fashion shows, contemporary art exhibitions, and corporate galas hosted at the historic Galata Greek School."
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' } }]} />
            <main className="pe-main">
                {/* ══════ HEADER SECTION ══════ */}
                <section className="pe-header">
                    <div className="pe-header__inner">
                        <div className="pe-header__text">
                            <h1 className="pe-header__title">
                                {lang === 'tr' ? 'Geçmiş Etkinlikler' : lang === 'el' ? 'Parelthouses Ekdiloseis' : 'Past Events'}<br />
                                <span className="pe-header__title-accent">Past Events</span>
                            </h1>
                            <p className="pe-header__description">
                                {lang === 'tr'
                                    ? 'Galata Rum Okulu, her biri kendine özgü hikâyesiyle birleşen prestijli moda defilelerinden, çağdaş sanat sergilerine ve seçkin kurumsal galalara ev sahipliği yapmaktadır. Neoklasik mimarimiz, modern vizyonlarla burada buluşuyor.'
                                    : lang === 'el'
                                        ? 'To Galata Rum Okulu filoxenei kourouseis, synedria kai politistikes ekdiloseis. I neoklasiki mas architektoniki synanta tis synchrones oramata edo.'
                                        : 'The Galata Greek School hosts prestigious fashion shows, contemporary art exhibitions, and exclusive corporate galas, each merging with its unique story. Our neoclassical architecture meets modern visions here.'}
                            </p>
                        </div>
                        <div className="pe-header__watermark-col">
                            <span className="pe-header__watermark">1885</span>
                        </div>
                    </div>
                </section>

                {/* ══════ FILTER BAR ══════ */}
                {subTags.length > 0 && (
                    <div className="pe-filters">
                        <button
                            className={`pe-filter-btn ${activeFilter === '' ? 'pe-filter-btn--active' : ''}`}
                            onClick={() => setActiveFilter('')}
                        >
                            {lang === 'tr' ? 'Tümü' : lang === 'el' ? 'Όλα' : 'All'} <span className="pe-filter-count">{events.length}</span>
                        </button>
                        {subTags.map(tag => (
                            <button
                                key={tag}
                                className={`pe-filter-btn ${activeFilter === tag ? 'pe-filter-btn--active' : ''}`}
                                onClick={() => setActiveFilter(activeFilter === tag ? '' : tag)}
                            >
                                {tag} <span className="pe-filter-count">{tagCounts[tag]}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* ══════ EVENT GRID ══════ */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading Events...</div>
                ) : (
                    <>
                    <div className="pe-grid">
                        {visibleEvents.map((evt) => (
                            <Link key={evt.id} to={`/gecmis-etkinlikler/${evt.slug || evt.id}`} className="pe-card">
                                <div className="pe-card__image-wrap">
                                    <img
                                        alt={evt[`title_${l}`] || evt.title_en}
                                        className="pe-card__img"
                                        src={evt.cover_image_url || '/placeholder.png'}
                                        loading="lazy"
                                    />
                                    <div className="pe-card__overlay" />
                                </div>
                                <div className="pe-card__body">
                                    <div className="pe-card__meta">
                                        <span className="pe-card__date">
                                            {formatEventDate(evt.event_date, l)}
                                        </span>
                                        {(evt.sub_tag || evt[`type_${l}`] || evt.type_en) && (
                                            <span className="pe-card__badge">
                                                {evt.sub_tag || evt[`type_${l}`] || evt.type_en}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="pe-card__title">
                                        {evt[`title_${l}`] || evt.title_en}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* Infinite scroll sentinel */}
                    {hasMore && (
                        <div
                            ref={sentinelRef}
                            className="pe-load-more-sentinel"
                            style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}
                        >
                            <div className="pe-loading-spinner" />
                        </div>
                    )}
                    {!hasMore && filteredEvents.length > 0 && (
                        <p style={{ textAlign: 'center', padding: '30px 0', opacity: 0.5, fontSize: '0.9rem' }}>
                            {lang === 'tr' ? `${filteredEvents.length} etkinliğin tamamı gösterildi` : lang === 'el' ? `Εμφανίστηκαν και οι ${filteredEvents.length} εκδηλώσεις` : `All ${filteredEvents.length} events shown`}
                        </p>
                    )}
                    </>
                )}

                {/* ══════ CTA SECTION ══════ */}
                <section className="pe-cta">
                    <h2 className="pe-cta__title">
                        {lang === 'tr' ? 'Etkinliginizi Burada Planlayin' : lang === 'el' ? 'Schediaste tin Ekdilosi sas Edo' : 'Plan Your Event Here'}
                    </h2>
                    <p className="pe-cta__desc">
                        {lang === 'tr'
                            ? 'Siz de markanizi veya sanatinizi Galata\'nin bu benzersiz atmosferiyle bulusturmak isterseniz bizimle iletisime gecin.'
                            : lang === 'el'
                                ? 'An thelete na ferete tin techni i tin epicheirisi sas stin monadiki atmosfaira tis Galatas, epikoinoniste mazi mas.'
                                : 'If you would like to bring your brand or art to this unique atmosphere of Galata, get in touch with us.'}
                    </p>
                    <Link to="/bize-ulasin" className="pe-cta__btn group">
                        {lang === 'tr' ? 'Bize Ulasin' : lang === 'el' ? 'Epikoinonia' : 'Contact Us'}
                        <span className="pe-cta__btn-icon">→</span>
                    </Link>
                </section>
            </main>
        </div>
    );
}
