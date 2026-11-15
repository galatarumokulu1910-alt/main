import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { resolveArtifactThumbnail, filterVerifiedPublicArtifacts, getArchivalCreditNotice } from '../../data/artifactImageMap';
import { PRODUCTION_SITE_ORIGIN } from '../../config/venueInfo';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './IstanbulRumCollectionPage.css';

type Lang = 'tr' | 'en' | 'el';

/* ── Replace with the actual YouTube video ID ── */
const YOUTUBE_VIDEO_ID = 'BA0UTg9HaqM';

const i18n = {
    title: { tr: 'İstanbul Rumları', en: 'Istanbul Greeks', el: 'Έλληνες Κωνσταντινούπολης' },
    subtitle: {
        tr: 'Yaşayan Tarih: İstanbul Rum cemaatinin arşiv koleksiyonu, zengin bir kültürel mirasın özünü yakalıyor.',
        en: 'Living History: Archival collection of the Istanbul Rum community, capturing the essence of a vibrant cultural heritage.',
        el: 'Ζωντανή Ιστορία: Αρχειακή συλλογή της κοινότητας Ρωμιών της Κωνσταντινούπολης, αποτυπώνοντας την ουσία μιας ζωντανής πολιτιστικής κληρονομιάς.',
    },
    caption: {
        tr: '"Bu görüntüler, İstanbul Rum cemaatinin günlük yaşam objelerini orijinal bağlamlarıyla gözler önüne seriyor."',
        en: '"This footage showcases the daily items of the Istanbul Rum community in their original context."',
        el: '"Αυτό το υλικό παρουσιάζει τα καθημερινά αντικείμενα της κοινότητας Ρωμιών στο αρχικό τους πλαίσιο."',
    },
    loadMore: { tr: 'Daha Fazla Yükle', en: 'Load More', el: 'Φόρτωση Περισσότερων' },
};

const tabs = {
    tr: ['Fotoğraflar & Objeler', 'Belgeler & Haritalar'],
    en: ['Photographs & Objects', 'Documents & Maps'],
    el: ['Φωτογραφίες & Αντικείμενα', 'Έγγραφα & Χάρτες'],
};

const objSubTabs = {
    tr: ['Tümü', 'Cemaat Fotoğrafları', 'Tarihî Objeler'],
    en: ['All', 'Community Photos', 'Historical Objects'],
    el: ['Όλα', 'Φωτογραφίες Κοινότητας', 'Ιστορικά Αντικείμενα'],
};

const docSubTabs = {
    tr: ['Tümü', 'Belgeler'],
    en: ['All', 'Documents'],
    el: ['Όλα', 'Έγγραφα'],
};

const categoryLabels: Record<string, Record<string, string>> = {
    'Documents': { tr: 'Belge', en: 'Document', el: 'Έγγραφο' },
    'Community Photos': { tr: 'Cemaat Fotoğrafı', en: 'Community Photo', el: 'Φωτογραφία Κοινότητας' },
    'Historical Objects': { tr: 'Tarihî Obje', en: 'Historical Object', el: 'Ιστορικό Αντικείμενο' },
    'Documents & Maps': { tr: 'Belge & Haritalar', en: 'Documents & Maps', el: 'Έγγραφα & Χάρτες' },
    'Photographs & Objects': { tr: 'Fotoğraf & Objeler', en: 'Photographs & Objects', el: 'Φωτογραφίες & Αντικείμενα' },
};

export default function IstanbulRumCollectionPage() {
    const location = useLocation();
    const { lang, localizePath } = useI18n();
    const l = (lang as Lang) || 'en';
    const shouldReduceMotion = useReducedMotion();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 0);
    const [activeSubTab, setActiveSubTab] = useState(location.state?.subTab || 0);
    const [artifactsData, setArtifactsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtifacts = async () => {
            const { data } = await supabase.from('artifacts')
                .select(`
                    *,
                    category:archive_categories(name_en),
                    subcategory:archive_subcategories(name_en)
                `)
                .eq('status', 'published')
                .eq('archive_type', 'istanbul_rum');

            if (data) {
                const verified = filterVerifiedPublicArtifacts(data);
                const mapped = verified.map(item => ({
                    ...item,
                    category: item.category?.name_en || 'Documents & Maps',
                    subCategory: item.subcategory?.name_en || 'Community Photos',
                    imageSrc: resolveArtifactThumbnail(item),
                    date: item.provenance_tr || ''
                }));
                setArtifactsData(mapped);
            }
            setLoading(false);
        };
        fetchArtifacts();
    }, []);

    const currentTabs = tabs[l] || tabs.en;
    const currentSubTabs = activeTab === 0
        ? (objSubTabs[l] || objSubTabs.en)
        : (docSubTabs[l] || docSubTabs.en);

    const docSubCategoryKeys = ['Documents'];
    const objSubCategoryKeys = ['Community Photos', 'Historical Objects'];

    const allObjArtifacts = artifactsData.filter(a => a.category === 'Photographs & Objects');
    const allDocArtifacts = artifactsData.filter(a => a.category === 'Documents & Maps');

    const filteredArtifacts = activeTab === 0
        ? allObjArtifacts.filter(a => {
            if (activeSubTab === 0) return true;
            const subCat = objSubCategoryKeys[activeSubTab - 1];
            return a.subCategory === subCat;
        })
        : allDocArtifacts.filter(a => {
            if (activeSubTab === 0) return true;
            const subCat = docSubCategoryKeys[activeSubTab - 1];
            return a.subCategory === subCat;
        });

    const [visibleCount, setVisibleCount] = useState(10);
    const observerTarget = useRef<HTMLDivElement>(null);

    const [prevTabs, setPrevTabs] = useState({ activeTab, activeSubTab });
    if (activeTab !== prevTabs.activeTab || activeSubTab !== prevTabs.activeSubTab) {
        setPrevTabs({ activeTab, activeSubTab });
        setVisibleCount(10);
    }

    useEffect(() => {
        const observerTargetEl = observerTarget.current;
        if (!observerTargetEl) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setVisibleCount(prev => prev + 10);
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(observerTargetEl);

        return () => {
            if (observerTargetEl) observer.unobserve(observerTargetEl);
        };
    }, [filteredArtifacts]);

    const getTitle = (a: any) => {
        if (l === 'tr') return a.title_tr || a.title_en;
        if (l === 'el') return a.title_el || a.title_en;
        return a.title_en;
    };

    return (
        <div className="archive-rum">
            <SEO 
                overrideTitle={l === 'tr' ? 'İstanbul Rumları Koleksiyonu' : l === 'el' ? 'Συλλογή Ελλήνων Κωνσταντινούπολης' : 'Istanbul Greeks Collection'}
                overrideDescription={l === 'tr' ? 'İstanbul Rum toplumunun tarihine ışık tutan arşiv koleksiyonu. Fotoğraflar, belgeler, haritalar ve kültürel miras objeleri.' : l === 'el' ? 'Αρχειακή συλλογή που φωτίζει την ιστορία της ελληνικής κοινότητας της Κωνσταντινούπολης. Φωτογραφίες, έγγραφα, χάρτες και αντικείμενα πολιτιστικής κληρονομιάς.' : 'Archive collection illuminating the history of the Istanbul Greek community. Photographs, documents, maps, and cultural heritage objects.'}
                overrideKeywords={l === 'tr' ? 'istanbul rumları, rum toplumu, galata, fener, kültürel miras, tarihi fotoğraflar, osmanlı, azınlıklar' : l === 'el' ? 'Έλληνες Κωνσταντινούπολης, ρωμαίικη κοινότητα, Γαλατάς, Φανάρι, πολιτιστική κληρονομιά, ιστορικές φωτογραφίες, οθωμανική περίοδος, μειονότητες' : 'istanbul greeks, rum community, galata, phanar, cultural heritage, historical photographs, ottoman, minorities'}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "İstanbul Rumları Koleksiyonu",
                    "description": "A curated collection of artifacts, photographs, and documents chronicling the Istanbul Greek community's heritage.",
                    "url": `${PRODUCTION_SITE_ORIGIN}${localizePath('/arsiv/istanbul-rum')}`,
                    "about": {
                        "@type": "Thing",
                        "name": "Istanbul Greek Community",
                        "description": "The Greek Orthodox community of Istanbul (Constantinople), its history, culture, and institutions."
                    }
                }}
            />
            <Breadcrumbs items={[
                { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/arsiv' },
                { label: { tr: 'İstanbul Rumları', en: 'Istanbul Greeks', el: 'Έλληνες Κων/πολης' } },
            ]} />

            <div className="archive-rum__main">
                {/* ── Video Hero ── */}
                <section className="archive-rum__video-section">
                    <div className="archive-rum__video-container">
                        {!isPlaying ? (
                            <div className="archive-rum__custom-thumbnail" onClick={() => setIsPlaying(true)}>
                                <div 
                                    className="archive-rum__custom-thumbnail-img" 
                                    style={{ backgroundImage: `url(https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg)` }} 
                                />
                                <button className="archive-rum__custom-play-btn" aria-label="Play" title="Play">
                                    <svg viewBox="0 0 68 48" width="100%" height="100%">
                                        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f03"></path>
                                        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <iframe
                                className="archive-rum__video-iframe"
                                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&controls=0&showinfo=0&autoplay=1`}
                                title="Istanbul Greeks Archive"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                    <p className="archive-rum__caption">
                        {i18n.caption[l] || i18n.caption.en}
                    </p>
                </section>

                {/* ── Collection Section ── */}
                <section className="archive-rum__collection">
                    {/* Header + Tabs */}
                    <div className="archive-rum__header">
                        <div className="archive-rum__header-text">
                            <h1 className="archive-rum__title">
                                {i18n.title[l] || i18n.title.en}
                            </h1>
                            <p className="archive-rum__subtitle">
                                {i18n.subtitle[l] || i18n.subtitle.en}
                            </p>
                            <div style={{ marginTop: 'var(--space-3)' }}>
                                <Link
                                    to={localizePath('/arsiv/koleksiyon')}
                                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-brass-gold)' }}
                                >
                                    {l === 'tr' ? 'Galata Rum Okulu Koleksiyonunu İncele →' : l === 'el' ? 'Εξερευνήστε τη Συλλογή της Σχολής Γαλατά →' : 'Explore the Galata Greek School Collection →'}
                                </Link>
                            </div>
                        </div>
                        <div className="archive-rum__tabs">
                            {currentTabs.map((tab, i) => (
                                <button
                                    key={i}
                                    className={`archive-rum__tab ${i === activeTab ? 'archive-rum__tab--active' : ''}`}
                                    onClick={() => { setActiveTab(i); setActiveSubTab(0); }}
                                >
                                    <span>{tab}</span>
                                    {i === activeTab && (
                                        <motion.div
                                            layoutId="istanbulRumTabUnderline"
                                            className="archive-rum__tab-underline"
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sub-Tab Pills */}
                    <div className="archive-rum__pills">
                        {currentSubTabs.map((sub, i) => (
                            <motion.button
                                key={i}
                                whileHover={shouldReduceMotion ? {} : { y: -1 }}
                                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                                className={`archive-rum__pill ${i === activeSubTab ? 'archive-rum__pill--active' : ''}`}
                                onClick={() => setActiveSubTab(i)}
                            >
                                {sub}
                            </motion.button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && <div className="archive-rum__loading">{lang === 'tr' ? 'Koleksiyon yükleniyor…' : lang === 'el' ? 'Φόρτωση συλλογής…' : 'Loading Collection…'}</div>}

                    {/* Card Grid */}
                    <motion.div layout className="archive-rum__grid">
                        <AnimatePresence mode="popLayout">
                            {filteredArtifacts.slice(0, visibleCount).map((artifact, idx) => (
                                <motion.div
                                    key={artifact.id}
                                    layout
                                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                                    transition={{
                                        duration: 0.45,
                                        delay: shouldReduceMotion ? 0 : (idx % 9) * 0.04,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    whileHover={shouldReduceMotion ? {} : { y: -6 }}
                                >
                                    <Link
                                        to={localizePath(`/arsiv/eser/${artifact.id}`)}
                                        className="archive-rum__card"
                                    >
                                        <div className="archive-rum__card-image">
                                            <img
                                                className="archive-rum__card-img"
                                                src={artifact.imageSrc}
                                                alt={getTitle(artifact)}
                                                loading="lazy"
                                                decoding="async"
                                                width="400"
                                                height="300"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="archive-rum__card-title">{getTitle(artifact)}</h3>
                                            <div className="archive-rum__card-meta">
                                                <span className="archive-rum__card-category">
                                                    {categoryLabels[artifact.subCategory || artifact.category]?.[l] || artifact.category}
                                                </span>
                                                {artifact.date && (
                                                    <p className="archive-rum__card-date">{artifact.date}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    {visibleCount < filteredArtifacts.length && (
                        <div ref={observerTarget} className="archive-rum__observer"></div>
                    )}
                    <p
                        data-testid="archival-credit-notice"
                        style={{
                            marginTop: 'var(--space-10, 40px)',
                            paddingTop: 'var(--space-4, 16px)',
                            borderTop: '1px solid rgba(197, 160, 89, 0.2)',
                            fontSize: '0.8rem',
                            lineHeight: 1.6,
                            color: 'var(--color-inscription)',
                        }}
                    >
                        {getArchivalCreditNotice(l)}
                    </p>
                </section>
            </div>
        </div>
    );
}
