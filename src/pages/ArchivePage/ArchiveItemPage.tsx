import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import OpenSeadragon from 'openseadragon';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { getCuratedArtifactTranslation } from '../../services/dbSync';
import {
    resolveArtifactImage,
    isUnverifiedIllustrationArtifact,
    getArchivalCreditNotice,
    getUnverifiedArtifactBanner,
    UNVERIFIED_ILLUSTRATION_ARTIFACT_IDS,
} from '../../data/artifactImageMap';
import { submitArchiveStudyInquiry } from '../../services/formSubmissionService';
import { PRODUCTION_SITE_ORIGIN, VENUE_INFO } from '../../config/venueInfo';
import SEO from '../../components/SEO/SEO';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
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
    const [submitting, setSubmitting] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        institution: '',
        message: '',
        consentAccepted: false,
        honeypot: '',
    });

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
                const itemQuery = supabase.from('artifacts')
                    .select(`
                        *,
                        category:archive_categories(type_key, name_tr, name_en, name_el),
                        subcategory:archive_subcategories(key_name, name_tr, name_en, name_el)
                    `)
                    .eq('id', id);
                if (!UNVERIFIED_ILLUSTRATION_ARTIFACT_IDS.has(id)) {
                    itemQuery.eq('status', 'published');
                }

                const [itemRes, prevRes, nextRes] = await Promise.all([
                    itemQuery.maybeSingle(),
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
                    const curatedArt = getCuratedArtifactTranslation(item.id);
                    const mapped = {
                        ...item,
                        category: item.category?.type_key || 'documents',
                        subCategory: item.subcategory?.key_name || item.category?.type_key || 'documents',
                        imageSrc: resolveArtifactImage(item),
                        date: item.provenance_tr || '',
                        titleTr: item.title_tr,
                        title: curatedArt?.title_en || item.title_en,
                        titleEl: curatedArt?.title_el || item.title_el,
                        descriptionTr: item.description_tr,
                        description: curatedArt?.description_en || item.description_en,
                        descriptionEl: curatedArt?.description_el || item.description_el,
                        provenanceTr: item.provenance_tr,
                        provenance: curatedArt?.provenance_en || item.provenance_en,
                        provenanceEl: curatedArt?.provenance_el || item.provenance_el
                    };
                    setArtifact(mapped);
                    const prevCandidate = prevRes.data?.find(
                        (x: { id: string }) => !UNVERIFIED_ILLUSTRATION_ARTIFACT_IDS.has(x.id)
                    ) ?? null;
                    const nextCandidate = nextRes.data?.find(
                        (x: { id: string }) => !UNVERIFIED_ILLUSTRATION_ARTIFACT_IDS.has(x.id)
                    ) ?? null;
                    setPrevArtifact(prevCandidate);
                    setNextArtifact(nextCandidate);
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
                <div style={{ textAlign: 'center', padding: '200px 20px' }}>
                    {l === 'tr' ? 'Eser yükleniyor…' : l === 'el' ? 'Φόρτωση τεκμηρίου…' : 'Loading Artifact…'}
                </div>
            </div>
        );
    }

    if (!artifact) {
        return <NotFoundPage />;
    }

    const isUnverifiedIllustration = isUnverifiedIllustrationArtifact(artifact);
    const archivalCredit = getArchivalCreditNotice(l);
    const unverifiedBanner = getUnverifiedArtifactBanner(l);

    const title = l === 'tr' ? (artifact.titleTr || artifact.title) : l === 'el' ? (artifact.titleEl || artifact.title) : artifact.title;
    const desc = l === 'tr' ? (artifact.descriptionTr || artifact.description) : l === 'el' ? (artifact.descriptionEl || artifact.description) : artifact.description;
    const provenance = (l === 'tr' ? (artifact.provenanceTr || artifact.provenance) : l === 'el' ? (artifact.provenanceEl || artifact.provenance) : artifact.provenance) || '';
    const categoryDisplay =
        artifact.subcategory?.[`name_${l}`] ||
        artifact.category?.[`name_${l}`] ||
        artifact.subcategory?.name_en ||
        artifact.category?.name_en ||
        artifact.subCategory ||
        artifact.category ||
        '';

    const collectionMatch = provenance.match(/(?:No\.|Catalog|Κατάλογος|Αρ\.|Koleksiyon No\.)\s*([\w-]+)/i);
    const collectionNo = collectionMatch ? collectionMatch[1] : artifact.id.toUpperCase();

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setSubmitErrorMessage(null);

        const result = await submitArchiveStudyInquiry({
            artifactId: artifact.id,
            artifactTitle: title,
            collectionNo,
            fullName: formData.name,
            email: formData.email,
            institution: formData.institution,
            purpose: formData.message,
            consentAccepted: formData.consentAccepted,
            locale: l,
            honeypot: formData.honeypot,
        });

        setSubmitting(false);
        if (!result.ok || !result.persisted) {
            setSubmitErrorMessage(result.message[l]);
            return;
        }

        setSubmitted(true);
        setTimeout(() => {
            setShowInquiry(false);
            setSubmitted(false);
            setSubmitErrorMessage(null);
            setFormData({
                name: '',
                email: '',
                institution: '',
                message: '',
                consentAccepted: false,
                honeypot: '',
            });
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
                noindex={false}
                aiSchema={isUnverifiedIllustration ? undefined : {
                    "@context": "https://schema.org",
                    "@type": "CreativeWork",
                    "name": title,
                    "description": desc || '',
                    "url": `${PRODUCTION_SITE_ORIGIN}${localizePath(`/arsiv/eser/${artifact.id}`)}`,
                    "isAccessibleForFree": true,
                    "isPartOf": {
                        "@type": "ArchiveOrganization",
                        "name": l === 'tr'
                            ? `${VENUE_INFO.institutionName.tr} Arşivi`
                            : l === 'el'
                                ? `Αρχείο ${VENUE_INFO.institutionName.el}`
                                : `${VENUE_INFO.institutionName.en} Archive`
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
                    {isUnverifiedIllustration ? (
                        <div
                            role="alert"
                            data-testid="unverified-artifact-banner"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                minHeight: '360px',
                                padding: 'var(--space-10, 40px) var(--space-6, 24px)',
                                backgroundColor: 'var(--color-charcoal, #1A1A1A)',
                                color: 'var(--color-white, #FFFFFF)',
                                border: '1px solid rgba(197, 160, 89, 0.35)',
                            }}
                        >
                            <AlertTriangle size={36} style={{ color: 'var(--color-brass-gold, #C5A059)', marginBottom: '16px' }} aria-hidden="true" />
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-white, #FFFFFF)', marginBottom: '12px' }}>
                                {unverifiedBanner.title}
                            </h2>
                            <p style={{ maxWidth: '42rem', fontSize: '0.95rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
                                {unverifiedBanner.body}
                            </p>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}

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
                    {categoryDisplay.toUpperCase()} • {collectionNo}
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
                        <p className="archive-item__kunye-value">{provenance}</p>
                    </div>
                    <div className="archive-item__kunye-brand">
                        <span className="archive-item__kunye-logo">
                            {l === 'tr' ? 'KÜNYE' : l === 'el' ? 'ΤΑΥΤΟΤΗΤΑ' : 'IMPRINT'}
                        </span>
                        <div className="archive-item__kunye-dots">
                            <span className="archive-item__kunye-dot" />
                            <span className="archive-item__kunye-dot archive-item__kunye-dot--dim" />
                            <span className="archive-item__kunye-dot archive-item__kunye-dot--dim" />
                        </div>
                    </div>
                </div>
                <p
                    data-testid="archival-credit-notice"
                    style={{
                        maxWidth: 'var(--max-width)',
                        margin: '16px auto 0',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(197, 160, 89, 0.16)',
                        fontSize: '0.78rem',
                        lineHeight: 1.6,
                        color: 'var(--color-inscription)',
                    }}
                >
                    {archivalCredit}
                </p>
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
                                    {/* Hidden anti-bot honeypot */}
                                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                        <label htmlFor="inquiry-website">Website</label>
                                        <input
                                            id="inquiry-website"
                                            name="website"
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={formData.honeypot}
                                            onChange={e => setFormData(p => ({ ...p, honeypot: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <input
                                            id="inquiry-consent"
                                            name="consentAccepted"
                                            type="checkbox"
                                            required
                                            style={{ width: '16px', height: '16px', marginTop: '3px', accentColor: 'var(--color-brass-gold)' }}
                                            checked={formData.consentAccepted}
                                            onChange={e => setFormData(p => ({ ...p, consentAccepted: e.target.checked }))}
                                        />
                                        <label htmlFor="inquiry-consent" style={{ textTransform: 'none', letterSpacing: 'normal', fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                                            {l === 'tr'
                                                ? 'KVKK Aydınlatma Metni ve Gizlilik Politikası kapsamında iletişim bilgilerimin arşiv inceleme talebim için işlenmesini onaylıyorum. *'
                                                : l === 'el'
                                                    ? 'Συναινώ στην επεξεργασία των στοιχείων επικοινωνίας μου για το αίτημα αρχειακής μελέτης σύμφωνα με την Πολιτική Απορρήτου. *'
                                                    : 'I consent to the processing of my contact details for this archival study inquiry in accordance with the Privacy Policy. *'}
                                        </label>
                                    </div>
                                    {submitErrorMessage && (
                                        <div
                                            role="alert"
                                            data-testid="archive-inquiry-error"
                                            style={{
                                                padding: '12px 14px',
                                                borderLeft: '3px solid var(--color-error, #C0392B)',
                                                background: 'rgba(192, 57, 43, 0.12)',
                                                fontSize: '0.82rem',
                                                lineHeight: 1.55,
                                                color: 'var(--color-ink, #E8E6E1)',
                                            }}
                                        >
                                            <span>{submitErrorMessage}</span>{' '}
                                            <a
                                                href={`mailto:${VENUE_INFO.contact.email}?subject=${encodeURIComponent(`[${ui.formTitle}] ${title} (${collectionNo})`)}`}
                                                style={{ color: 'var(--color-brass-gold)', textDecoration: 'underline' }}
                                            >
                                                {VENUE_INFO.contact.email}
                                            </a>
                                        </div>
                                    )}
                                    <div className="inquiry-modal__actions">
                                        <button type="button" className="inquiry-modal__btn--cancel" onClick={() => setShowInquiry(false)}>
                                            {ui.cancel}
                                        </button>
                                        <button type="submit" className="inquiry-modal__btn--submit" disabled={submitting} aria-busy={submitting}>
                                            {submitting
                                                ? (l === 'tr' ? 'Gönderiliyor…' : l === 'el' ? 'Αποστολή…' : 'Sending…')
                                                : ui.send}
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
