import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import {
    getCuratedEventDescription,
    getPreservedLegacyEvent,
    resolveEventSlug,
    resolveEventIdFromStabilizedSlug,
} from '../../services/dbSync';
import { PRODUCTION_SITE_ORIGIN, VENUE_INFO, normalizeLegacyMediaUrl } from '../../config/venueInfo';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './EventDetailPage.css';

export default function EventDetailPage() {
    const { slug } = useParams();
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';

    const preservedInitial = slug ? getPreservedLegacyEvent(slug) : null;
    const [eventData, setEventData] = useState<any>(preservedInitial);
    const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(!preservedInitial);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }
            const preservedMatch = getPreservedLegacyEvent(slug);
            if (!preservedMatch) {
                setLoading(true);
            }

            // 1. Try slug column first
            let result = await supabase
                .from('past_events')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();

            // 2. Try stabilized slug mapping (for the 5 events whose DB slug was null before migration)
            if (!result.data) {
                const stabilizedId = resolveEventIdFromStabilizedSlug(slug);
                if (stabilizedId) {
                    result = await supabase
                        .from('past_events')
                        .select('*')
                        .eq('id', stabilizedId)
                        .maybeSingle();
                }
            }

            // 3. Fallback: try as UUID id (for backward compatibility with legacy UUID deep links)
            if (!result.data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
                result = await supabase
                    .from('past_events')
                    .select('*')
                    .eq('id', slug)
                    .maybeSingle();
            }

            const current = result.data ?? preservedMatch ?? null;
            setEventData(current);
            setLoading(false);

            if (current) {
                const { data: relData } = await supabase
                    .from('past_events')
                    .select('id, slug, title_tr, title_en, title_el, cover_image_url, event_date, type_tr, type_en, type_el, sub_tag')
                    .eq('status', 'published')
                    .neq('id', current.id)
                    .order('event_date', { ascending: false })
                    .limit(12);

                if (relData && relData.length > 0) {
                    const sameCategory = relData.filter(
                        (r: any) =>
                            (current.sub_tag && r.sub_tag === current.sub_tag) ||
                            (current.type_tr && r.type_tr === current.type_tr)
                    );
                    const picked = (sameCategory.length >= 3 ? sameCategory : [...sameCategory, ...relData.filter((r: any) => !sameCategory.includes(r))]).slice(0, 3);
                    setRelatedEvents(picked);
                }
            }
        };
        fetchEvent();
    }, [slug]);

    if (loading) return <div style={{ padding: '80px 20px', textAlign: 'center' }}>Loading Event Details…</div>;
    if (!eventData) return <NotFoundPage />;

    const stabilizedSlug = resolveEventSlug(eventData);
    const title = decodeHtmlEntities(eventData[`title_${l}`] || eventData.title_en || eventData.title_tr || '');
    const localizedDbDesc = l === 'tr' ? eventData.description_tr : eventData[`description_${l}`];
    const curatedDesc = getCuratedEventDescription(stabilizedSlug, l) || getCuratedEventDescription(eventData.id, l);
    const hasNativeTranslation = Boolean((localizedDbDesc && localizedDbDesc.trim()) || (curatedDesc && curatedDesc.trim()));

    const desc = decodeHtmlEntities(
        localizedDbDesc ||
            curatedDesc ||
            (l !== 'tr' ? eventData.description_en : '') ||
            eventData.description_tr ||
            eventData.description_en ||
            eventData.description_el ||
            ''
    );
    const isShowingTurkishFallback = l !== 'tr' && !hasNativeTranslation && Boolean(eventData.description_tr);

    const rawGalleryImages: string[] = eventData.thumbnail_images || eventData.gallery_urls || [];
    const galleryImages: string[] = rawGalleryImages.map((u) => normalizeLegacyMediaUrl(u)).filter(Boolean);
    const coverImageUrl = normalizeLegacyMediaUrl(eventData.cover_image_url) || '/placeholder.png';
    const category = decodeHtmlEntities(eventData[`type_${l}`] || eventData.type_en || '');
    const eventDate = eventData.event_date
        ? new Date(eventData.event_date).toLocaleDateString(l === 'tr' ? 'tr-TR' : l === 'el' ? 'el-GR' : 'en-GB')
        : '';
    const venueName = VENUE_INFO.institutionName[l];

    const seoDescription = hasNativeTranslation && desc
        ? desc.substring(0, 160)
        : l === 'tr'
            ? `${title} — ${venueName} arşiv etkinliği${eventDate ? ` (${eventDate})` : ''}.`
            : l === 'el'
                ? `${title} — Αρχειακή εκδήλωση στο ${venueName}${eventDate ? ` (${eventDate})` : ''}.`
                : `${title} — Archival event hosted at ${venueName}${eventDate ? ` (${eventDate})` : ''}.`;

    // Split description into paragraphs
    const descParagraphs = desc ? desc.split(/\n\n|\n/).filter((p: string) => p.trim()) : [];

    return (
        <div className="event-detail-page" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={title}
                overrideDescription={seoDescription}
                overrideKeywords={l === 'tr' ? `${title}, ${category}, galata rum okulu, etkinlik, istanbul kültür` : l === 'el' ? `${title}, ${category}, ελληνική σχολή γαλατά, εκδήλωση, Κωνσταντινούπολη πολιτισμός` : `${title}, ${category}, galata greek school, event, istanbul culture`}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": title,
                    "description": seoDescription,
                    "url": `${PRODUCTION_SITE_ORIGIN}${localizePath(`/gecmis-etkinlikler/${stabilizedSlug}`)}`,
                    "startDate": eventData.event_date || '',
                    "image": coverImageUrl.startsWith('/') ? `${PRODUCTION_SITE_ORIGIN}${coverImageUrl}` : coverImageUrl,
                    "location": {
                        "@type": "Place",
                        "name": venueName,
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": VENUE_INFO.contact.schemaStreetAddress,
                            "addressLocality": VENUE_INFO.contact.addressLocality,
                            "addressRegion": VENUE_INFO.contact.addressRegion,
                            "postalCode": VENUE_INFO.contact.postalCode,
                            "addressCountry": VENUE_INFO.contact.addressCountry
                        }
                    },
                    "organizer": {
                        "@type": "Organization",
                        "name": venueName,
                        "url": PRODUCTION_SITE_ORIGIN
                    }
                }}
            />
            <div className="ed-main">
                <Breadcrumbs items={[
                    { label: { tr: 'Geçmiş Etkinlikler', en: 'Past Events', el: 'Παρελθούσες Εκδηλώσεις' }, to: '/gecmis-etkinlikler' },
                    { label: { tr: title, en: title, el: title } }
                ]} />

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
                    <img src={coverImageUrl} alt={title} className="ed-hero__img" width="1200" height="675" />
                </section>

                {/* ══════ GALLERY IMAGES ══════ */}
                {galleryImages.length > 0 && (
                    <section className="ed-gallery">
                        {galleryImages.map((url: string, index: number) => (
                            <div key={index} className="ed-gallery__item">
                                <img src={url} alt={`${title} Gallery ${index + 1}`} className="ed-gallery__img" loading="lazy" width="600" height="400" />
                            </div>
                        ))}
                    </section>
                )}

                {/* ══════ BODY ══════ */}
                <section className="ed-body">
                    <div className="ed-body__content">
                        {isShowingTurkishFallback && (
                            <div
                                role="note"
                                data-testid="event-translation-fallback-notice"
                                style={{
                                    marginBottom: 'var(--space-6, 24px)',
                                    padding: 'var(--space-4, 16px) var(--space-5, 20px)',
                                    borderLeft: '3px solid var(--color-brass-gold, #C5A059)',
                                    backgroundColor: 'rgba(197, 160, 89, 0.08)',
                                    fontSize: 'var(--text-sm, 0.875rem)',
                                    lineHeight: 1.6,
                                    color: 'var(--color-ink)',
                                }}
                            >
                                {l === 'el'
                                    ? 'Σημείωση Αρχείου: Η ελληνική μετάφραση αυτού του αρχειακού κειμένου βρίσκεται υπό επιμέλεια. Παρακάτω παρατίθεται το πρωτότυπο τουρκικό κείμενο τεκμηρίωσης.'
                                    : 'Archival Note: The English translation of this archival event record is currently in editorial preparation. The original Turkish archival text is provided below for reference.'}
                            </div>
                        )}
                        {descParagraphs.length > 0 ? (
                            <div lang={isShowingTurkishFallback ? 'tr' : l}>
                                {descParagraphs.map((paragraph: string, index: number) => (
                                    <p key={index} className="ed-body__text">
                                        {paragraph.trim()}
                                    </p>
                                ))}
                            </div>
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
                            <h2 className="ed-sidebar__title">
                                {lang === 'tr' ? 'Detaylar' : lang === 'el' ? 'Λεπτομέρειες' : 'Details'}
                            </h2>
                            <ul className="ed-sidebar__list">
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">{lang === 'tr' ? 'Tarih:' : lang === 'el' ? 'Ημερομηνία:' : 'Date:'}</span>
                                    <span>{eventDate}</span>
                                </li>
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">{lang === 'tr' ? 'Mekan:' : lang === 'el' ? 'Χώρος:' : 'Venue:'}</span>
                                    <Link to={localizePath('/mekan-kiralama')} className="ed-sidebar__venue-link">{venueName}</Link>
                                </li>
                                <li className="ed-sidebar__item">
                                    <span className="ed-sidebar__label">{lang === 'tr' ? 'Kategori:' : lang === 'el' ? 'Κατηγορία:' : 'Category:'}</span>
                                    <span>{category}</span>
                                </li>
                            </ul>
                            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(197, 160, 89, 0.15)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <Link
                                    to={localizePath('/bize-ulasin')}
                                    style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--space-3) var(--space-5)', backgroundColor: 'var(--color-brass-gold)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                                >
                                    {lang === 'tr' ? 'Mekan & İletişim' : lang === 'el' ? 'Χώρος & Επικοινωνία' : 'Venue & Inquiry'}
                                </Link>
                                <Link
                                    to={localizePath('/gecmis-etkinlikler')}
                                    style={{ textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}
                                >
                                    {lang === 'tr' ? '← Tüm Geçmiş Etkinlikler' : lang === 'el' ? '← Όλες οι Εκδηλώσεις' : '← All Past Events'}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* ══════ RELATED EXHIBITIONS & EVENTS (Niyet 2 & 3 Internal Linking) ══════ */}
                {relatedEvents.length > 0 && (
                    <section style={{ marginTop: 'var(--space-12)', paddingTop: 'var(--space-10)', borderTop: '1px solid rgba(28, 25, 23, 0.1)' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 500, color: 'var(--color-ink)', marginBottom: 'var(--space-6)' }}>
                            {lang === 'tr' ? 'Benzer Sergi ve Kültür-Sanat Etkinlikleri' : lang === 'el' ? 'Σχετικές Εκθέσεις & Πολιτιστικές Εκδηλώσεις' : 'Related Exhibitions & Cultural Events'}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
                            {relatedEvents.map((rel) => {
                                const relSlug = resolveEventSlug(rel);
                                const relTitle = decodeHtmlEntities(rel[`title_${l}`] || rel.title_en || rel.title_tr || '');
                                const relImg = normalizeLegacyMediaUrl(rel.cover_image_url) || '/placeholder.png';
                                const relBadge = decodeHtmlEntities(rel[`type_${l}`] || rel.type_en || rel.sub_tag || '');
                                return (
                                    <Link
                                        key={rel.id}
                                        to={localizePath(`/gecmis-etkinlikler/${relSlug}`)}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid rgba(28, 25, 23, 0.1)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-white)' }}
                                    >
                                        <img
                                            src={relImg}
                                            alt={relTitle}
                                            loading="lazy"
                                            width="400"
                                            height="250"
                                            style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover' }}
                                        />
                                        <div style={{ padding: '0 1.15rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {relBadge && (
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}>
                                                    {relBadge}
                                                </span>
                                            )}
                                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.08rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0, lineHeight: 1.35 }}>
                                                {relTitle}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ══════ VENUE HIRE CONVERSION CARD (Niyet 2, 3 & 4 Internal Link) ══════ */}
                <section
                    style={{
                        marginTop: 'var(--space-12)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-charcoal)',
                        color: 'var(--color-white)',
                        border: '1px solid rgba(197, 160, 89, 0.35)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                    }}
                >
                    <div style={{ maxWidth: '58ch' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-brass-gold)', marginBottom: '0.4rem' }}>
                            {lang === 'tr' ? 'TARİHİ BİNADA ETKİNLİK & SERGİ KİRALAMA' : lang === 'el' ? 'ΕΝΟΙΚΙΑΣΗ ΧΩΡΟΥ ΓΙΑ ΕΚΘΕΣΕΙΣ & ΕΚΔΗΛΩΣΕΙΣ' : 'HERITAGE VENUE HIRE FOR EXHIBITIONS & EVENTS'}
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-white)', margin: '0 0 0.5rem' }}>
                            {lang === 'tr'
                                ? 'Sergi, Konferans veya Lansman Projeniz İçin Galata Rum Okulu’nu Kiralayın'
                                : lang === 'el'
                                  ? 'Ενοικιάστε την Ελληνική Σχολή Γαλατά για την Έκθεση ή το Συνέδριό σας'
                                  : 'Host Your Next Exhibition, Conference, or Brand Launch at Galata Greek School'}
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-archive-beige)' }}>
                            {lang === 'tr'
                                ? '1910 tarihli neoklasik yapımızın 3 etkinlik katında toplam 1.060 m² alan ve 850 kişiye varan kapasiteyle sergi, konferans ve özel davetlerinizi planlayın.'
                                : lang === 'el'
                                  ? 'Σχεδιάστε την έκθεση, το συνέδριο ή τη δεξίωσή σας σε 1.060 m² σε 3 ορόφους με χωρητικότητα έως 850 επισκέπτες.'
                                  : 'Plan your exhibition, conference, or private reception across 1,060 m² of event space on 3 floors with capacity for up to 850 guests.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                        <Link
                            to={localizePath('/mekan-kiralama')}
                            style={{ padding: '0.85rem 1.5rem', background: 'var(--color-brass-gold)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                        >
                            {lang === 'tr' ? 'Kat Planları & Kapasiteler →' : lang === 'el' ? 'Κατόψεις & Χωρητικότητες →' : 'Floor Plans & Capacities →'}
                        </Link>
                        <Link
                            to={localizePath('/bize-ulasin')}
                            style={{ padding: '0.85rem 1.35rem', border: '1px solid rgba(197, 160, 89, 0.5)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                        >
                            {lang === 'tr' ? 'Teklif Alın' : lang === 'el' ? 'Ζητήστε Προσφορά' : 'Request Proposal'}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
