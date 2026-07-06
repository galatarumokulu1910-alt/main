import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { useCmsContent } from '../../hooks/useCmsContent';
import SEO from '../../components/SEO/SEO';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import heroWideImage from '../../assets/Untitled (2560 x 1440 px).png';
import tarihce3Img from '../../assets/images/tarihce3.webp';
import './HomePage.css';

export default function HomePage() {
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';
    const cms = useCmsContent('home');

    const [latestEvents, setLatestEvents] = useState<any[]>([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Slow down the video to ~40% speed for a cinematic feel
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const apply = () => { v.playbackRate = 0.4; };
        apply();
        v.addEventListener('play', apply);
        return () => v.removeEventListener('play', apply);
    }, []);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (isPlaying) {
            v.pause();
        } else {
            v.play();
        }
        setIsPlaying(!isPlaying);
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
                            "name": "Galata Rum Okulu",
                            "alternateName": "Galata Greek School",
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
                            "name": "Galata Greek School",
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
            {/* ══════ HERO — "The Modern Past" (Video Background) ══════ */}
            <header className="hp-hero">
                {/* Cinematic video background — 40% playback rate, looping, silent */}
                {/* Falls back to heroWideImage poster while video loads */}
                <video
                    ref={videoRef}
                    className="hp-hero__bg hp-hero__bg--video"
                    src="/videos/hero_background.mp4"
                    poster={heroWideImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    onError={(e) => {
                        // If video fails, show the wide image as background
                        const v = e.currentTarget;
                        v.style.display = 'none';
                        const img = document.createElement('img');
                        img.src = heroWideImage;
                        img.className = 'hp-hero__bg hp-hero__bg--wide';
                        img.setAttribute('aria-hidden', 'true');
                        v.parentElement?.insertBefore(img, v);
                    }}
                />

                {/* Dark gradient overlay */}
                <div className="hp-hero__overlay" aria-hidden="true" />

                {/* Play/Pause Control for autoplay video */}
                <button
                    onClick={togglePlay}
                    className="hp-hero__video-control"
                    aria-label={isPlaying ? (lang === 'tr' ? 'Videoyu Duraklat' : lang === 'el' ? 'Παύση Βίντεο' : 'Pause Video') : (lang === 'tr' ? 'Videoyu Oynat' : lang === 'el' ? 'Αναπαραγωγή Βίντεο' : 'Play Video')}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Content layer — z-index: 1 */}
                <div className="hp-hero__content">
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
                        )}
                    </p>
                    <div className="hp-hero__ctas">
                        <Link to={localizePath('/mekan-kiralama')} className="hp-hero__cta hp-hero__cta--primary">
                            {cms.get('cta_primary', lang,
                                lang === 'tr' ? 'Etkinliğinizi Tarihte Düzenleyin' : lang === 'el' ? 'Διοργανώστε την Εκδήλωσή σας στην Ιστορία' : 'Host Your Event in History'
                            )}
                        </Link>
                        <Link to={localizePath('/tarihce')} className="hp-hero__cta hp-hero__cta--secondary">
                            {cms.get('cta_secondary', lang,
                                lang === 'tr' ? 'Hikayemizi Keşfedin' : lang === 'el' ? 'Ανακαλύψτε την Ιστορία μας' : 'Discover Our Story'
                            )}
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator — z-index: 1 */}
                <div className="hp-hero__scroll">
                    <span className="hp-hero__scroll-text">Scroll</span>
                    <span className="hp-hero__scroll-icon">&#x25BE;</span>
                </div>
            </header>

            {/* ══════ TARIHCE — History Section ══════ */}
            <section className="hp-history">
                <div className="hp-history__inner">
                    <div className="hp-history__text">
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
                    </div>
                    <div className="hp-history__gallery">
                        <div className="hp-history__gallery-col hp-history__gallery-col--offset">
                            <img src="/images/homepage/detail-1.webp" alt="Galata Greek School Historic Neoclassical Architectural Details" className="hp-history__photo hp-history__photo--sm" loading="lazy" width="400" height="300" />
                            <img src="/images/homepage/detail-2.webp" alt="Galata Greek School Grand Historical Staircase Detail" className="hp-history__photo hp-history__photo--lg" loading="lazy" width="400" height="500" />
                        </div>
                        <div className="hp-history__gallery-col">
                            <img src="/images/homepage/detail-3.webp" alt="Galata Greek School Heritage Event Space Interior" className="hp-history__photo hp-history__photo--lg" loading="lazy" width="400" height="500" />
                            <img src="/images/homepage/detail-4.webp" alt="Galata Greek School Heritage Exhibition Venue Floor Detail" className="hp-history__photo hp-history__photo--sm" loading="lazy" width="400" height="300" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ SPLIT SECTION — Architecture Statement ══════ */}
            <section className="hp-split">
                <div className="hp-split__image">
                    <img src={tarihce3Img} alt="Galata Greek School Historic Exhibition Venue Interior Space" loading="lazy" width="800" height="600" />
                </div>
                <div className="hp-split__text">
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
                </div>
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
                                {lang === 'tr' ? 'Gelecek sergiler ve kültürel buluşmalar' : lang === 'el' ? 'Επερχόμενες εκθέσεις και πολιτιστικές συναντήσεις' : 'Upcoming exhibitions and cultural gatherings'}
                            </p>
                        </div>
                        <Link to={localizePath('/gecmis-etkinlikler')} className="hp-events__view-all">
                            {lang === 'tr' ? 'Tümünü Gör' : lang === 'el' ? 'Προβολή Όλων' : 'View All'}
                        </Link>
                    </div>
                    <div className="hp-events__grid">
                        {latestEvents.map((evt, idx) => (
                            <Link key={evt.id} to={localizePath(`/gecmis-etkinlikler/${evt.slug || evt.id}`)} className="hp-event-card">
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
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
