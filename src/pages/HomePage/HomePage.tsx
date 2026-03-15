import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useCmsContent } from '../../hooks/useCmsContent';
import SEO from '../../components/SEO/SEO';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import heroImage from '../../assets/galata_hero.webp';
import tarihce3Img from '../../assets/images/tarihce3.webp';
import './HomePage.css';

export default function HomePage() {
    const { lang } = useI18n();
    const l = lang || 'en';
    const cms = useCmsContent('home');

    const [latestEvents, setLatestEvents] = useState<any[]>([]);

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
                    "@type": "Organization",
                    "url": "https://galatarumokulu.org.tr",
                    "name": "Galata Rum Okulu",
                    "alternateName": "Galata Greek School",
                    "description": "A historic 19th-century school building in Istanbul's Galata district, now serving as a cultural and event venue.",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Kemankeş Mah. Galata Mahkemesi Sok. No:20",
                        "addressLocality": "Istanbul",
                        "addressRegion": "Beyoğlu",
                        "postalCode": "34425",
                        "addressCountry": "TR"
                    },
                    "sameAs": [
                        "https://www.instagram.com/galatarumokulu/",
                        "https://tr.wikipedia.org/wiki/Galata_Rum_İlkokulu"
                    ]
                }}
            />
            {/* ══════ HERO — "The Modern Past" ══════ */}
            <header className="hp-hero">
                <div className="hp-hero__bg">
                    <img
                        src={heroImage}
                        alt="Galata Greek School facade"
                        className="hp-hero__img"
                    />
                    <div className="hp-hero__gradient" />
                </div>
                <div className="hp-hero__content">
                    <h1 className="hp-hero__headline">
                        The Modern <br /><span className="hp-hero__headline-accent">Past</span>
                    </h1>
                    <p className="hp-hero__subtitle">
                        {cms.get('hero_subtitle', lang,
                            lang === 'tr'
                                ? 'Tarihi yeniden tanıyın. Galata\'nın kalbinde 19. yüzyıldan kalma bir simge yapı, şimdi çağdaş sanat ve kültür evi.'
                                : lang === 'el'
                                    ? 'Ανακαλύψτε ξανά την ιστορία. Ένα ορόσημο του 19ου αιώνα στην καρδιά του Γαλατά, τώρα σπίτι σύγχρονης τέχνης και πολιτισμού.'
                                    : 'Rediscover history. A 19th-century landmark in the heart of Galata, now a home for contemporary art and culture.'
                        )}
                    </p>
                    <div className="hp-hero__ctas">
                        <Link to="/mekan-kiralama" className="hp-hero__cta hp-hero__cta--primary">
                            {cms.get('cta_primary', lang,
                                lang === 'tr' ? 'Etkinliğinizi Tarihte Düzenleyin' : lang === 'el' ? 'Διοργανώστε την Εκδήλωσή σας στην Ιστορία' : 'Host Your Event in History'
                            )}
                        </Link>
                        <Link to="/tarihce" className="hp-hero__cta hp-hero__cta--secondary">
                            {cms.get('cta_secondary', lang,
                                lang === 'tr' ? 'Hikayemizi Keşfedin' : lang === 'el' ? 'Ανακαλύψτε την Ιστορία μας' : 'Discover Our Story'
                            )}
                        </Link>
                    </div>
                </div>
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
                            <Link to="/tarihce" className="hp-history__link">
                                {lang === 'tr' ? 'DAHA FAZLA OKU' : lang === 'el' ? 'ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ' : 'READ MORE'}
                                <span className="hp-history__link-arrow">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    <div className="hp-history__gallery">
                        <div className="hp-history__gallery-col hp-history__gallery-col--offset">
                            <img src="/images/homepage/detail-1.webp" alt="Architectural Detail" className="hp-history__photo hp-history__photo--sm" />
                            <img src="/images/homepage/detail-2.webp" alt="Staircase Detail" className="hp-history__photo hp-history__photo--lg" />
                        </div>
                        <div className="hp-history__gallery-col">
                            <img src="/images/homepage/detail-3.webp" alt="Venue Interior" className="hp-history__photo hp-history__photo--lg" />
                            <img src="/images/homepage/detail-4.webp" alt="Floor Detail" className="hp-history__photo hp-history__photo--sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ SPLIT SECTION — Architecture Statement ══════ */}
            <section className="hp-split">
                <div className="hp-split__image">
                    <img src={tarihce3Img} alt="Interior space" />
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
                        <Link to="/gecmis-etkinlikler" className="hp-events__view-all">
                            {lang === 'tr' ? 'Tümünü Gör' : lang === 'el' ? 'Προβολή Όλων' : 'View All'}
                        </Link>
                    </div>
                    <div className="hp-events__grid">
                        {latestEvents.map((evt, idx) => (
                            <Link key={evt.id} to={`/gecmis-etkinlikler/${evt.slug || evt.id}`} className="hp-event-card">
                                <div className="hp-event-card__image-wrap">
                                    <img
                                        src={evt.cover_image_url || '/placeholder.png'}
                                        alt={decodeHtmlEntities(evt[`title_${l}`] || evt.title_en)}
                                        className="hp-event-card__img"
                                    />
                                    <div className="hp-event-card__overlay" />
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
