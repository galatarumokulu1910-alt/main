import { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import './ArtifactCard.css';

/* ──────────────── Types ──────────────── */
export interface Artifact {
    id: string;
    title: string;
    titleTr?: string;
    titleEl?: string;
    date: string;
    category: 'books' | 'portraits' | 'documents' | 'objects';
    subCategory?: string;
    description: string;
    descriptionTr?: string;
    descriptionEl?: string;
    imageSrc: string;
    provenance?: string;
    provenanceTr?: string;
    provenanceEl?: string;
}

interface ArtifactCardProps {
    artifact: Artifact;
    /** All artifacts in the grid — passed so CuratorView can navigate */
    allArtifacts?: Artifact[];
}

/* ══════════════════════════════════════════════════════════════
   CURATOR VIEW — full-screen lightbox with pan & zoom
   ══════════════════════════════════════════════════════════════ */
interface CuratorViewProps {
    artifact: Artifact;
    allArtifacts: Artifact[];
    onClose: () => void;
    onNavigate: (artifact: Artifact) => void;
}

/* ── Shared multilingual labels ── */
const categoryLabelsI18n: Record<string, { tr: string; en: string; el: string }> = {
    books: { tr: 'Kitaplar', en: 'Books', el: 'Βιβλία' },
    portraits: { tr: 'Portreler', en: 'Portraits', el: 'Πορτρέτα' },
    documents: { tr: 'Belgeler', en: 'Documents', el: 'Έγγραφα' },
    objects: { tr: 'Objeler', en: 'Objects', el: 'Αντικείμενα' },
    atletik: { tr: 'Atletik Kupa', en: 'Athletic Trophy', el: 'Αθλητικό Τρόπαιο' },
    bina: { tr: 'Bina & Tabela', en: 'Building & Sign', el: 'Κτίριο & Πινακίδα' },
    egitim: { tr: 'Eğitim Aracı', en: 'Educational Tool', el: 'Εκπαιδευτικό Εργαλείο' },
    obje: { tr: 'Eski Obje', en: 'Old Object', el: 'Παλιό Αντικείμενο' },
    kisisel: { tr: 'Kişisel Eşya', en: 'Personal Item', el: 'Προσωπικό Αντικείμενο' },
    ogrenci: { tr: 'Öğrenci Eseri', en: 'Student Work', el: 'Μαθητικό Έργο' },
};

const uiStrings = {
    curatorView: { tr: 'Küratör Görünümü', en: 'Curator View', el: 'Προβολή Επιμελητή' },
    provenance: { tr: 'Kaynak:', en: 'Provenance:', el: 'Προέλευση:' },
    curatorHint: {
        tr: 'Yakınlaştırmak için kaydırın · Büyütmek için çift tıklayın · Sürükleyerek kaydırın',
        en: 'Scroll to zoom · Double-click to magnify · Drag to pan',
        el: 'Κύλιση για ζουμ · Διπλό κλικ για μεγέθυνση · Σύρετε για μετακίνηση'
    }
};

function CuratorView({ artifact, allArtifacts, onClose, onNavigate }: CuratorViewProps) {
    const { lang } = useI18n();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [lastPinchDist, setLastPinchDist] = useState<number | null>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Trap keyboard focus inside the modal
    useEffect(() => {
        const previousActiveElement = document.activeElement as HTMLElement | null;

        // Focus the first focusable element initially
        const focusableElements = containerRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusables = Array.from(
                containerRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ) || []
            ).filter((el) => {
                if (el instanceof HTMLButtonElement && el.disabled) return false;
                return true;
            }) as HTMLElement[];

            if (focusables.length === 0) return;

            const firstElement = focusables[0];
            const lastElement = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (previousActiveElement) {
                previousActiveElement.focus();
            }
        };
    }, [artifact.id]);

    const MIN_SCALE = 1;
    const MAX_SCALE = 4;

    const currentIndex = allArtifacts.findIndex(a => a.id === artifact.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allArtifacts.length - 1;

    const [prevArtifactId, setPrevArtifactId] = useState(artifact.id);
    if (artifact.id !== prevArtifactId) {
        setPrevArtifactId(artifact.id);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    if (hasPrev) onNavigate(allArtifacts[currentIndex - 1]);
                    break;
                case 'ArrowRight':
                    if (hasNext) onNavigate(allArtifacts[currentIndex + 1]);
                    break;
                case '+':
                case '=':
                    setScale(s => Math.min(s + 0.5, MAX_SCALE));
                    break;
                case '-':
                    setScale(s => Math.max(s - 0.5, MIN_SCALE));
                    break;
                case '0':
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, hasPrev, hasNext, currentIndex, allArtifacts, onNavigate]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    /* ── Zoom via mouse wheel ── */
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        setScale(s => {
            const newScale = Math.max(MIN_SCALE, Math.min(s + delta, MAX_SCALE));
            if (newScale === 1) setPosition({ x: 0, y: 0 });
            return newScale;
        });
    }, []);

    /* ── Double-click to toggle zoom ── */
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        if (scale > 1) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            // Zoom to 2.5x centered on click point
            const rect = imageContainerRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                setScale(2.5);
                setPosition({ x: -x * 1.5, y: -y * 1.5 });
            }
        }
    }, [scale]);

    /* ── Drag to pan ── */
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (scale <= 1) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }, [scale, position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    /* ── Touch: pinch-to-zoom + drag ── */
    const getTouchDist = (touches: React.TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            setLastPinchDist(getTouchDist(e.touches));
        } else if (e.touches.length === 1 && scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y,
            });
        }
    }, [scale, position]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2 && lastPinchDist !== null) {
            const newDist = getTouchDist(e.touches);
            const delta = (newDist - lastPinchDist) * 0.01;
            setScale(s => Math.max(MIN_SCALE, Math.min(s + delta, MAX_SCALE)));
            setLastPinchDist(newDist);
        } else if (e.touches.length === 1 && isDragging) {
            setPosition({
                x: e.touches[0].clientX - dragStart.x,
                y: e.touches[0].clientY - dragStart.y,
            });
        }
    }, [lastPinchDist, isDragging, dragStart]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        setLastPinchDist(null);
    }, []);

    const getCategoryLabel = (cat: string) => {
        const labels = categoryLabelsI18n[cat];
        return labels ? labels[lang] : cat;
    };

    const getTitle = (a: Artifact) => lang === 'tr' ? (a.titleTr || a.title) : lang === 'el' ? (a.titleEl || a.title) : a.title;
    const getDescription = (a: Artifact) => lang === 'tr' ? (a.descriptionTr || a.description) : lang === 'el' ? (a.descriptionEl || a.description) : a.description;
    const getProvenance = (a: Artifact) => lang === 'tr' ? (a.provenanceTr || a.provenance) : lang === 'el' ? (a.provenanceEl || a.provenance) : a.provenance;

    return (
        <div className="curator-overlay" onClick={onClose}>
            <div 
                ref={containerRef}
                className="curator-content" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={getTitle(artifact)}
            >

                {/* Close button */}
                <button className="curator-close" onClick={onClose} aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Navigation arrows */}
                {hasPrev && (
                    <button
                        className="curator-nav curator-nav--prev"
                        onClick={() => onNavigate(allArtifacts[currentIndex - 1])}
                        aria-label="Previous artifact"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15,18 9,12 15,6" />
                        </svg>
                    </button>
                )}
                {hasNext && (
                    <button
                        className="curator-nav curator-nav--next"
                        onClick={() => onNavigate(allArtifacts[currentIndex + 1])}
                        aria-label="Next artifact"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,6 15,12 9,18" />
                        </svg>
                    </button>
                )}

                {/* Image viewport */}
                <div
                    ref={imageContainerRef}
                    className={`curator-viewport ${isDragging ? 'curator-viewport--dragging' : ''} ${scale > 1 ? 'curator-viewport--zoomed' : ''}`}
                    onWheel={handleWheel}
                    onDoubleClick={handleDoubleClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <img
                        src={artifact.imageSrc}
                        alt={artifact.title}
                        className="curator-image"
                        draggable={false}
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        }}
                    />
                </div>

                {/* Zoom controls */}
                <div className="curator-zoom-controls">
                    <button
                        className="curator-zoom-btn"
                        onClick={() => setScale(s => Math.max(MIN_SCALE, s - 0.5))}
                        aria-label="Zoom out"
                        disabled={scale <= MIN_SCALE}
                    >
                        −
                    </button>
                    <span className="curator-zoom-level">{Math.round(scale * 100)}%</span>
                    <button
                        className="curator-zoom-btn"
                        onClick={() => setScale(s => Math.min(MAX_SCALE, s + 0.5))}
                        aria-label="Zoom in"
                        disabled={scale >= MAX_SCALE}
                    >
                        +
                    </button>
                    <button
                        className="curator-zoom-btn curator-zoom-btn--reset"
                        onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
                        aria-label="Reset zoom"
                    >
                        ⟳
                    </button>
                </div>

                {/* Metadata panel */}
                <div className="curator-meta">
                    <span className="curator-meta__category">
                        {getCategoryLabel(artifact.category)}
                    </span>
                    <h2 className="curator-meta__title">{getTitle(artifact)}</h2>
                    <p className="curator-meta__date">{artifact.date}</p>
                    <hr className="gold-divider" />
                    <p className="curator-meta__description">{getDescription(artifact)}</p>
                    {getProvenance(artifact) && (
                        <p className="curator-meta__provenance">
                            <span>{uiStrings.provenance[lang]}</span> {getProvenance(artifact)}
                        </p>
                    )}
                    <p className="curator-meta__hint">
                        {uiStrings.curatorHint[lang]}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   ARTIFACT CARD — the grid item
   ══════════════════════════════════════════════════════════════ */
export default function ArtifactCard({ artifact, allArtifacts = [] }: ArtifactCardProps) {
    const { lang } = useI18n();
    const [showCurator, setShowCurator] = useState(false);
    const [activeArtifact, setActiveArtifact] = useState(artifact);

    const getCategoryLabel = (cat: string) => {
        const labels = categoryLabelsI18n[cat];
        return labels ? labels[lang] : cat;
    };

    const getTitle = (a: Artifact) => lang === 'tr' ? (a.titleTr || a.title) : lang === 'el' ? (a.titleEl || a.title) : a.title;
    const getDescription = (a: Artifact) => lang === 'tr' ? (a.descriptionTr || a.description) : lang === 'el' ? (a.descriptionEl || a.description) : a.description;

    const categoryIcons: Record<string, string> = {
        books: '📖',
        portraits: '🖼️',
        documents: '📜',
        objects: '🏺',
        atletik: '🏆',
        bina: '🏛️',
        egitim: '📚',
        obje: '🔧',
        kisisel: '🎒',
        ogrenci: '✏️',
    };

    const handleCardClick = () => {
        setActiveArtifact(artifact);
        setShowCurator(true);
    };

    const handleNavigate = (newArtifact: Artifact) => {
        setActiveArtifact(newArtifact);
    };

    const effectiveArtifacts = allArtifacts.length > 0 ? allArtifacts : [artifact];

    return (
        <>
            <article
                className="artifact-card"
                onClick={handleCardClick}
                tabIndex={0}
                role="button"
                aria-label={`View ${artifact.title} in Curator View`}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }}
            >
                <div className="artifact-card__image-wrapper">
                    <img
                        src={artifact.imageSrc}
                        alt={artifact.title}
                        className="artifact-card__image"
                        loading="lazy"
                    />
                    <div className="artifact-card__overlay">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="16.5" y1="16.5" x2="21" y2="21" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        <span>{uiStrings.curatorView[lang]}</span>
                    </div>
                </div>

                <div className="artifact-card__content">
                    <div className="artifact-card__category">
                        <span className="artifact-card__category-icon">
                            {categoryIcons[artifact.subCategory || artifact.category]}
                        </span>
                        <span className="artifact-card__category-label">
                            {getCategoryLabel(artifact.subCategory || artifact.category)}
                        </span>
                    </div>
                    <h3 className="artifact-card__title">{getTitle(artifact)}</h3>
                    <p className="artifact-card__date">{artifact.date}</p>
                    <hr className="artifact-card__divider" />
                    <p className="artifact-card__description">{getDescription(artifact)}</p>
                </div>
            </article>

            {showCurator && (
                <CuratorView
                    artifact={activeArtifact}
                    allArtifacts={effectiveArtifacts}
                    onClose={() => setShowCurator(false)}
                    onNavigate={handleNavigate}
                />
            )}
        </>
    );
}
