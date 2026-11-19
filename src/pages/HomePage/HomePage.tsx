import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen, DoorClosed } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { useCmsContent } from '../../hooks/useCmsContent';
import SEO from '../../components/SEO/SEO';
import { supabase } from '../../services/supabaseClient';
import { getCuratedEventTitle } from '../../services/dbSync';
import { resolveEventSlug } from '../../utils/eventSlug';
import { buildInstitutionalJsonLd, VENUE_INFO, normalizeLegacyMediaUrl } from '../../config/venueInfo';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import { DEFAULT_FACADE_IMAGE, parseHeroConfig } from '../../config/heroConfig';
import tarihce3Img from '../../assets/images/tarihce3.webp';
import './HomePage.css';

const CURATED_EVENT_TAG_EL: Record<string, string> = {
    'Sanat Sergisi & Bienal': 'Έκθεση Τέχνης & Μπιενάλε',
    'Konferans, Söyleşi & Sempozyum': 'Συνέδριο, Ομιλία & Συμπόσιο',
    'Kurumsal Etkinlik & Lansman': 'Εταιρική Εκδήλωση & Παρουσίαση',
    'Performans, Konser & Tiyatro': 'Παράσταση, Συναυλία & Θέατρο',
    'Atölye & Eğitim': 'Εργαστήριο & Εκπαίδευση',
};

export default function HomePage() {
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';
    const cms = useCmsContent('home');

    const rawHeroConfig = cms.get('hero_slides_config', lang, '');
    const heroConfig = useMemo(() => parseHeroConfig(rawHeroConfig), [rawHeroConfig]);
    const facadeImageSrc = heroConfig.facadeImageUrl || DEFAULT_FACADE_IMAGE;

    const [latestEvents, setLatestEvents] = useState<any[]>([]);
    // Hero "door" sequence: facade (closed) → light through the seam (ajar) → interior tour (open)
    const [doorPhase, setDoorPhase] = useState<'closed' | 'ajar' | 'open'>('closed');
    const [interiorIndex, setInteriorIndex] = useState(0);
    const [prevInteriorIndex, setPrevInteriorIndex] = useState<number | null>(null);
    const [manualReplayTick, setManualReplayTick] = useState(0);
    const doorTimers = useRef<number[]>([]);
    const shouldReduceMotion = useReducedMotion();

    const clearDoorTimers = useCallback(() => {
        doorTimers.current.forEach((t) => window.clearTimeout(t));
        doorTimers.current = [];
    }, []);

    // Effective scene duration: if stored config has legacy 6.2s default, stretch to 9.2s for a slower, calmer pan
    const effectiveSlideDurationMs = heroConfig.slideDurationMs <= 6500
        ? heroConfig.slideDurationMs + 3000
        : heroConfig.slideDurationMs;

    useEffect(() => {
        doorTimers.current = [
            window.setTimeout(() => setDoorPhase('ajar'), 1100),
            window.setTimeout(() => setDoorPhase('open'), 2000),
        ];
        return clearDoorTimers;
    }, [clearDoorTimers]);

    // Close onto the main facade image, hold briefly, then reopen onto Scene 01 in a continuous loop
    const closeAndLoopToStart = useCallback(() => {
        clearDoorTimers();
        setDoorPhase('closed');
        doorTimers.current = [
            // Wait 1.85s until the two facade door leaves finish swinging shut before resetting to Scene 01
            window.setTimeout(() => {
                setPrevInteriorIndex(null);
                setInteriorIndex(0);
                setManualReplayTick((t) => t + 1);
            }, 1850),
            // Hold the closed main facade image, then show the warm light seam and swing open again
            window.setTimeout(() => setDoorPhase('ajar'), 4200),
            window.setTimeout(() => setDoorPhase('open'), 5100),
        ];
    }, [clearDoorTimers]);

    // Once doors open, cycle through all interior scenes; after the final scene, close back onto the main facade image and loop
    useEffect(() => {
        if (doorPhase !== 'open' || heroConfig.slides.length === 0) return;
        let leaveCleanupTimer: number | undefined;
        const safeIndex = interiorIndex % heroConfig.slides.length;
        const isLastSlide = safeIndex >= heroConfig.slides.length - 1;

        const timer = window.setTimeout(() => {
            if (isLastSlide) {
                closeAndLoopToStart();
            } else {
                setPrevInteriorIndex(safeIndex);
                setInteriorIndex(safeIndex + 1);
                leaveCleanupTimer = window.setTimeout(() => setPrevInteriorIndex(null), 1850);
            }
        }, effectiveSlideDurationMs);

        return () => {
            window.clearTimeout(timer);
            if (leaveCleanupTimer) window.clearTimeout(leaveCleanupTimer);
        };
    }, [doorPhase, interiorIndex, heroConfig.slides.length, effectiveSlideDurationMs, manualReplayTick, closeAndLoopToStart]);

    const selectScene = (targetIdx: number) => {
        clearDoorTimers();
        if (doorPhase !== 'open') {
            setDoorPhase('open');
        }
        setPrevInteriorIndex(null);
        setInteriorIndex(targetIdx);
        setManualReplayTick((t) => t + 1);
    };

    const toggleDoors = () => {
        if (doorPhase === 'open') {
            closeAndLoopToStart();
        } else {
            clearDoorTimers();
            setPrevInteriorIndex(null);
            setInteriorIndex(0);
            setManualReplayTick((t) => t + 1);
            setDoorPhase('open');
        }
    };

    useEffect(() => {
        const fetchLatest = async () => {
            const { data } = await supabase
                .from('past_events')
                .select('id, slug, cover_image_url, title_tr, title_en, title_el, event_date, type_tr, type_en, type_el')
                .eq('status', 'published')
                .order('event_date', { ascending: false })
                .limit(3);
            if (data) setLatestEvents(data);
        };
        fetchLatest();
    }, []);

    const badgeColors = ['--gold', '--clay', '--gold'];

    return (
        <div className="home-page">
            <SEO 
                titleKey="home.title" 
                aiSchema={buildInstitutionalJsonLd(localizePath('/'))}
            />
            {/* ══════ HERO — "The Modern Past" (facade doors open onto panning interior halls) ══════ */}
            <header
                className={`hp-hero hp-hero--${doorPhase}`}
                style={{ '--hero-pan-duration': `${effectiveSlideDurationMs + 3200}ms` } as React.CSSProperties}
            >
                {/* Stage: panning interior slides behind, facade split into two door leaves in front */}
                <div className="hp-hero__stage" aria-hidden="true">
                    <div className="hp-hero__interiors">
                        {heroConfig.slides.map((slide, idx) => {
                            const safeIndex = interiorIndex % heroConfig.slides.length;
                            const isActive = idx === safeIndex;
                            const isLeaving = !isActive && prevInteriorIndex !== null && idx === (prevInteriorIndex % heroConfig.slides.length);
                            if (idx > 0 && !isActive && !isLeaving && doorPhase === 'closed') return null;
                            return (
                                <img
                                    key={`${slide.id || `${slide.src}-${idx}`}-${isActive ? manualReplayTick : 0}`}
                                    className={`hp-hero__hall hp-hero__hall--${slide.panVariant} ${isActive ? 'hp-hero__hall--active' : ''} ${isLeaving ? 'hp-hero__hall--leaving' : ''}`}
                                    src={slide.src}
                                    alt=""
                                    decoding="async"
                                    loading="lazy"
                                    fetchPriority="low"
                                />
                            );
                        })}
                    </div>
                    <div className="hp-hero__door hp-hero__door--left">
                        <img src={facadeImageSrc} alt="" fetchPriority="high" decoding="async" />
                    </div>
                    <div className="hp-hero__door hp-hero__door--right">
                        <img src={facadeImageSrc} alt="" decoding="async" />
                    </div>
                    <span className="hp-hero__seam" />
                </div>

                {/* Dark gradient overlay */}
                <div className="hp-hero__overlay" aria-hidden="true" />

                {/* Interactive scene selector pill — lets visitors & admins jump directly to any interior scene and replay its pan */}
                {doorPhase === 'open' && heroConfig.slides.length > 1 && (
                    <div className="hp-hero__scenes" role="tablist" aria-label={lang === 'tr' ? 'İç mekân sahneleri' : lang === 'el' ? 'Εσωτερικές σκηνές' : 'Interior scenes'}>
                        {heroConfig.slides.map((slide, idx) => {
                            const safeIndex = interiorIndex % heroConfig.slides.length;
                            const isActive = idx === safeIndex;
                            const slideTitle =
                                lang === 'tr'
                                    ? (slide.label || `Sahne ${idx + 1}`)
                                    : lang === 'el'
                                        ? `Σκηνή ${idx + 1}`
                                        : `Scene ${idx + 1}`;
                            return (
                                <button
                                    key={slide.id || idx}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    title={slideTitle}
                                    onClick={() => selectScene(idx)}
                                    className={`hp-hero__scene-btn ${isActive ? 'hp-hero__scene-btn--active' : ''}`}
                                >
                                    {String(idx + 1).padStart(2, '0')}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Facade / hall toggle — lets visitors replay or skip the door sequence */}
                <button
                    type="button"
                    onClick={toggleDoors}
                    className="hp-hero__video-control"
                    aria-pressed={doorPhase === 'open'}
                    aria-label={doorPhase === 'open'
                        ? (lang === 'tr' ? 'Dış cepheyi göster' : lang === 'el' ? 'Εμφάνιση πρόσοψης' : 'Show the facade')
                        : (lang === 'tr' ? 'İç mekânı göster' : lang === 'el' ? 'Εμφάνιση εσωτερικού χώρου' : 'Show the interior')}
                >
                    {doorPhase === 'open' ? <DoorClosed size={18} /> : <DoorOpen size={18} />}
                </button>

                {/* Content layer — z-index: 1 */}
                <motion.div
                    className="hp-hero__content"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="hp-hero__headline">
                        The Modern Past
                        <span className="sr-only"> — {VENUE_INFO.institutionName[l as 'tr' | 'en' | 'el']}</span>
                    </h1>
                    <p className="hp-hero__tagline">
                        {lang === 'tr' ? 'Tarihi yeniden tanıyın.' : lang === 'el' ? 'Ανακαλύψτε ξανά την ιστορία.' : 'Rediscover history.'}
                    </p>
                    <p className="hp-hero__subtitle">
                        {cms.get('hero_subtitle', lang,
                            lang === 'tr'
                                ? 'Galata\'nın kalbinde 19. yüzyıldan kalma bir simge yapı, şimdi çağdaş sanat ve kültür evi.'
                                : lang === 'el'
                                    ? 'Ένα τοπόσημο του 19ου αιώνα στην καρδιά του Γαλατά, στις μέρες μας χώρος σύγχρονης τέχνης και πολιτισμού.'
                                    : 'A 19th-century landmark in the heart of Galata, now a home for contemporary art and culture.'
                        ).replace(/^(Tarihi yeniden tanıyın\.|Rediscover history\.|Ανακαλύψτε ξανά την ιστορία\.)\s*/i, '')}
                    </p>
                    <div className="hp-hero__ctas">
                        <Link to={localizePath('/mekan-kiralama')} className="hp-hero__cta hp-hero__cta--primary">
                            {lang === 'tr' ? 'Mekan Kiralama' : lang === 'el' ? 'Ενοικίαση Χώρου' : 'Venue Hire'}
                        </Link>
                        <Link to={localizePath('/tarihce')} className="hp-hero__cta hp-hero__cta--secondary">
                            {cms.get('cta_secondary', lang,
                                lang === 'tr' ? 'Hikayemizi Keşfedin' : lang === 'el' ? 'Ανακαλύψτε την Ιστορία μας' : 'Discover Our Story'
                            )}
                        </Link>
                    </div>
                </motion.div>

                {/* Scroll indicator — z-index: 1 */}
                <div className="hp-hero__scroll" aria-hidden="true">
                    <span className="hp-hero__scroll-text">{lang === 'tr' ? 'Kaydır' : lang === 'el' ? 'Κύλιση' : 'Scroll'}</span>
                    <span className="hp-hero__scroll-icon">&#x25BE;</span>
                </div>
            </header>

            {/* ══════ TARIHCE — History Section ══════ */}
            <section className="hp-history">
                <div className="hp-history__inner">
                    <motion.div
                        className="hp-history__text"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="hp-history__watermark">1885</div>
                        <h2 className="hp-history__title">
                            {lang === 'tr' ? 'Tarihçe' : lang === 'el' ? 'Ιστορία' : 'History'}
                        </h2>
                        <div className="hp-history__body">
                            <p>
                                {cms.get('history_p1', lang,
                                    lang === 'tr'
                                        ? 'Galata Rum Okulu, Osmanlı İmparatorluğu\'nun modernleşme sürecinde Rum topluluğunun gerçekleştirdiği eğitim kurumları içindeki en önemli yerlerden biridir.'
                                        : lang === 'el'
                                            ? 'Η Αστική Σχολή Γαλατά συγκαταλέγεται στα σημαντικότερα εκπαιδευτικά καθιδρύματα που ίδρυσε η ομογένεια κατά την περίοδο του εκσυγχρονισμού της Οθωμανικής Αυτοκρατορίας.'
                                            : 'The Galata Greek School is one of the most important educational institutions established by the Greek community during the modernization process of the Ottoman Empire.'
                                )}
                            </p>
                            <p>
                                {cms.get('history_p2', lang,
                                    lang === 'tr'
                                        ? '2 Haziran 1910 tarihinde açılan okul, mimar Patroklos Kambanakis ve Stavros Hristidis tarafından inşa edilmiştir.'
                                        : lang === 'el'
                                            ? 'Η Σχολή εγκαινιάστηκε στις 2 Ιουνίου 1910. Το κτίριο ανεγέρθηκε σε σχέδια των αρχιτεκτόνων Πατρόκλου Καμπανάκη και Σταύρου Χρηστίδη.'
                                            : 'Opened on June 2, 1910, the school was built by architects Patroklos Kambanakis and Stavros Hristidis.'
                                )}
                            </p>
                            <Link to={localizePath('/tarihce')} className="hp-history__link">
                                {lang === 'tr' ? 'DAHA FAZLA OKU' : lang === 'el' ? 'ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ' : 'READ MORE'}
                                <span className="hp-history__link-arrow">&rarr;</span>
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        className="hp-history__gallery"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="hp-history__gallery-col hp-history__gallery-col--offset">
                            <img src="/images/homepage/detail-1.webp" alt="Galata Greek School Historic Neoclassical Architectural Details" className="hp-history__photo hp-history__photo--sm" loading="lazy" width="400" height="300" />
                            <img src="/images/homepage/detail-2.webp" alt="Galata Greek School Grand Historical Staircase Detail" className="hp-history__photo hp-history__photo--lg" loading="lazy" width="400" height="500" />
                        </div>
                        <div className="hp-history__gallery-col">
                            <img src="/images/homepage/detail-3.webp" alt="Galata Greek School Heritage Event Space Interior" className="hp-history__photo hp-history__photo--lg" loading="lazy" width="400" height="500" />
                            <img src="/images/homepage/detail-4.webp" alt="Galata Greek School Heritage Exhibition Venue Floor Detail" className="hp-history__photo hp-history__photo--sm" loading="lazy" width="400" height="300" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════ SPLIT SECTION — Architecture Statement ══════ */}
            <section className="hp-split">
                <motion.div
                    className="hp-split__image"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <img src={tarihce3Img} alt="Galata Greek School Historic Exhibition Venue Interior Space" loading="lazy" width="800" height="600" />
                </motion.div>
                <motion.div
                    className="hp-split__text"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="hp-split__divider" />
                    <h2 className="hp-split__headline">
                        {lang === 'tr'
                            ? 'Dönemin neoklasik mimarisiyle İstanbul\'un kalbinde.'
                            : lang === 'el'
                                ? 'Ένα νεοκλασικό τοπόσημο στην καρδιά της Κωνσταντινούπολης.'
                                : 'Neoclassical architecture in the heart of Istanbul.'}
                    </h2>
                    <p className="hp-split__body">
                        {lang === 'tr'
                            ? 'Okul binası 2012 yılında İstanbul Rum Cemaati\'ne iade edilmiştir. Bu tarihten itibaren şehrin kültür ve sanat hayatına kapılarını açarak birçok önemli etkinliğe ev sahipliği yapmaktadır.'
                            : lang === 'el'
                                ? 'Το ιστορικό κτίριο της Σχολής αποδόθηκε εκ νέου στην Ελληνορθόδοξη Κοινότητα της Κωνσταντινούπολης το 2012. Έκτοτε άνοιξε τις πύλες του στην πολιτιστική και καλλιτεχνική ζωή της Πόλης, φιλοξενώντας πλήθος σημαντικών εκδηλώσεων.'
                                : 'The school building was returned to its owners, the Istanbul Greek community, in 2012. Since then, it has opened its doors to the city\'s culture and arts life, hosting many important events.'}
                    </p>
                    <Link to={localizePath('/mekan-kiralama')} className="hp-history__link" style={{ marginTop: 'var(--space-6)', position: 'relative', zIndex: 1 }}>
                        {lang === 'tr' ? 'SALONLARI VE MİMARİYİ KEŞFEDİN' : lang === 'el' ? 'ΕΞΕΡΕΥΝΗΣΤΕ ΤΟΥΣ ΧΩΡΟΥΣ & ΤΗΝ ΑΡΧΙΤΕΚΤΟΝΙΚΗ' : 'EXPLORE THE SPACES & ARCHITECTURE'}
                        <span className="hp-history__link-arrow">&rarr;</span>
                    </Link>
                    <div className="hp-split__watermark">2026</div>
                </motion.div>
            </section>

            {/* ══════ ETKINLIKLER — Events Section ══════ */}
            <section className="hp-events">
                <div className="hp-events__inner">
                    <div className="hp-events__header">
                        <div>
                            <h2 className="hp-events__title">
                                {lang === 'tr' ? 'Etkinlikler' : lang === 'el' ? 'Εκδηλώσεις' : 'Events'}
                            </h2>
                            <p className="hp-events__subtitle">
                                {lang === 'tr' ? 'Sergiler ve kültürel buluşmalar' : lang === 'el' ? 'Εκθέσεις και πολιτιστικές συναντήσεις' : 'Exhibitions and cultural gatherings'}
                            </p>
                        </div>
                        <Link to={localizePath('/gecmis-etkinlikler')} className="hp-events__view-all">
                            {lang === 'tr' ? 'Tümünü Gör' : lang === 'el' ? 'Προβολή Όλων' : 'View All'}
                        </Link>
                    </div>
                    <div className="hp-events__grid">
                        {latestEvents.map((evt, idx) => {
                            const evtSlug = resolveEventSlug(evt);
                            const evtTitle = decodeHtmlEntities(
                                (l !== 'tr' ? getCuratedEventTitle(evtSlug, l as 'tr' | 'en' | 'el') || getCuratedEventTitle(evt.id, l as 'tr' | 'en' | 'el') : '') ||
                                    evt[`title_${l}`] ||
                                    evt.title_en ||
                                    evt.title_tr ||
                                    ''
                            );
                            return (
                            <motion.div
                                key={evt.id}
                                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link to={localizePath(`/gecmis-etkinlikler/${evtSlug}`)} className="hp-event-card">
                                    <div className="hp-event-card__image-wrap">
                                        <img
                                            src={normalizeLegacyMediaUrl(evt.cover_image_url) || '/placeholder.png'}
                                            alt={evtTitle}
                                            className="hp-event-card__img"
                                            loading="lazy"
                                            width="400"
                                            height="300"
                                        />
                                        <div className="hp-event-card__overlay" aria-hidden="true" />
                                        <span className={`hp-event-card__badge hp-event-card__badge${badgeColors[idx % badgeColors.length]}`}>
                                            {(l === 'el' ? CURATED_EVENT_TAG_EL[evt.type_tr || ''] : '') || evt[`type_${l}`] || evt.type_en || ''}
                                        </span>
                                    </div>
                                    <h3 className="hp-event-card__title">
                                        {evtTitle}
                                    </h3>
                                    <p className="hp-event-card__date">
                                        {evt.event_date
                                            ? new Date(evt.event_date).toLocaleDateString(
                                                l === 'tr' ? 'tr-TR' : l === 'el' ? 'el-GR' : 'en-GB',
                                                { day: '2-digit', month: '2-digit', year: 'numeric' }
                                            )
                                            : ''}
                                    </p>
                                </Link>
                            </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
