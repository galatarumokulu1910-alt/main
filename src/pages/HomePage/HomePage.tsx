import { useState, useEffect } from 'react';
import { useScrollReveal, useStaggerReveal } from '../../hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useCmsContent } from '../../hooks/useCmsContent';
import SEO from '../../components/SEO/SEO';
import { supabase } from '../../services/supabaseClient';
import { decodeHtmlEntities } from '../../utils/decodeHtml';
import HeroModel from '../../components/HeroModel/HeroModel';
import SplitSectionModel from '../../components/HeroModel/SplitSectionModel';
import galataLogo from '../../assets/galata-rum-okulu_logo.svg';
import './HomePage.css';

const timelineEvents = [
    { year: '1885', title: 'Kuruluş', desc: 'Galata Rum Okulu kuruldu.' },
    { year: '1893', title: 'Yeni Bina', desc: 'Okul, neoklasik mimarisiyle öne çıkan yeni binasına taşınmıştır. Bina, dönemin en modern eğitim kurumlarından biri olarak tasarlanmıştır.' },
    { year: '1910', title: 'Resmi Açılış', desc: '2 Haziran 1910 Çarşamba günü saat 11:00\'de resmi açılış gerçekleştirildi. Mimarlar: Patroklos Kambanakis ve Stavros Hristidis.' },
    { year: '1923', title: 'Cumhuriyet Dönemi', desc: 'Türkiye Cumhuriyeti\'nin kuruluşuyla birlikte okul, yeni eğitim düzenlemelerine uyum sağlamıştır.' },
    { year: '1954', title: 'Anaokulu Açılışı', desc: 'Adreas Iliadis tarafından Anaokulu kuruldu' },
    { year: '1955', title: '6-7 Eylül Olayları', desc: '6-7 Eylül olayları sırasında okul büyük hasar görmüş, ancak topluluk tarafından yeniden onarılmıştır.' },
    { year: '1958', title: 'Cephe Düzenlemesi', desc: 'Ana cadde genişletilmesi sırasında binanın cephe kot seviyesi düzenlendi.' },
    { year: '1971', title: 'Eğitimin Durması', desc: 'Azalan Rum nüfusu nedeniyle okulda eğitim faaliyetleri askıya alınmıştır.' },
    { year: '1988', title: 'Eğitim Faaliyetlerinin Askıya Alınması', desc: 'Demografik değişimler nedeniyle eğitim faaliyetleri askıya alındı.' },
    { year: '2000', title: 'Yalnız Anaokulu Dönemi ile yeniden açılış', desc: '2000-2007 yılları arasında bina anaokulu olarak hizmet verdi.' },
    { year: '2000', title: 'Restorasyon Projesi', desc: 'Binanın tarihi dokusunu korumak amacıyla kapsamlı bir restorasyon projesi başlatılmıştır.' },
    { year: '2012', title: 'İade', desc: 'Bina İstanbul Rum Cemaati\'ne iade edildi.' },
    { year: '2015', title: 'Okul İşlevinin Sona Ermesi', desc: 'Bina resmi olarak okul işlevi görmeyi bıraktı.' },
    { year: '2015', title: 'Kültür Merkezi', desc: 'Restorasyon tamamlandıktan sonra bina, sergi, konser ve kültürel etkinliklere ev sahipliği yapan bir kültür merkezine dönüştürülmüştür.' },
    { year: '2019', title: 'Restorasyon Başlangıcı', desc: 'Kültür ve eğitim merkezi olarak dönüştürmek için büyük restorasyon projesi başlatıldı. Murat Tabanlıoğlu (Tabanlıoğlu Mimarlık) öncülüğünde gerçekleştirildi.' },
    { year: '2024', title: 'AMMF İşbirliği', desc: 'Galata Rum Okulu, Ana Mera Mou Filotimo (AMMF) Vakfı ile işbirliği yaparak kültürel miras koruma çalışmalarını güçlendirmiştir.' }
];

export default function HomePage() {
    const { lang, localizePath } = useI18n();
    const l = lang || 'en';
    const cms = useCmsContent('home');

    const [latestEvents, setLatestEvents] = useState<any[]>([]);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
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

    // Scroll reveal hooks for each section (once: false lets animations replay on scroll back)
    const heroReveal = useScrollReveal<HTMLElement>({ threshold: 0.1, once: false });
    const historyReveal = useScrollReveal<HTMLElement>({ threshold: 0.12, once: false });
    const historyGalleryReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.1, rootMargin: '0px 0px -80px 0px', once: false });
    const splitImageReveal2 = useScrollReveal<HTMLDivElement>({ threshold: 0.15, once: false });
    const splitTextReveal2 = useScrollReveal<HTMLDivElement>({ threshold: 0.2, once: false });
    
    // Events
    const eventsHeaderReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.15, once: false });
    const { containerRef: eventsGridRef, visibleItems: visibleEventCards } = useStaggerReveal<HTMLDivElement>(
        latestEvents.length,
        { threshold: 0.1, staggerDelay: 200, once: false }
    );

    // Archive Showcase
    const archiveHeaderReveal = useScrollReveal<HTMLDivElement>({ threshold: 0.15, once: false });

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchLatest = async () => {
            const { data } = await supabase
                .from('past_events')
                .select('*')
                .order('event_date', { ascending: false })
                .limit(4);
            if (data) setLatestEvents(data);
        };
        fetchLatest();
    }, []);

    const badgeColors = ['--gold', '--clay', '--gold', '--clay'];
    const showHeroContent = heroReveal.isVisible && !preloaderActive;

    return (
        <div className="home-page">
            {/* ══════ PRELOADER ══════ */}
            <div className={`hp-preloader ${preloaderActive ? '' : 'hp-preloader--hidden'}`}>
                {/* Background Blobs */}
                <div className="hp-preloader__decor" aria-hidden="true">
                    <svg className="hp-preloader__decor-blob hp-preloader__decor-blob--1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M44.7,-76.4C56.6,-69.1,64,-53.4,70.9,-38.1C77.8,-22.8,84.1,-7.8,84.2,7.3C84.3,22.4,78.2,37.6,69.5,50.7C60.8,63.7,49.4,74.7,35.6,80.1C21.7,85.6,5.3,85.5,-10.8,82.4C-26.9,79.3,-42.7,73.2,-55.7,63.7C-68.7,54.2,-79,41.2,-83.4,26.5C-87.8,11.8,-86.3,-4.7,-81.9,-20.3C-77.5,-35.9,-70.2,-50.6,-58.7,-58.2C-47.2,-65.8,-31.5,-66.3,-17.5,-71.4C-3.5,-76.5,8.7,-86.3,24.3,-87.3C39.9,-88.3,46.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                    <svg className="hp-preloader__decor-blob hp-preloader__decor-blob--2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M38.6,-66.2C48.7,-59,54.6,-45,61,-31.3C67.3,-17.7,74.1,-4.3,73.5,8.9C72.8,22.1,64.7,35.1,54.8,45.4C44.9,55.7,33.1,63.3,20.1,67.7C7.1,72,-7.1,73.2,-20.7,69.9C-34.3,66.6,-47.4,58.8,-57.1,47.9C-66.8,37.1,-73.2,23.3,-75.4,8.8C-77.6,-5.7,-75.6,-20.8,-69.1,-33.9C-62.6,-47,-51.7,-58.1,-38.9,-63.9C-26.2,-69.7,-11.6,-70.2,2.3,-73.9C16.2,-77.6,28.5,-73.5,38.6,-66.2Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="hp-preloader__center">
                    <img src={galataLogo} alt="Galata Rum Okulu Logo" className="hp-preloader__logo" />
                    <h2 className="hp-preloader__title">Galata Rum Okulu</h2>
                </div>

                <div className="hp-preloader__watermark">
                    <span>1</span>
                    <span>8</span>
                    <span>8</span>
                    <span>5</span>
                </div>
            </div>

            {/* Full-page photo preview overlay */}
            <div
                className={`hp-photo-overlay ${previewSrc ? 'hp-photo-overlay--active' : ''}`}
                onClick={() => setPreviewSrc(null)}
            >
                {previewSrc && (
                    <div className="hp-photo-overlay__content" onClick={(e) => e.stopPropagation()}>
                        <button className="hp-photo-overlay__close" onClick={() => setPreviewSrc(null)}>
                            &times;
                        </button>
                        <img src={previewSrc} alt="" className="hp-photo-overlay__img" />
                    </div>
                )}
            </div>
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
            <header
                className="hp-hero"
                ref={heroReveal.ref}
                style={{
                    filter: scrollY > 300
                        ? `blur(${Math.min((scrollY - 300) / 100, 6)}px)`
                        : 'none'
                }}
            >
                {/* Hero 3D Model Background */}
                <div className="hp-hero__3d-container">
                    <HeroModel start={!preloaderActive} />
                    <div className="hp-hero__watermark">
                        <span className={scrollY > 40 ? 'hp-gold' : ''}>1</span>
                        <span className={scrollY > 100 ? 'hp-gold' : ''}>8</span>
                        <span className={scrollY > 160 ? 'hp-gold' : ''}>8</span>
                        <span className={scrollY > 220 ? 'hp-gold' : ''}>5</span>
                    </div>
                </div>

                {/* Decorative floating elements — Abstract Blobs */}
                <div className="hp-hero__decor" aria-hidden="true">
                    {/* Abstract Blob 1 */}
                    <svg className="hp-hero__decor-blob hp-hero__decor-blob--1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M44.7,-76.4C56.6,-69.1,64,-53.4,70.9,-38.1C77.8,-22.8,84.1,-7.8,84.2,7.3C84.3,22.4,78.2,37.6,69.5,50.7C60.8,63.7,49.4,74.7,35.6,80.1C21.7,85.6,5.3,85.5,-10.8,82.4C-26.9,79.3,-42.7,73.2,-55.7,63.7C-68.7,54.2,-79,41.2,-83.4,26.5C-87.8,11.8,-86.3,-4.7,-81.9,-20.3C-77.5,-35.9,-70.2,-50.6,-58.7,-58.2C-47.2,-65.8,-31.5,-66.3,-17.5,-71.4C-3.5,-76.5,8.7,-86.3,24.3,-87.3C39.9,-88.3,46.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>

                    {/* Abstract Blob 2 */}
                    <svg className="hp-hero__decor-blob hp-hero__decor-blob--2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M38.6,-66.2C48.7,-59,54.6,-45,61,-31.3C67.3,-17.7,74.1,-4.3,73.5,8.9C72.8,22.1,64.7,35.1,54.8,45.4C44.9,55.7,33.1,63.3,20.1,67.7C7.1,72,-7.1,73.2,-20.7,69.9C-34.3,66.6,-47.4,58.8,-57.1,47.9C-66.8,37.1,-73.2,23.3,-75.4,8.8C-77.6,-5.7,-75.6,-20.8,-69.1,-33.9C-62.6,-47,-51.7,-58.1,-38.9,-63.9C-26.2,-69.7,-11.6,-70.2,2.3,-73.9C16.2,-77.6,28.5,-73.5,38.6,-66.2Z" transform="translate(100 100)" />
                    </svg>

                    {/* Abstract Blob 3 */}
                    <svg className="hp-hero__decor-blob hp-hero__decor-blob--3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M40.1,-68.8C52,-60.7,61.8,-49.2,68.9,-36C76,-22.8,80.4,-7.8,79.5,6.8C78.5,21.5,72.2,35.9,63.1,47.7C54.1,59.5,42.4,68.8,29.1,73.7C15.8,78.5,0.8,78.9,-13.6,76C-28.1,73.2,-42.1,67,-53.4,57.3C-64.8,47.7,-73.6,34.6,-77.3,20C-81,5.4,-79.6,-10.7,-74,-24.8C-68.5,-38.9,-58.8,-51.1,-46.5,-59C-34.1,-66.9,-19.1,-70.6,-3.9,-64.5C11.3,-58.4,28.2,-76.9,40.1,-68.8Z" transform="translate(100 100)" />
                    </svg>
                </div>

                {/* Dark gradient overlay */}
                <div className="hp-hero__overlay" aria-hidden="true" />

                {/* Content layer — z-index: 1 */}
                <div className={`hp-hero__content ${showHeroContent ? 'hp-hero__content--loaded' : ''}`}>
                    <p className="hp-hero__tagline hp-anim-hero-item" style={{ transitionDelay: '0ms' }}>
                        {lang === 'tr' ? 'Tarihi yeniden tanıyın.' : lang === 'el' ? 'Ανακαλύψτε ξανά την ιστορία.' : 'Rediscover history.'}
                    </p>
                    <h1 className="hp-hero__headline hp-anim-hero-item" style={{ transitionDelay: '250ms' }}>
                        {lang === 'tr' ? 'Modern Geçmiş' : 'The Modern Past'}
                    </h1>
                    <p className="hp-hero__subtitle hp-anim-hero-item" style={{ transitionDelay: '500ms' }}>
                        {cms.get('hero_subtitle', lang,
                            lang === 'tr'
                                ? 'Galata\'nın kalbinde 19. yüzyıldan kalma bir simge yapı, şimdi çağdaş sanat ve kültür evi.'
                                : lang === 'el'
                                    ? 'Ένα ορόσημο του 19ου αιώνα στην καρδιά του Γαλατά, τώρα σπίτι σύγχρονης τέχνης και πολιτισμού.'
                                    : 'A 19th-century landmark in the heart of Galata, now a home for contemporary art and culture.'
                        )}
                    </p>
                    <div className="hp-hero__ctas hp-anim-hero-item" style={{ transitionDelay: '750ms' }}>
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

                {/* Scroll indicator — bottom left */}
                <div className={`hp-hero__scroll ${showHeroContent ? 'hp-hero__scroll--visible' : ''}`}>
                    <span className="hp-hero__scroll-text">{lang === 'tr' ? 'Kaydırın' : lang === 'el' ? 'Κύλιση' : 'Scroll'}</span>
                    <span className="hp-hero__scroll-icon">&#x25BE;</span>
                </div>
            </header>

            {/* ══════ TARIHCE — History Section ══════ */}
            <section className="hp-history" ref={historyReveal.ref}>
                <div className="hp-history__inner">

                    {/* Interactive Timeline Bar */}
                    <div className={`hp-history__timeline-wrapper ${historyReveal.isVisible ? 'hp-reveal--visible' : ''}`}>
                        <div className="hp-history__timeline-line"></div>
                        <div className="hp-history__timeline-events">
                            {timelineEvents.map((event, i) => (
                                <div className="hp-history__timeline-event" key={i}>
                                    <div className="hp-history__timeline-stem"></div>
                                    <div className="hp-history__timeline-dot"></div>
                                    <span className="hp-history__timeline-year">{event.year}</span>

                                    <div className="hp-history__timeline-tooltip">
                                        <div className="hp-history__timeline-tooltip-title">{event.title}</div>
                                        <div className="hp-history__timeline-tooltip-desc">{event.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hp-history__content-grid">
                        {/* Left Column - Text */}
                        <div className={`hp-history__text hp-reveal hp-reveal--left ${historyReveal.isVisible ? 'hp-reveal--visible' : ''}`}>
                            <svg viewBox="0 0 320 300" className="hp-history__bg-svg" preserveAspectRatio="none">
                                <polygon points="30,90 160,20 290,90" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="20" y1="90" x2="300" y2="90" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="45" y1="90" x2="45" y2="230" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="95" y1="90" x2="95" y2="230" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="145" y1="90" x2="145" y2="230" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="195" y1="90" x2="195" y2="230" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="245" y1="90" x2="245" y2="230" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="20" y1="230" x2="300" y2="230" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="10" y1="240" x2="310" y2="240" stroke="currentColor" strokeWidth="1.5" />
                            </svg>

                            <div className="hp-history__text-inner">
                                <span className="hp-history__subtitle hp-anim-history-item" style={{ transitionDelay: '100ms' }}>
                                    {lang === 'tr' ? 'TARİHÇE' : lang === 'el' ? 'ΙΣΤΟΡΙΑ' : 'HISTORY'}
                                </span>
                                <h2 className="hp-history__title hp-anim-history-item" style={{ transitionDelay: '250ms' }}>
                                    {lang === 'tr' ? 'Galata Rum Okulu' : lang === 'el' ? 'Ελληνικό Σχολείο' : 'Galata Greek School'}
                                </h2>
                                <p className="hp-anim-history-item" style={{ transitionDelay: '400ms' }}>
                                    {cms.get('history_p1', lang,
                                        lang === 'tr'
                                            ? 'Osmanlı İmparatorluğu\'nun modernleşme sürecinde Rum topluluğunun gerçekleştirdiği eğitim kurumları içindeki en önemli yerlerden biri. Okul, Eleni Zarifi\'nin destekleriyle, Galata Rum Cemaati tarafından bağışlanan arazi üzerinde inşa edilmiştir.'
                                            : lang === 'el'
                                                ? 'Το Ελληνικό Σχολείο Γαλατά είναι ένα από τα σημαντικότερα εκπαιδευτικά ιδρύματα. Χτίστηκε με την υποστήριξη της Ελένης Ζαρίφη.'
                                                : 'One of the most important educational institutions established by the Greek community during the modernization of the Ottoman Empire. Built with the support of Eleni Zarifi.'
                                    )}
                                </p>
                                <p className="hp-anim-history-item" style={{ transitionDelay: '550ms' }}>
                                    {cms.get('history_p2', lang,
                                        lang === 'tr'
                                            ? '2 Haziran 1910\'da açılan okul, mimar Patroklos Kambanakis ve Stavros Hristidis tarafından, danışmanlık mimarı Perikli Fotiadis katkısıyla dönemin neoklasik-eklektik üslubuyla inşa edilmiştir.'
                                            : lang === 'el'
                                                ? 'Το σχολείο άνοιξε στις 2 Ιουνίου 1910 και χτίστηκε από τους αρχιτέκτονες Πάτροκλο Καμπανάκη και Σταύρο Χρηστίδη.'
                                                : 'Opened on June 2, 1910, the school was built by architects Patroklos Kambanakis and Stavros Hristidis with a neoclassical-eclectic style.'
                                    )}
                                </p>
                                <Link to={localizePath('/tarihce')} className="hp-history__link hp-anim-history-item" style={{ transitionDelay: '700ms' }}>
                                    {lang === 'tr' ? 'DAHA FAZLA OKU' : lang === 'el' ? 'ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ' : 'READ MORE'} <span className="hp-history__link-arrow">&rarr;</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - Original Gallery */}
                        <div className={`hp-history__gallery hp-reveal hp-reveal--right ${historyGalleryReveal.isVisible ? 'hp-reveal--visible' : ''}`} ref={historyGalleryReveal.ref}>
                            <div className="hp-history__gallery-col hp-history__gallery-col--offset">
                                <div className="hp-history__photo-wrapper" onClick={() => setPreviewSrc('/images/homepage/detail-1.webp')}>
                                    <img src="/images/homepage/detail-1.webp" alt="Galata Greek School Historic Neoclassical Architectural Details" className="hp-history__photo hp-history__photo--sm" loading="lazy" width="400" height="300" />
                                </div>
                                <div className="hp-history__photo-wrapper" onClick={() => setPreviewSrc('/images/homepage/detail-2.webp?v=2')}>
                                    <img src="/images/homepage/detail-2.webp?v=2" alt="Galata Greek School Grand Historical Staircase Detail" className="hp-history__photo hp-history__photo--lg" loading="lazy" width="400" height="500" />
                                </div>
                            </div>
                            <div className="hp-history__gallery-col">
                                <div className="hp-history__photo-wrapper" onClick={() => setPreviewSrc('/images/homepage/detail-3.webp')}>
                                    <img src="/images/homepage/detail-3.webp" alt="Galata Greek School Heritage Event Space Interior" className="hp-history__photo hp-history__photo--lg" loading="lazy" width="400" height="500" />
                                </div>
                                <div className="hp-history__photo-wrapper" onClick={() => setPreviewSrc('/images/homepage/detail-4.webp')}>
                                    <img src="/images/homepage/detail-4.webp" alt="Galata Greek School Heritage Exhibition Venue Floor Detail" className="hp-history__photo hp-history__photo--sm" loading="lazy" width="400" height="300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ══════ SPLIT SECTION 2 (Duplicated) ══════ */}
            <section className="hp-split">
                <div className={`hp-split__model hp-reveal hp-reveal--left ${splitImageReveal2.isVisible ? 'hp-reveal--visible' : ''}`} ref={splitImageReveal2.ref}>
                    <SplitSectionModel isVisible={splitImageReveal2.isVisible} />
                </div>
                <div className={`hp-split__text hp-reveal hp-reveal--right ${splitTextReveal2.isVisible ? 'hp-reveal--visible' : ''}`} ref={splitTextReveal2.ref}>
                    <div className="hp-split__divider hp-anim-split-item" style={{ transitionDelay: '100ms' }} />
                    <h2 className="hp-split__headline hp-anim-split-item" style={{ transitionDelay: '250ms' }}>
                        {lang === 'tr'
                            ? 'Dönemin neoklasik mimarisiyle İstanbul\'un kalbinde.'
                            : lang === 'el'
                                ? 'Στην καρδιά της Κωνσταντινούπολης με τη νεοκλασική αρχιτεκτονική της εποχής.'
                                : 'Neoclassical architecture in the heart of Istanbul.'}
                    </h2>
                    <p className="hp-split__body hp-anim-split-item" style={{ transitionDelay: '400ms' }}>
                        {lang === 'tr'
                            ? 'Okul binası 2012 yılında sahiplerine, İstanbul Rum cemaatine iade edilmiştir. Bu tarihten itibaren şehrin kültür ve sanat hayatına kapılarını açarak birçok önemli etkinliğe ev sahipliği yapmaktadır.'
                            : lang === 'el'
                                ? 'Το κτίριο του σχολείου επιστράφηκε στους ιδιοκτήτες του, την ελληνική κοινότητα της Κωνσταντινούπολης, το 2012. Από τότε, έχει ανοίξει τις πόρτες του στην πολιτιστική και καλλιτεχνική ζωή της πόλης, φιλοξενώντας πολλές σημαντικές εκδηλώσεις.'
                                : 'The school building was returned to its owners, the Istanbul Greek community, in 2012. Since then, it has opened its doors to the city\'s culture and arts life, hosting many important events.'}
                    </p>
                    <div className="hp-split__watermark">
                        <span>2</span>
                        <span>0</span>
                        <span>2</span>
                        <span>6</span>
                    </div>
                </div>
            </section>

            {/* ══════ ARSIV SPOTLIGHT — Archive Showcase Section ══════ */}
            <section className={`hp-archive hp-reveal ${archiveHeaderReveal.isVisible ? 'hp-reveal--visible' : ''}`} ref={archiveHeaderReveal.ref}>
                <div className="hp-archive__inner">
                    <div className="hp-archive__container">
                        {/* Left Column */}
                        <div className="hp-archive__left">
                            <div>
                                <span className="hp-archive__block-badge hp-anim-archive-item" style={{ transitionDelay: '100ms' }}>
                                    {lang === 'tr' ? 'Bellek & Tarih' : lang === 'el' ? 'Μνήμη & Ιστορία' : 'Memory & History'}
                                </span>
                                <h2 className="hp-archive__title hp-anim-archive-item" style={{ transitionDelay: '250ms' }}>
                                    {lang === 'tr' ? 'Okul Arşivi' : lang === 'el' ? 'Αρχείο Σχολείου' : 'School Archive'}
                                </h2>
                                <p className="hp-archive__subtitle hp-anim-archive-item" style={{ transitionDelay: '400ms' }}>
                                    {lang === 'tr'
                                        ? 'Okulumuzun zengin geçmişine ışık tutan tarihi belgeler ve nadir objeler.'
                                        : lang === 'el'
                                            ? 'Ιστορικά έγγραφα ve σπάνια αντικείμενα που φωτίζουν το πλούσιο παρελθόν του σχολείου μας.'
                                            : 'Historical documents and rare objects shedding light on our school\'s rich past.'}
                                </p>
                            </div>
                            <Link to={localizePath('/arsiv')} className="hp-archive__explore-link hp-anim-archive-item" style={{ transitionDelay: '550ms' }}>
                                {lang === 'tr' ? 'ARŞİVİ KEŞFET' : lang === 'el' ? 'ΕΞΕΡΕΥΝΗΣΤΕ ΤΟ ΑΡΧΕΙΟ' : 'EXPLORE ARCHIVE'}
                            </Link>
                        </div>

                        {/* Right Column */}
                        <div className="hp-archive__right">
                            {/* Block 1: Galata Rum Okulu */}
                            <div className="hp-archive__block">
                                <span className="hp-archive__block-badge hp-anim-archive-item" style={{ transitionDelay: '150ms' }}>
                                    {lang === 'tr' ? 'Tarihi Koleksiyon' : lang === 'el' ? 'Ιστορική Συλλογή' : 'Historical Collection'}
                                </span>
                                <h3 className="hp-archive__block-title hp-anim-archive-item" style={{ transitionDelay: '300ms' }}>
                                    {lang === 'tr' ? 'Galata Rum Okulu' : lang === 'el' ? 'Ελληνικό Σχολείο Γαλατά' : 'Galata Greek School'}
                                </h3>
                                <p className="hp-archive__block-desc hp-anim-archive-item" style={{ transitionDelay: '450ms' }}>
                                    {lang === 'tr'
                                        ? 'Yüzyıllık akademik mirası izleyen tarihî belgeler, idari kayıtlar ve fiziksel eserlerden oluşan küratörlüğünde bir arşiv.'
                                        : lang === 'el'
                                            ? 'Ένα επιμελημένο αρχείο από ιστορικά έγγραφα, διοικητικά αρχεία και φυσικά αντικείμενα που ανιχνεύουν έναν αιώνα ακαδημαϊκής κληρονομιάς.'
                                            : 'A curated archive of historical documents, administrative records, and physical artifacts tracing a century of academic legacy.'}
                                </p>
                                <div className="hp-archive__block-buttons hp-anim-archive-item" style={{ transitionDelay: '600ms' }}>
                                    <Link to={localizePath('/arsiv/koleksiyon')} state={{ tab: 0 }} className="hp-archive__btn hp-archive__btn--solid">
                                        {lang === 'tr' ? 'BELGELER' : lang === 'el' ? 'ΕΓΓΡΑΦΑ' : 'DOCUMENTS'}
                                    </Link>
                                    <Link to={localizePath('/arsiv/koleksiyon')} state={{ tab: 1 }} className="hp-archive__btn hp-archive__btn--outline">
                                        {lang === 'tr' ? 'OBJELER' : lang === 'el' ? 'ΑΝΤΙΚΕΙΜΕΝΑ' : 'OBJECTS'}
                                    </Link>
                                </div>
                            </div>

                            {/* Block 2: İstanbul Rum Okul ve Cemaatler */}
                            <div className="hp-archive__block">
                                <span className="hp-archive__block-badge hp-anim-archive-item" style={{ transitionDelay: '250ms' }}>
                                    {lang === 'tr' ? 'Toplumsal Bellek' : lang === 'el' ? 'Κοινωνική Μνήμη' : 'Social Memory'}
                                </span>
                                <h3 className="hp-archive__block-title hp-anim-archive-item" style={{ transitionDelay: '400ms' }}>
                                    {lang === 'tr' ? 'İstanbul Rum Okul ve Cemaatler' : lang === 'el' ? 'Ελληνικά Σχολεία & Κοινότητες' : 'Istanbul Greek Schools & Communities'}
                                </h3>
                                <p className="hp-archive__block-desc hp-anim-archive-item" style={{ transitionDelay: '550ms' }}>
                                    {lang === 'tr'
                                        ? 'İstanbul Rum toplumunun tarihî belgeleri, fotoğrafları ve kültürel mirasını koruyan kapsamlı bir dijital arşiv.'
                                        : lang === 'el'
                                            ? 'Ένα ολοκληρωμένο ψηφιακό αρχείο που διασώζει ιστορικά έγγραφα, φωτογραφίες και την πολιτιστική κληρονομιά της ελληνικής κοινότητας της Κωνσταντινούπολης.'
                                            : 'A comprehensive digital archive preserving historical documents, photographs, and cultural heritage of the Istanbul Greek community.'}
                                </p>
                                <div className="hp-archive__block-buttons hp-anim-archive-item" style={{ transitionDelay: '700ms' }}>
                                    <Link to={localizePath('/arsiv/istanbul-rum')} state={{ tab: 1 }} className="hp-archive__btn hp-archive__btn--solid">
                                        {lang === 'tr' ? 'BELGELER' : lang === 'el' ? 'ΕΓΓΡΑΦΑ' : 'DOCUMENTS'}
                                    </Link>
                                    <Link to={localizePath('/arsiv/istanbul-rum')} state={{ tab: 0 }} className="hp-archive__btn hp-archive__btn--outline">
                                        {lang === 'tr' ? 'FOTOĞRAFLAR' : lang === 'el' ? 'ΦΩΤΟΓΡΑΦΙΕΣ' : 'PHOTOGRAPHS'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════ ETKINLIKLER — Events Section ══════ */}
            <section className="hp-events">
                <div className="hp-events__inner">
                    <div className={`hp-events__header hp-reveal hp-reveal--up ${eventsHeaderReveal.isVisible ? 'hp-reveal--visible' : ''}`} ref={eventsHeaderReveal.ref}>
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
                    <div className="hp-events__grid" ref={eventsGridRef}>
                        {latestEvents.map((evt, idx) => (
                            <Link
                                key={evt.id}
                                to={localizePath(`/gecmis-etkinlikler/${evt.slug || evt.id}`)}
                                className={`hp-event-card hp-reveal hp-reveal--up ${visibleEventCards.has(idx) ? 'hp-reveal--visible' : ''}`}
                            >
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
