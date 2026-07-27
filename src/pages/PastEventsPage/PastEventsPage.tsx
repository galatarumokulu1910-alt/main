import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
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
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';

    const [preloaderActive, setPreloaderActive] = useState(true);

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
        }, 1500);
        return () => clearTimeout(timer);
    }, [preloaderActive]);

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
    const [subTags, setSubTags] = useState<string[]>([]);
    const [totalEvents, setTotalEvents] = useState(0);
    const [activeFilter, setActiveFilter] = useState<string>('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const PAGE_SIZE = 10;

    // Fetch tags and counts once
    useEffect(() => {
        const fetchTags = async () => {
            const { data } = await supabase
                .from('past_events')
                .select('sub_tag, type_tr');
            
            if (data) {
                const counts: Record<string, number> = {};
                data.forEach(e => {
                    const tag = e.sub_tag || e.type_tr || '';
                    if (tag && tag.trim().length > 0) {
                        counts[tag] = (counts[tag] || 0) + 1;
                    }
                });
                setTagCounts(counts);
                setSubTags(Object.keys(counts).sort((a, b) => counts[b] - counts[a]));
                setTotalEvents(data.length);
            }
        };
        fetchTags();
    }, []);

    // Fetch paginated events based on page and filter
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            let query = supabase
                .from('past_events')
                .select('*')
                .order('event_date', { ascending: false })
                .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

            if (activeFilter) {
                query = query.or(`sub_tag.eq."${activeFilter}",type_tr.eq."${activeFilter}"`);
            }

            const { data } = await query;
            if (data) {
                if (page === 0) {
                    setEvents(data);
                } else {
                    setEvents(prev => [...prev, ...data]);
                }
                setHasMore(data.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }
            setLoading(false);
        };
        fetchEvents();
    }, [page, activeFilter]);

    // Handle filter clicks
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setPage(0);
        setEvents([]);
        setHasMore(true);
    };

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore || loading) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loading]);

    const currentFilteredCount = activeFilter ? (tagCounts[activeFilter] || 0) : totalEvents;

    return (
        <div className="past-events-page bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-200 transition-colors duration-300" style={{ position: 'relative' }}>
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
                    <h3 className="hp-preloader__subtitle-gold">{l === 'tr' ? 'Geçmiş Etkinlikler' : l === 'el' ? 'Παρελθούσες Εκδηλώσεις' : 'Past Events'}</h3>
                </div>
            </div>
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
            <main className={`pe-main ${preloaderActive ? 'pe-main--loading' : 'pe-main--loaded'}`}>
                {/* ══════ HEADER SECTION ══════ */}
                <section className="pe-header">
                    <div className="pe-header__inner">
                        <div className="pe-header__text">
                            <h1 className="pe-header__title">
                                {lang === 'tr' ? 'Geçmiş Etkinlikler' : lang === 'el' ? 'Παρελθούσες Εκδηλώσεις' : 'Past Events'}
                            </h1>
                            <p className="pe-header__description">
                                {lang === 'tr'
                                    ? 'Galata Rum Okulu, her biri kendine özgü hikâyesiyle birleşen prestijli moda defilelerinden, çağdaş sanat sergilerine ve seçkin kurumsal galalara ev sahipliği yapmaktadır. Neoklasik mimarimiz, modern vizyonlarla burada buluşuyor.'
                                    : lang === 'el'
                                        ? 'Το Ελληνικό Σχολείο Γαλατά φιλοξενεί εκθέσεις, συνέδρια και πολιτιστικές εκδηλώσεις. Η νεοκλασική μας αρχιτεκτονική συναντά τα σύγχρονα οράματα εδώ.'
                                        : 'The Galata Greek School hosts prestigious fashion shows, contemporary art exhibitions, and exclusive corporate galas, each merging with its unique story. Our neoclassical architecture meets modern visions here.'}
                            </p>
                        </div>
                        <div className="pe-header__watermark-col">
                            <span className="pe-header__watermark">
                                <span>1</span>
                                <span>8</span>
                                <span>8</span>
                                <span>5</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* ══════ FILTER BAR ══════ */}
                {subTags.length > 0 && (
                    <div className="pe-filters">
                        <button
                            className={`pe-filter-btn ${activeFilter === '' ? 'pe-filter-btn--active' : ''}`}
                            onClick={() => handleFilterChange('')}
                        >
                            {lang === 'tr' ? 'Tümü' : lang === 'el' ? 'Όλα' : 'All'} <span className="pe-filter-count">{totalEvents}</span>
                        </button>
                        {subTags.map(tag => (
                            <button
                                key={tag}
                                className={`pe-filter-btn ${activeFilter === tag ? 'pe-filter-btn--active' : ''}`}
                                onClick={() => handleFilterChange(activeFilter === tag ? '' : tag)}
                            >
                                {tag} <span className="pe-filter-count">{tagCounts[tag]}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* ══════ EVENT GRID ══════ */}
                {loading && events.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>{lang === 'tr' ? 'Etkinlikler yükleniyor…' : lang === 'el' ? 'Φόρτωση εκδηλώσεων…' : 'Loading Events…'}</div>
                ) : (
                    <>
                    <div className="pe-grid">
                        {events.map((evt) => (
                            <Link key={evt.id} to={localizePath(`/gecmis-etkinlikler/${evt.slug || evt.id}`)} className="pe-card">
                                <div className="pe-card__image-wrap">
                                    <img
                                        alt={decodeHtmlEntities(evt[`title_${l}`] || evt.title_en)}
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
                                        {decodeHtmlEntities(evt[`title_${l}`] || evt.title_en)}
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
                    {!hasMore && events.length > 0 && (
                        <p style={{ textAlign: 'center', padding: '30px 0', opacity: 0.5, fontSize: '0.9rem' }}>
                            {lang === 'tr' ? `${currentFilteredCount} etkinliğin tamamı gösterildi` : lang === 'el' ? `Εμφανίστηκαν και οι ${currentFilteredCount} εκδηλώσεις` : `All ${currentFilteredCount} events shown`}
                        </p>
                    )}
                    </>
                )}

                {/* ══════ CTA SECTION ══════ */}
                <section className="pe-cta">
                    <h2 className="pe-cta__title">
                        {lang === 'tr' ? 'Etkinliğinizi Burada Planlayın' : lang === 'el' ? 'Σχεδιάστε την Εκδήλωσή σας Εδώ' : 'Plan Your Event Here'}
                    </h2>
                    <p className="pe-cta__desc">
                        {lang === 'tr'
                            ? 'Siz de markanızı veya sanatınızı Galata\'nın bu benzersiz atmosferiyle buluşturmak isterseniz bizimle iletişime geçin.'
                            : lang === 'el'
                                ? 'Αν θέλετε να φέρετε την τέχνη ή την επιχείρησή σας στη μοναδική ατμόσφαιρα του Γαλατά, επικοινωνήστε μαζί μας.'
                                : 'If you would like to bring your brand or art to this unique atmosphere of Galata, get in touch with us.'}
                    </p>
                    <Link to={localizePath('/bize-ulasin')} className="pe-cta__btn group">
                        {lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
                        <span className="pe-cta__btn-icon">→</span>
                    </Link>
                </section>
            </main>
        </div>
    );
}
