import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { supabase } from '../../services/supabaseClient';
import { resolveArtifactImage } from '../../data/artifactImageMap';
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
        messagePlaceholder: 'Bu eseri neden incelemek istediğinizi kısaca açıklayınız...',
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
        messagePlaceholder: 'Briefly describe why you would like to study this artifact...',
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
        messagePlaceholder: 'Περιγράψτε εν συντομία γιατί θέλετε να μελετήσετε αυτό το τεκμήριο...',
        send: 'Υποβολή Αιτήματος',
        cancel: 'Ακύρωση',
        successMsg: 'Το αίτημά σας ελήφθη. Θα επικοινωνήσουμε μαζί σας σύντομα.',
    },
};

export default function ArchiveItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { lang } = useI18n();
    const l = (lang as Lang) || 'en';
    const ui = uiLabels[l] || uiLabels.en;

    const [showInquiry, setShowInquiry] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', institution: '', message: '' });

    const [artifacts, setArtifacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchArtifacts = async () => {
            const { data } = await supabase.from('artifacts')
                .select(`
                    *,
                    category:archive_categories(type_key),
                    subcategory:archive_subcategories(key_name)
                `)
                .eq('status', 'published');

            if (data) {
                const mapped = data.map(item => ({
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
                }));
                setArtifacts(mapped);
            }
            setLoading(false);
        };
        fetchArtifacts();
    }, []);

    useEffect(() => {
        setZoom(1);
        setRotation(0);
    }, [id]);

    const handleZoom = () => {
        setZoom(z => z === 1 ? 1.5 : z === 1.5 ? 2 : 1);
    };

    const handleRotate = () => {
        setRotation(r => r + 90);
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

    const currentIndex = artifacts.findIndex(a => a.id === id);
    const artifact = currentIndex >= 0 ? artifacts[currentIndex] : undefined;
    const prevArtifact = currentIndex > 0 ? artifacts[currentIndex - 1] : null;
    const nextArtifact = currentIndex < artifacts.length - 1 ? artifacts[currentIndex + 1] : null;

    if (loading) {
        return (
            <div className="archive-item" style={{ position: 'relative' }}>
                <Breadcrumbs items={[
                    { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                    { label: { tr: 'Yükleniyor...', en: 'Loading...', el: 'Φόρτωση...' } },
                ]} />
                <div style={{ textAlign: 'center', padding: '200px 20px' }}>Loading Artifact...</div>
            </div>
        );
    }

    if (!artifact) {
        return (
            <div className="archive-item" style={{ position: 'relative' }}>
                <Breadcrumbs items={[
                    { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                    { label: { tr: 'Bulunamadı', en: 'Not Found', el: 'Δεν Βρέθηκε' } },
                ]} />
                <div style={{ textAlign: 'center', padding: '200px 20px' }}>
                    <h1>{ui.notFound}</h1>
                    <Link to="/archive/collection" style={{ marginTop: '20px', display: 'inline-block' }}>{ui.backToArchive}</Link>
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

    return (
        <div className="archive-item" style={{ position: 'relative' }}>
            <Breadcrumbs items={[
                { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                { label: { tr: 'Koleksiyon', en: 'Collection', el: 'Συλλογή' }, to: '/archive/collection' },
                { label: { tr: title, en: title, el: title } },
            ]} />

            {/* Back link */}
            <Link to="/archive/collection" className="archive-item__back">{ui.back}</Link>

            {/* Hero Image */}
            <section className="archive-item__hero">
                <div className="archive-item__hero-frame" ref={imageContainerRef} style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        className="archive-item__hero-img"
                        src={artifact.imageSrc}
                        alt={title}
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            transition: 'transform 0.3s ease',
                            transformOrigin: 'center center',
                            maxHeight: zoom > 1 ? 'none' : '100%',
                            maxWidth: zoom > 1 ? 'none' : '100%',
                        }}
                    />
                    <div className="archive-item__controls" style={{ zIndex: 10 }}>
                        <button className="archive-item__control-btn" title="Zoom" onClick={handleZoom}>🔍</button>
                        <button className="archive-item__control-btn" title="Rotate" onClick={handleRotate}>🔄</button>
                        <button className="archive-item__control-btn" title="Fullscreen" onClick={handleFullscreen}>⛶</button>
                    </div>
                    {prevArtifact && (
                        <button
                            className="archive-item__nav-arrow archive-item__nav-arrow--left"
                            onClick={() => navigate(`/archive/item/${prevArtifact.id}`)}
                            title={prevArtifact.title}
                        >◀</button>
                    )}
                    {nextArtifact && (
                        <button
                            className="archive-item__nav-arrow archive-item__nav-arrow--right"
                            onClick={() => navigate(`/archive/item/${nextArtifact.id}`)}
                            title={nextArtifact.title}
                        >▶</button>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="archive-item__content">
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
                    <button className="archive-item__btn archive-item__btn--secondary">{ui.download}</button>
                </div>
            </section>

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
            {showInquiry && (
                <div className="inquiry-modal__overlay" onClick={() => !submitted && setShowInquiry(false)}>
                    <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
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
                                        <label>{ui.nameLabel} *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={ui.namePlaceholder}
                                            value={formData.name}
                                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field">
                                        <label>{ui.emailLabel} *</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder={ui.emailPlaceholder}
                                            value={formData.email}
                                            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field">
                                        <label>{ui.institutionLabel}</label>
                                        <input
                                            type="text"
                                            placeholder={ui.institutionPlaceholder}
                                            value={formData.institution}
                                            onChange={e => setFormData(p => ({ ...p, institution: e.target.value }))}
                                        />
                                    </div>
                                    <div className="inquiry-modal__field">
                                        <label>{ui.messageLabel} *</label>
                                        <textarea
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
                    </div>
                </div>
            )}
        </div>
    );
}
