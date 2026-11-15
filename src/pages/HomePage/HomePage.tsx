import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen, DoorClosed } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { useCmsContent } from '../../hooks/useCmsContent';
import SEO from '../../components/SEO/SEO';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import heroFacadeImage from '../../assets/hero-facade-wide.webp';
import tarihce3Img from '../../assets/images/tarihce3.webp';
import './HomePage.css';

export default function HomePage() {
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';
    const cms = useCmsContent('home');

    const [latestEvents, setLatestEvents] = useState<any[]>([]);
    // Hero "door" sequence: facade (closed) → light through the seam (ajar) → main hall (open)
    const [doorPhase, setDoorPhase] = useState<'closed' | 'ajar' | 'open'>('closed');
    const doorTimers = useRef<number[]>([]);
    const shouldReduceMotion = useReducedMotion();

    const clearDoorTimers = () => {
        doorTimers.current.forEach((t) => window.clearTimeout(t));
        doorTimers.current = [];
    };

    useEffect(() => {
        doorTimers.current = [
            window.setTimeout(() => setDoorPhase('ajar'), 3200),
            window.setTimeout(() => setDoorPhase('open'), 4500),
        ];
        return clearDoorTimers;
    }, []);

    const toggleDoors = () => {
        clearDoorTimers();
        setDoorPhase((p) => (p === 'open' ? 'closed' : 'open'));
    };

    useEffect(() => {
        const fetchLatest = async () => {
            const { data } = await supabase
                .from('past_events')
                .select('*')
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
                aiSchema={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Organization",
                            "@id": "https://galatarumokulu.org.tr/#organization",
                            "url": "https://galatarumokulu.org.tr",
                            "name": "Galata Rum Okulu Vakfı - Kültür Merkezi",
                            "alternateName": "Galata Greek School Foundation - Cultural Center",
                            "description": "A historic 19th-century school building in Istanbul's Galata district, now serving as a cultural and event venue.",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Kemankeş Karamustafa Paşa, Kemeraltı Cd. No:49",
                                "addressLocality": "Istanbul",
                                "addressRegion": "Beyoğlu",
                                "postalCode": "34425",
                                "addressCountry": "TR"
                            },
                            "sameAs": [
                                "https://www.instagram.com/galatarumokulu/",
                                "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu"
                            ]
                        },
                        {
                            "@type": ["LandmarksOrHistoricalBuildings", "Place"],
                            "@id": "https://galatarumokulu.org.tr/#place",
                            "url": "https://galatarumokulu.org.tr",
                            "name": "Galata Rum Okulu Vakfı - Kültür Merkezi",
                            "alternateName": "Galata Greek School Foundation - Cultural Center",
                            "description": "A historic 19th-century school building in Istanbul's Galata district, now serving as a cultural and event venue.",
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
                            "sameAs": [
                                "https://www.instagram.com/galatarumokulu/",
                                "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu"
                            ]
                        }
                    ]
                }}
            />
            {/* ══════ HERO — "The Modern Past" (facade doors open onto the main hall) ══════ */}
            <header className={`hp-hero hp-hero--${doorPhase}`}>
                {/* Stage: main hall behind, facade split into two door leaves in front */}
                <div className="hp-hero__stage" aria-hidden="true">
                    <img
                        className="hp-hero__hall"
                        src="https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media/venue/mz81jyod0nq_1773083709418.webp"
                        alt=""
                        decoding="async"
                    />
                    <div className="hp-hero__door hp-hero__door--left">
                        <img src={heroFacadeImage} alt="" fetchPriority="high" />
                    </div>
                    <div className="hp-hero__door hp-hero__door--right">
                        <img src={heroFacadeImage} alt="" />
                    </div>
                    <span className="hp-hero__seam" />
                </div>

                {/* Dark gradient overlay */}
                <div className="hp-hero__overlay" aria-hidden="true" />

                {/* Facade / hall toggle — lets visitors replay or skip the door sequence */}
                <button
                    type="button"
                    onClick={toggleDoors}
                    className="hp-hero__video-control"
                    aria-pressed={doorPhase === 'open'}
                    aria-label={doorPhase === 'open'
                        ? (lang === 'tr' ? 'Dış cepheyi göster' : lang === 'el' ? 'Εμφάνιση πρόσοψης' : 'Show the facade')
                        : (lang === 'tr' ? 'Ana salonu göster' : lang === 'el' ? 'Εμφάνιση κύριας αίθουσας' : 'Show the main hall')}
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
                    </h1>
                    <p className="hp-hero__tagline">
                        {lang === 'tr' ? 'Tarihi yeniden tanıyın.' : lang === 'el' ? 'Ανακαλύψτε ξανά την ιστορία.' : 'Rediscover history.'}
                    </p>
                    <p className="hp-hero__subtitle">
                        {cms.get('hero_subtitle', lang,
                            lang === 'tr'
                                ? 'Galata\'nın kalbinde 19. yüzyıldan kalma bir simge yapı, şimdi çağdaş sanat ve kültür evi.'
                                : lang === 'el'
                                    ? 'Ένα ορόσημο του 19ου αιώνα στην καρδιά του Γαλατά, τώρα σπίτι σύγχρονης τέχνης και πολιτισμού.'
                                    : 'A 19th-century landmark in the heart of Galata, now a home for contemporary art and culture.'
                        ).replace(/^(Tarihi yeniden tanıyın\.|Rediscover history\.|Ανακαλύψτε ξανά την ιστορία\.)\s*/i, '')}
                    </p>
                    <div className="hp-hero__ctas">
                        <Link to={localizePath('/arsiv')} className="hp-hero__cta hp-hero__cta--primary">
                            {lang === 'tr' ? 'Arşivi Keşfedin' : lang === 'el' ? 'Εξερευνήστε το Αρχείο' : 'Explore the Archive'}
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
                                            ? 'Το Ελληνικό Σχολείο Γαλατά είναι ένα από τα σημαντικότερα εκπαιδευτικά ιδρύματα.'
                                            : 'The Galata Greek School is one of the most important educational institutions established by the Greek community during the modernization process of the Ottoman Empire.'
                                )}
                            </p>
                            <p>
                                {cms.get('history_p2', lang,
                                    lang === 'tr'
                                        ? '2 Haziran 1910 tarihinde açılan okul, mimar Patroklos Kambanakis ve Stavros Hristidis tarafından inşa edilmiştir.'
                                        : lang === 'el'
                                            ? 'Το σχολείο άνοιξε στις 2 Ιουνίου 1910.'
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
                                ? 'Στην καρδιά της Κωνσταντινούπολης με τη νεοκλασική αρχιτεκτονική της εποχής.'
                                : 'Neoclassical architecture in the heart of Istanbul.'}
                    </h2>
                    <p className="hp-split__body">
                        {lang === 'tr'
                            ? 'Okul binası 2012 yılında sahiplerine, İstanbul Rum cemaatine iade edilmiştir. Bu tarihten itibaren şehrin kültür ve sanat hayatına kapılarını açarak birçok önemli etkinliğe ev sahipliği yapmaktadır.'
                            : lang === 'el'
                                ? 'Το κτίριο του σχολείου επιστράφηκε στους ιδιοκτήτες του, την ελληνική κοινότητα της Κωνσταντινούπολης, το 2012. Από τότε, έχει ανοίξει τις πόρτες του στην πολιτιστική και καλλιτεχνική ζωή της πόλης, φιλοξενώντας πολλές σημαντικές εκδηλώσεις.'
                                : 'The school building was returned to its owners, the Istanbul Greek community, in 2012. Since then, it has opened its doors to the city\'s culture and arts life, hosting many important events.'}
                    </p>
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
                        {latestEvents.map((evt, idx) => (
                            <motion.div
                                key={evt.id}
                                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link to={localizePath(`/gecmis-etkinlikler/${evt.slug || evt.id}`)} className="hp-event-card">
                                    <div className="hp-event-card__image-wrap">
                                        <img
                                            src={evt.cover_image_url || '/placeholder.png'}
                                            alt={decodeHtmlEntities(evt[`title_${l}`] || evt.title_en)}
                                            className="hp-event-card__img"
                                            loading="lazy"
                                            width="400"
                                            height="300"
                                        />
                                        <div className="hp-event-card__overlay" aria-hidden="true" />
                                        <span className={`hp-event-card__badge hp-event-card__badge${badgeColors[idx % badgeColors.length]}`}>
                                            {evt[`type_${l}`] || evt.type_en || ''}
                                        </span>
                                    </div>
                                    <h3 className="hp-event-card__title">
                                        {decodeHtmlEntities(evt[`title_${l}`] || evt.title_en)}
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
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
