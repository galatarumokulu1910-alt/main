import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { getCuratedEventTitle } from '../../services/dbSync';
import { resolveEventSlug } from '../../utils/eventSlug';
import { PRODUCTION_SITE_ORIGIN, normalizeLegacyMediaUrl } from '../../config/venueInfo';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import './PastEventsPage.css';

const CURATED_EVENT_TAG_EL: Record<string, string> = {
    'Sanat Sergisi & Bienal': 'Έκθεση Τέχνης & Μπιενάλε',
    'Konferans, Söyleşi & Sempozyum': 'Συνέδριο, Ομιλία & Συμπόσιο',
    'Kurumsal Etkinlik & Lansman': 'Εταιρική Εκδήλωση & Παρουσίαση',
    'Performans, Konser & Tiyatro': 'Παράσταση, Συναυλία & Θέατρο',
    'Atölye & Eğitim': 'Εργαστήριο & Εκπαίδευση',
};

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

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
    const [tagLabels, setTagLabels] = useState<Record<string, { tr: string; en: string; el: string }>>({});
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
                .select('sub_tag, type_tr, type_en, type_el')
                .eq('status', 'published');
            
            if (data) {
                const counts: Record<string, number> = {};
                const labels: Record<string, { tr: string; en: string; el: string }> = {};
                data.forEach(e => {
                    const tag = e.sub_tag || e.type_tr || '';
                    if (tag && tag.trim().length > 0) {
                        counts[tag] = (counts[tag] || 0) + 1;
                        if (!labels[tag]) {
                            labels[tag] = {
                                tr: e.sub_tag || e.type_tr || tag,
                                en: e.type_en || e.type_tr || tag,
                                el: CURATED_EVENT_TAG_EL[tag] || e.type_el || e.type_en || e.type_tr || tag,
                            };
                        }
                    }
                });
                setTagCounts(counts);
                setTagLabels(labels);
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
                .select('id, slug, cover_image_url, title_tr, title_en, title_el, event_date, type_tr, type_en, type_el, sub_tag')
                .eq('status', 'published')
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
        <div className="past-events-page" style={{ position: 'relative' }}>
            <SEO 
                titleKey="nav.events" 
                overrideDescription={lang === 'tr' ? 'Galata Rum Okulu Vakfı - Kültür Merkezi geçmiş etkinlikler arşivi: sergiler, moda gösterileri ve kurumsal toplantılar.' : lang === 'el' ? 'Αρχείο παρελθουσών εκδηλώσεων της Αστικής Σχολής Γαλατά – Πολιτιστικού Κέντρου: εκθέσεις, συνέδρια, συναυλίες και πολιτιστικές συναντήσεις.' : 'Past events archive of Galata Greek School Foundation - Cultural Center: exhibitions, fashion shows, and corporate gatherings.'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Past Events at Galata Greek School Foundation - Cultural Center",
                    "url": `${PRODUCTION_SITE_ORIGIN}${localizePath('/gecmis-etkinlikler')}`,
                    "description": "Browse prestigious fashion shows, contemporary art exhibitions, and corporate galas hosted at the historic Galata Greek School Foundation - Cultural Center."
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' } }]} />
            <div className="pe-main">
                {/* ══════ HEADER SECTION ══════ */}
                <section className="pe-header">
                    <div className="pe-header__inner">
                        <div className="pe-header__text">
                            <span className="pe-header__eyebrow">
                                {lang === 'tr' ? 'Kültür & Sanat Belleği' : lang === 'el' ? 'Αρχείο Πολιτισμού & Τέχνης' : 'Culture & Arts Archive'}
                            </span>
                            <h1 className="pe-header__title">
                                {lang === 'tr' ? 'Geçmiş Etkinlikler' : lang === 'el' ? 'Παρελθούσες Εκδηλώσεις' : 'Past Events'}
                            </h1>
                            <p className="pe-header__description">
                                {lang === 'tr'
                                    ? 'Galata Rum Okulu Vakfı - Kültür Merkezi; İstanbul Bienali ve 212 Photography Istanbul gibi uluslararası sanat buluşmalarından dönem konserlerine, mimarlık ve edebiyat sempozyumlarından seçkin lansman ve özel resepsiyonlara kadar pek çok prestijli etkinliğe ev sahipliği yapmaktadır.'
                                    : lang === 'el'
                                        ? 'Η Αστική Σχολή Γαλατά – Πολιτιστικό Κέντρο φιλοξενεί ένα εκλεκτό πρόγραμμα εκδηλώσεων — από διεθνείς εικαστικές διοργανώσεις, όπως η Μπιενάλε της Κωνσταντινούπολης και το 212 Photography Istanbul, έως συναυλίες, συμπόσια αρχιτεκτονικής και λογοτεχνίας, παρουσιάσεις και ειδικές δεξιώσεις.'
                                        : 'The Galata Greek School Foundation - Cultural Center hosts a distinguished repertoire of events — from international art gatherings like the Istanbul Biennial and 212 Photography Istanbul to period concerts, architecture and literature symposia, and exclusive receptions.'}
                            </p>
                        </div>
                        <div className="pe-header__watermark-col">
                            <span className="pe-header__watermark">1885</span>
                        </div>
                    </div>
                </section>

                {/* ══════ VISITING STATUS & EXHIBITION VENUE HIRE BANNER (Niyet 2 & 3 SEO) ══════ */}
                <aside
                    aria-label={lang === 'tr' ? 'Ziyaret Günleri ve Sergi Alanı Kiralama' : lang === 'el' ? 'Ημέρες Επίσκεψης & Ενοικίαση Εκθεσιακού Χώρου' : 'Visiting Schedule & Exhibition Venue Rental'}
                    style={{
                        maxWidth: 'var(--max-width)',
                        margin: '0 auto var(--space-8)',
                        padding: '1.15rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(197, 160, 89, 0.35)',
                        borderLeft: '4px solid var(--color-brass-gold)',
                        background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0.03) 100%)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--color-ink)', maxWidth: '64ch' }}>
                        {lang === 'tr'
                            ? 'Ziyaret & Sergi Bilgisi: Kültür merkezimiz özel sergiler ve kültür-sanat programları döneminde Salı–Cumartesi günleri ziyarete açıktır (Pazar ve Pazartesi kapalıdır).'
                            : lang === 'el'
                              ? 'Πληροφορίες Επίσκεψης & Εκθέσεων: Το Πολιτιστικό Κέντρο είναι ανοιχτό Τρίτη–Σάββατο κατά τη διάρκεια εκθέσεων και εκδηλώσεων (κλειστό Κυριακή & Δευτέρα).'
                              : 'Visitor & Exhibition Notice: Our Cultural Center is open Tuesday–Saturday during active exhibitions and cultural programs (closed Sunday & Monday).'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        <Link
                            to={localizePath('/mekan-kiralama')}
                            style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-brass-gold)', borderBottom: '1px solid rgba(197, 160, 89, 0.5)' }}
                        >
                            {lang === 'tr' ? 'Sergi & Etkinlik Alanı Kiralama →' : lang === 'el' ? 'Ενοικίαση Χώρου Εκθέσεων →' : 'Exhibition & Event Venue Hire →'}
                        </Link>
                        <Link
                            to={localizePath('/bize-ulasin')}
                            style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink)' }}
                        >
                            {lang === 'tr' ? 'Ziyaret Saatleri & İletişim →' : lang === 'el' ? 'Ωράριο & Επικοινωνία →' : 'Visiting Hours & Contact →'}
                        </Link>
                    </div>
                </aside>

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
                                {tagLabels[tag]?.[l as 'tr' | 'en' | 'el'] || tag} <span className="pe-filter-count">{tagCounts[tag]}</span>
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
                        {events.map((evt) => {
                            const evtSlug = resolveEventSlug(evt);
                            const evtTitle = decodeHtmlEntities(
                                (l !== 'tr' ? getCuratedEventTitle(evtSlug, l as 'tr' | 'en' | 'el') || getCuratedEventTitle(evt.id, l as 'tr' | 'en' | 'el') : '') ||
                                    evt[`title_${l}`] ||
                                    evt.title_en ||
                                    evt.title_tr ||
                                    ''
                            );
                            return (
                            <Link key={evt.id} to={localizePath(`/gecmis-etkinlikler/${evtSlug}`)} className="pe-card">
                                <div className="pe-card__image-wrap">
                                    <img
                                        alt={evtTitle}
                                        className="pe-card__img"
                                        src={normalizeLegacyMediaUrl(evt.cover_image_url) || '/placeholder.png'}
                                        loading="lazy"
                                        width="400"
                                        height="300"
                                    />
                                    <div className="pe-card__overlay" />
                                </div>
                                <div className="pe-card__body">
                                    <div className="pe-card__meta">
                                        <span className="pe-card__date">
                                            {formatEventDate(evt.event_date, l)}
                                        </span>
                                        {(evt[`type_${l}`] || evt.sub_tag || evt.type_en) && (
                                            <span className="pe-card__badge">
                                                {l === 'tr'
                                                    ? (evt.sub_tag || evt.type_tr || evt.type_en)
                                                    : l === 'el'
                                                      ? (CURATED_EVENT_TAG_EL[evt.sub_tag || evt.type_tr || ''] || evt.type_el || tagLabels[evt.sub_tag]?.el || evt.type_en || evt.sub_tag)
                                                      : (evt.type_en || tagLabels[evt.sub_tag]?.en || evt.sub_tag)}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="pe-card__title">
                                        {evtTitle}
                                    </h2>
                                </div>
                            </Link>
                            );
                        })}
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
                        {lang === 'tr' ? 'Tarihi Atmosferde Seçkin Buluşmalar' : lang === 'el' ? 'Εκλεκτές Συναντήσεις σε Ιστορικό Περιβάλλον' : 'Distinguished Gatherings in a Historic Setting'}
                    </h2>
                    <p className="pe-cta__desc">
                        {lang === 'tr'
                            ? 'Sergi, konferans, konser veya özel resepsiyon projelerinizde Galata Rum Okulu’nun asırlık neoklasik mimarisi ve prestijli atmosferiyle yer almak için bizimle iletişime geçebilirsiniz.'
                            : lang === 'el'
                                ? 'Επικοινωνήστε μαζί μας για να φιλοξενήσετε την έκθεση, το συνέδριο, τη συναυλία ή την ιδιαίτερη δεξίωσή σας στην αιωνόβια νεοκλασική αρχιτεκτονική και την ατμόσφαιρα κύρους της Σχολής Γαλατά.'
                                : 'Get in touch with us to bring your exhibition, conference, concert, or exclusive reception to the century-old neoclassical architecture and prestigious atmosphere of the Galata Greek School.'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                        <Link to={localizePath('/bize-ulasin')} className="pe-cta__btn group">
                            {lang === 'tr' ? 'Bize Ulaşın' : lang === 'el' ? 'Επικοινωνία' : 'Contact Us'}
                            <span className="pe-cta__btn-icon">→</span>
                        </Link>
                        <Link to={localizePath('/mekan-kiralama')} className="pe-cta__btn group" style={{ background: 'transparent', border: '1px solid var(--color-brass-gold)', color: 'var(--color-ink)' }}>
                            {lang === 'tr' ? 'Salonları & Kapasiteleri İnceleyin' : lang === 'el' ? 'Δείτε Χώρους & Χωρητικότητες' : 'Explore Halls & Capacities'}
                            <span className="pe-cta__btn-icon">→</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
