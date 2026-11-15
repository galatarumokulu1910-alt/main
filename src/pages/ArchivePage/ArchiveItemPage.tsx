import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import OpenSeadragon from 'openseadragon';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { resolveArtifactImage } from '../../data/artifactImageMap';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './ArchiveItemPage.css';

type Lang = 'tr' | 'en' | 'el';

const uiLabels = {
    tr: {
        back: '← Koleksiyona Dön',
        inquire: 'İnceleme Talebi',
        download: 'Raporu İndir',
        source: 'Kaynak',
        collectionNo: 'Koleksiyon No.',
        date: 'Tarih',
        notFound: 'Eser bulunamadı',
        backToArchive: 'Arşive Dön',
        // Form labels
        formTitle: 'İnceleme Talebi',
        formSubtitle: 'Lütfen aşağıdaki formu doldurunuz',
        nameLabel: 'Ad Soyad',
        namePlaceholder: 'Adınız ve Soyadınız',
        emailLabel: 'E-posta',
        emailPlaceholder: 'ornek@email.com',
        institutionLabel: 'Kurum / Üniversite',
        institutionPlaceholder: 'Kurumunuz (isteğe bağlı)',
        messageLabel: 'İnceleme Amacı',
        messagePlaceholder: 'Bu eseri neden incelemek istediğinizi kısaca açıklayınız…',
        send: 'Talebi Gönder',
        cancel: 'İptal',
        successMsg: 'Talebiniz alınmıştır. En kısa sürede size dönüş yapılacaktır.',
    },
    en: {
        back: '← Back to Collection',
        inquire: 'Inquire for Study',
        download: 'Download Report',
        source: 'Source',
        collectionNo: 'Collection No.',
        date: 'Date',
        notFound: 'Artifact not found',
        backToArchive: 'Back to Archive',
        formTitle: 'Study Inquiry',
        formSubtitle: 'Please fill in the form below',
        nameLabel: 'Full Name',
        namePlaceholder: 'Your full name',
        emailLabel: 'Email',
        emailPlaceholder: 'example@email.com',
        institutionLabel: 'Institution / University',
        institutionPlaceholder: 'Your institution (optional)',
        messageLabel: 'Purpose of Study',
        messagePlaceholder: 'Briefly describe why you would like to study this artifact…',
        send: 'Submit Inquiry',
        cancel: 'Cancel',
        successMsg: 'Your inquiry has been received. We will get back to you shortly.',
    },
    el: {
        back: '← Πίσω στη Συλλογή',
        inquire: 'Αίτημα Μελέτης',
        download: 'Λήψη Αναφοράς',
        source: 'Πηγή',
        collectionNo: 'Αρ. Συλλογής',
        date: 'Ημερομηνία',
        notFound: 'Δεν βρέθηκε τεκμήριο',
        backToArchive: 'Πίσω στο Αρχείο',
        formTitle: 'Αίτημα Μελέτης',
        formSubtitle: 'Παρακαλούμε συμπληρώστε την παρακάτω φόρμα',
        nameLabel: 'Ονοματεπώνυμο',
        namePlaceholder: 'Το ονοματεπώνυμό σας',
        emailLabel: 'Email',
        emailPlaceholder: 'example@email.com',
        institutionLabel: 'Ίδρυμα / Πανεπιστήμιο',
        institutionPlaceholder: 'Το ίδρυμά σας (προαιρετικό)',
        messageLabel: 'Σκοπός Μελέτης',
        messagePlaceholder: 'Περιγράψτε εν συντομία γιατί θέλετε να μελετήσετε αυτό το τεκμήριο…',
        send: 'Υποβολή Αιτήματος',
        cancel: 'Ακύρωση',
        successMsg: 'Το αίτημά σας ελήφθη. Θα επικοινωνήσουμε μαζί σας σύντομα.',
    },
};

export default function ArchiveItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { lang, localizePath } = useI18n();
    const l = (lang as Lang) || 'en';
    const ui = uiLabels[l] || uiLabels.en;
    const shouldReduceMotion = useReducedMotion();

    const [showInquiry, setShowInquiry] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', institution: '', message: '' });

    const [artifact, setArtifact] = useState<any>(null);
    const [prevArtifact, setPrevArtifact] = useState<any>(null);
    const [nextArtifact, setNextArtifact] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [zoomRatio, setZoomRatio] = useState(1);
    const [osdReady, setOsdReady] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const osdContainerRef = useRef<HTMLDivElement>(null);
    const osdViewerRef = useRef<OpenSeadragon.Viewer | null>(null);

    useEffect(() => {
        const fetchArtifactDetails = async () => {
            if (!id) return;
            setLoading(true);
            setOsdReady(false);
            try {
                // Fetch current artifact and adjacent artifacts in parallel
                const [itemRes, prevRes, nextRes] = await Promise.all([
                    supabase.from('artifacts')
                        .select(`
                            *,
                            category:archive_categories(type_key),
                            subcategory:archive_subcategories(key_name)
                        `)
                        .eq('id', id)
                        .eq('status', 'published')
                        .maybeSingle(),
                    supabase.from('artifacts')
                        .select('id, title_en, title_tr, title_el')
                        .eq('status', 'published')
                        .lt('id', id)
                        .order('id', { ascending: false })
                        .limit(1),
                    supabase.from('artifacts')
                        .select('id, title_en, title_tr, title_el')
                        .eq('status', 'published')
                        .gt('id', id)
                        .order('id', { ascending: true })
                        .limit(1)
                ]);

                const item = itemRes.data;
                if (item) {
                    const mapped = {
                        ...item,
                        category: item.category?.type_key || 'documents',
                        subCategory: item.subcategory?.key_name || item.category?.type_key || 'documents',
                        imageSrc: resolveArtifactImage(item),
                        date: item.provenance_tr || '',
                        titleTr: item.title_tr,
                        title: item.title_en,
                        titleEl: item.title_el,
                        descriptionTr: item.description_tr,
                        description: item.description_en,
                        descriptionEl: item.description_el,
                        provenanceTr: item.provenance_tr,
                        provenance: item.provenance_en,
                        provenanceEl: item.provenance_el
                    };
                    setArtifact(mapped);
                    setPrevArtifact(prevRes.data && prevRes.data.length > 0 ? prevRes.data[0] : null);
                    setNextArtifact(nextRes.data && nextRes.data.length > 0 ? nextRes.data[0] : null);
                } else {
                    setArtifact(null);
                    setPrevArtifact(null);
                    setNextArtifact(null);
                }
            } catch (err) {
                console.error('Error fetching artifact details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtifactDetails();
    }, [id]);

    useEffect(() => {
        if (loading || !artifact?.imageSrc || !osdContainerRef.current) return;
        osdContainerRef.current.innerHTML = '';
        setZoomRatio(1);
        setOsdReady(false);

        const viewer = OpenSeadragon({
            element: osdContainerRef.current,
            tileSources: {
                type: 'image',
                url: artifact.imageSrc,
            },
            showNavigationControl: false,
            showNavigator: true,
            navigatorPosition: 'BOTTOM_LEFT',
            navigatorHeight: '84px',
            navigatorWidth: '112px',
            navigatorAutoFade: true,
            animationTime: shouldReduceMotion ? 0 : 0.7,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 5,
            minZoomImageRatio: 0.85,
            visibilityRatio: 0.85,
            zoomPerScroll: 1.25,
            zoomPerClick: 1.8,
            gestureSettingsMouse: {
                clickToZoom: false,
                dblClickToZoom: true,
                scrollToZoom: true,
            },
            gestureSettingsTouch: {
                pinchToZoom: true,
                dblClickToZoom: true,
            },
        });

        viewer.addHandler('open', () => {
            setOsdReady(true);
        });

        viewer.addHandler('open-failed', () => {
            setOsdReady(false);
        });

        viewer.addHandler('zoom', (event) => {
            if (event.zoom) {
                const homeZoom = viewer.viewport.getHomeZoom() || 1;
                setZoomRatio(Math.max(1, Number((event.zoom / homeZoom).toFixed(1))));
            }
        });

        osdViewerRef.current = viewer;

        return () => {
            viewer.destroy();
            osdViewerRef.current = null;
        };
    }, [loading, artifact?.imageSrc, shouldReduceMotion]);

    const handleZoomIn = () => {
        const v = osdViewerRef.current;
        if (!v) return;
        v.viewport.zoomBy(1.4);
        v.viewport.applyConstraints();
    };

    const handleZoomOut = () => {
        const v = osdViewerRef.current;
        if (!v) return;
        v.viewport.zoomBy(0.7);
        v.viewport.applyConstraints();
    };

    const handleResetView = () => {
        const v = osdViewerRef.current;
        if (!v) return;
        v.viewport.goHome();
        v.viewport.setRotation(0);
        setZoomRatio(1);
    };

    const handleRotate = () => {
        const v = osdViewerRef.current;
        if (!v) return;
        const nextRot = (v.viewport.getRotation() + 90) % 360;
        v.viewport.setRotation(nextRot);
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            imageContainerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        if (!showInquiry) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !submitted) {
                setShowInquiry(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showInquiry, submitted]);

    if (loading) {
        return (
            <div className="archive-item" style={{ position: 'relative' }}>
                <Breadcrumbs items={[
                    { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/arsiv' },
                    { label: { tr: 'Yükleniyor…', en: 'Loading…', el: 'Φόρτωση…' } },
                ]} />
                <div style={{ textAlign: 'center', padding: '200px 20px' }}>Loading Artifact…</div>
            </div>
        );
    }

    if (!artifact) {
        return (
            <div className="archive-item" style={{ position: 'relative' }}>
                <Breadcrumbs items={[
                    { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/arsiv' },
                    { label: { tr: 'Bulunamadı', en: 'Not Found', el: 'Δεν Βρέθηκε' } },
                ]} />
                <div style={{ textAlign: 'center', padding: '200px 20px' }}>
                    <h1>{ui.notFound}</h1>
                    <Link to={localizePath('/arsiv/koleksiyon')} style={{ marginTop: '20px', display: 'inline-block' }}>{ui.backToArchive}</Link>
                </div>
            </div>
        );
    }

    const title = l === 'tr' ? (artifact.titleTr || artifact.title) : l === 'el' ? (artifact.titleEl || artifact.title) : artifact.title;
    const desc = l === 'tr' ? (artifact.descriptionTr || artifact.description) : l === 'el' ? (artifact.descriptionEl || artifact.description) : artifact.description;
    const provenance = (l === 'tr' ? (artifact.provenanceTr || artifact.provenance) : l === 'el' ? (artifact.provenanceEl || artifact.provenance) : artifact.provenance) || '';

    const collectionMatch = provenance.match(/(?:No\.|Catalog|Κατάλογος|Αρ\.|Koleksiyon No\.)\s*([\w-]+)/i);
    const collectionNo = collectionMatch ? collectionMatch[1] : artifact.id.toUpperCase();

    const handleInquirySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production this would send to an API endpoint
        console.log('Inquiry submitted:', { artifact: artifact.id, ...formData });
        setSubmitted(true);
        setTimeout(() => {
            setShowInquiry(false);
            setSubmitted(false);
            setFormData({ name: '', email: '', institution: '', message: '' });
        }, 3000);
    };

    const isIstanbulRum = artifact.archive_type === 'istanbul_rum';
    const backUrl = isIstanbulRum ? '/arsiv/istanbul-rum' : '/arsiv/koleksiyon';
    const breadcrumbLabel = isIstanbulRum
        ? { tr: 'İstanbul Rumları', en: 'Istanbul Greeks', el: 'Έλληνες Κων/πολης' }
        : { tr: 'Koleksiyon', en: 'Collection', el: 'Συλλογή' };

    return (
        <div className="archive-item" style={{ position: 'relative' }}>
            <SEO 
                overrideTitle={title}
                overrideDescription={desc ? desc.substring(0, 160) : (l === 'tr' ? 'Galata Rum Okulu arşiv eseri detayları' : l === 'el' ? 'Λεπτομέρειες αρχειακού τεκμηρίου της Ελληνικής Σχολής Γαλατά' : 'Galata Greek School archive artifact details')}
                overrideKeywords={l === 'tr' ? `arşiv eseri, ${title}, galata rum okulu, tarihi eser, koleksiyon` : l === 'el' ? `αρχειακό τεκμήριο, ${title}, ελληνική σχολή γαλατά, ιστορικό αντικείμενο, συλλογή` : `archive artifact, ${title}, galata greek school, historical object, collection`}
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "CreativeWork",
                    "name": title,
                    "description": desc || '',
                    "url": `https://galatarumokulu.org.tr/arsiv/eser/${artifact.id}`,
                    "isAccessibleForFree": true,
                    "isPartOf": {
                        "@type": "ArchiveOrganization",
                        "name": "Galata Rum Okulu Vakfı - Kültür Merkezi Arşivi"
                    }
                }}
            />
            <Breadcrumbs items={[
                { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/arsiv' },
                { label: breadcrumbLabel, to: backUrl },
                { label: { tr: title, en: title, el: title } },
            ]} />

            {/* Back link */}
            <Link to={localizePath(backUrl)} className="archive-item__back">{ui.back}</Link>

            {/* Hero Image — OpenSeadragon Deep-Zoom Viewer */}
            <motion.section
                className="archive-item__hero"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="archive-item__hero-frame" ref={imageContainerRef}>
                    {/* Visible Fallback & SEO Image (shown immediately, fades once OpenSeadragon canvas opens) */}
                    {artifact.imageSrc && (
                        <img
                            src={artifact.imageSrc}
                            alt={title}
                            className={`archive-item__fallback-img ${osdReady ? 'archive-item__fallback-img--hidden' : ''}`}
                        />
                    )}

                    {/* OpenSeadragon Canvas Container */}
                    <div ref={osdContainerRef} className="archive-item__osd-canvas" />

                    {/* Deep-Zoom Controls Toolbar */}
                    <div className="archive-item__controls" style={{ zIndex: 10 }}>
                        <button className="archive-item__control-btn" title={l === 'tr' ? 'Yakınlaştır' : l === 'el' ? 'Μεγέθυνση' : 'Zoom In'} aria-label="Zoom In" onClick={handleZoomIn}>
                            <ZoomIn size={18} aria-hidden="true" />
                        </button>
                        <button className="archive-item__control-btn" title={l === 'tr' ? 'Uzaklaştır' : l === 'el' ? 'Σμίκρυνση' : 'Zoom Out'} aria-label="Zoom Out" onClick={handleZoomOut}>
                            <ZoomOut size={18} aria-hidden="true" />
                        </button>
                        <button className="archive-item__control-btn" title={l === 'tr' ? '90° Döndür' : l === 'el' ? 'Περιστροφή 90°' : 'Rotate 90°'} aria-label="Rotate" onClick={handleRotate}>
                            <RotateCw size={18} aria-hidden="true" />
                        </button>
                        <button className="archive-item__control-btn" title={l === 'tr' ? 'Görünümü Sıfırla' : l === 'el' ? 'Επαναφορά' : 'Reset View'} aria-label="Reset View" onClick={handleResetView}>
                            <RotateCcw size={18} aria-hidden="true" />
                        </button>
                        <button className="archive-item__control-btn" title={l === 'tr' ? 'Tam Ekran' : l === 'el' ? 'Πλήρης Οθόνη' : 'Fullscreen'} aria-label="Fullscreen" onClick={handleFullscreen}>
                            <Maximize2 size={18} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Bottom-right Zoom & Pan Status Pill */}
                    <div className="archive-item__viewer-status" aria-hidden="true">
                        <span className="archive-item__viewer-zoom">{zoomRatio.toFixed(1)}x</span>
                        <span className="archive-item__viewer-hint">
                            {l === 'tr'
                                ? 'Tekerlek: Yakınlaştır • Sürükle: Gezin'
                                : l === 'el'
                                    ? 'Ροδέλα: Ζουμ • Σύρετε: Μετακίνηση'
                                    : 'Scroll: Zoom • Drag: Pan'}
                        </span>
                    </div>

                    {prevArtifact && (
                        <button
                            className="archive-item__nav-arrow archive-item__nav-arrow--left"
                            onClick={() => navigate(localizePath(`/arsiv/eser/${prevArtifact.id}`))}
                            aria-label={l === 'tr' ? (prevArtifact.title_tr || prevArtifact.title_en) : l === 'el' ? (prevArtifact.title_el || prevArtifact.title_en) : prevArtifact.title_en}
                            title={l === 'tr' ? (prevArtifact.title_tr || prevArtifact.title_en) : l === 'el' ? (prevArtifact.title_el || prevArtifact.title_en) : prevArtifact.title_en}
                        ><ChevronLeft size={20} aria-hidden="true" /></button>
                    )}
                    {nextArtifact && (
                        <button
                            className="archive-item__nav-arrow archive-item__nav-arrow--right"
                            onClick={() => navigate(localizePath(`/arsiv/eser/${nextArtifact.id}`))}
                            aria-label={l === 'tr' ? (nextArtifact.title_tr || nextArtifact.title_en) : l === 'el' ? (nextArtifact.title_el || nextArtifact.title_en) : nextArtifact.title_en}
                            title={l === 'tr' ? (nextArtifact.title_tr || nextArtifact.title_en) : l === 'el' ? (nextArtifact.title_el || nextArtifact.title_en) : nextArtifact.title_en}
                        ><ChevronRight size={20} aria-hidden="true" /></button>
                    )}
                </div>
            </motion.section>

            {/* Content */}
            <motion.section
                className="archive-item__content"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="archive-item__category-tag">
                    {(artifact.subCategory || artifact.category).toUpperCase()} • {collectionNo}
                </span>
                <h1 className="archive-item__title">{title}</h1>
                <div className="archive-item__description">
                    <p>{desc}</p>
                </div>
                <div className="archive-item__actions">
                    <button
                        className="archive-item__btn archive-item__btn--primary"
                        onClick={() => setShowInquiry(true)}
                    >
                        {ui.inquire}
                    </button>
                    <button
                        className="archive-item__btn archive-item__btn--secondary"
                        onClick={() => window.print()}
                    >
                        {ui.download}
                    </button>
                </div>
            </motion.section>

            {/* KÜNYE Metadata Footer */}
            <footer className="archive-item__kunye">
                <div className="archive-item__kunye-inner">
                    <div className="archive-item__kunye-field">
                        <span className="archive-item__kunye-label">{ui.source}</span>
                        <p className="archive-item__kunye-value">{provenance.split(',')[0]}</p>
                    </div>
                    <div className="archive-item__kunye-field">
                        <span className="archive-item__kunye-label">{ui.collectionNo}</span>
                        <p className="archive-item__kunye-value">{collectionNo}</p>
                    </div>
                    <div className="archive-item__kunye-field">
                        <span className="archive-item__kunye-label">{ui.date}</span>
                        <p className="archive-item__kunye-value">{artifact.date}</p>
                    </div>
                    <div className="archive-item__kunye-brand">
                        <span className="archive-item__kunye-logo">KÜNYE</span>
                        <div className="archive-item__kunye-dots">
                            <span className="archive-item__kunye-dot" />
                            <span className="archive-item__kunye-dot archive-item__kunye-dot--dim" />
                            <span className="archive-item__kunye-dot archive-item__kunye-dot--dim" />
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── İnceleme Talebi Modal ── */}
            <AnimatePresence>
                {showInquiry && (
                    <motion.div
                        className="inquiry-modal__overlay"
                        onClick={() => !submitted && setShowInquiry(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="inquiry-modal"
                            onClick={e => e.stopPropagation()}
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                        {submitted ? (
                            <div className="inquiry-modal__success">
                                <div className="inquiry-modal__success-icon">✓</div>
                                <p>{ui.successMsg}</p>
                            </div>
                        ) : (
                            <>
                                <div className="inquiry-modal__header">
                                    <h2>{ui.formTitle}</h2>
                                    <p>{ui.formSubtitle}</p>
                                    <div className="inquiry-modal__artifact-ref">
                                        {title} — {collectionNo}
                                    </div>
                                </div>
                                <form onSubmit={handleInquirySubmit} className="inquiry-modal__form">
                                    <div className="inquiry-modal__field">
                                        <label htmlFor="inquiry-name">{ui.nameLabel} *</label>
                                        <input
                                            id="inquiry-name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            placeholder={ui.namePlaceholder}
                                            value={formData.name}
                                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field">
                                        <label htmlFor="inquiry-email">{ui.emailLabel} *</label>
                                        <input
                                            id="inquiry-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            spellCheck={false}
                                            required
                                            placeholder={ui.emailPlaceholder}
                                            value={formData.email}
                                            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field">
                                        <label htmlFor="inquiry-institution">{ui.institutionLabel}</label>
                                        <input
                                            id="inquiry-institution"
                                            name="organization"
                                            type="text"
                                            autoComplete="organization"
                                            placeholder={ui.institutionPlaceholder}
                                            value={formData.institution}
                                            onChange={e => setFormData(p => ({ ...p, institution: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field">
                                        <label htmlFor="inquiry-message">{ui.messageLabel} *</label>
                                        <textarea
                                            id="inquiry-message"
                                            name="message"
                                            required
                                            rows={4}
                                            placeholder={ui.messagePlaceholder}
                                            value={formData.message}
                                            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__actions">
                                        <button type="button" className="inquiry-modal__btn--cancel" onClick={() => setShowInquiry(false)}>
                                            {ui.cancel}
                                        </button>
                                        <button type="submit" className="inquiry-modal__btn--submit">
                                            {ui.send}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
